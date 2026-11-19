const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const {activeWorkers,recordChanges} = require('./team-notifications');

module.exports = function mountWorkDashboard(app) {
  const directory = path.resolve(process.env.WORK_DASHBOARD_DATA_DIR || path.join(os.homedir(), '.bugbountycompany'));
  const publicRoot = path.resolve(__dirname, '..');
  const relative = path.relative(publicRoot, directory);
  if (!relative.startsWith('..') && !path.isAbsolute(relative)) {
    throw new Error('WORK_DASHBOARD_DATA_DIR must be outside the public website folder.');
  }
  const filename = path.join(directory, 'work.json');
  const sessions = new Map();
  const attempts = new Map();
  const ttl = 8 * 60 * 60 * 1000;
  const read = () => fs.existsSync(filename) ? JSON.parse(fs.readFileSync(filename, 'utf8')) : { workers: [], tasks: [] };
  const save = (data) => {
    recordChanges(read(),data);
    fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
    fs.writeFileSync(filename + '.tmp', JSON.stringify(data), { mode: 0o600 });
    fs.renameSync(filename + '.tmp', filename);
  };
  const clean = (value, limit) => typeof value === 'string' ? value.trim().slice(0, limit) : '';
  const expiresAt = task => {
    if (task.expiresAt) return task.expiresAt;
    const date = new Date(task.createdAt);
    const day = date.getUTCDate();
    date.setUTCDate(1);
    date.setUTCMonth(date.getUTCMonth() + 1);
    const lastDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
    date.setUTCDate(Math.min(day, lastDay));
    return date.toISOString();
  };
  const expired = task => task.status !== 'Approved' && Date.now() >= new Date(expiresAt(task)).getTime();
  const equal = (a, b) => {
    const aa = crypto.createHash('sha256').update(a).digest();
    const bb = crypto.createHash('sha256').update(b).digest();
    return crypto.timingSafeEqual(aa, bb);
  };
  const hash = (password, salt) => crypto.scryptSync(password, salt, 64).toString('hex');
  const publicWorker = ({ id, username, name, jobTitle, timeZone, bankDetails, bankAccountNameProvided, onboarding }) => ({ id, username, name, jobTitle: jobTitle || '', timeZone: timeZone || '', bankDetailsSaved: Boolean(bankDetails), bankAccountNameProvided:Boolean(bankAccountNameProvided),
    onboarding: onboarding ? { status: onboarding.status, workEmail: onboarding.workEmail, documentType: onboarding.documentType, feedback: onboarding.feedback || '' } : { status: 'Not started' } });
  const keyFile = path.join(directory, 'documents.key');
  const documentKey = () => {
    fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
    if (!fs.existsSync(keyFile)) fs.writeFileSync(keyFile, crypto.randomBytes(32), { mode: 0o600, flag: 'wx' });
    return fs.readFileSync(keyFile);
  };
  require('./bounty-programs')(app);
  require('./lead-cybersecurity')(app, {read, save});
  const base = '/api/work-dashboard';
  const mountWaitlistAdmin = require('./waitlist')(app, { base, read, save, documentKey });
  const configured = () => Boolean(process.env.WORK_DASHBOARD_ADMIN_PASSWORD || read().admin);
  app.get(base + '/access', (req, res) => {
    res.set('Cache-Control', 'no-store');
    res.json({ configured: configured(), localSetup: process.env.WORK_DASHBOARD_LOCAL === '1' });
  });
  app.post(base + '/setup', (req, res) => {
    res.set('Cache-Control', 'no-store');
    const local = ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.socket.remoteAddress);
    if (process.env.WORK_DASHBOARD_LOCAL !== '1' || !local) return res.status(403).json({ error: 'Setup is available only in the local dashboard server.' });
    const origin = req.headers.origin ? new URL(req.headers.origin) : null;
    const allowedHosts = ['localhost', '127.0.0.1'];
    const allowedPort = String(process.env.PORT || 8000);
    if (origin && (origin.protocol !== 'http:' || !allowedHosts.includes(origin.hostname) || origin.port !== allowedPort)) {
      return res.status(403).json({ error: `Open setup at http://localhost:${allowedPort}/bugbountycompany/users/.` });
    }
    if (configured()) return res.status(409).json({ error: 'Admin is already configured. Sign in instead.' });
    const password = req.body.password;
    if (typeof password !== 'string' || password.length < 12 || password.length > 256) return res.status(400).json({ error: 'Choose an admin password with 12–256 characters.' });
    const data = read(), salt = crypto.randomBytes(16).toString('hex');
    data.admin = { salt, passwordHash: hash(password, salt) }; save(data);
    res.json({ ok: true });
  });
  app.use(base, (req, res, next) => {
    res.set('Cache-Control', 'no-store');
    if (!configured()) return res.status(503).json({ error: 'Set up the local admin account, or configure WORK_DASHBOARD_ADMIN_PASSWORD on your server.' });
    next();
  });
  app.post(base + '/register', (req, res) => {
    const data = read();
    const name = clean(req.body.name, 100), username = clean(req.body.username, 80).toLowerCase();
    const password = req.body.password;
    if (activeWorkers(data).length >= 6) return res.status(400).json({ error: 'The six team places are currently full.' });
    if (!name || !/^[a-z0-9._-]{3,80}$/.test(username) || username === 'admin') return res.status(400).json({ error: 'Enter a name and a username of at least 3 letters, numbers, dots, hyphens, or underscores.' });
    if (typeof password !== 'string' || password.length < 10 || password.length > 256) return res.status(400).json({ error: 'Use a password with 10–256 characters.' });
    if (data.workers.some(w => w.username === username)) return res.status(400).json({ error: 'Username already exists.' });
    const salt = crypto.randomBytes(16).toString('hex');
    const worker = { id: crypto.randomUUID(), name, username, salt, passwordHash: hash(password, salt) };
    data.workers.push(worker); save(data);
    const token = crypto.randomBytes(32).toString('hex');
    sessions.set(token, { role: 'worker', id: worker.id, expires: Date.now() + ttl });
    res.json({ token });
  });
  app.post(base + '/login', (req, res) => {
    const now = Date.now();
    for (const [key, value] of attempts) if (value.until < now) attempts.delete(key);
    for (const [key, value] of sessions) if (value.expires < now) sessions.delete(key);
    const address = req.socket.remoteAddress;
    const attempt = attempts.get(address) || { count: 0, until: now + 15 * 60 * 1000 };
    if (attempt.count >= 20) return res.status(429).json({ error: 'Too many login attempts. Try again in 15 minutes.' });
    const username = clean(req.body.username, 80).toLowerCase();
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    if (password.length > 256) return res.status(400).json({ error: 'Password is too long.' });
    const data = read();
    const worker = data.workers.find(w => w.username === username);
    const admin = username === 'admin' && (process.env.WORK_DASHBOARD_ADMIN_PASSWORD
      ? equal(password, process.env.WORK_DASHBOARD_ADMIN_PASSWORD)
      : data.admin && equal(hash(password, data.admin.salt), data.admin.passwordHash));
    const salt = worker ? worker.salt : 'unknown-account';
    const passwordHash = hash(password, salt);
    if (!admin && !(worker && equal(passwordHash, worker.passwordHash))) {
      attempt.count++;
      attempts.set(address, attempt);
      return res.status(401).json({ error: 'Incorrect username or password.' });
    }
    attempts.delete(address);
    const token = crypto.randomBytes(32).toString('hex');
    sessions.set(token, { role: admin ? 'admin' : 'worker', id: admin ? 'admin' : worker.id, expires: now + ttl });
    res.json({ token });
  });
  app.use(base, (req, res, next) => {
    const token = (req.headers.authorization || '').replace(/^Bearer /, '');
    const session = sessions.get(token);
    if (!session || session.expires < Date.now()) return res.status(401).json({ error: 'Please sign in again.' });
    req.workSession = session;
    req.workToken = token;
    next();
  });
  const adminOnly = (req, res, next) => req.workSession.role === 'admin' ? next() : res.status(403).json({ error: 'Admin access required.' });
  require('./bounty-rooms')(app, base, {read,save,actor:req=>req.workSession});
  require('./easybugs')(app, base, {read,save,actor:req=>req.workSession});
  require('./scope-helper')(app,base,{actor:req=>req.workSession});
  mountWaitlistAdmin(adminOnly);
  app.get(base + '/leads', adminOnly, (req,res) => res.json((read().leads || []).map(({id,name,username,approved})=>({id,name,username,approved}))));
  app.post(base + '/leads/:id/approve', adminOnly, (req,res) => {
    const data=read(), lead=(data.leads || []).find(l=>l.id===req.params.id);
    if(!lead) return res.status(404).json({error:'Lead account not found.'});
    lead.approved=true;save(data);res.json({ok:true});
  });
  require('./team-flows')(app, {base, read, save, adminOnly});
  app.post(base + '/daily-reminder/hide', (req,res) => {
    const data=read(), worker=data.workers.find(w=>w.id===req.workSession.id);
    if(req.workSession.role!=='worker' || !worker) return res.status(403).json({error:'User account required.'});
    worker.dailyReminderHidden=true;save(data);res.json({ok:true});
  });
  app.post(base + '/welcome/seen', (req, res) => {
    const data = read(), worker = data.workers.find(w => w.id === req.workSession.id);
    if (!worker) return res.status(403).json({ error: 'User account required.' });
    worker.welcomeSeenAt = worker.welcomeSeenAt || new Date().toISOString();
    save(data); res.json({ ok: true });
  });
  app.get(base + '/welcome', (req, res) => {
    const worker = read().workers.find(w => w.id === req.workSession.id);
    res.json({ show: Boolean(worker && !worker.welcomeSeenAt) });
  });
  app.get(base + '/bank-details', (req,res) => {
    const id = req.query.worker || req.workSession.id;
    if(id !== req.workSession.id && req.workSession.role !== 'admin') return res.status(403).json({error:'These bank details are private.'});
    const worker=read().workers.find(w=>w.id===id);
    if(!worker) return res.status(404).json({error:'Worker account not found.'});
    let details={};
    if(worker.bankDetails && req.workSession.role === 'admin'){
      const bytes=Buffer.from(worker.bankDetails,'base64');
      const decipher=crypto.createDecipheriv('aes-256-gcm',documentKey(),bytes.subarray(0,12));
      decipher.setAuthTag(bytes.subarray(12,28));
      details=JSON.parse(Buffer.concat([decipher.update(bytes.subarray(28)),decipher.final()]).toString('utf8'));
    }
    res.json({name:worker.name,username:worker.username,details,readOnly:req.workSession.role==='admin',savedAt:worker.bankDetailsUpdatedAt || null});
  });
  app.post(base + '/bank-details', (req,res) => {
    const data=read(),worker=data.workers.find(w=>w.id===req.workSession.id);
    if(!worker) return res.status(403).json({error:'Bank details must be saved by the worker.'});
    const details={};
    if(Object.prototype.hasOwnProperty.call(req.body,'description')) {
      details.description=clean(req.body.description,4000);
      if(!details.description) return res.status(400).json({error:'Paste your bank details for monthly transfers.'});
      details.accountHolder=clean(req.body.accountHolder,150);
      if(!details.accountHolder) return res.status(400).json({error:'Enter the bank account holder’s full name as shown on the bank account.'});
    } else {
    for(const field of ['accountHolder','bankName','country','currency','accountNumber','iban','swift','routingCode']) details[field]=clean(req.body[field],field==='accountHolder'||field==='bankName'?150:80);
    if(!details.accountHolder || !details.bankName || !details.country || !details.currency || (!details.accountNumber && !details.iban)) return res.status(400).json({error:'Enter the account holder, bank, country, currency, and an account number or IBAN.'});
    }
    const iv=crypto.randomBytes(12),cipher=crypto.createCipheriv('aes-256-gcm',documentKey(),iv);
    const encrypted=Buffer.concat([cipher.update(JSON.stringify(details),'utf8'),cipher.final()]);
    worker.bankDetails=Buffer.concat([iv,cipher.getAuthTag(),encrypted]).toString('base64');
    worker.bankAccountNameProvided=true;
    worker.bankDetailsUpdatedAt=new Date().toISOString();save(data);res.json({ok:true});
  });
  app.post(base + '/payments', adminOnly, (req,res) => {
    const data=read(), workerId=clean(req.body.workerId,80), month=clean(req.body.month,7);
    if(!data.workers.some(w=>w.id===workerId) || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month) || typeof req.body.paid !== 'boolean') return res.status(400).json({error:'Choose a worker, month, and payment status.'});
    data.payments=data.payments || [];
    data.payments=data.payments.filter(p=>p.workerId!==workerId || p.month!==month);
    if(req.body.paid) data.payments.push({workerId,month,amount:13,currency:'USD',markedAt:new Date().toISOString()});
    save(data);res.json({ok:true});
  });
  app.post(base + '/team-notifications/read', (req,res) => {
    const data=read(), profile=req.workSession.role==='admin' ? (data.adminProfile ||= {}) : data.workers.find(w=>w.id===req.workSession.id);
    if(!profile) return res.status(403).json({error:'Account required.'});
    const allowed=(data.teamNotifications || []).map(item=>item.id);
    const ids=Array.isArray(req.body.ids)?req.body.ids.filter(id=>typeof id==='string' && allowed.includes(id)):[];
    profile.readTeamNotifications=[...new Set([...(profile.readTeamNotifications || []),...ids])].filter(id=>allowed.includes(id));
    save(data);res.json({ok:true});
  });
  app.post(base + '/notifications/read', (req,res) => {
    const data=read(),worker=data.workers.find(w=>w.id===req.workSession.id);
    if(!worker)return res.status(403).json({error:'Worker account required.'});
    const ids=Array.isArray(req.body.ids)?req.body.ids.filter(id=>typeof id==='string').slice(0,1000):[];
    const allowed=(data.payments || []).filter(p=>p.workerId===worker.id).map(p=>p.month+'|'+p.markedAt);
    worker.readPayments=[...new Set([...(worker.readPayments || []),...ids.filter(id=>allowed.includes(id))])].filter(id=>allowed.includes(id));
    save(data);res.json({ok:true});
  });
  app.get(base + '/account', (req,res) => {
    const data=read();
    if(req.workSession.role==='admin') return res.json({name:'Team owner',username:'admin',jobTitle:data.adminProfile?.jobTitle || '',timeZone:data.adminProfile?.timeZone || ''});
    const worker=data.workers.find(w=>w.id===req.workSession.id);
    res.json(publicWorker(worker));
  });
  app.post(base + '/account', (req,res) => {
    const data=read(), jobTitle=clean(req.body.jobTitle,120);
    const profile=req.workSession.role==='admin' ? data.adminProfile || {} : data.workers.find(w=>w.id===req.workSession.id);
    const timeZone=req.body.timeZone===undefined ? profile.timeZone || '' : clean(req.body.timeZone,100);
    try { if(timeZone) new Intl.DateTimeFormat('en',{timeZone}).format(); } catch { return res.status(400).json({error:'Choose a valid timezone.'}); }
    profile.timeZone=timeZone;
    if(req.workSession.role==='admin') data.adminProfile={...profile,jobTitle};
    else data.workers.find(w=>w.id===req.workSession.id).jobTitle=jobTitle;
    save(data);res.json({ok:true,jobTitle,timeZone});
  });
  app.post(base + '/logout', (req, res) => { sessions.delete(req.workToken); res.json({ ok: true }); });
  app.get(base + '/state', (req, res) => {
    const data = read();
    const admin = req.workSession.role === 'admin';
    const posts = (data.posts || []).map(post => {
      const author = data.workers.find(w => w.id === post.authorId);
      return {...post, authorJobTitle: post.authorId === 'admin' ? data.adminProfile?.jobTitle || '' : author?.jobTitle || ''};
    });
    res.json({ role: req.workSession.role, userId: req.workSession.id, monthlyPay: 13, posts, dailyReminderHidden: admin || Boolean(data.workers.find(w=>w.id===req.workSession.id)?.dailyReminderHidden), timeZone: (admin ? data.adminProfile : data.workers.find(w=>w.id===req.workSession.id))?.timeZone || '',
      teamDirectory: {
        leads:(data.leads || []).filter(lead=>lead.approved === true).map(({name,timeZone})=>({name,timeZone:timeZone || ''})),
        workers:activeWorkers(data).map(({id,name,username,jobTitle,timeZone})=>({id,name,username,jobTitle:jobTitle || '',timeZone:timeZone || ''}))
      },
      teamNotifications:(data.teamNotifications || []).map(item=>({...item,read:Boolean((admin?data.adminProfile:data.workers.find(w=>w.id===req.workSession.id))?.readTeamNotifications?.includes(item.id))})),
      researcherAvailable:(data.leads || []).some(lead=>lead.approved === true),
      messages:(data.messages || []).filter(x=>admin || x.workerId===req.workSession.id),
      bounties:(data.bounties || []).filter(x=>admin || x.workerId===req.workSession.id),
      resignations:(data.resignations || []).filter(x=>admin || x.workerId===req.workSession.id),
      ...(admin ? {salaryReminder:require('./salary-reminder')(data)} : {}),
      payments:(data.payments || []).filter(p=>admin || p.workerId===req.workSession.id).map(p=>({...p,notificationId:p.month+'|'+p.markedAt,read:admin || Boolean(data.workers.find(w=>w.id===req.workSession.id)?.readPayments?.includes(p.month+'|'+p.markedAt))})),
      workers: data.workers.filter(w => admin || w.id === req.workSession.id).map(publicWorker),
      tasks: data.tasks.filter(t => admin || t.workerId === req.workSession.id).map(t => ({...t, expiresAt:expiresAt(t), status:expired(t)?'Expired':t.status})) });
  });
  app.post(base + '/posts', (req, res) => {
    const data = read(), content = clean(req.body.content, 6000), title = clean(req.body.title,160);
    if (!title || !content) return res.status(400).json({ error: 'Enter a title and description.' });
    const worker = data.workers.find(w => w.id === req.workSession.id);
    if (req.workSession.role !== 'admin' && worker?.onboarding?.status !== 'Approved') return res.status(403).json({ error: 'Complete Start work and wait for identity review before posting.' });
    let photo = '';
    if (req.body.photo) {
      const match = typeof req.body.photo === 'string' && req.body.photo.match(/^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/);
      if (!match || match[2].length > 2796204) return res.status(400).json({ error: 'Choose a JPEG, PNG, or WebP photo of up to 2 MB.' });
      const bytes = Buffer.from(match[2],'base64');
      const valid = (match[1]==='jpeg' && bytes.subarray(0,3).equals(Buffer.from([255,216,255]))) ||
        (match[1]==='png' && bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) ||
        (match[1]==='webp' && bytes.subarray(0,4).toString()==='RIFF' && bytes.subarray(8,12).toString()==='WEBP');
      if (!valid || bytes.length > 2*1024*1024) return res.status(400).json({ error:'Choose a valid JPEG, PNG, or WebP photo of up to 2 MB.' });
      photo = req.body.photo;
    }
    const post = { id: crypto.randomUUID(), authorId: req.workSession.id, title, photo,
      authorName: req.workSession.role === 'admin' ? 'Team owner' : worker.name,
      content, createdAt: new Date().toISOString() };
    data.posts = data.posts || []; data.posts.unshift(post); save(data);
    res.json({ ok: true });
  });
  app.post(base + '/onboarding', (req, res) => {
    const data = read(), worker = data.workers.find(w => w.id === req.workSession.id);
    if (!worker) return res.status(403).json({ error: 'Worker account required.' });
    if (['Pending review', 'Approved'].includes(worker.onboarding?.status)) return res.status(400).json({ error: 'Your verification is already submitted.' });
    const workEmail = clean(req.body.workEmail, 254);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(workEmail)) return res.status(400).json({ error: 'Enter the email you will use for work.' });
    const documentType = clean(req.body.documentType, 40);
    if (!['Passport', 'Identity document'].includes(documentType)) return res.status(400).json({ error: 'Choose a document type.' });
    const encoded = req.body.document;
    if (typeof encoded !== 'string' || encoded.length > 13981016 || !/^[A-Za-z0-9+/]+={0,2}$/.test(encoded)) return res.status(400).json({ error: 'Upload a PDF, JPEG, or PNG of up to 10 MB.' });
    const bytes = Buffer.from(encoded, 'base64');
    if (!bytes.length || bytes.length > 10 * 1024 * 1024) return res.status(400).json({ error: 'Document must be no larger than 10 MB.' });
    let mime, extension;
    if (bytes.subarray(0,5).toString() === '%PDF-') { mime='application/pdf'; extension='pdf'; }
    else if (bytes.subarray(0,3).equals(Buffer.from([255,216,255]))) { mime='image/jpeg'; extension='jpg'; }
    else if (bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) { mime='image/png'; extension='png'; }
    else return res.status(400).json({ error: 'Only PDF, JPEG, and PNG documents are supported.' });
    const iv = crypto.randomBytes(12), cipher = crypto.createCipheriv('aes-256-gcm', documentKey(), iv);
    const encrypted = Buffer.concat([cipher.update(bytes), cipher.final()]);
    const file = worker.id + '.enc';
    fs.writeFileSync(path.join(directory,file), Buffer.concat([iv,cipher.getAuthTag(),encrypted]), { mode: 0o600 });
    worker.onboarding = { workEmail, documentType, status:'Pending review', file, mime, extension };
    save(data); res.json({ ok:true });
  });
  app.get(base + '/workers/:id/document', adminOnly, (req,res) => {
    const worker = read().workers.find(w=>w.id===req.params.id);
    if (!worker?.onboarding?.file) return res.status(404).json({ error:'No document awaiting review.' });
    const bytes = fs.readFileSync(path.join(directory,worker.onboarding.file));
    const decipher = crypto.createDecipheriv('aes-256-gcm', documentKey(), bytes.subarray(0,12));
    decipher.setAuthTag(bytes.subarray(12,28));
    const document = Buffer.concat([decipher.update(bytes.subarray(28)),decipher.final()]);
    res.set({ 'Content-Type':worker.onboarding.mime, 'Content-Disposition':`attachment; filename="identity-document.${worker.onboarding.extension}"`, 'X-Content-Type-Options':'nosniff' });
    res.send(document);
  });
  app.post(base + '/workers/:id/verification', adminOnly, (req,res) => {
    const data = read(), worker = data.workers.find(w=>w.id===req.params.id);
    if (worker?.onboarding?.status !== 'Pending review') return res.status(400).json({ error:'No verification awaiting review.' });
    if (!['Approved','Changes requested'].includes(req.body.status)) return res.status(400).json({ error:'Choose a review decision.' });
    const feedback = clean(req.body.feedback,1000);
    if (req.body.status === 'Changes requested' && !feedback) return res.status(400).json({ error:'Explain what the worker needs to change.' });
    fs.unlinkSync(path.join(directory,worker.onboarding.file));
    delete worker.onboarding.file;
    worker.onboarding.status=req.body.status; worker.onboarding.feedback=feedback;
    save(data); res.json({ok:true});
  });
  app.post(base + '/posts/:id/delete', (req, res) => {
    const data = read(), post = (data.posts || []).find(p => p.id === req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found.' });
    if (post.authorId !== req.workSession.id && req.workSession.role !== 'admin') return res.status(403).json({ error: 'You can only delete your own posts.' });
    data.posts = data.posts.filter(p => p.id !== post.id); save(data); res.json({ ok: true });
  });
  app.post(base + '/workers', adminOnly, (req, res) => {
    const data = read();
    const name = clean(req.body.name, 100);
    const username = clean(req.body.username, 80).toLowerCase();
    const password = req.body.password;
    if (activeWorkers(data).length >= 6) return res.status(400).json({ error: 'All six worker accounts have been created.' });
    if (!name || !/^[a-z0-9._-]{3,80}$/.test(username) || username === 'admin') return res.status(400).json({ error: 'Enter a name and a username of at least 3 letters, numbers, dots, hyphens, or underscores.' });
    if (typeof password !== 'string' || password.length < 10 || password.length > 256) return res.status(400).json({ error: 'Use a password with 10–256 characters.' });
    if (data.workers.some(w => w.username === username)) return res.status(400).json({ error: 'Username already exists.' });
    const salt = crypto.randomBytes(16).toString('hex');
    const worker = { id: crypto.randomUUID(), name, username, salt, passwordHash: hash(password, salt) };
    data.workers.push(worker); save(data); res.json(publicWorker(worker));
  });
  app.post(base + '/tasks', adminOnly, (req, res) => {
    const data = read();
    const title = clean(req.body.title, 160), instructions = clean(req.body.instructions, 12000);
    const workerId = clean(req.body.workerId, 80), due = clean(req.body.due, 10);
    if (!title || !instructions || !data.workers.some(w => w.id === workerId)) return res.status(400).json({ error: 'Enter a title, instructions, and a worker.' });
    if (due && !/^\d{4}-\d{2}-\d{2}$/.test(due)) return res.status(400).json({ error: 'Enter a valid due date.' });
    const task = { id: crypto.randomUUID(), title, instructions, workerId, due, status: 'Assigned', createdAt: new Date().toISOString(), submissions: [], feedback: '' };
    task.expiresAt = expiresAt(task);
    data.tasks.unshift(task); save(data); res.json({ ok: true });
  });
  app.post(base + '/tasks/:id/submit', (req, res) => {
    const data = read(), task = data.tasks.find(t => t.id === req.params.id);
    if (req.workSession.role !== 'worker' || !task || task.workerId !== req.workSession.id) return res.status(403).json({ error: 'This task is not assigned to you.' });
    if (expired(task)) return res.status(400).json({ error: 'This task expired one month after assignment and no longer accepts submissions.' });
    if (!['Assigned', 'Changes requested'].includes(task.status)) return res.status(400).json({ error: 'This task is already submitted or approved.' });
    const message = clean(req.body.message, 12000), link = clean(req.body.link, 2000);
    if (!message) return res.status(400).json({ error: 'Describe the work you completed.' });
    if (link) {
      try { if (!['https:', 'http:'].includes(new URL(link).protocol)) throw new Error(); }
      catch { return res.status(400).json({ error: 'Use a full https:// or http:// work link.' }); }
    }
    task.submissions.push({ message, link, submittedAt: new Date().toISOString() });
    task.status = 'Submitted'; save(data); res.json({ ok: true });
  });
  app.post(base + '/tasks/:id/review', adminOnly, (req, res) => {
    const data = read(), task = data.tasks.find(t => t.id === req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found.' });
    if (expired(task)) return res.status(400).json({ error: 'This task has expired and can no longer be reviewed.' });
    if (task.status !== 'Submitted') return res.status(400).json({ error: 'Only submitted work can be reviewed.' });
    if (!['Approved', 'Changes requested'].includes(req.body.status)) return res.status(400).json({ error: 'Select a review decision.' });
    const feedback = clean(req.body.feedback, 4000);
    if (req.body.status === 'Changes requested' && !feedback) return res.status(400).json({ error: 'Explain what needs changing.' });
    task.status = req.body.status; task.feedback = feedback; save(data); res.json({ ok: true });
  });
};
