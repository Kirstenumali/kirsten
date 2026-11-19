let token = sessionStorage.getItem('work-token') || '';
let state;
let dailyReminderUser = null;
const $ = s => document.querySelector(s);
const notice = text => { $('#notice').textContent = text; };
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function api(path, body) {
  let response;
  const connectionHelp = 'Start the local dashboard with npm run dashboard in the server folder, then open http://localhost:8000/bugbountycompany/users/.';
  try {
    const controller = new AbortController();
    const timeout = setTimeout(()=>controller.abort(),20000);
    try {
      response = await fetch('/api/work-dashboard' + path, { signal:controller.signal, method: body ? 'POST' : 'GET', headers: { 'Content-Type':'application/json', Authorization: 'Bearer ' + token }, ...(body ? {body:JSON.stringify(body)} : {}) });
    } finally { clearTimeout(timeout); }
  } catch { throw new Error(connectionHelp); }
  const data = await response.json().catch(() => { throw new Error(connectionHelp); });
  if (!response.ok) {
    if (response.status === 401) { token = ''; sessionStorage.removeItem('work-token'); $('#workspace').hidden = true; $('#login-view').hidden = false; }
    throw new Error(data.error || 'Request failed. Please try again.');
  }
  return data;
}
async function busy(form, action) {
  const button = form.querySelector('button'); button.disabled = true; notice('');
  try { await action(); } catch(e) { notice(e.message); } finally { button.disabled = false; }
}
async function load() {
  state = await api('/state');
  $('#workspace').hidden = false; $('#login-view').hidden = true;
  const admin = state.role === 'admin';
  $('#first-welcome').hidden = admin || !(await api('/welcome')).show;
  $('#admin-waitlist-menu').hidden = !admin;
  $('#admin-salary-menu').hidden=!admin;
  $('#admin-bounty-discovery').hidden = !admin;
  $('#admin-bounty-rooms').hidden = !admin;
  renderNotifications();
  $('#admin-tools').hidden = !admin;
  const tasksDropdown = $('#tasks-dropdown');
  if (tasksDropdown.dataset.role !== state.role) {
    tasksDropdown.open = false;
    tasksDropdown.dataset.role = state.role;
  }
  $('#tasks-dropdown-toggle').hidden = false;
  $('#worker-tasks-heading').hidden = true;
  const feedDropdown = $('#team-feed-dropdown');
  if (feedDropdown.dataset.role !== state.role) {
    feedDropdown.open = false;
    feedDropdown.dataset.role = state.role;
  }
  $('#team-feed-toggle').hidden = false;
  $('#user-team-feed-heading').hidden = true;
  feedDropdown.classList.add('panel');
  $('#team-menu').hidden = !admin;

  $('#resigning-menu').hidden = false;
  $('#resigning-menu').textContent = admin ? 'Resignations' : 'I am resigning';
  $('#role-label').textContent = admin ? 'OWNER / TEAM WORKSPACE' : 'YOUR PERSONAL WORKSPACE';
  $('#greeting').textContent = admin ? 'A clear view of the work.' : state.workers[0].name + (state.workers[0].jobTitle ? ' · ' + state.workers[0].jobTitle : '');
  const metrics = admin ? [['Team members',state.workers.length + ' / 6'],['To review',state.tasks.filter(t=>t.status==='Submitted').length],['Approved',state.tasks.filter(t=>t.status==='Approved').length],['Monthly team pay','$'+state.workers.length*13]] : [['Your tasks',state.tasks.length],['To do',state.tasks.filter(t=>['Assigned','Changes requested'].includes(t.status)).length],['Approved',state.tasks.filter(t=>t.status==='Approved').length],['Fixed monthly pay','$13']];
  $('#metrics').innerHTML = metrics.map(([label,value])=>`<div class="metric"><span>${escape(label)}</span><strong>${escape(value)}</strong></div>`).join('');
  $('#worker-select').innerHTML = '<option value="">Choose a worker</option>' + state.workers.map(w=>`<option value="${escape(w.id)}">${escape(w.name)}</option>`).join('');
  $('#worker-list').innerHTML = state.workers.map(w=>`<div class="worker-row">${escape(w.name)} · @${escape(w.username)}</div>`).join('');
  const onboarding = state.workers[0]?.onboarding || {status:'Not started'};
  $('#onboarding').hidden = admin || ['Pending review', 'Approved'].includes(onboarding.status);
  $('#verification-status').textContent = `${onboarding.status}${onboarding.workEmail ? ' · '+onboarding.workEmail : ''}${onboarding.feedback ? ' · '+onboarding.feedback : ''}`;
  const canSubmit = ['Not started','Changes requested'].includes(onboarding.status);
  $('#start-work').hidden = !canSubmit;
  $('#onboarding-form').hidden = true;
  $('#post-form').hidden = true;
  $('#create-post').setAttribute('aria-expanded','false');
  $('#create-post').disabled = false;
  $('#create-post').title = !admin && onboarding.status !== 'Approved' ? 'Posting becomes available after identity approval.' : 'Write a post';
  if(admin) $('#worker-list').innerHTML = state.workers.map((w,index)=>`<div class="worker-row"><span class="team-number">${index+1}</span> <strong>${escape(w.name)}${w.jobTitle ? ' · '+escape(w.jobTitle) : ''}</strong> · @${escape(w.username)} <a href="/bankdetails/?worker=${encodeURIComponent(w.id)}">View bank details →</a><p>${escape(w.onboarding.status)}${w.onboarding.workEmail?' · '+escape(w.onboarding.workEmail):''}</p>${w.onboarding.status === 'Pending review'?`<button type="button" class="secondary" data-document="${escape(w.id)}">Download document</button><form data-verification="${escape(w.id)}"><label>Feedback<input name="feedback" maxlength="1000"></label><label>Decision<select name="status"><option>Approved</option><option>Changes requested</option></select></label><button>Save identity review</button></form>`:''}</div>`).join('');
  if(admin) {
    for(let index=state.workers.length;index<6;index++) {
      $('#worker-list').insertAdjacentHTML('beforeend',`<div class="worker-row muted"><span class="team-number">${index+1}</span> Available place</div>`);
    }
  }

  renderTeamFlows();
  renderLeaderMessages();
  renderUserTeam();
  renderFeed();
  renderTasks();
  if (!admin && !state.dailyReminderHidden && dailyReminderUser !== state.userId) {
    $('#daily-visit-reminder').showModal();
    dailyReminderUser = state.userId;
  }
}
function renderFeed() {
  $('#feed').innerHTML = (state.posts || []).map(post => `<article class="panel task-card"><p class="eyebrow">${escape(post.authorName)}${post.authorJobTitle ? ' · '+escape(post.authorJobTitle) : ''}</p><p class="task-meta">${escape(formatLocalTime(post.createdAt))}</p><h3>${escape(post.title || "")}</h3><p class="prose">${escape(post.content)}</p>${post.photo ? `<img class="post-photo" src="${escape(post.photo)}" alt="Photo attached to ${escape(post.title || "post")}" loading="lazy">` : ""}${state.role === 'admin' || state.userId === post.authorId ? `<button type="button" class="secondary" data-delete-post="${escape(post.id)}">Delete post</button>` : ''}</article>`).join('') || '<div class="empty">The conversation starts here. Share the first post with your team.</div>';
}
function renderNotifications() {
  if(!state) return;
  const admin=state.role==='admin', needsZone=!admin && !state.timeZone;
  const team=state.teamNotifications || [];
  $('#payment-notifications').hidden=false;
  $('#payment-notifications .eyebrow').textContent='YOUR NOTIFICATIONS';
  $('#timezone-notification').hidden=!needsZone;
  $('#team-updates').innerHTML=team.length ? '<h3>Team updates</h3>'+team.map(item=>`<article class="submission"><p>${escape(item.message)}</p><p class="task-meta">${escape(formatLocalTime(item.createdAt))}</p></article>`).join('') : '';
  const count=team.filter(item=>!item.read).length + (admin?Number(Boolean(state.salaryReminder)):state.payments.filter(p=>!p.read).length+Number(needsZone));
  $('#notification-count').hidden=!count;$('#notification-count').textContent=count;
  if(admin){
    const reminder=state.salaryReminder;
    $('#payment-updates').innerHTML=reminder?'<p>'+escape(reminder.message)+'</p><a href="/salary/">Open Salary →</a>':'<p>No salary reminders.</p>';
  }else $('#payment-updates').innerHTML=state.payments.slice().sort((a,b)=>b.month.localeCompare(a.month)).map(p=>`<p>Your admin marked your <strong>${escape(p.month)}</strong> salary of <strong>$13 USD</strong> as transferred.</p>`).join('') || '<p>No payment updates yet.</p>';
}
async function markNotificationsRead() {
  if(!state || !$('#payment-notifications').open) return;
  const unread=(state.teamNotifications || []).filter(item=>!item.read);
  if(unread.length){await api('/team-notifications/read',{ids:unread.map(item=>item.id)});unread.forEach(item=>{item.read=true;});}
  if(state.role!=='admin'){
    const payments=state.payments.filter(item=>!item.read);
    if(payments.length){await api('/notifications/read',{ids:payments.map(item=>item.notificationId)});payments.forEach(item=>{item.read=true;});}
  }
  renderNotifications();
}
setInterval(async()=>{
  if(!state || !token || document.hidden)return;
  try {
    const latest=await api('/state');
    state.teamNotifications=latest.teamNotifications;state.payments=latest.payments;state.salaryReminder=latest.salaryReminder;state.teamDirectory=latest.teamDirectory;state.researcherAvailable=latest.researcherAvailable;
    renderNotifications();renderUserTeam();
    await markNotificationsRead();
  }catch{}
},30000);
$('#payment-notifications').addEventListener('toggle',()=>markNotificationsRead().catch(error=>notice(error.message)));
function renderTasks() {
  const admin = state.role === 'admin';
  const tasks = state.tasks.map(t=>({...t,status:t.status !== 'Approved' && Date.now() >= new Date(t.expiresAt).getTime() ? 'Expired' : t.status})).filter(t=>!$('#filter').value || t.status === $('#filter').value);
  $('#tasks').innerHTML = tasks.map(t=>{
    const worker = state.workers.find(w=>w.id===t.workerId);
    const history = t.submissions.map((s,i)=>`<div class="submission"><p class="eyebrow">SUBMISSION ${i+1} · ${escape(formatLocalTime(s.submittedAt))}</p><p class="prose">${escape(s.message)}</p>${s.link?`<a href="${escape(s.link)}" target="_blank" rel="noopener noreferrer">Open submitted work ↗</a>`:''}</div>`).join('');
    const submit = !admin && ['Assigned','Changes requested'].includes(t.status) ? `<form data-submit="${escape(t.id)}"><label>Your completed work<textarea name="message" rows="4" required maxlength="12000" placeholder="Paste your finished draft or explain what you completed."></textarea></label><label>Work link (optional)<input name="link" type="url" maxlength="2000" placeholder="https://..."></label><button>Submit for review ↗</button></form>` : '';
    const review = admin && t.status === 'Submitted' ? `<form data-review="${escape(t.id)}"><label>Feedback<textarea name="feedback" maxlength="4000" rows="3"></textarea></label><label>Decision<select name="status"><option>Approved</option><option>Changes requested</option></select></label><button>Save review</button></form>` : '';
    return `<article class="panel task-card"><span class="badge">${escape(t.status)}</span><h3>${escape(t.title)}</h3><p class="task-meta">${escape(worker?.name || '')} · ${t.due?'Due '+escape(t.due):'No deadline'}</p><p class="task-meta">Expires ${escape(formatLocalTime(t.expiresAt))}</p><p class="prose">${escape(t.instructions)}</p>${history}${t.feedback?`<div class="submission"><p class="eyebrow">OWNER FEEDBACK</p><p class="prose">${escape(t.feedback)}</p></div>`:''}${submit}${review}</article>`;
  }).join('') || '<div class="empty">No tasks here yet. New assignments and submissions will appear here.</div>';
}
$('#login').addEventListener('submit', e=>{e.preventDefault();busy(e.target,async()=>{
  const data=await api('/login',Object.fromEntries(new FormData(e.target)));token=data.token;sessionStorage.setItem('work-token',token);e.target.reset();await load();
});});
$('#show-register').addEventListener('click',()=>{$('#login').hidden=true;$('#register').hidden=false;notice('');});
$('#show-login').addEventListener('click',()=>{$('#register').hidden=true;$('#login').hidden=false;notice('');});
$('#register').addEventListener('submit',e=>{e.preventDefault();busy(e.target,async()=>{
  const values=Object.fromEntries(new FormData(e.target));
  if(values.password !== values.confirm) throw new Error('The passwords do not match.');
  const data=await api('/register',{name:values.name,username:values.username,password:values.password});
  token=data.token;sessionStorage.setItem('work-token',token);e.target.reset();await load();notice('Welcome! Your account and personal dashboard are ready.');
});});
$('#create-post').addEventListener('click',()=>{
  if(state.role !== 'admin' && state.workers[0]?.onboarding?.status !== 'Approved') {
    notice('Your identity review must be approved by the team owner before you can post.');
    return;
  }
  notice('');
  $('#post-form').hidden = !$('#post-form').hidden;
  $('#create-post').setAttribute('aria-expanded',String(!$('#post-form').hidden));
  if(!$('#post-form').hidden) $('#post-form textarea').focus();
});
$('#cancel-post').addEventListener('click',()=>{
  $('#post-form').hidden=true;
  $('#create-post').setAttribute('aria-expanded','false');
  $('#create-post').focus();
});
document.addEventListener('click',e=>{
  const notifications=$('#payment-notifications');
  if(!notifications.contains(e.target)) notifications.open=false;
  const menu=$('.account-menu');
  if(!menu.contains(e.target) || e.target.closest('.account-menu-items button')) menu.open=false;
});
document.addEventListener('keydown',e=>{if(e.key==='Escape') { $('.account-menu').open=false; $('#payment-notifications').open=false; }});
$('#post-form').addEventListener('submit',e=>{e.preventDefault();busy(e.target,async()=>{const values=new FormData(e.target), file=values.get('photo');
  let photo='';
  if(file && file.size) {
    if(file.size > 2*1024*1024 || !['image/jpeg','image/png','image/webp'].includes(file.type)) throw new Error('Choose a JPEG, PNG, or WebP photo of up to 2 MB.');
    photo=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(new Error('Could not read your photo.'));reader.readAsDataURL(file);});
  }
  await api('/posts',{title:values.get('title'),content:values.get('content'),photo});e.target.reset();await load();notice('Your post is now in the team feed.');});});
$('#start-work').addEventListener('click',()=>{$('#onboarding-form').hidden=false;$('#start-work').hidden=true;});
$('#onboarding-form').addEventListener('submit',e=>{e.preventDefault();busy(e.target,async()=>{
  const values=new FormData(e.target), file=values.get('document');
  if(!file.size || file.size > 10*1024*1024) throw new Error('Choose a document of up to 10 MB.');
  const document=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result.split(',')[1]);reader.onerror=()=>reject(new Error('Could not read the document.'));reader.readAsDataURL(file);});
  await api('/onboarding',{workEmail:values.get('workEmail'),documentType:values.get('documentType'),document});
  e.target.reset();await load();notice('');
});});
$('#worker-list').addEventListener('submit',e=>{e.preventDefault();busy(e.target,async()=>{await api('/workers/'+e.target.dataset.verification+'/verification',Object.fromEntries(new FormData(e.target)));await load();notice('Identity review saved. The uploaded document has been deleted.');});});
$('#worker-list').addEventListener('click',async e=>{
  const button=e.target.closest('[data-document]');if(!button)return;
  button.disabled=true;
  try {
    const response=await fetch('/api/work-dashboard/workers/'+button.dataset.document+'/document',{headers:{Authorization:'Bearer '+token}});
    if(!response.ok) throw new Error('Unable to download the document. Sign in again or refresh.');
    const blob=await response.blob(), url=URL.createObjectURL(blob), link=document.createElement('a');
    link.href=url;link.download='identity-document.'+({'application/pdf':'pdf','image/jpeg':'jpg','image/png':'png'}[blob.type]||'bin');link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  } catch(error){notice(error.message);}finally{button.disabled=false;}
});
let pendingDeletePost = null;
$('#feed').addEventListener('click', e=>{
  const button=e.target.closest('[data-delete-post]');if(!button)return;
  const post=state.posts.find(item=>item.id===button.dataset.deletePost);
  if(!post || (state.role!=='admin' && state.userId!==post.authorId))return;
  pendingDeletePost=post.id;
  $('#delete-post-title').textContent=state.userId===post.authorId?'Do you want to remove your post?':'Do you want to remove this post?';
  $('#delete-post-status').textContent='';
  $('#delete-post-dialog').showModal();
});
$('#cancel-delete-post').addEventListener('click',()=>$('#delete-post-dialog').close());
$('#delete-post-dialog').addEventListener('close',()=>{pendingDeletePost=null;});
$('#confirm-delete-post').addEventListener('click',async()=>{
  if(!pendingDeletePost)return;
  const button=$('#confirm-delete-post');button.disabled=true;
  $('#delete-post-status').textContent='';
  try {
    await api('/posts/'+encodeURIComponent(pendingDeletePost)+'/delete',{});
    $('#delete-post-dialog').close();
    try{await load();notice('Post deleted.');}catch{notice('Post deleted. Refresh to update the feed.');}
  } catch(error){$('#delete-post-status').textContent=error.message;}
  finally{button.disabled=false;}
});
$('#task-form').addEventListener('submit', e=>{e.preventDefault();busy(e.target,async()=>{await api('/tasks',Object.fromEntries(new FormData(e.target)));e.target.reset();await load();notice('Task assigned. It is now visible in the worker’s account.');});});
$('#tasks').addEventListener('submit', e=>{e.preventDefault();const form=e.target;busy(form,async()=>{await api('/tasks/'+(form.dataset.submit || form.dataset.review)+(form.dataset.submit?'/submit':'/review'),Object.fromEntries(new FormData(form)));await load();notice(form.dataset.submit?'Work submitted for review.':'Review saved.');});});
$('#filter').addEventListener('change',renderTasks);
$('#refresh').addEventListener('click',()=>load().then(()=>notice('Workspace updated.')).catch(e=>notice(e.message)));
$('#logout').addEventListener('click',async()=>{try {await api('/logout',{});}catch{} token='';sessionStorage.removeItem('work-token');state=null;dailyReminderUser=null;document.querySelector('#daily-visit-reminder').close();document.querySelector('#leader-message-dialog').close();document.querySelector('#leader-message-form').reset();document.querySelector('#leader-message-history').replaceChildren();$('#tasks').replaceChildren();$('#workspace').hidden=true;$('#login-view').hidden=false;notice('Signed out.');});
$('#setup').addEventListener('submit', e=>{e.preventDefault();busy(e.target,async()=>{
  const values = Object.fromEntries(new FormData(e.target));
  if(values.password !== values.confirm) throw new Error('The passwords do not match.');
  await api('/setup',{password:values.password});
  e.target.reset();$('#setup').hidden=true;$('#login').hidden=false;
  $('#login [name="username"]').value='admin';
  notice('Admin account created. Sign in with your new password.');
});});
async function initialize() {
  updateDailyQuote();
  const access=await api('/access');
  if(!access.configured && access.localSetup) {
    $('#setup').hidden=false;$('#login').hidden=true;return;
  }
  if(token) await load();
  else if(new URLSearchParams(location.search).get('view')==='register') {
    $('#login').hidden=true;$('#register').hidden=false;
  }
}
initialize().catch(e=>notice(e.message));
window.addEventListener('bank-details-updated',()=>load().then(()=>notice('')).catch(e=>notice(e.message)));

function updateDailyQuote() {
  const quotes = [
    'Part-time hours can bring useful ideas to life. Start with one problem you can solve today.',
    'A small improvement in technology can make someone’s everyday work easier.',
    'You do not need a full day to make progress. Give one useful idea your focused attention.',
    'Innovation begins when you ask how a familiar task could work better.',
    'Use the time you have to build a solution someone needs.',
    'One bug fixed, one process improved, one lesson shared: each contribution counts.',
    'Let your part-time work become a place to learn, experiment, and create.',
    'The best technical idea starts with understanding the person who will use it.',
    'Turn a few focused hours into a clearer process or a simpler tool.',
    'A practical solution does not have to be complicated to make a difference.',
    'Build a little, test what works, and let what you learn guide the next step.',
    'Bring curiosity to your technology work. A good question can lead to a better solution.',
    'Small contributions across a team can turn an idea into something useful.',
    'Make room for steady progress. Your next part-time session can move a useful idea forward.'
  ];
  const parts = new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Dubai',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
  const value = type => parts.find(p=>p.type===type).value;
  const day = Math.floor(Date.UTC(Number(value('year')),Number(value('month'))-1,Number(value('day')))/86400000);
  $('#daily-quote').textContent = quotes[day % quotes.length];
  $('#quote-date').textContent = new Intl.DateTimeFormat('en',{timeZone:'Asia/Dubai',month:'long',day:'numeric'}).format(new Date());
}
setInterval(updateDailyQuote,60000);

setInterval(()=>{if(state) renderTasksIfExpired();},30000);
function renderTasksIfExpired(){if(!document.querySelector('#tasks form :focus') && state.tasks.some(t=>t.status !== 'Approved' && t.status !== 'Expired' && Date.now() >= new Date(t.expiresAt).getTime())){state.tasks.forEach(t=>{if(t.status !== 'Approved' && Date.now() >= new Date(t.expiresAt).getTime()) t.status='Expired';});renderTasks();}}

$('#dismiss-welcome').addEventListener('click',async()=>{
  const button=$('#dismiss-welcome'); button.disabled=true;
  try{await api('/welcome/seen',{}); $('#first-welcome').hidden=true;}
  catch(error){notice(error.message);}finally{button.disabled=false;}
});
function renderTeamFlows(){
 const panel = $('#team-flows');

 const wasOpen = panel.querySelector('details')?.open || false;
 panel.hidden = false;
 const admin=state.role==='admin', name=id=>state.workers.find(w=>w.id===id)?.name || 'You';
 const options=state.workers.map(w=>`<option value="${escape(w.id)}">${escape(w.name)}</option>`).join('');
 $('#team-flows').innerHTML=`
 <details id="bounty-reports"${wasOpen ? " open" : ""}><summary class="bounty-reports-toggle">Bug bounty reports <span aria-hidden="true">⌄</span></summary><div class="bounty-reports-content"><p><a href="/bigbountyapis/">Discover programs ↗</a></p><p><a href="/bigbountyrooms/">Shared team rooms →</a></p><p>Track reports sent to companies. Researcher share: 5% of the company reward. Marking paid records an external payment.</p>${!admin?`<form data-flow="bounties"><label>Company<input name="company" maxlength="160" required></label><label>Report title<input name="title" maxlength="200" required></label><label>Submitted report link<input name="reportUrl" type="url" maxlength="2000" required></label><button>Track submitted bounty</button></form>`:''}
 ${['Submitted','Approved','Paid'].map(status=>`<h3>${status}</h3>${state.bounties.filter(b=>b.status===status).map(b=>`<article class="submission"><strong>${escape(b.title)}</strong><p>${escape(b.company)} · ${escape(name(b.workerId))}</p><a href="${escape(b.reportUrl)}" target="_blank" rel="noopener noreferrer">Open report</a>${b.reward?`<p>Company reward: $${escape(b.reward)} USD · Your researcher share: $${b.share.toFixed(2)} USD</p>`:''}${admin && status!=='Paid'?`<form data-flow="bounties/${escape(b.id)}/review"><label>Company reward (USD)<input name="reward" type="number" min="0.01" max="100000000" step="0.01" required value="${b.reward || ''}" ${status==='Approved'?'readonly':''}></label><input type="hidden" name="status" value="${status==='Submitted'?'Approved':'Paid'}"><button>${status==='Submitted'?'Approve bounty':'Mark researcher share paid'}</button></form>`:''}</article>`).join('') || '<p>No reports in this section.</p>'}`).join('')}
 </div></details>`;
}
$('#team-flows').addEventListener('submit',event=>{
 const form=event.target.closest('[data-flow]');if(!form)return;event.preventDefault();
 busy(form,async()=>{await api('/'+form.dataset.flow,Object.fromEntries(new FormData(form)));await load();notice('Saved.');});
});

function formatLocalTime(value){return new Intl.DateTimeFormat(undefined,{timeZone:state?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,dateStyle:'medium',timeStyle:'short'}).format(new Date(value));}


$('#hide-daily-reminder').addEventListener('click', async () => {
  const button = $('#hide-daily-reminder');
  button.disabled = true;
  $('#daily-reminder-status').textContent = '';
  try {
    await api('/daily-reminder/hide', {});
    state.dailyReminderHidden = true;
    $('#daily-visit-reminder').close();
  } catch (error) {
    $('#daily-reminder-status').textContent = error.message || 'Could not save your choice. Please try again.';
  } finally { button.disabled = false; }
});
function renderLeaderMessages() {
  const available = state?.role === 'worker' && state.researcherAvailable === true;
  $('#leader-message-content').hidden = !available;
  $('#no-team-researcher').hidden = available;
  $('#leader-message-title').textContent = available ? 'Message Team Lead Researcher' : 'Team Lead Researcher';
  if (!available) { $('#leader-message-history').replaceChildren(); return; }
  $('#leader-message-history').innerHTML = state?.role !== 'worker' ? '' : state.messages.map(m=>`<article class="submission"><strong>${escape(m.from)}</strong><p class="task-meta">${escape(formatLocalTime(m.createdAt))}</p><p class="prose">${escape(m.content)}</p></article>`).join('') || '<p>No messages yet.</p>';
}
async function refreshLeaderMessages() {
  const latest = await api('/state');
  state.messages = latest.messages;
  state.researcherAvailable = latest.researcherAvailable;
  renderLeaderMessages();
  renderUserTeam();
}
$('#user-team-list').addEventListener('click', event => {
  if (!event.target.closest('#message-leader')) return;
  if (state?.role !== 'worker') return;
  $('#leader-message-status').textContent = '';
  $('#leader-message-dialog').showModal();
  refreshLeaderMessages().catch(error=>{$('#leader-message-status').textContent=error.message;});
});
$('#close-leader-message').addEventListener('click',()=>$('#leader-message-dialog').close());
$('#refresh-leader-messages').addEventListener('click',async()=>{
  const button=$('#refresh-leader-messages');button.disabled=true;
  try {await refreshLeaderMessages();$('#leader-message-status').textContent='Messages refreshed.';}
  catch(error){$('#leader-message-status').textContent=error.message;}
  finally{button.disabled=false;}
});
$('#leader-message-form').addEventListener('submit',async event=>{
  event.preventDefault();const form=event.target,button=form.querySelector('button');button.disabled=true;
  const messageStatus=$('#leader-message-status');messageStatus.textContent='';
  try {
    await api('/messages',Object.fromEntries(new FormData(form)));
    form.reset();messageStatus.textContent='Message sent.';
    try{await refreshLeaderMessages();}catch{messageStatus.textContent='Message sent. Refresh to see the latest conversation.';}
  }catch(error){messageStatus.textContent=error.message;}
  finally{button.disabled=false;}
});
function renderUserTeam() {
  const panel = $('#user-team');
  panel.hidden = !state || !['worker', 'admin'].includes(state.role);
  if (panel.hidden) { $('#user-team-list').replaceChildren(); return; }
  const directory = state.teamDirectory || {leads:[],workers:[]};
  const clock = zone => `<span data-team-timezone="${escape(zone || '')}"></span>`;
  const leaders = directory.leads.map(lead=>`<p><strong>${escape(lead.name)}</strong></p><p>Local time: ${clock(lead.timeZone)}</p>`).join('') || '<p class="muted">There is no team researcher yet.</p>';
  const workers = [...directory.workers].sort((a,b)=>{
    const priority = worker => worker.username === 'carperwiske' ? 0 : /cybersecurity engineer/i.test(worker.jobTitle || '') ? 1 : 2;
    return priority(a)-priority(b);
  });
  let rows = `<div class="worker-row"><span class="team-number">1</span> <strong>Lead Cybersecurity / Team Leader</strong>${leaders}</div>`;
  rows += workers.map((worker,index)=>{
    const ownEntry = state.role === 'worker' && worker.id === state.userId;
    const label = ownEntry ? `You · Team ${index+2}` : `${escape(worker.name)}${worker.jobTitle?' · '+escape(worker.jobTitle):''}`;
    return `<div class="worker-row"><span class="team-number">${index+2}</span> <strong>${label}</strong>${ownEntry?'':' · @'+escape(worker.username)}<p>${ownEntry?'My local time is:':'Local time:'} ${clock(worker.timeZone)}</p></div>`;
  }).join('');
  for(let index=workers.length;index<5;index++) rows += `<div class="worker-row muted"><span class="team-number">${index+2}</span> Available place</div>`;
  $('#user-team-list').innerHTML = rows;
  updateTeamLocalTimes();
}
function updateTeamLocalTimes() {
  if ($('#user-team').hidden) return;
  for(const clock of $('#user-team-list').querySelectorAll('[data-team-timezone]')) {
    const zone = clock.dataset.teamTimezone;
    if(!zone) {clock.textContent='Timezone not set up yet';continue;}
    try {clock.textContent=new Intl.DateTimeFormat(undefined,{timeZone:zone,hour:'2-digit',minute:'2-digit',hour12:true}).format(new Date());}
    catch {clock.textContent='Timezone needs updating';}
  }
}
setInterval(updateTeamLocalTimes,10000);