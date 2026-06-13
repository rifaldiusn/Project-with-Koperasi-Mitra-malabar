document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('riwayat-table-body');

    // Karena tidak ada API terdefinisi di PDF untuk Riwayat, kita gunakan Mock Data murni.
    let mockData = [
        { id: 1, waktu: "2026-06-13 14:30:00", pengguna: "admin", modul: "Produk", aktivitas: "Menambahkan variasi 'Premium' ke produk 'Kopi Arabika Malabar'" },
        { id: 2, waktu: "2026-06-13 14:15:22", pengguna: "admin", modul: "Campaign", aktivitas: "Mengedit Campaign 'Panen Raya Malabar 2024'" },
        { id: 3, waktu: "2026-06-13 13:45:10", pengguna: "admin", modul: "Kunjungan", aktivitas: "Menambahkan kunjungan ke 'Budi Santoso'" },
        { id: 4, waktu: "2026-06-13 10:00:05", pengguna: "admin", modul: "Akun", aktivitas: "Login ke dalam sistem" }
    ];

    const loadRiwayat = () => {
        tableBody.innerHTML = '';
        if (mockData.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Data tidak ditemukan</td></tr>';
            return;
        }

        mockData.forEach((log) => {
            let badgeColor = '#E2E3E5';
            let textColor = '#383D41';

            if (log.modul === 'Produk') { badgeColor = '#D1ECF1'; textColor = '#0C5460'; }
            else if (log.modul === 'Campaign') { badgeColor = '#D4EDDA'; textColor = '#155724'; }
            else if (log.modul === 'Kunjungan') { badgeColor = '#FFF3CD'; textColor = '#856404'; }

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="color:var(--text-muted); font-size:0.75rem;">${log.waktu}</td>
                <td style="font-weight:500;">${log.pengguna}</td>
                <td><span style="background:${badgeColor}; color:${textColor}; padding:2px 6px; border-radius:4px; font-size:0.75rem;">${log.modul}</span></td>
                <td>${log.aktivitas}</td>
            `;
            tableBody.appendChild(tr);
        });

        document.getElementById('pagination-info').textContent = `Showing 1 to ${mockData.length} of ${mockData.length} entries`;
    };

    loadRiwayat();
});
