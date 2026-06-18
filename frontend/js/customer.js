document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('customer-table-body');
    const modal = document.getElementById('modal-customer');
    const form = document.getElementById('form-customer');
    const modalTitle = document.getElementById('modal-title');
    const btnTambah = document.getElementById('btn-tambah-customer');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const btnCancelModal = document.getElementById('btn-cancel-modal');
    const modalError = document.getElementById('modal-error');
    const errorMessage = document.getElementById('error-message');
    const searchInput = document.getElementById('search-customer');
    const btnFilter = document.getElementById('btn-filter');

    let customerData = []; // Cache for searching/filtering

    // Mock Mode Support
    const isMock = api.getToken() === 'mock-token-12345';
    let mockData = [
        { id: 1, nama: "Budi Santoso", telp: "081234567890", email: "budi.santoso@email.com", jenis: "cafe", alamat: "Jl. Sukapura" },
        { id: 2, nama: "Siti Aminah", telp: "085798765432", email: "siti.aminah@email.com", jenis: "retail", alamat: "Jl. Mengger" }
    ];

    const loadCustomers = async () => {
        errorMessage.style.display = 'none';
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Memuat data...</td></tr>';
        
        try {
            if (isMock) {
                customerData = mockData;
            } else {
                const response = await api.get('/customer/get-all');
                customerData = response.customer || [];
            }
            renderTable(customerData);
        } catch (error) {
            errorMessage.style.display = 'block';
            errorMessage.textContent = error.message || 'Gagal memuat data customer.';
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Gagal memuat data</td></tr>';
        }
    };

    const renderTable = (data) => {
        tableBody.innerHTML = '';
        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Data tidak ditemukan</td></tr>';
            return;
        }

        data.forEach((cust, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td style="font-weight:500;">${cust.nama}</td>
                <td>${cust.telp}</td>
                <td>${cust.email || '-'}</td>
                <td style="text-transform:capitalize;">${cust.jenis || '-'}</td>
                <td>
                    <div class="action-icons">
                        <button class="btn-icon btn-edit" data-id="${cust.id}">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button class="btn-icon btn-delete" data-id="${cust.id}">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        document.getElementById('pagination-info').textContent = `Showing 1 to ${data.length} of ${data.length} entries`;

        // Attach event listeners for edit and delete
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => openEditModal(btn.dataset.id));
        });
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', () => deleteCustomer(btn.dataset.id));
        });
    };

    const openModal = () => {
        form.reset();
        document.getElementById('cust-id').value = '';
        modalTitle.textContent = 'Tambah Customer';
        modalError.style.display = 'none';
        modal.classList.add('active');
    };

    const closeModal = () => {
        modal.classList.remove('active');
    };

    const openEditModal = async (id) => {
        openModal();
        modalTitle.textContent = 'Edit Customer';
        
        try {
            let cust = null;
            if (isMock) {
                cust = mockData.find(c => c.id == id);
            } else {
                const response = await api.get(`/customer/get/${id}`);
                cust = response;
            }

            if (cust) {
                document.getElementById('cust-id').value = cust.id;
                document.getElementById('cust-nama').value = cust.nama;
                document.getElementById('cust-telp').value = cust.telp;
                document.getElementById('cust-email').value = cust.email || '';
                document.getElementById('cust-jenis').value = cust.jenis || '';
                document.getElementById('cust-alamat').value = cust.alamat || '';
            }
        } catch (error) {
            alert('Gagal mengambil data detail customer.');
            closeModal();
        }
    };

    const deleteCustomer = async (id) => {
        if (confirm('Yakin Menghapus Customer ini?')) {
            try {
                if (isMock) {
                    mockData = mockData.filter(c => c.id != id);
                } else {
                    await api.delete(`/customer/delete/${id}`);
                }
                alert('Customer Berhasil Dihapus');
                loadCustomers();
            } catch (error) {
                alert(error.data?.message || 'Gagal menghapus data.');
            }
        }
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('cust-id').value;
        const payload = {
            nama: document.getElementById('cust-nama').value,
            telp: document.getElementById('cust-telp').value,
            email: document.getElementById('cust-email').value,
            jenis: document.getElementById('cust-jenis').value,
            alamat: document.getElementById('cust-alamat').value
        };

        // Basic validation
        if (!payload.nama || !payload.telp || !payload.alamat) {
            modalError.textContent = 'gagal menambahkan, isi data alamat dan lain-lain';
            modalError.style.display = 'block';
            return;
        }

        // Email validation if present
        if (payload.email && !payload.email.includes('@')) {
            modalError.textContent = 'gagal menambahkan / mengedit data, periksa format email';
            modalError.style.display = 'block';
            return;
        }

        try {
            if (isMock) {
                if (id) {
                    const index = mockData.findIndex(c => c.id == id);
                    mockData[index] = { ...mockData[index], ...payload };
                } else {
                    payload.id = Date.now();
                    mockData.push(payload);
                }
            } else {
                if (id) {
                    await api.put(`/customer/edit/${id}`, payload);
                } else {
                    await api.post('/customer/add', payload);
                }
            }
            closeModal();
            loadCustomers();
        } catch (error) {
            modalError.textContent = error.data?.message || 'Terjadi kesalahan pada server';
            modalError.style.display = 'block';
        }
    });

    btnTambah.addEventListener('click', openModal);
    btnCloseModal.addEventListener('click', closeModal);
    btnCancelModal.addEventListener('click', closeModal);

    btnFilter.addEventListener('click', () => {
        const keyword = searchInput.value.toLowerCase();
        const jenisFilter = document.getElementById('filter-jenis').value;

        const filteredData = customerData.filter(cust => {
            const matchKeyword = cust.nama.toLowerCase().includes(keyword) || 
                                 cust.email?.toLowerCase().includes(keyword) || 
                                 cust.telp.includes(keyword);
            const matchJenis = jenisFilter ? cust.jenis === jenisFilter : true;
            return matchKeyword && matchJenis;
        });

        renderTable(filteredData);
    });

    // Initial load
    loadCustomers();
});
