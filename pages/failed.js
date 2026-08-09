// pages/failed.js

import Head from 'next/head';
import { useRouter } from 'next/router';

export default function PaymentFailed() {
    const router = useRouter();

    return (
        <>
            <Head>
                <title>Pembayaran Gagal / Dibatalkan</title>
            </Head>
            <div style={containerStyle}>
                <main style={cardStyle}>
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                        <div style={failedIconStyle}>✗</div>
                        <h1 style={titleStyle}>Pembayaran Gagal</h1>
                        <p style={subtitleStyle}>
                            Transaksi Anda tidak berhasil diselesaikan.
                        </p>
                    </div>

                    <div style={boxStyle}>
                        <p style={{ margin: '0 0 12px 0', fontSize: 13, color: '#f8fafc', fontWeight: 'bold' }}>
                            Apa yang Terjadi?
                        </p>
                        <p style={{ margin: 0, fontSize: 13, color: '#94a3b8', lineHeight: '1.5' }}>
                            Pembayaran Anda dibatalkan oleh sistem, ditolak oleh bank penyedia, atau batas waktu transaksi telah habis.
                        </p>
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <h3 style={{ margin: '0 0 10px 0', fontSize: 14, color: '#fff' }}>Langkah Solusi:</h3>
                        <ol style={listStyle}>
                            <li>Periksa kembali saldo rekening atau limit metode pembayaran Anda.</li>
                            <li>Pastikan koneksi internet Anda stabil sebelum mengulang transaksi.</li>
                            <li>Jika saldo Anda telanjur terpotong namun lisensi belum diterima, silakan balas pesan WhatsApp bantuan kami dengan menyertakan bukti transfer.</li>
                        </ol>
                    </div>

                    {/* Tombol Coba Kembali */}
                    <button onClick={() => router.push('/renew')} style={retryButtonStyle}>
                        Coba Pembelian Kembali 🔄
                    </button>

                    <div style={{ marginTop: 24, textAlign: 'center', borderTop: '1px solid #1f2937', paddingTop: 16 }}>
                        <a href="/" style={linkStyle}>Kembali ke Beranda</a>
                    </div>
                </main>
            </div>
        </>
    );
}

// CSS Inline Tema Gelap
const containerStyle = { background: '#0e1013', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' };
const cardStyle = { background: '#16191f', border: '1px solid #1f2937', padding: '32px 24px', borderRadius: 16, width: '100%', maxWidth: 480, boxSizing: 'border-box' };
const failedIconStyle = { width: 50, height: 50, background: '#ef4444', color: '#fff', borderRadius: '50%', fontSize: 24, fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' };
const titleStyle = { margin: 0, fontSize: 22, fontWeight: 'bold', color: '#fff' };
const subtitleStyle = { margin: '8px 0 0 0', color: '#ef4444', fontSize: 13, fontWeight: '600' };
const boxStyle = { background: '#111317', border: '1px solid #1f2937', borderRadius: 12, padding: 16, textAlign: 'center', marginTop: 20 };
const listStyle = { color: '#cbd5e1', fontSize: 13, paddingLeft: 20, margin: 0, lineHeight: '1.6' };
const retryButtonStyle = { display: 'block', width: '100%', padding: 12, background: '#1e293b', border: '1px solid #3b82f6', color: '#fff', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', fontSize: 13, textAlign: 'center', marginTop: 20, boxSizing: 'border-box', transition: '0.2s' };
const linkStyle = { color: '#94a3b8', textDecoration: 'none', fontSize: 12 };