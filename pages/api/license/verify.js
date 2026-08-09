// pages/api/license/verify.js
// Endpoint: POST /api/license/verify
// Body: { app_id, license_key, hwid }
//
// Dipanggil klien pada:
// 1) Aktivasi pertama kali (hwid null -> akan diikat ke license ini)
// 2) Pengecekan online periodik (setiap 3-7 hari, sesuai desain offline-first)
//
// Mengembalikan JWT (RS256) yang berisi status lisensi, ditandatangani Private Key.
// Klien menyimpan JWT ini dan memverifikasinya secara offline dengan Public Key
// setiap kali aplikasi dibuka, tanpa perlu hit endpoint ini tiap saat.

import { supabase } from '../../../lib/supabase';
import { signLicenseToken } from '../../../lib/jwt';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { app_id, license_key, hwid } = req.body;
        if (!app_id || !license_key || !hwid) {
            return res.status(400).json({ error: 'app_id, license_key, dan hwid wajib diisi' });
        }

        const { data: license, error } = await supabase
            .from('licenses')
            .select('*')
            .eq('app_id', app_id)
            .eq('license_key', license_key)
            .single();

        if (error || !license) {
            return res.status(404).json({ error: 'Lisensi tidak ditemukan', valid: false });
        }

        if (license.status === 'revoked') {
            return res.status(403).json({ error: 'Lisensi telah dicabut', valid: false });
        }

        // Cek kedaluwarsa berdasarkan tanggal di database (sumber kebenaran utama)
        const now = new Date();
        const expiresAt = license.expires_at ? new Date(license.expires_at) : null;
        if (expiresAt && expiresAt < now && license.status !== 'expired') {
            await supabase.from('licenses').update({ status: 'expired' }).eq('id', license.id);
            license.status = 'expired';
        }
        if (license.status === 'expired') {
            return res.status(403).json({ error: 'Lisensi sudah kedaluwarsa', valid: false });
        }

        // ---- Device locking ----
        if (!license.hwid) {
            // Aktivasi pertama kali: ikat HWID ke lisensi ini
            const { error: bindErr } = await supabase
                .from('licenses')
                .update({ hwid, status: 'active', activated_at: now.toISOString() })
                .eq('id', license.id);
            if (bindErr) throw bindErr;
            license.hwid = hwid;
            license.status = 'active';
        } else if (license.hwid !== hwid) {
            // Sudah terikat ke perangkat lain -> tolak
            return res.status(403).json({
                error: 'Lisensi ini sudah aktif di perangkat lain',
                valid: false,
            });
        }

        // ---- Terbitkan JWT untuk verifikasi offline di klien ----
        const token = signLicenseToken({
            app_id: license.app_id,
            license_key: license.license_key,
            hwid: license.hwid,
            type: license.type,
            status: license.status,
            expires_at: license.expires_at,
            issued_at: now.toISOString(),
        });

        return res.status(200).json({
            valid: true,
            token,
            license: {
                type: license.type,
                status: license.status,
                expires_at: license.expires_at,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error', detail: err.message });
    }
}
