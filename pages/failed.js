// pages/failed.js

import Head from 'next/head';

const APP_NAME = 'CertGen Pro';
const WHATSAPP_NUMBER = '6289627312600';
const WHATSAPP_DISPLAY = '0896-2731-2600';
const WHATSAPP_LINK = (msg) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

export default function Failed() {
    return (
        <>
            <Head>
                <title>Pembayaran Gagal — {APP_NAME}</title>
            </Head>
            <div style={containerStyle}>
                <main style={cardStyle}>
                    <div style={{ fontSize: 48, marginBottom: 8 }}>❌</div>
                    <h1 style={titleStyle}>Pembayaran Gagal atau Dibatalkan</h1>
                    <p style={subtitleStyle}>
                        Transaksi Anda tidak berhasil diselesaikan. Jangan khawatir, belum ada dana yang terpotong untuk transaksi yang gagal. Silakan coba lagi.
                    </p>
                    <a href="/#harga" style={buttonStyle}>🔄 Coba Lagi</a>
                    <p style={{ textAlign: 'center', fontSize: 12, color: '#64748b', marginTop: 20 }}>
                        Mengalami kendala berulang?{' '}
                        <a href={WHATSAPP_LINK(`Halo Admin, saya mengalami kendala pembayaran untuk ${APP_NAME}.`)} target="_blank" rel="noopener noreferrer" style={{ color: '#1d4ed8', fontWeight: 'bold', textDecoration: 'none' }}>
                            💬 Chat Admin ({WHATSAPP_DISPLAY})
                        </a>
                    </p>
                    <div style={{ textAlign: 'center', marginTop: 16 }}>
                        <a href="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 12 }}>← Kembali ke Beranda</a>
                    </div>
                </main>
            </div>
        </>
    );
}

const containerStyle = { background: '#f5f8ff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, color: '#0f172a', fontFamily: "'DM Sans', system-ui, sans-serif" };
const cardStyle = { background: '#fff', border: '1px solid #e2e8f0', padding: '36px 26px', borderRadius: 20, width: '100%', maxWidth: 440, boxSizing: 'border-box', textAlign: 'center', boxShadow: '0 20px 50px rgba(15,23,42,0.06)' };
const titleStyle = { margin: '0 0 8px', fontSize: 22, fontWeight: 800, color: '#0f172a', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" };
const subtitleStyle = { margin: '0 0 24px', color: '#475569', fontSize: 13, lineHeight: 1.6 };
const buttonStyle = { display: 'block', width: '100%', boxSizing: 'border-box', padding: 14, background: '#1d4ed8', color: '#fff', borderRadius: 10, textAlign: 'center', textDecoration: 'none', fontWeight: 'bold', fontSize: 14 };
