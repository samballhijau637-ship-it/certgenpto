// pages/admin/index.js

import { useState, useEffect } from 'react';

function isLicenseExpired(l) {
    return !!(l.expires_at && new Date(l.expires_at) < new Date() && l.status !== 'revoked');
}

export default function AdminDashboard() {
    const [password, setPassword] = useState('');
    const [authed, setAuthed] = useState(false);
    const [tab, setTab] = useState('licenses');
    const [licenses, setLicenses] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [downloads, setDownloads] = useState([]);
    const [message, setMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [couponSearchQuery, setCouponSearchQuery] = useState('');

    // ── FITUR BARU: filter cepat status lisensi + seleksi untuk hapus massal ──
    const [statusFilter, setStatusFilter] = useState('all'); // all | active | pending | expired
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [bulkDeleting, setBulkDeleting] = useState(false);

    useEffect(() => {
        const saved = typeof window !== 'undefined' && localStorage.getItem('admin_password');
        if (saved) {
            setPassword(saved);
            setAuthed(true);
        }
    }, []);

    async function login() {
        const res = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        });
        if (res.ok) {
            localStorage.setItem('admin_password', password);
            setAuthed(true);
        } else {
            setMessage('Password salah');
        }
    }

    function authHeaders() {
        return { Authorization: `Bearer ${password}`, 'Content-Type': 'application/json' };
    }

    async function loadLicenses() {
        const res = await fetch('/api/admin/licenses', { headers: authHeaders() });
        const data = await res.json();
        if (res.ok) setLicenses(data.licenses);
    }

    async function loadCoupons() {
        const res = await fetch('/api/admin/coupons', { headers: authHeaders() });
        const data = await res.json();
        if (res.ok) setCoupons(data.coupons);
    }

    async function loadDownloads() {
        const res = await fetch('/api/admin/downloads', { headers: authHeaders() });
        const data = await res.json();
        if (res.ok) setDownloads(data.downloads);
    }

    useEffect(() => {
        if (!authed) return;
        if (tab === 'licenses') loadLicenses();
        if (tab === 'coupons') loadCoupons();
        if (tab === 'downloads') loadDownloads();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authed, tab]);

    async function deleteLicense(id, key) {
        if (!confirm(`Hapus permanen lisensi: ${key}?\nTindakan ini tidak bisa dibatalkan.`)) return;
        try {
            const res = await fetch('/api/admin/licenses', {
                method: 'DELETE',
                headers: authHeaders(),
                body: JSON.stringify({ id }),
            });
            if (res.ok) {
                setMessage(`Berhasil: Lisensi ${key} telah dihapus.`);
                loadLicenses();
            } else {
                const data = await res.json();
                setMessage(`Gagal menghapus: ${data.error}`);
            }
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        }
    }

    // ── FITUR BARU: hapus semua lisensi yang sedang dicentang ──
    async function deleteSelectedLicenses() {
        const ids = Array.from(selectedIds);
        if (ids.length === 0) return;
        if (!confirm(`Hapus permanen ${ids.length} lisensi kedaluwarsa yang dipilih?\nTindakan ini tidak bisa dibatalkan.`)) return;

        setBulkDeleting(true);
        try {
            const res = await fetch('/api/admin/licenses', {
                method: 'DELETE',
                headers: authHeaders(),
                body: JSON.stringify({ ids }),
            });
            const data = await res.json();
            if (res.ok) {
                setMessage(`Berhasil: ${data.deleted_count ?? ids.length} lisensi kedaluwarsa telah dihapus.`);
                setSelectedIds(new Set());
                loadLicenses();
            } else {
                setMessage(`Gagal menghapus massal: ${data.error}`);
            }
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        } finally {
            setBulkDeleting(false);
        }
    }

    function toggleSelect(id) {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }

    function toggleSelectAllExpired(currentRows) {
        const expiredIds = currentRows.filter(isLicenseExpired).map((l) => l.id);
        const allSelected = expiredIds.length > 0 && expiredIds.every((id) => selectedIds.has(id));
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (allSelected) {
                expiredIds.forEach((id) => next.delete(id));
            } else {
                expiredIds.forEach((id) => next.add(id));
            }
            return next;
        });
    }

    async function deleteCoupon(id, code) {
        if (!confirm(`Hapus permanen kupon: ${code}?\nTindakan ini tidak bisa dibatalkan.`)) return;
        try {
            const res = await fetch('/api/admin/coupons', {
                method: 'DELETE',
                headers: authHeaders(),
                body: JSON.stringify({ id }),
            });
            if (res.ok) {
                setMessage(`Berhasil: Kupon ${code} telah dihapus.`);
                loadCoupons();
            } else {
                const data = await res.json();
                setMessage(`Gagal menghapus: ${data.error}`);
            }
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        }
    }

    async function createDownload(e) {
        e.preventDefault();
        const f = e.target;
        const body = {
            app_name: f.app_name.value,
            version: f.version.value,
            download_url: f.download_url.value,
        };
        const res = await fetch('/api/admin/downloads', { method: 'POST', headers: authHeaders(), body: JSON.stringify(body) });
        const data = await res.json();
        setMessage(res.ok ? `Rilis versi ${data.download.version} berhasil ditambahkan.` : `Gagal: ${data.error}`);
        if (res.ok) {
            f.reset();
            loadDownloads();
        }
    }

    async function deleteDownload(id, version) {
        if (!confirm(`Hapus permanen rilis versi: ${version}?\nTautan unduhan tidak akan dapat diakses oleh publik.`)) return;
        try {
            const res = await fetch('/api/admin/downloads', {
                method: 'DELETE',
                headers: authHeaders(),
                body: JSON.stringify({ id }),
            });
            if (res.ok) {
                setMessage(`Berhasil: Rilis versi ${version} telah dihapus.`);
                loadDownloads();
            } else {
                const data = await res.json();
                setMessage(`Gagal menghapus: ${data.error}`);
            }
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        }
    }

    const filteredLicenses = licenses
        .filter((l) => {
            if (statusFilter === 'expired') return isLicenseExpired(l);
            if (statusFilter === 'active') return l.status === 'active' && !isLicenseExpired(l);
            if (statusFilter === 'pending') return l.status === 'pending';
            return true;
        })
        .filter((l) => {
            const query = searchQuery.toLowerCase();
            if (!query) return true;
            return (
                (l.license_key && l.license_key.toLowerCase().includes(query)) ||
                (l.email && l.email.toLowerCase().includes(query)) ||
                (l.whatsapp && l.whatsapp.toLowerCase().includes(query)) ||
                (l.created_at && l.created_at.includes(query)) ||
                (l.expires_at && l.expires_at.includes(query))
            );
        });

    const expiredCountInView = filteredLicenses.filter(isLicenseExpired).length;
    const allExpiredSelected =
        expiredCountInView > 0 && filteredLicenses.filter(isLicenseExpired).every((l) => selectedIds.has(l.id));

    const filteredCoupons = coupons.filter((c) => {
        const query = couponSearchQuery.toLowerCase();
        return (
            (c.code && c.code.toLowerCase().includes(query)) ||
            (c.app_id && c.app_id.toLowerCase().includes(query)) ||
            (c.discount_type && c.discount_type.toLowerCase().includes(query))
        );
    });

    async function createManualLicense(e) {
        e.preventDefault();
        const f = e.target;
        const body = {
            app_id: f.app_id.value,
            email: f.email.value,
            whatsapp: f.whatsapp.value,
            type: f.type.value,
        };
        const res = await fetch('/api/admin/licenses', { method: 'POST', headers: authHeaders(), body: JSON.stringify(body) });
        const data = await res.json();
        setMessage(res.ok ? `Lisensi dibuat: ${data.license.license_key}` : `Gagal: ${data.error}`);
        if (res.ok) loadLicenses();
    }

    async function createCoupon(e) {
        e.preventDefault();
        const f = e.target;
        const body = {
            app_id: f.app_id.value,
            code: f.code.value,
            discount_type: f.discount_type.value,
            discount_value: Number(f.discount_value.value || 0),
            trial_days: Number(f.trial_days.value || 0),
            max_uses: Number(f.max_uses.value || 1),
            expires_at: f.expires_at.value || null,
        };
        const res = await fetch('/api/admin/coupons', { method: 'POST', headers: authHeaders(), body: JSON.stringify(body) });
        const data = await res.json();
        setMessage(res.ok ? `Kupon dibuat: ${data.coupon.code}` : `Gagal: ${data.error}`);
        if (res.ok) loadCoupons();
    }

    if (!authed) {
        return (
            <main style={{ maxWidth: 320, margin: '80px auto', fontFamily: 'sans-serif' }}>
                <h2>Admin Login — CertGen Pro</h2>
                <input type="password" placeholder="Password admin" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: 8 }} />
                <button onClick={login} style={{ marginTop: 12, padding: 8, width: '100%' }}>Masuk</button>
                {message && <p>{message}</p>}
            </main>
        );
    }

    return (
        <main style={{ maxWidth: 980, margin: '40px auto', fontFamily: 'sans-serif', padding: 16 }}>
            <h1>Admin Dashboard — CertGen Pro</h1>
            <div style={{ marginBottom: 16 }}>
                <button onClick={() => setTab('licenses')} style={{ marginRight: 8, fontWeight: tab === 'licenses' ? 'bold' : 'normal' }}>Lisensi</button>
                <button onClick={() => setTab('coupons')} style={{ marginRight: 8, fontWeight: tab === 'coupons' ? 'bold' : 'normal' }}>Kupon</button>
                <button onClick={() => setTab('downloads')} style={{ fontWeight: tab === 'downloads' ? 'bold' : 'normal' }}>Unduhan 📥</button>
            </div>

            {message && <p style={{ color: '#2563eb', fontWeight: 'bold' }}>{message}</p>}

            {tab === 'licenses' && (
                <>
                    <h3>Buat Lisensi Manual</h3>
                    <form onSubmit={createManualLicense} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
                        <input name="app_id" placeholder="app_id" defaultValue="certgenpro" required />
                        <input name="email" placeholder="email" type="email" required />
                        <input name="whatsapp" placeholder="whatsapp (62...)" />
                        <select name="type">
                            <option value="daily">Harian</option>
                            <option value="monthly">Bulanan</option>
                            <option value="yearly">Tahunan</option>
                            <option value="lifetime">Lifetime</option>
                            <option value="manual">Manual (tanpa expiry)</option>
                        </select>
                        <button type="submit">Buat</button>
                    </form>

                    <div style={{ marginBottom: 16 }}>
                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 6 }}>🔍 Cari Lisensi:</label>
                        <input
                            type="text"
                            placeholder="Ketik email, nomor WA, tanggal, atau kode lisensi..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ width: '100%', padding: 10, boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: 6 }}
                        />
                    </div>

                    {/* ── FITUR BARU: filter cepat status, termasuk "Kedaluwarsa" ── */}
                    <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold', fontSize: 13 }}>Filter Status:</span>
                        {[
                            { id: 'all', label: 'Semua' },
                            { id: 'active', label: 'Aktif' },
                            { id: 'pending', label: 'Pending' },
                            { id: 'expired', label: `Kedaluwarsa ⚠️` },
                        ].map((f) => (
                            <button
                                key={f.id}
                                onClick={() => setStatusFilter(f.id)}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: 20,
                                    border: statusFilter === f.id ? '1px solid #2563eb' : '1px solid #ccc',
                                    background: statusFilter === f.id ? '#2563eb' : '#fff',
                                    color: statusFilter === f.id ? '#fff' : '#111',
                                    fontSize: 12,
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                }}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>

                    {statusFilter === 'expired' && (
                        <div style={{ marginBottom: 12, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: 10 }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 'bold', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={allExpiredSelected}
                                    onChange={() => toggleSelectAllExpired(filteredLicenses)}
                                    disabled={expiredCountInView === 0}
                                />
                                Pilih Semua Kedaluwarsa ({expiredCountInView})
                            </label>
                            <button
                                onClick={deleteSelectedLicenses}
                                disabled={selectedIds.size === 0 || bulkDeleting}
                                style={{
                                    padding: '6px 14px',
                                    borderRadius: 6,
                                    border: 'none',
                                    background: selectedIds.size === 0 ? '#fca5a5' : '#dc2626',
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    fontSize: 12,
                                    cursor: selectedIds.size === 0 ? 'not-allowed' : 'pointer',
                                }}
                            >
                                {bulkDeleting ? 'Menghapus...' : `Hapus Terpilih (${selectedIds.size}) 🗑`}
                            </button>
                        </div>
                    )}

                    <h3>Daftar Lisensi ({filteredLicenses.length})</h3>
                    <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%', fontSize: 13 }}>
                        <thead>
                            <tr style={{ background: '#f3f4f6' }}>
                                {statusFilter === 'expired' && <th style={{ width: 28 }}></th>}
                                <th>Key</th><th>App</th><th>Email</th><th>Type</th><th>Status</th><th>Expires</th><th>HWID</th><th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLicenses.map((l) => {
                                const expired = isLicenseExpired(l);
                                return (
                                    <tr key={l.id} style={expired ? { background: '#fef2f2' } : undefined}>
                                        {statusFilter === 'expired' && (
                                            <td style={{ textAlign: 'center' }}>
                                                {expired && (
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedIds.has(l.id)}
                                                        onChange={() => toggleSelect(l.id)}
                                                    />
                                                )}
                                            </td>
                                        )}
                                        <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{l.license_key}</td>
                                        <td>{l.app_id}</td>
                                        <td>{l.email}</td>
                                        <td style={{ textTransform: 'capitalize' }}>{l.type}</td>
                                        <td>{expired ? 'expired' : l.status}</td>
                                        <td>{l.expires_at ? new Date(l.expires_at).toLocaleDateString('id-ID') : '-'}</td>
                                        <td>{l.hwid ? l.hwid.slice(0, 8) + '...' : '-'}</td>
                                        <td>
                                            <button onClick={() => deleteLicense(l.id, l.license_key)} style={{ color: '#dc2626', fontWeight: 'bold', cursor: 'pointer' }}>
                                                Hapus 🗑
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </>
            )}

            {tab === 'coupons' && (
                <>
                    <h3>Buat Kupon</h3>
                    <form onSubmit={createCoupon} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
                        <input name="app_id" placeholder="app_id" defaultValue="certgenpro" required />
                        <input name="code" placeholder="KODE" required />
                        <select name="discount_type">
                            <option value="percentage">Persentase</option>
                            <option value="fixed">Nominal Tetap</option>
                            <option value="free_trial">Free Trial</option>
                        </select>
                        <input name="discount_value" placeholder="nilai diskon" type="number" />
                        <input name="trial_days" placeholder="hari trial" type="number" />
                        <input name="max_uses" placeholder="maks pemakaian" type="number" defaultValue={1} />
                        <input name="expires_at" placeholder="expires_at" type="date" />
                        <button type="submit">Buat</button>
                    </form>

                    <div style={{ marginBottom: 16 }}>
                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 6 }}>🔍 Cari Kupon:</label>
                        <input
                            type="text"
                            placeholder="Ketik kode kupon, app id, atau jenis diskon..."
                            value={couponSearchQuery}
                            onChange={(e) => setCouponSearchQuery(e.target.value)}
                            style={{ width: '100%', padding: 10, boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: 6 }}
                        />
                    </div>

                    <h3>Daftar Kupon ({filteredCoupons.length})</h3>
                    <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%', fontSize: 13 }}>
                        <thead>
                            <tr style={{ background: '#f3f4f6' }}><th>Code</th><th>App</th><th>Type</th><th>Value</th><th>Used/Max</th><th>Expires</th><th>Aksi</th></tr>
                        </thead>
                        <tbody>
                            {filteredCoupons.map((c) => (
                                <tr key={c.id}>
                                    <td style={{ fontWeight: 'bold' }}>{c.code}</td>
                                    <td>{c.app_id}</td>
                                    <td>{c.discount_type}</td>
                                    <td>{c.discount_type === 'free_trial' ? `${c.trial_days}d` : c.discount_value}</td>
                                    <td>{c.used_count}/{c.max_uses}</td>
                                    <td>{c.expires_at ? new Date(c.expires_at).toLocaleDateString('id-ID') : '-'}</td>
                                    <td>
                                        <button onClick={() => deleteCoupon(c.id, c.code)} style={{ color: '#dc2626', fontWeight: 'bold', cursor: 'pointer' }}>
                                            Hapus 🗑
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

            {tab === 'downloads' && (
                <>
                    <h3>Tambah Berkas Unduhan Baru</h3>
                    <form onSubmit={createDownload} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
                        <input name="app_name" placeholder="Nama Aplikasi (mis. CertGen Pro)" required style={{ minWidth: 180 }} />
                        <input name="version" placeholder="Versi (mis. v1.0.0)" required style={{ minWidth: 100 }} />
                        <input name="download_url" placeholder="URL Unduhan ZIP" required style={{ minWidth: 260 }} />
                        <button type="submit">Tambah Rilis</button>
                    </form>

                    <h3>Daftar Rilis Versi ({downloads.length})</h3>
                    <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%', fontSize: 13 }}>
                        <thead>
                            <tr style={{ background: '#f3f4f6' }}><th>Nama Aplikasi</th><th>Versi</th><th>Tautan Unduh</th><th>Tanggal Ditambahkan</th><th>Aksi</th></tr>
                        </thead>
                        <tbody>
                            {downloads.map((d) => (
                                <tr key={d.id}>
                                    <td style={{ fontWeight: 'bold' }}>{d.app_name}</td>
                                    <td style={{ color: '#2563eb', fontWeight: 'bold' }}>{d.version}</td>
                                    <td style={{ wordBreak: 'break-all' }}>
                                        <a href={d.download_url} target="_blank" rel="noreferrer" style={{ color: '#2563eb' }}>{d.download_url}</a>
                                    </td>
                                    <td>{new Date(d.created_at).toLocaleDateString('id-ID')}</td>
                                    <td>
                                        <button onClick={() => deleteDownload(d.id, d.version)} style={{ color: '#dc2626', fontWeight: 'bold', cursor: 'pointer' }}>
                                            Hapus rilis 🗑
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </main>
    );
}
