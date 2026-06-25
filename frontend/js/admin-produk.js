document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('produk-table-body');
    const searchInput = document.getElementById('search-produk');
    
    let debounceTimer;

    const fetchProduk = async () => {
        try {
            const q = searchInput ? searchInput.value.trim() : '';
            
            let queryUrl = '/produk/search?';
            const params = new URLSearchParams();
            if (q) params.append('q', q);
            
            const data = await api.get(queryUrl + params.toString());
            renderTable(data);
        } catch (error) {
            console.error("Gagal memuat data produk", error);
            if (tableBody) {
                tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:2rem; color:red;">Gagal memuat data dari server</td></tr>';
            }
        }
    };

    const renderTable = (data) => {
        if (!tableBody) return;
        let html = '';
        if (!data || data.length === 0) {
            html = '<tr><td colspan="5" style="text-align:center; padding:2rem; color:#777;">Data tidak ditemukan</td></tr>';
            tableBody.innerHTML = html;
            return;
        }
        data.forEach((p, idx) => {
            const statusLabel = p.status || 'Active';
            const statusClass = `status-${statusLabel.toLowerCase()}`;
            html += `
                <tr>
                    <td>${idx + 1}</td>
                    <td>
                        <div class="val-bold">${p.nama}</div>
                    </td>
                    <td>${p.kode}</td>
                    <td><span class="status-pill ${statusClass}">${statusLabel}</span></td>
                    <td style="text-align: right;">
                        <div class="dropdown-wrapper">
                            <button class="dropdown-toggle" data-dropdown-toggle="dropdown-admin-produk-${p.id_produk}">
                                <i class="ph ph-dots-three-vertical" style="font-size: 20px;"></i>
                            </button>
                            <div class="dropdown-menu" id="dropdown-admin-produk-${p.id_produk}">
                                <a href="edit-produk.html?id=${p.id_produk}" class="dropdown-item">
                                    <i class="ph ph-pencil" style="margin-right: 0.5rem;"></i>Edit
                                </a>
                                <button class="dropdown-item danger btn-delete-produk" data-id="${p.id_produk}" data-nama="${p.nama}">
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
            btn.addEventListener('click', async () => {
                const id = parseInt(btn.dataset.id);
                const nama = btn.dataset.nama;
                if (confirm(`Yakin ingin menghapus produk "${nama}"?`)) {
                    try {
                        await api.delete(`/produk/${id}`);
                        showToast(`Produk "${nama}" berhasil dihapus`, 'success');
                        fetchProduk();
                    } catch (error) {
                        showToast(`Gagal menghapus produk`, 'error');
                    }
                }
            });
        });
    };

    const handleSearch = () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            fetchProduk();
        }, 500);
    };

    if (searchInput) searchInput.addEventListener('input', handleSearch);

    // Initial fetch
    fetchProduk();
});