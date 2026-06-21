document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('produk-table-body');
    
    let produkData = [
        { id: 1, nama: "Kredit Usaha Tani", sub: "Agricultural Loan", kode: "KUT-2023-01", status: "Active" },
        { id: 2, nama: "Simpanan Sukarela", sub: "Savings Account", kode: "SS-2023-04", status: "Active" },
        { id: 3, nama: "Pembiayaan Traktor", sub: "Equipment Leasing", kode: "PT-2024-02", status: "Draft" },
        { id: 4, nama: "Asuransi Gagal Panen", sub: "Crop Insurance", kode: "AGP-2023-11", status: "Inactive" }
    ];

    const renderTable = (data) => {
        if (!tableBody) return;
        let html = '';
        if (data.length === 0) {
            html = '<tr><td colspan="5" style="text-align:center; padding:2rem; color:#777;">Data tidak ditemukan</td></tr>';
            tableBody.innerHTML = html;
            return;
        }
        data.forEach((p, idx) => {
            const statusClass = `status-${p.status.toLowerCase()}`;
            html += `
                <tr>
                    <td>${idx + 1}</td>
                    <td>
                        <div class="val-bold">${p.nama}</div>
                        <div class="label-xs text-muted">${p.sub}</div>
                    </td>
                    <td>${p.kode}</td>
                    <td><span class="status-pill ${statusClass}">${p.status}</span></td>
                    <td style="text-align: right;">
                        <div class="dropdown-wrapper">
                            <button class="dropdown-toggle" data-dropdown-toggle="dropdown-admin-produk-${p.id}">
                                <i class="ph ph-dots-three-vertical" style="font-size: 20px;"></i>
                            </button>
                            <div class="dropdown-menu" id="dropdown-admin-produk-${p.id}">
                                <a href="edit-produk.html?id=${p.id}" class="dropdown-item">
                                    <i class="ph ph-pencil" style="margin-right: 0.5rem;"></i>Edit
                                </a>
                                <button class="dropdown-item danger btn-delete-produk" data-id="${p.id}" data-nama="${p.nama}">
                                    <i class="ph ph-trash" style="margin-right: 0.5rem;"></i>Hapus
                                </button>
                            </div>
                        </div>
                    </td>
                </tr>
            `;
        });
        tableBody.innerHTML = html;

        // Attach delete handlers
        tableBody.querySelectorAll('.btn-delete-produk').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                const nama = btn.dataset.nama;
                if (confirm(`Yakin ingin menghapus produk "${nama}"?`)) {
                    produkData = produkData.filter(p => p.id !== id);
                    renderTable(produkData);
                    showToast(`Produk "${nama}" berhasil dihapus`, 'success');
                    addNotification(`Produk "${nama}" telah dihapus`);
                }
            });
        });
    };

    renderTable(produkData);
});