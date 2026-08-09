// pages/thankyou.js

import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function ThankYou() {
    const router = useRouter();
    const { license_key, type } = router.query;
    const [copied, setCopied] = useState(false);

    // Fungsi klik salin otomatis ke Clipboard
    const handleCopy = () => {
        if (!license_key) return;
        navigator.clipboard.writeText(license_key);
        setCopied(true);
        
        // Reset ikon kembali normal setelah 2 detik
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    return (
        <>
            <Head>
                <title>Terima Kasih Atas Pembelian Anda</title>
            </Head>
            <div style={containerStyle}>
                <main style={cardStyle}>
                    <div style={{ textAlign: 'center', marginBottom: 20 }}>
                        <div style={successIconStyle}>✓</div>
                        <h1 style={titleStyle}>
                            {type === 'renew' ? 'Perpanjangan Berhasil!' : 'Terima Kasih!'}
                        </h1>
                        <p style={subtitleStyle}>
                            Transaksi Anda telah selesai diproses dengan sukses.
                        </p>
                    </div>

                    <div style={boxStyle}>
                        <p style={labelStyle}>KODE LISENSI ANDA:</p>
                        
                        {/* Container Kode yang dapat Diklik untuk Salin */}
                        <div 
                            onClick={handleCopy} 
                            style={{
                                ...keyWrapperStyle,
                                borderColor: copied ? '#22c55e' : '#3b82f6',
                                background: copied ? '#0a0e1a' : '#12213f'
                            }} 
                            title="Klik untuk menyalin"
                        >
                            <span style={keyTextStyle}>
                                {license_key || "Memeriksa..."}
                            </span>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                {copied && <span style={copiedTextStyle}>Tersalin!</span>}
                                <div style={iconContainerStyle}>
                                    {copied ? (
                                        // Ikon Centang Hijau saat berhasil disalin
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    ) : (
                                        // Ikon Dokumen Ganda (Copy) Standar
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                        </svg>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <p style={{ color: '#94a3b8', fontSize: 11, marginTop: 10, margin: 0 }}>
                            *Klik kotak di atas untuk menyalin kode. Kode lisensi ini juga sudah dikirim ke WhatsApp dan Email Anda.
                        </p>
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <h3 style={{ margin: '0 0 10px 0', fontSize: 14, color: '#fff' }}>Panduan Langkah Selanjutnya:</h3>
                        <ol style={listStyle}>
                            <li>Unduh berkas instalasi aplikasi CertGen Pro melalui tautan di bawah ini.</li>
                            <li>Ekstrak file ZIP, lalu buka <strong>CertGenPro.exe</strong>.</li>
                            <li>Masukkan kode lisensi di atas pada dialog aktivasi yang muncul.</li>
                            <li>Selesai! Aplikasi Anda siap digunakan secara penuh di perangkat ini.</li>
                        </ol>
                        <p style={{ color: '#64748b', fontSize: 11.5, marginTop: 10 }}>
                            Kode lisensi ini juga sudah dikirim ke WhatsApp dan Email yang Anda daftarkan saat pembelian.
                        </p>
                    </div>

                    {/* Tautan unduhan produk */}
                    <a href="/download" target="_blank" rel="noreferrer" style={downloadButtonStyle}>
                        Unduh CertGen Pro 📥
                    </a>

                    <div style={{ marginTop: 24, textAlign: 'center', borderTop: '1px solid #1f2937', paddingTop: 16 }}>
                        <a href="/" style={linkStyle}>Kembali ke Beranda</a>
                    </div>
                </main>
            </div>
        </>
    );
}

// CSS Inline Tema Gelap
const containerStyle = { background: '#0a0e1a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' };
const cardStyle = { background: '#111a2e', border: '1px solid #1e293b', padding: '32px 24px', borderRadius: 16, width: '100%', maxWidth: 480, boxSizing: 'border-box' };
const successIconStyle = { width: 50, height: 50, background: '#10b981', color: '#fff', borderRadius: '50%', fontSize: 24, fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' };
const titleStyle = { margin: 0, fontSize: 22, fontWeight: 'bold', color: '#fff' };
const subtitleStyle = { margin: '8px 0 0 0', color: '#10b981', fontSize: 13, fontWeight: '600' };
const boxStyle = { background: '#0d1424', border: '1px solid #1e293b', borderRadius: 12, padding: 16, textAlign: 'center', marginTop: 20 };
const labelStyle = { margin: '0 0 8px 0', fontSize: 11, fontWeight: 'bold', color: '#94a3b8', letterSpacing: '0.05em' };
const listStyle = { color: '#cbd5e1', fontSize: 13, paddingLeft: 20, margin: 0, lineHeight: '1.6' };
const downloadButtonStyle = { display: 'block', width: '100%', padding: 12, background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', fontSize: 13, textAlign: 'center', textDecoration: 'none', marginTop: 20, boxSizing: 'border-box' };
const linkStyle = { color: '#94a3b8', textDecoration: 'none', fontSize: 12 };

// Styling Kotak Kode Lisensi Interaktif
const keyWrapperStyle = {
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    userSelect: 'all',
    transition: 'all 0.2s ease-in-out'
};

const keyTextStyle = {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    letterSpacing: '0.02em'
};

const copiedTextStyle = {
    fontSize: 11,
    color: '#10b981',
    fontWeight: 'bold',
    letterSpacing: '0.02em'
};

const iconContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    background: '#0d1424',
    borderRadius: 6,
    border: '1px solid #334155'
};