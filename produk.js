/* kredit-maliki: Template oleh Maliki Saputra (@malikisaputra) — https://malikisaputra.biz.id. Lisensi Nonkomersial Maliki Studio: wajib kredit, dilarang dijual (lihat LICENSE). */
/* =========================================================
   PENGATURAN TOKO & DATA PRODUK — cukup ubah berkas ini.
   ========================================================= */
window.TOKO = {
  nama: (window.TEMA && TEMA.nama) || 'AЯRV Official Store', // nama toko diambil dari tema.js
  slogan: 'Not just a shirt. It’s a story.',
  // Nomor WhatsApp format internasional tanpa + dan tanpa spasi (62 = Indonesia).
  // Jika dikosongkan, tombol "Pesan via WhatsApp" hanya menampilkan pemberitahuan.
  wa: '6281399187524',
  alamat: 'Kota Batu, Bogor', // tampil di kaki halaman (kosongkan '' untuk menyembunyikan)
  mataUang: 'Rp',
  // Pengiriman lewat ekspedisi: ongkir mengikuti tarif sesuai alamat tujuan, jadi dicek admin lewat chat.
  ongkir: [
    { kota: 'J&T Express', biaya: 0, tanya: true },
    { kota: 'JNE', biaya: 0, tanya: true }
  ],
  // Gratis ongkir untuk pembelian minimal 2 pcs. Semua desain Rp95.000, jadi 2 pcs = Rp190.000.
  // Kalau nanti harga berbeda-beda, angka ini perlu disesuaikan (aturan bawaan template berdasarkan nominal, bukan jumlah pcs).
  gratisOngkirMin: 190000,
  // OPSIONAL: ambil produk dari Google Sheet (File → Bagikan → Publikasikan ke web → CSV).
  // Kolom: id,nama,kategori,harga,hargaCoret,deskripsi,varian,gambar,stok,label
  sheetCSV: '',
  // LOGO & FOTO — ganti cukup timpa berkas di img/ atau ubah path di sini.
  logo: '',                                     // tampil di header; kosongkan '' = inisial nama toko
  fotoKosong: 'img/foto-produk.svg'  // dipakai bila produk tanpa gambar / foto gagal dimuat
};

/* Stok: `stok` = total pcs produk; `stokOpsi` = stok per ukuran (0 = habis, tombol ukuran dinonaktifkan).
   Kurangi angka ini setiap kali ada yang terjual, lalu unggah ulang berkas.
   Gambar: tiap produk memakai 3 foto (gantungan, model, detail/spesifikasi) di folder img/.
   Foto pertama jadi gambar utama di kartu. Ganti file di img/ dengan nama yang sama untuk memperbarui foto. */
window.PRODUK = [
  {
    id: 'archive-001', nama: 'Archive 001 — CAT-01', kategori: 'Graphic Tee', harga: 95000, stok: 1, stokOpsi: { M: 0, L: 1, XL: 0 },
    deskripsi: 'Cotton Combed 20s · 200–210 GSM · Boxy Fit. Seri AЯRV — THE ARCHIVE. Karakter CAT dengan tulisan “Not in the Mood”. Kaos graphic boxy fit unisex berbahan cotton combed 20s, sablon logo/karakter kecil di dada kiri dan artwork karakter ukuran A3 di bagian belakang. Setiap kaos punya karakter, cerita, dan identitasnya sendiri.',
    varian: [{ nama: 'Ukuran', opsi: ['M', 'L', 'XL'] }],
    gambar: ['img/archive-001-foto.jpg', 'img/archive-001-model.jpg', 'img/archive-001-detail.jpg']
  },
  {
    id: 'archive-002', nama: 'Archive 002 — FOX-02', kategori: 'Graphic Tee', harga: 95000, stok: 2, stokOpsi: { M: 1, L: 1, XL: 0 },
    deskripsi: 'Cotton Combed 20s · 200–210 GSM · Boxy Fit. Seri AЯRV — THE ARCHIVE. Karakter FOX dengan tulisan “Nothing Excites Me Anymore”. Kaos graphic boxy fit unisex berbahan cotton combed 20s, sablon logo/karakter kecil di dada kiri dan artwork karakter ukuran A3 di bagian belakang. Setiap kaos punya karakter, cerita, dan identitasnya sendiri.',
    varian: [{ nama: 'Ukuran', opsi: ['M', 'L', 'XL'] }],
    gambar: ['img/archive-002-foto.jpg', 'img/archive-002-model.jpg', 'img/archive-002-detail.jpg']
  },
  {
    id: 'archive-003', nama: 'Archive 003 — DUCK-03', kategori: 'Graphic Tee', harga: 95000, stok: 1, stokOpsi: { M: 0, L: 0, XL: 1 },
    deskripsi: 'Cotton Combed 20s · 200–210 GSM · Boxy Fit. Seri AЯRV — THE ARCHIVE. Karakter DUCK dengan tulisan “Confused, Full of Anxiety”. Kaos graphic boxy fit unisex berbahan cotton combed 20s, sablon logo/karakter kecil di dada kiri dan artwork karakter ukuran A3 di bagian belakang. Setiap kaos punya karakter, cerita, dan identitasnya sendiri.',
    varian: [{ nama: 'Ukuran', opsi: ['M', 'L', 'XL'] }],
    gambar: ['img/archive-003-foto.jpg', 'img/archive-003-model.jpg', 'img/archive-003-detail.jpg']
  },
  {
    id: 'archive-004', nama: 'Archive 004 — SUBJECT-04', kategori: 'Graphic Tee', harga: 95000, stok: 2, stokOpsi: { M: 1, L: 1, XL: 0 },
    deskripsi: 'Cotton Combed 20s · 200–210 GSM · Boxy Fit. Seri AЯRV — THE ARCHIVE. Karakter SUBJECT dengan tulisan “I Have No Idea”. Kaos graphic boxy fit unisex berbahan cotton combed 20s, sablon logo/karakter kecil di dada kiri dan artwork karakter ukuran A3 di bagian belakang. Setiap kaos punya karakter, cerita, dan identitasnya sendiri.',
    varian: [{ nama: 'Ukuran', opsi: ['M', 'L', 'XL'] }],
    gambar: ['img/archive-004-foto.jpg', 'img/archive-004-model.jpg', 'img/archive-004-detail.jpg']
  }
];
