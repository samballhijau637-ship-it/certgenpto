# CATATAN SETUP — CertGen Pro Landing Page

## Yang perlu Anda lakukan (GitHub & Vercel BARU)

1. **Push ke repo GitHub baru** (akun baru Anda) — push isi folder ini apa adanya.
2. **Import project ke Vercel** (akun baru), Root Directory `./` (persis seperti screenshot yang Anda kirim).
3. **Salin ulang SEMUA Environment Variables** ke project Vercel baru — nilainya
   **HARUS SAMA PERSIS** dengan project lama Anda karena:
   - Supabase (database) masih yang **lama** → `SUPABASE_URL` & `SUPABASE_SERVICE_ROLE_KEY` harus sama persis.
   - Midtrans, Fonnte, Brevo → server key / token tetap sama (tidak berubah, sesuai permintaan Anda).
   - `LICENSE_RSA_PRIVATE_KEY_B64` harus sama persis (kalau beda, lisensi lama yang sudah terbit tidak akan valid lagi).
4. **WAJIB diisi baru** (2 variabel ini yang benar-benar baru, karena domain Anda ganti):
   - `NEXT_PUBLIC_SITE_URL` → isi dengan domain Vercel project baru Anda, contoh `https://certgenpro-landing.vercel.app`.
   - `DOWNLOAD_LINK` → isi dengan link download installer CertGen Pro (bisa halaman `/download` di domain baru, atau link GitHub Release/Drive Anda).
5. Referensi lengkap semua variabel ada di `.env.example`.

## Tentang link webhook

Anda minta link webhook Midtrans/Fonnte/Brevo **tidak berubah** — ini otomatis
aman selama Anda memakai **domain custom** yang sama, ATAU selama Anda update
webhook URL di dashboard Midtrans ke domain Vercel yang baru. Kalau sebelumnya
webhook terdaftar ke domain Vercel *lama* (mis. `motion-graphic-sigma.vercel.app`),
domain itu akan mati begitu project lama dihapus/tidak dipakai — jadi:

- Kalau Anda pakai **domain custom sendiri** (mis. `certgenpro.com`) yang tinggal
  dipindah DNS-nya ke project baru → webhook URL tidak perlu diubah sama sekali. ✅
- Kalau selama ini masih pakai domain bawaan `*.vercel.app` → Anda **tetap perlu**
  update Notification URL di dashboard Midtrans ke domain `*.vercel.app` yang baru,
  karena domain lama otomatis tidak aktif lagi. Ini satu-satunya bagian yang di
  luar kendali kode (murni setting di dashboard Midtrans, bukan sesuatu yang bisa
  saya "kunci" dari sisi kode).

Kode webhook itu sendiri (`pages/api/payment/webhook.js`, path `/api/payment/webhook`)
**tidak saya ubah** — jalur/logic-nya identik dengan sebelumnya.

## Ringkasan perubahan harga

| Halaman | Paket | Harga Lama | Harga Baru |
|---|---|---|---|
| Landing utama (`/`) | Bulanan | – | **Rp 49.000** |
| Landing utama (`/`) | Tahunan | – | **Rp 299.000** |
| Landing utama (`/`) | Lifetime | – | **Rp 599.000** |
| Renew (`/renew`) | Harian *(baru)* | – | **Rp 19.000** |
| Renew (`/renew`) | Bulanan | Rp 29.000 | **Rp 49.000** |
| Renew (`/renew`) | Tahunan | Rp 149.000 | **Rp 299.000** |
| Renew (`/renew`) | Lifetime | Rp 399.000 | **Rp 599.000** |

## Ringkasan perubahan kode per file

- `lib/notify.js` — hapus hack nama app "SVG Motion", tambah `normalizeWhatsApp()`
  (otomatis ubah input `08xxx` → `628xxx` untuk Fonnte).
- `pages/api/payment/create.js` — tabel harga baru + `callbacks.finish` Midtrans
  mengarah ke `/thankyou` (BUKAN didaftarkan di dashboard Midtrans, tapi otomatis
  ikut di payload setiap transaksi — sesuai contoh kode yang Anda kirim).
- `pages/api/payment/webhook.js` — hanya ganti label nama app jadi "CertGen Pro".
  Logic verifikasi signature & update database **tidak disentuh**.
- `pages/api/renew.js` — tambah paket `daily` (Rp 19.000) + `callbacks.finish` juga.
- `pages/api/admin/licenses.js` — endpoint `DELETE` sekarang menerima `{ ids: [...] }`
  untuk hapus banyak lisensi sekaligus (dipakai fitur hapus massal di admin).
- `pages/admin/index.js` — tombol filter "Tampilkan Kadaluarsa", checkbox pilih
  semua per baris, tombol "Hapus N Terpilih".
- `pages/index.js`, `pages/renew.js`, `pages/thankyou.js`, `pages/terms.js`,
  `pages/download.js` — landing page baru, tema biru, copywriting & FAQ sesuai
  brief Anda (termasuk 4 poin FAQ wajib: aplikasi desktop Windows 10/11, offline
  kecuali kirim email, lisensi dikirim via WA+email dari form pembelian, format
  nomor WA 08xxx tanpa +62).

## Yang TIDAK saya ubah (sengaja)

- `lib/adminAuth.js`, `lib/supabase.js`, `lib/jwt.js` — generik, tidak menyinggung
  branding/harga.
- `pages/api/admin/coupons.js`, `pages/api/admin/downloads.js`,
  `pages/api/admin/login.js`, `pages/api/cron/keepalive.js`, `pages/failed.js`,
  `pages/api/license/verify.js` — tidak ada referensi branding/harga lama, aman
  dipakai apa adanya.
- Struktur `app_id = 'certgenpro'` di database **tidak diubah**, supaya kompatibel
  dengan data lisensi lama yang sudah ada di Supabase.

## Build check

Sudah saya jalankan `next build` secara lokal — seluruh halaman (termasuk
`/admin`, semua API routes) berhasil dikompilasi tanpa error.
