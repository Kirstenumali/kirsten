const companies = [
  { name: 'G42', location: 'Abu Dhabi, UAE', sector: 'AI · Cloud · Cybersecurity', focus: 'AI, cloud, cyber defence, data platforms, and systems engineering.', tags: ['AI', 'Cloud', 'Cybersecurity', 'APIs'], filters: ['uae', 'cyber', 'cloud'], official: 'https://www.g42.ai/careers', linkedin: 'https://www.linkedin.com/jobs/search/?keywords=G42&location=United%20Arab%20Emirates', fit: 91, reason: 'Security, cloud, integration, and technical-systems overlap' },
  { name: 'e& / e& enterprise', location: 'UAE', sector: 'Telecom · Digital services · Cybersecurity', focus: 'Large regional technology group with digital, cybersecurity, cloud, and enterprise-services teams.', tags: ['Cybersecurity', 'Cloud', 'Networks', 'APIs'], filters: ['uae', 'cyber', 'cloud'], official: 'https://careers.etisalat.ae/en/index.html', linkedin: 'https://www.linkedin.com/jobs/search/?keywords=e%26%20enterprise&location=United%20Arab%20Emirates', fit: 90, reason: 'Strong fit for security-aware integration and network systems' },
  { name: 'Emirates Group', location: 'Dubai, UAE', sector: 'Aviation · Digital · Cybersecurity', focus: 'Technology teams covering airline, travel, data, infrastructure, and cybersecurity systems.', tags: ['IT', 'Cybersecurity', 'Mobile', 'APIs'], filters: ['uae', 'cyber', 'cloud'], official: 'https://www.emiratesgroupcareers.com/information-technology/', linkedin: 'https://www.linkedin.com/jobs/search/?keywords=Emirates%20Group%20technology&location=Dubai', fit: 87, reason: 'Relevant to application, integration, and security-minded technical work' },
  { name: 'Microsoft', location: 'Dubai, UAE · Global', sector: 'Cloud · AI · Security', focus: 'Cloud, AI, customer engineering, technical services, and cybersecurity opportunities.', tags: ['Azure', 'Cloud', 'Security', 'Developer tools'], filters: ['uae', 'cyber', 'cloud'], official: 'https://careers.microsoft.com/v2/global/en/locations/dubai.html', linkedin: 'https://www.linkedin.com/jobs/search/?keywords=Microsoft%20cloud%20security&location=Dubai', fit: 85, reason: 'Cloud, APIs, secure systems, and technical customer work' },
  { name: 'Cisco', location: 'UAE · Global', sector: 'Networking · Cybersecurity · IoT', focus: 'Network infrastructure, cybersecurity, observability, collaboration, and connected systems.', tags: ['Networking', 'Security', 'IoT', 'APIs'], filters: ['uae', 'cyber', 'systems'], official: 'https://jobs.cisco.com/', linkedin: 'https://www.linkedin.com/jobs/search/?keywords=Cisco%20network%20security&location=United%20Arab%20Emirates', fit: 89, reason: 'Excellent network-security and systems-integration alignment' },
  { name: 'Siemens', location: 'UAE · Global', sector: 'Industrial automation · IoT · Digital', focus: 'Industrial software, smart infrastructure, automation, and digitalization teams.', tags: ['IoT', 'Automation', 'Embedded', 'Software'], filters: ['uae', 'systems'], official: 'https://jobs.siemens.com/careers', linkedin: 'https://www.linkedin.com/jobs/search/?keywords=Siemens%20IoT%20automation&location=United%20Arab%20Emirates', fit: 86, reason: 'Robotics, embedded, integration, and device-to-cloud strengths' },
  { name: 'Schneider Electric', location: 'UAE · Global', sector: 'Energy management · Industrial IoT', focus: 'Digital energy, automation, connected products, and industrial technology.', tags: ['IoT', 'Automation', 'Cloud', 'Cybersecurity'], filters: ['uae', 'systems', 'cloud'], official: 'https://www.se.com/ww/en/about-us/careers/', linkedin: 'https://www.linkedin.com/jobs/search/?keywords=Schneider%20Electric%20IoT&location=United%20Arab%20Emirates', fit: 84, reason: 'Connected systems and practical integration background' },
  { name: 'Amazon Web Services', location: 'UAE · Global', sector: 'Cloud · Infrastructure · Security', focus: 'Cloud infrastructure, solutions architecture, technical account, security, and developer-facing roles.', tags: ['AWS', 'Cloud', 'Security', 'APIs'], filters: ['uae', 'cloud', 'cyber'], official: 'https://www.amazon.jobs/en/teams/amazon-web-services', linkedin: 'https://www.linkedin.com/jobs/search/?keywords=AWS%20cloud%20security&location=United%20Arab%20Emirates', fit: 83, reason: 'AWS learning plus integration and secure API foundations' }
];
const requestedTargets = [
  'Google', 'Sony', 'Netflix', 'JBL / HARMAN', 'RTA', 'DNV', 'Emaar', 'Mashreq', 'Dubai Islamic Bank', 'Nestlé', 'First Abu Dhabi Bank', 'flydubai', 'Busaus', 'OpenText', 'Oracle', 'Redington', 'Trends', 'Marriott International', 'du', 'Dubai Municipality', 'Dubai Police', 'Abu Dhabi Police', 'Dubai Government', 'Mediclinic', 'BMW', 'Tesla', 'Hermès', 'DAMAC', 'Gulf News', 'Khaleej Times', 'Emarat', 'ENOC', 'OpenAI', 'INTERPOL', 'Deloitte', 'Emirates NBD', 'SolarWinds', 'Moro Hub', 'DEWA', 'Huawei', 'Intel', 'Samsung', 'Nokia', 'SAP', 'Dell Technologies', 'Accenture', 'Cognizant', 'Tata Consultancy Services', 'Mercedes-Benz', 'Spotify', 'Bosch', 'Apple', 'ITHD LLC', 'Forfront', 'ASBIS',
  'NVIDIA', 'Adobe', 'Salesforce', 'Lenovo', 'Hewlett Packard Enterprise (HPE)', 'AMD', 'Qualcomm', 'ServiceNow', 'Workday', 'Fortinet', 'Palo Alto Networks', 'Infosys', 'Wipro', 'Capgemini', 'HCLTech', 'PayPal', 'Shopify'
];
const uaeTargets = new Set(['RTA', 'Emaar', 'Mashreq', 'Dubai Islamic Bank', 'First Abu Dhabi Bank', 'flydubai', 'Redington', 'Trends', 'du', 'Dubai Municipality', 'Dubai Police', 'Abu Dhabi Police', 'Dubai Government', 'Mediclinic', 'DAMAC', 'Gulf News', 'Khaleej Times', 'Emarat', 'ENOC', 'Emirates NBD', 'Moro Hub', 'DEWA', 'ITHD LLC', 'Forfront']);
const knownNames = new Set(companies.map(company => company.name.toLowerCase()));
requestedTargets.forEach((name, index) => {
  if (knownNames.has(name.toLowerCase())) return;
  knownNames.add(name.toLowerCase());
  const isUae = uaeTargets.has(name);
  companies.push({
    name,
    location: isUae ? 'UAE priority' : 'Global · Check UAE roles',
    sector: 'Target employer',
    focus: 'Included in your selected company list. Use LinkedIn to see current roles and verify eligibility on the employer’s official careers site.',
    tags: isUae ? ['UAE', 'Target list'] : ['Global', 'Target list'],
    filters: isUae ? ['uae'] : [],
    linkedin: 'https://www.linkedin.com/jobs/search/?keywords=' + encodeURIComponent(name) + '&location=' + (isUae ? 'United%20Arab%20Emirates' : 'United%20Arab%20Emirates'),
    fit: 72 + (index % 10),
    reason: 'Selected target employer — review open technical roles'
  });
});

const companyLinks = {"Lenovo":["https://www.lenovo.com/","https://jobs.lenovo.com/"],"PayPal":["https://www.paypal.com/","https://careers.pypl.com/"],"Infosys":["https://www.infosys.com/","https://www.infosys.com/careers/"],"Apple":["https://www.apple.com/","https://www.apple.com/careers/"],"Workday":["https://www.workday.com/","https://www.workday.com/en-us/company/careers/overview.html"],"Hewlett Packard Enterprise (HPE)":["https://www.hpe.com/","https://careers.hpe.com/"],"Salesforce":["https://www.salesforce.com/","https://careers.salesforce.com/"],"Tata Consultancy Services":["https://www.tcs.com/","https://www.tcs.com/careers"],"Wipro":["https://www.wipro.com/","https://careers.wipro.com/"],"Capgemini":["https://www.capgemini.com/","https://www.capgemini.com/careers/"],"Cognizant":["https://www.cognizant.com/","https://careers.cognizant.com/"],"Fortinet":["https://www.fortinet.com/","https://www.fortinet.com/corporate/careers"],"Palo Alto Networks":["https://www.paloaltonetworks.com/","https://jobs.paloaltonetworks.com/"],"Adobe":["https://www.adobe.com/","https://careers.adobe.com/"],"ServiceNow":["https://www.servicenow.com/","https://careers.servicenow.com/"],"Qualcomm":["https://www.qualcomm.com/","https://careers.qualcomm.com/"],"NVIDIA":["https://www.nvidia.com/","https://www.nvidia.com/en-us/about-nvidia/careers/"],"HCLTech":["https://www.hcltech.com/","https://careers.hcltech.com/"],"Shopify":["https://www.shopify.com/","https://www.shopify.com/careers"],"AMD":["https://www.amd.com/","https://careers.amd.com/"]};
companies.forEach(company => {
  const links = companyLinks[company.name];
  if (links) {
    company.website = links[0];
    company.official = links[1];
  }
  company.linkedin = 'https://www.linkedin.com/jobs/search/?keywords=' + encodeURIComponent(company.name) + '&location=United%20Arab%20Emirates&geoId=104305776';
});
const list = document.querySelector('#companyList');
const search = document.querySelector('#search');
const count = document.querySelector('#resultCount');
let active = 'all';
let recentOnly = false;
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
const withRecentFilter = url => recentOnly ? url + '&f_TPR=r86400' : url;

function render() {
  const query = search.value.trim().toLowerCase();
  const matching = companies.filter(company => {
    const text = [company.name, company.location, company.sector, company.focus, ...company.tags].join(' ').toLowerCase();
    return (active === 'all' || company.filters.includes(active)) && text.includes(query);
  }).sort((first, second) => second.fit - first.fit || first.name.localeCompare(second.name));
  list.innerHTML = matching.map(company => '<article class="company"><div class="company-top"><div><h2>' + escapeHtml(company.name) + '</h2><p class="sector">' + escapeHtml(company.sector) + '</p></div><div><span class="fit-score">' + company.fit + '% fit</span><span class="model">' + escapeHtml(company.location) + '</span></div></div><p>' + escapeHtml(company.focus) + '</p><small class="fit-reason">' + escapeHtml(company.reason) + '</small><div class="tags">' + company.tags.map(tag => '<span class="tag">' + escapeHtml(tag) + '</span>').join('') + '</div><div class="links"><a href="' + withRecentFilter(company.linkedin) + '" target="_blank" rel="noopener">LinkedIn jobs · UAE ↗</a>' + (company.official ? '<a href="' + company.official + '" target="_blank" rel="noopener">Official careers ↗</a>' : '') + (company.website ? '<a href="' + company.website + '" target="_blank" rel="noopener">Company website ↗</a>' : '') + '</div></article>').join('') || '<p>No companies match those filters. Try another skill or location.</p>';
  count.textContent = matching.length + ' ' + (matching.length === 1 ? 'company' : 'companies') + ' shown';
}

document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  active = button.dataset.filter;
  document.querySelectorAll('.filter').forEach(item => item.classList.toggle('active', item === button));
  render();
}));
search.addEventListener('input', () => {
  const words = search.value.trim() || 'integration engineer cybersecurity';
  document.querySelector('#linkedinSearch').href = withRecentFilter('https://www.linkedin.com/jobs/search/?keywords=' + encodeURIComponent(words) + '&location=United%20Arab%20Emirates');
  render();
});
document.querySelector('#refresh').addEventListener('click', () => {
  recentOnly = true;
  const words = search.value.trim() || 'integration engineer cybersecurity';
  document.querySelector('#linkedinSearch').href = withRecentFilter('https://www.linkedin.com/jobs/search/?keywords=' + encodeURIComponent(words) + '&location=United%20Arab%20Emirates');
  document.querySelector('#refreshStatus').textContent = 'Updated ' + new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date()) + ' — LinkedIn links now show postings from the past 24 hours.';
  render();
  loadLiveJobs();
});
const technicalRole = /\b(engineer|engineering|security|developer|software|data|platform|technology|technical|infrastructure|analytics|cloud|devops|it)\b/i;
const toSpotifyJob = job => ({ company: 'Spotify', title: job.text || 'Untitled role', location: job.categories?.location || 'Location not listed', applyUrl: job.hostedUrl || 'https://jobs.lever.co/spotify' });

async function fetchSpotifyDirect() {
  const response = await fetch('https://api.lever.co/v0/postings/spotify?mode=json');
  if (!response.ok) throw new Error('Spotify’s public careers feed is unavailable.');
  const postings = await response.json();
  return (Array.isArray(postings) ? postings : []).map(toSpotifyJob);
}

function showLiveJobs(jobs, source) {
  const status = document.querySelector('#feedStatus');
  const container = document.querySelector('#liveJobs');
  const priorityJobs = jobs.filter(job => technicalRole.test(job.title)).slice(0, 6);
  if (!priorityJobs.length) {
    container.innerHTML = '<span>No live IT roles match the current official feed. Use the company cards below to search LinkedIn.</span>';
    status.textContent = 'The official feed is live, but has no matching IT roles right now.';
    return;
  }
  container.innerHTML = priorityJobs.map(job => '<article class="live-job"><a href="' + escapeHtml(job.applyUrl) + '" target="_blank" rel="noopener">Apply now · ' + escapeHtml(job.title) + ' ↗</a><span>' + escapeHtml(job.company) + ' · ' + escapeHtml(job.location || 'Location not listed') + '</span></article>').join('');
  status.textContent = priorityJobs.length + ' live IT role' + (priorityJobs.length === 1 ? '' : 's') + ' from ' + source + '.';
}

async function loadLiveJobs() {
  const status = document.querySelector('#feedStatus');
  const container = document.querySelector('#liveJobs');
  status.textContent = 'Checking priority IT roles…';
  try {
    const response = await fetch('/bigcompanies/open-jobs');
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'The official feeds are unavailable.');
      showLiveJobs(data.jobs || [], 'the connected official careers feed');
      return;
    }
    const jobs = await fetchSpotifyDirect();
    showLiveJobs(jobs, 'Spotify’s public careers feed');
  } catch (localError) {
    try {
      const jobs = await fetchSpotifyDirect();
      showLiveJobs(jobs, 'Spotify’s public careers feed');
    } catch (directError) {
      container.innerHTML = '';
      status.textContent = 'Live IT roles could not be loaded right now. Use the LinkedIn links below.';
    }
  }
}
document.querySelector('#updated').textContent = 'Company pages checked: 29 October 2026 · Always confirm each individual opening.';
render();
loadLiveJobs();
