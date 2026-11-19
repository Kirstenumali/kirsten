const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('fs'),os=require('os'),path=require('path');
const express=require('express'),fetch=require('node-fetch');
test('shared rooms enforce assignments, allow team notes, persist, and support lead sessions',async()=>{
 const directory=fs.mkdtempSync(path.join(os.tmpdir(),'bounty-rooms-'));
 const previousDir=process.env.WORK_DASHBOARD_DATA_DIR,previousPassword=process.env.WORK_DASHBOARD_ADMIN_PASSWORD;
 process.env.WORK_DASHBOARD_DATA_DIR=directory;process.env.WORK_DASHBOARD_ADMIN_PASSWORD='test-owner-password';
 const app=express();app.use(express.json());require('./work-dashboard')(app);
 const server=await new Promise(resolve=>{const s=app.listen(0,'127.0.0.1',()=>resolve(s));});
 const origin='http://127.0.0.1:'+server.address().port;
 async function request(route,token='',body,lead=false){const response=await fetch(origin+(lead?'/api/lead-cybersecurity':'/api/work-dashboard')+route,{method:body?'POST':'GET',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},...(body?{body:JSON.stringify(body)}:{})});return {status:response.status,data:await response.json()};}
 try{
  assert.equal((await request('/bounty-rooms')).status,401);
  const admin=(await request('/login','',{username:'admin',password:'test-owner-password'})).data.token;
  const alice=(await request('/register','',{name:'Alice',username:'alice',password:'worker-password'})).data.token;
  const bob=(await request('/register','',{name:'Bob',username:'bob',password:'worker-password'})).data.token;
  const aliceId=(await request('/state',alice)).data.userId;
  assert.equal((await request('/easybugs')).status,401);
  assert.equal((await request('/scope-helper')).status,401);
  assert.equal((await request('/easybugs',alice,{message:'Please review'})).status,409);
  assert.equal((await request('/bounty-rooms',bob,{title:'Nope',programUrl:'https://example.com/security'})).status,403);
  assert.equal((await request('/bounty-rooms',admin,{title:'Invalid',programUrl:'javascript:alert(1)'})).status,400);
  assert.equal((await request('/bounty-rooms',admin,{title:'Invalid assignee',programUrl:'https://example.com/security',assigneeId:'missing'})).status,400);
  const created=await request('/bounty-rooms',admin,{title:'Example program',programUrl:'https://example.com/security',assigneeId:aliceId,notes:'Initial brief'});
  assert.equal(created.status,201);const id=created.data.id;
  assert.equal((await request('/bounty-rooms',admin,{title:'Duplicate',programUrl:'https://example.com/security'})).status,409);
  const board=(await request('/bounty-rooms',bob)).data;assert.equal(board.rooms[0].title,'Example program');assert.equal(board.participants[0].passwordHash,undefined);
  assert.equal((await request('/bounty-rooms/'+id,bob,{status:'In progress'})).status,403);
  assert.equal((await request('/bounty-rooms/'+id,alice,{status:'In progress',notes:'Research started'})).status,200);
  assert.equal((await request('/bounty-rooms/'+id,alice,{status:'Completed'})).status,403);
  assert.equal((await request('/bounty-rooms/'+id,alice,{status:'Invalid'})).status,400);
  await request('/bounty-rooms/'+id,alice,{status:'Submitted',notes:'Ready for review'});
  await request('/bounty-rooms/'+id+'/comments',bob,{content:'Team note',authorName:'Spoofed owner'});
  assert.equal((await request('/bounty-rooms',admin)).data.rooms[0].comments[0].authorName,'Bob');
  const completed=await request('/bounty-rooms/'+id,admin,{status:'Completed',assigneeId:aliceId,notes:'Reviewed'});assert.equal(completed.status,200);
  assert.equal((await request('/bounty-rooms/'+id,alice,{status:'In progress'})).status,403);
  assert.equal(JSON.parse(fs.readFileSync(path.join(directory,'work.json'),'utf8')).bountyRooms[0].status,'Completed');
  await request('/register','',{name:'Lead',username:'researchlead',password:'research-password'},true);
  const leadId=(await request('/leads',admin)).data[0].id;await request('/leads/'+leadId+'/approve',admin,{});
  const lead=(await request('/login','',{username:'researchlead',password:'research-password'},true)).data.token;
  assert.equal((await request('/easybugs',alice,{message:'   '})).status,400);
  const approvalRequest=await request('/easybugs',alice,{message:'Can I research this bug?'});
  assert.equal(approvalRequest.status,201);const approvalId=approvalRequest.data.id;
  assert.equal((await request('/easybugs',bob)).data.requests.length,0);
  assert.equal((await request('/easybugs',admin)).data.requests[0].id,approvalId);
  assert.equal((await request('/easybugs',lead,undefined,true)).data.requests[0].id,approvalId);
  assert.equal((await request('/easybugs/'+approvalId+'/review',bob,{status:'Approved'})).status,403);
  assert.equal((await request('/easybugs/'+approvalId+'/review',admin,{status:'Approved'})).status,403);
  assert.equal((await request('/easybugs/'+approvalId+'/review',lead,{status:'Changes requested'},true)).status,400);
  assert.equal((await request('/easybugs/'+approvalId+'/review',lead,{status:'Approved',feedback:'Go ahead'},true)).status,200);
  assert.equal((await request('/easybugs',alice)).data.requests[0].feedback,'Go ahead');
  assert.equal((await request('/easybugs/'+approvalId+'/review',lead,{status:'Approved'},true)).status,409);
  assert.equal(JSON.parse(fs.readFileSync(path.join(directory,'work.json'),'utf8')).easyBugRequests[0].status,'Approved');
  assert.equal((await request('/bounty-rooms',lead,undefined,true)).data.rooms[0].id,id);
  assert.equal((await request('/bounty-rooms',lead,{title:'No',programUrl:'https://example.com'},true)).status,403);
  assert.equal((await request('/bounty-rooms',lead)).status,401);
  const leadRoom=await request('/bounty-rooms',admin,{title:'Lead assignment',programUrl:'https://example.com/lead',assigneeId:leadId});
  assert.equal((await request('/bounty-rooms/'+leadRoom.data.id,lead,{status:'In progress',notes:'Lead working'},true)).status,200);
  assert.equal((await request('/bounty-rooms/'+id+'/comments',lead,{content:'Lead note'},true)).status,201);
 }finally{
  await new Promise(resolve=>server.close(resolve));fs.rmSync(directory,{recursive:true,force:true});
  if(previousDir===undefined)delete process.env.WORK_DASHBOARD_DATA_DIR;else process.env.WORK_DASHBOARD_DATA_DIR=previousDir;
  if(previousPassword===undefined)delete process.env.WORK_DASHBOARD_ADMIN_PASSWORD;else process.env.WORK_DASHBOARD_ADMIN_PASSWORD=previousPassword;
 }
});
test('discovery feed validates URLs, deduplicates listings, caches results, and reports outages',async()=>{
 const app=express();let calls=0;
 require('./bounty-programs')(app,{fetchPrograms:async()=>{calls++;return {ok:true,json:async()=>({programs:[{name:'Example',url:'https://example.com/security',bounty:true,domains:['example.com']},{name:'Example',url:'https://example.com/security',bounty:true},{name:'Unsafe',url:'javascript:alert(1)'},{name:'Invalid'}]})};}});
 const server=await new Promise(resolve=>{const s=app.listen(0,'127.0.0.1',()=>resolve(s));});
 try{const url='http://127.0.0.1:'+server.address().port+'/api/bigbounty/programs';const result=await (await fetch(url)).json();assert.equal(result.programs.length,1);assert.equal(result.programs[0].bounty,true);await fetch(url);assert.equal(calls,1);}finally{await new Promise(resolve=>server.close(resolve));}
 const failed=express();require('./bounty-programs')(failed,{fetchPrograms:async()=>{throw Error('offline');}});
 const failedServer=await new Promise(resolve=>{const s=failed.listen(0,'127.0.0.1',()=>resolve(s));});
 try{const response=await fetch('http://127.0.0.1:'+failedServer.address().port+'/api/bigbounty/programs');assert.equal(response.status,502);assert.match((await response.json()).error,/unavailable/);}finally{await new Promise(resolve=>failedServer.close(resolve));}
});
