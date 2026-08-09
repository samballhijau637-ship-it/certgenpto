// pages/download.js

import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function DownloadPortal() {
    const [downloads, setDownloads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDownloads() {
            try {
                const res = await fetch('/api/downloads');
                if (res.ok) {
                    const data = await res.json();
                    setDownloads(data.downloads);
                }
            } catch (err) {
                console.error("Gagal mengambil data rilis:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchDownloads();
    }, []);

    return (
        <>
            <Head>
                <title>Download CertGen Pro</title>
            </Head>
            <div style={containerStyle}>
                <main style={cardStyle}>
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                        <span style={badgeStyle}>PORTAL UNDUHAN PRODUK</span>
                        <h1 style={titleStyle}>📥 Berkas CertGen Pro</h1>
                        <p style={subtitleStyle}>Temukan berkas instalasi resmi dari versi rilis terbaru di bawah ini.</p>
                    </div>

                    {loading ? (
                        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>Memuat daftar berkas rilis...</p>
                    ) : downloads.length === 0 ? (
                        <div style={emptyBoxStyle}>
                            <p style={{ margin: 0, fontSize: 13, color: '#94a3b8' }}>Saat ini belum ada versi rilis yang tersedia untuk diunduh.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {downloads.map((item, index) => (
                                <div key={item.id} style={releaseCardStyle(index === 0)}>
                                    {index === 0 && <span style={latestLabelStyle}>RILIS TERBARU</span>}
                                    <h3 style={{ margin: 0, color: '#fff', fontSize: 16 }}>{item.app_name}</h3>
                                    <p style={{ margin: '4px 0 12px 0', fontSize: 13, color: '#94a3b8' }}>
                                        Versi Aplikasi: <strong style={{ color: '#3b82f6' }}>{item.version}</strong>
                                    </p>
                                    <a href={item.download_url} target="_blank" rel="noreferrer" style={downloadButtonStyle(index === 0)}>
                                        Unduh Berkas Instalasi (.ZIP) 📥
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}

// CSS Inline
const containerStyle = { background: '#0a0e1a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' };
const cardStyle = { background: '#111a2e', border: '1px solid #1e293b', padding: '32px 24px', borderRadius: 16, width: '100%', maxWidth: 480, boxSizing: 'border-box' };
const badgeStyle = { background: '#1e293b', color: '#3b82f6', fontSize: 11, fontWeight: 'bold', padding: '4px 10px', borderRadius: 20, display: 'inline-block', marginBottom: 12 };
const titleStyle = { margin: 0, fontSize: 24, fontWeight: 'bold', color: '#fff' };
const subtitleStyle = { margin: '8px 0 0 0', color: '#94a3b8', fontSize: 13, lineHeight: '1.4' };
const emptyBoxStyle = { background: '#0d1424', border: '1px dashed #1f2937', borderRadius: 10, padding: 24, textAlign: 'center' };

const releaseCardStyle = (isLatest) => ({
    background: '#0d1424',
    border: isLatest ? '1px solid #10b981' : '1px solid #1f2937',
    borderRadius: 12,
    padding: 16,
    position: 'relative',
    marginTop: isLatest ? 8 : 0
});

const latestLabelStyle = { position: 'absolute', top: -10, right: 12, background: '#10b981', color: '#fff', fontSize: 9, fontWeight: 'bold', padding: '3px 8px', borderRadius: 4 };

const downloadButtonStyle = (isLatest) => ({
    display: 'block',
    width: '100%',
    padding: 10,
    background: isLatest ? '#10b981' : '#1e293b',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: 13,
    textAlign: 'center',
    textDecoration: 'none',
    boxSizing: 'border-box',
    transition: '0.2s'
});