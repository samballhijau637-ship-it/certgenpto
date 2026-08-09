// pages/index.js — CertGen Pro Landing Page

import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import Script from 'next/script';

const APP_ID = 'certgenpro';
const APP_NAME = 'CertGen Pro';
const WHATSAPP_NUMBER = '6289627312600';
const WHATSAPP_DISPLAY = '0896-2731-2600';
const WHATSAPP_LINK = (msg) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

/* =========================================================================
   DESIGN TOKENS — dark, dominan BIRU
   ========================================================================= */
const COLOR = {
    bg: '#0a0e1a',
    bgCard: '#111a2e',
    bgElevated: '#0d1424',
    border: '#1e293b',
    borderAccent: '#2563eb',
    accent: '#2563eb',
    accentLight: '#3b82f6',
    accentSoft: 'rgba(37,99,235,0.12)',
    primary: '#2563eb',
    text: '#f8fafc',
    textMuted: '#94a3b8',
    textFaint: '#64748b',
    warn: '#f59e0b',
    danger: '#ef4444',
    success: '#22c55e',
};
const FONT_HEAD = "'Plus Jakarta Sans', system-ui, sans-serif";
const FONT_BODY = "'DM Sans', system-ui, sans-serif";
const MAXW = 1180;

/* =========================================================================
   DATA
   ========================================================================= */

const PACKAGES = [
    { id: 'monthly', label: 'Bulanan', duration: '30 Hari', price: 'Rp 49.000', priceNote: '/ bulan', desc: 'Cocok untuk coba dulu atau kebutuhan event musiman.' },
    { id: 'yearly', label: 'Tahunan', duration: '365 Hari', price: 'Rp 299.000', priceNote: '/ tahun', desc: 'Paling hemat untuk trainer & lembaga aktif sepanjang tahun.', popular: true },
    { id: 'lifetime', label: 'Lifetime', duration: 'Selamanya', price: 'Rp 599.000', priceNote: '/ selamanya', desc: 'Sekali bayar, dipakai selamanya tanpa pikirkan perpanjangan.' },
];

const PAIN_POINTS = [
    { icon: '😫', text: 'Desain sertifikat satu-satu di Word/Canva untuk ratusan peserta, buang waktu berjam-jam' },
    { icon: '✍️', text: 'Copy-paste nama peserta manual satu per satu, rawan typo dan salah kirim' },
    { icon: '📧', text: 'Kirim sertifikat ke email peserta juga harus manual, satu per satu, semalaman' },
    { icon: '🕵️', text: 'Sertifikat gampang dipalsukan karena tidak ada cara resmi untuk verifikasi keasliannya' },
];

const FEATURES = [
    { icon: '🎨', title: 'Template Sertifikat Profesional, Tinggal Pakai', desc: 'Puluhan desain template sertifikat siap pakai dan sepenuhnya editable — sesuaikan logo, warna, dan teks sesuai brand acara atau lembaga Anda.' },
    { icon: '⚡', title: 'Generate Ratusan Sertifikat dalam Hitungan Menit', desc: 'Cukup import data peserta, satu klik dan ratusan sertifikat langsung jadi — tanpa perlu desain atau ketik manual satu per satu.' },
    { icon: '📤', title: 'Kirim Massal via Gmail, Sesuai Nama & Email Masing-Masing', desc: 'Satu kali klik, sistem otomatis mengirim sertifikat ke email setiap peserta sesuai nama dan alamat email mereka masing-masing lewat Gmail.' },
    { icon: '👁️', title: 'Preview Sertifikat Sebelum Generate', desc: 'Lihat dulu hasil jadinya sebelum di-generate massal, supaya tidak ada kesalahan format atau layout yang terlanjur tersebar ke semua peserta.' },
    { icon: '🔒', title: 'Fitur Barcode untuk Cek Keaslian Sertifikat', desc: 'Setiap sertifikat dilengkapi barcode unik, sehingga penerima maupun pihak ketiga bisa memverifikasi keasliannya kapan saja.' },
    { icon: '🔢', title: 'Fitur Nomor Urut Sertifikat Otomatis', desc: 'Setiap sertifikat mendapat nomor urut otomatis dan konsisten, memudahkan pengarsipan dan pencarian data di kemudian hari.' },
    { icon: '🔁', title: 'Export & Import Template Secara Instant', desc: 'Simpan dan pindahkan ratusan template sertifikat profesional antar perangkat atau ke rekan tim hanya dalam sekali proses.' },
];

const HOW_IT_WORKS = [
    { step: '01', title: 'Pilih atau Import Template', desc: 'Pakai template siap pakai dari CertGen Pro, atau import desain template sertifikat Anda sendiri.' },
    { step: '02', title: 'Masukkan Data Peserta', desc: 'Input nama, email, dan data peserta lainnya — bisa satu-satu atau import sekaligus dalam jumlah banyak.' },
    { step: '03', title: 'Preview Sebelum Generate', desc: 'Cek tampilan sertifikat dulu supaya yakin layout dan datanya sudah benar sebelum digenerate massal.' },
    { step: '04', title: 'Generate Ratusan Sertifikat Sekali Klik', desc: 'Sistem otomatis membuat sertifikat untuk seluruh peserta lengkap dengan nomor urut dan barcode keaslian.' },
    { step: '05', title: 'Kirim Otomatis via Gmail', desc: 'Kirim seluruh sertifikat ke email masing-masing peserta secara otomatis dalam sekali klik, tanpa kirim manual satu-satu.' },
];

const GOOD_FOR = [
    'Penyelenggara webinar, seminar, dan workshop',
    'Lembaga training & sertifikasi',
    'Kampus, sekolah, dan bimbingan belajar',
    'Event organizer dan komunitas',
    'HRD yang mengelola sertifikat pelatihan karyawan',
];
const NOT_FOR = [
    'Butuh sertifikat fisik / cetak langsung dari aplikasi',
    'Butuh integrasi ke sistem LMS pihak ketiga secara otomatis',
    'Mencari aplikasi berbasis web/cloud (ini aplikasi desktop Windows)',
];

const TESTIMONIALS = [
    { name: 'Bu Ratna', city: 'Trainer Bersertifikat, Yogyakarta', initials: 'BR', quote: 'Dulu bikin sertifikat 200 peserta pelatihan bisa 2 hari penuh. Sekarang generate dan kirim semua email dalam waktu kurang dari 1 jam.' },
    { name: 'Pak Andra', city: 'Event Organizer, Jakarta', initials: 'PA', quote: 'Fitur barcode-nya bikin klien lebih percaya karena sertifikatnya bisa dicek keasliannya. Terasa lebih profesional di mata peserta.' },
    { name: 'Mbak Dinda', city: 'Admin Diklat, Surabaya', initials: 'MD', quote: 'Yang paling membantu itu kirim email massalnya. Nggak perlu lagi kirim satu-satu ke ratusan peserta, tinggal sekali klik selesai semua.' },
    { name: 'Pak Yusuf', city: 'Ketua Komunitas, Bandung', initials: 'PY', quote: 'Template-nya banyak dan gampang diedit sesuai logo komunitas kami. Peserta juga senang karena sertifikat sudah bernomor urut resmi.' },
];

const FAQS = [
    { q: 'Aplikasi ini berjalan di sistem operasi apa?', a: 'CertGen Pro adalah aplikasi desktop yang telah diuji dan berjalan dengan baik di Windows 10 dan Windows 11. Sistem operasi lain seperti macOS atau Linux belum didukung.' },
    { q: 'Apakah aplikasi ini butuh koneksi internet terus-menerus?', a: 'Tidak. CertGen Pro bisa dipakai sepenuhnya offline untuk membuat template, input data, preview, dan generate sertifikat. Koneksi internet hanya dibutuhkan saat Anda menggunakan fitur kirim sertifikat massal via email ke peserta.' },
    { q: 'Bagaimana cara saya menerima lisensi setelah membeli?', a: 'Setelah pembayaran berhasil, kode lisensi akan langsung tampil di layar (halaman Thank You) dan otomatis dikirim ke nomor WhatsApp serta alamat email yang Anda daftarkan di form pembelian. Jika email tidak muncul di inbox, cek juga folder SPAM/Promosi.' },
    { q: 'Format nomor WhatsApp yang benar bagaimana?', a: 'Cukup masukkan nomor dengan awalan 08, contoh: 081234567890. Tidak perlu menuliskan kode negara +62, sistem kami yang akan menyesuaikannya secara otomatis.' },
    { q: 'Apakah lisensi bisa dipindah ke perangkat/laptop lain?', a: 'Setiap lisensi terkunci untuk 1 (satu) perangkat saja demi keamanan. Jika Anda perlu memindahkan ke perangkat baru, silakan hubungi Admin via WhatsApp untuk dibantu.' },
    { q: 'Berapa banyak sertifikat yang bisa saya generate dan kirim sekaligus?', a: 'Tidak ada batasan jumlah peserta dari sisi aplikasi — Anda bisa generate ratusan sertifikat sekaligus. Untuk pengiriman email massal, kecepatannya mengikuti batas wajar pengiriman akun Gmail Anda sendiri.' },
    { q: 'Apa bedanya paket Bulanan, Tahunan, dan Lifetime?', a: 'Ketiganya memberikan akses ke fitur yang sama persis. Bedanya hanya di masa aktif lisensi: Bulanan aktif 30 hari, Tahunan aktif 365 hari (paling hemat per bulannya), dan Lifetime aktif selamanya dengan sekali bayar.' },
    { q: 'Bagaimana cara memperpanjang (renew) lisensi setelah masa aktif habis?', a: 'Anda bisa memperpanjang kapan saja melalui halaman renew di website ini, termasuk tersedia paket Harian untuk kebutuhan mendesak/uji coba jangka pendek.' },
    { q: 'Bagaimana cara kerja fitur barcode verifikasi keaslian sertifikat?', a: 'Setiap sertifikat yang digenerate otomatis mendapat barcode unik dan nomor urut. Barcode ini bisa dipindai untuk memastikan sertifikat tersebut memang diterbitkan resmi melalui sistem Anda, bukan hasil pemalsuan.' },
    { q: 'Apa itu fitur Export & Import Template?', a: 'Fitur ini memungkinkan Anda menyimpan koleksi template sertifikat yang sudah dibuat, lalu memindahkannya ke perangkat lain atau membagikannya ke rekan tim, tanpa perlu desain ulang dari nol.' },
    { q: 'Bagaimana cara klaim garansi uang kembali?', a: 'Hubungi Admin via WhatsApp maksimal 3 hari kalender sejak pembelian. Tim kami akan membantu troubleshooting terlebih dahulu; jika aplikasi memang tidak bisa berjalan di perangkat Anda, dana akan dikembalikan sesuai ketentuan pada halaman Syarat & Ketentuan.' },
];

const REQUIREMENTS = [
    { icon: '🖥️', label: 'Sistem Operasi', value: 'Windows 10 (64-bit) & Windows 11 (64-bit)', note: 'Sudah teruji berjalan baik. Belum mendukung macOS atau Linux.' },
    { icon: '📡', label: 'Koneksi Internet', value: 'Hanya untuk kirim email massal', note: 'Membuat template, input data, dan generate sertifikat bisa 100% offline.' },
    { icon: '💾', label: 'Ruang Penyimpanan', value: 'Minimal 2 GB ruang kosong', note: 'Untuk aplikasi, template, dan hasil sertifikat.' },
    { icon: '📧', label: 'Akun Gmail', value: 'Diperlukan untuk kirim massal', note: 'Aplikasi mengirim email melalui akun Gmail milik Anda sendiri.' },
];

const GUARANTEE_POINTS = [
    'Garansi uang kembali 100% selama 3 hari kalender sejak tanggal pembelian.',
    'Berlaku apabila aplikasi benar-benar tidak dapat dijalankan/digunakan di perangkat Anda, setelah mengikuti petunjuk instalasi.',
    'Tim kami akan membantu troubleshooting terlebih dahulu sebelum proses refund diproses.',
];
const GUARANTEE_EXCEPTIONS = [
    'Pengajuan sudah melewati 3 hari sejak tanggal pembelian.',
    'Hanya karena berubah pikiran setelah membeli.',
    'Tidak menyukai fitur, tampilan, atau cara kerja aplikasi.',
    'Kendala dari konfigurasi perangkat, antivirus, akun Gmail pengirim, atau software pihak ketiga di luar kendali kami.',
];

function useReveal() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const node = ref.current;
        if (!node) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, []);
    return [ref, visible];
}

function useNavScroll() {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', handler);
        return () => window.removeEventListener('scroll', handler);
    }, []);
    return scrolled;
}

const SOCIAL_PROOF_ENDPOINT = '/api/social-proof/recent';
const SOCIAL_PROOF_FALLBACK = [
    { name: 'Bu Ratna', city: 'Yogyakarta', status: 'Pembayaran Terkonfirmasi' },
    { name: 'Pak Andra', city: 'Jakarta', status: 'Pembayaran Terkonfirmasi' },
    { name: 'Mbak Dinda', city: 'Surabaya', status: 'Pembayaran Terkonfirmasi' },
    { name: 'Pak Yusuf', city: 'Bandung', status: 'Pembayaran Terkonfirmasi' },
];

function useSocialProof() {
    const [items, setItems] = useState(SOCIAL_PROOF_FALLBACK);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        let cancelled = false;
        fetch(SOCIAL_PROOF_ENDPOINT)
            .then((res) => (res.ok ? res.json() : Promise.reject()))
            .then((data) => {
                if (!cancelled && Array.isArray(data) && data.length > 0) setItems(data);
            })
            .catch(() => {});
        return () => { cancelled = true; };
    }, []);

    useEffect(() => {
        const timer = setInterval(() => setIndex((i) => (i + 1) % items.length), 4000);
        return () => clearInterval(timer);
    }, [items.length]);

    return items[index];
}

/* =========================================================================
   MAIN PAGE
   ========================================================================= */

export default function Home() {
    const [form, setForm] = useState({ email: '', whatsapp: '', package_type: 'yearly', coupon_code: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [openFaq, setOpenFaq] = useState(null);
    const navScrolled = useNavScroll();

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const res = await fetch('/api/payment/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ app_id: APP_ID, ...form }),
            });
            const data = await res.json();

            if (!res.ok) {
                setMessage(`Gagal: ${data.error}`);
                return;
            }

            if (data.free_trial) {
                window.location.href = `/thankyou?license_key=${data.license_key}`;
                return;
            }

            if (window.snap) {
                window.snap.pay(data.snap_token, {
                    onSuccess: () => { window.location.href = `/thankyou?license_key=${data.license_key}`; },
                    onPending: () => setMessage('Pembayaran tertunda. Selesaikan pembayaran untuk menerima lisensi.'),
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

    const scrollTo = useCallback((id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, []);

    return (
        <>
            <Head>
                <title>CertGen Pro — Buat & Kirim Ratusan Sertifikat Digital Otomatis</title>
                <meta
                    name="description"
                    content="Aplikasi desktop untuk generate ratusan sertifikat digital dalam hitungan menit, kirim otomatis via email sesuai nama peserta, lengkap barcode verifikasi keaslian. Untuk trainer, event organizer, kampus, dan lembaga sertifikasi."
                />
                <meta name="keywords" content="aplikasi sertifikat digital, generate sertifikat massal, sertifikat online, aplikasi kirim sertifikat email, barcode sertifikat, aplikasi pelatihan sertifikat, CertGen Pro" />
                <meta property="og:title" content="CertGen Pro — Buat & Kirim Ratusan Sertifikat Digital Otomatis" />
                <meta property="og:description" content="Generate ratusan sertifikat digital sekali klik, kirim otomatis ke email peserta, lengkap barcode keaslian." />
                <meta property="og:type" content="website" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=DM+Sans:wght@400;500;700&display=swap"
                    rel="stylesheet"
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'SoftwareApplication',
                            name: 'CertGen Pro',
                            description: 'Aplikasi desktop Windows untuk membuat dan mengirim ratusan sertifikat digital secara massal, lengkap dengan barcode verifikasi keaslian.',
                            applicationCategory: 'BusinessApplication',
                            offers: { '@type': 'Offer', price: '299000', priceCurrency: 'IDR' },
                        }),
                    }}
                />
            </Head>
            <Script
                src={
                    process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === 'true'
                        ? 'https://app.midtrans.com/snap/snap.js'
                        : 'https://app.sandbox.midtrans.com/snap/snap.js'
                }
                data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
            />

            <div style={{ background: COLOR.bg, color: COLOR.text, fontFamily: FONT_BODY, minHeight: '100vh' }}>
                <Navbar scrolled={navScrolled} scrollTo={scrollTo} />
                <main>
                    <HeroSection scrollTo={scrollTo} />
                    <SocialProofBar />
                    <PainSection />
                    <FeaturesSection />
                    <HowItWorksSection />
                    <MidCTASection scrollTo={scrollTo} />
                    <GoodForSection />
                    <RequirementsSection />
                    <TestimonialsSection />
                    <GuaranteeSection />
                    <PurchaseSection form={form} setForm={setForm} loading={loading} message={message} handleSubmit={handleSubmit} />
                    <FAQSection openFaq={openFaq} setOpenFaq={setOpenFaq} />
                    <FinalCTASection scrollTo={scrollTo} />
                </main>
                <Footer />
            </div>
        </>
    );
}

/* =========================================================================
   NAVBAR
   ========================================================================= */

function Navbar({ scrolled, scrollTo }) {
    const navItems = [
        { id: 'fitur', label: 'Fitur' },
        { id: 'cara-kerja', label: 'Cara Kerja' },
        { id: 'testimoni', label: 'Testimoni' },
        { id: 'beli', label: 'Harga' },
        { id: 'faq', label: 'FAQ' },
    ];
    return (
        <header
            style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
                background: scrolled ? 'rgba(10,14,26,0.92)' : 'transparent',
                backdropFilter: scrolled ? 'blur(10px)' : 'none',
                borderBottom: scrolled ? `1px solid ${COLOR.border}` : '1px solid transparent',
                transition: 'all 0.3s ease',
            }}
        >
            <div style={{ maxWidth: MAXW, margin: '0 auto', padding: '0 20px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 17, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>🔷</span> CertGen Pro
                </div>
                <nav style={{ display: 'none', gap: 28, alignItems: 'center' }} className="desktop-nav">
                    {navItems.map((item) => (
                        <a key={item.id} onClick={() => scrollTo(item.id)} style={{ color: COLOR.textMuted, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
                            {item.label}
                        </a>
                    ))}
                </nav>
                {/* CTA #1 — di navbar, selalu terlihat */}
                <button
                    onClick={() => scrollTo('beli')}
                    style={{ background: COLOR.accent, color: '#fff', border: 'none', padding: '9px 18px', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: FONT_BODY }}
                >
                    Miliki Lisensi
                </button>
            </div>
            <style jsx>{`
                @media (min-width: 860px) { .desktop-nav { display: flex !important; } }
            `}</style>
        </header>
    );
}

/* =========================================================================
   HERO — CTA #1 (AWAL)
   ========================================================================= */

function HeroSection({ scrollTo }) {
    return (
        <section style={{ padding: '140px 20px 70px', background: `radial-gradient(ellipse at top, rgba(37,99,235,0.16), transparent 60%)` }}>
            <div style={{ maxWidth: MAXW, margin: '0 auto', textAlign: 'center' }}>
                <span style={{ background: '#12213f', color: COLOR.accentLight, fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 20, letterSpacing: '0.05em', display: 'inline-block', marginBottom: 20 }}>
                    UNTUK TRAINER, EVENT ORGANIZER & LEMBAGA SERTIFIKASI
                </span>
                <h1 style={{ fontFamily: FONT_HEAD, fontSize: 'clamp(26px, 4.6vw, 46px)', fontWeight: 800, lineHeight: 1.2, margin: '0 auto 20px', maxWidth: 820 }}>
                    Masih Bikin Sertifikat Satu-Satu di Word/Canva untuk Ratusan Peserta?
                </h1>
                <p style={{ color: COLOR.textMuted, fontSize: 16, lineHeight: 1.7, maxWidth: 640, margin: '0 auto 20px' }}>
                    Copy-paste nama peserta satu per satu, desain manual berjam-jam, lalu masih harus kirim email satu-satu ke
                    setiap orang — waktu Anda habis untuk kerjaan yang sebetulnya bisa selesai dalam hitungan menit.
                </p>
                <p style={{ color: COLOR.text, fontSize: 16, lineHeight: 1.7, maxWidth: 640, margin: '0 auto 32px', fontWeight: 700 }}>
                    <span style={{ color: COLOR.accentLight }}>CertGen Pro</span> membuat Anda bisa generate ratusan sertifikat
                    digital sekali klik, lengkap dengan barcode keaslian dan nomor urut, lalu mengirimkannya otomatis ke email
                    setiap peserta — tanpa kerja manual satu-satu lagi.
                </p>
                <div style={{ display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => scrollTo('beli')}
                        style={{ background: COLOR.accent, color: '#fff', border: 'none', padding: '15px 30px', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: FONT_BODY, boxShadow: '0 8px 25px rgba(37,99,235,0.35)' }}
                    >
                        Miliki Lisensi Sekarang ⚡
                    </button>
                    <a onClick={() => scrollTo('fitur')} style={{ color: COLOR.accentLight, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                        Lihat semua fitur →
                    </a>
                </div>
                <p style={{ marginTop: 18, fontSize: 13, color: COLOR.textFaint }}>
                    ✓ Generate ratusan sertifikat dalam hitungan menit &nbsp;·&nbsp; ✓ Kirim otomatis via email &nbsp;·&nbsp; ✓ Barcode verifikasi keaslian
                </p>
            </div>
        </section>
    );
}

/* =========================================================================
   SOCIAL PROOF BAR
   ========================================================================= */

function SocialProofBar() {
    const latest = useSocialProof();
    return (
        <div style={{ borderTop: `1px solid ${COLOR.border}`, borderBottom: `1px solid ${COLOR.border}`, background: COLOR.bgElevated }}>
            <div style={{ maxWidth: MAXW, margin: '0 auto', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 13, color: COLOR.textMuted, flexWrap: 'wrap', textAlign: 'center' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: COLOR.accentLight, display: 'inline-block' }} />
                <span>
                    <strong style={{ color: COLOR.text }}>{latest.name}, {latest.city}</strong> baru saja membeli CertGen Pro — {latest.status}
                </span>
            </div>
        </div>
    );
}

/* =========================================================================
   PAIN SECTION
   ========================================================================= */

function PainSection() {
    const [ref, visible] = useReveal();
    return (
        <section ref={ref} style={fadeStyle(visible, { padding: '80px 20px' })}>
            <div style={{ maxWidth: 820, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <h2 style={h2Style}>Rasanya familiar, kan?</h2>
                    <p style={{ color: COLOR.textMuted }}>Ini keluhan yang paling sering kami dengar dari trainer & panitia event sebelum pakai CertGen Pro.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                    {PAIN_POINTS.map((p) => (
                        <div key={p.text} style={{ background: COLOR.bgCard, border: `1px solid ${COLOR.border}`, borderRadius: 14, padding: 20, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                            <span style={{ fontSize: 24 }}>{p.icon}</span>
                            <p style={{ margin: 0, fontSize: 14, color: COLOR.textMuted, lineHeight: 1.6 }}>{p.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* =========================================================================
   FEATURES
   ========================================================================= */

function FeaturesSection() {
    const [ref, visible] = useReveal();
    return (
        <section id="fitur" ref={ref} style={fadeStyle(visible, { padding: '80px 20px', background: COLOR.bgElevated })}>
            <div style={{ maxWidth: MAXW, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 44 }}>
                    <h2 style={h2Style}>Semua yang Anda Butuhkan untuk Kelola Sertifikat Massal</h2>
                    <p style={{ color: COLOR.textMuted, maxWidth: 560, margin: '0 auto' }}>
                        Dirancang khusus untuk penyelenggara event, trainer, dan lembaga yang menerbitkan sertifikat dalam jumlah besar.
                    </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
                    {FEATURES.map((f) => <FeatureCard key={f.title} {...f} />)}
                </div>
            </div>
        </section>
    );
}

function FeatureCard({ icon, title, desc }) {
    const [hovered, setHovered] = useState(false);
    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{ background: COLOR.bgCard, border: `1px solid ${hovered ? COLOR.accent : COLOR.border}`, borderRadius: 14, padding: 26, transition: 'all 0.25s ease', transform: hovered ? 'translateY(-4px)' : 'none' }}
        >
            <div style={{ width: 44, height: 44, borderRadius: 10, background: COLOR.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 16 }}>
                {icon}
            </div>
            <h3 style={{ fontFamily: FONT_HEAD, fontSize: 15.5, fontWeight: 700, marginBottom: 8 }}>{title}</h3>
            <p style={{ color: COLOR.textMuted, fontSize: 13.5, lineHeight: 1.65, margin: 0 }}>{desc}</p>
        </div>
    );
}

/* =========================================================================
   CARA KERJA
   ========================================================================= */

function HowItWorksSection() {
    const [ref, visible] = useReveal();
    return (
        <section id="cara-kerja" ref={ref} style={fadeStyle(visible, { padding: '80px 20px' })}>
            <div style={{ maxWidth: MAXW, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 44 }}>
                    <h2 style={h2Style}>Dari Data Peserta Jadi Sertifikat Terkirim, Cuma 5 Langkah</h2>
                    <p style={{ color: COLOR.textMuted, maxWidth: 560, margin: '0 auto' }}>
                        Tidak perlu skill desain. Import data, generate, kirim — selesai.
                    </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
                    {HOW_IT_WORKS.map((s) => (
                        <div key={s.step} style={{ background: COLOR.bgCard, border: `1px solid ${COLOR.border}`, borderRadius: 14, padding: '22px 20px' }}>
                            <div style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 22, color: COLOR.accentLight, marginBottom: 10 }}>{s.step}</div>
                            <h3 style={{ fontFamily: FONT_HEAD, fontSize: 14.5, fontWeight: 700, marginBottom: 8 }}>{s.title}</h3>
                            <p style={{ color: COLOR.textMuted, fontSize: 13, lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* =========================================================================
   MID CTA — CTA #2 (TENGAH)
   ========================================================================= */

function MidCTASection({ scrollTo }) {
    const [ref, visible] = useReveal();
    return (
        <section ref={ref} style={fadeStyle(visible, { padding: '60px 20px' })}>
            <div
                style={{
                    maxWidth: 900, margin: '0 auto', background: `linear-gradient(135deg, ${COLOR.accent}, #1d4ed8)`,
                    borderRadius: 20, padding: '44px 32px', textAlign: 'center', boxShadow: '0 20px 50px rgba(37,99,235,0.25)',
                }}
            >
                <h2 style={{ fontFamily: FONT_HEAD, fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 800, color: '#fff', marginBottom: 12 }}>
                    Berhenti Kirim Sertifikat Satu-Satu Mulai Sekarang
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14.5, marginBottom: 24, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
                    Ratusan peserta, satu kali klik. CertGen Pro sudah dipakai puluhan trainer dan panitia event di seluruh Indonesia.
                </p>
                <button
                    onClick={() => scrollTo('beli')}
                    style={{ background: '#fff', color: COLOR.accent, border: 'none', padding: '14px 30px', borderRadius: 10, fontWeight: 800, fontSize: 14.5, cursor: 'pointer', fontFamily: FONT_BODY }}
                >
                    Lihat Paket Harga →
                </button>
            </div>
        </section>
    );
}

/* =========================================================================
   GOOD FOR / LIMITATION
   ========================================================================= */

function GoodForSection() {
    const [ref, visible] = useReveal();
    return (
        <section ref={ref} style={fadeStyle(visible, { padding: '80px 20px', background: COLOR.bgElevated })}>
            <div style={{ maxWidth: MAXW, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <h2 style={h2Style}>Supaya Ekspektasi Anda Tepat Sejak Awal</h2>
                    <p style={{ color: COLOR.textMuted }}>Kami transparan soal siapa yang paling cocok pakai aplikasi ini.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }} className="two-col-equal">
                    <div style={{ background: COLOR.accentSoft, border: `1px solid ${COLOR.borderAccent}`, borderRadius: 14, padding: 24 }}>
                        <h3 style={{ color: COLOR.accentLight, fontFamily: FONT_HEAD, fontSize: 15, marginBottom: 14 }}>✓ Cocok Untuk</h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {GOOD_FOR.map((item) => (
                                <li key={item} style={{ fontSize: 13.5, color: COLOR.text, display: 'flex', gap: 8 }}>
                                    <span style={{ color: COLOR.accentLight }}>✓</span> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div style={{ background: 'rgba(239,68,68,0.05)', border: `1px solid #7f1d1d`, borderRadius: 14, padding: 24 }}>
                        <h3 style={{ color: '#f87171', fontFamily: FONT_HEAD, fontSize: 15, marginBottom: 14 }}>✕ Bukan Untuk</h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {NOT_FOR.map((item) => (
                                <li key={item} style={{ fontSize: 13.5, color: COLOR.textMuted, display: 'flex', gap: 8 }}>
                                    <span style={{ color: '#f87171' }}>✕</span> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <style jsx>{`
                    @media (min-width: 700px) { .two-col-equal { grid-template-columns: 1fr 1fr !important; } }
                `}</style>
            </div>
        </section>
    );
}

/* =========================================================================
   SYSTEM REQUIREMENTS
   ========================================================================= */

function RequirementsSection() {
    const [ref, visible] = useReveal();
    return (
        <section ref={ref} style={fadeStyle(visible, { padding: '80px 20px' })}>
            <div style={{ maxWidth: MAXW, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <h2 style={h2Style}>Perangkat yang Dibutuhkan</h2>
                    <p style={{ color: COLOR.textMuted, maxWidth: 560, margin: '0 auto' }}>
                        Ringan dan bisa langsung dipakai di laptop/PC kantoran standar.
                    </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18 }}>
                    {REQUIREMENTS.map((r) => (
                        <div key={r.label} style={{ background: COLOR.bgCard, border: `1px solid ${COLOR.border}`, borderRadius: 14, padding: 22, textAlign: 'center' }}>
                            <div style={{ fontSize: 26, marginBottom: 10 }}>{r.icon}</div>
                            <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, fontSize: 13, color: COLOR.textMuted, marginBottom: 6 }}>{r.label}</div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: COLOR.text, marginBottom: 6 }}>{r.value}</div>
                            <div style={{ fontSize: 11.5, color: COLOR.textFaint, lineHeight: 1.5 }}>{r.note}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* =========================================================================
   TESTIMONIALS
   ========================================================================= */

function TestimonialsSection() {
    const [ref, visible] = useReveal();
    return (
        <section id="testimoni" ref={ref} style={fadeStyle(visible, { padding: '80px 20px', background: COLOR.bgElevated })}>
            <div style={{ maxWidth: MAXW, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 40 }}>
                    <h2 style={h2Style}>Apa Kata Mereka yang Sudah Pakai</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
                    {TESTIMONIALS.map((t) => (
                        <div key={t.name} style={{ background: COLOR.bgCard, border: `1px solid ${COLOR.border}`, borderRadius: 14, padding: 22 }}>
                            <p style={{ color: COLOR.text, fontSize: 13.5, lineHeight: 1.7, marginBottom: 18 }}>&ldquo;{t.quote}&rdquo;</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 36, height: 36, borderRadius: '50%', background: COLOR.accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>
                                    {t.initials}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: 13 }}>{t.name}</div>
                                    <div style={{ color: COLOR.textFaint, fontSize: 11.5 }}>{t.city}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* =========================================================================
   GARANSI
   ========================================================================= */

function GuaranteeSection() {
    const [ref, visible] = useReveal();
    return (
        <section id="garansi" ref={ref} style={fadeStyle(visible, { padding: '80px 20px' })}>
            <div style={{ maxWidth: 820, margin: '0 auto' }}>
                <div style={{ background: COLOR.accentSoft, border: `1px solid ${COLOR.borderAccent}`, borderRadius: 18, padding: '36px 28px', display: 'grid', gridTemplateColumns: '1fr', gap: 28 }} className="two-col-equal">
                    <div>
                        <span style={{ fontSize: 30 }}>🛡️</span>
                        <h2 style={{ ...h2Style, textAlign: 'left', marginTop: 10 }}>Garansi Uang Kembali 3 Hari</h2>
                        <p style={{ color: COLOR.textMuted, lineHeight: 1.75, fontSize: 13.5, marginBottom: 16 }}>
                            Belanja tenang. Kalau aplikasi benar-benar tidak bisa dijalankan di perangkat Anda setelah mengikuti
                            petunjuk instalasi, kami bantu troubleshoot dulu — dan dana bisa dikembalikan sesuai ketentuan.
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {GUARANTEE_POINTS.map((p) => (
                                <li key={p} style={{ fontSize: 13, color: COLOR.text, display: 'flex', gap: 8, lineHeight: 1.6 }}>
                                    <span style={{ color: COLOR.accentLight, flexShrink: 0 }}>✓</span> {p}
                                </li>
                            ))}
                        </ul>
                        <a href={WHATSAPP_LINK('Halo Admin, saya ingin bertanya soal garansi uang kembali CertGen Pro.')} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: COLOR.success, fontWeight: 700, fontSize: 13, textDecoration: 'none' }}>
                            💬 Tanya Admin soal garansi via WhatsApp ({WHATSAPP_DISPLAY})
                        </a>
                    </div>
                    <div>
                        <h3 style={{ fontFamily: FONT_HEAD, fontSize: 13.5, color: '#f87171', marginBottom: 12 }}>Garansi tidak berlaku apabila:</h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {GUARANTEE_EXCEPTIONS.map((p) => (
                                <li key={p} style={{ fontSize: 12.5, color: COLOR.textMuted, display: 'flex', gap: 8, lineHeight: 1.6 }}>
                                    <span style={{ color: '#f87171', flexShrink: 0 }}>✕</span> {p}
                                </li>
                            ))}
                        </ul>
                        <p style={{ fontSize: 11.5, color: COLOR.textFaint, marginTop: 14, lineHeight: 1.6 }}>
                            Detail lengkap lihat halaman <a onClick={() => window.open('/terms', '_blank')} style={{ color: COLOR.accentLight, cursor: 'pointer' }}>Syarat &amp; Ketentuan</a>.
                        </p>
                    </div>
                </div>
                <style jsx>{`
                    @media (min-width: 700px) { .two-col-equal { grid-template-columns: 1.1fr 0.9fr !important; } }
                `}</style>
            </div>
        </section>
    );
}

/* =========================================================================
   PURCHASE SECTION — CTA #3 (paket harga + form beli)
   ========================================================================= */

function PurchaseSection({ form, setForm, loading, message, handleSubmit }) {
    const [ref, visible] = useReveal();
    return (
        <section id="beli" ref={ref} style={fadeStyle(visible, { padding: '80px 20px' })}>
            <div style={{ maxWidth: 620, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <span style={badgeStyle}>PILIH PAKET LISENSI</span>
                    <h1 style={{ ...h2Style, marginTop: 10 }}>🔷 {APP_NAME}</h1>
                    <p style={subtitleStyle}>Generate & kirim ratusan sertifikat digital secara massal, dalam hitungan menit.</p>
                </div>

                {/* Grid Pilihan Paket */}
                <div style={pkgGridStyle} className="pkg-grid">
                    {PACKAGES.map((pkg) => {
                        const isSelected = form.package_type === pkg.id;
                        return (
                            <div
                                key={pkg.id}
                                onClick={() => setForm({ ...form, package_type: pkg.id })}
                                style={{ ...pkgCardStyle, borderColor: isSelected ? COLOR.accent : COLOR.border, background: isSelected ? '#132038' : COLOR.bgElevated }}
                            >
                                {pkg.popular && <span style={popularBadgeStyle}>TERPOPULER</span>}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                    <h3 style={{ margin: 0, color: '#fff', fontSize: 15 }}>{pkg.label}</h3>
                                    <span style={{ fontSize: 11, color: COLOR.accentLight, fontWeight: 'bold' }}>{pkg.duration}</span>
                                </div>
                                <h4 style={{ margin: '8px 0 4px', fontSize: 20, fontWeight: 'bold', color: isSelected ? COLOR.accentLight : '#fff' }}>
                                    {pkg.price} <span style={{ fontSize: 11, color: COLOR.textFaint, fontWeight: 500 }}>{pkg.priceNote}</span>
                                </h4>
                                <p style={{ margin: 0, fontSize: 11.5, color: COLOR.textMuted, lineHeight: 1.4 }}>{pkg.desc}</p>
                            </div>
                        );
                    })}
                </div>

                <main style={cardStyle}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                            <label style={labelStyle}>Alamat Email</label>
                            <input type="email" required placeholder="nama@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} />
                        </div>

                        <div>
                            <label style={labelStyle}>Nomor WhatsApp (format: 08xxx, tanpa +62)</label>
                            <input type="text" placeholder="081234567890" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} style={inputStyle} />
                        </div>

                        <div>
                            <label style={labelStyle}>Kode Kupon (Opsional)</label>
                            <input type="text" placeholder="MASUKKAN_KODE_DISINI" value={form.coupon_code} onChange={(e) => setForm({ ...form, coupon_code: e.target.value })} style={inputStyle} />
                        </div>

                        <button type="submit" disabled={loading} style={buttonStyle}>
                            {loading ? 'Memproses Sesi...' : 'Miliki Lisensi Sekarang ⚡'}
                        </button>
                        <p style={{ textAlign: 'center', fontSize: 11.5, color: '#64748b', margin: 0 }}>
                            ✓ Lisensi terkirim otomatis via WhatsApp & Email &nbsp;·&nbsp; ✓ Garansi 3 hari
                        </p>
                    </form>

                    {message && <p style={messageStyle}>{message}</p>}

                    <p style={{ textAlign: 'center', fontSize: 12, color: COLOR.textFaint, marginTop: 18 }}>
                        Ada pertanyaan sebelum membeli?{' '}
                        <a href={WHATSAPP_LINK('Halo Admin, saya ingin bertanya tentang CertGen Pro sebelum membeli.')} target="_blank" rel="noopener noreferrer" style={{ color: COLOR.success, fontWeight: 700, textDecoration: 'none' }}>
                            💬 Chat Admin via WhatsApp
                        </a>
                    </p>
                    <p style={{ textAlign: 'center', fontSize: 11.5, color: COLOR.textFaint, marginTop: 8 }}>
                        Sudah punya lisensi dan mau perpanjang? <a href="/renew" style={{ color: COLOR.accentLight }}>Klik di sini</a>.
                    </p>
                </main>
            </div>
            <style jsx>{`
                .pkg-grid { grid-template-columns: 1fr; }
                @media (min-width: 640px) { .pkg-grid { grid-template-columns: repeat(3, 1fr) !important; } }
            `}</style>
        </section>
    );
}

/* =========================================================================
   FAQ
   ========================================================================= */

function FAQSection({ openFaq, setOpenFaq }) {
    return (
        <section id="faq" style={{ padding: '80px 20px', background: COLOR.bgElevated }}>
            <div style={{ maxWidth: 720, margin: '0 auto' }}>
                <h2 style={{ ...h2Style, textAlign: 'center', marginBottom: 36 }}>Pertanyaan yang Sering Ditanya</h2>
                {FAQS.map((faq, i) => (
                    <div key={faq.q} style={{ borderBottom: `1px solid ${COLOR.border}` }}>
                        <button
                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                            style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, cursor: 'pointer', fontFamily: FONT_BODY, fontWeight: 700, fontSize: 14, color: COLOR.text }}
                        >
                            {faq.q}
                            <span style={{ color: COLOR.accentLight, fontSize: 20, transform: openFaq === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s', flexShrink: 0 }}>+</span>
                        </button>
                        <div style={{ maxHeight: openFaq === i ? 260 : 0, overflow: 'hidden', transition: 'max-height 0.4s ease' }}>
                            <p style={{ paddingBottom: 18, color: COLOR.textMuted, lineHeight: 1.7, fontSize: 13.5, margin: 0 }}>{faq.a}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

/* =========================================================================
   FINAL CTA — CTA #4 (AKHIR, tambahan penguat setelah FAQ)
   ========================================================================= */

function FinalCTASection({ scrollTo }) {
    return (
        <section style={{ padding: '80px 20px', textAlign: 'center' }}>
            <div style={{ maxWidth: 620, margin: '0 auto' }}>
                <h2 style={h2Style}>Mulai Kelola Sertifikat Digital Anda Hari Ini</h2>
                <p style={{ color: COLOR.textMuted, marginBottom: 28 }}>
                    Ratusan sertifikat siap kirim, tanpa kerja manual satu-satu lagi.
                </p>
                <button
                    onClick={() => scrollTo('beli')}
                    style={{ background: COLOR.accent, color: '#fff', border: 'none', padding: '16px 34px', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: FONT_BODY, boxShadow: '0 8px 25px rgba(37,99,235,0.3)' }}
                >
                    Miliki Lisensi Sekarang ⚡
                </button>
                <p style={{ marginTop: 14, fontSize: 12, color: COLOR.textFaint }}>
                    ✓ Aktivasi instan &nbsp;·&nbsp; ✓ Lisensi via WhatsApp & Email &nbsp;·&nbsp; ✓ Garansi uang kembali 3 hari
                </p>
            </div>
        </section>
    );
}

/* =========================================================================
   FOOTER
   ========================================================================= */

function Footer() {
    return (
        <footer style={{ borderTop: `1px solid ${COLOR.border}`, padding: '40px 20px' }}>
            <div style={{ maxWidth: MAXW, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'space-between', alignItems: 'center', fontSize: 12.5, color: COLOR.textFaint }}>
                <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, color: COLOR.textMuted }}>🔷 CertGen Pro</div>
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                    <a href="/renew" style={{ color: COLOR.textFaint }}>Perpanjang Lisensi</a>
                    <a href="/terms" style={{ color: COLOR.textFaint }}>Syarat & Ketentuan</a>
                    <a href={WHATSAPP_LINK('Halo Admin, saya ingin bertanya tentang CertGen Pro.')} target="_blank" rel="noopener noreferrer" style={{ color: COLOR.textFaint }}>
                        Kontak ({WHATSAPP_DISPLAY})
                    </a>
                </div>
                <div>© {new Date().getFullYear()} CertGen Pro — ImagineStudio. Semua hak dilindungi.</div>
            </div>
        </footer>
    );
}

/* =========================================================================
   HELPERS / STYLES
   ========================================================================= */

const h2Style = { fontFamily: FONT_HEAD, fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 800, textAlign: 'center', marginBottom: 14, color: COLOR.text };

function fadeStyle(visible, extra) {
    return { opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)', transition: 'opacity 0.6s ease, transform 0.6s ease', ...extra };
}

const cardStyle = { background: COLOR.bgCard, border: `1px solid ${COLOR.border}`, padding: '32px 24px', borderRadius: 16, width: '100%', boxSizing: 'border-box' };
const badgeStyle = { background: '#12213f', color: COLOR.accentLight, fontSize: 11, fontWeight: 'bold', padding: '4px 10px', borderRadius: 20, display: 'inline-block' };
const subtitleStyle = { margin: '8px 0 0 0', color: COLOR.textMuted, fontSize: 13, lineHeight: '1.4' };
const labelStyle = { display: 'block', fontSize: 12, fontWeight: 'bold', color: COLOR.textMuted, marginBottom: 6 };
const inputStyle = { display: 'block', width: '100%', padding: 10, background: COLOR.bgElevated, border: `1px solid ${COLOR.border}`, borderRadius: 8, color: '#fff', fontSize: 13, boxSizing: 'border-box' };
const buttonStyle = { width: '100%', padding: 12, background: COLOR.accent, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', fontSize: 14, transition: '0.2s' };
const messageStyle = { marginTop: 16, padding: 10, background: '#12213f', border: `1px solid ${COLOR.border}`, borderRadius: 8, fontSize: 12, color: '#cbd5e1', textAlign: 'center', lineHeight: '1.4' };

const pkgGridStyle = { display: 'grid', gap: 12, marginBottom: 20 };
const pkgCardStyle = { border: `1px solid ${COLOR.border}`, borderRadius: 12, padding: 16, cursor: 'pointer', transition: '0.2s', position: 'relative' };
const popularBadgeStyle = { position: 'absolute', top: -9, right: 12, background: COLOR.accent, color: '#fff', fontSize: 9, fontWeight: 'bold', padding: '3px 8px', borderRadius: 4 };
