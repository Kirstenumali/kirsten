window.Bounty = (()=>{
 const requestedLead=new URLSearchParams(location.search).get('portal')==='lead';
 const lead=requestedLead || (!sessionStorage.getItem('work-token') && Boolean(sessionStorage.getItem('lead-token')));
 const token=sessionStorage.getItem(lead?'lead-token':'work-token') || '';
 const base=lead?'/api/lead-cybersecurity':'/api/work-dashboard';
 const suffix=lead?'?portal=lead':'';
 const escape=value=>String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 async function api(path,body){
  const response=await fetch(base+path,{method:body?'POST':'GET',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},...(body?{body:JSON.stringify(body)}:{})});
  const data=await response.json();if(!response.ok)throw new Error(data.error || 'Unable to load the team board.');return data;
 }
 function setupNav(){
  for(const link of document.querySelectorAll('[data-bounty-nav]'))link.href=link.getAttribute('href').split('?')[0]+suffix;
  const dashboard=document.querySelector('#dashboard-link');if(dashboard)dashboard.href=lead?'/leadcybersecurity/':'/bugbountycompany/users/';
 }
 setupNav();
 return {lead,token,api,escape,suffix,signIn:lead?'/leadcybersecurity/':'/bugbountycompany/users/'};
})();
