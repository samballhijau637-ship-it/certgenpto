// pages/api/admin/login.js
// Endpoint: POST /api/admin/login
// Body: { password }
// Mengembalikan { ok: true } jika password benar. Frontend admin dashboard
// menyimpan password ini di localStorage lalu mengirimkannya sebagai
// Authorization: Bearer <password> di setiap request admin berikutnya.
// Password TIDAK pernah dicetak/di-log.

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { password } = req.body;
    if (!password || password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Password salah' });
    }
    return res.status(200).json({ ok: true });
}
