// pages/api/admin/downloads.js

import { supabase } from '../../../lib/supabase';
import { checkAdminAuth } from '../../../lib/adminAuth';

export default async function handler(req, res) {
    if (!checkAdminAuth(req)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'GET') {
        try {
            const { data, error } = await supabase
                .from('downloads')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            return res.status(200).json({ downloads: data });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    if (req.method === 'POST') {
        const { app_name, version, download_url } = req.body;
        if (!app_name || !version || !download_url) {
            return res.status(400).json({ error: 'app_name, version, dan download_url wajib diisi' });
        }

        try {
            const { data, error } = await supabase
                .from('downloads')
                .insert({ app_name, version, download_url })
                .select()
                .single();

            if (error) throw error;
            return res.status(200).json({ download: data });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    if (req.method === 'DELETE') {
        const { id } = req.body;
        if (!id) return res.status(400).json({ error: 'id wajib diisi' });

        try {
            const { error } = await supabase
                .from('downloads')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return res.status(200).json({ message: 'Berkas unduhan berhasil dihapus permanen.' });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}