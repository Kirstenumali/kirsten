const express = require('express');
const crypto = require('crypto');

module.exports = (app, {base, read, save, documentKey}) => {
  const purgeDownloaded = () => {
    const data=read(), entries=data.waitlist || [];
    const remaining=entries.filter(entry=>!entry.deleteAt || entry.deleteAt>Date.now());
    if(remaining.length!==entries.length){data.waitlist=remaining;save(data);}
    return data;
  };
  const scheduleDeletion = deleteAt => {
    const timer=setTimeout(purgeDownloaded,Math.max(0,deleteAt-Date.now()));
    timer.unref();
  };
  for(const entry of purgeDownloaded().waitlist || []) if(entry.deleteAt) scheduleDeletion(entry.deleteAt);
  app.post(base + '/waitlist', express.json({limit:'8mb'}), (req, res) => {
    const {name, email, cv} = req.body;
    if (typeof name !== 'string' || !name.trim() || name.length > 100 || typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({error:'Enter your name and email address.'});
    if (typeof cv !== 'string' || cv.length > 7 * 1024 * 1024 || !/^[A-Za-z0-9+/]+={0,2}$/.test(cv)) return res.status(400).json({error:'Upload a PDF CV up to 5 MB.'});
    const bytes = Buffer.from(cv, 'base64');
    if (bytes.length > 5 * 1024 * 1024 || bytes.subarray(0,5).toString() !== '%PDF-') return res.status(400).json({error:'Upload a PDF CV up to 5 MB.'});
    const data = purgeDownloaded(); data.waitlist = data.waitlist || [];
    if (data.waitlist.some(entry => entry.email.toLowerCase() === email.toLowerCase())) return res.status(409).json({error:'You have already joined the waitlist. We will get back to you.'});
    const iv = crypto.randomBytes(12), cipher = crypto.createCipheriv('aes-256-gcm', documentKey(), iv);
    const encrypted = Buffer.concat([cipher.update(bytes), cipher.final()]);
    data.waitlist.push({id:crypto.randomUUID(), name:name.trim(), email, createdAt:new Date().toISOString(), cv:Buffer.concat([iv,cipher.getAuthTag(),encrypted]).toString('base64')});
    save(data); res.status(201).json({message:'Thank you, we will get back to you.'});
  });
  return adminOnly => {
    app.post(base + '/waitlist/:id/downloaded', adminOnly, (req,res) => {
      const data=purgeDownloaded(), entry=(data.waitlist || []).find(e=>e.id===req.params.id);
      if(!entry) return res.status(404).json({error:'Application not found.'});
      entry.deleteAt=entry.deleteAt || Date.now()+3000;
      save(data); scheduleDeletion(entry.deleteAt);
      res.json({message:'You downloaded the CV.',deleteAt:entry.deleteAt});
    });
    app.get(base + '/waitlist', adminOnly, (req,res) => res.json((purgeDownloaded().waitlist || []).map(({cv,...entry})=>entry)));
    app.get(base + '/waitlist/:id/cv', adminOnly, (req,res) => {
      const entry=(purgeDownloaded().waitlist || []).find(e=>e.id===req.params.id);
      if(!entry) return res.status(404).json({error:'Application not found.'});
      const bytes=Buffer.from(entry.cv,'base64'), decipher=crypto.createDecipheriv('aes-256-gcm',documentKey(),bytes.subarray(0,12));
      decipher.setAuthTag(bytes.subarray(12,28));
      res.set({'Content-Type':'application/pdf','Content-Disposition':'attachment; filename="cv.pdf"','X-Content-Type-Options':'nosniff'});
      res.send(Buffer.concat([decipher.update(bytes.subarray(28)),decipher.final()]));
    });
  };
};
