const form=document.querySelector('#cv-form');
form.addEventListener('submit',async event=>{
  event.preventDefault(); const button=form.querySelector('button'), status=document.querySelector('#notice'); button.disabled=true; status.textContent='';
  try{
    const file=form.elements.cv.files[0];
    if(!file || file.size>5*1024*1024) throw new Error('Choose a PDF CV up to 5 MB.');
    const cv=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result.split(',')[1]);reader.onerror=()=>reject(new Error('Unable to read CV.'));reader.readAsDataURL(file);});
    const response=await fetch('/api/work-dashboard/waitlist',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:form.elements.name.value,email:form.elements.email.value,cv})});
    const data=await response.json().catch(()=>{throw new Error('Unable to submit CV. Please try again.');});
    if(!response.ok) throw new Error(data.error || 'Unable to submit CV.');
    form.hidden=true;document.querySelector('#success').hidden=false;document.querySelector('#success').focus();
  }catch(error){status.textContent=error.message || 'Connection failed. Please try again.';}finally{button.disabled=false;}
});