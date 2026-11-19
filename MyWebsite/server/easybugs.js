const crypto=require('crypto');
const clean=(v,n)=>typeof v==='string'?v.trim().slice(0,n):'';
module.exports=(app,base,{read,save,actor})=>{
 app.get(base+'/easybugs',(req,res)=>{
  const user=actor(req),data=read();
  res.json({role:user.role,available:(data.leads || []).some(lead=>lead.approved===true),requests:(data.easyBugRequests || []).filter(item=>user.role!=='worker' || item.workerId===user.id).map(item=>({...item,workerName:data.workers.find(w=>w.id===item.workerId)?.name || 'Former member'}))});
 });
 app.post(base+'/easybugs',(req,res)=>{
  const user=actor(req),data=read();
  if(user.role!=='worker' || !data.workers.some(w=>w.id===user.id))return res.status(403).json({error:'Only users can submit a request.'});
  if(!(data.leads || []).some(lead=>lead.approved===true))return res.status(409).json({error:'There is no team researcher yet.'});
  const message=clean(req.body.message,4000);
  if(!message)return res.status(400).json({error:'Type a message for the team researcher.'});
  data.easyBugRequests ||= [];
  if(data.easyBugRequests.filter(item=>item.workerId===user.id && item.status==='Pending').length>=10)return res.status(400).json({error:'You already have 10 requests waiting for review.'});
  const request={id:crypto.randomUUID(),workerId:user.id,message,status:'Pending',feedback:'',createdAt:new Date().toISOString()};
  data.easyBugRequests.unshift(request);save(data);res.status(201).json(request);
 });
 app.post(base+'/easybugs/:id/review',(req,res)=>{
  const user=actor(req);if(user.role!=='lead')return res.status(403).json({error:'Only an approved team researcher can review requests.'});
  const data=read(),item=(data.easyBugRequests || []).find(item=>item.id===req.params.id);
  if(!item)return res.status(404).json({error:'Request not found.'});
  if(item.status!=='Pending')return res.status(409).json({error:'This request has already been reviewed.'});
  const status=req.body.status,feedback=clean(req.body.feedback,2000);
  if(!['Approved','Changes requested'].includes(status))return res.status(400).json({error:'Choose an approval decision.'});
  if(status==='Changes requested' && !feedback)return res.status(400).json({error:'Explain what needs to change.'});
  Object.assign(item,{status,feedback,reviewerId:user.id,reviewerName:(data.leads || []).find(lead=>lead.id===user.id)?.name || 'Team researcher',reviewedAt:new Date().toISOString()});save(data);res.json({ok:true});
 });
};
