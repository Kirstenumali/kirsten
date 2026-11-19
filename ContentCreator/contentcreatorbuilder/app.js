const $ = selector => document.querySelector(selector);
const KEY = 'kirsten-content-studio-v2';
let saved = JSON.parse(localStorage.getItem(KEY) || '[]');
let current = '';
let reelIndex = 0;

const ideas = {
  Robotics: ['Why a robot demo can look finished before the real work has started', 'The small test that catches a physical-system problem early', 'What a smooth robot experience depends on behind the screen'],
  Android: ['Why clear failure states matter more than a perfect happy path', 'The Android check worth making before calling an integration done', 'What makes a control screen feel dependable instead of fragile'],
  'APIs & integration': ['The API detail that quietly breaks a customer experience', 'How to turn a vague integration issue into a useful test case', 'Why integration is less about connectors and more about shared assumptions'],
  'IoT & embedded': ['The gap between a connected-device prototype and a dependable product', 'What device testing teaches us about real-world edge cases', 'Why a device is only as useful as the system around it'],
  Cybersecurity: ['The security question to ask before trusting a new connection', 'Why useful logs matter before a security issue becomes urgent', 'How secure defaults make everyday engineering decisions easier'],
  'Career growth': ['A practical way to turn a project lesson into career momentum', 'Why technical range is valuable when it stays connected to real outcomes', 'The beginner question that leads to a better engineering habit']
};

function toast(message) {
  const element = $('#toast');
  element.textContent = message;
  element.classList.add('show');
  setTimeout(() => element.classList.remove('show'), 2800);
}

function pickTopic(random) {
  const typed = $('#context').value.trim();
  const pillar = $('#pillar').value;
  return random || !typed ? ideas[pillar][Math.floor(Math.random() * ideas[pillar].length)] : typed;
}

function postDraft(topic, format) {
  const role = $('#role').value || 'Integration Engineer';
  const location = $('#location').value || 'Dubai, UAE';
  const pillar = $('#pillar').value;
  const hook = topic.charAt(0).toUpperCase() + topic.slice(1) + '.';
  if (format === 'Carousel outline') return hook + '\n\n1. The question worth asking\n2. The assumption that causes trouble\n3. What is happening underneath\n4. A simple check to try\n5. The principle to keep';
  if (format === 'Technical thread') return '1/ ' + hook + '\n\n2/ As a ' + role + ' based in ' + location + ', I think this deserves more attention.\n\n3/ The useful part is making the decision, risk, and next practical check clear.\n\n4/ What would you check first?\n\n#Engineering #' + pillar.replace(/[^a-z]/gi, '');
  if (format === 'Instagram caption') return hook + '\n\nAs a ' + role + ' based in ' + location + ', I think this deserves more attention.\n\nThe useful part is making the decision, risk, and next practical check clear.\n\nWhat is one assumption you now test before you build?\n\n#Technology #' + pillar.replace(/[^a-z]/gi, '') + ' #Engineering';
  return hook + '\n\nAs a ' + role + ' based in ' + location + ', I think this deserves more attention.\n\nThe useful part is not sounding technical—it is making the decision, risk, and next practical check clear.\n\nA better question is often more useful than a louder claim.';
}

function shot(footage, screen, practical) {
  if (footage === 'screen') return screen;
  if (footage === 'desk') return practical;
  return screen + ' or ' + practical;
}

function reelDraft(topic) {
  const pillar = $('#pillar').value;
  const footage = $('#footage').value;
  const sources = {
    Robotics: ['a short robot movement or simulator clip', 'a close shot of a test setup'],
    Android: ['a screen recording of one app state', 'a close shot of a phone running the app'],
    'APIs & integration': ['a cropped request/response or architecture sketch', 'a notebook showing the system flow'],
    'IoT & embedded': ['a close device signal or serial-log recording', 'a close shot of a device, cable, or test bench'],
    Cybersecurity: ['a redacted log, packet view, or checklist', 'a neutral shot of a laptop and security notes'],
    'Career growth': ['a simple note, sketch, or project board', 'a desk shot of notes and a working setup']
  };
  const source = sources[pillar];
  const visual = (screen, practical) => shot(footage, screen || source[0], practical || source[1]);
  const hook = topic.charAt(0).toUpperCase() + topic.slice(1);
  const templates = [
    '0–2s — TEXT: “' + hook + '”\nVISUAL: ' + visual('A clean title over a blurred screen capture', 'A steady close-up of your desk or notebook') + '\n\n2–5s — TEXT: “The assumption”\nVISUAL: ' + visual() + '\n\n5–9s — TEXT: “What to check instead”\nVISUAL: ' + visual('A three-item checklist typed on screen', 'Your hand marking a three-item checklist') + '\n\n9–13s — TEXT: “Make the next test obvious.”\nVISUAL: ' + visual('The final checklist item highlighted', 'A clean closing shot of the setup'),
    '0–3s — TEXT: “Before you call it done…”\nVISUAL: ' + visual() + '\n\n3–6s — TEXT: “Ask: ' + hook + '”\nVISUAL: ' + visual('A plain text note or diagram—not a fake dashboard', 'A slow pan across the relevant component') + '\n\n6–10s — TEXT: “Test one assumption.”\nVISUAL: ' + visual('A short, redacted test clip', 'A real setup or object you are testing') + '\n\n10–14s — TEXT: “Small checks prevent expensive surprises.”\nVISUAL: ' + visual('A calm end frame with your handle', 'A still closing desk shot'),
    '0–2s — TEXT: “A practical engineering habit”\nVISUAL: ' + visual('A note app opening with one short sentence', 'A notebook opening at a simple sketch') + '\n\n2–6s — TEXT: “' + hook + '”\nVISUAL: ' + visual() + '\n\n6–10s — TEXT: “Write down what must be true.”\nVISUAL: ' + visual('A short assumptions list', 'Writing one assumption on paper') + '\n\n10–15s — TEXT: “Then test the riskiest one first.”\nVISUAL: ' + visual('A single test result or check mark', 'A final shot of the setup—not a staged success claim')
  ];
  const sequence = templates[reelIndex % templates.length];
  reelIndex += 1;
  return 'NO-VOICE REEL · 12–15 seconds\n\n' + sequence + '\n\nEditing: use clean cuts and captions; keep each text card to one idea. Audio: a subtle instrumental track. Only show footage you have permission to use.';
}

function makeLocalDraft(random) {
  const format = $('#format').value;
  const tone = $('#tone').value;
  const topic = pickTopic(random);
  const body = format === 'No-voice reel storyboard' ? reelDraft(topic) : postDraft(topic, format);
  current = format + ' · ' + tone + '\n\n' + body;
  $('#draftTitle').textContent = topic;
  $('#draftTag').textContent = 'LOCAL';
  $('#draft').textContent = current;
}

function updateReelSettings() {
  $('#reelSettings').hidden = $('#format').value !== 'No-voice reel storyboard';
}

async function generateAiDraft() {
  const button = $('#generate');
  button.disabled = true;
  button.textContent = 'Generating…';
  try {
    const response = await fetch('/contentcreatorbuilder/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: $('#role').value, location: $('#location').value, skills: $('#skills').value, format: $('#format').value, tone: $('#tone').value, pillar: $('#pillar').value, context: $('#context').value, footage: $('#footage').value })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    current = data.draft;
    $('#draftTitle').textContent = $('#pillar').value + ' draft';
    $('#draftTag').textContent = 'AI';
    $('#draft').textContent = current;
    toast('AI draft ready.');
  } catch (error) {
    makeLocalDraft(false);
    toast((error.message || 'AI unavailable.') + ' A local draft was created instead.');
  } finally {
    button.disabled = false;
    button.textContent = 'Generate a draft';
  }
}

function renderSaved() {
  const list = $('#savedList');
  list.innerHTML = saved.length ? saved.map((draft, index) => '<article class="saved-item"><strong>Draft ' + (saved.length - index) + '</strong><p>' + draft.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</p></article>').join('') : '<p class="muted">No saved drafts yet.</p>';
}

$('#generate').onclick = generateAiDraft;
$('#random').onclick = () => { makeLocalDraft(true); toast('A fresh direction is ready.'); };
$('#format').onchange = updateReelSettings;
document.querySelectorAll('[data-idea]').forEach(button => {
  button.onclick = () => { $('#context').value = button.dataset.idea; makeLocalDraft(false); toast('Direction added to your draft.'); };
});
$('#copy').onclick = async () => {
  if (!current) return toast('Generate a draft first.');
  try { await navigator.clipboard.writeText(current); toast('Draft copied.'); } catch { toast('Copy is unavailable in this browser.'); }
};
$('#save').onclick = () => {
  if (!current) return toast('Generate a draft first.');
  saved.unshift(current);
  localStorage.setItem(KEY, JSON.stringify(saved));
  renderSaved();
  toast('Draft saved locally.');
};
$('#clear').onclick = () => {
  saved = [];
  localStorage.removeItem(KEY);
  renderSaved();
  toast('Saved drafts cleared.');
};

updateReelSettings();
renderSaved();
