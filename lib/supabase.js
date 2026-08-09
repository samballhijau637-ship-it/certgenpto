// lib/supabase.js
// Client Supabase khusus server (pakai SERVICE ROLE KEY, jangan pernah
// dikirim ke browser/client). Dipakai di semua API routes.

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('SUPABASE_URL atau SUPABASE_SERVICE_ROLE_KEY belum diset di Environment Variables');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
});
