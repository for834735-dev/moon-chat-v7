(()=>{const MC=window.MC,te=new TextEncoder(),td=new TextDecoder();
const b64=b=>btoa(String.fromCharCode(...new Uint8Array(b))),ub=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
const ls=(k,d)=>{try{const v=localStorage['mc_'+k];return v==null?d:JSON.parse(v)}catch{return d}},sv=(k,v)=>{localStorage['mc_'+k]=JSON.stringify(v)};
const rid=()=>b64(crypto.getRandomValues(new Uint8Array(6))).replace(/[^A-Za-z0-9]/g,'x');
const norm=p=>String(p||'').replace(/\D/g,'').replace(/^62/,'0');
Object.assign(MC,{ls,sv,rid,norm});
const A={name:'ECDH',namedCurve:'P-256'},G={name:'ECDSA',namedCurve:'P-256'},H={name:'ECDSA',hash:'SHA-256'},ck={};
MC.makeKeys=async()=>{const k=await crypto.subtle.generateKey(A,true,['deriveKey']);return{pub:b64(await crypto.subtle.exportKey('raw',k.publicKey)),priv:await crypto.subtle.exportKey('jwk',k.privateKey)}};
const shared=async(priv,pub)=>{const id=priv.d+pub;return ck[id]||(ck[id]=await crypto.subtle.deriveKey({name:'ECDH',public:await crypto.subtle.importKey('raw',ub(pub),A,false,[])},await crypto.subtle.importKey('jwk',priv,A,false,['deriveKey']),{name:'AES-GCM',length:256},false,['encrypt','decrypt']))};
MC.enc=async(priv,pub,t)=>{const iv=crypto.getRandomValues(new Uint8Array(12));return{iv:b64(iv),ct:b64(await crypto.subtle.encrypt({name:'AES-GCM',iv},await shared(priv,pub),te.encode(t)))}};
MC.dec=async(priv,pub,ct,iv)=>{try{return td.decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:ub(iv)},await shared(priv,pub),ub(ct)))}catch{return '[pesan tidak dapat dibuka]'}};
MC.hash=async(pw,salt)=>b64(await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:ub(salt),iterations:100000},await crypto.subtle.importKey('raw',te.encode(pw),'PBKDF2',false,['deriveBits']),256));
MC.sign=async(jwk,t)=>b64(await crypto.subtle.sign(H,await crypto.subtle.importKey('jwk',jwk,G,false,['sign']),te.encode(t)));
MC.verify=async(t,sig)=>{try{return await crypto.subtle.verify(H,await crypto.subtle.importKey('jwk',MC.OWNER_PUB,G,false,['verify']),ub(sig),te.encode(t))}catch{return false}};

const api=async(m,u,b)=>{const t=ls('token');let r;try{r=await fetch((MC.SERVER||'')+u,{method:m,headers:{'content-type':'application/json',...(t?{authorization:'Bearer '+t}:{})},body:b?JSON.stringify(b):undefined})}catch{throw Error('Tidak ada koneksi ke server')}
 const j=await r.json().catch(()=>({}));if(!r.ok)throw Error(j.error||'Permintaan gagal');return j};MC.api=api;
MC.users=()=>ls('users',{});MC.me=()=>MC.users()[ls('session')];
const put=u=>{const a=MC.users();a[u.phone]={...(a[u.phone]||{}),...u};sv('users',a)};
MC.save=u=>{put(u);if(u.phone===ls('session'))api('PUT','/api/me',{name:u.name,about:u.about,photo:u.photo,blocked:u.blocked,archived:u.archived,removed:u.removed}).catch(()=>{})};
MC.find=async q=>{const{user}=await api('GET','/api/find?q='+encodeURIComponent(q));put(user);return user};
const AS=p=>b64(te.encode('auth:'+p)),WS=p=>b64(te.encode('wrap:'+p)),wk=async(pw,p)=>crypto.subtle.importKey('raw',ub(await MC.hash(pw,WS(p))),'AES-GCM',false,['encrypt','decrypt']);
const start=async(r,privKey)=>{sv('token',r.token);const{wrapped,...me}=r.me;put({...me,priv:privKey});sv('session',me.phone);await MC.syncAll();MC.connect()};
MC.register=async o=>{const p=norm(o.phone),un=String(o.username||'').trim().toLowerCase();
 if(!/^0\d{9,13}$/.test(p))throw Error('Nomor telepon tidak valid');
 if(!/^[a-z0-9_]{3,20}$/.test(un))throw Error('Username 3-20 karakter: huruf, angka, garis bawah');
 if(String(o.password||'').length<6)throw Error('Kata sandi minimal 6 karakter');
 const k=await MC.makeKeys(),iv=crypto.getRandomValues(new Uint8Array(12)),w=await wk(o.password,p);
 const wrapped={iv:b64(iv),ct:b64(await crypto.subtle.encrypt({name:'AES-GCM',iv},w,te.encode(JSON.stringify(k.priv))))};
 await start(await api('POST','/api/register',{phone:p,username:un,name:o.name,auth:await MC.hash(o.password,AS(p)),pub:k.pub,wrapped}),k.priv)};
MC.login=async(ph,pw)=>{const p=norm(ph),r=await api('POST','/api/login',{phone:p,auth:await MC.hash(pw,AS(p))});
 let k;try{k=JSON.parse(td.decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:ub(r.me.wrapped.iv)},await wk(pw,p),ub(r.me.wrapped.ct))))}catch{throw Error('Kunci akun tidak dapat dibuka')}
 await start(r,k)};
MC.logout=()=>{MC.es?.close();localStorage.removeItem('mc_session');localStorage.removeItem('mc_token')};

// Pesan: terenkripsi end-to-end di perangkat, server hanya meneruskan teks sandi.
const addMsg=m=>{const a=ls('msgs',[]),i=a.findIndex(x=>x.id===m.id&&x.from===m.from);if(i<0)a.push(m);else a[i]={...a[i],...m};sv('msgs',a)};
MC.send=async(to,text)=>{const me=MC.me(),u=MC.users()[to],m={id:rid(),from:me.phone,to,...await MC.enc(me.priv,u.pub,text),ts:Date.now()};
 addMsg(m);MC.onmsg?.(m);try{const r=await api('POST','/api/send',m);addMsg({...m,ts:r.ts})}catch(e){sv('msgs',ls('msgs',[]).filter(x=>x.id!==m.id));MC.onmsg?.(m);throw e}};
MC.mine=()=>{const me=MC.me();return ls('msgs',[]).filter(m=>m.from===me.phone||m.to===me.phone).sort((a,b)=>a.ts-b.ts)};
MC.thread=async p=>{const me=MC.me(),u=MC.users()[p];return Promise.all(MC.mine().filter(m=>!m.g&&(m.from===p||m.to===p)).map(async m=>({id:m.id,mine:m.from===me.phone,text:await MC.dec(me.priv,u.pub,m.ct,m.iv),ts:m.ts})))};
const addSt=s=>{const a=ls('status',[]);if(!a.some(x=>x.id===s.id))a.push(s);sv('status',a.filter(x=>x.ts>Date.now()-864e5))};
MC.postStatus=async(text,bg,media)=>{const{status}=await api('POST','/api/status',{text,bg,media});addSt(status)};
MC.statuses=()=>{const me=MC.me(),a=MC.users();return ls('status',[]).filter(s=>s.ts>Date.now()-864e5&&a[s.phone]&&!me.blocked.includes(s.phone)).sort((x,y)=>y.ts-x.ts)};
MC.syncAll=async()=>{const r=await api('GET','/api/sync');r.users.forEach(put);sv('groups',r.groups||[]);put({...r.me,priv:MC.me().priv});
 const own=ls('msgs',[]).filter(m=>m.from!==r.me.phone&&m.to!==r.me.phone);sv('msgs',[...own,...r.msgs]);sv('status',[]);r.status.forEach(addSt)};
// Koneksi real-time (SSE), tersambung ulang otomatis dan menarik pesan yang terlewat.
MC.connect=()=>{MC.es?.close();const t=ls('token');if(!t)return;const es=MC.es=new EventSource((MC.SERVER||'')+'/api/stream?t='+t),on=(n,f)=>es.addEventListener(n,e=>f(JSON.parse(e.data)));
 let first=1;es.onopen=()=>{if(first){first=0;return}MC.syncAll().then(()=>MC.onsync?.()).catch(()=>{})};
 on('msg',({u,...m})=>{put(u);addMsg(m);MC.onmsg?.(m)});
 on('peer',u=>{put(u);MC.onsync?.()});on('status',s=>{addSt(s);MC.onstatus?.(s)});
 on('user',d=>{put({...MC.me(),...d});MC.onsync?.()});on('del',({ids})=>{MC.dropMsgs(ids);MC.ondel?.()});on('statusdel',({id})=>{sv('status',ls('status',[]).filter(x=>x.id!==id));MC.onstatus?.()});on('group',g=>{sv('groups',[...ls('groups',[]).filter(x=>x.id!==g.id),g]);MC.onsync?.()});on('signal',d=>MC.onsignal?.(d))};

MC.groups=()=>ls('groups',[]);
MC.createGroup=async(name,members)=>{const{group}=await api('POST','/api/group',{name,members});sv('groups',[...ls('groups',[]).filter(x=>x.id!==group.id),group]);return group};
MC.sendGroup=async(g,text)=>{const me=MC.me(),gk=rid();await Promise.all(g.members.filter(p=>p!==me.phone).map(async p=>{const u=MC.users()[p];if(!u)throw Error('Data anggota belum lengkap, muat ulang');const m={id:rid(),from:me.phone,to:p,g:g.id,gk,...await MC.enc(me.priv,u.pub,text),ts:Date.now()};addMsg(m);const r=await api('POST','/api/send',m);addMsg({...m,ts:r.ts})}));MC.onmsg?.({from:me.phone})};
MC.groupThread=async gid=>{const me=MC.me(),seen={},us=MC.users(),l=[];for(const m of MC.mine().filter(x=>x.g===gid)){const mine=m.from===me.phone;if(mine){if(seen[m.gk])continue;seen[m.gk]=1}const o=us[mine?m.to:m.from];if(!o)continue;l.push({id:m.id,mine,ts:m.ts,text:(mine?'':o.name+': ')+await MC.dec(me.priv,o.pub,m.ct,m.iv)})}return l};
// Pembelian dan aktivasi (tanda tangan ECDSA pemilik, diverifikasi server)
MC.orders=()=>ls('orders',[]);
MC.newOrder=item=>{const me=MC.me(),all=MC.orders();let o=all.find(o=>o.phone===me.phone&&o.item===item&&o.status==='baru');if(!o){o={id:rid(),phone:me.phone,item,price:MC.ITEMS[item].price,status:'baru',ts:Date.now()};all.push(o);sv('orders',all)}return o};
MC.setOrder=(id,patch)=>{const all=MC.orders();all.forEach(o=>o.id===id&&Object.assign(o,patch));sv('orders',all)};
MC.reqText=o=>`MC:${o.id}|${o.phone}|${o.item}|${o.price}`;
MC.parseReq=t=>{const m=String(t).match(/MC:(\w+)\|(\d+)\|(video|blue)\|(\d+)/);return m&&{id:m[1],phone:m[2],item:m[3],price:+m[4]}};
MC.ownerKey=()=>ls('ownerkey');
MC.setOwnerKey=async jwk=>{const s=await MC.sign(jwk,'uji');if(!await MC.verify('uji',s))throw Error('Kunci tidak cocok dengan aplikasi ini');sv('ownerkey',jwk)};
MC.approve=async r=>{const sig=await MC.sign(MC.ownerKey(),`${r.id}|${r.phone}|${r.item}`);await api('POST','/api/grant',{id:r.id,phone:r.phone,item:r.item,sig});return`${r.id}.${r.item}.${sig}`};
MC.redeem=async code=>{const me=MC.me(),[id,item,sig]=String(code).trim().split('.');if(!MC.ITEMS[item]||!sig||!await MC.verify(`${id}|${me.phone}|${item}`,sig))throw Error('Kode tidak valid untuk akun ini');await api('POST','/api/grant',{id,phone:me.phone,item,sig});me[item]=true;put(me);MC.setOrder(id,{status:'aktif'})};

// Media terenkripsi end-to-end (AES-GCM, kunci ECDH yang sama dengan pesan), hapus pesan/status/chat
MC.encFile=async(priv,pub,buf)=>{const iv=crypto.getRandomValues(new Uint8Array(12));return{iv:b64(iv),buf:await crypto.subtle.encrypt({name:'AES-GCM',iv},await shared(priv,pub),buf)}};
MC.decFile=async(priv,pub,buf,iv)=>crypto.subtle.decrypt({name:'AES-GCM',iv:ub(iv)},await shared(priv,pub),buf);
MC.upload=async(blob,type,mime)=>{let r;try{r=await fetch((MC.SERVER||'')+'/api/upload?type='+type,{method:'POST',headers:{authorization:'Bearer '+ls('token'),'x-mime':mime||'application/octet-stream'},body:blob})}catch{throw Error('Tidak ada koneksi ke server')}const j=await r.json().catch(()=>({}));if(!r.ok)throw Error(j.error||'Unggahan gagal');return j.id};
MC.sendMedia=async(to,file,kind)=>{const me=MC.me(),u=MC.users()[to],e=await MC.encFile(me.priv,u.pub,await file.arrayBuffer()),id=await MC.upload(new Blob([e.buf]),'enc','application/octet-stream');await MC.send(to,'MCMEDIA:'+JSON.stringify({id,iv:e.iv,k:kind,m:file.type}))};
MC.dropMsgs=ids=>sv('msgs',ls('msgs',[]).filter(m=>!ids.includes(m.id)));
MC.delMsg=async(id,all,media)=>{const r=await api('POST','/api/delmsg',{id,all,media});MC.dropMsgs(r.ids)};
MC.clearChat=async p=>{await api('POST','/api/clearchat',{peer:p});sv('msgs',ls('msgs',[]).filter(m=>m.g||!(m.from===p||m.to===p)))};
MC.removeContact=p=>{const me=MC.me();me.removed=[...new Set([...(me.removed||[]),p])];MC.save(me)};
MC.delStatus=async id=>{await api('POST','/api/status/del',{id});sv('status',ls('status',[]).filter(x=>x.id!==id))};
})();
