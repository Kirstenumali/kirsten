const {escape,api,token}=Bounty;
const $=s=>document.querySelector(s),status=$('#room-status');
const statuses=['Not started','In progress','Submitted','Completed'];
let state;
function assignees(selected=''){
 const members=[...state.participants];
 if(selected && !members.some(p=>p.id===selected))members.push({id:selected,name:'Former team member'});
 return '<option value="">Unassigned</option>'+members.map(p=>`<option value="${escape(p.id)}"${p.id===selected?' selected':''}>${escape(p.name)}${p.role==='lead'?' · Team leader':''}</option>`).join('');
}
function render(){
 const open=new Set([...document.querySelectorAll('[data-status][open]')].map(el=>el.dataset.status));
 const admin=state.role==='admin',query=$('#room-search').value.toLowerCase().trim();
 const name=id=>state.participants.find(p=>p.id===id)?.name || (id?'Former team member':'Unassigned');
 const rooms=state.rooms.filter(r=>(r.title+' '+name(r.assigneeId)).toLowerCase().includes(query));
 $('#room-counts').innerHTML=statuses.map(s=>`<span>${escape(s)} <strong>${state.rooms.filter(r=>r.status===s).length}</strong></span>`).join('');
 $('#room-sections').innerHTML=statuses.map(s=>{
 const matches=rooms.filter(r=>r.status===s);
 return `<details class="panel bounty-section" data-status="${escape(s)}"${open.has(s) || (!document.querySelector('[data-status]') && s==='In progress')?' open':''}><summary>${escape(s)} · ${matches.length}</summary><div class="room-grid">${matches.map(r=>{
 const edit=admin || (r.assigneeId===state.userId && r.status!=='Completed');
 return `<article class="room-card"><p class="eyebrow">${escape(r.status)}</p><h3>${escape(r.title)}</h3><p class="muted">Researcher: ${escape(name(r.assigneeId))}</p><a href="${escape(r.programUrl)}" target="_blank" rel="noopener noreferrer">Open program ↗</a><p class="prose">${escape(r.notes || 'No brief added yet.')}</p><p class="task-meta">Updated ${escape(new Date(r.updatedAt).toLocaleString())}</p>${edit?`<details><summary>Update room</summary><form data-update="${escape(r.id)}">${admin?`<label>Researcher<select name="assigneeId">${assignees(r.assigneeId)}</select></label>`:''}<label>Status<select name="status">${statuses.filter(v=>admin || v!=='Completed').map(v=>`<option${v===r.status?' selected':''}>${escape(v)}</option>`).join('')}</select></label><label>Brief / notes<textarea name="notes" maxlength="4000" rows="4">${escape(r.notes)}</textarea></label><button>Save progress</button></form></details>`:''}<details><summary>Team notes · ${r.comments.length}</summary>${r.comments.map(c=>`<div class="submission"><strong>${escape(c.authorName)}</strong><p class="task-meta">${escape(new Date(c.createdAt).toLocaleString())}</p><p class="prose">${escape(c.content)}</p></div>`).join('') || '<p>No team notes yet.</p>'}<form data-comment="${escape(r.id)}"><label>Add a team note<textarea name="content" required maxlength="2000" rows="3"></textarea></label><button>Add note</button></form></details></article>`;
 }).join('') || '<p class="bounty-empty">No rooms in this section.</p>'}</div></details>`;
 }).join('');
}
async function load(){
 if(!token){$('#signin-prompt').hidden=false;$('#signin-link').href=Bounty.signIn;status.textContent='Sign in to see the team’s shared rooms.';return;}
 try{state=await api('/bounty-rooms');$('#board').hidden=false;$('#signin-prompt').hidden=true;$('#create-room').hidden=state.role!=='admin';$('#new-assignee').innerHTML=assignees();render();status.textContent='';}
 catch(error){status.textContent=error.message;$('#board').hidden=true;$('#signin-prompt').hidden=false;$('#signin-link').href=Bounty.signIn;throw error;}
}
$('#create-room-form').addEventListener('submit',async event=>{
 event.preventDefault();const form=event.target,button=form.querySelector('button');button.disabled=true;
 try{const room=await api('/bounty-rooms',Object.fromEntries(new FormData(form)));form.reset();$('#create-room').open=false;await load();status.textContent='Shared room created: '+room.title;const section=document.querySelector('[data-status="Not started"]');section.open=true;section.scrollIntoView({block:'start'});history.replaceState(null,'','/bigbountyrooms/'+Bounty.suffix);}
 catch(error){status.textContent=error.message;}finally{button.disabled=false;}
});
$('#room-sections').addEventListener('submit',async event=>{
 event.preventDefault();const form=event.target,button=form.querySelector('button');button.disabled=true;
 const route=form.dataset.update?'/bounty-rooms/'+encodeURIComponent(form.dataset.update):'/bounty-rooms/'+encodeURIComponent(form.dataset.comment)+'/comments';
 try{await api(route,Object.fromEntries(new FormData(form)));await load();status.textContent='Team room updated.';}
 catch(error){status.textContent=error.message;}finally{button.disabled=false;}
});
$('#room-search').addEventListener('input',()=>{if(state)render();});$('#refresh-rooms').addEventListener('click',async()=>{const button=$('#refresh-rooms');button.disabled=true;try{await load();status.textContent='Rooms refreshed.';}catch{}finally{button.disabled=false;}});
load().then(()=>{
 const params=new URLSearchParams(location.search);
 if(state?.role==='admin' && params.get('program') && params.get('url')){const form=$('#create-room-form');form.elements.title.value=params.get('program');form.elements.programUrl.value=params.get('url');$('#create-room').open=true;}
}).catch(()=>{});
