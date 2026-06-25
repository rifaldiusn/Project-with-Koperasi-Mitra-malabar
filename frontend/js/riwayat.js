document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('riwayat-table-body');
    const paginationInfo = document.getElementById('pagination-info');

    const formatDate = (isoStr) => {
        if (!isoStr) return '-';
        const d = new Date(isoStr);
        return d.toLocaleString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const getModulName = (path) => {
        if (!path) return 'Sistem';
        const p = path.toLowerCase();
        if (p.includes('/produk')) return 'Produk';
        if (p.includes('/campaign')) return 'Campaign';
        if (p.includes('/kunjungan')) return 'Kunjungan';
        if (p.includes('/akun') || p.includes('/login')) return 'Akun';
        if (p.includes('/variasi')) return 'Variasi';
        if (p.includes('/data') || p.includes('/pesan') || p.includes('/penjualan')) return 'Statistik';
        return 'Sistem';
    };

    const loadRiwayat = async () => {
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Memuat data...</td></tr>';
        
        try {
            const isMock = !api.getToken() || api.getToken().startsWith('mock-token');
            if (isMock) throw new Error("Mock");
            
            const logs = await api.get('/log/');
            
            tableBody.innerHTML = '';
            if (!logs || logs.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Data tidak ditemukan</td></tr>';
                if (paginationInfo) paginationInfo.textContent = 'Showing 0 entries';
                return;
            }

            // Urutkan dari yang terbaru
            logs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            logs.forEach((log) => {
                const modulName = getModulName(log.path);
                
                let badgeColor = '#E2E3E5';
                let textColor = '#383D41';

                if (modulName === 'Produk') { badgeColor = '#D1ECF1'; textColor = '#0C5460'; }
                else if (modulName === 'Campaign') { badgeColor = '#D4EDDA'; textColor = '#155724'; }
                else if (modulName === 'Kunjungan') { badgeColor = '#FFF3CD'; textColor = '#856404'; }
                else if (modulName === 'Statistik') { badgeColor = '#CCE5FF'; textColor = '#004085'; }
                else if (modulName === 'Variasi') { badgeColor = '#F8D7DA'; textColor = '#721C24'; }

                const aktivitasStr = `[${log.method || 'GET'}] ${log.path || '-'}`;
                const penggunaStr = log.id_akun ? `User ID: ${log.id_akun}` : 'Sistem';

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td style="color:var(--text-muted); font-size:0.75rem;">${formatDate(log.created_at)}</td>
                    <td style="font-weight:500;">${penggunaStr}</td>
                    <td><span style="background:${badgeColor}; color:${textColor}; padding:2px 6px; border-radius:4px; font-size:0.75rem;">${modulName}</span></td>
                    <td>${aktivitasStr} <span style="font-size: 0.7rem; color: #888;">(Status: ${log.status_code || '-'})</span></td>
                `;
                tableBody.appendChild(tr);
            });

            if (paginationInfo) {
                paginationInfo.textContent = `Showing 1 to ${logs.length} of ${logs.length} entries`;
            }

        } catch (err) {
            console.error(err);
            tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:red;">Gagal memuat log aktivitas</td></tr>';
        }
    };

    loadRiwayat();
});
