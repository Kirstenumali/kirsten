const {escape,api,suffix,token}=Bounty;
const $=s=>document.querySelector(s);
let programs=[],page=0,isAdmin=false;
const pageSize=24;
function render(){
 const words=$('#search').value.toLowerCase().trim(),type=$('#program-type').value;
 const explanation=$('#program-type-explanation');
 explanation.hidden=false;
 const descriptions={
  bounty:'Bounty programs offer rewards for eligible security vulnerabilities reported under their rules. Payment depends on factors such as scope, severity, report quality, and whether the finding is valid and original. A reward is not guaranteed. Check the program page for current terms and payouts.',
  disclosure:'Disclosure programs give researchers a way to report security vulnerabilities to an organization. These listings are not marked as offering cash bounties in the source data. Recognition or other rewards may vary. Check the program page for its current scope, reporting rules, and reward policy.',
  all:'All programs includes both bounty and disclosure programs. Bounty programs may pay rewards for eligible reports; disclosure programs provide a reporting channel and may not offer cash rewards. Check each program page for its current policy.'
 };
 explanation.textContent=descriptions[type] || '';
 const filtered=programs.filter(p=>(type==='all' || (type==='bounty'?p.bounty:!p.bounty)) && [p.name,p.platform,...p.domains].join(' ').toLowerCase().includes(words));
 const pages=Math.max(1,Math.ceil(filtered.length/pageSize));page=Math.min(page,pages-1);
 $('#program-count').textContent=filtered.length+' programs';
 $('#programs').innerHTML=filtered.slice(page*pageSize,(page+1)*pageSize).map(p=>{
   const params=new URLSearchParams({program:p.name,url:p.url});if(Bounty.lead)params.set('portal','lead');
   return `<article class="panel program-card"><div><span class="badge">${p.bounty?'Bounty program':'Disclosure program'}</span></div><h2>${escape(p.name)}</h2><p class="small muted">${escape(p.platform)}</p><p class="small muted program-domain">${escape(p.domains.slice(0,3).join(' · ') || 'See program page for scope')}</p><div class="program-links"><a href="${escape(p.url)}" target="_blank" rel="noopener noreferrer">Open program ↗</a>${isAdmin?`<a href="/bigbountyrooms/?${escape(params.toString())}">Add to team rooms →</a>`:''}</div></article>`;
 }).join('') || '<p class="bounty-empty">No programs match your filters.</p>';
 $('#page-label').textContent='Page '+(page+1)+' of '+pages;$('#previous').disabled=page===0;$('#next').disabled=page>=pages-1;
}
async function loadPrograms(){
 $('#refresh-programs').disabled=true;$('#feed-status').textContent='Loading programs…';
 try{const response=await fetch('/api/bigbounty/programs');const data=await response.json();if(!response.ok)throw new Error(data.error || 'Unable to load programs.');programs=data.programs;render();$('#feed-status').textContent=(data.stale?'Source unavailable. Showing saved listings from ':'Listings fetched ')+new Date(data.fetchedAt).toLocaleString()+'.';}
 catch(error){$('#feed-status').textContent=error.message;}
 finally{$('#refresh-programs').disabled=false;}
}
$('#search').addEventListener('input',()=>{page=0;render();});$('#program-type').addEventListener('change',()=>{page=0;render();});
$('#previous').addEventListener('click',()=>{page--;render();$('#program-count').scrollIntoView({block:'start'});});$('#next').addEventListener('click',()=>{page++;render();$('#program-count').scrollIntoView({block:'start'});});$('#refresh-programs').addEventListener('click',loadPrograms);
if(token)api('/bounty-rooms').then(data=>{isAdmin=data.role==='admin';render();}).catch(()=>{});
loadPrograms();

const hackingThoughts = [
 'A useful report turns curiosity into a clear explanation.',
 'Good research starts with one careful question.',
 'Reproduce the finding. Then make it easy to understand.',
 'Understand the intended behavior before questioning it.',
 'Clear evidence makes a small discovery useful.',
 'A patient researcher notices what a hurried one misses.'
];
let thoughtIndex = Math.floor(Date.now()/86400000) % hackingThoughts.length;
function showHackingThought(){ $('#hacking-quote').textContent='“'+hackingThoughts[thoughtIndex]+'”'; }
$('#next-hacking-tip').addEventListener('click',()=>{thoughtIndex=(thoughtIndex+1)%hackingThoughts.length;showHackingThought();});
showHackingThought();
