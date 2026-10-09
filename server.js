// Moon Chat server: relay pesan real-time (SSE), akun, status, sinyal panggilan. Tanpa dependensi.
const http=require('http'),fs=require('fs'),path=require('path'),crypto=require('crypto'),vm=require('vm');
const PORT=process.env.PORT||3000,DB=path.join(__dirname,'data.json'),W={};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'config.js'),'utf8'),{window:W});const MC=W.MC;
let db={users:{},msgs:[],status:[],tokens:{}};try{db={...db,...JSON.parse(fs.readFileSync(DB,'utf8'))}}catch{}
let tm;const save=()=>{clearTimeout(tm);tm=setTimeout(()=>fs.writeFile(DB+'.tmp',JSON.stringify(db),()=>fs.rename(DB+'.tmp',DB,()=>{})),300)};
const clients=new Map();db.groups=db.groups||{};db.tokmeta=db.tokmeta||{};db.media=db.media||{};const UP=path.join(__dirname,'uploads');fs.mkdirSync(UP,{recursive:true});
setInterval(()=>{const cut=Date.now()-864e5;db.status=db.status.filter(x=>{if(x.ts>cut)return true;if(x.media){delete db.media[x.media.id];fs.unlink(path.join(UP,x.media.id),()=>{})}return false});save()},36e5);let UA='',TOK='';
const push=(p,ev,d)=>{const s=clients.get(p);if(!s)return 0;s.forEach(r=>r.write(`event: ${ev}\ndata: ${JSON.stringify(d)}\n\n`));return s.size};
const pub=u=>({phone:u.phone,username:u.username,name:u.name,about:u.about,photo:u.photo,pub:u.pub,blue:!!u.blue,video:!!u.video});
const priv=u=>({...pub(u),blocked:u.blocked,archived:u.archived,removed:u.removed||[]});
const peers=p=>{const s=new Set();db.msgs.forEach(m=>{if((m.del||[]).includes(p))return;if(m.from===p)s.add(m.to);else if(m.to===p&&!m.hidden)s.add(m.from)});Object.values(db.groups).forEach(g=>g.members.includes(p)&&g.members.forEach(x=>x!==p&&s.add(x)));return s};
const norm=p=>String(p||'').replace(/\D/g,'').replace(/^62/,'0');
const fails={};
const err=(c,m)=>{const e=Error(m);e.code=c;return e};
const verifyOwner=(t,sig)=>{try{return crypto.verify('sha256',Buffer.from(t),{key:crypto.createPublicKey({key:MC.OWNER_PUB,format:'jwk'}),dsaEncoding:'ieee-p1363'},Buffer.from(sig,'base64'))}catch{return false}};
const hashPw=(a,salt)=>crypto.scryptSync(a,salt,32).toString('base64');
const mkToken=p=>{const t=crypto.randomBytes(24).toString('hex');db.tokens[t]=p;db.tokmeta[t]={ts:Date.now(),ua:UA};save();return t};

const routes={
'POST /api/register':async(b)=>{const p=norm(b.phone),un=String(b.username||'').trim().toLowerCase();
 if(!/^0\d{9,13}$/.test(p))throw err(400,'Nomor telepon tidak valid');
 if(!/^[a-z0-9_]{3,20}$/.test(un))throw err(400,'Username 3-20 karakter: huruf, angka, garis bawah');
 if(!b.auth||!b.pub||!b.wrapped)throw err(400,'Data pendaftaran tidak lengkap');
 if(db.users[p]||Object.values(db.users).some(u=>u.username===un))throw err(409,'Nomor atau username sudah dipakai');
 const salt=crypto.randomBytes(12).toString('base64');
 const u=db.users[p]={phone:p,username:un,name:String(b.name||un).slice(0,40),about:'Hai, saya memakai Moon Chat',photo:'',pub:b.pub,wrapped:b.wrapped,salt,hash:hashPw(b.auth,salt),blue:false,video:false,blocked:[],archived:[]};
 save();return{token:mkToken(p),me:{...priv(u),wrapped:u.wrapped}}},
'POST /api/login':async(b,_,ip)=>{const p=norm(b.phone),k=ip+p;if((fails[k]||0)>=8)throw err(429,'Terlalu banyak percobaan, coba lagi nanti');
 const u=db.users[p];if(!u||hashPw(String(b.auth),u.salt)!==u.hash){fails[k]=(fails[k]||0)+1;setTimeout(()=>delete fails[k],6e5);throw err(401,'Nomor atau kata sandi salah')}
 delete fails[k];return{token:mkToken(p),me:{...priv(u),wrapped:u.wrapped}}},
'GET /api/find':async(_,me,__,q)=>{const s=String(q.get('q')||'').trim().toLowerCase().replace(/^@/,'');
 const u=db.users[norm(s)]||Object.values(db.users).find(x=>x.username===s);if(!u)throw err(404,'Pengguna tidak ditemukan');return{user:pub(u)}},
'PUT /api/me':async(b,me)=>{if(typeof b.name==='string')me.name=b.name.slice(0,40);if(typeof b.about==='string')me.about=b.about.slice(0,140);
 if(typeof b.photo==='string'&&b.photo.length<150000)me.photo=b.photo;
 if(Array.isArray(b.blocked))me.blocked=b.blocked.filter(x=>db.users[x]);if(Array.isArray(b.archived))me.archived=b.archived.filter(x=>db.users[x]);if(Array.isArray(b.removed))me.removed=b.removed.filter(x=>db.users[x]);
 save();peers(me.phone).forEach(p=>push(p,'peer',pub(me)));return{ok:1}},
'POST /api/send':async(b,me)=>{const to=db.users[b.to];if(!to||to.phone===me.phone)throw err(400,'Penerima tidak valid');
 if(!b.iv||!b.ct||String(b.ct).length>20000)throw err(400,'Pesan tidak valid');
 const m={id:String(b.id||crypto.randomUUID()).slice(0,24),from:me.phone,to:to.phone,iv:b.iv,ct:b.ct,ts:Date.now()};if(b.g){const g=db.groups[b.g];if(!g||!g.members.includes(me.phone)||!g.members.includes(to.phone))throw err(403,'Bukan anggota grup');m.g=b.g;m.gk=String(b.gk||'').slice(0,24)}
 if(db.msgs.some(x=>x.id===m.id&&x.from===m.from))return{ts:m.ts};
 if(to.blocked.includes(me.phone))m.hidden=true;
 db.msgs.push(m);if(db.msgs.length>50000)db.msgs.splice(0,5000);save();
 if(!m.hidden)push(to.phone,'msg',{...m,u:pub(me)});push(me.phone,'msg',{...m,u:pub(to)});return{ts:m.ts}},
'GET /api/sync':async(_,me)=>{const ps=[...peers(me.phone)];
 return{groups:Object.values(db.groups).filter(g=>g.members.includes(me.phone)),me:priv(me),users:ps.map(p=>pub(db.users[p])).filter(Boolean),
  msgs:db.msgs.filter(m=>(m.from===me.phone||(m.to===me.phone&&!m.hidden))&&!(m.del||[]).includes(me.phone)).map(({hidden,del,...m})=>m),
  status:db.status.filter(s=>s.ts>Date.now()-864e5&&(s.phone===me.phone||ps.includes(s.phone)))}},
'POST /api/status':async(b,me)=>{const text=String(b.text||'').slice(0,400),mm=b.media&&db.media[b.media.id],md=mm&&mm.phone===me.phone&&mm.type!=='enc'?{id:b.media.id,type:mm.type}:null;if(!text&&!md)throw err(400,'Status kosong');
 const s={id:crypto.randomUUID().slice(0,12),phone:me.phone,text,media:md,bg:/^#[0-9a-f]{6}$/i.test(b.bg)?b.bg:'#1b2a5c',ts:Date.now()};
 db.status=db.status.filter(x=>x.ts>Date.now()-864e5);db.status.push(s);save();
 [me.phone,...peers(me.phone)].forEach(p=>{if(!db.users[p].blocked.includes(me.phone))push(p,'status',s)});return{status:s}},
'POST /api/signal':async(b,me)=>{const to=db.users[b.to];if(!to)throw err(404,'Pengguna tidak ditemukan');
 if(b.data?.type==='offer'){if(!me.video)throw err(403,'Video Call perlu dibeli dulu');if(to.blocked.includes(me.phone))throw err(403,'Panggilan tidak dapat tersambung')}
 return{delivered:push(to.phone,'signal',{from:me.phone,name:me.name,data:b.data})>0}},
'POST /api/group':async(b,me)=>{const name=String(b.name||'').trim().slice(0,40),ms=[...new Set([me.phone,...(b.members||[]).filter(x=>db.users[x])])];
 if(!name)throw err(400,'Nama grup kosong');if(ms.length<2)throw err(400,'Pilih minimal satu anggota');
 const id=crypto.randomUUID().slice(0,10),g=db.groups[id]={id,name,owner:me.phone,members:ms};save();ms.forEach(p=>push(p,'group',g));return{group:g}},
'POST /api/status/del':async(b,me)=>{const i=db.status.findIndex(x=>x.id===b.id&&x.phone===me.phone);if(i<0)throw err(404,'Status tidak ditemukan');const[x]=db.status.splice(i,1);if(x.media){delete db.media[x.media.id];fs.unlink(path.join(UP,x.media.id),()=>{})}save();[me.phone,...peers(me.phone)].forEach(p=>push(p,'statusdel',{id:x.id}));return{ok:1}},
'POST /api/delmsg':async(b,me)=>{const m=db.msgs.find(x=>x.id===String(b.id)&&(x.from===me.phone||x.to===me.phone));if(!m)throw err(404,'Pesan tidak ditemukan');const mine=m.from===me.phone,set=mine&&m.gk?db.msgs.filter(x=>x.gk===m.gk&&x.from===m.from):[m],ids=set.map(x=>x.id);
 if(b.all){if(!mine)throw err(403,'Hanya pesan sendiri yang bisa dihapus untuk semua orang');db.msgs=db.msgs.filter(x=>!set.includes(x));const mm=db.media[b.media];if(mm&&mm.phone===me.phone){delete db.media[b.media];fs.unlink(path.join(UP,b.media),()=>{})}save();new Set([me.phone,...set.map(x=>x.to)]).forEach(p=>push(p,'del',{ids}))}
 else{set.forEach(x=>{x.del=x.del||[];if(!x.del.includes(me.phone))x.del.push(me.phone)});save();push(me.phone,'del',{ids})}return{ids}},
'POST /api/clearchat':async(b,me)=>{db.msgs.forEach(m=>{if(!m.g&&((m.from===me.phone&&m.to===b.peer)||(m.to===me.phone&&m.from===b.peer))){m.del=m.del||[];if(!m.del.includes(me.phone))m.del.push(me.phone)}});save();return{ok:1}},
'GET /api/devices':async(_,me)=>({devices:Object.entries(db.tokens).filter(([,p])=>p===me.phone).map(([t])=>({id:t.slice(0,10),ts:db.tokmeta[t]?.ts||0,ua:db.tokmeta[t]?.ua||'',current:t===TOK}))}),
'POST /api/devices/revoke':async(b,me)=>{const t=Object.keys(db.tokens).find(x=>db.tokens[x]===me.phone&&x.slice(0,10)===b.id&&x!==TOK);if(!t)throw err(404,'Perangkat tidak ditemukan');delete db.tokens[t];delete db.tokmeta[t];save();return{ok:1}},
'POST /api/grant':async(b)=>{const u=db.users[norm(b.phone)];if(!u||!MC.ITEMS[b.item])throw err(400,'Data tidak valid');
 if(!verifyOwner(`${b.id}|${u.phone}|${b.item}`,String(b.sig)))throw err(403,'Kode tidak valid untuk akun ini');
 u[b.item]=true;save();push(u.phone,'user',{[b.item]:true});peers(u.phone).forEach(p=>push(p,'peer',pub(u)));return{ok:1}}
};
const NOAUTH=['POST /api/register','POST /api/login','POST /api/grant'];
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.jpg':'image/jpeg','.png':'image/png'};
const CORS={'access-control-allow-origin':'*','access-control-allow-headers':'authorization,content-type,x-mime','access-control-allow-methods':'GET,POST,PUT,OPTIONS'};
const json=(res,c,o)=>{res.writeHead(c,{'content-type':'application/json',...CORS});res.end(JSON.stringify(o))};

http.createServer(async(req,res)=>{try{
 const url=new URL(req.url,'http://x'),key=req.method+' '+url.pathname;
 if(req.method==='OPTIONS'){res.writeHead(204,CORS);return res.end()}
 const tok=(req.headers.authorization||'').replace('Bearer ','')||url.searchParams.get('t'),me=db.users[db.tokens[tok]];UA=req.headers['user-agent']||'';TOK=tok;
 if(url.pathname==='/api/stream'){if(!me)return json(res,401,{error:'Sesi berakhir, masuk lagi'});
  res.writeHead(200,{'content-type':'text/event-stream','cache-control':'no-cache',connection:'keep-alive','x-accel-buffering':'no',...CORS});res.write('retry: 2000\n\n');
  if(!clients.has(me.phone))clients.set(me.phone,new Set());clients.get(me.phone).add(res);
  const ka=setInterval(()=>res.write(': ka\n\n'),25000);
  return req.on('close',()=>{clearInterval(ka);const s=clients.get(me.phone);s?.delete(res);if(s&&!s.size)clients.delete(me.phone)})}
 if(key==='POST /api/upload'){if(!me)return json(res,401,{error:'Sesi berakhir, masuk lagi'});const ty=url.searchParams.get('type'),mime=String(req.headers['x-mime']||'');if(!['image','video','enc'].includes(ty)||(ty!=='enc'&&!/^(image|video)\/[\w.+-]+$/.test(mime)))return json(res,400,{error:'Jenis berkas tidak didukung'});
  const ch=[];let n=0;for await(const c of req){n+=c.length;if(n>26e6)return json(res,413,{error:'Berkas maksimal 25 MB'});ch.push(c)}
  const id=crypto.randomBytes(16).toString('hex');fs.writeFileSync(path.join(UP,id),Buffer.concat(ch));db.media[id]={phone:me.phone,type:ty,mime:ty==='enc'?'application/octet-stream':mime,ts:Date.now()};save();return json(res,200,{id})}
 if(req.method==='GET'&&url.pathname.startsWith('/media/')){const id=url.pathname.slice(7),md=/^[0-9a-f]{32}$/.test(id)&&db.media[id];if(!md)return json(res,404,{error:'Tidak ditemukan'});
  return fs.stat(path.join(UP,id),(e,st)=>{if(e)return json(res,404,{error:'Tidak ditemukan'});const r=/bytes=(\d*)-(\d*)/.exec(req.headers.range||'');let a=0,z=st.size-1,code=200;if(r){a=r[1]?+r[1]:0;z=r[2]?Math.min(+r[2],st.size-1):st.size-1;code=206}if(a>z||a>=st.size){res.writeHead(416,CORS);return res.end()}
   const h={'content-type':md.mime,'accept-ranges':'bytes','content-length':z-a+1,'cache-control':'private, max-age=86400','x-content-type-options':'nosniff',...CORS};if(code===206)h['content-range']=`bytes ${a}-${z}/${st.size}`;res.writeHead(code,h);fs.createReadStream(path.join(UP,id),{start:a,end:z}).pipe(res)})}
 if(routes[key]){if(!NOAUTH.includes(key)&&!me)return json(res,401,{error:'Sesi berakhir, masuk lagi'});
  let b={};if(req.method!=='GET'){let s='';for await(const c of req){s+=c;if(s.length>1.5e6)return json(res,413,{error:'Data terlalu besar'})}b=s?JSON.parse(s):{}}
  return json(res,200,await routes[key](b,me,req.socket.remoteAddress,url.searchParams))}
 if(req.method!=='GET')return json(res,404,{error:'Tidak ditemukan'});
 let f=url.pathname==='/'?'index.html':decodeURIComponent(url.pathname).slice(1);
 if(!/^(index\.html|config\.js|(assets|css|js)\/[\w.\-]+)$/.test(f))return json(res,404,{error:'Tidak ditemukan'});
 fs.readFile(path.join(__dirname,f),(e,d)=>{if(e)return json(res,404,{error:'Tidak ditemukan'});res.writeHead(200,{'content-type':MIME[path.extname(f)]||'application/octet-stream','cache-control':'no-cache'});res.end(d)});
}catch(e){json(res,typeof e.code==='number'?e.code:500,{error:typeof e.code==='number'?e.message:'Terjadi kesalahan server'})}}).listen(PORT,()=>console.log('Moon Chat berjalan di http://localhost:'+PORT));
