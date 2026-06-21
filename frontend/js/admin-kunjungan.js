document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('kunjungan-table-body');
    const searchInput = document.getElementById('search-kunjungan');
    
    // Data dummy sesuai desain
    let kunjunganData = [
        { id: 1, nama: "Kunjungan ke Toko A", tgl: "20 Juni 2026", tujuan: "Presentasi Produk Baru" },
        { id: 2, nama: "Kunjungan ke Budi Ahmad", tgl: "12 Okt 2023, 09:00", tujuan: "Penawaran Kredit" },
        { id: 3, nama: "Kunjungan ke Siti Wijaya", tgl: "15 Okt 2023, 14:30", tujuan: "Survei Lokasi" }
    ];

    const renderTable = (data) => {
        if (!tableBody) return;
        tableBody.innerHTML = '';
        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:2rem; color:#777;">Data tidak ditemukan</td></tr>';
            return;
        }
        data.forEach((k, i) => {
            tableBody.innerHTML += `
                <tr>
                    <td>${i+1}</td>
                    <td style="font-weight:600;">${k.nama}</td>
                    <td style="color:#555;">${k.tgl}</td>
                    <td style="color:#555;">${k.tujuan}</td>
                    <td style="text-align:right;">
                        <div class="dropdown-wrapper">
                            <button class="dropdown-toggle" data-dropdown-toggle="dropdown-kunjungan-${k.id}">
                                <i class="ph ph-dots-three-vertical" style="font-size: 20px;"></i>
                            </button>
                            <div class="dropdown-menu" id="dropdown-kunjungan-${k.id}">
                                <a href="edit-kunjungan.html?id=${k.id}" class="dropdown-item">
                                    <i class="ph ph-pencil" style="margin-right: 0.5rem;"></i>Edit
                                </a>
                                <button class="dropdown-item danger btn-delete-kunjungan" data-id="${k.id}" data-nama="${k.nama}">
                                    <i class="ph ph-trash" style="margin-right: 0.5rem;"></i>Hapus
                                </button>
                            </div>
                        </div>
                    </td>
                </tr>
            `;
        });

        // Re-initialize dropdown toggles for newly rendered rows


        // Attach delete handlers
        tableBody.querySelectorAll('.btn-delete-kunjungan').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                const nama = btn.dataset.nama;
                if (confirm(`Yakin ingin menghapus "${nama}"?`)) {
                    kunjunganData = kunjunganData.filter(k => k.id !== id);
                    renderTable(kunjunganData);
                    showToast(`Kunjungan "${nama}" berhasil dihapus`, 'success');
                    addNotification(`Kunjungan "${nama}" telah dihapus`);
                }
            });
        });
    };

    // Search
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const keyword = searchInput.value.toLowerCase();
            const filtered = kunjunganData.filter(k => k.nama.toLowerCase().includes(keyword));
            renderTable(filtered);
        });
    }

    renderTable(kunjunganData);
});