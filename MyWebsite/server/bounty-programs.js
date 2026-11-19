const fetch = require('node-fetch');
const SOURCE='https://raw.githubusercontent.com/projectdiscovery/public-bugbounty-programs/main/dist/data.json';
module.exports=(app,{fetchPrograms=fetch}={})=>{
  let cached=null,pending=null;
  app.get('/api/bigbounty/programs',async(req,res)=>{
    res.set('Cache-Control','no-store');
    try{
      if(!cached || Date.now()-cached.time>600000){
        if(!pending)pending=(async()=>{
          const response=await fetchPrograms(SOURCE,{timeout:12000,size:5000000});
          if(!response.ok)throw Error('Feed unavailable');
          const data=await response.json();if(!Array.isArray(data.programs))throw Error('Invalid feed');
          const unique=new Map();
          for(const item of data.programs){
            if(typeof item.name!=='string' || typeof item.url!=='string')continue;
            let url;try{url=new URL(item.url);}catch{continue;}
            if(!['https:','http:'].includes(url.protocol) || url.username || url.password)continue;
            unique.set(url.href,{name:item.name.slice(0,160),url:url.href,bounty:item.bounty===true,platform:url.hostname.replace(/^www\./,''),domains:Array.isArray(item.domains)?item.domains.filter(d=>typeof d==='string').slice(0,10):[]});
          }
          if(!unique.size)throw Error('Empty feed');
          cached={time:Date.now(),programs:[...unique.values()].sort((a,b)=>a.name.localeCompare(b.name))};
        })().finally(()=>{pending=null;});
        await pending;
      }
      res.json({programs:cached.programs,fetchedAt:new Date(cached.time).toISOString(),stale:false,source:'https://github.com/projectdiscovery/public-bugbounty-programs'});
    }catch{
      if(cached)return res.json({programs:cached.programs,fetchedAt:new Date(cached.time).toISOString(),stale:true,source:'https://github.com/projectdiscovery/public-bugbounty-programs'});
      res.status(502).json({error:'The program feed is unavailable right now. Please try again shortly.'});
    }
  });
};
