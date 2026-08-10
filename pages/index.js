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
   DESIGN TOKENS — tema terang, dominan biru (profesional & terpercaya)
   ========================================================================= */
const COLOR = {
    bg: '#ffffff',
    bgAlt: '#f5f8ff',
    bgDark: '#0b1730',
    card: '#ffffff',
    border: '#e2e8f0',
    primary: '#1d4ed8',      // biru utama
    primaryDark: '#1e3a8a',
    primaryLight: '#3b82f6',
    accent: '#0ea5e9',
    text: '#0f172a',
    textOnDark: '#f8fafc',
    textMuted: '#475569',
    textFaint: '#94a3b8',
    success: '#16a34a',
    warn: '#f59e0b',
    danger: '#dc2626',
};
const FONT_HEAD = "'Plus Jakarta Sans', system-ui, sans-serif";
const FONT_BODY = "'DM Sans', system-ui, sans-serif";
const MAXW = 1160;

/* =========================================================================
   DATA
   ========================================================================= */

const PAIN_POINTS = [
    'Buat 200 sertifikat satu-satu di Word/Canva? Bisa habis seharian penuh cuma untuk edit nama peserta.',
    'Kirim sertifikat manual lewat email satu per satu — capek, rawan salah kirim ke orang yang salah.',
    'Peserta ragu keaslian sertifikat karena tidak ada cara memverifikasinya.',
    'Sudah punya desain sertifikat bagus, tapi tidak tahu cara menyatukannya dengan data peserta secara massal.',
];

const FEATURES = [
    {
        icon: '🎨',
        title: 'Template Sertifikat Profesional, Tinggal Pakai',
        desc: 'Puluhan template sertifikat siap pakai dan sepenuhnya editable — ganti logo, warna, teks, dan tanda tangan sesuai identitas acara atau institusi Anda.',
    },
    {
        icon: '⚡',
        title: 'Generate Ratusan Sertifikat dalam Hitungan Menit',
        desc: 'Import data peserta, klik generate — ratusan sertifikat dengan nama berbeda langsung jadi tanpa perlu edit satu-satu.',
    },
    {
        icon: '📧',
        title: 'Kirim Massal via Gmail Sekali Klik',
        desc: 'Setiap peserta otomatis menerima sertifikatnya sendiri ke email masing-masing sesuai nama dan alamat email yang terdaftar — cukup satu kali klik untuk ratusan penerima.',
    },
    {
        icon: '👁️',
        title: 'Preview Sebelum Generate',
        desc: 'Lihat dulu hasil akhirnya sebelum diproses massal, jadi tidak ada lagi kesalahan cetak yang baru ketahuan setelah dikirim ke peserta.',
    },
    {
        icon: '🔒',
        title: 'Fitur Barcode Cek Keaslian Sertifikat',
        desc: 'Setiap sertifikat dilengkapi barcode unik sehingga penerima maupun pihak ketiga bisa memverifikasi keasliannya kapan saja.',
    },
    {
        icon: '🔢',
        title: 'Nomor Urut Sertifikat Otomatis',
        desc: 'Sistem penomoran otomatis dan rapi untuk setiap sertifikat yang diterbitkan, memudahkan pengarsipan dan audit.',
    },
    {
        icon: '📦',
        title: 'Export & Import Template Secara Instan',
        desc: 'Simpan ratusan template sertifikat profesional dan pindahkan antar perangkat atau bagikan ke tim dalam hitungan detik.',
    },
];

const HOW_IT_WORKS = [
    {
        step: '01',
        title: 'Import Data Peserta',
        desc: 'Upload daftar nama & email peserta (Excel/CSV), atau input manual langsung di aplikasi.',
    },
    {
        step: '02',
        title: 'Pilih & Sesuaikan Template',
        desc: 'Pilih template sertifikat yang tersedia, sesuaikan logo, warna, dan teks sesuai kebutuhan acara Anda.',
    },
    {
        step: '03',
        title: 'Generate & Kirim Otomatis',
        desc: 'Preview hasilnya, lalu generate ratusan sertifikat sekaligus dan kirim ke email masing-masing peserta hanya dengan satu klik.',
    },
];

const TESTIMONIALS = [
    {
        name: 'Dedi P.',
        role: 'Panitia Webinar Nasional',
        quote: 'Dulu tim saya butuh 2 hari untuk kirim 300 sertifikat peserta webinar. Sekarang selesai kurang dari 1 jam, termasuk kirim emailnya.',
    },
    {
        name: 'Ratna S.',
        role: 'Staff HRD Perusahaan',
        quote: 'Fitur barcode-nya bikin sertifikat pelatihan internal kami jadi lebih kredibel. Peserta bisa cek sendiri keasliannya.',
    },
    {
        name: 'Bimo A.',
        role: 'Pengelola Lembaga Kursus',
        quote: 'Paling suka bagian nomor urut otomatis — dulu sering keliru dobel nomor waktu bikin manual, sekarang tidak pernah lagi.',
    },
];

const PRICING = [
    {
        id: 'monthly',
        label: 'Bulanan',
        duration: '30 Hari',
        price: 49000,
        priceLabel: 'Rp 49.000',
        desc: 'Fleksibel untuk kebutuhan acara musiman.',
        cta: 'Paling Fleksibel',
    },
    {
        id: 'yearly',
        label: 'Tahunan',
        duration: '365 Hari',
        price: 299000,
        priceLabel: 'Rp 299.000',
        desc: 'Pilihan terbaik untuk penggunaan rutin sepanjang tahun.',
        popular: true,
        cta: 'TERBAIK — Hemat',
    },
    {
        id: 'lifetime',
        label: 'Lifetime',
        duration: 'Selamanya',
        price: 599000,
        priceLabel: 'Rp 599.000',
        desc: 'Bayar sekali, pakai selamanya tanpa perpanjangan.',
        cta: 'Akses Selamanya',
    },
];

const FAQ = [
    {
        q: 'Aplikasi ini berjalan di perangkat apa?',
        a: `${APP_NAME} adalah aplikasi desktop untuk Windows, dan sudah teruji stabil di Windows 10 maupun Windows 11.`,
    },
    {
        q: 'Apakah aplikasi ini butuh internet terus-menerus?',
        a: `Tidak. ${APP_NAME} berjalan offline untuk pembuatan template, import data, dan generate sertifikat. Koneksi internet hanya dibutuhkan saat Anda menggunakan fitur kirim email massal ke peserta.`,
    },
    {
        q: 'Bagaimana saya menerima lisensi setelah membeli?',
        a: 'Kode lisensi akan otomatis dikirim ke nomor WhatsApp dan alamat email yang Anda daftarkan pada form pembelian, biasanya hanya dalam hitungan detik setelah pembayaran berhasil.',
    },
    {
        q: 'Format nomor WhatsApp yang benar seperti apa?',
        a: 'Gunakan format 08xxxxxxxxxx (diawali angka 0), tanpa kode +62. Sistem kami akan menyesuaikannya secara otomatis di belakang layar.',
    },
    {
        q: 'Berapa perangkat yang bisa memakai 1 lisensi?',
        a: 'Setiap lisensi terikat ke 1 perangkat (1 lisensi = 1 komputer) untuk menjaga keamanan. Jika perlu memindahkan ke perangkat lain, hubungi admin via WhatsApp.',
    },
    {
        q: 'Apakah bisa membuat template sertifikat sendiri?',
        a: 'Bisa. Selain template siap pakai, Anda juga bisa mengedit dan menyimpan template kustom Anda sendiri, lalu export/import kapan pun dibutuhkan.',
    },
    {
        q: 'Bagaimana cara memperpanjang lisensi yang sudah kedaluwarsa?',
        a: 'Anda bisa memperpanjang langsung melalui halaman Perpanjangan Lisensi menggunakan kode lisensi lama Anda, tanpa perlu install ulang aplikasi.',
    },
    {
        q: 'Apakah ada garansi jika aplikasi tidak bisa dipakai?',
        a: 'Tim kami siap membantu troubleshooting instalasi maupun aktivasi lisensi via WhatsApp. Hubungi admin apabila mengalami kendala teknis.',
    },
];

const SOCIAL_PROOF_ENDPOINT = '/api/social-proof/recent';
const SOCIAL_PROOF_FALLBACK = [
    { name: 'Dedi P.', city: 'Bandung', status: 'Baru saja membeli Paket Tahunan' },
    { name: 'Ratna S.', city: 'Surabaya', status: 'Baru saja membeli Paket Lifetime' },
    { name: 'Bimo A.', city: 'Semarang', status: 'Baru saja membeli Paket Bulanan' },
    { name: 'Wulan T.', city: 'Yogyakarta', status: 'Baru saja membeli Paket Tahunan' },
];

/* =========================================================================
   HELPERS
   ========================================================================= */

// Normalisasi nomor WA dari format lokal 08xxx menjadi 628xxx (dibutuhkan
// Fonnte/Midtrans di belakang layar). User cukup mengisi 08xxx tanpa +62.
function normalizeWhatsApp(raw) {
    let digits = (raw || '').replace(/[^0-9]/g, '');
    if (!digits) return '';
    if (digits.startsWith('0')) digits = '62' + digits.slice(1);
    else if (!digits.startsWith('62')) digits = '62' + digits;
    return digits;
}

function formatRupiah(n) {
    return 'Rp ' + n.toLocaleString('id-ID');
}

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
        return () => {
            cancelled = true;
        };
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
    const [mobileOpen, setMobileOpen] = useState(false);
    const navScrolled = useNavScroll();

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const payload = { app_id: APP_ID, ...form, whatsapp: normalizeWhatsApp(form.whatsapp) };
            const res = await fetch('/api/payment/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
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

    const scrollTo = useCallback((id) => {
        setMobileOpen(false);
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, []);

    return (
        <>
            <Head>
                <title>CertGen Pro — Buat & Kirim Ratusan Sertifikat Digital Otomatis</title>
                <meta
                    name="description"
                    content="Aplikasi desktop untuk generate dan kirim ratusan sertifikat digital secara massal dalam hitungan menit. Template siap pakai, kirim otomatis via email, dan barcode verifikasi keaslian."
                />
                <meta name="keywords" content="aplikasi sertifikat massal, generate sertifikat otomatis, kirim sertifikat email massal, aplikasi sertifikat digital, barcode verifikasi sertifikat, software sertifikat pelatihan" />
                <meta property="og:title" content="CertGen Pro — Buat & Kirim Ratusan Sertifikat Digital Otomatis" />
                <meta property="og:description" content="Generate ratusan sertifikat digital dalam hitungan menit, lengkap dengan barcode verifikasi dan pengiriman email otomatis." />
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
                            name: APP_NAME,
                            description: 'Aplikasi desktop Windows untuk membuat dan mengirim sertifikat digital secara massal.',
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
                <Navbar scrolled={navScrolled} scrollTo={scrollTo} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
                <main>
                    <HeroSection scrollTo={scrollTo} />
                    <SocialProofBar />
                    <ProblemSolutionSection />
                    <FeaturesSection />
                    <HowItWorksSection />
                    <MidCtaBanner scrollTo={scrollTo} />
                    <TestimonialsSection />
                    <PricingSection
                        form={form}
                        setForm={setForm}
                        handleSubmit={handleSubmit}
                        loading={loading}
                        message={message}
                    />
                    <FaqSection openFaq={openFaq} setOpenFaq={setOpenFaq} />
                    <FinalCtaSection scrollTo={scrollTo} />
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
    return (
        <header
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 50,
                background: scrolled ? 'rgba(255,255,255,0.96)' : 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(8px)',
                borderBottom: `1px solid ${COLOR.border}`,
                transition: '0.2s',
            }}
        >
            <div style={{ maxWidth: MAXW, margin: '0 auto', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 19, color: COLOR.primaryDark }}>
                    <span style={{ width: 30, height: 30, borderRadius: 8, background: COLOR.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>📜</span>
                    {APP_NAME}
                </div>
                <nav style={{ display: 'flex', gap: 24, alignItems: 'center' }} className="desktop-nav">
                    <NavLink onClick={() => scrollTo('fitur')}>Fitur</NavLink>
                    <NavLink onClick={() => scrollTo('cara-kerja')}>Cara Kerja</NavLink>
                    <NavLink onClick={() => scrollTo('harga')}>Harga</NavLink>
                    <NavLink onClick={() => scrollTo('faq')}>FAQ</NavLink>
                    <button onClick={() => scrollTo('harga')} style={navCtaStyle}>Beli Sekarang</button>
                </nav>
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    style={{ display: 'none', background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: COLOR.primaryDark }}
                    className="mobile-toggle"
                >
                    {mobileOpen ? '✕' : '☰'}
                </button>
            </div>
            {mobileOpen && (
                <div style={{ borderTop: `1px solid ${COLOR.border}`, padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 12, background: '#fff' }}>
                    <NavLink onClick={() => scrollTo('fitur')}>Fitur</NavLink>
                    <NavLink onClick={() => scrollTo('cara-kerja')}>Cara Kerja</NavLink>
                    <NavLink onClick={() => scrollTo('harga')}>Harga</NavLink>
                    <NavLink onClick={() => scrollTo('faq')}>FAQ</NavLink>
                    <button onClick={() => scrollTo('harga')} style={{ ...navCtaStyle, width: '100%' }}>Beli Sekarang</button>
                </div>
            )}
            <style jsx>{`
                @media (max-width: 820px) {
                    .desktop-nav { display: none !important; }
                    .mobile-toggle { display: block !important; }
                }
            `}</style>
        </header>
    );
}

function NavLink({ children, onClick }) {
    return (
        <button onClick={onClick} style={{ background: 'none', border: 'none', color: COLOR.textMuted, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: FONT_BODY }}>
            {children}
        </button>
    );
}

const navCtaStyle = {
    background: COLOR.primary,
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '10px 18px',
    fontWeight: 700,
    fontSize: 13,
    cursor: 'pointer',
    fontFamily: FONT_BODY,
};

/* =========================================================================
   HERO — CTA #1 (AWAL)
   ========================================================================= */

function HeroSection({ scrollTo }) {
    return (
        <section style={{ background: `linear-gradient(180deg, ${COLOR.bgAlt} 0%, #fff 100%)`, padding: '64px 20px 56px' }}>
            <div style={{ maxWidth: MAXW, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 48, alignItems: 'center' }} className="hero-grid">
                <div>
                    <span style={badgeStyle}>🖥️ APLIKASI DESKTOP WINDOWS</span>
                    <h1 style={{ fontFamily: FONT_HEAD, fontSize: 42, lineHeight: 1.15, fontWeight: 800, margin: '18px 0', color: COLOR.text }}>
                        Buat & Kirim <span style={{ color: COLOR.primary }}>Ratusan Sertifikat Digital</span> Tanpa Begadang
                    </h1>
                    <p style={{ fontSize: 16, color: COLOR.textMuted, lineHeight: 1.6, maxWidth: 520 }}>
                        {APP_NAME} membantu panitia acara, HRD, dan pengelola pelatihan membuat serta mengirim ratusan sertifikat ke peserta — lengkap dengan barcode keaslian — hanya dalam hitungan menit, bukan hari.
                    </p>
                    <div style={{ display: 'flex', gap: 14, marginTop: 28, flexWrap: 'wrap' }}>
                        <button onClick={() => scrollTo('harga')} style={heroCtaPrimary}>
                            🚀 Beli Sekarang — Mulai Rp 49.000
                        </button>
                        <button onClick={() => scrollTo('fitur')} style={heroCtaSecondary}>
                            Lihat Semua Fitur
                        </button>
                    </div>
                    <div style={{ display: 'flex', gap: 20, marginTop: 26, flexWrap: 'wrap' }}>
                        {['Template siap pakai', 'Kirim email otomatis', 'Barcode anti-palsu'].map((t) => (
                            <span key={t} style={{ fontSize: 13, color: COLOR.textMuted, display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ color: COLOR.success, fontWeight: 800 }}>✓</span> {t}
                            </span>
                        ))}
                    </div>
                </div>
                <div style={heroMockStyle}>
                    <div style={{ fontSize: 13, color: COLOR.textFaint, marginBottom: 10, fontWeight: 700 }}>PRATINJAU SERTIFIKAT</div>
                    <div style={certMockStyle}>
                        <div style={{ fontSize: 11, color: COLOR.primary, fontWeight: 800, letterSpacing: 1 }}>SERTIFIKAT PENGHARGAAN</div>
                        <div style={{ fontFamily: FONT_HEAD, fontSize: 22, fontWeight: 800, margin: '14px 0 4px', color: COLOR.text }}>Nama Peserta</div>
                        <div style={{ fontSize: 11, color: COLOR.textFaint, marginBottom: 18 }}>telah menyelesaikan program dengan baik</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <div style={{ fontSize: 9, color: COLOR.textFaint }}>No. CGP-0001<br/>■■■ ▌│▌▌ ■ (barcode)</div>
                            <div style={{ fontSize: 9, color: COLOR.textFaint, textAlign: 'right' }}>Ditandatangani<br/>secara digital</div>
                        </div>
                    </div>
                    <div style={{ marginTop: 14, fontSize: 12, color: COLOR.textMuted, textAlign: 'center' }}>200+ sertifikat, generate &amp; terkirim &lt; 5 menit</div>
                </div>
            </div>
            <style jsx>{`
                @media (max-width: 900px) {
                    .hero-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </section>
    );
}

const badgeStyle = {
    display: 'inline-block',
    background: '#dbeafe',
    color: COLOR.primaryDark,
    fontSize: 12,
    fontWeight: 700,
    padding: '6px 12px',
    borderRadius: 20,
};

const heroCtaPrimary = {
    background: COLOR.primary,
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '16px 26px',
    fontWeight: 800,
    fontSize: 15,
    cursor: 'pointer',
    fontFamily: FONT_BODY,
    boxShadow: '0 8px 20px rgba(29,78,216,0.28)',
};

const heroCtaSecondary = {
    background: '#fff',
    color: COLOR.primaryDark,
    border: `1.5px solid ${COLOR.primary}`,
    borderRadius: 10,
    padding: '16px 26px',
    fontWeight: 700,
    fontSize: 15,
    cursor: 'pointer',
    fontFamily: FONT_BODY,
};

const heroMockStyle = {
    background: '#fff',
    border: `1px solid ${COLOR.border}`,
    borderRadius: 18,
    padding: 22,
    boxShadow: '0 20px 50px rgba(15,23,42,0.08)',
};

const certMockStyle = {
    background: `linear-gradient(135deg, #eff6ff 0%, #fff 60%)`,
    border: `2px solid ${COLOR.primary}`,
    borderRadius: 12,
    padding: '26px 22px',
    textAlign: 'center',
};

/* =========================================================================
   SOCIAL PROOF BAR
   ========================================================================= */

function SocialProofBar() {
    const current = useSocialProof();
    return (
        <div style={{ background: COLOR.bgDark, padding: '10px 20px', overflow: 'hidden' }}>
            <div style={{ maxWidth: MAXW, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 13, color: COLOR.textOnDark }}>
                <span>🛒</span>
                <span style={{ fontWeight: 700 }}>{current.name}</span>
                <span style={{ color: COLOR.textFaint }}>· {current.city}</span>
                <span style={{ color: COLOR.textFaint }}>—</span>
                <span>{current.status}</span>
                <span style={{ color: COLOR.success }}>✓</span>
            </div>
        </div>
    );
}

/* =========================================================================
   PROBLEM -> SOLUTION
   ========================================================================= */

function ProblemSolutionSection() {
    const [ref, visible] = useReveal();
    return (
        <section ref={ref} style={{ padding: '64px 20px', background: '#fff', opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(16px)', transition: '0.5s' }}>
            <div style={{ maxWidth: MAXW, margin: '0 auto' }}>
                <SectionHeading eyebrow="MASALAH YANG SERING DIALAMI" title="Bikin Sertifikat Manual Itu Buang-Buang Waktu" center />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 36 }} className="pain-grid">
                    <div>
                        <h3 style={{ fontFamily: FONT_HEAD, fontSize: 16, color: COLOR.danger, marginBottom: 16 }}>😩 Tanpa {APP_NAME}</h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {PAIN_POINTS.map((p) => (
                                <li key={p} style={{ display: 'flex', gap: 10, fontSize: 14, color: COLOR.textMuted, lineHeight: 1.5 }}>
                                    <span style={{ color: COLOR.danger }}>✕</span> {p}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div style={{ background: COLOR.bgAlt, borderRadius: 16, padding: 24, border: `1px solid ${COLOR.border}` }}>
                        <h3 style={{ fontFamily: FONT_HEAD, fontSize: 16, color: COLOR.success, marginBottom: 16 }}>🎉 Dengan {APP_NAME}</h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {[
                                'Generate ratusan sertifikat dari 1 template dalam hitungan menit.',
                                'Kirim otomatis ke email masing-masing peserta hanya sekali klik.',
                                'Barcode verifikasi membuat sertifikat lebih kredibel dan sulit dipalsukan.',
                                'Template tinggal import-export, tidak perlu desain ulang dari nol.',
                            ].map((p) => (
                                <li key={p} style={{ display: 'flex', gap: 10, fontSize: 14, color: COLOR.text, lineHeight: 1.5, fontWeight: 500 }}>
                                    <span style={{ color: COLOR.success }}>✓</span> {p}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <style jsx>{`
                @media (max-width: 820px) {
                    .pain-grid { grid-template-columns: 1fr !important; }
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
        <section id="fitur" ref={ref} style={{ padding: '64px 20px', background: COLOR.bgAlt, opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(16px)', transition: '0.5s' }}>
            <div style={{ maxWidth: MAXW, margin: '0 auto' }}>
                <SectionHeading eyebrow="FITUR UNGGULAN" title="Semua yang Anda Butuhkan untuk Sertifikasi Massal" center />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 40 }} className="feature-grid">
                    {FEATURES.map((f) => (
                        <div key={f.title} style={featureCardStyle}>
                            <div style={{ fontSize: 26, marginBottom: 10 }}>{f.icon}</div>
                            <h3 style={{ fontFamily: FONT_HEAD, fontSize: 15, fontWeight: 700, margin: '0 0 8px', color: COLOR.text }}>{f.title}</h3>
                            <p style={{ fontSize: 13, color: COLOR.textMuted, lineHeight: 1.55, margin: 0 }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
            <style jsx>{`
                @media (max-width: 980px) {
                    .feature-grid { grid-template-columns: repeat(2, 1fr) !important; }
                }
                @media (max-width: 620px) {
                    .feature-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </section>
    );
}

const featureCardStyle = {
    background: '#fff',
    border: `1px solid ${COLOR.border}`,
    borderRadius: 14,
    padding: 22,
    transition: '0.2s',
};

/* =========================================================================
   HOW IT WORKS
   ========================================================================= */

function HowItWorksSection() {
    const [ref, visible] = useReveal();
    return (
        <section id="cara-kerja" ref={ref} style={{ padding: '64px 20px', background: '#fff', opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(16px)', transition: '0.5s' }}>
            <div style={{ maxWidth: MAXW, margin: '0 auto' }}>
                <SectionHeading eyebrow="CARA KERJA" title="3 Langkah Sederhana, Selesai dalam Hitungan Menit" center />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 40 }} className="how-grid">
                    {HOW_IT_WORKS.map((s) => (
                        <div key={s.step} style={{ textAlign: 'center', padding: 20 }}>
                            <div style={{ width: 52, height: 52, borderRadius: '50%', background: COLOR.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, margin: '0 auto 16px', fontFamily: FONT_HEAD }}>
                                {s.step}
                            </div>
                            <h3 style={{ fontFamily: FONT_HEAD, fontSize: 16, fontWeight: 700, margin: '0 0 8px' }}>{s.title}</h3>
                            <p style={{ fontSize: 13, color: COLOR.textMuted, lineHeight: 1.55, margin: 0 }}>{s.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
            <style jsx>{`
                @media (max-width: 820px) {
                    .how-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </section>
    );
}

/* =========================================================================
   MID CTA BANNER — CTA #2 (TENGAH)
   ========================================================================= */

function MidCtaBanner({ scrollTo }) {
    return (
        <section style={{ background: `linear-gradient(135deg, ${COLOR.primaryDark} 0%, ${COLOR.primary} 100%)`, padding: '48px 20px' }}>
            <div style={{ maxWidth: MAXW, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
                <div>
                    <h2 style={{ fontFamily: FONT_HEAD, fontSize: 24, fontWeight: 800, color: '#fff', margin: 0 }}>
                        Siap hemat waktu buat sertifikat acara berikutnya?
                    </h2>
                    <p style={{ color: '#dbeafe', fontSize: 14, marginTop: 8 }}>Mulai dari Rp 49.000/bulan — aktivasi instan setelah pembayaran.</p>
                </div>
                <button onClick={() => scrollTo('harga')} style={{ background: '#fff', color: COLOR.primaryDark, border: 'none', borderRadius: 10, padding: '15px 28px', fontWeight: 800, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: FONT_BODY }}>
                    Lihat Paket Harga →
                </button>
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
        <section ref={ref} style={{ padding: '64px 20px', background: COLOR.bgAlt, opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(16px)', transition: '0.5s' }}>
            <div style={{ maxWidth: MAXW, margin: '0 auto' }}>
                <SectionHeading eyebrow="KATA PENGGUNA" title="Dipercaya Panitia Acara & Tim HRD" center />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 36 }} className="testi-grid">
                    {TESTIMONIALS.map((t) => (
                        <div key={t.name} style={{ background: '#fff', border: `1px solid ${COLOR.border}`, borderRadius: 14, padding: 22 }}>
                            <div style={{ color: COLOR.warn, fontSize: 14, marginBottom: 10 }}>★★★★★</div>
                            <p style={{ fontSize: 13, color: COLOR.text, lineHeight: 1.6, margin: '0 0 16px' }}>&ldquo;{t.quote}&rdquo;</p>
                            <div style={{ fontSize: 13, fontWeight: 700 }}>{t.name}</div>
                            <div style={{ fontSize: 12, color: COLOR.textFaint }}>{t.role}</div>
                        </div>
                    ))}
                </div>
            </div>
            <style jsx>{`
                @media (max-width: 820px) {
                    .testi-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </section>
    );
}

/* =========================================================================
   PRICING + ORDER FORM
   ========================================================================= */

function PricingSection({ form, setForm, handleSubmit, loading, message }) {
    const [ref, visible] = useReveal();
    return (
        <section id="harga" ref={ref} style={{ padding: '64px 20px', background: '#fff', opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(16px)', transition: '0.5s' }}>
            <div style={{ maxWidth: MAXW, margin: '0 auto' }}>
                <SectionHeading eyebrow="PILIH PAKET LISENSI" title="Investasi yang Sepadan dengan Waktu yang Anda Hemat" center />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 40 }} className="pricing-grid">
                    {PRICING.map((pkg) => {
                        const isSelected = form.package_type === pkg.id;
                        return (
                            <div
                                key={pkg.id}
                                onClick={() => setForm({ ...form, package_type: pkg.id })}
                                style={{
                                    ...pricingCardStyle,
                                    borderColor: isSelected ? COLOR.primary : COLOR.border,
                                    boxShadow: isSelected ? '0 12px 28px rgba(29,78,216,0.18)' : 'none',
                                    transform: pkg.popular ? 'translateY(-6px)' : 'none',
                                }}
                            >
                                {pkg.popular && <span style={popularBadge}>PALING POPULER</span>}
                                <div style={{ fontSize: 12, fontWeight: 700, color: COLOR.primary, letterSpacing: 1 }}>{pkg.cta.toUpperCase()}</div>
                                <h3 style={{ fontFamily: FONT_HEAD, fontSize: 18, fontWeight: 800, margin: '10px 0 0' }}>{pkg.label}</h3>
                                <div style={{ fontSize: 12, color: COLOR.textFaint, marginBottom: 12 }}>{pkg.duration}</div>
                                <div style={{ fontFamily: FONT_HEAD, fontSize: 30, fontWeight: 800, color: isSelected ? COLOR.primary : COLOR.text }}>{pkg.priceLabel}</div>
                                <p style={{ fontSize: 13, color: COLOR.textMuted, marginTop: 10, lineHeight: 1.5 }}>{pkg.desc}</p>
                                <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: isSelected ? COLOR.primary : COLOR.textFaint }}>
                                    <span style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${isSelected ? COLOR.primary : COLOR.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {isSelected && <span style={{ width: 9, height: 9, borderRadius: '50%', background: COLOR.primary }} />}
                                    </span>
                                    {isSelected ? 'Paket Dipilih' : 'Pilih Paket Ini'}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <p style={{ textAlign: 'center', fontSize: 13, color: COLOR.textFaint, marginTop: 20 }}>
                    Sudah punya lisensi dan ingin perpanjang? <a href="/renew" style={{ color: COLOR.primary, fontWeight: 700 }}>Kunjungi halaman Perpanjangan Lisensi →</a>
                </p>

                {/* Form pembelian */}
                <div style={orderFormWrapStyle}>
                    <h3 style={{ fontFamily: FONT_HEAD, fontSize: 18, fontWeight: 800, textAlign: 'center', margin: '0 0 6px' }}>Lengkapi Data untuk Aktivasi</h3>
                    <p style={{ textAlign: 'center', fontSize: 13, color: COLOR.textMuted, margin: '0 0 24px' }}>
                        Lisensi akan dikirim otomatis ke WhatsApp &amp; email di bawah ini.
                    </p>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 460, margin: '0 auto' }}>
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
                        </div>
                        <div>
                            <label style={labelStyle}>Nomor WhatsApp (format: 08xxxxxxxxxx)</label>
                            <input
                                type="text"
                                required
                                placeholder="08123456789"
                                value={form.whatsapp}
                                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                                style={inputStyle}
                            />
                            <p style={{ fontSize: 11, color: COLOR.textFaint, margin: '4px 0 0' }}>Cukup pakai awalan 0, tanpa +62 — biar tidak membingungkan.</p>
                        </div>
                        <div>
                            <label style={labelStyle}>Kode Kupon (Opsional)</label>
                            <input
                                type="text"
                                placeholder="KUPON_DISKON"
                                value={form.coupon_code}
                                onChange={(e) => setForm({ ...form, coupon_code: e.target.value })}
                                style={inputStyle}
                            />
                        </div>
                        <button type="submit" disabled={loading} style={buyButtonStyle}>
                            {loading ? 'Memproses...' : `💳 Bayar ${formatRupiah(PRICING.find((p) => p.id === form.package_type)?.price || 0)} Sekarang`}
                        </button>
                    </form>
                    {message && <p style={messageStyle}>{message}</p>}
                    <p style={{ textAlign: 'center', fontSize: 12, color: COLOR.textFaint, marginTop: 16 }}>
                        Butuh bantuan pembayaran?{' '}
                        <a href={WHATSAPP_LINK(`Halo Admin, saya butuh bantuan pembelian lisensi ${APP_NAME}.`)} target="_blank" rel="noopener noreferrer" style={{ color: COLOR.primary, fontWeight: 700, textDecoration: 'none' }}>
                            💬 Chat Admin ({WHATSAPP_DISPLAY})
                        </a>
                    </p>
                </div>
            </div>
            <style jsx>{`
                @media (max-width: 900px) {
                    .pricing-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </section>
    );
}

const pricingCardStyle = {
    background: '#fff',
    border: '2px solid',
    borderRadius: 16,
    padding: 26,
    cursor: 'pointer',
    position: 'relative',
    transition: '0.2s',
};

const popularBadge = {
    position: 'absolute',
    top: -12,
    right: 20,
    background: COLOR.primary,
    color: '#fff',
    fontSize: 10,
    fontWeight: 800,
    padding: '4px 10px',
    borderRadius: 6,
};

const orderFormWrapStyle = {
    marginTop: 56,
    background: COLOR.bgAlt,
    border: `1px solid ${COLOR.border}`,
    borderRadius: 20,
    padding: '36px 24px',
};

const labelStyle = { display: 'block', fontSize: 12, fontWeight: 700, color: COLOR.textMuted, marginBottom: 6 };
const inputStyle = { display: 'block', width: '100%', padding: 12, background: '#fff', border: `1px solid ${COLOR.border}`, borderRadius: 8, color: COLOR.text, fontSize: 14, boxSizing: 'border-box' };
const buyButtonStyle = {
    width: '100%',
    padding: 15,
    background: COLOR.primary,
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
    fontWeight: 800,
    fontSize: 15,
    marginTop: 6,
    fontFamily: FONT_BODY,
    boxShadow: '0 8px 20px rgba(29,78,216,0.25)',
};
const messageStyle = { marginTop: 16, padding: 10, background: '#fff', border: `1px solid ${COLOR.border}`, borderRadius: 8, fontSize: 12, color: COLOR.textMuted, textAlign: 'center', lineHeight: 1.5, maxWidth: 460, margin: '16px auto 0' };

/* =========================================================================
   FAQ
   ========================================================================= */

function FaqSection({ openFaq, setOpenFaq }) {
    const [ref, visible] = useReveal();
    return (
        <section id="faq" ref={ref} style={{ padding: '64px 20px', background: COLOR.bgAlt, opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(16px)', transition: '0.5s' }}>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
                <SectionHeading eyebrow="PERTANYAAN UMUM" title="Masih Ada yang Ingin Ditanyakan?" center />
                <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {FAQ.map((item, i) => {
                        const open = openFaq === i;
                        return (
                            <div key={item.q} style={{ background: '#fff', border: `1px solid ${COLOR.border}`, borderRadius: 12, overflow: 'hidden' }}>
                                <button
                                    onClick={() => setOpenFaq(open ? null : i)}
                                    style={{ width: '100%', textAlign: 'left', padding: '16px 18px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: FONT_BODY }}
                                >
                                    <span style={{ fontSize: 14, fontWeight: 700, color: COLOR.text }}>{item.q}</span>
                                    <span style={{ color: COLOR.primary, fontSize: 18, fontWeight: 800 }}>{open ? '−' : '+'}</span>
                                </button>
                                {open && (
                                    <div style={{ padding: '0 18px 16px', fontSize: 13, color: COLOR.textMuted, lineHeight: 1.6 }}>
                                        {item.a}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

/* =========================================================================
   FINAL CTA — CTA #3 (AKHIR)
   ========================================================================= */

function FinalCtaSection({ scrollTo }) {
    return (
        <section style={{ padding: '72px 20px', background: `linear-gradient(135deg, ${COLOR.primaryDark} 0%, ${COLOR.primary} 100%)`, textAlign: 'center' }}>
            <div style={{ maxWidth: 640, margin: '0 auto' }}>
                <h2 style={{ fontFamily: FONT_HEAD, fontSize: 30, fontWeight: 800, color: '#fff', margin: '0 0 12px' }}>
                    Berhenti Buat Sertifikat Satu-Satu Mulai Hari Ini
                </h2>
                <p style={{ color: '#dbeafe', fontSize: 15, lineHeight: 1.6, marginBottom: 28 }}>
                    Gabung bersama panitia acara, tim HRD, dan pengelola pelatihan yang sudah menghemat puluhan jam kerja dengan {APP_NAME}.
                </p>
                <button onClick={() => scrollTo('harga')} style={{ background: '#fff', color: COLOR.primaryDark, border: 'none', borderRadius: 10, padding: '17px 32px', fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: FONT_BODY }}>
                    🚀 Mulai Sekarang — Mulai Rp 49.000
                </button>
            </div>
        </section>
    );
}

/* =========================================================================
   FOOTER
   ========================================================================= */

function Footer() {
    return (
        <footer style={{ background: COLOR.bgDark, padding: '40px 20px 24px' }}>
            <div style={{ maxWidth: MAXW, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
                <div>
                    <div style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 17, color: '#fff', marginBottom: 8 }}>{APP_NAME}</div>
                    <p style={{ fontSize: 12, color: COLOR.textFaint, maxWidth: 280, lineHeight: 1.6 }}>
                        Aplikasi desktop Windows untuk membuat dan mengirim sertifikat digital secara massal.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
                    <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 10 }}>Produk</div>
                        <FooterLink href="/#fitur">Fitur</FooterLink>
                        <FooterLink href="/#harga">Harga</FooterLink>
                        <FooterLink href="/renew">Perpanjangan Lisensi</FooterLink>
                        <FooterLink href="/download">Download Aplikasi</FooterLink>
                    </div>
                    <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 10 }}>Bantuan</div>
                        <FooterLink href="/terms">Syarat &amp; Ketentuan</FooterLink>
                        <FooterLink href={WHATSAPP_LINK(`Halo Admin, saya butuh bantuan terkait ${APP_NAME}.`)}>Chat WhatsApp</FooterLink>
                    </div>
                </div>
            </div>
            <div style={{ maxWidth: MAXW, margin: '32px auto 0', borderTop: `1px solid #1e293b`, paddingTop: 18, fontSize: 11, color: COLOR.textFaint, textAlign: 'center' }}>
                © {new Date().getFullYear()} {APP_NAME}. Semua hak dilindungi.
            </div>
        </footer>
    );
}

function FooterLink({ href, children }) {
    return (
        <a href={href} style={{ display: 'block', fontSize: 12, color: COLOR.textFaint, textDecoration: 'none', marginBottom: 8 }}>
            {children}
        </a>
    );
}

/* =========================================================================
   SHARED
   ========================================================================= */

function SectionHeading({ eyebrow, title, center }) {
    return (
        <div style={{ textAlign: center ? 'center' : 'left', maxWidth: 680, margin: center ? '0 auto' : 0 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: COLOR.primary, letterSpacing: 1 }}>{eyebrow}</span>
            <h2 style={{ fontFamily: FONT_HEAD, fontSize: 30, fontWeight: 800, margin: '10px 0 0', color: COLOR.text, lineHeight: 1.25 }}>{title}</h2>
        </div>
    );
}
