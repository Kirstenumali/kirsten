const crypto = require('crypto');
module.exports = (app, {read, save}) => {
  const base = '/api/lead-cybersecurity', sessions = new Map(), attempts = new Map();
  const clean = (v,n) => typeof v === 'string' ? v.trim().slice(0,n) : '';
  const hash = (password,salt) => crypto.scryptSync(password,salt,64).toString('hex');
  app.use(base, (req,res,next) => {res.set('Cache-Control','no-store');next();});
  app.use(base, (req,res,next) => {
    if (!['/login','/register'].includes(req.path) || req.method !== 'POST') return next();
    const key=req.socket.remoteAddress, now=Date.now();
    for(const [key,item] of attempts) if(item.until<now) attempts.delete(key);
    const item=attempts.get(key) || {count:0,until:now+900000};
    if(item.count>=20) return res.status(429).json({error:'Too many attempts. Try again in 15 minutes.'});
    item.count++; attempts.set(key,item); next();
  });
  app.post(base+'/register', (req,res) => {
    const name=clean(req.body.name,100), username=clean(req.body.username,80).toLowerCase(), password=req.body.password;
    if(!name || !/^[a-z0-9._-]{3,80}$/.test(username) || username==='admin' || typeof password!=='string' || password.length<10 || password.length>256) return res.status(400).json({error:'Enter your name, a valid username (3–80 characters), and a password (10–256 characters).'});
    const data=read(); data.leads ||= [];
    if(data.leads.some(l=>l.username===username)) return res.status(409).json({error:'Username already exists.'});
    const salt=crypto.randomBytes(16).toString('hex');
    data.leads.push({id:crypto.randomUUID(),name,username,salt,passwordHash:hash(password,salt),approved:false});save(data);
    res.status(201).json({message:'Account created. Ask the admin to approve your Lead Cybersecurity account before signing in.'});
  });
  app.post(base+'/login', (req,res) => {
    const username=clean(req.body.username,80).toLowerCase(), password=req.body.password;
    if(typeof password!=='string' || password.length>256) return res.status(400).json({error:'Enter a valid password.'});
    const lead=(read().leads || []).find(l=>l.username===username);
    const result=hash(password,lead?.salt || 'unknown-lead');
    if(!lead || !crypto.timingSafeEqual(Buffer.from(result,'hex'),Buffer.from(lead.passwordHash,'hex'))) return res.status(401).json({error:'Incorrect username or password.'});
    if(!lead.approved) return res.status(403).json({error:'Your account is waiting for admin approval.'});
    for(const [key,value] of sessions) if(value.expires<Date.now()) sessions.delete(key);
    const token=crypto.randomBytes(32).toString('hex');sessions.set(token,{id:lead.id,expires:Date.now()+8*3600000});res.json({token});
  });
  app.use(base,(req,res,next)=>{
    const token=(req.headers.authorization || '').replace(/^Bearer /,''), session=sessions.get(token);
    const lead=session && (read().leads || []).find(l=>l.id===session.id && l.approved);
    if(!session || session.expires<Date.now() || !lead) return res.status(401).json({error:'Please sign in as Lead Cybersecurity.'});
    req.lead=lead;req.leadToken=token;next();
  });
  require('./bounty-rooms')(app,base,{read,save,actor:req=>({role:'lead',id:req.lead.id})});
  require('./easybugs')(app,base,{read,save,actor:req=>({role:'lead',id:req.lead.id})});
  require('./scope-helper')(app,base,{actor:req=>({role:'lead',id:req.lead.id})});
  app.get(base+'/state',(req,res)=>{const data=read();res.json({name:req.lead.name,workers:data.workers.map(w=>({id:w.id,name:w.name})),messages:data.messages || []});});
  app.post(base+'/messages',(req,res)=>{
    const data=read(), workerId=clean(req.body.workerId,80), content=clean(req.body.content,4000);
    if(!content || !data.workers.some(w=>w.id===workerId)) return res.status(400).json({error:'Choose a member and enter a message.'});
    (data.messages ||= []).push({id:crypto.randomUUID(),workerId,leadId:req.lead.id,from:'Lead Cybersecurity · '+req.lead.name,content,createdAt:new Date().toISOString()});save(data);res.json({ok:true});
  });
  app.post(base+'/logout',(req,res)=>{sessions.delete(req.leadToken);res.json({ok:true});});
};
