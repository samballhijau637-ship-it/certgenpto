// lib/jwt.js
// Tanda tangan token lisensi memakai RSA (RS256).
// Private Key HANYA ada di server (Vercel Env Variable), TIDAK PERNAH dikirim ke client.
// Public Key didistribusikan bersama aplikasi desktop untuk verifikasi offline.

import jwt from 'jsonwebtoken';

// Private key disimpan di Env Variable sebagai base64 agar aman dari masalah
// newline saat disalin ke Vercel dashboard.
function getPrivateKey() {
    const b64 = process.env.LICENSE_RSA_PRIVATE_KEY_B64;
    if (!b64) throw new Error('LICENSE_RSA_PRIVATE_KEY_B64 belum diset');
    return Buffer.from(b64, 'base64').toString('utf8');
}

/**
 * Membuat token lisensi yang ditandatangani (JWT RS256).
 * @param {Object} payload - { license_key, app_id, hwid, type, expires_at }
 * @returns {string} JWT
 */
export function signLicenseToken(payload) {
    const privateKey = getPrivateKey();
    return jwt.sign(payload, privateKey, {
        algorithm: 'RS256',
        issuer: 'license-system',
    });
}

export default { signLicenseToken };
