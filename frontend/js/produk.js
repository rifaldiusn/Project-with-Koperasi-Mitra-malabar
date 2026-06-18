document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('produk-table-body');
    const searchInput = document.getElementById('search-produk');
    const btnExcel = document.getElementById('btn-input-excel');
    const fileInput = document.getElementById('excel-file');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');

    let produkData = [];

    const isMock = api.getToken() === 'mock-token-12345';
    let mockData = [
        { id: 1, nama: "Kredit Usaha Tani", kode: "KUT-2023-01", status: "Active" },
        { id: 2, nama: "Simpanan Sukarela", kode: "SS-2023-04", status: "Active" },
        { id: 3, nama: "Pembiayaan Traktor", kode: "PT-2024-02", status: "Draft" },
        { id: 4, nama: "Asuransi Gagal Panen", kode: "AGP-2023-11", status: "Inactive" }
    ];

    const loadProduk = async () => {
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Memuat data...</td></tr>';
        
        try {
            if (isMock) {
                produkData = mockData;
            } else {
                const response = await api.get('/produk/get-all');
                produkData = response.produk || [];
            }
            renderTable(produkData);
        } catch (error) {
            errorMessage.style.display = 'block';
            errorMessage.textContent = error.message || 'Gagal memuat data produk.';
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Gagal memuat data</td></tr>';
        }
    };

    const renderTable = (data) => {
        tableBody.innerHTML = '';
        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Data tidak ditemukan</td></tr>';
            return;
        }

        data.forEach((prod, index) => {
            let statusColor = '#E2E3E5';
            let textColor = '#383D41';
            if (prod.status === 'Active' || prod.status === 'active') {
                statusColor = '#D4EDDA'; textColor = '#155724';
            } else if (prod.status === 'Inactive' || prod.status === 'inactive') {
                statusColor = '#F8D7DA'; textColor = '#721C24';
            }

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>
                    <div style="font-weight:600;">${prod.nama}</div>
                    <div style="font-size:0.75rem; color:var(--text-muted);">Product Category</div>
                </td>
                <td>${prod.kode}</td>
                <td>
                    <span style="background:${statusColor}; color:${textColor}; padding:4px 8px; border-radius:12px; font-size:0.75rem; display:inline-flex; align-items:center; gap:4px;">
                        <span style="width:6px; height:6px; border-radius:50%; background-color:${textColor};"></span>
                        ${prod.status}
                    </span>
                </td>
                <td>
                    <div class="action-icons">
                        <a href="produk-detail.html?id=${prod.id}" class="btn-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </a>
                        <button class="btn-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        document.getElementById('pagination-info').textContent = `Showing 1 to ${data.length} of ${data.length} entries`;
    };

    // Excel Upload Logic
    btnExcel.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';

        // Validation for .xlsx (from test plan)
        if (!file.name.endsWith('.xlsx')) {
            errorMessage.textContent = "extensi file tidak didukung";
            errorMessage.style.display = 'block';
            fileInput.value = '';
            return;
        }

        try {
            if (isMock) {
                // Simulate upload success
                setTimeout(() => {
                    successMessage.textContent = "file berhasil diupload";
                    successMessage.style.display = 'block';
                    // clear message after 3 seconds
                    setTimeout(() => { successMessage.style.display = 'none'; }, 3000);
                }, 500);
            } else {
                const formData = new FormData();
                formData.append('file', file);
                const response = await api.postFormData('/file/excel/add', formData);
                successMessage.textContent = response.message || "file berhasil diupload";
                successMessage.style.display = 'block';
            }
        } catch (error) {
            errorMessage.textContent = error.data?.message || 'Gagal mengupload file.';
            errorMessage.style.display = 'block';
        } finally {
            fileInput.value = ''; // Reset input
        }
    });

    searchInput.addEventListener('input', () => {
        const keyword = searchInput.value.toLowerCase();
        const filteredData = produkData.filter(p => 
            p.nama.toLowerCase().includes(keyword) || 
            p.kode.toLowerCase().includes(keyword)
        );
        renderTable(filteredData);
    });

    loadProduk();
});
