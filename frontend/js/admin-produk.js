document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('produk-table-body');
    
    const produkData = [
        { id: 1, nama: "Kredit Usaha Tani", sub: "Agricultural Loan", kode: "KUT-2023-01", status: "Active" },
        { id: 2, nama: "Simpanan Sukarela", sub: "Savings Account", kode: "SS-2023-04", status: "Active" },
        { id: 3, nama: "Pembiayaan Traktor", sub: "Equipment Leasing", kode: "PT-2024-02", status: "Draft" },
        { id: 4, nama: "Asuransi Gagal Panen", sub: "Crop Insurance", kode: "AGP-2023-11", status: "Inactive" }
    ];

    if (tableBody) {
        let html = '';
        produkData.forEach((p, idx) => {
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
                        <a href="edit-produk.html?id=${p.id}" class="btn-icon"><i class="ph ph-pencil-simple"></i></a>
                        <button class="btn-icon"><i class="ph ph-trash"></i></button>
                    </td>
                </tr>
            `;
        });
        tableBody.innerHTML = html;
    }
});