// lib/adminAuth.js
// Proteksi sederhana untuk endpoint admin memakai password di Env Variable.
// Klien mengirim header: Authorization: Bearer <ADMIN_PASSWORD>

export function checkAdminAuth(req) {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');
    return token && token === process.env.ADMIN_PASSWORD;
}
