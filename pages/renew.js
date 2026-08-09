// pages/renew.js

import { useState } from 'react';
import Head from 'next/head';
import Script from 'next/script';

const APP_ID = 'certgenpro';
const WHATSAPP_NUMBER = '6289627312600';
const WHATSAPP_DISPLAY = '0896-2731-2600';
const WHATSAPP_LINK = (msg) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

export default function Renew() {
    const [form, setForm] = useState({ license_key: '', email: '', whatsapp: '', package_type: 'yearly' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Paket perpanjangan — termasuk paket Harian untuk kebutuhan mendesak/jangka pendek
    const packages = [
        { id: 'daily', label: 'Harian', duration: '1 Hari', price: 'Rp 19.000', desc: 'Untuk kebutuhan mendesak atau uji coba jangka pendek.' },
        { id: 'monthly', label: 'Bulanan', duration: '30 Hari', price: 'Rp 49.000', desc: 'Pilihan fleksibel untuk kebutuhan musiman.' },
        { id: 'yearly', label: 'Tahunan', duration: '365 Hari', price: 'Rp 299.000', desc: 'Rekomendasi terbaik, paling hemat per bulan.', popular: true },
        { id: 'lifetime', label: 'Lifetime', duration: 'Selamanya', price: 'Rp 599.000', desc: 'Sekali bayar untuk akses selamanya tanpa batas.' },
    ];

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const res = await fetch('/api/renew', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ app_id: APP_ID, license_key: form.license_key, package_type: form.package_type }),
            });
            const data = await res.json();

            if (!res.ok) {
                setMessage(`Gagal: ${data.error}`);
                return;
            }

            if (window.snap) {
                window.snap.pay(data.snap_token, {
                    onSuccess: () => {
                        window.location.href = `/thankyou?license_key=${form.license_key}&type=renew`;
                    },
                    onPending: () => setMessage('Pembayaran tertunda. Selesaikan pembayaran untuk mengaktifkan perpanjangan.'),
                    onError: () => { window.location.href = '/failed'; },
                    onClose: () => setMessage('Popup pembayaran ditutup.'),
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
                <title>Perpanjang Lisensi CertGen Pro</title>
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
                        <span style={badgeStyle}>PERPANJANG LISENSI</span>
                        <h1 style={titleStyle}>🔷 Perpanjangan Lisensi CertGen Pro</h1>
                        <p style={subtitleStyle}>Masukkan kode lisensi Anda, lalu pilih durasi paket perpanjangan.</p>
                        <p style={{ marginTop: 10, fontSize: 12, color: '#64748b' }}>
                            Ada kendala perpanjangan lisensi?{' '}
                            <a href={WHATSAPP_LINK('Halo Admin, saya butuh bantuan untuk perpanjangan (renew) lisensi CertGen Pro.')} target="_blank" rel="noopener noreferrer" style={{ color: '#22c55e', fontWeight: 'bold', textDecoration: 'none' }}>
                                💬 Chat Admin ({WHATSAPP_DISPLAY})
                            </a>
                        </p>
                    </div>

                    {/* Grid Pilihan Paket */}
                    <div style={gridStyle}>
                        {packages.map((pkg) => {
                            const isSelected = form.package_type === pkg.id;
                            return (
                                <div
                                    key={pkg.id}
                                    onClick={() => setForm({ ...form, package_type: pkg.id })}
                                    style={{ ...pkgCardStyle, borderColor: isSelected ? '#2563eb' : '#1e293b', background: isSelected ? '#132038' : '#0d1424' }}
                                >
                                    {pkg.popular && <span style={popularBadgeStyle}>TERPOPULER</span>}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                        <h3 style={{ margin: 0, color: '#fff', fontSize: 15 }}>{pkg.label}</h3>
                                        <span style={{ fontSize: 11, color: '#3b82f6', fontWeight: 'bold' }}>{pkg.duration}</span>
                                    </div>
                                    <h4 style={{ margin: '6px 0', fontSize: 18, fontWeight: 'bold', color: isSelected ? '#3b82f6' : '#fff' }}>{pkg.price}</h4>
                                    <p style={{ margin: 0, fontSize: 11, color: '#94a3b8', lineHeight: '1.3' }}>{pkg.desc}</p>
                                </div>
                            );
                        })}
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <div>
                            <label style={labelStyle}>Kode Lisensi</label>
                            <input
                                type="text"
                                required
                                placeholder="CGP-XXXX-XXXX-XXXX"
                                value={form.license_key}
                                onChange={(e) => setForm({ ...form, license_key: e.target.value.toUpperCase() })}
                                style={{ ...inputStyle, fontFamily: 'monospace', letterSpacing: '0.03em' }}
                            />
                        </div>

                        <button type="submit" disabled={loading} style={buttonStyle}>
                            {loading ? 'Memproses Sesi...' : 'Selesaikan Pembayaran & Perpanjang 💳'}
                        </button>
                    </form>

                    {message && <p style={messageStyle}>{message}</p>}

                    <p style={{ textAlign: 'center', fontSize: 12, color: '#64748b', marginTop: 16 }}>
                        Butuh bantuan proses pembayaran?{' '}
                        <a href={WHATSAPP_LINK('Halo Admin, saya butuh bantuan proses pembayaran renew CertGen Pro.')} target="_blank" rel="noopener noreferrer" style={{ color: '#22c55e', fontWeight: 'bold', textDecoration: 'none' }}>
                            💬 Chat Admin via WhatsApp
                        </a>
                    </p>
                    <p style={{ textAlign: 'center', fontSize: 11.5, color: '#64748b', marginTop: 8 }}>
                        Belum punya lisensi? <a href="/" style={{ color: '#3b82f6' }}>Beli lisensi baru di sini</a>.
                    </p>
                </main>
            </div>
        </>
    );
}

const containerStyle = { background: '#0a0e1a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' };
const cardStyle = { background: '#111a2e', border: '1px solid #1e293b', padding: '32px 24px', borderRadius: 16, width: '100%', maxWidth: 540, boxSizing: 'border-box' };
const badgeStyle = { background: '#12213f', color: '#3b82f6', fontSize: 11, fontWeight: 'bold', padding: '4px 10px', borderRadius: 20, display: 'inline-block', marginBottom: 12 };
const titleStyle = { margin: 0, fontSize: 22, fontWeight: 'bold', color: '#fff' };
const subtitleStyle = { margin: '8px 0 0 0', color: '#94a3b8', fontSize: 13, lineHeight: '1.4' };
const labelStyle = { display: 'block', fontSize: 12, fontWeight: 'bold', color: '#94a3b8', marginBottom: 6 };
const inputStyle = { display: 'block', width: '100%', padding: 10, background: '#0d1424', border: '1px solid #1e293b', borderRadius: 8, color: '#fff', fontSize: 13, boxSizing: 'border-box' };
const buttonStyle = { width: '100%', padding: 12, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', fontSize: 14, transition: '0.2s', marginTop: 10 };
const messageStyle = { marginTop: 16, padding: 10, background: '#12213f', border: '1px solid #1e293b', borderRadius: 8, fontSize: 12, color: '#cbd5e1', textAlign: 'center', lineHeight: '1.4' };

const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 };
const pkgCardStyle = { border: '1px solid #1e293b', borderRadius: 10, padding: 14, cursor: 'pointer', transition: '0.2s', position: 'relative' };
const popularBadgeStyle = { position: 'absolute', top: -8, right: 10, background: '#2563eb', color: '#fff', fontSize: 9, fontWeight: 'bold', padding: '2px 6px', borderRadius: 4 };
