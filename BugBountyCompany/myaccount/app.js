const token=sessionStorage.getItem('work-token');
const status=document.querySelector('#account-status');
async function request(path,body){
  const response=await fetch('/api/work-dashboard'+path,{method:body?'POST':'GET',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},...(body?{body:JSON.stringify(body)}:{})});
  const data=await response.json();
  if(!response.ok){
    if(response.status===401){sessionStorage.removeItem('work-token');document.querySelector('#account-form').hidden=true;document.querySelector('#account-bank-details').hidden=true;document.querySelector('#signin').hidden=false;}
    throw new Error(data.error || 'Could not save your account.');
  }
  return data;
}
async function load(){
  if(!token){status.textContent='Sign in to view your account.';document.querySelector('#signin').hidden=false;return;}
  const account=await request('/account');
  document.querySelector('#account-bank-details').hidden = account.username === 'admin';
  document.querySelector('#account-bank-status').textContent = account.bankDetailsSaved
    ? 'Your bank details are saved. Only the admin can view them. You can submit updated details whenever needed.'
    : 'Add the bank details where you would like to receive your monthly payment.';
  document.querySelector('#account-bank-link').textContent = account.bankDetailsSaved ? 'Update bank details →' : 'Add bank details →';
  document.querySelector('#account-name').textContent=account.name+(account.jobTitle?' · '+account.jobTitle:'');
  document.querySelector('#account-username').textContent='@'+account.username;
  document.querySelector('#job-title').value=account.jobTitle;
  zoneSelect.value=account.timeZone || '';updateClock();
  document.querySelector('#account-form').hidden=false;document.querySelector('#signout').hidden=false;
}
document.querySelector('#account-form').addEventListener('submit',async e=>{
  e.preventDefault();const button=e.target.querySelector('button');button.disabled=true;
  try{await request('/account',{jobTitle:document.querySelector('#job-title').value,timeZone:zoneSelect.value});location.assign('/bugbountycompany/users/');}
  catch(error){status.textContent=error.message || 'Connection failed. Try again.';}finally{button.disabled=false;}
});
document.querySelector('#signout').addEventListener('click',async()=>{
  try{await request('/logout',{});sessionStorage.removeItem('work-token');location.assign('/bugbountycompany/users/');}
  catch(error){status.textContent=error.message || 'Unable to sign out. Try again.';}
});
load().catch(error=>{status.textContent=error.message || 'Unable to connect to the local server.';});

window.addEventListener('bank-details-updated',()=>load().then(()=>{status.textContent='Your bank details have been saved.';}).catch(error=>{status.textContent=error.message;}));