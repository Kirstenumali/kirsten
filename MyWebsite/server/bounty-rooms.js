const crypto = require('crypto');
const {activeWorkers} = require('./team-notifications');
const statuses = ['Not started','In progress','Submitted','Completed'];
const clean = (value,max) => typeof value === 'string' ? value.trim().slice(0,max) : '';
const safeUrl = value => {try {const url=new URL(value);return ['https:','http:'].includes(url.protocol) && !url.username && !url.password ? url.href : '';} catch{return '';}};
const participants = data => [...activeWorkers(data).map(w=>({id:w.id,name:w.name,role:'worker'})),...(data.leads || []).filter(l=>l.approved).map(l=>({id:l.id,name:l.name,role:'lead'}))];
module.exports = (app,base,{read,save,actor}) => {
  app.get(base+'/bounty-rooms',(req,res)=>{
    const user=actor(req),data=read();
    res.json({role:user.role,userId:user.id,participants:participants(data),rooms:data.bountyRooms || []});
  });
  app.post(base+'/bounty-rooms',(req,res)=>{
    const user=actor(req);if(user.role!=='admin')return res.status(403).json({error:'Only admins can create and assign rooms.'});
    const data=read(),title=clean(req.body.title,160),programUrl=safeUrl(clean(req.body.programUrl,2000)),assigneeId=clean(req.body.assigneeId,80);
    if(!title || !programUrl)return res.status(400).json({error:'Enter a program name and a valid HTTP or HTTPS program link.'});
    if(assigneeId && !participants(data).some(p=>p.id===assigneeId))return res.status(400).json({error:'Choose an active team member.'});
    data.bountyRooms ||= [];
    if(data.bountyRooms.length>=200)return res.status(400).json({error:'The team board has reached its 200-room limit.'});
    if(data.bountyRooms.some(r=>r.programUrl===programUrl && r.status!=='Completed'))return res.status(409).json({error:'This program already has an active team room.'});
    const room={id:crypto.randomUUID(),title,programUrl,assigneeId,status:'Not started',notes:clean(req.body.notes,4000),comments:[],createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};
    data.bountyRooms.unshift(room);save(data);res.status(201).json(room);
  });
  app.post(base+'/bounty-rooms/:id',(req,res)=>{
    const user=actor(req),data=read(),room=(data.bountyRooms || []).find(r=>r.id===req.params.id);
    if(!room)return res.status(404).json({error:'Room not found.'});
    const admin=user.role==='admin';
    if(!admin && room.assigneeId!==user.id)return res.status(403).json({error:'Only the assigned researcher or admin can update this room.'});
    const status=req.body.status;
    if(!statuses.includes(status))return res.status(400).json({error:'Choose a valid room status.'});
    if(!admin && (!['Not started','In progress','Submitted'].includes(status) || room.status==='Completed'))return res.status(403).json({error:'Only admins can complete or reopen rooms.'});
    const assigneeId=admin?clean(req.body.assigneeId,80):room.assigneeId;
    if(assigneeId && !participants(data).some(p=>p.id===assigneeId))return res.status(400).json({error:'Choose an active team member.'});
    Object.assign(room,{status,assigneeId,notes:clean(req.body.notes,4000),updatedAt:new Date().toISOString()});save(data);res.json(room);
  });
  app.post(base+'/bounty-rooms/:id/comments',(req,res)=>{
    const user=actor(req),data=read(),room=(data.bountyRooms || []).find(r=>r.id===req.params.id),content=clean(req.body.content,2000);
    if(!room)return res.status(404).json({error:'Room not found.'});
    if(!content)return res.status(400).json({error:'Enter a note for your team.'});
    if(room.comments.length>=200)return res.status(400).json({error:'This room has reached its 200-note limit.'});
    const authorName=user.role==='admin'?'Team owner':participants(data).find(p=>p.id===user.id)?.name || 'Team member';
    room.comments.push({id:crypto.randomUUID(),authorId:user.id,authorName,content,createdAt:new Date().toISOString()});room.updatedAt=new Date().toISOString();save(data);res.status(201).json({ok:true});
  });
};
