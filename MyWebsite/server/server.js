const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 8000;
const DOMAIN = 'kirstenumali.online';

// Keep credentials out of source control. Set these in server/.env on the host.
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'openai/gpt-4o';

app.use(cors());
app.use('/api/work-dashboard/waitlist', express.json({ limit: '8mb' }));
app.use('/api/work-dashboard/onboarding', express.json({ limit: '15mb' }));
app.use('/api/work-dashboard/posts', express.json({ limit: '3mb' }));
app.use(express.json({ limit: '1mb' }));
require('./work-dashboard')(app);

// Redirect IP/hostname requests to the canonical domain
app.use((req, res, next) => {
  const host = req.headers.host || '';
  const isLocalHost = host.startsWith('localhost') || host.startsWith('127.0.0.1');
  if (host && !isLocalHost && !host.includes(DOMAIN)) {
    return res.redirect(301, `https://${DOMAIN}${req.url}`);
  }
  next();
});

require('./menu-routes')(app);

// Serve static files from parent directory (where index.html is)
app.use(express.static(path.join(__dirname, '..')));

app.use('/salary', express.static(path.join(__dirname, '../bankdetails')));

// Serve the profile page at /profile
app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'profile.html'));
});

// Existing contact form endpoint
app.post('/send-telegram', async (req, res) => {
  try {
    if (!BOT_TOKEN || !CHAT_ID) {
      throw new Error('Telegram is not configured on this server.');
    }
    const { name, email, message } = req.body;

    const text = `📬 New Contact Form Submission\n\n` +
      `👤 Name: ${name}\n` +
      `📧 Email: ${email}\n` +
      `💬 Message:\n${message}`;

    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text,
        parse_mode: 'HTML'
      })
    });

    const data = await response.json();

    if (!data.ok) {
      throw new Error(data.description);
    }

    res.json({ success: true, message: 'Sent to Telegram!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// New profile submission endpoint
app.post('/submit-profile', async (req, res) => {
  try {
    if (!BOT_TOKEN || !CHAT_ID) {
      throw new Error('Telegram is not configured on this server.');
    }
    const { name, email, phone, role, message } = req.body;

    const text = `👤 New Profile Submission\n\n` +
      `👤 Name: ${name || 'N/A'}\n` +
      `📧 Email: ${email || 'N/A'}\n` +
      `📞 Phone: ${phone || 'N/A'}\n` +
      `💼 Role: ${role || 'N/A'}\n` +
      `💬 Message:\n${message || 'N/A'}`;

    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text,
        parse_mode: 'HTML'
      })
    });

    const data = await response.json();

    if (!data.ok) {
      throw new Error(data.description);
    }

    res.json({ success: true, message: 'Profile submitted!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Sends a review-only daily job digest. Jobs are supplied by the private
// dashboard; applications are never submitted automatically.
app.post('/jobapplier/digest', async (req, res) => {
  try {
    if (!BOT_TOKEN || !CHAT_ID) {
      throw new Error('Telegram is not configured on this server.');
    }

    const jobs = Array.isArray(req.body.jobs) ? req.body.jobs.slice(0, 5) : [];
    if (!jobs.length) {
      return res.status(400).json({ success: false, error: 'Choose at least one job for the digest.' });
    }

    const rows = jobs.map((job, index) =>
      `${index + 1}. ${job.title || 'Untitled role'} — ${job.company || 'Company'}\n` +
      `Match: ${job.match || '—'}% | ${job.location || 'Location not set'}\n` +
      `${job.url || ''}`
    ).join('\n\n');

    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: `💼 Job Search Copilot — today’s shortlist\n\n${rows}\n\nReview each role before applying.`,
        disable_web_page_preview: true
      })
    });
    const data = await response.json();
    if (!data.ok) throw new Error(data.description || 'Telegram delivery failed.');
    res.json({ success: true, message: 'Daily shortlist sent to Telegram.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Public job-board feeds only: no LinkedIn scraping or private credentials.
// Add another source here only after verifying that its employer-published feed
// is publicly available and permitted for this use.
app.get(['/bigcompanies/open-jobs', '/bigcompaniesuae/open-jobs'], async (req, res) => {
  try {
    const response = await fetch('https://api.lever.co/v0/postings/spotify?mode=json');
    if (!response.ok) throw new Error('Spotify’s public careers feed is unavailable.');
    const postings = await response.json();
    const jobs = (Array.isArray(postings) ? postings : []).map(job => ({
      company: 'Spotify',
      title: job.text || 'Untitled role',
      location: job.categories?.location || 'Location not listed',
      applyUrl: job.hostedUrl || 'https://jobs.lever.co/spotify'
    }));
    res.json({ success: true, jobs, sources: ['Spotify public careers feed'] });
  } catch (error) {
    res.status(502).json({ success: false, error: error.message || 'Could not load public careers feeds.' });
  }
});

// Keeps the AI provider key on the server; the browser never receives it.
app.post('/contentcreatorbuilder/generate', async (req, res) => {
  try {
    if (!OPENROUTER_API_KEY) {
      return res.status(503).json({ success: false, error: 'AI generation is not configured on this server yet.' });
    }

    const clean = (value, max = 600) => String(value || '').trim().slice(0, max);
    const profile = {
      role: clean(req.body.role, 120),
      location: clean(req.body.location, 120),
      skills: clean(req.body.skills, 300),
      format: clean(req.body.format, 80),
      tone: clean(req.body.tone, 80),
      pillar: clean(req.body.pillar, 80),
      context: clean(req.body.context, 1200),
      footage: clean(req.body.footage, 80)
    };

    const prompt = `Write one original ${profile.format || 'LinkedIn post'} for a technical creator.\n` +
      `Role: ${profile.role || 'Integration Engineer'}\nLocation: ${profile.location || 'Dubai, UAE'}\n` +
      `Skills: ${profile.skills || 'Robotics, Android, APIs, IoT, Linux, Cybersecurity'}\n` +
      `Topic pillar: ${profile.pillar || 'IT'}\nTone: ${profile.tone || 'Professional and clear'}\n` +
      `Creator's available footage: ${profile.footage || 'Not specified'}\n` +
      `Real context supplied by the creator: ${profile.context || 'No personal context supplied; use a practical, non-fictional technical insight.'}\n\n` +
      `Be specific but do not invent employers, projects, clients, metrics, credentials, or personal experiences. ` +
      `If the format is “No-voice reel storyboard”, return a 12–20 second storyboard with 3–5 timestamped shots, on-screen text, and an individually useful visual direction for each shot. Base visuals only on footage the creator can realistically capture (screen recordings, a desk, a device, notes, or a test setup). Do not suggest talking heads, fake dashboards, staged meetings, unverified results, or generic “final shot + follow prompt” endings. Vary the shot sequence and the hook from common templates. ` +
      `Return only the finished draft, with a useful hook and a concise closing question or call to action.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.SITE_URL || 'https://kirstenumali.online',
        'X-Title': 'Kirsten Content Creator Builder',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error?.message || 'OpenRouter request failed.');
    const draft = data?.choices?.[0]?.message?.content?.trim();
    if (!draft) throw new Error('The AI provider returned an empty draft.');
    res.json({ success: true, draft });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

// Start server (prefer HTTPS if certs exist, fallback to HTTP)
const fs = require('fs');
const certPath = path.join(__dirname, 'cert.pem');
const keyPath = path.join(__dirname, 'key.pem');

if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
  const https = require('https');
  const options = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
  };
  https.createServer(options, app).listen(PORT, () => {
    console.log(`HTTPS Server running on port ${PORT}`);
  });
} else {
  const http = require('http');
  http.createServer(app).listen(PORT, () => {
    console.log(`HTTP Server running on port ${PORT}`);
  });
}
