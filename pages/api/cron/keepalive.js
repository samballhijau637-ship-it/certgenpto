// pages/api/cron/keepalive.js
// Dipanggil otomatis oleh Vercel Cron (lihat vercel.json) sekali sehari.
// 1. Insert satu baris ke keep_alive_pings agar Supabase tidak auto-pause.
// 2. Hapus lisensi 'pending'/'expired' yang sudah lebih dari 30 hari, untuk
//    menghemat kuota 500MB free tier.

import { supabase } from '../../../lib/supabase';

const STALE_DAYS = 30;

export default async function handler(req, res) {
    // Vercel Cron mengirim header Authorization: Bearer <CRON_SECRET>
    const authHeader = req.headers.authorization;
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        // 1. Keep-alive ping
        await supabase.from('keep_alive_pings').insert({});

        // (opsional) buang ping lama supaya tabel ini sendiri tidak membengkak
        const oldPingCutoff = new Date(Date.now() - 60 * 86400000).toISOString();
        await supabase.from('keep_alive_pings').delete().lt('pinged_at', oldPingCutoff);

        // 2. Cleanup lisensi pending/expired yang basi
        const staleCutoff = new Date(Date.now() - STALE_DAYS * 86400000).toISOString();
        const { data: deleted, error } = await supabase
            .from('licenses')
            .delete()
            .in('status', ['pending', 'expired'])
            .lt('created_at', staleCutoff)
            .select('id');

        if (error) throw error;

        return res.status(200).json({
            message: 'Keep-alive & cleanup selesai',
            deleted_count: deleted?.length || 0,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error', detail: err.message });
    }
}
