const crypto=require('crypto');
module.exports=(app,{base,read,save,adminOnly})=>{
 const clean=(v,n)=>typeof v==='string'?v.trim().slice(0,n):'';
 app.post(base+'/messages',(req,res)=>{
  const data=read(),admin=req.workSession.role==='admin',workerId=admin?clean(req.body.workerId,80):req.workSession.id,content=clean(req.body.content,4000);
  if(!admin && !(data.leads || []).some(lead=>lead.approved === true)) return res.status(409).json({error:'There is no team researcher yet.'});
  if(!content || !data.workers.some(w=>w.id===workerId))return res.status(400).json({error:'Choose a member and enter a message.'});
  (data.messages ||= []).push({id:crypto.randomUUID(),workerId,from:admin?'Team Lead Researcher':'User',content,createdAt:new Date().toISOString()});save(data);res.json({ok:true});
 });
 app.post(base+'/bounties',(req,res)=>{
  if(req.workSession.role==='admin')return res.status(403).json({error:'User account required.'});
  const company=clean(req.body.company,160),title=clean(req.body.title,200),reportUrl=clean(req.body.reportUrl,2000);
  try{if(!['http:','https:'].includes(new URL(reportUrl).protocol))throw Error();}catch{return res.status(400).json({error:'Enter an HTTP or HTTPS report link.'});}
  if(!company || !title)return res.status(400).json({error:'Enter company and report title.'});
  const data=read();(data.bounties ||= []).unshift({id:crypto.randomUUID(),workerId:req.workSession.id,company,title,reportUrl,status:'Submitted',createdAt:new Date().toISOString()});save(data);res.json({ok:true});
 });
 app.post(base+'/bounties/:id/review',adminOnly,(req,res)=>{
  const data=read(),item=(data.bounties || []).find(x=>x.id===req.params.id),status=req.body.status,reward=Number(req.body.reward);
  if(!item)return res.status(404).json({error:'Report not found.'});
  if(!['Approved','Paid'].includes(status) || !Number.isFinite(reward) || reward<=0 || reward>100000000)return res.status(400).json({error:'Enter a positive USD reward and valid status.'});
  if(item.status==='Paid' || (status==='Paid' && (item.status!=='Approved' || reward!==item.reward)))return res.status(409).json({error:'Approve the reward first; paid records cannot be changed.'});
  Object.assign(item,{status,reward,share:Math.round(reward*5)/100,sharePercent:5,updatedAt:new Date().toISOString()});save(data);res.json({ok:true});
 });
 app.post(base+'/resignations',(req,res)=>{
  if(req.workSession.role==='admin')return res.status(403).json({error:'User account required.'});
  const data=read();data.resignations ||= [];
  if(data.resignations.some(x=>x.workerId===req.workSession.id && ['Pending','Approved'].includes(x.status)))return res.status(409).json({error:'An active request already exists.'});
  data.resignations.unshift({id:crypto.randomUUID(),workerId:req.workSession.id,reason:clean(req.body.reason,2000),status:'Pending',createdAt:new Date().toISOString(),reviewBy:new Date(Date.now()+7*86400000).toISOString()});save(data);res.json({ok:true});
 });
 app.post(base+'/resignations/:id/decision',(req,res)=>{
  const data=read(),item=(data.resignations || []).find(x=>x.id===req.params.id),admin=req.workSession.role==='admin',status=req.body.status;
  if(!item)return res.status(404).json({error:'Request not found.'});
  if(admin?status!=='Approved':item.workerId!==req.workSession.id || status!=='Withdrawn')return res.status(403).json({error:'Decision not allowed.'});
  if(item.status!=='Pending')return res.status(409).json({error:'Request already resolved.'});
  item.status=status;item.updatedAt=new Date().toISOString();save(data);res.json({ok:true});
 });
};