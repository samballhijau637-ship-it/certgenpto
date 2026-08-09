// pages/renew.js
// ============================================================================
// HALAMAN RENEW (PERPANJANG LISENSI) — CertGenPro
//
// CATATAN PENTING:
// 1. Mengikuti pola pages/renew.js yang SUDAH BERJALAN saat ini: form ini
//    memanggil /api/payment/create (SAMA seperti pembelian baru di landing
//    page), BUKAN /api/renew.js. Ini saya samakan persis dengan alur yang
//    sudah ada sekarang supaya tidak mengubah logic/endpoint apa pun.
//    -> Konsekuensinya: proses "renew" lewat halaman ini sebenarnya membuat
//       transaksi/lisensi baru di Supabase (bukan memperpanjang expires_at
//       dari license_key lama). Endpoint pages/api/renew.js yang sudah ada
//       (yang benar-benar extend expires_at berdasarkan license_key) BELUM
//       dipakai oleh UI ini. Kalau kamu mau halaman ini benar-benar
//       memperpanjang lisensi lama (bukan bikin baru), kabari saya di sesi
//       berikutnya — saya akan sambungkan form ini ke /api/renew.js
//       (perlu tambahan input "Kode Lisensi Lama").
// 2. app_id, endpoint, dan struktur request TIDAK DIUBAH.
// 3. Harga di halaman ini (19rb/49rb/299rb/599rb) HANYA tampilan. Nominal
//    yang benar-benar ditagihkan diambil dari PRICE_TABLE di server
//    (pages/api/payment/create.js) — jadi PRICE_TABLE wajib disesuaikan
//    juga (termasuk menambahkan tier 'daily': 19000) di sesi backend.
// ============================================================================

import { useState } from 'react';
import Head from 'next/head';
import Script from 'next/script';

const APP_ID = 'certgenpro';
const WHATSAPP_NUMBER = '6289627312600';
const WHATSAPP_DISPLAY = '0896-2731-2600';
const WHATSAPP_LINK = (msg) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

const COLOR = {
    bg: '#080d1a',
    bgCard: '#0f1830',
    bgElevated: '#0b1326',
    border: '#1e2a47',
    accent: '#2563eb',
    accentSoft: '#60a5fa',
    text: '#f8fafc',
    textMuted: '#94a3b8',
    textFaint: '#64748b',
};
const FONT_HEAD = "'Plus Jakarta Sans', system-ui, sans-serif";
const FONT_BODY = "'DM Sans', system-ui, sans-serif";

const PACKAGES = [
    { id: 'daily', label: 'Harian', duration: '1 Hari', price: 'Rp 19.000', desc: 'Untuk kebutuhan event mendadak atau uji coba singkat.' },
    { id: 'monthly', label: 'Bulanan', duration: '30 Hari', price: 'Rp 49.000', desc: 'Fleksibel untuk kebutuhan event musiman.' },
    { id: 'yearly', label: 'Tahunan', duration: '365 Hari', price: 'Rp 299.000', desc: 'Rekomendasi terbaik — hemat dibanding bulanan.', popular: true },
    { id: 'lifetime', label: 'Lifetime', duration: 'Selamanya', price: 'Rp 599.000', desc: 'Sekali bayar, aktif selamanya tanpa perpanjangan lagi.' },
];

export default function Renew() {
    const [form, setForm] = useState({ email: '', whatsapp: '', package_type: 'yearly', coupon_code: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // ================= LOGIC RENEW — JANGAN DIUBAH =================
    // Sengaja disamakan persis dengan pages/renew.js yang sudah berjalan
    // sekarang: submit ke /api/payment/create (bukan /api/renew.js).
    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const res = await fetch('/api/payment/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ app_id: APP_ID, ...form }),
            });
            const data = await res.json();

            if (!res.ok) {
                setMessage(`Gagal: ${data.error}`);
                return;
            }

            if (data.free_trial) {
                window.location.href = `/thankyou?license_key=${data.license_key}`;
                return;
            }

            if (window.snap) {
                window.snap.pay(data.snap_token, {
                    onSuccess: () => {
                        window.location.href = `/thankyou?license_key=${data.license_key}`;
                    },
                    onPending: () => {
                        setMessage('Pembayaran tertunda. Selesaikan pembayaran untuk menerima lisensi.');
                    },
                    onError: () => {
                        window.location.href = '/failed';
                    },
                    onClose: () => {
                        setMessage('Popup pembayaran ditutup.');
                    },
                });
            }
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }
    // ================= END LOGIC RENEW =================

    const selected = PACKAGES.find((p) => p.id === form.package_type) || PACKAGES[2];

    return (
        <>
            <Head>
                <title>Perpanjang Lisensi CertGenPro</title>
                <meta name="description" content="Perpanjang lisensi CertGenPro — pilih paket Harian, Bulanan, Tahunan, atau Lifetime." />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=DM+Sans:wght@400;500;700&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <Script
                src={
                    process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true'
                        ? 'https://app.midtrans.com/snap/snap.js'
                        : 'https://app.sandbox.midtrans.com/snap/snap.js'
                }
                data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
            />
            <div style={containerStyle}>
                <main style={cardStyle}>
                    <a href="/" style={backLinkStyle}>← Kembali ke Beranda</a>

                    <div style={{ textAlign: 'center', marginBottom: 26 }}>
                        <span style={badgeStyle}>PERPANJANG LISENSI</span>
                        <h1 style={titleStyle}>📜 Perpanjang Lisensi CertGenPro</h1>
                        <p style={subtitleStyle}>Pilih durasi paket yang sesuai kebutuhan produksi sertifikatmu.</p>
                        <p style={{ marginTop: 10, fontSize: 12, color: COLOR.textFaint }}>
                            Ada kendala perpanjangan lisensi?{' '}
                            <a
                                href={WHATSAPP_LINK('Halo Admin, saya butuh bantuan untuk perpanjangan (renew) lisensi CertGenPro.')}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: COLOR.accentSoft, fontWeight: 'bold', textDecoration: 'none' }}
                            >
                                💬 Chat Admin ({WHATSAPP_DISPLAY})
                            </a>
                        </p>
                    </div>

                    {/* Grid Pilihan Paket */}
                    <div style={gridStyle} className="pkg-grid-renew">
                        {PACKAGES.map((pkg) => {
                            const isSelected = form.package_type === pkg.id;
                            return (
                                <div
                                    key={pkg.id}
                                    onClick={() => setForm({ ...form, package_type: pkg.id })}
                                    style={{
                                        ...pkgCardStyle,
                                        borderColor: isSelected ? COLOR.accent : COLOR.border,
                                        background: isSelected ? 'rgba(37,99,235,0.12)' : COLOR.bgElevated,
                                    }}
                                >
                                    {pkg.popular && <span style={popularBadgeStyle}>TERPOPULER</span>}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                        <h3 style={{ margin: 0, color: '#fff', fontSize: 15 }}>{pkg.label}</h3>
                                        <span style={{ fontSize: 11, color: COLOR.accentSoft, fontWeight: 'bold' }}>{pkg.duration}</span>
                                    </div>
                                    <h4 style={{ margin: '6px 0', fontSize: 18, fontWeight: 'bold', color: isSelected ? COLOR.accentSoft : '#fff' }}>
                                        {pkg.price}
                                    </h4>
                                    <p style={{ margin: 0, fontSize: 11, color: COLOR.textMuted, lineHeight: '1.3' }}>{pkg.desc}</p>
                                </div>
                            );
                        })}
                    </div>

                    <div style={summaryStyle}>
                        <span style={{ color: COLOR.textMuted }}>Paket dipilih:</span>{' '}
                        <strong style={{ color: '#fff' }}>{selected.label}</strong>{' '}
                        <span style={{ color: COLOR.textFaint }}>({selected.duration})</span>
                        <span style={{ float: 'right', color: COLOR.accentSoft, fontWeight: 800 }}>{selected.price}</span>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div>
                            <label style={labelStyle}>Alamat Email (yang didaftarkan saat beli pertama kali)</label>
                            <input
                                type="email"
                                required
                                placeholder="nama@email.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                style={inputStyle}
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>Nomor WhatsApp (format: 08xxxxxxxxxx)</label>
                            <input
                                type="tel"
                                required
                                inputMode="numeric"
                                pattern="0[0-9]{9,13}"
                                placeholder="081234567890"
                                value={form.whatsapp}
                                onChange={(e) => setForm({ ...form, whatsapp: e.target.value.replace(/[^0-9]/g, '') })}
                                style={inputStyle}
                            />
                            <p style={hintStyle}>Awali angka 0, tanpa +62 — supaya lisensi tidak salah kirim.</p>
                        </div>

                        <div>
                            <label style={labelStyle}>Kode Kupon (Opsional)</label>
                            <input
                                type="text"
                                placeholder="KUPON_DISKON"
                                value={form.coupon_code}
                                onChange={(e) => setForm({ ...form, coupon_code: e.target.value })}
                                style={inputStyle}
                            />
                        </div>

                        <button type="submit" disabled={loading} style={buttonStyle}>
                            {loading ? 'Memproses...' : `Bayar ${selected.price} & Perpanjang 💳`}
                        </button>
                        <p style={{ textAlign: 'center', fontSize: 11.5, color: COLOR.textFaint, margin: 0 }}>
                            ✓ Lisensi baru otomatis via WhatsApp &amp; Email
                        </p>
                    </form>

                    {message && <p style={messageStyle}>{message}</p>}

                    <p style={{ textAlign: 'center', fontSize: 12, color: COLOR.textFaint, marginTop: 16 }}>
                        Butuh bantuan proses pembayaran?{' '}
                        <a
                            href={WHATSAPP_LINK('Halo Admin, saya butuh bantuan proses pembayaran renew CertGenPro.')}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: COLOR.accentSoft, fontWeight: 'bold', textDecoration: 'none' }}
                        >
                            💬 Chat Admin via WhatsApp
                        </a>
                    </p>
                </main>
            </div>
            <style jsx>{`
                @media (min-width: 560px) {
                    .pkg-grid-renew { grid-template-columns: 1fr 1fr !important; }
                }
            `}</style>
        </>
    );
}

const containerStyle = { background: COLOR.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px', color: COLOR.text, fontFamily: FONT_BODY };
const backLinkStyle = { display: 'inline-block', fontSize: 12.5, color: COLOR.textFaint, textDecoration: 'none', marginBottom: 18 };
const cardStyle = { background: COLOR.bgCard, border: `1px solid ${COLOR.border}`, padding: '32px 24px', borderRadius: 16, width: '100%', maxWidth: 560, boxSizing: 'border-box' };
const badgeStyle = { background: '#132038', color: COLOR.accentSoft, fontSize: 11, fontWeight: 'bold', padding: '4px 10px', borderRadius: 20, display: 'inline-block', marginBottom: 12 };
const titleStyle = { margin: 0, fontSize: 23, fontWeight: 'bold', color: '#fff', fontFamily: FONT_HEAD };
const subtitleStyle = { margin: '8px 0 0 0', color: COLOR.textMuted, fontSize: 13, lineHeight: '1.4' };
const labelStyle = { display: 'block', fontSize: 12, fontWeight: 'bold', color: COLOR.textMuted, marginBottom: 6 };
const inputStyle = { display: 'block', width: '100%', padding: 10, background: COLOR.bgElevated, border: `1px solid ${COLOR.border}`, borderRadius: 8, color: '#fff', fontSize: 13, boxSizing: 'border-box' };
const hintStyle = { fontSize: 11, color: COLOR.textFaint, margin: '5px 2px 0' };
const buttonStyle = { width: '100%', padding: 12, background: COLOR.accent, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', fontSize: 14, transition: '0.2s', marginTop: 4 };
const messageStyle = { marginTop: 16, padding: 10, background: '#132038', border: `1px solid ${COLOR.border}`, borderRadius: 8, fontSize: 12, color: '#cbd5e1', textAlign: 'center', lineHeight: '1.4' };

const gridStyle = { display: 'grid', gridTemplateColumns: '1fr', gap: 12, marginBottom: 18 };
const pkgCardStyle = { border: `1px solid ${COLOR.border}`, borderRadius: 10, padding: 14, cursor: 'pointer', transition: '0.2s', position: 'relative' };
const popularBadgeStyle = { position: 'absolute', top: -8, right: 10, background: COLOR.accent, color: '#fff', fontSize: 9, fontWeight: 'bold', padding: '2px 6px', borderRadius: 4 };
const summaryStyle = { background: COLOR.bgElevated, border: `1px solid ${COLOR.border}`, borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 20, overflow: 'hidden' };
