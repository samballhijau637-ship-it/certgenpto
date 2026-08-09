// pages/terms.js

import Head from 'next/head';

const WHATSAPP_NUMBER = '6289627312600';
const WHATSAPP_DISPLAY = '0896-2731-2600';
const WHATSAPP_LINK = (msg) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

const COLOR = {
    bg: '#0a0e1a',
    bgCard: '#111a2e',
    border: '#1e293b',
    accent: '#2563eb',
    primary: '#3b82f6',
    text: '#f8fafc',
    textMuted: '#94a3b8',
    textFaint: '#64748b',
};
const FONT_HEAD = "'Plus Jakarta Sans', system-ui, sans-serif";
const FONT_BODY = "'DM Sans', system-ui, sans-serif";

const SECTIONS = [
    {
        title: '1. Cara Menggunakan Aplikasi',
        body: [
            'Ekstrak (extract) file ZIP yang telah Anda download, buka folder hasil ekstrak, lalu jalankan file CertGenPro.exe.',
            'Jika belum memiliki lisensi, lakukan pembelian melalui halaman pembelian di website ini.',
            'Masukkan kode lisensi pada dialog aktivasi yang muncul saat pertama kali membuka aplikasi — lisensi akan otomatis terkunci ke perangkat tersebut.',
        ],
    },
    {
        title: '2. Peringatan Windows SmartScreen',
        body: [
            'Saat pertama kali menjalankan aplikasi, Windows SmartScreen mungkin menampilkan peringatan bahwa aplikasi tidak dikenali. Hal ini wajar karena aplikasi belum menggunakan sertifikat digital (Code Signing Certificate) berbayar.',
            'Apabila muncul peringatan tersebut: klik "More info", lalu klik "Run anyway". Aplikasi akan berjalan seperti biasa. Langkah ini hanya perlu dilakukan satu kali pada setiap perangkat.',
        ],
    },
    {
        title: '3. Persyaratan Sistem & Konektivitas',
        body: [
            'CertGen Pro adalah aplikasi desktop yang telah diuji dan berjalan dengan baik pada Windows 10 (64-bit) dan Windows 11 (64-bit). Sistem operasi lain seperti macOS atau Linux belum didukung.',
            'Aplikasi dapat digunakan sepenuhnya secara offline untuk membuat template, generate, dan preview sertifikat.',
            'Koneksi internet hanya dibutuhkan pada saat mengirim sertifikat secara massal melalui email (Gmail) ke peserta.',
        ],
    },
    {
        title: '4. Lisensi',
        body: [
            'Setiap lisensi hanya berlaku untuk 1 (satu) perangkat dan bersifat Personal/Business Use, mengikuti paket yang dibeli (Bulanan, Tahunan, atau Lifetime).',
            'Lisensi tidak dapat dipindahkan, dibagikan, atau digunakan pada lebih dari satu perangkat tanpa izin dari ImagineStudio.',
            'Lisensi dan kode aktivasi dikirimkan otomatis melalui WhatsApp dan email yang Anda daftarkan pada form pembelian — pastikan keduanya benar dan aktif.',
        ],
    },
    {
        title: '5. Jaminan Uang Kembali (Money Back Guarantee)',
        body: [
            'ImagineStudio memberikan jaminan uang kembali selama 3 (tiga) hari kalender sejak tanggal pembelian.',
            'Pengembalian dana hanya berlaku apabila aplikasi benar-benar tidak dapat dijalankan atau digunakan pada perangkat pengguna, setelah pengguna mengikuti petunjuk instalasi dan memberikan kesempatan kepada tim ImagineStudio untuk melakukan pemeriksaan atau membantu penyelesaian masalah.',
        ],
    },
    {
        title: '6. Jaminan Uang Kembali Tidak Berlaku Apabila',
        list: [
            'Masa pengajuan telah melebihi 3 (tiga) hari sejak tanggal pembelian.',
            'Pengguna berubah pikiran setelah melakukan pembelian.',
            'Pengguna tidak menyukai fitur, tampilan, atau cara kerja aplikasi.',
            'Kendala berasal dari konfigurasi perangkat, antivirus, modifikasi sistem operasi, koneksi internet, atau software pihak ketiga (termasuk pengaturan akun Gmail pengirim) yang berada di luar kendali ImagineStudio.',
        ],
        note: 'Keputusan mengenai kelayakan pengembalian dana merupakan hak ImagineStudio berdasarkan hasil pemeriksaan terhadap kendala yang dilaporkan.',
    },
    {
        title: '7. Copyright & Ketentuan Penggunaan',
        body: [
            '© ImagineStudio. All Rights Reserved. Aplikasi CertGen Pro dilindungi oleh hak cipta.',
            'Dengan membeli lisensi, Anda memperoleh hak penggunaan aplikasi sesuai jenis lisensi yang dibeli.',
        ],
        list: [
            'Dilarang menyebarluaskan, membagikan, atau mengunggah ulang installer aplikasi kepada pihak lain.',
            'Dilarang menjual kembali aplikasi maupun kode lisensi dalam bentuk apa pun.',
            'Dilarang memodifikasi, membajak (crack), mendistribusikan, atau mengklaim aplikasi sebagai milik sendiri tanpa izin tertulis dari ImagineStudio.',
        ],
        note: 'Pelanggaran terhadap ketentuan di atas dapat mengakibatkan pencabutan lisensi tanpa pengembalian dana serta tindakan sesuai ketentuan hukum yang berlaku.',
    },
    {
        title: '8. Disclaimer',
        body: [
            'CertGen Pro adalah alat bantu (tools) untuk membuat dan mengelola sertifikat digital secara massal. Keakuratan data peserta (nama, email, nomor sertifikat) sepenuhnya menjadi tanggung jawab pengguna yang menginput data tersebut.',
            'Pengiriman email massal menggunakan koneksi akun Gmail milik pengguna sendiri — ImagineStudio tidak bertanggung jawab atas pembatasan, kuota harian, atau kebijakan pengiriman yang diterapkan oleh pihak Google.',
            'Fitur verifikasi keaslian sertifikat (barcode) hanya memverifikasi data yang tersimpan di sistem milik pengguna; ImagineStudio tidak menyimpan maupun bertanggung jawab atas isi/konten sertifikat yang diterbitkan penggunanya.',
            'Seluruh sertifikat yang diterbitkan menggunakan aplikasi ini sepenuhnya menjadi tanggung jawab pengguna, termasuk memastikan tidak melanggar hak cipta, merek dagang, maupun peraturan perundang-undangan yang berlaku.',
        ],
    },
];

export default function Terms() {
    return (
        <>
            <Head>
                <title>Syarat &amp; Ketentuan — CertGen Pro</title>
                <meta name="description" content="Syarat & ketentuan penggunaan, lisensi, garansi uang kembali, dan disclaimer aplikasi CertGen Pro dari ImagineStudio." />
            </Head>
            <div style={{ background: COLOR.bg, color: COLOR.text, fontFamily: FONT_BODY, minHeight: '100vh' }}>
                <header style={{ borderBottom: `1px solid ${COLOR.border}`, padding: '20px' }}>
                    <div style={{ maxWidth: 820, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span>🔷</span> CertGen Pro
                        </div>
                        <a href="/" style={{ color: COLOR.textMuted, fontSize: 13, textDecoration: 'none' }}>
                            ← Kembali ke Beranda
                        </a>
                    </div>
                </header>

                <main style={{ maxWidth: 820, margin: '0 auto', padding: '48px 20px 80px' }}>
                    <h1 style={{ fontFamily: FONT_HEAD, fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 800, marginBottom: 8 }}>
                        Syarat &amp; Ketentuan
                    </h1>
                    <p style={{ color: COLOR.textFaint, fontSize: 13, marginBottom: 40 }}>
                        Berlaku untuk seluruh pengguna aplikasi CertGen Pro dari ImagineStudio.
                    </p>

                    {SECTIONS.map((s) => (
                        <section key={s.title} style={{ marginBottom: 32 }}>
                            <h2 style={{ fontFamily: FONT_HEAD, fontSize: 17, fontWeight: 700, marginBottom: 12, color: COLOR.accent }}>
                                {s.title}
                            </h2>
                            {s.body && s.body.map((p, i) => (
                                <p key={i} style={{ color: COLOR.textMuted, fontSize: 14, lineHeight: 1.8, marginBottom: 10 }}>
                                    {p}
                                </p>
                            ))}
                            {s.list && (
                                <ul style={{ margin: '10px 0', paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {s.list.map((item, i) => (
                                        <li key={i} style={{ color: COLOR.textMuted, fontSize: 14, lineHeight: 1.7 }}>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {s.note && (
                                <p style={{ color: COLOR.textFaint, fontSize: 12.5, lineHeight: 1.7, marginTop: 10, fontStyle: 'italic' }}>
                                    {s.note}
                                </p>
                            )}
                        </section>
                    ))}

                    <section style={{ background: COLOR.bgCard, border: `1px solid ${COLOR.border}`, borderRadius: 14, padding: 24, marginTop: 40 }}>
                        <h2 style={{ fontFamily: FONT_HEAD, fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Bantuan</h2>
                        <p style={{ color: COLOR.textMuted, fontSize: 13.5, lineHeight: 1.8, marginBottom: 14 }}>
                            Apabila mengalami kendala saat proses pembelian, aktivasi lisensi, atau penggunaan aplikasi, silakan
                            hubungi Admin melalui WhatsApp.
                        </p>
                        <a
                            href={WHATSAPP_LINK('Halo Admin, saya ingin bertanya tentang Syarat & Ketentuan CertGen Pro.')}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8, background: COLOR.accent, color: '#fff',
                                padding: '10px 18px', borderRadius: 8, fontWeight: 700, fontSize: 13, textDecoration: 'none',
                            }}
                        >
                            💬 Chat Admin ({WHATSAPP_DISPLAY})
                        </a>
                    </section>
                </main>
            </div>
        </>
    );
}
