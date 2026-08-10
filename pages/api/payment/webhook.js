// pages/api/payment/webhook.js
//
// PENTING: URL endpoint webhook ini ("/api/payment/webhook") TIDAK berubah.
// Yang berubah hanya domain di depannya (mengikuti domain Vercel akun baru).
// Setelah deploy ke Vercel baru, set Payment Notification URL di
// Dashboard Midtrans ke: https://<domain-baru-anda>/api/payment/webhook
// Token MIDTRANS_SERVER_KEY, FONNTE_TOKEN, dan BREVO_API_KEY tetap sama
// seperti sebelumnya (env var, tidak berubah).

import crypto from 'crypto';
import { supabase } from '../../../lib/supabase';
import { sendWhatsApp, sendEmail, buildLicenseMessage } from '../../../lib/notify';

const APP_NAMES = {
    certgenpro: 'CertGen Pro',
};

const PACKAGE_DAYS = { daily: 1, monthly: 30, yearly: 365, lifetime: 36135 };

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const notif = req.body;
        const { order_id, status_code, gross_amount, signature_key, transaction_status, custom_field2 } = notif;

        const expectedSignature = crypto
            .createHash('sha512')
            .update(order_id + status_code + gross_amount + process.env.MIDTRANS_SERVER_KEY)
            .digest('hex');
        if (signature_key !== expectedSignature) {
            return res.status(403).json({ error: 'Signature tidak valid' });
        }

        if (!['settlement', 'capture'].includes(transaction_status)) {
            return res.status(200).json({ message: `Status ${transaction_status} diabaikan` });
        }

        const { data: license, error: findErr } = await supabase
            .from('licenses')
            .select('*')
            .eq('order_id', order_id)
            .single();

        if (findErr || !license) {
            console.error('Lisensi untuk order_id tidak ditemukan:', order_id);
            return res.status(404).json({ error: 'Lisensi tidak ditemukan untuk order_id ini' });
        }

        const appName = APP_NAMES[license.app_id] || license.app_id;
        const isRenewal = typeof custom_field2 === 'string' && custom_field2.startsWith('renew_');

        if (isRenewal) {
            const packageType = custom_field2.replace('renew_', '');
            const addDays = PACKAGE_DAYS[packageType];
            if (!addDays) return res.status(400).json({ error: 'package_type perpanjangan tidak valid' });

            const now = new Date();
            const currentExpiry = license.expires_at ? new Date(license.expires_at) : null;
            const isStillActive = license.status === 'active' && currentExpiry && currentExpiry > now;

            const baseDate = isStillActive ? currentExpiry : now;
            const newExpiry = new Date(baseDate.getTime() + addDays * 86400000);

            const { error: updateErr } = await supabase
                .from('licenses')
                .update({
                    type: packageType,
                    status: 'active',
                    expires_at: newExpiry.toISOString(),
                })
                .eq('id', license.id);
            if (updateErr) throw updateErr;

            const msg = buildLicenseMessage({
                appName,
                licenseKey: license.license_key,
                type: packageType,
                expiresAt: newExpiry,
            });
            if (license.whatsapp) await sendWhatsApp(license.whatsapp, `Perpanjangan berhasil!\n\n${msg.text}`);
            await sendEmail({ to: license.email, subject: `Perpanjangan Lisensi ${appName}`, htmlContent: msg.html });

            return res.status(200).json({ message: 'Perpanjangan berhasil diproses' });
        }

        if (license.status !== 'pending') {
            return res.status(200).json({ message: 'Sudah diproses sebelumnya' });
        }

        // Jalur Pembelian Baru: perbarui status menjadi active setelah pembayaran sukses
        const { error: activateErr } = await supabase
            .from('licenses')
            .update({ status: 'active' })
            .eq('id', license.id);
        if (activateErr) throw activateErr;

        const msg = buildLicenseMessage({
            appName,
            licenseKey: license.license_key,
            type: license.type,
            expiresAt: license.expires_at,
        });
        if (license.whatsapp) await sendWhatsApp(license.whatsapp, msg.text);
        await sendEmail({ to: license.email, subject: `Lisensi ${appName} Anda`, htmlContent: msg.html });

        return res.status(200).json({ message: 'OK' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error', detail: err.message });
    }
}
