// pages/index.js
// ============================================================================
// LANDING PAGE — CertGenPro
// Aplikasi desktop untuk membuat & mengirim sertifikat digital secara massal.
//
// CATATAN PENTING (baca sebelum deploy):
// 1. Logic pembelian (fetch ke /api/payment/create, Snap Midtrans, redirect ke
//    /thankyou) TIDAK DIUBAH sama sekali — 100% sama dengan sistem lama, supaya
//    tetap kompatibel dengan create.js, webhook.js, notify.js (Fonnte & Brevo)
//    dan Supabase yang sudah ada. Jangan ubah bagian handleSubmit().
// 2. APP_ID = 'certgenpro' — HARUS sama persis dengan key di PRICE_TABLE pada
//    pages/api/payment/create.js.
// 3. Harga yang tampil di halaman ini (49rb/299rb/599rb) HANYA tampilan/UI.
//    Nominal yang benar-benar ditagihkan ke Midtrans diambil dari PRICE_TABLE
//    di server (create.js). Jadi setelah landing page ini dipasang, PRICE_TABLE
//    di create.js WAJIB disesuaikan juga (menyusul di sesi berikutnya bersama
//    renew page + admin page), kalau tidak, harga di landing page dan harga
//    yang benar-benar ditagihkan akan beda.
// 4. Nomor WhatsApp admin (WHATSAPP_NUMBER) masih pakai nomor lama dari project
//    sebelumnya — ganti manual kalau nomor CS CertGenPro berbeda.
// ============================================================================

import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import Script from 'next/script';

const APP_ID = 'certgenpro';
const WHATSAPP_NUMBER = '6289627312600';
const WHATSAPP_DISPLAY = '0896-2731-2600';
const WHATSAPP_LINK = (msg) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

/* =========================================================================
   DESIGN TOKENS — dominan BIRU
   ========================================================================= */
const COLOR = {
    bg: '#080d1a',
    bgCard: '#0f1830',
    bgElevated: '#0b1326',
    border: '#1e2a47',
    borderAccent: '#2563eb',
    accent: '#2563eb',
    accentBright: '#3b82f6',
    accentSoft: '#60a5fa',
    accentDark: '#1d4ed8',
    text: '#f8fafc',
    textMuted: '#94a3b8',
    textFaint: '#64748b',
    warn: '#f59e0b',
    danger: '#ef4444',
};
const FONT_HEAD = "'Plus Jakarta Sans', system-ui, sans-serif";
const FONT_BODY = "'DM Sans', system-ui, sans-serif";
const MAXW = 1180;

/* =========================================================================
   DATA
   ========================================================================= */

const PACKAGES = [
    {
        id: 'monthly',
        label: 'Bulanan',
        price: 49000,
        priceLabel: 'Rp 49rb',
        period: '/ bulan',
        tag: null,
        desc: 'Cocok dicoba dulu untuk kebutuhan event atau pelatihan sesekali.',
    },
    {
        id: 'yearly',
        label: 'Tahunan',
        price: 299000,
        priceLabel: 'Rp 299rb',
        period: '/ tahun',
        tag: 'PALING LARIS',
        desc: 'Hemat s/d 49% dibanding bulanan. Pilihan terbaik untuk lembaga & institusi aktif.',
    },
    {
        id: 'lifetime',
        label: 'Lifetime',
        price: 599000,
        priceLabel: 'Rp 599rb',
        period: 'sekali bayar',
        tag: 'HEMAT MAKSIMAL',
        desc: 'Bayar sekali, pakai selamanya. Tanpa perpanjangan, tanpa biaya tahunan.',
    },
];

const PAIN_POINTS = [
    { icon: '😩', text: 'Copy-paste nama peserta satu-satu di Word/Canva sampai begadang, padahal pesertanya ratusan.' },
    { icon: '✍️', text: 'Salah ketik nama atau gelar peserta, lalu kena komplain dan harus revisi ulang dari awal.' },
    { icon: '📧', text: 'Kirim sertifikat manual satu-satu ke WhatsApp/email peserta — buang waktu berjam-jam sendiri.' },
    { icon: '🕵️', text: 'Sertifikat gampang dipalsukan atau diedit orang lain karena tidak ada sistem verifikasi keaslian.' },
];

const FEATURES = [
    {
        icon: '🎨',
        title: 'Template Sertifikat Profesional, Tinggal Pakai',
        desc: 'Puluhan desain template siap pakai dan sepenuhnya bisa diedit — warna, logo, font, hingga tata letak — sesuai identitas acara atau lembagamu.',
    },
    {
        icon: '⚡',
        title: 'Generate Ratusan Sertifikat dalam Hitungan Menit',
        desc: 'Import daftar nama peserta, klik generate, dan ratusan sertifikat langsung jadi otomatis — tanpa copy-paste manual satu per satu.',
    },
    {
        icon: '📧',
        title: 'Kirim Massal via Gmail Sekali Klik',
        desc: 'Kirim ratusan sertifikat ke masing-masing peserta sesuai nama dan email mereka hanya dengan sekali klik, langsung dari aplikasi.',
    },
    {
        icon: '👁️',
        title: 'Preview Sebelum Generate',
        desc: 'Lihat dulu hasil jadi sertifikat sebelum diproses massal, supaya kamu yakin desain dan datanya sudah pas untuk semua peserta.',
    },
    {
        icon: '🔍',
        title: 'Fitur Barcode Cek Keaslian Sertifikat',
        desc: 'Setiap sertifikat dilengkapi barcode unik agar penerima maupun pihak lain bisa memverifikasi keasliannya kapan saja.',
    },
    {
        icon: '🔢',
        title: 'Nomor Urut Sertifikat Otomatis',
        desc: 'Setiap sertifikat mendapat nomor urut otomatis dan rapi, memudahkan pengarsipan serta pelacakan data peserta.',
    },
    {
        icon: '🔄',
        title: 'Export & Import Template Instan',
        desc: 'Simpan ratusan desain template favoritmu dan pindahkan ke perangkat lain secara instan, tanpa perlu desain ulang dari nol.',
    },
];

const HOW_IT_WORKS = [
    { step: '01', title: 'Pilih atau Buat Template', desc: 'Pakai template profesional siap jadi, atau edit sendiri logo, warna, dan tata letaknya sesuai kebutuhan acara.' },
    { step: '02', title: 'Import Data Peserta', desc: 'Masukkan daftar nama dan email peserta — bisa ratusan sekaligus, tanpa isi satu-satu secara manual.' },
    { step: '03', title: 'Preview Hasil Sertifikat', desc: 'Cek dulu tampilan jadi sertifikat sebelum diproses massal, supaya hasilnya pasti sesuai sebelum dikirim ke peserta.' },
    { step: '04', title: 'Generate Sekali Klik', desc: 'Klik generate, dan ratusan sertifikat lengkap dengan nomor urut serta barcode keaslian langsung jadi otomatis dalam hitungan menit.' },
    { step: '05', title: 'Kirim Otomatis via Email', desc: 'Kirim seluruh sertifikat ke email masing-masing peserta sekali klik lewat Gmail — tidak perlu drag-drop satu per satu lagi.' },
];

const TESTIMONIALS = [
    { name: 'Ratna Kusumawati', city: 'Semarang', initials: 'RK', quote: 'Dulu bikin sertifikat 300 peserta workshop bisa 2 hari penuh. Sekarang generate + kirim email semua peserta selesai dalam satu sore.' },
    { name: 'Bayu Setiawan', city: 'Yogyakarta', initials: 'BS', quote: 'Fitur barcode-nya bikin peserta pelatihan kami lebih percaya, karena sertifikatnya bisa dicek keasliannya, tidak sekadar PDF biasa.' },
    { name: 'Dewi Anggraini', city: 'Surabaya', initials: 'DA', quote: 'Sebagai admin kampus yang tiap semester keluarin ratusan sertifikat seminar, aplikasi ini benar-benar menyelamatkan waktu saya.' },
    { name: 'Hendra Wijaya', city: 'Bandung', initials: 'HW', quote: 'Nomor urut dan pengiriman email otomatisnya paling saya suka. Tidak ada lagi peserta yang komplain belum terima sertifikat.' },
];

const FAQS = [
    { q: 'Aplikasi ini jenis aplikasi apa? Bisa dipakai di mana saja?', a: 'CertGenPro adalah aplikasi desktop (bukan aplikasi berbasis web/online), khusus untuk sistem operasi Windows 10 dan Windows 11 (64-bit) yang sudah teruji stabil. Belum tersedia untuk macOS atau Linux.' },
    { q: 'Apakah aplikasi ini butuh internet terus-menerus?', a: 'Tidak. Membuat template, mengimpor data peserta, generate sertifikat massal, preview, hingga fitur barcode dan nomor urut semuanya bisa dipakai secara offline. Internet hanya dibutuhkan saat kamu menggunakan fitur kirim email massal ke peserta.' },
    { q: 'Bagaimana cara saya menerima lisensi setelah membeli?', a: 'Setelah pembayaran berhasil, kode lisensi akan otomatis dikirim ke dua tempat sekaligus: nomor WhatsApp dan alamat email yang kamu daftarkan di form pembelian.' },
    { q: 'Format nomor WhatsApp yang benar seperti apa?', a: 'Gunakan format 08xxxxxxxxxx — diawali angka 0, TANPA kode negara +62 — karena format +62 sering membingungkan dan berisiko salah kirim. Contoh yang benar: 081234567890.' },
    { q: 'Bisa generate berapa banyak sertifikat sekaligus?', a: 'Bisa ratusan sertifikat dalam hitungan menit. Kamu tinggal import daftar nama dan email peserta, lalu klik generate — semuanya diproses otomatis oleh aplikasi.' },
    { q: 'Apakah sertifikat bisa dikirim otomatis ke peserta?', a: 'Bisa. Ratusan sertifikat bisa dikirim langsung ke email masing-masing peserta sesuai nama dan alamat emailnya, hanya dengan sekali klik lewat Gmail — tidak perlu kirim satu per satu secara manual.' },
    { q: 'Apakah ada cara untuk mengecek keaslian sertifikat?', a: 'Ada. Setiap sertifikat dilengkapi fitur barcode unik dan nomor urut otomatis, sehingga keasliannya bisa diverifikasi kapan saja dan tidak mudah dipalsukan.' },
    { q: 'Bisa pakai desain template sendiri, bukan cuma template bawaan?', a: 'Bisa. Kamu bisa membuat, mengedit, lalu export dan import ratusan template sertifikat profesionalmu sendiri secara instan, kapan pun dibutuhkan.' },
    { q: 'Bagaimana kalau lisensi saya sudah mau habis masa aktifnya?', a: 'Kamu bisa memperpanjang kapan saja melalui halaman renew (segera tersedia), pilih durasi paket yang diinginkan, lalu selesaikan pembayaran seperti pembelian pertama.' },
    { q: 'Apakah lisensi bisa dipindah ke perangkat lain?', a: 'Setiap lisensi bersifat Personal Use dan mengikat ke aplikasi yang terpasang di perangkatmu, sesuai kode lisensi yang kamu terima via WhatsApp dan email.' },
];

/* =========================================================================
   HOOKS
   ========================================================================= */

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

// Social proof: mencoba ambil data pembelian terbaru dari API sendiri.
// Kalau endpoint belum ada / gagal, fallback ke data dummy di bawah.
const SOCIAL_PROOF_ENDPOINT = '/api/social-proof/recent';
const SOCIAL_PROOF_FALLBACK = [
    { name: 'Putri', city: 'Semarang', status: 'Baru saja membeli lisensi Tahunan' },
    { name: 'Andika', city: 'Jakarta', status: 'Baru saja membeli lisensi Lifetime' },
    { name: 'Melati', city: 'Malang', status: 'Baru saja membeli lisensi Bulanan' },
    { name: 'Fikri', city: 'Denpasar', status: 'Baru saja membeli lisensi Tahunan' },
];

function useSocialProof() {
    const [items, setItems] = useState(SOCIAL_PROOF_FALLBACK);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        let cancelled = false;
        fetch(SOCIAL_PROOF_ENDPOINT)
            .then((res) => (res.ok ? res.json() : Promise.reject()))
            .then((data) => {
                if (!cancelled && Array.isArray(data) && data.length > 0) {
                    setItems(data);
                }
            })
            .catch(() => {
                // Endpoint belum tersedia / gagal — tetap pakai fallback dummy.
            });
        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((i) => (i + 1) % items.length);
        }, 4000);
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
    const [mobileOpen, setMobileOpen] = useState(false);
    const navScrolled = useNavScroll();

    // ================= LOGIC PEMBELIAN — JANGAN DIUBAH =================
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
                    onSuccess: () => {
                        window.location.href = `/thankyou?license_key=${data.license_key}`;
                    },
                    onPending: () => {
                        setMessage('Pembayaran tertunda. Selesaikan pembayaran untuk menerima lisensi.');
                    },
                    onError: () => {
                        window.location.href = '/failed';
                    },
                    onClose: () => {
                        setMessage('Popup pembayaran ditutup.');
                    },
                });
            }
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }
    // ================= END LOGIC PEMBELIAN =================

    const scrollTo = useCallback((id) => {
        setMobileOpen(false);
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, []);

    return (
        <>
            <Head>
                <title>CertGenPro — Buat & Kirim Sertifikat Digital Massal Otomatis</title>
                <meta
                    name="description"
                    content="CertGenPro adalah aplikasi desktop untuk membuat ratusan sertifikat digital dalam hitungan menit, lengkap dengan barcode keaslian, nomor urut otomatis, dan pengiriman massal via email. Mulai dari Rp 49rb/bulan."
                />
                <meta name="keywords" content="aplikasi sertifikat digital, generate sertifikat massal, aplikasi buat sertifikat otomatis, sertifikat barcode, kirim sertifikat email massal, aplikasi sertifikat pelatihan" />
                <meta property="og:title" content="CertGenPro — Buat & Kirim Sertifikat Digital Massal Otomatis" />
                <meta property="og:description" content="Generate ratusan sertifikat digital dalam hitungan menit, lengkap barcode keaslian & kirim otomatis via email." />
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
                            name: 'CertGenPro',
                            description:
                                'Aplikasi desktop untuk membuat dan mengirim sertifikat digital secara massal, lengkap dengan barcode keaslian dan nomor urut otomatis.',
                            applicationCategory: 'BusinessApplication',
                            operatingSystem: 'Windows 10, Windows 11',
                            offers: { '@type': 'Offer', price: '49000', priceCurrency: 'IDR' },
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
                <Navbar scrolled={navScrolled} scrollTo={scrollTo} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
                <main>
                    <HeroSection scrollTo={scrollTo} />
                    <SocialProofBar />
                    <CompatBar />
                    <PainSection />
                    <FeaturesSection />
                    <HowItWorksSection />
                    <MidCTASection scrollTo={scrollTo} />
                    <TestimonialsSection />
                    <PricingPurchaseSection
                        form={form}
                        setForm={setForm}
                        loading={loading}
                        message={message}
                        handleSubmit={handleSubmit}
                    />
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

function Navbar({ scrolled, scrollTo, mobileOpen, setMobileOpen }) {
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
                background: scrolled ? 'rgba(8,13,26,0.92)' : 'transparent',
                backdropFilter: scrolled ? 'blur(10px)' : 'none',
                borderBottom: scrolled ? `1px solid ${COLOR.border}` : '1px solid transparent',
                transition: 'all 0.3s ease',
            }}
        >
            <div style={{ maxWidth: MAXW, margin: '0 auto', padding: '0 20px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 17, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>📜</span> CertGenPro
                </div>
                <nav style={{ display: 'none', gap: 28, alignItems: 'center' }} className="desktop-nav">
                    {navItems.map((item) => (
                        <a
                            key={item.id}
                            onClick={() => scrollTo(item.id)}
                            style={{ color: COLOR.textMuted, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button
                        onClick={() => scrollTo('beli')}
                        style={{
                            background: COLOR.accent, color: '#fff', border: 'none', padding: '9px 18px',
                            borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: FONT_BODY,
                        }}
                    >
                        Beli Sekarang
                    </button>
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="mobile-toggle"
                        style={{
                            display: 'inline-flex', background: 'none', border: `1px solid ${COLOR.border}`,
                            color: COLOR.text, borderRadius: 8, padding: '8px 10px', cursor: 'pointer', fontSize: 14,
                        }}
                    >
                        ☰
                    </button>
                </div>
            </div>
            {mobileOpen && (
                <div style={{ background: COLOR.bgElevated, borderTop: `1px solid ${COLOR.border}`, padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 4 }} className="mobile-nav">
                    {navItems.map((item) => (
                        <a key={item.id} onClick={() => scrollTo(item.id)} style={{ padding: '10px 0', color: COLOR.textMuted, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                            {item.label}
                        </a>
                    ))}
                </div>
            )}
            <style jsx>{`
                @media (min-width: 860px) {
                    .desktop-nav { display: flex !important; }
                    .mobile-toggle { display: none !important; }
                }
            `}</style>
        </header>
    );
}

/* =========================================================================
   HERO
   ========================================================================= */

function HeroSection({ scrollTo }) {
    return (
        <section style={{ padding: '140px 20px 70px', background: `radial-gradient(ellipse at top, rgba(37,99,235,0.16), transparent 60%)` }}>
            <div style={{ maxWidth: MAXW, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr', gap: 46, alignItems: 'center' }} className="hero-grid">
                <div style={{ textAlign: 'center' }} className="hero-copy">
                    <span
                        style={{
                            background: '#132038', color: COLOR.accentSoft, fontSize: 11, fontWeight: 700,
                            padding: '5px 12px', borderRadius: 20, letterSpacing: '0.05em', display: 'inline-block', marginBottom: 20,
                        }}
                    >
                        UNTUK PANITIA EVENT, LEMBAGA PELATIHAN & KAMPUS
                    </span>
                    <h1 style={{ fontFamily: FONT_HEAD, fontSize: 'clamp(26px, 4.6vw, 46px)', fontWeight: 800, lineHeight: 1.2, margin: '0 auto 20px', maxWidth: 820 }}>
                        Masih Begadang Bikin Sertifikat Satu-Satu di Word/Canva untuk Ratusan Peserta?
                    </h1>
                    <p style={{ color: COLOR.textMuted, fontSize: 16, lineHeight: 1.7, maxWidth: 640, margin: '0 auto 28px' }}>
                        Copy-paste nama peserta satu-satu, kirim manual ke WhatsApp atau email satu per satu, lalu masih
                        was-was sertifikatnya dipalsukan orang lain. <strong style={{ color: COLOR.text }}>CertGenPro</strong> bikin
                        ratusan sertifikat jadi dan terkirim otomatis — cukup hitungan menit, bukan berhari-hari.
                    </p>
                    <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => scrollTo('beli')}
                            style={{
                                background: COLOR.accent, color: '#fff', border: 'none', padding: '16px 30px', borderRadius: 10,
                                fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: FONT_BODY,
                                boxShadow: '0 8px 25px rgba(37,99,235,0.35)',
                            }}
                        >
                            🚀 Buat Sertifikat Massal Sekarang
                        </button>
                        <button
                            onClick={() => scrollTo('fitur')}
                            style={{
                                background: 'transparent', color: COLOR.text, border: `1px solid ${COLOR.border}`,
                                padding: '16px 26px', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: FONT_BODY,
                            }}
                        >
                            Lihat Semua Fitur
                        </button>
                    </div>
                    <p style={{ marginTop: 16, fontSize: 12.5, color: COLOR.textFaint }}>
                        Mulai dari Rp 49rb/bulan &nbsp;·&nbsp; Lisensi langsung dikirim via WhatsApp &amp; Email
                    </p>
                </div>
                <HeroMockup />
            </div>
            <style jsx>{`
                @media (min-width: 900px) {
                    .hero-grid { grid-template-columns: 1.05fr 0.95fr !important; text-align: left; }
                    .hero-copy { text-align: left !important; }
                    .hero-copy h1, .hero-copy p { margin-left: 0 !important; margin-right: 0 !important; }
                    .hero-copy > div { justify-content: flex-start !important; }
                }
            `}</style>
        </section>
    );
}

// Mockup visual sertifikat murni CSS/SVG — tidak butuh file screenshot asli.
function HeroMockup() {
    return (
        <div style={{ position: 'relative' }}>
            <div
                style={{
                    background: COLOR.bgCard, border: `1px solid ${COLOR.border}`, borderRadius: 18, padding: 22,
                    boxShadow: '0 30px 70px rgba(0,0,0,0.45)',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} />
                    <span style={{ fontSize: 11, color: COLOR.textFaint, marginLeft: 8 }}>CertGenPro — Batch Generate</span>
                </div>
                <div
                    style={{
                        background: `linear-gradient(135deg, #0e1a35, #0a1224)`, border: `1.5px solid ${COLOR.accent}`,
                        borderRadius: 12, padding: '26px 20px', textAlign: 'center', position: 'relative', overflow: 'hidden',
                    }}
                >
                    <div style={{ position: 'absolute', inset: 0, border: `1px solid rgba(96,165,250,0.25)`, margin: 8, borderRadius: 8, pointerEvents: 'none' }} />
                    <div style={{ fontSize: 10, letterSpacing: '0.2em', color: COLOR.accentSoft, fontWeight: 700 }}>SERTIFIKAT PENGHARGAAN</div>
                    <div style={{ fontFamily: FONT_HEAD, fontSize: 19, fontWeight: 800, margin: '10px 0 4px', color: '#fff' }}>Nama Peserta</div>
                    <div style={{ fontSize: 11, color: COLOR.textMuted, marginBottom: 14 }}>telah menyelesaikan pelatihan dengan baik</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 10 }}>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontSize: 8.5, color: COLOR.textFaint }}>NO. SERTIFIKAT</div>
                            <div style={{ fontSize: 10.5, fontWeight: 700, color: COLOR.text }}>CGP-0421</div>
                        </div>
                        <div
                            style={{
                                width: 30, height: 30, borderRadius: 6, background: 'repeating-linear-gradient(90deg, #cbd5e1 0 2px, transparent 2px 4px)',
                                border: '1px solid #cbd5e1',
                            }}
                            title="Barcode keaslian"
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                    <div style={{ flex: 1, background: COLOR.bgElevated, border: `1px solid ${COLOR.border}`, borderRadius: 8, padding: '10px 12px' }}>
                        <div style={{ fontSize: 10, color: COLOR.textFaint }}>Diproses</div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: COLOR.accentSoft }}>248 / 250</div>
                    </div>
                    <div style={{ flex: 1, background: COLOR.bgElevated, border: `1px solid ${COLOR.border}`, borderRadius: 8, padding: '10px 12px' }}>
                        <div style={{ fontSize: 10, color: COLOR.textFaint }}>Terkirim Email</div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: COLOR.accentSoft }}>✓ Otomatis</div>
                    </div>
                </div>
            </div>
            <div
                style={{
                    position: 'absolute', bottom: -16, left: -16, background: COLOR.accent, color: '#fff',
                    padding: '9px 14px', borderRadius: 10, fontSize: 11.5, fontWeight: 700, boxShadow: '0 10px 25px rgba(37,99,235,0.4)',
                }}
            >
                ⚡ Ratusan sertifikat, hitungan menit
            </div>
        </div>
    );
}

/* =========================================================================
   SOCIAL PROOF BAR (rotating ticker)
   ========================================================================= */

function SocialProofBar() {
    const current = useSocialProof();
    return (
        <div style={{ background: COLOR.bgElevated, borderTop: `1px solid ${COLOR.border}`, borderBottom: `1px solid ${COLOR.border}`, padding: '12px 20px' }}>
            <div style={{ maxWidth: MAXW, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 12.5, color: COLOR.textMuted, flexWrap: 'wrap', textAlign: 'center' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block', flexShrink: 0 }} />
                <span>
                    <strong style={{ color: COLOR.text }}>{current.name}</strong> dari {current.city} — {current.status}
                </span>
            </div>
        </div>
    );
}

/* =========================================================================
   COMPATIBILITY / EXPECTATION BAR
   ========================================================================= */

function CompatBar() {
    const items = [
        { icon: '🖥️', text: 'Aplikasi Desktop, khusus Windows 10 & 11 (64-bit)' },
        { icon: '📴', text: 'Bisa dipakai Offline (internet hanya untuk kirim email massal)' },
        { icon: '📲', text: 'Lisensi otomatis dikirim via WhatsApp & Email' },
    ];
    return (
        <div style={{ padding: '22px 20px', borderBottom: `1px solid ${COLOR.border}` }}>
            <div style={{ maxWidth: MAXW, margin: '0 auto', display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
                {items.map((it) => (
                    <div key={it.text} style={{ display: 'flex', alignItems: 'center', gap: 8, background: COLOR.bgCard, border: `1px solid ${COLOR.border}`, borderRadius: 10, padding: '8px 14px', fontSize: 12.5, color: COLOR.textMuted }}>
                        <span>{it.icon}</span> {it.text}
                    </div>
                ))}
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
            <div style={{ maxWidth: 840, margin: '0 auto' }}>
                <h2 style={h2Style}>Bikin sertifikat manual itu... capek, kan?</h2>
                <p style={{ textAlign: 'center', color: COLOR.textMuted, marginBottom: 36, fontSize: 14.5 }}>
                    Kalau salah satu ini kerasa familiar, kamu jelas butuh cara yang lebih cepat.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14 }} className="pain-grid">
                    {PAIN_POINTS.map((p) => (
                        <div key={p.text} style={{ display: 'flex', gap: 14, background: COLOR.bgCard, border: `1px solid ${COLOR.border}`, borderRadius: 12, padding: '18px 20px', alignItems: 'flex-start' }}>
                            <span style={{ fontSize: 22, flexShrink: 0 }}>{p.icon}</span>
                            <span style={{ fontSize: 14, color: COLOR.textMuted, lineHeight: 1.6 }}>{p.text}</span>
                        </div>
                    ))}
                </div>
                <p style={{ textAlign: 'center', marginTop: 30, fontSize: 15, color: COLOR.text, fontWeight: 700 }}>
                    CertGenPro menyelesaikan semua itu — otomatis, rapi, dan aman.
                </p>
            </div>
            <style jsx>{`
                @media (min-width: 700px) {
                    .pain-grid { grid-template-columns: 1fr 1fr !important; }
                }
            `}</style>
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
                <h2 style={h2Style}>Semua yang kamu butuh untuk sertifikat massal</h2>
                <p style={{ textAlign: 'center', color: COLOR.textMuted, marginBottom: 44, fontSize: 14.5 }}>
                    Dari desain sampai terkirim ke peserta, semua dalam satu aplikasi.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 18 }} className="feature-grid">
                    {FEATURES.map((f) => (
                        <div key={f.title} style={{ background: COLOR.bgCard, border: `1px solid ${COLOR.border}`, borderRadius: 14, padding: '24px 22px' }}>
                            <div style={{ fontSize: 26, marginBottom: 12 }}>{f.icon}</div>
                            <h3 style={{ fontFamily: FONT_HEAD, fontSize: 15.5, fontWeight: 700, marginBottom: 8, color: COLOR.text }}>{f.title}</h3>
                            <p style={{ fontSize: 13.5, color: COLOR.textMuted, lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
            <style jsx>{`
                @media (min-width: 700px) {
                    .feature-grid { grid-template-columns: 1fr 1fr !important; }
                }
                @media (min-width: 1000px) {
                    .feature-grid { grid-template-columns: 1fr 1fr 1fr !important; }
                }
            `}</style>
        </section>
    );
}

/* =========================================================================
   HOW IT WORKS
   ========================================================================= */

function HowItWorksSection() {
    const [ref, visible] = useReveal();
    return (
        <section id="cara-kerja" ref={ref} style={fadeStyle(visible, { padding: '80px 20px' })}>
            <div style={{ maxWidth: 840, margin: '0 auto' }}>
                <h2 style={h2Style}>Cara Kerja CertGenPro</h2>
                <p style={{ textAlign: 'center', color: COLOR.textMuted, marginBottom: 44, fontSize: 14.5 }}>
                    5 langkah, dari data peserta sampai sertifikat terkirim.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {HOW_IT_WORKS.map((s, i) => (
                        <div key={s.step} style={{ display: 'flex', gap: 20, paddingBottom: i < HOW_IT_WORKS.length - 1 ? 28 : 0, position: 'relative' }}>
                            {i < HOW_IT_WORKS.length - 1 && (
                                <div style={{ position: 'absolute', left: 21, top: 44, bottom: 0, width: 2, background: COLOR.border }} />
                            )}
                            <div
                                style={{
                                    width: 44, height: 44, borderRadius: '50%', background: COLOR.accent, color: '#fff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_HEAD,
                                    fontWeight: 800, fontSize: 14, flexShrink: 0, zIndex: 1,
                                }}
                            >
                                {s.step}
                            </div>
                            <div style={{ paddingTop: 6 }}>
                                <h3 style={{ fontFamily: FONT_HEAD, fontSize: 15.5, fontWeight: 700, marginBottom: 6, color: COLOR.text }}>{s.title}</h3>
                                <p style={{ fontSize: 13.5, color: COLOR.textMuted, lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* =========================================================================
   MID CTA
   ========================================================================= */

function MidCTASection({ scrollTo }) {
    return (
        <section style={{ padding: '50px 20px', background: `linear-gradient(135deg, ${COLOR.accentDark}, ${COLOR.accent})` }}>
            <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', gap: 20, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', textAlign: 'center' }} className="mid-cta">
                <div style={{ textAlign: 'left', flex: 1, minWidth: 240 }} className="mid-cta-text">
                    <h3 style={{ fontFamily: FONT_HEAD, fontSize: 19, fontWeight: 800, color: '#fff', margin: '0 0 6px' }}>
                        Kenapa masih bikin sertifikat satu-satu?
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13.5, margin: 0 }}>
                        Coba CertGenPro dan generate ratusan sertifikat sekaligus, hari ini juga.
                    </p>
                </div>
                <button
                    onClick={() => scrollTo('beli')}
                    style={{
                        background: '#fff', color: COLOR.accentDark, border: 'none', padding: '14px 26px', borderRadius: 10,
                        fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: FONT_BODY, flexShrink: 0,
                    }}
                >
                    Lihat Paket Harga →
                </button>
            </div>
            <style jsx>{`
                @media (max-width: 600px) {
                    .mid-cta-text { text-align: center !important; }
                }
            `}</style>
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
                <h2 style={h2Style}>Dipercaya panitia event & lembaga pelatihan</h2>
                <p style={{ textAlign: 'center', color: COLOR.textMuted, marginBottom: 44, fontSize: 14.5 }}>
                    Cerita nyata dari pengguna CertGenPro.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 18 }} className="testi-grid">
                    {TESTIMONIALS.map((t) => (
                        <div key={t.name} style={{ background: COLOR.bgCard, border: `1px solid ${COLOR.border}`, borderRadius: 14, padding: '22px 20px' }}>
                            <p style={{ fontSize: 13.5, color: COLOR.textMuted, lineHeight: 1.7, marginBottom: 16 }}>&ldquo;{t.quote}&rdquo;</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 36, height: 36, borderRadius: '50%', background: COLOR.accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, fontFamily: FONT_HEAD, flexShrink: 0 }}>
                                    {t.initials}
                                </div>
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: COLOR.text }}>{t.name}</div>
                                    <div style={{ fontSize: 11.5, color: COLOR.textFaint }}>{t.city}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <style jsx>{`
                @media (min-width: 700px) {
                    .testi-grid { grid-template-columns: 1fr 1fr !important; }
                }
            `}</style>
        </section>
    );
}

/* =========================================================================
   PRICING + PURCHASE SECTION (gabungan — 1 CTA akhir alur beli)
   ========================================================================= */

function PricingPurchaseSection({ form, setForm, loading, message, handleSubmit }) {
    const [ref, visible] = useReveal();
    const selected = PACKAGES.find((p) => p.id === form.package_type) || PACKAGES[1];

    return (
        <section id="beli" ref={ref} style={fadeStyle(visible, { padding: '80px 20px' })}>
            <div style={{ maxWidth: MAXW, margin: '0 auto' }}>
                <h2 style={h2Style}>Pilih Paket Lisensi CertGenPro</h2>
                <p style={{ textAlign: 'center', color: COLOR.textMuted, marginBottom: 40, fontSize: 14.5 }}>
                    Semua paket dapat akses fitur lengkap. Tinggal pilih durasi yang paling cocok.
                </p>

                {/* Kartu paket */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16, maxWidth: 980, margin: '0 auto 44px' }} className="pkg-grid">
                    {PACKAGES.map((pkg) => {
                        const isSelected = form.package_type === pkg.id;
                        return (
                            <button
                                key={pkg.id}
                                type="button"
                                onClick={() => setForm({ ...form, package_type: pkg.id })}
                                style={{
                                    textAlign: 'left', cursor: 'pointer', fontFamily: FONT_BODY,
                                    background: isSelected ? 'rgba(37,99,235,0.1)' : COLOR.bgCard,
                                    border: isSelected ? `2px solid ${COLOR.accent}` : `1px solid ${COLOR.border}`,
                                    borderRadius: 14, padding: '22px 20px', position: 'relative',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                {pkg.tag && (
                                    <span
                                        style={{
                                            position: 'absolute', top: -11, left: 20, background: COLOR.accent, color: '#fff',
                                            fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 20, letterSpacing: '0.03em',
                                        }}
                                    >
                                        {pkg.tag}
                                    </span>
                                )}
                                <div style={{ fontSize: 13, fontWeight: 700, color: COLOR.textMuted, marginBottom: 6 }}>{pkg.label}</div>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 10 }}>
                                    <span style={{ fontSize: 26, fontWeight: 800, fontFamily: FONT_HEAD, color: COLOR.text }}>{pkg.priceLabel}</span>
                                    <span style={{ fontSize: 12.5, color: COLOR.textFaint }}>{pkg.period}</span>
                                </div>
                                <p style={{ fontSize: 12.5, color: COLOR.textMuted, lineHeight: 1.6, margin: 0 }}>{pkg.desc}</p>
                                <div
                                    style={{
                                        marginTop: 14, fontSize: 12, fontWeight: 700,
                                        color: isSelected ? COLOR.accentSoft : COLOR.textFaint,
                                    }}
                                >
                                    {isSelected ? '✓ Terpilih' : 'Pilih paket ini'}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Form pembelian */}
                <div style={{ maxWidth: 460, margin: '0 auto' }}>
                    <main style={cardStyle}>
                        <div style={{ textAlign: 'center', marginBottom: 24 }}>
                            <span style={badgeStyle}>PAKET {selected.label.toUpperCase()}</span>
                            <h1 style={titleStyle}>📜 CertGenPro</h1>
                            <p style={subtitleStyle}>Buat &amp; kirim sertifikat digital massal secara otomatis.</p>
                        </div>

                        <div style={pricingCardStyle}>
                            <h3 style={{ margin: 0, color: COLOR.accentSoft, fontSize: 13, letterSpacing: '0.05em' }}>PAKET DIPILIH</h3>
                            <h2 style={{ margin: '8px 0', fontSize: 22, fontWeight: 'bold' }}>Lisensi {selected.label}</h2>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '10px 0' }}>
                                <span style={{ fontSize: 30, fontWeight: 'bold', color: '#fff' }}>{selected.priceLabel}</span>
                                <span style={{ color: '#94a3b8', fontSize: 13 }}>{selected.period}</span>
                            </div>
                            <p style={{ color: '#94a3b8', fontSize: 12.5, margin: 0, lineHeight: '1.5' }}>{selected.desc}</p>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                                <label style={labelStyle}>Alamat Email</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="nama@email.com"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    style={inputStyle}
                                />
                                <p style={hintStyle}>Lisensi akan dikirim ke email ini.</p>
                            </div>

                            <div>
                                <label style={labelStyle}>Nomor WhatsApp (format: 08xxxxxxxxxx)</label>
                                <input
                                    type="tel"
                                    required
                                    inputMode="numeric"
                                    pattern="0[0-9]{9,13}"
                                    placeholder="081234567890"
                                    value={form.whatsapp}
                                    onChange={(e) => setForm({ ...form, whatsapp: e.target.value.replace(/[^0-9]/g, '') })}
                                    style={inputStyle}
                                />
                                <p style={hintStyle}>Awali angka 0, tanpa +62 — supaya lisensi tidak salah kirim.</p>
                            </div>

                            <div>
                                <label style={labelStyle}>Kode Kupon (Opsional)</label>
                                <input
                                    type="text"
                                    placeholder="MASUKKAN_KODE_DISINI"
                                    value={form.coupon_code}
                                    onChange={(e) => setForm({ ...form, coupon_code: e.target.value })}
                                    style={inputStyle}
                                />
                            </div>

                            <button type="submit" disabled={loading} style={buttonStyle}>
                                {loading ? 'Memproses...' : `Bayar ${selected.priceLabel} & Aktifkan Lisensi ⚡`}
                            </button>
                            <p style={{ textAlign: 'center', fontSize: 11.5, color: '#64748b', margin: 0 }}>
                                ✓ Lisensi otomatis via WhatsApp &amp; Email &nbsp;·&nbsp; ✓ Barcode keaslian &nbsp;·&nbsp; ✓ Free update
                            </p>
                        </form>

                        {message && <p style={messageStyle}>{message}</p>}

                        <p style={{ textAlign: 'center', fontSize: 12, color: COLOR.textFaint, marginTop: 18 }}>
                            Ada pertanyaan sebelum membeli?{' '}
                            <a
                                href={WHATSAPP_LINK('Halo Admin, saya ingin bertanya tentang CertGenPro sebelum membeli.')}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: COLOR.accentSoft, fontWeight: 700, textDecoration: 'none' }}
                            >
                                💬 Chat Admin via WhatsApp
                            </a>
                        </p>
                    </main>
                </div>
            </div>
            <style jsx>{`
                @media (min-width: 860px) {
                    .pkg-grid { grid-template-columns: 1fr 1fr 1fr !important; }
                }
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
                <h2 style={{ ...h2Style, textAlign: 'center', marginBottom: 36 }}>Pertanyaan yang sering ditanya</h2>
                {FAQS.map((faq, i) => (
                    <div key={faq.q} style={{ borderBottom: `1px solid ${COLOR.border}` }}>
                        <button
                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                            style={{
                                width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '20px 0',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, cursor: 'pointer',
                                fontFamily: FONT_BODY, fontWeight: 700, fontSize: 14, color: COLOR.text,
                            }}
                        >
                            {faq.q}
                            <span style={{ color: COLOR.accentSoft, fontSize: 20, transform: openFaq === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s', flexShrink: 0 }}>
                                +
                            </span>
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
   FINAL CTA
   ========================================================================= */

function FinalCTASection({ scrollTo }) {
    return (
        <section style={{ padding: '80px 20px', textAlign: 'center' }}>
            <div style={{ maxWidth: 620, margin: '0 auto' }}>
                <h2 style={h2Style}>Berhenti bikin sertifikat manual mulai hari ini</h2>
                <p style={{ color: COLOR.textMuted, marginBottom: 28 }}>
                    Ratusan sertifikat, siap terkirim ke peserta, tanpa begadang.
                </p>
                <button
                    onClick={() => scrollTo('beli')}
                    style={{
                        background: COLOR.accent, color: '#fff', border: 'none', padding: '16px 34px', borderRadius: 10,
                        fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: FONT_BODY, boxShadow: '0 8px 25px rgba(37,99,235,0.35)',
                    }}
                >
                    🚀 Miliki Lisensi CertGenPro Sekarang
                </button>
                <p style={{ marginTop: 14, fontSize: 12, color: COLOR.textFaint }}>
                    ✓ Lisensi otomatis WhatsApp &amp; Email &nbsp;·&nbsp; ✓ Barcode keaslian &nbsp;·&nbsp; ✓ Free update aplikasi
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
            <div
                style={{
                    maxWidth: MAXW, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 20,
                    justifyContent: 'space-between', alignItems: 'center', fontSize: 12.5, color: COLOR.textFaint,
                }}
            >
                <div style={{ fontFamily: FONT_HEAD, fontWeight: 700, color: COLOR.textMuted }}>📜 CertGenPro</div>
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                    <a href="#" style={{ color: COLOR.textFaint }}>Tentang</a>
                    <a href="#" style={{ color: COLOR.textFaint }}>Kebijakan Privasi</a>
                    <a href="/terms" style={{ color: COLOR.textFaint }}>Syarat &amp; Ketentuan</a>
                    <a href="/renew" style={{ color: COLOR.textFaint }}>Perpanjang Lisensi</a>
                    <a
                        href={WHATSAPP_LINK('Halo Admin, saya ingin bertanya tentang CertGenPro.')}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: COLOR.textFaint }}
                    >
                        Kontak ({WHATSAPP_DISPLAY})
                    </a>
                </div>
                <div>© {new Date().getFullYear()} CertGenPro. Semua hak dilindungi.</div>
            </div>
        </footer>
    );
}

/* =========================================================================
   HELPERS
   ========================================================================= */

const h2Style = { fontFamily: FONT_HEAD, fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 800, textAlign: 'center', marginBottom: 14, color: COLOR.text };

function fadeStyle(visible, extra) {
    return {
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
        ...extra,
    };
}

/* =========================================================================
   STYLE OBJECTS — form pembelian
   ========================================================================= */
const cardStyle = { background: COLOR.bgCard, border: `1px solid ${COLOR.border}`, padding: '32px 24px', borderRadius: 16, width: '100%', maxWidth: 460, boxSizing: 'border-box' };
const badgeStyle = { background: '#132038', color: COLOR.accentSoft, fontSize: 11, fontWeight: 'bold', padding: '4px 10px', borderRadius: 20, display: 'inline-block', marginBottom: 12 };
const titleStyle = { margin: 0, fontSize: 24, fontWeight: 'bold', color: '#fff' };
const subtitleStyle = { margin: '8px 0 0 0', color: '#94a3b8', fontSize: 13, lineHeight: '1.4' };
const pricingCardStyle = { background: COLOR.bgElevated, border: `1px solid ${COLOR.accent}`, borderRadius: 12, padding: 16, marginBottom: 24, marginTop: 12 };
const labelStyle = { display: 'block', fontSize: 12, fontWeight: 'bold', color: '#94a3b8', marginBottom: 6 };
const inputStyle = { display: 'block', width: '100%', padding: 10, background: COLOR.bgElevated, border: `1px solid ${COLOR.border}`, borderRadius: 8, color: '#fff', fontSize: 13, boxSizing: 'border-box' };
const hintStyle = { fontSize: 11, color: COLOR.textFaint, margin: '5px 2px 0' };
const buttonStyle = { width: '100%', padding: 12, background: COLOR.accent, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', fontSize: 14, transition: '0.2s' };
const messageStyle = { marginTop: 16, padding: 10, background: '#132038', border: `1px solid ${COLOR.border}`, borderRadius: 8, fontSize: 12, color: '#cbd5e1', textAlign: 'center', lineHeight: '1.4' };
