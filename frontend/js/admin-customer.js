document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('table-body');
    const searchInput = document.getElementById('search-cust');
    const filterStatus = document.getElementById('filter-status');

    let customers = [];

    const loadCustomers = async () => {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:2rem;">Memuat data...</td></tr>';
        try {
            const data = await api.get('/customer/');
            customers = data || [];
            renderTable(customers);
        } catch (err) {
            console.error(err);
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:2rem; color:red;">Gagal memuat data customer</td></tr>';
        }
    };

    const renderTable = (data) => {
        tableBody.innerHTML = '';
        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:2rem; color:#777;">Data tidak ditemukan</td></tr>';
            return;
        }
        data.forEach((cust, index) => {
            const linkHTML = cust.link_gmaps 
                ? `<a href="${cust.link_gmaps}" target="_blank" rel="noopener noreferrer" style="color:#6D8A21; text-decoration:none; display:inline-flex; align-items:center; gap:4px;" title="${cust.link_gmaps}"><i class="ph ph-map-pin" style="font-size:16px;"></i> Lihat Maps</a>`
                : '<span style="color:#aaa;">-</span>';

            tableBody.innerHTML += `
                <tr>
                    <td style="padding:1rem;">${index + 1}</td>
                    <td style="padding:1rem; font-weight:600;">${cust.nama || '-'}</td>
                    <td style="padding:1rem; color:#555;">${cust.telp || '-'}</td>
                    <td style="padding:1rem; color:#555;">${cust.email || '-'}</td>
                    <td style="padding:1rem;">${linkHTML}</td>
                    <td style="padding:1rem; text-align:right;">
                        <div class="dropdown-wrapper">
                            <button class="dropdown-toggle" data-dropdown-toggle="dropdown-cust-${cust.id_customer}">
                                <i class="ph ph-dots-three-vertical" style="font-size: 20px;"></i>
                            </button>
                            <div class="dropdown-menu" id="dropdown-cust-${cust.id_customer}">
                                <a href="edit-customer.html?id=${cust.id_customer}" class="dropdown-item">
                                    <i class="ph ph-pencil" style="margin-right: 0.5rem;"></i>Edit
                                </a>
                                <button class="dropdown-item danger btn-delete-cust" data-id="${cust.id_customer}" data-nama="${cust.nama}">
                                    <i class="ph ph-trash" style="margin-right: 0.5rem;"></i>Hapus
                                </button>
                            </div>
                        </div>
                    </td>
                </tr>
            `;
        });

        // Attach delete handlers
        document.querySelectorAll('.btn-delete-cust').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = parseInt(btn.dataset.id);
                const nama = btn.dataset.nama;
                if (confirm(`Yakin ingin menghapus customer "${nama}"?`)) {
                    try {
                        await api.delete(`/customer/${id}`);
                        showToast(`Customer "${nama}" berhasil dihapus`, 'success');
                        loadCustomers();
                    } catch (err) {
                        showToast(`Gagal menghapus customer: ${err.message}`, 'error');
                    }
                }
            });
        });

        // Update pagination info
        const pageInfo = document.getElementById('page-info');
        if (pageInfo) {
            pageInfo.textContent = `Showing 1 to ${data.length} of ${data.length} entries`;
        }
    };

    let searchTimeout = null;

    const performSearch = async () => {
        const keyword = searchInput ? searchInput.value.trim() : '';
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:2rem;">Mencari data...</td></tr>';
        try {
            let data = [];
            if (keyword) {
                data = await api.get(`/customer/search?q=${encodeURIComponent(keyword)}`);
            } else {
                data = await api.get('/customer/');
            }
            customers = data || [];
            renderTable(customers);
        } catch (err) {
            console.error(err);
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:2rem; color:red;">Gagal mencari data customer</td></tr>';
        }
    };

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(performSearch, 500); // 500ms debounce
        });
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
        document.querySelectorAll('.dropdown-menu').forEach(menu => menu.classList.remove('active'));
    });

    loadCustomers();
});