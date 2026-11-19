const keywords = document.querySelector('#keywords');
const region = document.querySelector('#region');
const searchLink = document.querySelector('#searchLink');
const quickLinks = document.querySelector('#quickLinks');
const status = document.querySelector('#status');
let mode = 'remote'; let latestOnly = false;
const lanes = [
  ['Europe-wide engineering', 'Europe', 'Integration, software, Android, robotics, and IoT roles', ['integration', 'android', 'robotics', 'iot', 'api', 'software']],
  ['Spain technology', 'Spain', 'Remote and hybrid technology opportunities across Spain', ['integration', 'android', 'iot', 'api', 'software', 'security']],
  ['Germany engineering', 'Germany', 'Engineering and technical roles across Germany', ['integration', 'robotics', 'iot', 'software', 'linux', 'api']],
  ['Netherlands technology', 'Netherlands', 'Hybrid-friendly technology and platform roles', ['android', 'integration', 'software', 'api', 'security', 'iot']],
  ['UK technology', 'United Kingdom', 'Remote and hybrid technical opportunities', ['integration', 'android', 'security', 'software', 'api', 'robotics']],
  ['Nordic engineering', 'Sweden', 'Sweden and Nordic-region technology roles', ['robotics', 'iot', 'embedded', 'linux', 'integration', 'security']],
  ['Ireland technology', 'Ireland', 'Engineering and integration jobs in Ireland', ['integration', 'android', 'iot', 'api', 'security', 'software']]
];
function workType() { return mode === 'remote' ? 'Remote' : mode === 'hybrid' ? 'Hybrid' : 'Remote OR Hybrid'; }
function urlFor(words, place, recent = false) { const query = `${words} ${workType()}`; return `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(query)}&location=${encodeURIComponent(place)}${recent ? '&f_TPR=r86400' : ''}`; }
function scoreLane(place, skills) { const terms = keywords.value.toLowerCase().match(/[a-z+#]+/g) || []; const matched = skills.filter(skill => terms.includes(skill)); const placeBoost = region.value === place ? 8 : region.value === 'Europe' && place !== 'Europe' ? 4 : 0; const modeBoost = mode === 'both' ? 5 : 8; const score = Math.min(96, 62 + matched.length * 4 + placeBoost + modeBoost); const reason = matched.length ? `${matched.slice(0, 3).join(', ')} skills align${placeBoost ? ' · selected location' : ''}` : `Strong technical baseline${placeBoost ? ' · selected location' : ''}`; return { score, reason }; }
function render() { const words = keywords.value.trim() || 'integration engineer robotics Android IoT'; searchLink.href = urlFor(words, region.value, latestOnly); quickLinks.innerHTML = lanes.map(([title, place, description, skills]) => { const fit = scoreLane(place, skills); return `<a class="lane" href="${urlFor(words, place, true)}" target="_blank" rel="noopener"><div class="lane-head"><span>${place}</span><b>${fit.score}% match</b></div><h3>${title}</h3><p>${description}</p><small>${fit.reason}</small><strong>${workType()} · past 24 hours ↗</strong></a>`; }).join(''); }
document.querySelectorAll('.mode').forEach(button => button.addEventListener('click', () => { mode = button.dataset.mode; document.querySelectorAll('.mode').forEach(item => item.classList.toggle('active', item === button)); render(); }));
keywords.addEventListener('input', render); region.addEventListener('change', render);
document.querySelector('#refresh').addEventListener('click', () => { const now = new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date()); latestOnly = true; status.textContent = `Updated ${now} — all links now use LinkedIn’s past-24-hours filter.`; render(); });
render();
