const {api,escape,token}=Bounty;
const $=s=>document.querySelector(s),status=$('#status');
let state;
async function load(){
 if(!token){$('#signin').hidden=false;$('#signin-link').href=Bounty.signIn;status.textContent='Sign in to send or review requests.';return;}
 try{
  state=await api('/easybugs');$('#signin').hidden=true;$('#requests-section').hidden=false;
  $('#request-form').hidden=state.role!=='worker' || !state.available;
  $('#availability').textContent=state.available?'':'There is no team researcher yet.';
  $('#requests-heading').textContent=state.role==='worker'?'Your requests':'Researcher approval requests';
  $('#requests').innerHTML=state.requests.map(item=>`<article class="panel" style="margin:18px 0"><span class="badge">${escape(item.status)}</span><h3>${escape(item.workerName)}</h3><p class="task-meta">${escape(new Date(item.createdAt).toLocaleString())}</p><p class="prose">${escape(item.message)}</p>${item.reviewedAt?`<div class="submission"><strong>${escape(item.reviewerName)}</strong><p class="prose">${escape(item.feedback || 'Approved by the team researcher.')}</p><p class="task-meta">${escape(new Date(item.reviewedAt).toLocaleString())}</p></div>`:''}${state.role==='lead' && item.status==='Pending'?`<form data-review="${escape(item.id)}"><label>Decision<select name="status"><option>Approved</option><option>Changes requested</option></select></label><label>Feedback<textarea name="feedback" maxlength="2000" rows="3"></textarea></label><button>Save review</button></form>`:''}</article>`).join('') || '<p class="bounty-empty">No requests yet.</p>';
 }catch(error){$('#request-form').hidden=true;$('#requests-section').hidden=true;$('#requests').replaceChildren();$('#signin').hidden=false;$('#signin-link').href=Bounty.signIn;throw error;}
}
$('#request-form').addEventListener('submit',async event=>{
 event.preventDefault();const form=event.target,button=form.querySelector('button');button.disabled=true;status.textContent='';
 try{await api('/easybugs',Object.fromEntries(new FormData(form)));form.reset();await load();status.textContent='Your message was sent to the team researcher for approval.';}catch(error){status.textContent=error.message;}finally{button.disabled=false;}
});
$('#requests').addEventListener('submit',async event=>{
 event.preventDefault();const form=event.target,button=form.querySelector('button');button.disabled=true;status.textContent='';
 try{await api('/easybugs/'+encodeURIComponent(form.dataset.review)+'/review',Object.fromEntries(new FormData(form)));await load();status.textContent='Review saved.';}catch(error){status.textContent=error.message;}finally{button.disabled=false;}
});
$('#refresh').addEventListener('click',()=>load().then(()=>{status.textContent='Requests refreshed.';}).catch(error=>{status.textContent=error.message;}));
load().catch(error=>{status.textContent=error.message;});
