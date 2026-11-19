const token=sessionStorage.getItem('work-token');
const $=s=>document.querySelector(s), status=$('#status');
const escape=v=>String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function api(path,body){
 const response=await fetch('/api/work-dashboard'+path,{method:body?'POST':'GET',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},...(body?{body:JSON.stringify(body)}:{})});
 const data=await response.json();if(!response.ok){if(response.status===401){$('#requests').hidden=true;$('#requests').replaceChildren();$('#resign-form').hidden=true;}throw new Error(data.error || 'Request failed.');}return data;
}
async function load(){
 if(!token){status.textContent='Sign in to the team workspace to view resignation requests.';return;}
 const state=await api('/state'),admin=state.role==='admin';
 $('#heading').textContent=admin?'Resignation requests':'I am resigning';
 $('#requests').hidden=false;
 const date=v=>new Intl.DateTimeFormat(undefined,{timeZone:state.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,dateStyle:'medium',timeStyle:'short'}).format(new Date(v));
 $('#requests').innerHTML=state.resignations.map(r=>`<article class="panel"><h2>${escape(state.workers.find(w=>w.id===r.workerId)?.name || 'Former member')}</h2><p><strong>${escape(r.status)}</strong></p><p class="prose">${escape(r.reason || 'No reason provided.')}</p><p>Submitted: ${escape(date(r.createdAt))}</p><p>Review target: ${escape(date(r.reviewBy))}</p>${r.status==='Pending'?`<form data-decision="${escape(r.id)}"><input name="status" type="hidden" value="${admin?'Approved':'Withdrawn'}"><button>${admin?'Approve resignation':'Withdraw request'}</button></form>`:''}</article>`).join('') || '<p>No resignation requests.</p>';
 $('#resign-form').hidden=admin || state.resignations.some(r=>['Pending','Approved'].includes(r.status));
}
async function submit(event,path){
 event.preventDefault();const form=event.target,button=form.querySelector('button');button.disabled=true;status.textContent='';
 try{await api(path,Object.fromEntries(new FormData(form)));form.reset();await load();status.textContent='Resignation request updated.';}catch(error){status.textContent=error.message;}finally{button.disabled=false;}
}
$('#resign-form').addEventListener('submit',event=>submit(event,'/resignations'));
$('#requests').addEventListener('submit',event=>{if(event.target.dataset.decision)submit(event,'/resignations/'+encodeURIComponent(event.target.dataset.decision)+'/decision');});
load().catch(error=>{status.textContent=error.message;});
