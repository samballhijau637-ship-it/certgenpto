// pages/admin/index.js

import { useState, useEffect } from 'react';

export default function AdminDashboard() {
    const [password, setPassword] = useState('');
    const [authed, setAuthed] = useState(false);
    const [tab, setTab] = useState('licenses');
    const [licenses, setLicenses] = useState([]);
    const [coupons, setCoupons] = useState([]);
    const [downloads, setDownloads] = useState([]); // State untuk unduhan
    const [message, setMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [couponSearchQuery, setCouponSearchQuery] = useState(''); // State baru untuk pencarian kupon
    const [expiredOnly, setExpiredOnly] = useState(false); // Filter: tampilkan hanya lisensi yang sudah kadaluarsa
    const [selectedIds, setSelectedIds] = useState([]); // Lisensi yang dicentang untuk hapus massal

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
                body: JSON.stringify({ id }) 
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

    // Fungsi Baru: Hapus Kupon
    async function deleteCoupon(id, code) {
        if (!confirm(`Hapus permanen kupon: ${code}?\nTindakan ini tidak bisa dibatalkan.`)) return;
        try {
            const res = await fetch('/api/admin/coupons', { 
                method: 'DELETE', 
                headers: authHeaders(), 
                body: JSON.stringify({ id }) 
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

    // Fungsi Baru: Tambah Rilis Unduhan Aplikasi
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

    // Fungsi Baru: Hapus Rilis Unduhan Aplikasi
    async function deleteDownload(id, version) {
        if (!confirm(`Hapus permanen rilis versi: ${version}?\nTautan unduhan tidak akan dapat diakses oleh publik.`)) return;
        try {
            const res = await fetch('/api/admin/downloads', { 
                method: 'DELETE', 
                headers: authHeaders(), 
                body: JSON.stringify({ id }) 
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

    function isExpired(l) {
        // Lifetime (99 tahun) dianggap tidak pernah kadaluarsa
        if (l.type === 'lifetime') return false;
        return l.expires_at && new Date(l.expires_at) < new Date();
    }

    const filteredLicenses = licenses.filter((l) => {
        const query = searchQuery.toLowerCase();
        const matchesQuery =
            (l.license_key && l.license_key.toLowerCase().includes(query)) ||
            (l.email && l.email.toLowerCase().includes(query)) ||
            (l.whatsapp && l.whatsapp.toLowerCase().includes(query)) ||
            (l.created_at && l.created_at.includes(query)) ||
            (l.expires_at && l.expires_at.includes(query));
        if (!matchesQuery) return false;
        if (expiredOnly) return isExpired(l);
        return true;
    });

    const expiredCount = licenses.filter(isExpired).length;
    const allVisibleSelected = filteredLicenses.length > 0 && filteredLicenses.every((l) => selectedIds.includes(l.id));

    function toggleSelectOne(id) {
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    }

    function toggleSelectAllVisible() {
        if (allVisibleSelected) {
            setSelectedIds((prev) => prev.filter((id) => !filteredLicenses.some((l) => l.id === id)));
        } else {
            setSelectedIds((prev) => Array.from(new Set([...prev, ...filteredLicenses.map((l) => l.id)])));
        }
    }

    async function deleteSelectedLicenses() {
        if (selectedIds.length === 0) return;
        if (!confirm(`Hapus permanen ${selectedIds.length} lisensi terpilih?\nTindakan ini tidak bisa dibatalkan.`)) return;
        try {
            const res = await fetch('/api/admin/licenses', {
                method: 'DELETE',
                headers: authHeaders(),
                body: JSON.stringify({ ids: selectedIds }),
            });
            const data = await res.json();
            if (res.ok) {
                setMessage(data.message || `${selectedIds.length} lisensi berhasil dihapus.`);
                setSelectedIds([]);
                loadLicenses();
            } else {
                setMessage(`Gagal menghapus massal: ${data.error}`);
            }
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        }
    }

    // Logika Filter Kupon Baru
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
                <h2>Admin Login</h2>
                <input type="password" placeholder="Password admin" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: 8 }} />
                <button onClick={login} style={{ marginTop: 12, padding: 8, width: '100%' }}>Masuk</button>
                {message && <p>{message}</p>}
            </main>
        );
    }

    return (
        <main style={{ maxWidth: 980, margin: '40px auto', fontFamily: 'sans-serif', padding: 16 }}>
            <h1>🔷 CertGen Pro — Admin Dashboard</h1>
            <div style={{ marginBottom: 16 }}>
                <button onClick={() => setTab('licenses')} style={{ marginRight: 8, fontWeight: tab === 'licenses' ? 'bold' : 'normal' }}>Lisensi</button>
                <button onClick={() => setTab('coupons')} style={{ marginRight: 8, fontWeight: tab === 'coupons' ? 'bold' : 'normal' }}>Kupon</button>
                <button onClick={() => setTab('downloads')} style={{ fontWeight: tab === 'downloads' ? 'bold' : 'normal' }}>Unduhan 📥</button>
            </div>

            {message && <p style={{ color: '#10b981', fontWeight: 'bold' }}>{message}</p>}

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

                    <div style={{ marginBottom: 16, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                        <div style={{ flex: '1 1 260px' }}>
                            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 6 }}>🔍 Cari Lisensi:</label>
                            <input
                                type="text"
                                placeholder="Ketik email, nomor WA, tanggal, atau kode lisensi..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ width: '100%', padding: 10, boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: 6 }}
                            />
                        </div>
                        <button
                            onClick={() => setExpiredOnly((v) => !v)}
                            style={{
                                padding: '10px 14px', borderRadius: 6, border: '1px solid ' + (expiredOnly ? '#dc2626' : '#ccc'),
                                background: expiredOnly ? '#fee2e2' : '#fff', color: expiredOnly ? '#dc2626' : '#111',
                                fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap',
                            }}
                        >
                            ⏰ {expiredOnly ? 'Menampilkan Kadaluarsa' : `Tampilkan Kadaluarsa (${expiredCount})`}
                        </button>
                        {selectedIds.length > 0 && (
                            <button
                                onClick={deleteSelectedLicenses}
                                style={{ padding: '10px 14px', borderRadius: 6, border: '1px solid #dc2626', background: '#dc2626', color: '#fff', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' }}
                            >
                                🗑 Hapus {selectedIds.length} Terpilih
                            </button>
                        )}
                    </div>

                    <h3>Daftar Lisensi ({filteredLicenses.length})</h3>
                    <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%', fontSize: 13 }}>
                        <thead>
                            <tr style={{ background: '#f3f4f6' }}>
                                <th><input type="checkbox" checked={allVisibleSelected} onChange={toggleSelectAllVisible} title="Pilih semua yang tampil" /></th>
                                <th>Key</th><th>App</th><th>Email</th><th>Type</th><th>Status</th><th>Expires</th><th>HWID</th><th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLicenses.map((l) => {
                                const expired = isExpired(l);
                                return (
                                    <tr key={l.id} style={expired ? { background: '#fef2f2' } : undefined}>
                                        <td style={{ textAlign: 'center' }}>
                                            <input type="checkbox" checked={selectedIds.includes(l.id)} onChange={() => toggleSelectOne(l.id)} />
                                        </td>
                                        <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{l.license_key}</td>
                                        <td>{l.app_id}</td>
                                        <td>{l.email}</td>
                                        <td style={{ textTransform: 'capitalize' }}>{l.type}</td>
                                        <td>{l.status}</td>
                                        <td style={{ color: expired ? '#dc2626' : undefined, fontWeight: expired ? 'bold' : undefined }}>
                                            {l.expires_at ? new Date(l.expires_at).toLocaleDateString('id-ID') : '-'} {expired ? '⚠️' : ''}
                                        </td>
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

                    {/* Fitur Baru: Kolom Filter Pencarian Kupon */}
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
                                    {/* Fitur Baru: Kolom Tombol Hapus Kupon */}
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

            {/* TAB BARU: MANAJEMEN UNDUHAN */}
            {tab === 'downloads' && (
                <>
                    <h3>Tambah Berkas Unduhan Baru</h3>
                    <form onSubmit={createDownload} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
                        <input name="app_name" placeholder="Nama Aplikasi (mis. SVG Motion)" required style={{ minWidth: 180 }} />
                        <input name="version" placeholder="Versi (mis. v2.5.7)" required style={{ minWidth: 100 }} />
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
                                    <td style={{ color: '#3b82f6', fontWeight: 'bold' }}>{d.version}</td>
                                    <td style={{ wordBreak: 'break-all' }}>
                                        <a href={d.download_url} target="_blank" rel="noreferrer" style={{ color: '#3b82f6' }}>{d.download_url}</a>
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