let token=sessionStorage.getItem('lead-token') || '';
const $=s=>document.querySelector(s), status=$('#status');
const escape=v=>String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function api(path,body){
  const response=await fetch('/api/lead-cybersecurity'+path,{method:body?'POST':'GET',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},...(body?{body:JSON.stringify(body)}:{})});
  const data=await response.json();
  if(!response.ok){if(response.status===401){token='';sessionStorage.removeItem('lead-token');$('#portal').hidden=true;$('#messages').replaceChildren();$('#auth').hidden=false;}throw new Error(data.error || 'Request failed.');}return data;
}
async function load(){
  const data=await api('/state');$('#auth').hidden=true;$('#portal').hidden=false;$('#greeting').textContent='Welcome, '+data.name;
  $('#members').innerHTML='<option value="">Choose a member</option>'+data.workers.map(w=>`<option value="${escape(w.id)}">${escape(w.name)}</option>`).join('');
  $('#messages').innerHTML=data.messages.map(m=>`<article class="submission"><strong>${escape(m.from)} · ${escape(data.workers.find(w=>w.id===m.workerId)?.name || 'Former member')}</strong><p class="task-meta">${escape(new Date(m.createdAt).toLocaleString())}</p><p class="prose">${escape(m.content)}</p></article>`).join('') || '<p>No messages yet.</p>';
}
for(const id of ['login','register','reply']) $('#'+id).addEventListener('submit',async event=>{
  event.preventDefault();const form=event.target,button=form.querySelector('button');button.disabled=true;status.textContent='';
  try {const values=Object.fromEntries(new FormData(form));if(id==='register' && values.password!==values.confirm)throw new Error('Passwords do not match.');const data=await api(id==='reply'?'/messages':'/'+id,values);
    if(id==='login'){token=data.token;sessionStorage.setItem('lead-token',token);form.reset();await load();}
    else if(id==='register'){form.reset();showAuthForm('login');status.textContent=data.message;}
    else {form.reset();await load();status.textContent='Reply sent.';}
  }catch(error){status.textContent=error.message;}finally{button.disabled=false;}
});
$('#refresh').addEventListener('click',()=>load().catch(e=>{status.textContent=e.message;}));
$('#logout').addEventListener('click',async()=>{try{await api('/logout',{});token='';sessionStorage.removeItem('lead-token');$('#portal').hidden=true;$('#messages').replaceChildren();$('#auth').hidden=false;status.textContent='Signed out.';}catch(e){status.textContent=e.message;}});
if(token)load().catch(e=>{status.textContent=e.message;});

function showAuthForm(id) {
  $('#login').hidden = id !== 'login';
  $('#register').hidden = id !== 'register';
  status.textContent = '';
  $('#'+id+' input').focus();
}
$('#show-register').addEventListener('click',()=>showAuthForm('register'));
$('#show-login').addEventListener('click',()=>showAuthForm('login'));