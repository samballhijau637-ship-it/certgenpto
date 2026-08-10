// pages/renew.js

import { useState } from 'react';
import Head from 'next/head';
import Script from 'next/script';

const APP_ID = 'certgenpro';
const APP_NAME = 'CertGen Pro';
const WHATSAPP_NUMBER = '6289627312600';
const WHATSAPP_DISPLAY = '0896-2731-2600';
const WHATSAPP_LINK = (msg) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

function normalizeWhatsApp(raw) {
    let digits = (raw || '').replace(/[^0-9]/g, '');
    if (!digits) return '';
    if (digits.startsWith('0')) digits = '62' + digits.slice(1);
    else if (!digits.startsWith('62')) digits = '62' + digits;
    return digits;
}

export default function Renew() {
    const [form, setForm] = useState({ email: '', whatsapp: '', package_type: 'yearly', coupon_code: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Paket perpanjangan — Harian khusus tersedia di halaman ini untuk
    // kebutuhan coba-cepat / kebutuhan mendadak (misal 1 acara saja).
    const packages = [
        { id: 'daily', label: 'Harian', duration: '1 Hari', price: 'Rp 19.000', desc: 'Coba dulu untuk kebutuhan 1 hari, tanpa risiko.' },
        { id: 'monthly', label: 'Bulanan', duration: '30 Hari', price: 'Rp 49.000', desc: 'Fleksibel untuk kebutuhan acara musiman.' },
        { id: 'yearly', label: 'Tahunan', duration: '365 Hari', price: 'Rp 299.000', desc: 'Rekomendasi terbaik bagi penggunaan rutin.', popular: true },
        { id: 'lifetime', label: 'Lifetime', duration: 'Selamanya', price: 'Rp 599.000', desc: 'Sekali bayar untuk akses selamanya tanpa batas.' },
    ];

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const payload = { app_id: APP_ID, ...form, whatsapp: normalizeWhatsApp(form.whatsapp) };
            const res = await fetch('/api/payment/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();

            if (!res.ok) {
                setMessage(`Gagal: ${data.error}`);
                return;
            }

            if (data.free_trial) {
                setMessage(`Trial berhasil! Kode lisensi Anda: ${data.license_key} (sudah dikirim ke email/WA)`);
                return;
            }

            if (window.snap) {
                window.snap.pay(data.snap_token, {
                    onSuccess: () => {
                        window.location.href = `/thankyou?license_key=${data.license_key}&type=renew`;
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

    return (
        <>
            <Head>
                <title>Perpanjangan Lisensi {APP_NAME}</title>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet" />
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
                    <div style={{ textAlign: 'center', marginBottom: 28 }}>
                        <span style={badgeStyle}>PERPANJANGAN LISENSI</span>
                        <h1 style={titleStyle}>Perpanjang Lisensi {APP_NAME}</h1>
                        <p style={subtitleStyle}>Pilih durasi paket yang sesuai kebutuhan produksi sertifikat Anda berikutnya.</p>
                        <p style={{ marginTop: 10, fontSize: 12, color: '#64748b' }}>
                            Ada kendala perpanjangan lisensi?{' '}
                            <a href={WHATSAPP_LINK(`Halo Admin, saya butuh bantuan untuk perpanjangan (renew) lisensi ${APP_NAME}.`)} target="_blank" rel="noopener noreferrer" style={{ color: '#1d4ed8', fontWeight: 'bold', textDecoration: 'none' }}>
                                💬 Chat Admin ({WHATSAPP_DISPLAY})
                            </a>
                        </p>
                    </div>

                    <div style={gridStyle}>
                        {packages.map((pkg) => {
                            const isSelected = form.package_type === pkg.id;
                            return (
                                <div
                                    key={pkg.id}
                                    onClick={() => setForm({ ...form, package_type: pkg.id })}
                                    style={{
                                        ...pkgCardStyle,
                                        borderColor: isSelected ? '#1d4ed8' : '#e2e8f0',
                                        background: isSelected ? '#eff6ff' : '#fff',
                                    }}
                                >
                                    {pkg.popular && <span style={popularBadgeStyle}>TERPOPULER</span>}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                        <h3 style={{ margin: 0, color: '#0f172a', fontSize: 15 }}>{pkg.label}</h3>
                                        <span style={{ fontSize: 11, color: '#1d4ed8', fontWeight: 'bold' }}>{pkg.duration}</span>
                                    </div>
                                    <h4 style={{ margin: '6px 0', fontSize: 18, fontWeight: 'bold', color: isSelected ? '#1d4ed8' : '#0f172a' }}>
                                        {pkg.price}
                                    </h4>
                                    <p style={{ margin: 0, fontSize: 11, color: '#64748b', lineHeight: '1.3' }}>{pkg.desc}</p>
                                </div>
                            );
                        })}
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div>
                            <label style={labelStyle}>Alamat Email</label>
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
                                type="text"
                                required
                                placeholder="08123456789"
                                value={form.whatsapp}
                                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                                style={inputStyle}
                            />
                            <p style={{ fontSize: 11, color: '#94a3b8', margin: '4px 0 0' }}>Cukup pakai awalan 0, tanpa +62.</p>
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
                            {loading ? 'Memproses...' : 'Selesaikan Pembayaran & Aktivasi 💳'}
                        </button>
                    </form>

                    {message && <p style={messageStyle}>{message}</p>}

                    <p style={{ textAlign: 'center', fontSize: 12, color: '#64748b', marginTop: 16 }}>
                        Butuh bantuan proses pembayaran?{' '}
                        <a href={WHATSAPP_LINK(`Halo Admin, saya butuh bantuan proses pembayaran renew ${APP_NAME}.`)} target="_blank" rel="noopener noreferrer" style={{ color: '#1d4ed8', fontWeight: 'bold', textDecoration: 'none' }}>
                            💬 Chat Admin via WhatsApp
                        </a>
                    </p>

                    <div style={{ textAlign: 'center', marginTop: 20 }}>
                        <a href="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 12 }}>← Kembali ke Beranda</a>
                    </div>
                </main>
            </div>
        </>
    );
}

const containerStyle = { background: '#f5f8ff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, color: '#0f172a', fontFamily: "'DM Sans', system-ui, sans-serif" };
const cardStyle = { background: '#fff', border: '1px solid #e2e8f0', padding: '32px 24px', borderRadius: 20, width: '100%', maxWidth: 560, boxSizing: 'border-box', boxShadow: '0 20px 50px rgba(15,23,42,0.06)' };
const badgeStyle = { background: '#dbeafe', color: '#1e3a8a', fontSize: 11, fontWeight: 'bold', padding: '4px 10px', borderRadius: 20, display: 'inline-block', marginBottom: 12 };
const titleStyle = { margin: 0, fontSize: 24, fontWeight: 800, color: '#0f172a', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" };
const subtitleStyle = { margin: '8px 0 0 0', color: '#475569', fontSize: 13, lineHeight: '1.4' };
const labelStyle = { display: 'block', fontSize: 12, fontWeight: 'bold', color: '#475569', marginBottom: 6 };
const inputStyle = { display: 'block', width: '100%', padding: 10, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, color: '#0f172a', fontSize: 13, boxSizing: 'border-box' };
const buttonStyle = { width: '100%', padding: 13, background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', fontSize: 14, transition: '0.2s', marginTop: 10, boxShadow: '0 8px 20px rgba(29,78,216,0.25)' };
const messageStyle = { marginTop: 16, padding: 10, background: '#f5f8ff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 12, color: '#334155', textAlign: 'center', lineHeight: '1.4' };

const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 };
const pkgCardStyle = { border: '2px solid #e2e8f0', borderRadius: 12, padding: 14, cursor: 'pointer', transition: '0.2s', position: 'relative' };
const popularBadgeStyle = { position: 'absolute', top: -8, right: 10, background: '#1d4ed8', color: '#fff', fontSize: 9, fontWeight: 'bold', padding: '2px 6px', borderRadius: 4 };
