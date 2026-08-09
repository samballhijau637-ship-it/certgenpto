// pages/api/admin/coupons.js
// GET    /api/admin/coupons?app_id=xxx     -> daftar kupon
// POST   /api/admin/coupons                -> buat kupon baru
// DELETE /api/admin/coupons                -> hapus kupon berdasarkan ID
// Header wajib: Authorization: Bearer <ADMIN_PASSWORD>

import { supabase } from '../../../lib/supabase';
import { checkAdminAuth } from '../../../lib/adminAuth';

export default async function handler(req, res) {
    if (!checkAdminAuth(req)) return res.status(401).json({ error: 'Unauthorized' });

    // ---- AMBIL DAFTAR KUPON ----
    if (req.method === 'GET') {
        const { app_id } = req.query;
        let query = supabase.from('coupons').select('*').order('created_at', { ascending: false });
        if (app_id) query = query.eq('app_id', app_id);
        const { data, error } = await query;
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ coupons: data });
    }

    // ---- BUAT KUPON BARU ----
    if (req.method === 'POST') {
        const { app_id, code, discount_type, discount_value, trial_days, max_uses, expires_at } = req.body;
        if (!app_id || !code || !discount_type) {
            return res.status(400).json({ error: 'app_id, code, discount_type wajib diisi' });
        }
        const { data, error } = await supabase
            .from('coupons')
            .insert({
                app_id,
                code,
                discount_type,
                discount_value: discount_value || 0,
                trial_days: trial_days || 0,
                max_uses: max_uses || 1,
                expires_at: expires_at || null,
            })
            .select()
            .single();
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ coupon: data });
    }

    // ---- HAPUS KUPON (FITUR BARU) ----
    if (req.method === 'DELETE') {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ error: 'ID kupon wajib disertakan' });
        }

        const { error } = await supabase
            .from('coupons')
            .delete()
            .eq('id', id);

        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ message: 'Kupon berhasil dihapus' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}