// Keep bank details in a popup without leaving the current page.
const bankDialog=document.createElement('dialog');
bankDialog.className='bank-dialog';
bankDialog.innerHTML='<button type="button" class="secondary bank-dialog-close" aria-label="Close bank details">×</button><iframe title="Bank details for monthly payments"></iframe>';
document.body.appendChild(bankDialog);
const bankFrame=bankDialog.querySelector('iframe');
let returnTimer;
document.addEventListener('click',event=>{
  const link=event.target.closest('a[href="/myaccount/payment-details/"]');
  if(!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)return;
  event.preventDefault();
  bankFrame.src='/myaccount/payment-details/?embedded=1';bankDialog.showModal();
});
bankDialog.querySelector('button').addEventListener('click',()=>bankDialog.close());
bankDialog.addEventListener('close',()=>{if(!returnTimer) bankFrame.removeAttribute('src');});
window.addEventListener('message',event=>{
  if(event.origin!==location.origin || event.source!==bankFrame.contentWindow || event.data?.type!=='bank-details-saved' || returnTimer)return;
  returnTimer=setTimeout(()=>{
    bankDialog.close();
    if(location.pathname.startsWith('/bugbountycompany') || location.pathname === '/myaccount/' || location.pathname === '/myaccount') {
      window.dispatchEvent(new Event('bank-details-updated'));
      bankFrame.removeAttribute('src');returnTimer=null;
    } else location.assign('/bugbountycompany/users/');
  },2000);
});
