// pages/api/downloads.js

import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

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