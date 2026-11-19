const token=sessionStorage.getItem('work-token');
const form=document.querySelector('#bank-form'),status=document.querySelector('#bank-status');
const worker=new URLSearchParams(location.search).get('worker');
async function request(body){
  const response=await fetch('/api/work-dashboard/bank-details'+(!body&&worker?'?worker='+encodeURIComponent(worker):''),{method:body?'POST':'GET',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},...(body?{body:JSON.stringify(body)}:{})});
  const data=await response.json();if(!response.ok)throw new Error(data.error || 'Unable to save bank details.');return data;
}
async function load(){
  if(!token){status.textContent='Please sign in to the workspace to access bank details.';return;}
  const data=await request();form.hidden=false;
  document.querySelector('#bank-owner').textContent=data.readOnly?`${data.name} · @${data.username} — payment details`:'Paste your bank details for your $13 USD monthly payment. Only the admin can view saved details. To change them, submit a full replacement below.';
  const description=form.querySelector('[name="description"]');
  const labels={accountHolder:'Account holder',bankName:'Bank',country:'Country',currency:'Currency',accountNumber:'Account number',iban:'IBAN',swift:'SWIFT / BIC',routingCode:'Routing / bank code'};
  description.value=data.details.description ?? Object.entries(labels).filter(([key])=>data.details[key]).map(([key,label])=>label+': '+data.details[key]).join('\n');
  description.readOnly=data.readOnly;
  form.querySelector('[name="accountHolder"]').value=data.details.accountHolder || '';
  form.querySelector('[name="accountHolder"]').readOnly=data.readOnly;
  document.querySelector('#save-bank').hidden=data.readOnly;
  document.querySelector('#bank-saved').textContent=data.savedAt?'Last updated '+new Date(data.savedAt).toLocaleString():'No bank details saved yet.';
}
form.addEventListener('submit',async e=>{
  e.preventDefault();const button=document.querySelector('#save-bank');button.disabled=true;status.textContent='';
  try{
    await request(Object.fromEntries(new FormData(form)));
    status.textContent='Bank details saved. Returning to your dashboard…';
    if(window.parent!==window && new URLSearchParams(location.search).get('embedded')==='1') {
      window.parent.postMessage({type:'bank-details-saved'},location.origin);
    } else {
      setTimeout(()=>location.assign('/bugbountycompany/users/'),2000);
    }
  }catch(error){status.textContent=error.message;button.disabled=false;}
});
if(window.parent!==window && new URLSearchParams(location.search).get('embedded')==='1') {
  document.querySelector('main').style.padding='16px';
}
load().catch(error=>{status.textContent=error.message || 'Unable to connect. Please try again.';});
