const zoneSelect=document.querySelector('#time-zone');
const deviceZone=Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
const common={'UTC':'UTC · Coordinated Universal Time','America/New_York':'United States · New York (Eastern)','America/Chicago':'United States · Chicago (Central)','America/Denver':'United States · Denver (Mountain)','America/Los_Angeles':'United States · Los Angeles (Pacific)','America/Phoenix':'United States · Arizona','Pacific/Honolulu':'United States · Hawaii','America/Anchorage':'United States · Alaska','Asia/Dubai':'United Arab Emirates · Dubai','Asia/Manila':'Philippines · Manila','Asia/Kolkata':'India · Kolkata','Europe/London':'United Kingdom · London'};
const all=typeof Intl.supportedValuesOf==='function'?Intl.supportedValuesOf('timeZone'):Object.keys(common);
zoneSelect.add(new Option('Use device timezone ('+deviceZone+')',''));
const featured=document.createElement('optgroup');featured.label='Common countries and timezones';zoneSelect.append(featured);
for(const [zone,label] of Object.entries(common))featured.append(new Option(label,zone));
const others=document.createElement('optgroup');others.label='Other countries · select your region / city';zoneSelect.append(others);
for(const zone of [...new Set([...all,deviceZone])].sort())if(!common[zone])others.append(new Option(zone.replaceAll('_',' '),zone));
function updateClock(){const zone=zoneSelect.value || deviceZone;document.querySelector('#local-clock').textContent=new Intl.DateTimeFormat(undefined,{timeZone:zone,hour:'2-digit',minute:'2-digit',hour12:true}).format(new Date());}
zoneSelect.addEventListener('change',updateClock);updateClock();setInterval(updateClock,10000);
