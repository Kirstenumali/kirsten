const {test}=require('node:test');
const assert=require('node:assert/strict');
const express=require('express'),fetch=require('node-fetch');
const mount=require('./scope-helper');
async function start(options){const app=express();app.use(express.json());mount(app,'/test',{actor:()=>({id:'worker-1'}),...options});const server=await new Promise(resolve=>{const s=app.listen(0,'127.0.0.1',()=>resolve(s));});return {server,url:'http://127.0.0.1:'+server.address().port+'/test/scope-helper'};}
const request=async(url,input)=>{const body=typeof input==='string'?{scope:input}:input;const response=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});return {status:response.status,data:await response.json()};};
test('local scope checklist separates exclusions, suggests relevant reviews, and never calls AI',async()=>{
 let calls=0;const {server,url}=await start({key:()=>'',fetchAI:async()=>{calls++;throw Error('Should not call');}});
 try{
  assert.equal((await request(url,'short')).status,400);
  assert.equal((await request(url,'x'.repeat(20001))).status,400);
  const result=await request(url,'In scope:\nhttps://api.example.com REST API and login\nOut of scope:\nhttps://excluded.example.com\nRules:\nUse test accounts only.');
  assert.equal(result.status,200);assert.equal(result.data.mode,'local');assert.equal(calls,0);
  assert.equal(result.data.assets.find(a=>a.asset==='https://api.example.com').classification,'Listed in scope');
  assert.equal(result.data.assets.find(a=>a.asset==='https://excluded.example.com').classification,'Excluded / restricted');
  assert.ok(result.data.suggestions.some(s=>s.title.includes('API')));
  assert.ok(result.data.suggestions.some(s=>s.title.includes('session')));
  assert.match(result.data.readiness,/Draft incomplete/);
  assert.ok(result.data.guidance.some(item=>item.includes('not opened')));
  const manyLinks=Array.from({length:12},(_,i)=>`https://example.com/program-${i+1}`);
  const complete=await request(url,{
   scope:'In scope:\nhttps://api.example.com\nOut of scope:\nhttps://excluded.example.com',
   scopeLinks:manyLinks.join('\n'),
   focusArea:'Account access',
   programRules:'Use test accounts only.',
   eligibility:'Only listed API assets are eligible.',
   disclosureGuidelines:'Report through the coordinated disclosure portal.'
  });
  assert.equal(complete.status,200);assert.match(complete.data.readiness,/All requested program sections are included/);
  assert.deepEqual(complete.data.referenceLinks,manyLinks);
  assert.equal((await request(url,{scope:'x'.repeat(20001)})).status,400);
  const tooManyLinks=await request(url,{
   scope:'In scope: valid api.example.com, which is long enough',
   scopeLinks:Array.from({length:51},(_,i)=>`https://example.com/${i}`).join('\n')
  });
  assert.equal(tooManyLinks.status,400);
  assert.match(tooManyLinks.data.error,/maximum 50 URLs/);
 }finally{await new Promise(resolve=>server.close(resolve));}
});
test('AI scope review validates output, limits requests, and keeps provider errors private',async()=>{
 let sent;
 const {server,url}=await start({key:()=> 'test-provider-key',fetchAI:async(target,options)=>{
  assert.equal(target,'https://openrouter.ai/api/v1/chat/completions');sent=JSON.parse(options.body);
  return {ok:true,json:async()=>({choices:[{message:{content:JSON.stringify({summary:'Review the API scope.',guidance:['Confirm the written rules first.'],assets:[{asset:'api.example.com',classification:'In scope'}],tools:[{tool:'Burp Suite Community',steps:['Compare intended account roles.'],output:'A request record.'}],questions:['Which roles are eligible?']})}}]})};
 }});
 try{
  assert.equal((await (await fetch(url)).json()).mode,'ai');
  const links=Array.from({length:12},(_,i)=>`https://example.com/program-${i+1}`);
  const input={
   scope:'In scope: api.example.com. Out of scope: other.example.com.',
   scopeLinks:links.join('\n'),
   focusArea:'Account permissions',
   programRules:'Use only test accounts.',
   eligibility:'The API host is eligible.',
   disclosureGuidelines:'Use coordinated disclosure.'
  };
  const result=await request(url,input);assert.equal(result.status,200);assert.equal(result.data.mode,'ai');assert.equal(result.data.tools[0].tool,'Burp Suite Community');assert.equal(result.data.summary,'Review the API scope.');assert.equal(result.data.guidance[0],'Confirm the written rules first.');assert.deepEqual(result.data.referenceLinks,links);assert.ok(sent.messages[1].content.includes(input.scope));assert.ok(sent.messages[1].content.includes(input.programRules));assert.ok(sent.messages[1].content.includes(input.eligibility));assert.ok(sent.messages[1].content.includes(input.disclosureGuidelines));assert.ok(sent.messages[1].content.includes(links[11]));assert.ok(sent.messages[0].content.includes('Do not open or fetch links'));assert.ok(sent.messages[0].content.includes('untrusted'));
  for(let i=0;i<9;i++)assert.equal((await request(url,input)).status,200);
  assert.equal((await request(url,input)).status,429);
 }finally{await new Promise(resolve=>server.close(resolve));}
 const failed=await start({key:()=> 'secret-key',fetchAI:async()=>{throw Error('secret-key provider details');}});
 try{const result=await request(failed.url,'In scope: api.example.com with test accounts only.');assert.equal(result.status,502);assert.equal(JSON.stringify(result.data).includes('secret-key'),false);}finally{await new Promise(resolve=>failed.server.close(resolve));}
});

test('tool workflows match smart-contract and network focus areas',()=>{
 const workflow=require('./scope-tools');
 const contracts=workflow('In scope: 1inch smart contracts, Solidity limit-order protocol. Focus Area: reentrancy and logic errors.','Order settlement');
 assert.equal(contracts[0].tool,'Git + VS Code');assert.ok(contracts.some(t=>t.tool.includes('Foundry')));assert.ok(contracts.some(t=>t.tool==='Slither'));assert.equal(contracts.some(t=>t.tool==='Wireshark'),false);
 assert.ok(contracts[0].steps.some(step=>step.includes('Order settlement')));
 assert.ok(contracts.every(tool=>Array.isArray(tool.steps) && tool.steps.length>=2 && tool.output));
 const network=workflow('In scope: network protocol packet analysis with authorized test traffic.');assert.equal(network[0].tool,'Wireshark');
 const solana=workflow('In scope: Solana smart contracts written in Rust.');assert.ok(solana.some(t=>t.tool.includes('Cargo')));assert.equal(solana.some(t=>t.tool==='Slither'),false);
});