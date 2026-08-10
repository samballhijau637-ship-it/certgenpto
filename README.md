# CertGen Pro — Landing Page & Sistem Lisensi

Landing page penjualan lisensi SaaS untuk **CertGen Pro** — aplikasi desktop
Windows untuk generate & kirim ratusan sertifikat digital secara massal.

Dibangun di atas arsitektur sistem lisensi otomatis: **Next.js + Supabase +
Midtrans (Snap) + Brevo (email) + Fonnte (WhatsApp)**.

## Yang berubah vs sebelumnya

- ✅ GitHub repo baru, akun Vercel baru → **domain baru**
- ✅ Supabase → **tetap pakai project/database lama** (skema tabel tidak berubah)
- ✅ Token/kunci Midtrans, Fonnte, Brevo → **tetap sama**
- ✅ Endpoint webhook (`/api/payment/webhook`) → **path tidak berubah**, hanya domain di depannya yang beda
- ✅ Harga & copywriting → didesain ulang khusus untuk produk CertGen Pro
- ✅ Callback "finish" Midtrans → di-hardcode langsung di `pages/api/payment/create.js` (lihat komentar di file tersebut), **tidak** perlu diset di Dashboard Midtrans

## Harga Resmi

| Paket    | Durasi     | Harga      | Tersedia di |
|----------|------------|------------|-------------|
| Harian   | 1 hari     | Rp 19.000  | Halaman Renew saja |
| Bulanan  | 30 hari    | Rp 49.000  | Landing utama & Renew |
| Tahunan  | 365 hari   | Rp 299.000 | Landing utama & Renew (Terbaik) |
| Lifetime | Selamanya  | Rp 599.000 | Landing utama & Renew |

## Struktur Halaman

- `/` — Landing page utama (hero, pain point, fitur, cara kerja, social proof, testimoni, pricing + form beli, FAQ, 3 tombol CTA)
- `/renew` — Perpanjangan lisensi (termasuk paket Harian Rp19.000)
- `/thankyou` — Halaman sukses setelah pembayaran (diakses via callback `finish`, bukan lewat setting Midtrans)
- `/failed` — Halaman pembayaran gagal/dibatalkan
- `/download` — Halaman unduh aplikasi desktop
- `/terms` — Syarat & Ketentuan
- `/admin` — Dashboard admin (kelola lisensi, kupon, & rilis unduhan)

## Fitur Dashboard Admin

- CRUD lisensi manual, kupon, dan rilis unduhan (seperti sebelumnya)
- 🔍 Pencarian lisensi (email/WA/tanggal/kode)
- 🆕 **Filter cepat status**: Semua / Aktif / Pending / **Kedaluwarsa**
- 🆕 **Checklist "Pilih Semua Kedaluwarsa"** saat filter Kedaluwarsa aktif
- 🆕 **Hapus massal** (bulk delete) lisensi kedaluwarsa yang dicentang, langsung dari database

## Panduan Deploy (GitHub + Vercel Akun Baru)

1. **Push ke GitHub baru**
   ```bash
   git init
   git add .
   git commit -m "CertGen Pro landing page"
   git remote add origin https://github.com/<akun-baru-anda>/certgenpro-landing.git
   git push -u origin main
   ```

2. **Import ke Vercel (akun baru)** → hubungkan ke repo di atas.

3. **Set Environment Variables** di Vercel (Project Settings → Environment
   Variables) — isi sesuai `.env.example`:
   - `SUPABASE_URL` & `SUPABASE_SERVICE_ROLE_KEY` → **pakai project Supabase LAMA**
   - `MIDTRANS_SERVER_KEY`, `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY`, `MIDTRANS_IS_PRODUCTION` → **sama seperti sebelumnya**
   - `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, `BREVO_SENDER_NAME` → **sama seperti sebelumnya**
   - `FONNTE_TOKEN` → **sama seperti sebelumnya**
   - `SITE_URL` → domain Vercel baru Anda, mis. `https://certgenpro.vercel.app`
   - `DOWNLOAD_LINK` → link download aplikasi (boleh sama dengan `{SITE_URL}/download`)
   - `ADMIN_PASSWORD`, `CRON_SECRET` → boleh pakai yang lama atau buat baru

4. **Deploy.**

5. **Update satu-satunya setting di sisi Midtrans:** Dashboard Midtrans →
   Settings → Configuration → **Payment Notification URL** diarahkan ke
   `https://<domain-baru-anda>/api/payment/webhook`.
   (Callback "finish" **tidak perlu** diatur di sini karena sudah dikirim
   langsung lewat kode di `create.js`/`renew.js`.)

6. Selesai — Supabase tetap yang lama, jadi semua lisensi lama tetap ada dan
   sistem verifikasi lisensi di aplikasi desktop tidak perlu diubah sama sekali.

## Catatan Format Nomor WhatsApp

Form pembelian meminta format lokal `08xxxxxxxxxx` (tanpa `+62`) supaya tidak
membingungkan pembeli. Normalisasi ke format `628xxxxxxxxxx` (dibutuhkan oleh
Fonnte) dilakukan otomatis di sisi client sebelum dikirim ke server.
