const status=document.querySelector('#status'), list=document.querySelector('#applications'), refresh=document.querySelector('#refresh');
async function load(){
  refresh.disabled=true; list.replaceChildren(); status.textContent='Loading applications…'; document.querySelector('#signin').hidden=true;
  try{
    const token=sessionStorage.getItem('work-token');
    if(!token){document.querySelector('#signin').hidden=false;throw new Error('Sign in as admin to view uploaded CVs.');}
    const response=await fetch('/api/work-dashboard/waitlist',{headers:{Authorization:'Bearer '+token}});
    if(response.status===401 || response.status===403){document.querySelector('#signin').hidden=false;throw new Error('Sign in as admin to view uploaded CVs.');}
    if(!response.ok)throw new Error('Unable to load applications. Please try again.');
    const entries=await response.json();
    status.textContent=entries.length ? entries.length+' application'+(entries.length===1?'':'s') : 'No CVs have been uploaded yet.';
    for(const entry of entries){
      const card=document.createElement('article');card.className='panel';
      const name=document.createElement('h2');name.textContent=entry.name;
      const email=document.createElement('p');email.textContent=entry.email;
      const date=document.createElement('p');date.className='muted';date.textContent='Uploaded '+new Date(entry.createdAt).toLocaleString();
      const button=document.createElement('button');button.type='button';button.textContent=entry.deleteAt?'Downloaded — deleting…':'Download CV';
      button.disabled=Boolean(entry.deleteAt);
      if(entry.deleteAt) setTimeout(()=>{card.remove();status.textContent='Downloaded CV deleted from the database.';},Math.max(0,entry.deleteAt-Date.now()));
      button.addEventListener('click',async()=>{
        button.disabled=true;
        try{
          const response=await fetch('/api/work-dashboard/waitlist/'+encodeURIComponent(entry.id)+'/cv',{headers:{Authorization:'Bearer '+sessionStorage.getItem('work-token')}});
          if(!response.ok)throw new Error('Unable to download CV. Sign in as admin and try again.');
          const url=URL.createObjectURL(await response.blob()), link=document.createElement('a');
          link.href=url;link.download='cv.pdf';link.click();setTimeout(()=>URL.revokeObjectURL(url),10000);
          const confirmation=await fetch('/api/work-dashboard/waitlist/'+encodeURIComponent(entry.id)+'/downloaded',{method:'POST',headers:{Authorization:'Bearer '+sessionStorage.getItem('work-token')}});
          if(!confirmation.ok)throw new Error('CV downloaded, but automatic deletion failed. Please try again.');
          const receipt=await confirmation.json();entry.deleteAt=receipt.deleteAt;
          status.textContent='You downloaded the CV. It will be deleted from the database in 3 seconds.';
          button.textContent='Downloaded — deleting…';
          setTimeout(()=>{card.remove();status.textContent='You downloaded the CV. It has been deleted from the database.';},Math.max(0,receipt.deleteAt-Date.now()));
        }catch(error){status.textContent=error.message;}finally{button.disabled=Boolean(entry.deleteAt);}
      });
      card.append(name,email,date,button);list.append(card);
    }
  }catch(error){status.textContent=error.message || 'Unable to connect. Please try again.';}finally{refresh.disabled=false;}
}
refresh.addEventListener('click',load);load();
