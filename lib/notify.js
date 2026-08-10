// lib/notify.js
// Helper pengiriman notifikasi lisensi via WhatsApp (Fonnte) dan Email (Brevo).
// Kredensial (FONNTE_TOKEN, BREVO_API_KEY, dst) diambil dari Environment
// Variable — SAMA seperti sebelumnya, tidak berubah walau pindah GitHub/Vercel.

/**
 * Generate license key acak, contoh: CGP-A1B2-C3D4-E5F6
 */
export function generateLicenseKey(appPrefix = 'LIC') {
    const rand = () =>
        Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${appPrefix}-${rand()}-${rand()}-${rand()}`;
}

/**
 * Kirim WhatsApp via Fonnte.
 * Butuh env FONNTE_TOKEN.
 * `target` diharapkan sudah dalam format 628xxxxxxxxx (tanpa tanda "+").
 */
export async function sendWhatsApp(target, message) {
    if (!process.env.FONNTE_TOKEN) {
        console.warn('FONNTE_TOKEN tidak diset, lewati pengiriman WA');
        return { skipped: true };
    }
    try {
        const res = await fetch('https://api.fonnte.com/send', {
            method: 'POST',
            headers: {
                Authorization: process.env.FONNTE_TOKEN,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ target, message }),
        });
        const data = await res.json();
        console.log('Respons Fonnte WA:', data);
        return data;
    } catch (error) {
        console.error('Gagal mengirim WhatsApp via Fonnte:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Kirim Email via Brevo (dahulu Sendinblue).
 * Butuh env BREVO_API_KEY, BREVO_SENDER_EMAIL, BREVO_SENDER_NAME.
 */
export async function sendEmail({ to, subject, htmlContent }) {
    if (!process.env.BREVO_API_KEY) {
        console.warn('BREVO_API_KEY tidak diset, lewati pengiriman email');
        return { skipped: true };
    }

    try {
        const res = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'api-key': process.env.BREVO_API_KEY,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                sender: {
                    email: process.env.BREVO_SENDER_EMAIL,
                    name: process.env.BREVO_SENDER_NAME || 'CertGen Pro',
                },
                to: [{ email: to }],
                subject,
                htmlContent,
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            console.error('Brevo API Error Detail:', {
                status: res.status,
                statusText: res.statusText,
                responseBody: data,
            });
            return { success: false, error: data };
        }

        console.log('Email berhasil dikirim via Brevo. Message ID:', data.messageId);
        return { success: true, data };
    } catch (error) {
        console.error('Terjadi kendala koneksi/internal saat memanggil API Brevo:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Template pesan pengiriman lisensi CertGen Pro (baru maupun perpanjangan).
 */
export function buildLicenseMessage({ appName, licenseKey, type, expiresAt }) {
    const finalAppName = appName || 'CertGen Pro';

    const TYPE_LABEL = {
        daily: 'Harian (1 Hari)',
        monthly: 'Bulanan (30 Hari)',
        yearly: 'Tahunan (365 Hari)',
        lifetime: 'Lifetime (Selamanya)',
        trial: 'Trial',
        manual: 'Manual',
    };
    const typeLabel = TYPE_LABEL[type] || type;

    const expiryText = expiresAt
        ? new Date(expiresAt).toLocaleDateString('id-ID', {
              day: 'numeric', month: 'long', year: 'numeric',
          })
        : 'Tidak ada (manual/perlu aktivasi)';

    // Dibaca dari Environment Variable 'DOWNLOAD_LINK' di Vercel.
    // Kalau belum diset, otomatis pakai link default di bawah ini
    // (arahkan ke portal download di domain Vercel akun baru Anda).
    const downloadLink = process.env.DOWNLOAD_LINK || 'https://certgenpro.vercel.app/download';

    const text =
        `Terima kasih telah membeli ${finalAppName}!\n\n` +
        `Kode Lisensi Anda:\n${licenseKey}\n\n` +
        `Paket: ${typeLabel}\n` +
        `Berlaku hingga: ${expiryText}\n\n` +
        `Cara aktivasi:\n` +
        `1. Download aplikasi ${finalAppName} (Windows 10/11) di sini:\n   ${downloadLink}\n` +
        `2. Install & buka aplikasi ${finalAppName}\n` +
        `3. Masukkan kode lisensi di atas pada dialog aktivasi\n` +
        `4. Aplikasi akan otomatis terkunci ke perangkat ini (1 lisensi = 1 perangkat)\n\n` +
        `Simpan kode ini baik-baik. Jika butuh bantuan, balas pesan ini.`;

    let html = text.replace(/\n/g, '<br/>');
    const searchStr = `1. Download aplikasi ${finalAppName} (Windows 10/11) di sini:<br/>   ${downloadLink}`;
    const replaceStr = `1. <a href="${downloadLink}" style="color: #2563eb; font-weight: bold; text-decoration: underline;">Download aplikasi ${finalAppName} (Windows 10/11) di sini</a>`;

    if (html.includes(searchStr)) {
        html = html.replace(searchStr, replaceStr);
    } else {
        html = html.replace(
            downloadLink,
            `<a href="${downloadLink}" style="color: #2563eb; font-weight: bold; text-decoration: underline;">${downloadLink}</a>`
        );
    }

    return { text, html };
}
