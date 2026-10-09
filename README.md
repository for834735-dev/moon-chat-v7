# Moon Chat

Chat real-time antar perangkat lewat server relay kecil (tanpa dependensi).

## Jalankan
    node server.js        # lalu buka http://localhost:3000
Butuh Node 18+. Data akun dan pesan tersimpan di data.json (pesan hanya berupa teks sandi E2E).

## Fitur
Chat 1:1 dan grup real-time, siaran bisnis, daftar kontak, berbintang, status, video call, perangkat tertaut, pengaturan tampilan/notifikasi/aksesibilitas, bahasa Indonesia/English (label menu).

## Catatan
- Pesan dienkripsi di perangkat (ECDH + AES-GCM); server hanya meneruskan.
- Deploy ke hosting yang mendukung Node dan HTTPS (Render, Railway, VPS). Video call dan notifikasi butuh HTTPS.
- Untuk APK: isi SERVER di config.js dengan alamat servermu.
- Video call antar jaringan berbeda kadang butuh TURN: isi ICE di config.js.
- Harga dan nomor admin: config.js. Ganti QRIS: assets/qris.jpg.
- Kunci pemilik (Lyra) di file terpisah KUNCI-PEMILIK.txt, jangan dimasukkan ke APK atau server.

## Deploy (penting)
Vercel tidak bisa menjalankan server.js (fungsi sesaat, tanpa koneksi real-time dan tanpa disk).
- Paling mudah: deploy folder ini ke Render (New > Blueprint, atau Web Service dengan start `node server.js`). Tampilan dan server jalan bersama, sama seperti di localhost.
- Kalau tetap mau tampilan di Vercel: deploy server ke Render, lalu isi SERVER di config.js dengan alamat Render, dan deploy ulang ke Vercel.
- Paket gratis Render tidak punya disk tetap, jadi data.json bisa hilang saat restart.

## Tambahan versi ini
- Tab bawah liquid glass, ikon kamera dan menu titik tiga di pojok kanan atas.
- Tekan dan tahan pesan: latar blur + menu (Balas, Teruskan, Salin, Bintang, Info, Hapus). "Hapus untuk semua orang" hanya untuk pesan sendiri dan benar-benar menghapus di server dan di perangkat lawan bicara. Pesan, status, dan kontak yang dihapus melebur jadi partikel.
- Tekan dan tahan kontak: Hapus kontak saja, atau beserta chat, foto, dan video (OK / Batal).
- Status: tombol + (foto/video), pensil (teks), kamera, dan hapus status.
- Foto dan video di chat pribadi dienkripsi end-to-end di perangkat (AES-GCM) sebelum diunggah. Media status tidak dienkripsi (seperti teks status).
- Berkas media disimpan di folder uploads/ pada server. Di hosting tanpa disk tetap (Render gratis) berkas ikut hilang saat restart. Batas 25 MB.
