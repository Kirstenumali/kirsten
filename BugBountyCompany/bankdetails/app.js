const token=sessionStorage.getItem('work-token');
const $=s=>document.querySelector(s);
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let state;
async function api(path,body){
  const response=await fetch('/api/work-dashboard'+path,{method:body?'POST':'GET',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},...(body?{body:JSON.stringify(body)}:{})});
  const data=await response.json();if(!response.ok)throw new Error(data.error || 'Unable to connect.');return data;
}
async function load(){
  if(!token)throw new Error('Please sign in as admin from the owner dashboard.');
  state=await api('/state');
  if(state.role!=='admin')throw new Error('Only the owner can view bank details and transfer checklists.');
  $('#salary-reminder').textContent=state.salaryReminder?.message || '';
  render();
}
function render(){
  $('#people').innerHTML=state.workers.map((w,i)=>{
    const paid=state.payments.some(p=>p.workerId===w.id && p.month===$('#month').value);
    return `<article class="panel" id="worker-${esc(w.id)}"><p class="eyebrow">TEAM MEMBER ${i+1}</p><h2>${esc(w.name)}</h2><p class="muted">@${esc(w.username)}</p><button type="button" class="secondary" data-view="${esc(w.id)}" ${w.bankDetailsSaved?'':'disabled'} aria-expanded="false">${w.bankDetailsSaved?'View bank details →':'Bank details not submitted'}</button><div data-details="${esc(w.id)}" hidden></div><label class="payment-row"><input type="checkbox" data-pay="${esc(w.id)}" ${paid?'checked':''}> <span>Transferred · $13 USD<small class="muted">${esc($('#month').value)}${paid?' · User notified in dashboard':''}</small></span></label></article>`;
  }).join('') || '<p class="empty">No users have registered yet.</p>';
}
$('#month').value=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Dubai',year:'numeric',month:'2-digit'}).format(new Date());
$('#month').addEventListener('change',render);
$('#people').addEventListener('click',async e=>{
  const button=e.target.closest('[data-view]');if(!button)return;
  const box=document.querySelector(`[data-details="${button.dataset.view}"]`);
  if(!box.hidden){box.hidden=true;button.setAttribute('aria-expanded','false');return;}
  button.disabled=true;
  try{
    const result=await api('/bank-details?worker='+encodeURIComponent(button.dataset.view));
    const details=result.details;
    box.replaceChildren();
    const nameLabel=document.createElement('p');
    nameLabel.className='eyebrow';
    nameLabel.textContent='BANK ACCOUNT HOLDER FULL NAME';
    const holderName=document.createElement('strong');
    holderName.textContent=details.accountHolder || 'Not submitted yet';
    const information=document.createElement('p');
    information.className='prose';
    information.textContent=details.description || Object.entries(details).filter(([key])=>key!=='accountHolder').map(([key,value])=>key+': '+value).join('\n');
    box.append(nameLabel,holderName,information);
    if(!details.accountHolder){
      const reminder=document.createElement('p');
      reminder.className='small muted';
      reminder.textContent='The account holder name cannot be read from an IBAN. This user has a dashboard reminder to submit their full bank account name.';
      box.append(reminder);
    }
    box.className='prose submission';box.hidden=false;button.setAttribute('aria-expanded','true');$('#status').textContent='';
  }catch(error){$('#status').textContent=error.message;}finally{button.disabled=false;}
});
$('#people').addEventListener('change',async e=>{
  const checkbox=e.target.closest('[data-pay]');if(!checkbox)return;
  checkbox.disabled=true;
  try{await api('/payments',{workerId:checkbox.dataset.pay,month:$('#month').value,paid:checkbox.checked});await load();$('#status').textContent=checkbox.checked?'Transfer marked complete. The user will see a notification on their dashboard.':'Transfer confirmation removed.';}
  catch(error){checkbox.checked=!checkbox.checked;$('#status').textContent=error.message;}finally{checkbox.disabled=false;}
});
load().then(()=>{
  const id=new URLSearchParams(location.search).get('worker');
  if(id){const button=[...document.querySelectorAll('[data-view]')].find(b=>b.dataset.view===id);if(button&&!button.disabled){button.click();button.scrollIntoView({block:'center'});}}
}).catch(error=>{$('#people').replaceChildren();$('#status').textContent=error.message;});

setInterval(()=>load().catch(error=>{$('#status').textContent=error.message;}),60000);
