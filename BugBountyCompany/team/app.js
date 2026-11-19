const token = sessionStorage.getItem('work-token');
const status = document.querySelector('#status');
const list = document.querySelector('#worker-list');
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function api(path, body) {
  const response = await fetch('/api/work-dashboard' + path, {method: body ? 'POST' : 'GET', headers: {'Content-Type':'application/json', Authorization:'Bearer ' + token}, ...(body ? {body:JSON.stringify(body)} : {})});
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Unable to load the team.');
  return data;
}
async function load() {
  document.querySelector('#team-panel').hidden = true;
  list.replaceChildren();
  if (!token) { status.textContent = 'Sign in as admin to view the team.'; return; }
  const state = await api('/state');
  if (state.role !== 'admin') { status.textContent = 'Only the admin can view the team.'; return; }
  const workers = [...state.workers].sort((a,b) => {
    const priority = worker => worker.username === 'carperwiske' ? 0 : /cybersecurity engineer/i.test(worker.jobTitle || '') ? 1 : 2;
    return priority(a) - priority(b);
  });
  await loadLeads();
  list.innerHTML = workers.map((w,index)=>`<div class="worker-row"><span class="team-number">${index+2}</span> <strong>${escape(w.name)}${w.jobTitle ? ' · '+escape(w.jobTitle) : ''}</strong> · @${escape(w.username)} <a href="/bankdetails/?worker=${encodeURIComponent(w.id)}">View bank details →</a><p><strong>Local time:</strong> <span data-worker-timezone="${escape(w.timeZone || '')}"></span></p><p>${escape(w.onboarding.status)}${w.onboarding.workEmail?' · '+escape(w.onboarding.workEmail):''}</p>${w.onboarding.status === 'Pending review'?`<button type="button" class="secondary" data-document="${escape(w.id)}">Download document</button><form data-verification="${escape(w.id)}"><label>Feedback<input name="feedback" maxlength="1000"></label><label>Decision<select name="status"><option>Approved</option><option>Changes requested</option></select></label><button>Save identity review</button></form>`:''}</div>`).join('');
  for (let index=workers.length; index<5; index++) list.insertAdjacentHTML('beforeend', `<div class="worker-row muted"><span class="team-number">${index+2}</span> Available place</div>`);
  updateWorkerClocks();
  document.querySelector('#team-panel').hidden = false;
}
list.addEventListener('submit', async event => {
  event.preventDefault();
  const button = event.target.querySelector('button'); button.disabled = true;
  try { await api('/workers/'+event.target.dataset.verification+'/verification',Object.fromEntries(new FormData(event.target))); await load(); status.textContent='Identity review saved. The uploaded document has been deleted.'; }
  catch(error) { status.textContent=error.message; }
  finally { button.disabled=false; }
});
list.addEventListener('click', async event => {
  const button = event.target.closest('[data-document]'); if (!button) return;
  button.disabled=true;
  try {
    const response=await fetch('/api/work-dashboard/workers/'+encodeURIComponent(button.dataset.document)+'/document',{headers:{Authorization:'Bearer '+token}});
    if(!response.ok) throw new Error('Unable to download document.');
    const url=URL.createObjectURL(await response.blob()); const link=document.createElement('a'); link.href=url; link.download='identity-document'; link.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
  } catch(error) { status.textContent=error.message; } finally { button.disabled=false; }
});
window.addEventListener('bank-details-updated',()=>load().catch(error=>{status.textContent=error.message;}));
load().catch(error=>{status.textContent=error.message;});

async function loadLeads(){
  const leads=await api('/leads');
  document.querySelector('#lead-accounts').innerHTML=leads.map(l=>`<div class="worker-row"><strong>${escape(l.name)}</strong> · @${escape(l.username)} · ${l.approved?'Approved':`Pending approval <button type="button" data-approve-lead="${escape(l.id)}">Approve lead</button>`}</div>`).join('') || '<p class="muted">Team leader position · no lead account registered yet.</p>';
}
document.querySelector('#lead-accounts').addEventListener('click',async event=>{
  const button=event.target.closest('[data-approve-lead]');if(!button)return;button.disabled=true;
  try{await api('/leads/'+encodeURIComponent(button.dataset.approveLead)+'/approve',{});await loadLeads();status.textContent='Lead account approved.';}catch(error){status.textContent=error.message;button.disabled=false;}
});


function updateWorkerClocks() {
  for (const clock of list.querySelectorAll('[data-worker-timezone]')) {
    const zone = clock.dataset.workerTimezone;
    if (!zone) { clock.textContent = 'Timezone not set up yet'; continue; }
    try {
      clock.textContent = new Intl.DateTimeFormat(undefined, {timeZone: zone, hour: '2-digit', minute: '2-digit', hour12: true}).format(new Date());
    } catch { clock.textContent = 'Timezone needs updating'; }
  }
}
setInterval(updateWorkerClocks, 10000);