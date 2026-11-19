const {test}=require('node:test');
const assert=require('node:assert/strict');
const express=require('express');
const fetch=require('node-fetch');
test('lead registration, approval, private messages and separate sessions',async()=>{
 const data={workers:[{id:'worker-1',name:'Member'}],messages:[{workerId:'worker-1',content:'Help please',from:'User'}]};
 const app=express();app.use(express.json());require('./lead-cybersecurity')(app,{read:()=>data,save:()=>{}});
 const server=await new Promise(resolve=>{const s=app.listen(0,'127.0.0.1',()=>resolve(s));});
 const base='http://127.0.0.1:'+server.address().port+'/api/lead-cybersecurity';
 const request=async(path,body,token='')=>{const response=await fetch(base+path,{method:body?'POST':'GET',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},...(body?{body:JSON.stringify(body)}:{})});return {status:response.status,data:await response.json()};};
 try{
  const credentials={username:'lead',password:'lead-password'};
  assert.equal((await request('/state')).status,401);
  assert.equal((await request('/state',null,'worker-token')).status,401);
  assert.equal((await request('/register',{name:'Researcher',...credentials})).status,201);
  assert.equal(data.leads[0].approved,false);
  assert.notEqual(data.leads[0].passwordHash,credentials.password);
  assert.equal((await request('/register',{name:'Duplicate',...credentials})).status,409);
  assert.equal((await request('/login',{...credentials,password:'incorrect'})).status,401);
  assert.equal((await request('/login',credentials)).status,403);
  data.leads[0].approved=true;
  const login=await request('/login',credentials);assert.equal(login.status,200);const token=login.data.token;
  const state=await request('/state',null,token);assert.equal(state.status,200);assert.equal(state.data.messages[0].content,'Help please');assert.equal(state.data.workers[0].passwordHash,undefined);
  assert.equal((await request('/messages',{workerId:'missing',content:'Reply'},token)).status,400);
  assert.equal((await request('/messages',{workerId:'worker-1',content:'Reply'},token)).status,200);
  assert.equal(data.messages[1].from,'Lead Cybersecurity · Researcher');
  data.leads[0].approved=false;assert.equal((await request('/state',null,token)).status,401);data.leads[0].approved=true;
  await request('/logout',{},token);assert.equal((await request('/state',null,token)).status,401);
 }finally{await new Promise(resolve=>server.close(resolve));}
});
