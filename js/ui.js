(()=>{const MC=window.MC,{ls,sv}=MC,$=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const hm=t=>new Date(t).toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'}),rp=n=>'Rp'+n.toLocaleString('id-ID');
const wa=p=>'https://wa.me/62'+MC.norm(p).slice(1);
const P={cam:'<path d="M4 8h3l1.5-2.5h7L17 8h3v11H4z"/><circle cx="12" cy="13.2" r="3.4"/>',pencil:'<path d="M4 20l1-4.2L16.2 4.6a2 2 0 0 1 2.8 0l.4.4a2 2 0 0 1 0 2.8L8.2 19z"/><path d="M14 7l3 3"/>',plus:'<path d="M12 5v14M5 12h14"/>',clip:'<path d="M20 11.5l-7.8 7.8a5 5 0 0 1-7-7l8-8a3.3 3.3 0 0 1 4.7 4.7l-8 8a1.7 1.7 0 0 1-2.4-2.4l7.4-7.4"/>',trash:'<path d="M5 7h14M10 4h4M7 7l1 13h8l1-13M10 11v6M14 11v6"/>',chat:'<path d="M4 5.5h16v10.5H9.5L5 20v-4H4z"/>',status:'<circle cx="12" cy="12" r="8.3" stroke-dasharray="3.5 2.5"/><circle cx="12" cy="12" r="2.5"/>',ai:'<path d="M12 2.3 13.7 8l5.7 1.4-5.7 1.4L12 16.2l-1.7-5.4-5.7-1.4L10.3 8z"/>',toko:'<path d="M4.5 9h12v5.2a3.8 3.8 0 0 1-3.8 3.8H8.3a3.8 3.8 0 0 1-3.8-3.8zM16.5 10h1.7a2.3 2.3 0 0 1 0 4.6h-1.7"/>',lyra:'<path d="M20 14.2A8.3 8.3 0 1 1 9.8 4a6.8 6.8 0 0 0 10.2 10.2Z"/>',profil:'<circle cx="12" cy="8.5" r="3.5"/><path d="M5 20c.8-3.6 3.8-5.5 7-5.5s6.2 1.9 7 5.5"/>',out:'<path d="M14 5H6v14h8M11 12h9M17 8.5l3.5 3.5-3.5 3.5"/>',back:'<path d="M15 5l-7 7 7 7"/>',send:'<path d="M4 12l16-8-6 16-3-7z"/>',video:'<rect x="3" y="7" width="12" height="10" rx="2"/><path d="M15 11l6-3v8l-6-3"/>',more:'<path d="M12 6h.01M12 12h.01M12 18h.01"/>',kontak:'<circle cx="9" cy="8.5" r="3.2"/><path d="M3.5 19c.6-3.2 3-4.8 5.5-4.8s4.9 1.6 5.5 4.8M16 6.3a3 3 0 0 1 0 5.4M18 14.6c1.6.6 2.6 2 3 4.4"/>',fitur:'<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>',telp:'<path d="M6.5 4h3l1.5 4-2 1.3a10 10 0 0 0 5.7 5.7L16 13l4 1.5v3a2.5 2.5 0 0 1-2.5 2.5A13.5 13.5 0 0 1 4 6.5 2.5 2.5 0 0 1 6.5 4z"/>'};
const svg=n=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${P[n]}</svg>`;
const blue='<svg class="bl" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M7 12.5l3.2 3L17 9"/></svg>';
const nm=u=>esc(u.name)+(u.blue?blue:'');
const av=(u,c='')=>`<div class="av ${c}">${u.photo?`<img src="${u.photo}" alt="">`:u.bot?'<img src="assets/moon.jpg" alt="">':esc((u.name||'?')[0].toUpperCase())}</div>`;
const S={page:'chat',peer:null,arch:false,req:null,ai:false};
const toast=t=>{const e=$('#toast');e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),2800)};
const modal=h=>{$('#modal').innerHTML=`<div class="modal">${h}</div>`;$('#modal').classList.add('show')};
const closem=()=>$('#modal').classList.remove('show');
const shrink=(f,w)=>new Promise(r=>{const i=new Image();i.onload=()=>{const k=Math.min(1,w/i.width),c=document.createElement('canvas');c.width=i.width*k;c.height=i.height*k;c.getContext('2d').drawImage(i,0,0,c.width,c.height);r(c.toDataURL('image/jpeg',.72))};i.src=URL.createObjectURL(f)});
const BOTS={aidhira:{name:'Aidhira',bot:1},lyra:{name:'Lyra',bot:1}};
const stars=[[8,6,14],[18,91,10],[42,3,8],[65,95,12],[85,10,9]];

function auth(reg){$('#app').innerHTML=`<div class="auth"><img src="assets/logo-moon-chat.png" alt=""><h1>Moon Chat</h1><p>Obrolan pribadi di bawah cahaya bulan</p>
 <input class="phone-input" id="ph" inputmode="tel" placeholder="Nomor telepon">${reg?'<input class="phone-input" id="un" placeholder="Username"><input class="phone-input" id="nm" placeholder="Nama">':''}<input class="phone-input" id="pw" type="password" placeholder="Kata sandi">
 <button class="pairbtn" style="width:100%" data-a="${reg?'reg':'log'}">${reg?'Daftar':'Masuk'}</button><button class="ghostbtn" style="width:100%" data-a="${reg?'toLog':'toReg'}">${reg?'Sudah punya akun':'Buat akun baru'}</button></div>`}

const NAV=[['chat','Chat','chat'],['status','Status','status'],['kontak','Kontak','kontak'],['fitur','Fitur','fitur'],['telp','Telepon','telp']];
function shell(me,body){return `<div class="topbar"><div class="brand"><img src="assets/moon.jpg" alt=""><div class="brand-name">Moon Chat<span>chat privat terenkripsi</span></div></div><button class="iconbtn" data-a="cam" aria-label="Kamera">${svg('cam')}</button><button class="iconbtn" data-a="more" aria-label="Menu">${svg('more')}</button></div><main${S.anim?' class="page"':''}>${body}</main>${S.page==='status'?FAB:''}`}
const roomShell=(head,msgs,inp)=>`<header class="topbar"><button class="iconbtn" data-a="home">${svg('back')}</button>${head}</header><div id="msgs">${msgs}</div><div class="compose">${inp}</div>`;
const TH={},sp=t=>{try{return JSON.parse(t)}catch{return null}},pv=t=>/^MCMEDIA:/.test(t)?((sp(t.slice(8))||{}).k==='video'?'Video':'Foto'):t.slice(0,48);
const bub=l=>l.map(m=>{if(m.id)TH[m.id]=m;const md=/^MCMEDIA:/.test(m.text)?sp(m.text.slice(8)):null;return `<div class="b ${m.mine?'me':''}" ${m.id?`data-id="${m.id}"`:''}>${m.id&&ls('stars',[]).includes(m.id)?'★ ':''}${md?`<div class="mm" data-j="${encodeURIComponent(JSON.stringify(md))}" style="min-width:150px;min-height:56px">Memuat...</div>`:esc(m.text)}<time>${hm(m.ts)}</time></div>`}).join('');
const compose=`<input class="phone-input" id="tx" placeholder="Ketik pesan" autocomplete="off"><button class="iconbtn" data-a="send" style="background:var(--gold);color:#0a0a0a">${svg('send')}</button>`;

async function pChat(me){const by={};MC.mine().filter(m=>!m.g).forEach(m=>by[m.from===me.phone?m.to:m.from]=m);
 const l=Object.entries(by).filter(([p])=>MC.users()[p]&&me.archived.includes(p)===S.arch).sort((a,b)=>b[1].ts-a[1].ts);
 const rows=await Promise.all(l.map(async([p,m])=>{const u=MC.users()[p],t=await MC.dec(me.priv,u.pub,m.ct,m.iv);return `<div class="item" data-a="room" data-p="${p}">${av(u)}<div class="mid"><b>${nm(u)}</b><span>${esc(pv(t))}</span></div><time>${hm(m.ts)}</time></div>`}));
 rows.unshift(...(S.arch?[]:MC.groups().map(g=>`<div class="item" data-a="grp" data-id="${g.id}"><div class="av">${esc(g.name[0].toUpperCase())}</div><div class="mid"><b>${esc(g.name)}</b><span>${g.members.length} anggota</span></div></div>`)));
 return `<div class="page-head"><h1>Chat</h1><p>Pesan disimpan terenkripsi end-to-end.</p></div><button class="pairbtn" data-a="newchat">Chat baru</button>${rows.length?`<div class="card list" style="margin-top:14px">${rows.join('')}</div>`:`<div class="empty"><b>${S.arch?'Arsip kosong':'Belum ada obrolan'}</b>Cari teman lewat nomor telepon atau username.</div>`}<button class="ghostbtn" data-a="arch">${S.arch?'Kembali ke chat':`Arsip (${me.archived.length})`}</button>`}
function pStatus(){const me=MC.me(),l=MC.statuses(),U=x=>(MC.SERVER||'')+'/media/'+x;
 return `<div class="page-head"><h1>Status</h1><p>Hilang otomatis setelah 24 jam.</p></div>${l.map(s=>{const u=MC.users()[s.phone],mine=s.phone===me.phone;return `<div class="st" data-sid="${s.id}" style="background:${esc(s.bg)}">${s.media?(s.media.type==='video'?`<video src="${U(s.media.id)}" controls playsinline preload="metadata" style="width:100%;border-radius:10px;margin-bottom:10px;max-height:60vh;background:#000"></video>`:`<img src="${U(s.media.id)}" alt="" style="width:100%;border-radius:10px;margin-bottom:10px">`):''}${s.text?`<p>${esc(s.text)}</p>`:''}<small>${nm(u)}, ${hm(s.ts)}${mine?`<button class="iconbtn" data-a="delst" data-id="${s.id}" aria-label="Hapus status" style="float:right;width:30px;height:30px;margin-top:-6px;border-color:rgba(255,255,255,.35);color:#fff">${svg('trash')}</button>`:''}</small></div>`}).join('')||empty('Belum ada status','Tekan + untuk membagikan foto atau video, atau pensil untuk menulis.')}`}
function pToko(me){const os=MC.orders().filter(o=>o.phone===me.phone&&o.status!=='baru');
 return `<div class="page-head"><h1>Toko</h1><p>Fitur tambahan, dibayar sekali lewat QRIS.</p></div><div class="grid">${Object.entries(MC.ITEMS).map(([k,it])=>`<div class="card"><div class="stat-label">${it.label}</div><div class="stat-num">${rp(it.price)}</div><div style="margin-top:12px">${me[k]?'<span class="chip">Aktif</span>':`<button class="pairbtn" data-a="buy" data-k="${k}">Beli</button>`}</div></div>`).join('')}</div>
 <div class="card" style="margin-top:14px"><div class="stat-label">Kode aktivasi dari admin</div><input class="phone-input" id="rc" placeholder="Tempel kode aktivasi"><button class="pairbtn" data-a="redeem">Aktifkan</button></div>
 ${os.length?`<div class="card list"><div class="stat-label" style="margin-top:12px">Pesanan saya</div>${os.map(o=>`<div class="item"><div class="mid"><b>${MC.ITEMS[o.item].label}</b><span>${o.id}, ${rp(o.price)}</span></div><span class="chip">${o.status}</span></div>`).join('')}</div>`:''}`}
function pProfil(me){return `<div class="page-head"><h1>Profil</h1><p>Info akun dan pengaturan.</p></div><div class="card"><div style="display:flex;gap:16px;align-items:center;margin-bottom:14px"><label style="cursor:pointer">${av(me,'lg')}<input type="file" id="pf" accept="image/*" hidden></label><div><b>${nm(me)}</b><div class="mid"><span>@${esc(me.username)}, ${esc(me.phone)}</span></div><div style="margin-top:8px"><span class="chip">${me.video?'Video Call':'Tanpa Video Call'}</span></div></div></div>
 <label class="f">Nama</label><input class="phone-input" id="pn" value="${esc(me.name)}"><label class="f">Info</label><input class="phone-input" id="pa" value="${esc(me.about)}"><button class="pairbtn" data-a="saveprof">Simpan profil</button></div>
 <div class="card"><label class="f">Kunci API Aidhira (disimpan hanya di perangkat ini)</label><input class="phone-input" id="ak" type="password" value="${esc(ls('aikey',''))}" placeholder="sk-ant-..."><button class="pairbtn" data-a="saveai">Simpan kunci</button></div>
 <div class="card"><div class="stat-label">Pemblokiran</div>${me.blocked.length?me.blocked.map(p=>`<div class="item"><div class="mid"><b>${esc(MC.users()[p]?.name||p)}</b></div><button class="ghostbtn" style="margin:0" data-a="unblock" data-p="${p}">Buka blokir</button></div>`).join(''):'<span class="mid"><span>Tidak ada kontak diblokir</span></span>'}</div>`}
function pLyra(me){const key=MC.ownerKey();
 if(!key)return `<div class="page-head"><h1>Lyra</h1><p>Aktifkan mode admin dengan kunci pemilik.</p></div><div class="card"><textarea class="phone-input" id="ok" placeholder="Tempel kunci pemilik"></textarea><button class="pairbtn" data-a="setkey">Aktifkan Lyra</button></div>`;
 const pend=MC.orders().filter(o=>o.status==='menunggu'),r=S.req;
 return `<div class="page-head"><h1>Lyra</h1><p>Laporan pembelian yang menunggu konfirmasi.</p></div><div class="card"><label class="f">Tempel pesan pembelian dari pembeli</label><textarea class="phone-input" id="rq" placeholder="MC:..."></textarea><button class="pairbtn" data-a="check">Periksa</button></div>
 ${r?`<div class="card"><div class="stat-label">Status: pending</div><b>${MC.ITEMS[r.item].label}, ${rp(r.price)}</b><div class="mid"><span>Pembeli ${esc(r.phone)}, kode ${r.id}</span></div><p class="mid"><span style="white-space:normal">Cocokkan nominal dengan bukti pembayaran di WhatsApp.</span></p><div style="display:flex;gap:8px"><button class="pairbtn" data-a="approve">Konfirmasi</button><button class="ghostbtn" style="margin:0" data-a="reject">Tolak</button></div></div>`:''}
 ${pend.length?`<div class="card list"><div class="stat-label" style="margin-top:12px">Pending di perangkat ini</div>${pend.map(o=>`<div class="item" data-a="review" data-id="${o.id}"><div class="mid"><b>${MC.ITEMS[o.item].label}</b><span>${esc(o.phone)}, ${rp(o.price)}</span></div><span class="chip">pending</span></div>`).join('')}</div>`:''}`}


const EN={Chat:'Chats',Status:'Status',Kontak:'Contacts',Fitur:'Features',Telepon:'Calls',Profil:'Profile',Berbintang:'Starred',Order:'Orders',Pengaturan:'Settings','Grup baru':'New group','Siaran bisnis':'Business broadcast',Daftar:'Lists',Keluar:'Log out',Kembali:'Back','Foto, nama, dan bio':'Photo, name and bio',Langganan:'Subscription',Akun:'Account',Privasi:'Privacy',Tampilan:'Appearance',Notifikasi:'Notifications','Penyimpanan dan data':'Storage and data',Aksesibilitas:'Accessibility','Bantuan dan masukan':'Help and feedback','Undang kontak':'Invite contacts','Perangkat tertaut':'Linked devices','Bahasa aplikasi':'App language'};
const L=x=>PF().lang==='en'&&EN[x]||x;
const PF=()=>({theme:'dark',font:1,calm:false,lang:'id',...ls('pref',{})}),setPref=o=>{sv('pref',{...PF(),...o});applyPref()};
function applyPref(){const p=PF();document.documentElement.dataset.theme=p.theme;const a=$('#app');if(a)a.style.zoom=p.font;document.body.classList.toggle('calm',!!p.calm)}
const logc=(p,dir)=>sv('calls',[{p,dir,ts:Date.now()},...ls('calls',[])].slice(0,50));
const back='<button class="ghostbtn" data-a="back" style="margin:0 0 14px">Kembali</button>';
const row=(a,t,x)=>`<div class="item" data-a="${a}" ${x}><div class="mid"><b>${t}</b></div></div>`;
const empty=(t,s)=>`<div class="empty"><b>${t}</b>${s}</div>`;
function pKontak(me){const l=Object.values(MC.users()).filter(u=>u.phone!==me.phone&&!me.blocked.includes(u.phone)&&!(me.removed||[]).includes(u.phone)).sort((a,b)=>a.name.localeCompare(b.name));
 return `<div class="page-head"><h1>Kontak</h1><p>Orang yang pernah kamu ajak chat.</p></div><button class="pairbtn" data-a="newchat">Tambah kontak</button>${l.length?`<div class="card list" style="margin-top:14px">${l.map(u=>`<div class="item" data-a="room" data-p="${u.phone}">${av(u)}<div class="mid"><b>${nm(u)}</b><span>${esc(u.about)}</span></div></div>`).join('')}</div>`:empty('Belum ada kontak','Cari lewat nomor telepon atau username.')}`}
function pFitur(me){const c=(p,t,s)=>`<div class="card" data-a="go" data-p="${p}" style="cursor:pointer"><b>${t}</b><div class="mid"><span style="white-space:normal">${s}</span></div></div>`;
 return `<div class="page-head"><h1>Fitur</h1><p>Semua fitur Moon Chat.</p></div><div class="grid">${c('aidhira','Aidhira','Asisten AI untuk bisnis dan keseharian')}${c('toko','Toko','Video Call dan Centang Biru')}${c('star','Berbintang','Pesan favoritmu')}${me.phone===MC.norm(MC.OWNER_PHONE)?c('lyra','Lyra','Konfirmasi pembelian'):''}</div>`}
function pTelp(me){const cl=ls('calls',[]).filter(c=>MC.users()[c.p]),us=MC.users();
 return `<div class="page-head"><h1>Telepon</h1><p>Riwayat panggilan video.</p></div>${cl.length?`<div class="card list">${cl.map(c=>`<div class="item" data-a="room" data-p="${c.p}">${av(us[c.p])}<div class="mid"><b>${nm(us[c.p])}</b><span>${c.dir==='out'?'Keluar':'Masuk'}, ${new Date(c.ts).toLocaleString('id-ID',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</span></div></div>`).join('')}</div>`:empty('Belum ada panggilan','Buka chat lalu tekan ikon video untuk menelepon.')}`}
async function pStar(me){const st=ls('stars',[]),us=MC.users();const l=(await Promise.all(MC.mine().filter(m=>st.includes(m.id)).map(async m=>{const p=m.from===me.phone?m.to:m.from,u=us[p];return u?`<div class="item" data-a="room" data-p="${p}"><div class="mid"><b>${nm(u)}</b><span>${esc(pv(await MC.dec(me.priv,u.pub,m.ct,m.iv)))}</span></div><time>${hm(m.ts)}</time></div>`:''}))).join('');
 return `<div class="page-head"><h1>Berbintang</h1><p>Ketuk pesan di dalam chat untuk memberi bintang.</p></div>${l?`<div class="card list">${l}</div>`:empty('Belum ada pesan berbintang','Ketuk sebuah pesan di dalam chat.')}`}
function pOrder(me){const os=MC.orders().filter(o=>o.phone===me.phone&&o.status!=='baru');return `<div class="page-head"><h1>Order</h1><p>Riwayat pembelian fitur.</p></div>${os.length?`<div class="card list">${os.map(o=>`<div class="item"><div class="mid"><b>${MC.ITEMS[o.item].label}</b><span>${o.id}, ${rp(o.price)}</span></div><span class="chip">${o.status}</span></div>`).join('')}</div>`:empty('Belum ada order','Beli fitur lewat Fitur, Toko.')}`}
const cks=()=>Object.values(MC.users()).filter(u=>u.phone!==MC.me().phone).map(u=>`<label class="item"><input type="checkbox" class="ck" value="${u.phone}"><div class="mid"><b>${esc(u.name)}</b></div></label>`).join('')||'<p>Belum ada kontak. Tambah dulu lewat menu Kontak.</p>',picked=()=>[...document.querySelectorAll('.ck:checked')].map(x=>x.value);
function pDaftar(){const ls_=ls('lists',[]);return `<div class="page-head"><h1>Daftar</h1><p>Kelompokkan kontak, misalnya Pelanggan.</p></div><button class="pairbtn" data-a="newlist">Daftar baru</button><div style="height:14px"></div>${ls_.map(l=>`<div class="card"><b>${esc(l.name)}</b><div class="mid" style="margin:8px 0">${l.members.map(p=>`<span class="chip" data-a="room" data-p="${p}" style="cursor:pointer">${esc(MC.users()[p]?.name||p)}</span>`).join('')}</div><button class="ghostbtn" style="margin:0 8px 0 0" data-a="bclist" data-id="${l.id}">Kirim siaran</button><button class="ghostbtn" style="margin:0" data-a="dellist" data-id="${l.id}">Hapus</button></div>`).join('')||empty('Belum ada daftar','Buat daftar untuk mengelompokkan kontak.')}`}
const SETS=[['profil','Foto, nama, dan bio'],['langganan','Langganan'],['akun','Akun'],['privasi','Privasi'],['chat','Chat'],['tampilan','Tampilan'],['notif','Notifikasi'],['data','Penyimpanan dan data'],['akses','Aksesibilitas'],['perangkat','Perangkat tertaut'],['bahasa','Bahasa aplikasi'],['bantuan','Bantuan dan masukan'],['undang','Undang kontak']];
function pSet(me){const s=S.sub,pf=PF();
 if(!s)return `<div class="page-head"><h1>Pengaturan</h1></div><div class="card list">${SETS.map(([k,t])=>row('sub',L(t),`data-s="${k}"`)).join('')}</div>`;
 const h=(t,b)=>`<div class="page-head"><h1>${t}</h1></div>${b}`,opt=(k,v,t)=>`<button class="${pf[k]===v?'pairbtn':'ghostbtn'}" data-a="pref" data-k="${k}" data-v='${JSON.stringify(v)}' style="margin:0 8px 8px 0">${t}</button>`,tx=t=>`<p class="mid"><span style="white-space:normal">${t}</span></p>`;
 const m={
 langganan:()=>h('Langganan',`<div class="card list">${Object.entries(MC.ITEMS).map(([k,it])=>`<div class="item"><div class="mid"><b>${it.label}</b><span>${rp(it.price)}</span></div>${me[k]?'<span class="chip">Aktif</span>':'<button class="ghostbtn" style="margin:0" data-a="go" data-p="toko">Beli</button>'}</div>`).join('')}</div>`),
 akun:()=>h('Akun',`<div class="card"><div class="mid"><b>@${esc(me.username)}</b><span>${esc(me.phone)}</span></div><button class="ghostbtn" data-a="logout">Keluar</button></div>`),
 privasi:()=>h('Privasi',`<div class="card"><div class="stat-label">Kontak diblokir</div>${me.blocked.length?me.blocked.map(p=>`<div class="item"><div class="mid"><b>${esc(MC.users()[p]?.name||p)}</b></div><button class="ghostbtn" style="margin:0" data-a="unblock" data-p="${p}">Buka blokir</button></div>`).join(''):tx('Tidak ada kontak diblokir')}</div>`),
 chat:()=>h('Chat',`<div class="card">${tx('Pesan terenkripsi end-to-end.')}<button class="ghostbtn" data-a="arsip">Lihat chat diarsipkan (${me.archived.length})</button></div>`),
 tampilan:()=>h('Tampilan',`<div class="card"><div class="stat-label">Tema</div>${opt('theme','dark','Gelap')}${opt('theme','light','Terang')}</div>`),
 notif:()=>h('Notifikasi',`<div class="card">${tx('Status: '+(window.Notification?Notification.permission==='granted'?'aktif':'belum aktif':'tidak didukung di browser ini'))}<button class="pairbtn" data-a="notif">Aktifkan notifikasi</button></div>`),
 data:()=>h('Penyimpanan dan data',`<div class="card"><div class="stat-label">Cache di perangkat: ${Math.round(JSON.stringify(localStorage).length/1024)} KB</div><button class="ghostbtn" data-a="resync">Muat ulang pesan dari server</button><button class="ghostbtn" data-a="clearai">Hapus riwayat Aidhira</button></div>`),
 akses:()=>h('Aksesibilitas',`<div class="card"><div class="stat-label">Ukuran teks</div>${opt('font',.9,'Kecil')}${opt('font',1,'Normal')}${opt('font',1.15,'Besar')}<div class="stat-label" style="margin-top:8px">Kurangi gerakan</div>${opt('calm',false,'Mati')}${opt('calm',true,'Hidup')}</div>`),
 bantuan:()=>h('Bantuan dan masukan',`<div class="card">${tx('Ada kendala atau masukan? Hubungi admin lewat WhatsApp.')}<a href="${wa(MC.OWNER_PHONE)}" target="_blank"><button class="pairbtn">Hubungi admin</button></a></div>`),
 perangkat:()=>h('Perangkat tertaut',`<div class="card list">${(S.dev||[]).map(x=>`<div class="item"><div class="mid"><b>${x.current?'Perangkat ini':esc(x.ua.slice(0,38)||'Perangkat')}</b><span>${new Date(x.ts).toLocaleDateString('id-ID')}</span></div>${x.current?'':`<button class="ghostbtn" style="margin:0" data-a="revoke" data-id="${x.id}">Keluarkan</button>`}</div>`).join('')}</div>`),
 bahasa:()=>h('Bahasa aplikasi',`<div class="card"><div class="stat-label">Label menu dan pengaturan</div>${opt('lang','id','Indonesia')}${opt('lang','en','English')}</div>`),
 undang:()=>h('Undang kontak',`<div class="card">${tx('Ajak temanmu memakai Moon Chat.')}<button class="pairbtn" data-a="invite">Bagikan tautan</button></div>`)};
 return(m[s]||m.langganan)()}

async function render(){const me=MC.me();if(!me){dock(0);return auth(S.reg)}let h;const draft=$('#tx')?.value||'',foc=document.activeElement?.id==='tx';
 if(S.page==='aidhira'||S.peer||S.grp){
  if(S.page==='aidhira'&&!S.peer){const l=ls('ai_'+me.phone,[]);h=roomShell(`${av(BOTS.aidhira)}<div class="grow"><b>Aidhira</b><small>asisten AI untuk semua</small></div>`,bub(l.map(m=>({mine:m.role==='user',text:m.content,ts:m.ts}))),compose)}
  else if(S.grp){const g=MC.groups().find(x=>x.id===S.grp);if(!g){S.grp=null;return render()}h=roomShell(`<div class="grow"><b>${esc(g.name)}</b><small>${g.members.length} anggota</small></div>`,bub(await MC.groupThread(S.grp)),compose)}
  else{const u=MC.users()[S.peer];h=roomShell(`${av(u)}<div class="grow"><b>${nm(u)}</b><small>terenkripsi end-to-end</small></div><button class="iconbtn" data-a="call">${svg('video')}</button><button class="iconbtn" data-a="menu">${svg('more')}</button>`,bub(await MC.thread(S.peer)),attach+compose)}
  dock(0);$('#app').innerHTML=h;hydrate();const t=$('#tx');if(t){t.value=draft;if(foc)t.focus()}window.scrollTo(0,document.body.scrollHeight);return}
 const f={chat:pChat,status:pStatus,kontak:pKontak,fitur:pFitur,telp:pTelp,star:pStar,order:pOrder,set:pSet,toko:pToko,profil:pProfil,lyra:pLyra,daftar:pDaftar}[S.page]||pChat;$('#app').innerHTML=shell(me,(NAV.some(n=>n[0]===S.page)?'':back.replace('Kembali',L('Kembali')))+await f(me));dock(1);applyPref()}

async function askAI(me,text){const key=ls('aikey','')||MC.AI_KEY;if(!key)throw Error('Isi kunci API Aidhira di menu Profil');
 const hist=ls('ai_'+me.phone,[]);hist.push({role:'user',content:text,ts:Date.now()});sv('ai_'+me.phone,hist);await render();
 try{const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'content-type':'application/json','x-api-key':key,'anthropic-version':'2023-06-01','anthropic-dangerous-direct-browser-access':'true'},body:JSON.stringify({model:MC.AI_MODEL,max_tokens:800,system:'Kamu Aidhira, asisten di aplikasi Moon Chat untuk urusan bisnis dan keseharian. Jawab ringkas dalam bahasa yang dipakai pengguna.',messages:hist.slice(-12).map(({role,content})=>({role,content}))})});
  const j=await r.json();if(!r.ok)throw Error(j.error?.message||'Aidhira gagal menjawab');hist.push({role:'assistant',content:j.content.map(c=>c.text||'').join(''),ts:Date.now()})}
 catch(e){hist.pop();sv('ai_'+me.phone,hist);throw e.message==='Failed to fetch'?Error('Aidhira butuh koneksi internet'):e}
 sv('ai_'+me.phone,hist)}
const cp=t=>navigator.clipboard?.writeText(t).catch(()=>{});
const val=id=>$('#'+id)?.value.trim();
const guard=f=>async d=>{try{await f(d)}catch(e){toast(e.message)}};
const A={
 closem,
 cam:()=>modal('<h3>Kamera</h3><p>Ambil foto atau rekam video, lalu bagikan sebagai status.</p><button class="pairbtn" data-a="camp">Foto</button><button class="ghostbtn" data-a="camv">Video</button><button class="ghostbtn" data-a="closem">Batal</button>'),
 camp:()=>{closem();$('#cp').click()},camv:()=>{closem();$('#cv').click()},
 stText:()=>modal(`<h3>Tulis status</h3><textarea class="phone-input" id="st" maxlength="400" placeholder="Tulis status"></textarea><select class="phone-input" id="sb"><option value="#1b2a5c">Biru malam</option><option value="#3b2a55">Ungu senja</option><option value="#14403a">Hijau lumut</option><option value="#5a3a1a">Cokelat emas</option></select><button class="pairbtn" data-a="poststatus">Bagikan status</button><button class="ghostbtn" data-a="closem">Batal</button>`),
 stMedia:()=>$('#sf').click(),
 postmedia:guard(async()=>{const f=S.pf;if(!f)return;const cap=val('sc')||'';toast('Mengunggah...');const id=await MC.upload(f.blob,f.type,f.mime);await MC.postStatus(cap,'#1b2a5c',{id,type:f.type});S.pf=null;closem();render()}),
 delst:d=>modal(`<h3>Hapus status?</h3><p>Status ini akan dihapus untuk semua orang.</p><button class="pairbtn" data-a="delstok" data-id="${d.id}">OK</button><button class="ghostbtn" data-a="closem">Batal</button>`),
 delstok:guard(async d=>{closem();const el=document.querySelector(`.st[data-sid="${d.id}"]`);if(el){dissolve(el.getBoundingClientRect());el.style.visibility='hidden'}await MC.delStatus(d.id);setTimeout(render,850)}),
 attach:()=>$('#af').click(),
 delct:d=>{const u=MC.users()[d.p];modal(`<h3>Hapus ${esc(u?nm(u):d.p)}</h3><p>Pilih yang ingin dihapus.</p><label class="item" style="text-align:left"><input type="radio" name="dc" value="c" checked><div class="mid"><b>Hapus kontak saja</b><span>Chat tetap tersimpan</span></div></label><label class="item" style="text-align:left"><input type="radio" name="dc" value="all"><div class="mid"><b>Hapus kontak beserta chat, video, dan foto</b><span>Seluruh percakapan dihapus dari akunmu</span></div></label><button class="pairbtn" data-a="delok" data-p="${d.p}">OK</button><button class="ghostbtn" data-a="closem">Batal</button>`)},
 delok:guard(async d=>{const all=document.querySelector('input[name=dc]:checked')?.value==='all',row=document.querySelector(`.item[data-p="${d.p}"]`);closem();if(row){dissolve(row.getBoundingClientRect());row.style.visibility='hidden'}if(all)await MC.clearChat(d.p);MC.removeContact(d.p);toast(all?'Kontak dan chat dihapus':'Kontak dihapus');setTimeout(render,800)}),
 fwdok:guard(async()=>{const l=picked();if(!l.length)throw Error('Pilih kontak tujuan');for(const p of l)await MC.send(p,S.fw);closem();toast('Pesan diteruskan')}),
drawer:()=>{$('#dr').classList.toggle('show');$('#ov').classList.toggle('show')},
 nav:d=>{S.anim=S.page!==d.p;S.page=d.p;S.peer=null;S.grp=null;S.sub=null;S.arch=false;render()},home:()=>{S.peer=null;S.grp=null;if(S.page==='aidhira')S.page='fitur';render()},
 toReg:()=>{S.reg=1;render()},toLog:()=>{S.reg=0;render()},
 reg:guard(async()=>{await MC.register({phone:val('ph'),username:val('un'),name:val('nm'),password:$('#pw').value});S.page='chat';render()}),
 log:guard(async()=>{await MC.login(val('ph'),$('#pw').value);S.page='chat';render()}),
 logout:()=>{closem();MC.logout();S.peer=null;render()},
 arch:()=>{S.arch=!S.arch;render()},room:d=>{S.peer=d.p;render()},
 newchat:()=>modal('<h3>Chat baru</h3><p>Masukkan nomor telepon atau username. Pengguna harus sudah terdaftar di aplikasi ini.</p><input class="phone-input" id="nq" placeholder="Nomor atau @username"><button class="pairbtn" data-a="find">Mulai chat</button>'),
 find:guard(async()=>{const me=MC.me();let u;try{u=await MC.find(val('nq'))}catch(e){return toast(e.message)}if(u.phone===me.phone)return toast('Itu akun kamu sendiri');if((me.removed||[]).includes(u.phone)){me.removed=me.removed.filter(x=>x!==u.phone);MC.save(me)}closem();S.peer=u.phone;render()}),
 send:guard(async()=>{const i=$('#tx'),t=i.value.trim();if(!t)return;i.value='';
  if(S.page==='aidhira'&&!S.peer){try{await askAI(MC.me(),t)}finally{await render();$('#tx')?.focus()}return}
  try{S.grp?await MC.sendGroup(MC.groups().find(g=>g.id===S.grp),t):await MC.send(S.peer,t)}catch(e){const x=$('#tx');if(x)x.value=t;throw e}await render();$('#tx')?.focus()}),
 menu:()=>{const me=MC.me(),p=S.peer;modal(`<h3>${esc(MC.users()[p].name)}</h3><button class="ghostbtn" data-a="flag" data-l="archived">${me.archived.includes(p)?'Keluarkan dari arsip':'Arsipkan chat'}</button><button class="ghostbtn" data-a="flag" data-l="blocked">${me.blocked.includes(p)?'Buka blokir':'Blokir kontak'}</button>`)},
 flag:d=>{const me=MC.me(),l=me[d.l],p=S.peer;me[d.l]=l.includes(p)?l.filter(x=>x!==p):[...l,p];MC.save(me);closem();if(d.l==='archived')S.peer=null;render()},
 unblock:d=>{const me=MC.me();me.blocked=me.blocked.filter(x=>x!==d.p);MC.save(me);render()},
 poststatus:guard(async()=>{const t=val('st');if(!t)return;await MC.postStatus(t,$('#sb').value);closem();render()}),
 saveprof:()=>{const me=MC.me();me.name=val('pn')||me.name;me.about=val('pa');MC.save(me);toast('Profil disimpan');render()},
 saveai:()=>{sv('aikey',val('ak'));toast('Kunci disimpan')},
 buy:d=>{const o=MC.newOrder(d.k),it=MC.ITEMS[d.k];modal(`<img class="moon" src="assets/moon.jpg" alt=""><h3>${it.label}</h3><p>Lyra akan membantu pembayaranmu. Scan QRIS, bayar tepat <b style="color:var(--gold)">${rp(it.price)}</b>, lalu pilih foto bukti pembayaran.</p><div class="qris"><img src="assets/qris.jpg" alt="QRIS"></div><input class="phone-input" type="file" id="pp" accept="image/*"><button class="pairbtn" data-a="proof" data-id="${o.id}">Kirim bukti ke admin</button>`)},
 proof:guard(async d=>{const f=$('#pp').files[0];if(!f)throw Error('Pilih foto bukti pembayaran dulu');const o=MC.orders().find(x=>x.id===d.id),it=MC.ITEMS[o.item];
  MC.setOrder(o.id,{status:'menunggu',proof:await shrink(f,700)});
  const text=`Halo admin, saya sudah bayar ${it.label} Moon Chat sebesar ${rp(o.price)}.\n${MC.reqText(o)}\n(bukti pembayaran terlampir)`;
  closem();render();
  if(navigator.canShare?.({files:[f]}))try{await navigator.share({files:[f],text});return}catch{}
  window.open(wa(MC.OWNER_PHONE)+'?text='+encodeURIComponent(text),'_blank');toast('Lampirkan foto bukti di WhatsApp, lalu tunggu kode aktivasi')}),
 redeem:guard(async()=>{await MC.redeem(val('rc'));toast('Fitur aktif');render()}),
 setkey:guard(async()=>{await MC.setOwnerKey(JSON.parse(val('ok')));toast('Lyra aktif');render()}),
 check:()=>{const r=MC.parseReq(val('rq'));if(!r)return toast('Format pesan tidak dikenali');S.req=r;render()},
 review:d=>{S.req=MC.orders().find(o=>o.id===d.id);render()},
 approve:guard(async()=>{const r=S.req,code=await MC.approve(r);
  MC.setOrder(r.id,{status:'aktif'});S.req=null;render();cp(code);
  modal(`<h3>Pembelian dikonfirmasi</h3><p>Kirim kode aktivasi ini ke pembeli. Kode sudah disalin.</p><textarea class="phone-input" readonly>${code}</textarea><a href="${wa(r.phone)}?text=${encodeURIComponent('Pembayaran dikonfirmasi. Kode aktivasi Moon Chat: '+code)}" target="_blank"><button class="pairbtn">Kirim lewat WhatsApp</button></a>`)}),
 reject:()=>{MC.setOrder(S.req.id,{status:'ditolak'});S.req=null;toast('Pembelian ditolak, kabari pembeli');render()},
 call:guard(async()=>{const me=MC.me();if(!me.video){toast('Video Call perlu dibeli dulu');S.peer=null;S.page='toko';return render()}
  toast('Memanggil...');await MC.callStart(S.peer);logc(S.peer,'out')}),
 accept:guard(async()=>{const c=S.inc;S.inc=null;closem();await MC.callAccept(c.from,c.data.sdp);logc(c.from,'in')}),
 decline:()=>{const c=S.inc;S.inc=null;closem();MC.callReject(c.from).catch(()=>{})},
 go:d=>{closem();S.anim=1;S.page=d.p;S.sub=null;S.peer=null;S.grp=null;S.arch=false;render()},
 sub:guard(async d=>{if(d.s==='profil'){S.page='profil';S.sub=null}else{if(d.s==='perangkat')S.dev=(await MC.api('GET','/api/devices')).devices;S.sub=d.s}render()}),
 revoke:guard(async d=>{await MC.api('POST','/api/devices/revoke',{id:d.id});S.dev=(await MC.api('GET','/api/devices')).devices;render()}),
 back:()=>{if(S.page==='set'&&S.sub)S.sub=null;else S.page=['toko','lyra','aidhira'].includes(S.page)?'fitur':'chat';render()},
 more:()=>modal(`<h3>Menu</h3>${[['profil','Profil'],['grup','Grup baru'],['siaran','Siaran bisnis'],['star','Berbintang'],['daftar','Daftar'],['order','Order'],['set','Pengaturan']].map(([p,t])=>`<button class="ghostbtn" data-a="${p==='grup'||p==='siaran'?p:'go'}" data-p="${p}">${L(t)}</button>`).join('')}<button class="ghostbtn" data-a="logout">${L('Keluar')}</button>`),
 grp:d=>{S.grp=d.id;S.peer=null;render()},
 grup:()=>modal(`<h3>Grup baru</h3><input class="phone-input" id="gn" placeholder="Nama grup"><div style="text-align:left;max-height:220px;overflow:auto;margin-bottom:8px">${cks()}</div><button class="pairbtn" data-a="mkgrp">Buat grup</button>`),
 mkgrp:guard(async()=>{const g=await MC.createGroup(val('gn'),picked());closem();S.grp=g.id;S.page='chat';render()}),
 siaran:()=>modal(`<h3>Siaran bisnis</h3><p>Pesan dikirim terpisah ke tiap kontak yang dipilih.</p><div style="text-align:left;max-height:180px;overflow:auto;margin-bottom:8px">${cks()}</div><textarea class="phone-input" id="bm" placeholder="Tulis pesan siaran"></textarea><button class="pairbtn" data-a="sendbc">Kirim siaran</button>`),
 sendbc:guard(async()=>{const t=val('bm'),l=picked();if(!t||!l.length)throw Error('Pilih kontak dan tulis pesan');for(const p of l)await MC.send(p,t);closem();toast('Siaran terkirim ke '+l.length+' kontak');render()}),
 bclist:d=>{const l=ls('lists',[]).find(x=>x.id===d.id);A.siaran();document.querySelectorAll('.ck').forEach(c=>c.checked=l.members.includes(c.value))},
 newlist:()=>modal(`<h3>Daftar baru</h3><input class="phone-input" id="ln" placeholder="Nama daftar"><div style="text-align:left;max-height:220px;overflow:auto;margin-bottom:8px">${cks()}</div><button class="pairbtn" data-a="mklist">Simpan daftar</button>`),
 mklist:guard(async()=>{const n=val('ln'),m=picked();if(!n||!m.length)throw Error('Isi nama dan pilih kontak');sv('lists',[...ls('lists',[]),{id:MC.rid(),name:n,members:m}]);closem();render()}),
 dellist:d=>{sv('lists',ls('lists',[]).filter(x=>x.id!==d.id));render()},
 arsip:()=>{S.page='chat';S.sub=null;S.arch=true;render()},
 mark:d=>{const k=ls('stars',[]);sv('stars',k.includes(d.id)?k.filter(x=>x!==d.id):[...k,d.id]);render()},
 pref:d=>{setPref({[d.k]:JSON.parse(d.v)});render()},
 notif:guard(async()=>{if(!window.Notification)throw Error('Browser tidak mendukung notifikasi');await Notification.requestPermission();render()}),
 resync:guard(async()=>{await MC.syncAll();toast('Pesan dimuat ulang');render()}),
 clearai:()=>{sv('ai_'+MC.me().phone,[]);toast('Riwayat dihapus')},
 invite:async()=>{const t='Chat denganku di Moon Chat: '+location.origin;try{if(navigator.share)return await navigator.share({text:t})}catch{return}cp(t);toast('Tautan disalin')},
 hang:()=>MC.hang()
};

const DK=$('#dk'),shrinkBlob=async(f,w)=>(await fetch(await shrink(f,w))).blob();
const FAB=`<div class="fabs"><button class="fab sm" data-a="stText" aria-label="Tulis status">${svg('pencil')}</button><button class="fab" data-a="stMedia" aria-label="Foto atau video">${svg('plus')}</button></div>`;
const attach=`<button class="iconbtn" data-a="attach" aria-label="Lampirkan foto atau video">${svg('clip')}</button>`;
function dock(show){DK.style.display=show?'flex':'none';if(!show){DK.dataset.v='';return}
 if(DK.dataset.lang!==PF().lang||!DK.children.length){DK.dataset.lang=PF().lang;DK.innerHTML='<div class="pill" id="pl"></div>'+NAV.map(([k,l,i])=>`<button class="tab" data-a="nav" data-p="${k}"><span class="ico">${svg(i)}</span>${L(l)}</button>`).join('')}
 const own={toko:'fitur',lyra:'fitur',aidhira:'fitur'},cur=NAV.findIndex(n=>n[0]===(own[S.page]||S.page)),pl=$('#pl'),w=(DK.clientWidth-10)/NAV.length,fresh=!DK.dataset.v;
 DK.querySelectorAll('.tab').forEach((b,i)=>b.classList.toggle('on',i===cur));
 pl.style.width=w+'px';pl.style.opacity=cur<0?0:1;if(fresh)pl.style.transition='none';
 pl.style.transform=`translateX(${Math.max(cur,0)*w}px)`;
 if(fresh){void pl.offsetWidth;pl.style.transition=''}else if(DK.dataset.v!==String(cur)&&cur>=0){pl.classList.remove('go');void pl.offsetWidth;pl.classList.add('go')}
 DK.dataset.v=String(cur);S.anim=0}
addEventListener('resize',()=>{if(DK.style.display!=='none')dock(1)});
function dissolve(r){const cv=$('#fx'),x=cv.getContext('2d');cv.width=innerWidth;cv.height=innerHeight;
 const Q=Array.from({length:Math.min(280,r.width*r.height/60|0)},()=>({x:r.left+Math.random()*r.width,y:r.top+Math.random()*r.height,vx:(Math.random()-.5)*.8,vy:-(.8+Math.random()*2.2),s:1+Math.random()*2,a:1,g:Math.random()>.35,d:Math.random()*.4}));let f=0;
 (function tick(){x.clearRect(0,0,cv.width,cv.height);f++;Q.forEach(p=>{if(f/60<p.d)return;p.x+=p.vx+Math.sin(f/9+p.s)*.4;p.y+=p.vy;p.a-=.014;if(p.a<=0)return;x.globalAlpha=p.a;x.shadowBlur=8;x.shadowColor='#f2e2b6';x.fillStyle=p.g?'#f2e2b6':'#fff';x.beginPath();x.arc(p.x,p.y,p.s,0,7);x.fill()});if(f<95)requestAnimationFrame(tick);else x.clearRect(0,0,cv.width,cv.height)})()}
// tekan dan tahan: pesan atau kontak
let lpT,lpX=0,lpY=0,lpD=0;const SEL='.b[data-id],.item[data-a="room"][data-p]';
document.addEventListener('pointerdown',e=>{const b=e.target.closest(SEL);if(!b||e.button>0||b.closest('#ov'))return;lpX=e.clientX;lpY=e.clientY;lpT=setTimeout(()=>{lpD=1;navigator.vibrate?.(12);b.matches('.b')?msgMenu(b):ovl(b,[['Hapus kontak',()=>A.delct({p:b.dataset.p}),1]])},430)});
document.addEventListener('pointermove',e=>{if(Math.abs(e.clientX-lpX)+Math.abs(e.clientY-lpY)>10)clearTimeout(lpT)});
['pointerup','pointercancel'].forEach(n=>document.addEventListener(n,()=>{clearTimeout(lpT);setTimeout(()=>lpD=0,350)}));
document.addEventListener('contextmenu',e=>{if(e.target.closest(SEL))e.preventDefault()});
document.addEventListener('click',e=>{if(lpD){lpD=0;e.stopPropagation();e.preventDefault()}},true);
function ovl(el,items){const o=document.createElement('div');o.id='ov';const c=el.cloneNode(true);['data-id','data-a','data-p'].forEach(a=>c.removeAttribute(a));
 if(el.matches('.item')){const w=document.createElement('div');w.className='card list';w.style.cssText='width:min(92vw,420px);margin:0;padding:4px 14px';w.append(c);o.append(w)}else o.append(c);
 const mn=document.createElement('div');mn.className='menu';items.forEach(([l,f,d])=>{const b=document.createElement('button');b.textContent=l;if(d)b.className='d';b.onclick=()=>{o.remove();f()};mn.append(b)});o.append(mn);o.onclick=e=>{if(e.target===o)o.remove()};document.body.append(o)}
function msgMenu(el){const id=el.dataset.id,m=TH[id];if(!m)return;const media=/^MCMEDIA:/.test(m.text),st=ls('stars',[]).includes(id);
 ovl(el,[['Balas',()=>{const t=$('#tx');t.value='↩ '+(media?'(media)':m.text.slice(0,60))+'\n'+t.value;t.focus()}],
 ...(media?[]:[['Teruskan',()=>{S.fw=m.text;modal(`<h3>Teruskan</h3><div style="text-align:left;max-height:240px;overflow:auto;margin-bottom:8px">${cks()}</div><button class="pairbtn" data-a="fwdok">Kirim</button><button class="ghostbtn" data-a="closem">Batal</button>`)}],['Salin',()=>{cp(m.text);toast('Disalin')}]]),
 [st?'Hapus bintang':'Tandai bintang',()=>A.mark({id})],
 ['Info pesan',()=>modal(`<h3>Info pesan</h3><p>${m.mine?'Dikirim':'Diterima'}: ${new Date(m.ts).toLocaleString('id-ID')}<br>Terenkripsi end-to-end.</p><button class="ghostbtn" data-a="closem">Tutup</button>`)],
 ['Hapus untuk saya',()=>dmsg(id,0,el),1],...(m.mine?[['Hapus untuk semua orang',()=>dmsg(id,1,el),1]]:[])])}
async function dmsg(id,all,el){const m=TH[id],md=/^MCMEDIA:/.test(m.text)?sp(m.text.slice(8)):null;dissolve(el.getBoundingClientRect());el.style.visibility='hidden';try{await MC.delMsg(id,all,all&&md?md.id:undefined)}catch(e){toast(e.message)}setTimeout(render,950)}
const MB=new Map();
async function hydrate(){const me=MC.me(),u=MC.users()[S.peer];if(!u)return;document.querySelectorAll('.mm[data-j]').forEach(async el=>{let j;try{j=JSON.parse(decodeURIComponent(el.dataset.j))}catch{return}let url=MB.get(j.id);
 if(!url){try{const r=await fetch((MC.SERVER||'')+'/media/'+j.id);if(!r.ok)throw 0;url=URL.createObjectURL(new Blob([await MC.decFile(me.priv,u.pub,await r.arrayBuffer(),j.iv)],{type:j.m}));MB.set(j.id,url)}catch{el.textContent='Media tidak tersedia';return}}
 el.innerHTML=j.k==='video'?`<video src="${url}" controls playsinline style="max-width:100%;border-radius:10px"></video>`:`<img src="${url}" alt="" style="max-width:100%;border-radius:10px;display:block">`;el.removeAttribute('data-j')})}
async function pickMedia(f){const img=f.type.startsWith('image/'),vid=f.type.startsWith('video/');if(!img&&!vid)return toast('Pilih foto atau video');if(vid&&f.size>25e6)return toast('Video maksimal 25 MB');
 const blob=img?await shrinkBlob(f,1280):f;S.pf={blob,type:img?'image':'video',mime:img?'image/jpeg':(f.type||'video/mp4')};const u=URL.createObjectURL(blob);
 modal(`<h3>Bagikan status</h3>${img?`<img src="${u}" alt="" style="width:100%;border-radius:12px;margin-bottom:10px">`:`<video src="${u}" controls playsinline style="width:100%;border-radius:12px;margin-bottom:10px;max-height:50vh"></video>`}<input class="phone-input" id="sc" maxlength="200" placeholder="Tambah keterangan (opsional)"><button class="pairbtn" data-a="postmedia">Bagikan</button><button class="ghostbtn" data-a="closem">Batal</button>`)}
async function sendAtt(f){if(!S.peer)return toast('Lampiran hanya untuk chat pribadi');const img=f.type.startsWith('image/'),vid=f.type.startsWith('video/');if(!img&&!vid)return toast('Pilih foto atau video');if(vid&&f.size>25e6)return toast('Video maksimal 25 MB');
 toast('Mengirim...');await MC.sendMedia(S.peer,img?new File([await shrinkBlob(f,1600)],'foto.jpg',{type:'image/jpeg'}):f,img?'image':'video');await render()}
document.addEventListener('change',guard(async e=>{const id=e.target.id,f=e.target.files&&e.target.files[0];if(!f||!['sf','cp','cv','af'].includes(id))return;e.target.value='';id==='af'?await sendAtt(f):await pickMedia(f)}));
MC.ondel=()=>{if(S.peer||S.grp||S.page==='chat'||S.page==='star')render()};
document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b||(b.id==='modal'&&e.target!==b))return;if(b.tagName==='A'&&b.dataset.a==null)return;A[b.dataset.a]?.(b.dataset)});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id==='tx')A.send()});
document.addEventListener('change',guard(async e=>{if(e.target.id==='pf'){const me=MC.me();me.photo=await shrink(e.target.files[0],200);MC.save(me);render()}}));
MC.onmsg=m=>{const me=MC.me();if(!me)return;if(m.from!==me.phone&&!((S.peer===m.from||(S.grp&&S.grp===m.g))&&!document.hidden)){const u=MC.users()[m.from];toast('Pesan baru dari '+(u?.name||m.from));
  if(document.hidden&&window.Notification?.permission==='granted')new Notification(u?.name||'Moon Chat',{body:'Pesan baru',icon:'assets/logo.svg'})}
 if(S.peer||S.grp||S.page==='chat')render()};
MC.onsync=()=>{if(!MC.me())return;if(S.page==='status'&&val('st'))return;render()};
MC.onstatus=()=>{if(S.page==='status'&&!val('st'))render()};
MC.onsignal=async({from,name,data:d})=>{if(d.type==='offer'){S.inc={from,data:d};modal(`<h3>${esc(name)} memanggil</h3><p>Panggilan video masuk.</p><button class="pairbtn" data-a="accept">Terima</button><button class="ghostbtn" data-a="decline">Tolak</button>`)}
 else if(d.type==='answer')MC.callAnswered(d.sdp);else if(d.type==='bye'){S.inc=null;closem();MC.hang(true);toast('Panggilan berakhir')}};
applyPref();if(MC.me()&&ls('token')){MC.syncAll().then(()=>render()).catch(()=>{});MC.connect()}
render();
})();
