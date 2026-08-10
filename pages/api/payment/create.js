// pages/api/payment/create.js

import { supabase } from '../../../lib/supabase';
import { generateLicenseKey, sendWhatsApp, sendEmail, buildLicenseMessage } from '../../../lib/notify';

// ============================================================================
// DOMAIN BARU (GitHub + Vercel akun baru). Ganti nilai ini kalau domain
// produksi Anda berubah. Dipakai untuk callback "finish" Midtrans supaya
// Snap popup mengarahkan pembeli ke halaman thankyou TANPA perlu setting
// tambahan apa pun di Dashboard Midtrans.
// ============================================================================
const SITE_URL = process.env.SITE_URL || 'https://certgenpro.vercel.app';

// Tabel harga resmi CertGen Pro
const PRICE_TABLE = {
    certgenpro: {
        appName: 'CertGen Pro',
        prefix: 'CGP',
        packages: {
            daily:    { price: 19000,  days: 1 },      // hanya tersedia di halaman renew
            monthly:  { price: 49000,  days: 30 },
            yearly:   { price: 299000, days: 365 },
            lifetime: { price: 599000, days: 36135 },   // ~99 tahun (setara lifetime)
        },
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { app_id, email, whatsapp, package_type, coupon_code } = req.body;

        if (!app_id || !email || !package_type) {
            return res.status(400).json({ error: 'app_id, email, dan package_type wajib diisi' });
        }

        const appConfig = PRICE_TABLE[app_id];
        if (!appConfig) return res.status(400).json({ error: 'app_id tidak dikenal' });

        const pkg = appConfig.packages[package_type];
        if (!pkg) return res.status(400).json({ error: 'package_type tidak valid' });

        let finalPrice = pkg.price;
        let finalDays = pkg.days;
        let appliedCoupon = null;

        if (coupon_code) {
            const { data: coupon, error: couponErr } = await supabase
                .from('coupons')
                .select('*')
                .eq('app_id', app_id)
                .eq('code', coupon_code)
                .single();

            if (couponErr || !coupon) {
                return res.status(400).json({ error: 'Kupon tidak ditemukan' });
            }
            if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
                return res.status(400).json({ error: 'Kupon sudah kedaluwarsa' });
            }
            if (coupon.used_count >= coupon.max_uses) {
                return res.status(400).json({ error: 'Kuota kupon sudah habis' });
            }
            appliedCoupon = coupon;

            if (coupon.discount_type === 'free_trial') {
                const licenseKey = generateLicenseKey(appConfig.prefix);
                const expiresAt = new Date(Date.now() + coupon.trial_days * 86400000);

                const { error: insertErr } = await supabase.from('licenses').insert({
                    app_id,
                    license_key: licenseKey,
                    email,
                    whatsapp,
                    type: 'trial',
                    status: 'pending',
                    expires_at: expiresAt.toISOString(),
                    coupon_code,
                });
                if (insertErr) throw insertErr;

                await supabase
                    .from('coupons')
                    .update({ used_count: coupon.used_count + 1 })
                    .eq('id', coupon.id);

                const msg = buildLicenseMessage({
                    appName: appConfig.appName,
                    licenseKey,
                    type: 'trial',
                    expiresAt,
                });
                if (whatsapp) await sendWhatsApp(whatsapp, msg.text);
                await sendEmail({ to: email, subject: `Lisensi Trial ${appConfig.appName}`, htmlContent: msg.html });

                return res.status(200).json({
                    free_trial: true,
                    license_key: licenseKey,
                    message: 'Lisensi trial berhasil dibuat dan dikirim',
                });
            }

            if (coupon.discount_type === 'percentage') {
                finalPrice = Math.round(pkg.price * (1 - coupon.discount_value / 100));
            } else if (coupon.discount_type === 'fixed') {
                finalPrice = Math.max(0, pkg.price - coupon.discount_value);
            }
        }

        const orderId = `${app_id}-${package_type}-${Date.now()}`;

        const midtransRes = await fetch(
            `${process.env.MIDTRANS_IS_PRODUCTION === 'true'
                ? 'https://app.midtrans.com'
                : 'https://app.sandbox.midtrans.com'}/snap/v1/transactions`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Basic ' + Buffer.from(process.env.MIDTRANS_SERVER_KEY + ':').toString('base64'),
                },
                body: JSON.stringify({
                    transaction_details: { order_id: orderId, gross_amount: finalPrice },
                    customer_details: { email, phone: whatsapp },

                    // ── CALLBACK FINISH — diset langsung di sini (bukan di Dashboard
                    // Midtrans) supaya pindah GitHub/Vercel akun baru tidak perlu
                    // konfigurasi ulang apa pun di sisi Midtrans. ──
                    callbacks: {
                        finish: `${SITE_URL}/thankyou`,
                    },

                    custom_field1: app_id,
                    custom_field2: package_type,
                    custom_field3: coupon_code || '',
                }),
            }
        );

        const midtransData = await midtransRes.json();
        if (!midtransRes.ok) {
            console.error('Midtrans error:', midtransData);
            return res.status(502).json({ error: 'Gagal membuat transaksi Midtrans', detail: midtransData });
        }

        const licenseKey = generateLicenseKey(appConfig.prefix);
        const { error: insertErr } = await supabase.from('licenses').insert({
            app_id,
            license_key: licenseKey,
            order_id: orderId,
            email,
            whatsapp,
            type: package_type,
            status: 'pending',
            expires_at: new Date(Date.now() + finalDays * 86400000).toISOString(),
            coupon_code: coupon_code || null,
        });
        if (insertErr) throw insertErr;

        if (appliedCoupon) {
            await supabase
                .from('coupons')
                .update({ used_count: appliedCoupon.used_count + 1 })
                .eq('id', appliedCoupon.id);
        }

        return res.status(200).json({
            free_trial: false,
            order_id: orderId,
            license_key: licenseKey,
            snap_token: midtransData.token,
            redirect_url: midtransData.redirect_url,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error', detail: err.message });
    }
}
