'use strict';
const $ = id => document.getElementById(id);
const profiles = {
  desktop: {query:'desktop support Windows', experience:'My portfolio includes technical troubleshooting, log analysis, and system integration. Please add a Windows support example you have personally completed before sending this draft.', step:'Review the symptoms, Windows version, and agreed support boundaries.', effort:'IT task · desktop troubleshooting', fit:'Look for one software installation or desktop issue. Confirm the operating system and whether remote access is needed.', tasks:'Tasks to look for: application installation · software errors · desktop setup'},
  network: {query:'network support WiFi troubleshooting', experience:'My portfolio includes Wireshark, Nmap, protocol analysis, Linux, and connected-device integration. I would confirm the network issue matches my practical experience.', step:'Review the network layout and reproduce the connectivity issue.', effort:'IT task · network diagnostics', fit:'Start with one connectivity issue or network diagram. Hardware and cabling tasks may need an on-site visit.', tasks:'Tasks to look for: Wi-Fi diagnostics · connectivity checks · network documentation'},
  m365: {query:'Microsoft 365 support', experience:'My background includes technical troubleshooting and system integration. Please add your actual Microsoft 365 or email support experience here before applying; it is not established in my portfolio.', step:'Confirm the affected account or email issue and the required permissions.', effort:'Confirm your experience · Microsoft 365', fit:'Only offer services you can demonstrate. Mail migrations, tenant administration, and access changes need specific experience.', tasks:'Tasks to look for: Outlook troubleshooting · email setup · user setup guides'},
  support: {query:'IT support', experience:'My portfolio includes Linux, Ubuntu, log analysis, bug fixing, and practical system integration. I have supported robot deployment and worked on technical troubleshooting.', step:'Review the reported symptoms and agree on one troubleshooting ticket.', effort:'Start here · bounded support tasks', fit:'Look for a single troubleshooting ticket or setup task. Live helpdesk queues often need fixed response hours.'},
  documentation: {query:'IT technical documentation', experience:'My technical background includes Linux, APIs, Android, robotics integration, and test validation. I can use this knowledge to explain technical workflows; documentation samples can be agreed for the project.', step:'Review the workflow and agree on the audience and one sample guide.', effort:'Smaller scope · guides & checklists', fit:'Look for setup instructions, troubleshooting guides, or test checklists. Confirm you can explain the specific system clearly.'},
  security: {query:'cybersecurity analyst', experience:'My portfolio includes cybersecurity studies, Wireshark, Nmap, protocol analysis, log analysis, and technical proof-of-concept validation.', step:'Confirm the review scope and examine a sample of the available logs.', effort:'More specialist · security analysis', fit:'Look for defined log-review or security documentation tasks. SOC monitoring often requires shifts and incident response availability.'},
  vulnerability: {query:'vulnerability assessment', experience:'My portfolio includes cybersecurity studies, Nmap, Wireshark, and protocol analysis. I would confirm that the assessment scope matches my practical experience before accepting.', step:'Confirm written authorization, in-scope systems, and the required assessment deliverable.', effort:'More specialist · scoped assessments', fit:'Requires practical assessment skills, written authorization, and clear reporting. Avoid accepting independent penetration tests beyond your experience.'},
  api: {query:'API integration', experience:'I work with REST APIs, backend communication, authentication, and hardware-software integration. My portfolio includes Node.js, Express.js, Postman, and Android API connections.', step:'Review the API documentation and reproduce the integration issue.'},
  android: {query:'Android Kotlin', experience:'I have built Android applications for robotics control and worked on UI improvements and robot deployment. My tools include Android Studio, Java, Kotlin, Retrofit, and OkHttp.', step:'Reproduce the issue in the Android app and identify the affected flow.'},
  automation: {query:'PowerShell IT automation', experience:'My programming toolkit includes Python, Bash, PowerShell, and JavaScript, alongside practical integration and troubleshooting experience.', step:'Review the existing manual workflow and agree on a small automation milestone.', tasks:'Tasks to look for: log collection scripts · inventory reports · repetitive file tasks'},
  qa: {query:'API software testing', experience:'I work with Postman, log analysis, bug fixing, and test validation across apps and integrations. My portfolio also includes Linux and protocol analysis.', step:'Confirm the expected behavior and prepare a focused test checklist.'},
  iot: {query:'IoT ESP32', experience:'My portfolio includes ESP32, sensor integration, robotics prototyping, ROS, and hardware-software communication, as well as backend API connections.', step:'Review the device setup, communication flow, and available test hardware.'},
  linux: {query:'Linux troubleshooting', experience:'I work with Linux, Ubuntu, Bash, log analysis, Wireshark, and Nmap, with experience in integration testing and protocol analysis.', step:'Review the symptoms and relevant logs to narrow down the issue.'}
};
const fields=['focus','keywords','client','project','need','experience','step','availability','question'];
const storageKey='kirsten-flexible-work-v1';
function save(){try{localStorage.setItem(storageKey,JSON.stringify(Object.fromEntries(fields.map(id=>[id,$(id).value]))));}catch{}}
function url(base,params){const result=new URL(base);Object.entries(params).forEach(([key,value])=>{if(value)result.searchParams.set(key,value);});return result.href;}
function searches(){
  const query=[profiles[$('focus').value].query,$('keywords').value.trim()].filter(Boolean).join(' ');
  $('links').replaceChildren();
  ['Philippines','United Arab Emirates','Worldwide'].forEach((location,i)=>{
    const card=document.createElement('section');card.className='card';
    const number=document.createElement('span');number.className='number';number.textContent=['PH / ASIA','AE / GULF','GLOBAL / REMOTE'][i];
    const h=document.createElement('h3');h.textContent=location;
    const p=document.createElement('p');p.textContent=['IT professionals, support, and cloud communities.','IT professional networking and task searches.','IT support communities and client task searches.'][i];
    card.append(number,h,p);
    const region=i===2?'':location;
    const items=i===0?[
      ['Facebook · Cloud Experts Group','https://www.facebook.com/groups/CloudExpertsGroup','IT community · Microsoft and cloud topics; linked by its Manila Meetup page. Networking, not a paid-task board.'],
      ['Cloud Experts · community details','https://www.meetup.com/cloud-experts-group/','Public source · read the community description and events before joining.']
    ]:i===1?[
      ['LinkedIn · UAE IT Professionals intro','https://www.linkedin.com/posts/wasim-akram-khan_please-join-this-and-repost-this-let-make-activity-7412815508997124096-ekSJ','Organizer post · introduces an IT professional group with a joining link. Referrals and networking; paid tasks not verified.']
    ]:[
      ['Reddit · hiring posts for your skills',url('https://www.reddit.com/r/forhire/search/',{q:'[Hiring] '+query,restrict_sr:'on',sort:'new'}),'Post search · skill keywords may need broadening if results are sparse.']
    ];
    items.push(
      ['Facebook · IT professional groups',url('https://www.facebook.com/search/groups/',{q:[query,region].filter(Boolean).join(' ')}),'Group search · IT communities; check whether paid requests are allowed.'],
      ['Facebook · paid IT task posts',url('https://www.facebook.com/search/posts/',{q:[query,'paid freelance',region].filter(Boolean).join(' ')}),'Post search · look for a client with a specific issue, budget, and deadline.'],
      ['LinkedIn · IT professional groups',url('https://www.linkedin.com/search/results/groups/',{keywords:[query,region].filter(Boolean).join(' ')}),'Group search · IT networking and referrals; not every group allows task posts.'],
      ['LinkedIn · paid project posts',url('https://www.linkedin.com/search/results/content/',{keywords:query+' (hiring OR paid) (freelance OR project) '+region}),'Post search · location is a keyword, not verified client eligibility.']
    );
    items.forEach(([label,href,description])=>{const a=document.createElement('a');a.href=href;a.target='_blank';a.rel='noopener noreferrer';a.textContent=label+' ↗';a.title=description;a.setAttribute('aria-label',label+' — '+location+' (new tab)');const small=document.createElement('small');small.className='link-description';small.textContent=description;a.append(small);card.append(a);});
    $('links').append(card);
  });
  const profile=profiles[$('focus').value];
  $('taskExamples').textContent=profile.tasks||({support:'Tasks to look for: one troubleshooting ticket · software setup · technical issue diagnosis',linux:'Tasks to look for: log review · package errors · Linux application troubleshooting',documentation:'Tasks to look for: setup guides · IT asset checklists · troubleshooting instructions',security:'Tasks to look for: scoped log review · security documentation · protocol analysis'}[$('focus').value]||'Choose a small IT task with a clear deliverable.');
  $('effort').textContent=profile.effort||($('focus').value==='qa'?'Smaller scope · testing checklists':'Technical task · confirm the scope');
  $('fitText').textContent=profile.fit||($('focus').value==='qa'?'Start with a defined manual test checklist or API test. Ask for expected results and a deadline.':'Choose a small, clearly defined task that you can deliver using your existing skills. Confirm the required tools and response times.');
  $('searchSummary').textContent=`IT focus: ${query}. Community references found 2 Nov 2026; private activity and paid tasks are not verified. Search links adapt to your focus. Check location and remote-work eligibility on each post.`;
  save();
}
function setProfile(){const profile=profiles[$('focus').value];$('experience').value=profile.experience;$('step').value=profile.step;}
setProfile();
try{const saved=JSON.parse(localStorage.getItem(storageKey)||'null');if(saved&&typeof saved==='object'){fields.forEach(id=>{if(typeof saved[id]==='string'){$(id).value=saved[id];}});if(!profiles[$('focus').value]){$('focus').value='support';setProfile();}}}catch{}
$('searchForm').addEventListener('submit',event=>{event.preventDefault();searches();});
$('focus').addEventListener('change',()=>{setProfile();searches();$('status').textContent='Experience template updated for this project focus.';});
$('proposalForm').addEventListener('input',save);
$('proposalForm').addEventListener('submit',event=>{event.preventDefault();const client=$('client').value.trim();$('output').value=[client?`Hi ${client},`:'Hi,',`I’m interested in your project: ${$('project').value.trim()}.`,`I understand you need: ${$('need').value.trim()}`, $('experience').value.trim(),`My first step would be to ${$('step').value.trim().replace(/^./,c=>c.toLowerCase()).replace(/[.!?]+$/,'')}.`,`Availability: ${$('availability').value.trim()}`, $('question').value.trim(),'Portfolio: https://kirstenumali.online','Best,\nKirsten Umali'].join('\n\n');$('status').textContent='Draft ready. Review the details before sending.';save();});
$('copy').addEventListener('click',async()=>{if(!$('output').value.trim()){$('status').textContent='Generate a proposal first.';return;}try{await navigator.clipboard.writeText($('output').value);$('status').textContent='Proposal copied.';}catch{$('output').focus();$('output').select();$('status').textContent='Select and copy the draft with Ctrl+C (or Command+C).';}});
searches();
