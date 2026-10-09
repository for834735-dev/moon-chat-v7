// Konfigurasi Moon Chat (semua berjalan di dalam aplikasi, tanpa server)
window.MC={
  SERVER:'', // kosong = server yang sama dengan halaman. Untuk APK isi mis. 'https://chat.domainmu.com'
  ICE:null,  // opsional: daftar TURN/STUN untuk video call antar jaringan berbeda
  OWNER_PHONE:'089502238859',
  OWNER_PUB:{"key_ops":["verify"],"ext":true,"kty":"EC","x":"Q6jfcWFThzzCNC02nC2_Dl9KFzUb6YzY1hz2TAnGP8M","y":"Xjp8qBZlXJGjhxwBa2LTr07ZRff-d9TD1HiY-3hVlVQ","crv":"P-256"},
  ITEMS:{video:{label:'Video Call',price:25000},blue:{label:'Centang Biru',price:49000}},
  AI_KEY:'',
  AI_MODEL:'claude-sonnet-5-5'
};
