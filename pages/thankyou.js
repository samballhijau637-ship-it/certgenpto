// pages/thankyou.js
//
// PENTING: Halaman ini TIDAK didaftarkan di Dashboard Midtrans.
// Redirect ke sini terjadi lewat dua jalur:
//  1) callbacks.finish yang dikirim langsung di body request Snap API
//     (lihat pages/api/payment/create.js & pages/api/renew.js) — ini
//     sesuai instruksi Anda: hardcode di create.js, bukan di Midtrans.
//  2) onSuccess() dari popup Snap.js di sisi client (index.js/renew.js)
//     sebagai fallback kalau pembeli tidak menutup popup secara manual.

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const APP_NAME = 'CertGen Pro';
const WHATSAPP_NUMBER = '6289627312600';
const WHATSAPP_DISPLAY = '0896-2731-2600';
const WHATSAPP_LINK = (msg) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
const DOWNLOAD_LINK = '/download';

export default function ThankYou() {
    const router = useRouter();
    const { license_key, type } = router.query;
    const [copied, setCopied] = useState(false);

    const isRenewal = type === 'renew';

    function copyKey() {
        if (!license_key) return;
        navigator.clipboard.writeText(license_key);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <>
            <Head>
                <title>Pembayaran Berhasil — {APP_NAME}</title>
            </Head>
            <div style={containerStyle}>
                <main style={cardStyle}>
                    <div style={iconWrapStyle}>✅</div>
                    <h1 style={titleStyle}>{isRenewal ? 'Perpanjangan Berhasil!' : 'Pembayaran Berhasil!'}</h1>
                    <p style={subtitleStyle}>
                        {isRenewal
                            ? `Lisensi ${APP_NAME} Anda telah berhasil diperpanjang.`
                            : `Terima kasih telah membeli ${APP_NAME}.`}{' '}
                        Detail lisensi juga sudah otomatis dikirim ke WhatsApp &amp; Email yang Anda daftarkan.
                    </p>

                    {license_key && (
                        <div style={keyBoxStyle}>
                            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6, fontWeight: 'bold' }}>KODE LISENSI ANDA</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                                <code style={keyTextStyle}>{license_key}</code>
                                <button onClick={copyKey} style={copyButtonStyle}>{copied ? 'Tersalin ✓' : 'Salin'}</button>
                            </div>
                        </div>
                    )}

                    <div style={stepsBoxStyle}>
                        <div style={{ fontWeight: 'bold', fontSize: 13, marginBottom: 10, color: '#0f172a' }}>Langkah Aktivasi:</div>
                        <ol style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: '#334155', lineHeight: 1.8 }}>
                            <li>Download aplikasi {APP_NAME} (Windows 10/11)</li>
                            <li>Install &amp; buka aplikasinya</li>
                            <li>Masukkan kode lisensi di atas pada dialog aktivasi</li>
                            <li>Aplikasi otomatis terkunci ke perangkat ini (1 lisensi = 1 perangkat)</li>
                        </ol>
                    </div>

                    <a href={DOWNLOAD_LINK} style={downloadButtonStyle}>⬇️ Download {APP_NAME} Sekarang</a>

                    <p style={{ textAlign: 'center', fontSize: 12, color: '#64748b', marginTop: 20 }}>
                        Tidak menerima pesan WhatsApp/Email dalam 5 menit?{' '}
                        <a href={WHATSAPP_LINK(`Halo Admin, saya sudah bayar tapi belum menerima lisensi ${APP_NAME}. Kode lisensi: ${license_key || '-'}`)} target="_blank" rel="noopener noreferrer" style={{ color: '#1d4ed8', fontWeight: 'bold', textDecoration: 'none' }}>
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
const cardStyle = { background: '#fff', border: '1px solid #e2e8f0', padding: '36px 26px', borderRadius: 20, width: '100%', maxWidth: 480, boxSizing: 'border-box', textAlign: 'center', boxShadow: '0 20px 50px rgba(15,23,42,0.06)' };
const iconWrapStyle = { fontSize: 48, marginBottom: 8 };
const titleStyle = { margin: '0 0 8px', fontSize: 24, fontWeight: 800, color: '#0f172a', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" };
const subtitleStyle = { margin: '0 0 20px', color: '#475569', fontSize: 13, lineHeight: 1.6 };
const keyBoxStyle = { background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: '16px 14px', marginBottom: 20 };
const keyTextStyle = { fontSize: 16, fontWeight: 'bold', color: '#1d4ed8', letterSpacing: 1, fontFamily: 'monospace' };
const copyButtonStyle = { background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 11, fontWeight: 'bold', cursor: 'pointer' };
const stepsBoxStyle = { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '16px 18px', textAlign: 'left', marginBottom: 22 };
const downloadButtonStyle = { display: 'block', width: '100%', boxSizing: 'border-box', padding: 14, background: '#1d4ed8', color: '#fff', borderRadius: 10, textAlign: 'center', textDecoration: 'none', fontWeight: 'bold', fontSize: 14, boxShadow: '0 8px 20px rgba(29,78,216,0.25)' };
