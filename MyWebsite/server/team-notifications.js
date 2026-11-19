const crypto = require('crypto');
const activeWorkers = data => (data.workers || []).filter(worker => !(data.resignations || []).some(item => item.workerId === worker.id && item.status === 'Approved'));
const members = data => [...activeWorkers(data).map(w=>({id:w.id,name:w.name,role:'member'})),...(data.leads || []).filter(l=>l.approved === true).map(l=>({id:l.id,name:l.name,role:'team researcher'}))];
function recordChanges(previous,data) {
 const before=members(previous), after=members(data), changes=[];
 for(const member of after) if(!before.some(item=>item.id===member.id)) changes.push({type:'joined',message:member.name+' joined the team as a '+member.role+'.'});
 for(const member of before) if(!after.some(item=>item.id===member.id)) changes.push({type:'available',message:member.name+' left the team. A '+member.role+' place is now available.'});
 if(changes.length) data.teamNotifications=[...changes.map(item=>({...item,id:crypto.randomUUID(),createdAt:new Date().toISOString()})),...(data.teamNotifications || [])].slice(0,100);
}
module.exports={activeWorkers,recordChanges};
