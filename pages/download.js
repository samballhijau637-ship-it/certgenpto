// pages/download.js

import { useEffect, useState } from 'react';
import Head from 'next/head';

const APP_NAME = 'CertGen Pro';
const WHATSAPP_NUMBER = '6289627312600';
const WHATSAPP_DISPLAY = '0896-2731-2600';
const WHATSAPP_LINK = (msg) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

export default function Download() {
    const [downloads, setDownloads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/downloads')
            .then((res) => res.json())
            .then((data) => setDownloads(data.downloads || []))
            .finally(() => setLoading(false));
    }, []);

    const latest = downloads.find((d) => d.app_name === APP_NAME) || downloads[0];

    return (
        <>
            <Head>
                <title>Download {APP_NAME}</title>
            </Head>
            <div style={containerStyle}>
                <main style={cardStyle}>
                    <div style={{ fontSize: 44, marginBottom: 8 }}>🖥️</div>
                    <h1 style={titleStyle}>Download {APP_NAME}</h1>
                    <p style={subtitleStyle}>
                        Aplikasi desktop untuk Windows 10 &amp; 11. Sudah punya kode lisensi? Install lalu masukkan kode lisensi Anda saat pertama kali membuka aplikasi.
                    </p>

                    {loading && <p style={{ fontSize: 13, color: '#64748b', textAlign: 'center' }}>Memuat tautan unduhan...</p>}

                    {!loading && latest && (
                        <>
                            <div style={versionBoxStyle}>
                                <div style={{ fontSize: 11, color: '#1e3a8a', fontWeight: 'bold' }}>VERSI TERBARU</div>
                                <div style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>{latest.version}</div>
                            </div>
                            <a href={latest.download_url} style={downloadButtonStyle}>⬇️ Download {APP_NAME}</a>
                        </>
                    )}

                    {!loading && !latest && (
                        <p style={{ fontSize: 13, color: '#64748b', textAlign: 'center' }}>
                            Tautan unduhan belum tersedia. Silakan hubungi admin untuk mendapatkan file instalasi.
                        </p>
                    )}

                    <div style={notesBoxStyle}>
                        <div style={{ fontWeight: 'bold', fontSize: 13, marginBottom: 8, color: '#0f172a' }}>Catatan Penting:</div>
                        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: '#334155', lineHeight: 1.8 }}>
                            <li>Diuji stabil di Windows 10 &amp; Windows 11</li>
                            <li>Aplikasi berjalan offline, kecuali saat mengirim email massal (butuh internet)</li>
                            <li>1 kode lisensi hanya untuk 1 perangkat</li>
                        </ul>
                    </div>

                    <p style={{ textAlign: 'center', fontSize: 12, color: '#64748b', marginTop: 20 }}>
                        Kendala instalasi atau aktivasi?{' '}
                        <a href={WHATSAPP_LINK(`Halo Admin, saya butuh bantuan instalasi ${APP_NAME}.`)} target="_blank" rel="noopener noreferrer" style={{ color: '#1d4ed8', fontWeight: 'bold', textDecoration: 'none' }}>
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
const cardStyle = { background: '#fff', border: '1px solid #e2e8f0', padding: '36px 26px', borderRadius: 20, width: '100%', maxWidth: 460, boxSizing: 'border-box', textAlign: 'center', boxShadow: '0 20px 50px rgba(15,23,42,0.06)' };
const titleStyle = { margin: '0 0 8px', fontSize: 22, fontWeight: 800, color: '#0f172a', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" };
const subtitleStyle = { margin: '0 0 22px', color: '#475569', fontSize: 13, lineHeight: 1.6 };
const versionBoxStyle = { background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: '12px 14px', marginBottom: 16 };
const downloadButtonStyle = { display: 'block', width: '100%', boxSizing: 'border-box', padding: 14, background: '#1d4ed8', color: '#fff', borderRadius: 10, textAlign: 'center', textDecoration: 'none', fontWeight: 'bold', fontSize: 14, boxShadow: '0 8px 20px rgba(29,78,216,0.25)', marginBottom: 20 };
const notesBoxStyle = { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 16px', textAlign: 'left' };
