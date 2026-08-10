// pages/terms.js

import Head from 'next/head';

const APP_NAME = 'CertGen Pro';

export default function Terms() {
    return (
        <>
            <Head>
                <title>Syarat &amp; Ketentuan — {APP_NAME}</title>
            </Head>
            <div style={containerStyle}>
                <main style={cardStyle}>
                    <h1 style={titleStyle}>Syarat &amp; Ketentuan Layanan</h1>
                    <p style={updatedStyle}>Berlaku untuk penggunaan aplikasi {APP_NAME}.</p>

                    <Section title="1. Tentang Aplikasi">
                        {APP_NAME} adalah aplikasi desktop untuk sistem operasi Windows, yang telah diuji dan
                        dinyatakan stabil pada Windows 10 dan Windows 11. Aplikasi ini berjalan secara offline
                        untuk seluruh proses pembuatan template dan generate sertifikat, kecuali untuk fitur
                        pengiriman email massal ke peserta yang membutuhkan koneksi internet aktif.
                    </Section>

                    <Section title="2. Lisensi Penggunaan">
                        Satu kode lisensi hanya berlaku untuk satu perangkat (1 lisensi = 1 komputer). Lisensi
                        akan dikirimkan secara otomatis ke nomor WhatsApp dan alamat email yang Anda daftarkan
                        pada form pembelian setelah pembayaran dikonfirmasi berhasil. Pastikan data yang Anda
                        masukkan sudah benar sebelum menyelesaikan pembayaran.
                    </Section>

                    <Section title="3. Paket Lisensi & Harga">
                        Kami menyediakan paket Bulanan, Tahunan, dan Lifetime pada halaman pembelian utama, serta
                        paket Harian khusus tersedia pada halaman perpanjangan (renew) untuk kebutuhan jangka
                        pendek. Harga yang berlaku adalah harga yang tertera pada halaman resmi kami saat
                        transaksi dilakukan.
                    </Section>

                    <Section title="4. Perpanjangan Lisensi">
                        Lisensi dapat diperpanjang kapan saja melalui halaman Perpanjangan Lisensi menggunakan
                        kode lisensi yang sudah dimiliki. Masa aktif baru akan ditambahkan dari sisa masa aktif
                        yang berjalan (jika masih aktif), atau dihitung dari tanggal pembayaran perpanjangan
                        (jika lisensi sudah kedaluwarsa).
                    </Section>

                    <Section title="5. Kebijakan Pembayaran">
                        Pembayaran diproses melalui payment gateway resmi (Midtrans). Kode lisensi diterbitkan
                        otomatis setelah pembayaran dikonfirmasi berhasil oleh sistem. Apabila pembayaran sudah
                        berhasil namun lisensi belum diterima dalam waktu wajar, silakan hubungi admin melalui
                        WhatsApp yang tercantum di halaman pembelian.
                    </Section>

                    <Section title="6. Batasan Tanggung Jawab">
                        Kami berupaya menjaga ketersediaan dan keandalan sistem, namun tidak bertanggung jawab
                        atas kerugian tidak langsung yang timbul dari gangguan koneksi internet pengguna,
                        kesalahan input data peserta oleh pengguna, atau penyalahgunaan lisensi di luar
                        kewajaran (1 lisensi = 1 perangkat).
                    </Section>

                    <Section title="7. Kontak">
                        Untuk pertanyaan seputar lisensi, aktivasi, atau kendala teknis, silakan hubungi admin
                        kami melalui WhatsApp yang tercantum pada halaman pembelian, perpanjangan, atau download.
                    </Section>

                    <div style={{ textAlign: 'center', marginTop: 24 }}>
                        <a href="/" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: 12 }}>← Kembali ke Beranda</a>
                    </div>
                </main>
            </div>
        </>
    );
}

function Section({ title, children }) {
    return (
        <section style={{ marginBottom: 22 }}>
            <h2 style={sectionTitleStyle}>{title}</h2>
            <p style={sectionTextStyle}>{children}</p>
        </section>
    );
}

const containerStyle = { background: '#f5f8ff', minHeight: '100vh', padding: '48px 16px', color: '#0f172a', fontFamily: "'DM Sans', system-ui, sans-serif" };
const cardStyle = { background: '#fff', border: '1px solid #e2e8f0', padding: '36px 30px', borderRadius: 20, width: '100%', maxWidth: 720, margin: '0 auto', boxSizing: 'border-box', boxShadow: '0 20px 50px rgba(15,23,42,0.06)' };
const titleStyle = { margin: '0 0 6px', fontSize: 26, fontWeight: 800, color: '#0f172a', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" };
const updatedStyle = { margin: '0 0 28px', color: '#94a3b8', fontSize: 12 };
const sectionTitleStyle = { fontSize: 15, fontWeight: 700, color: '#1d4ed8', margin: '0 0 8px', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" };
const sectionTextStyle = { fontSize: 13, color: '#334155', lineHeight: 1.7, margin: 0 };
