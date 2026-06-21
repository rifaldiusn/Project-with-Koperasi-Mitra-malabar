document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('kunjungan-table-body');
    const modal = document.getElementById('modal-kunjungan');
    const form = document.getElementById('form-kunjungan');
    const modalTitle = document.getElementById('modal-title');
    const btnTambah = document.getElementById('btn-tambah-kunjungan');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const btnCancelModal = document.getElementById('btn-cancel-modal');
    const modalError = document.getElementById('modal-error');
    const errorMessage = document.getElementById('error-message');
    
    // Filters
    const searchInput = document.getElementById('search-kunjungan');
    const dateStart = document.getElementById('filter-date-start');
    const dateEnd = document.getElementById('filter-date-end');
    const btnFilter = document.getElementById('btn-filter');

    // Lokasi
    const btnLokasi = document.getElementById('btn-lokasi');

    let kunjunganData = [];

    const isMock = api.getToken() === 'mock-token-12345';
    let mockData = [
        { id: 1, nama_customer: "Budi Santoso", id_customer: 1, tanggal_kunjungan: "2045-11-22 16:01", tujuan: "Workshop Edukasi Tani" },
        { id: 2, nama_customer: "Siti Aminah", id_customer: 2, tanggal_kunjungan: "2045-11-25 10:30", tujuan: "Penawaran Bibit Baru" }
    ];

    const loadKunjungan = async () => {
        errorMessage.style.display = 'none';
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Memuat data...</td></tr>';
        
        try {
            if (isMock) {
                kunjunganData = mockData;
            } else {
                const response = await api.get('/kunjungan/get-all');
                kunjunganData = response.kunjungan || [];
            }
            renderTable(kunjunganData);
        } catch (error) {
            errorMessage.style.display = 'block';
            errorMessage.textContent = error.message || 'Gagal memuat data kunjungan.';
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Gagal memuat data</td></tr>';
        }
    };

    const formatDateTime = (dtStr) => {
        if (!dtStr) return '-';
        return dtStr.replace('T', ' '); // simple format
    };

    const renderTable = (data) => {
        tableBody.innerHTML = '';
        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Data tidak ditemukan</td></tr>';
            return;
        }

        data.forEach((kunj, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td style="font-weight:500;">${kunj.nama_customer}</td>
                <td>${formatDateTime(kunj.tanggal_kunjungan)}</td>
                <td>${kunj.tujuan || kunj["catatan kunjungan"] || '-'}</td>
                <td style="text-align: right;">
                    <div class="dropdown-wrapper">
                        <button class="dropdown-toggle" data-dropdown-toggle="dropdown-kunjungan-${kunj.id}">
                            <i class="ph ph-dots-three-vertical" style="font-size: 20px;"></i>
                        </button>
                        <div class="dropdown-menu" id="dropdown-kunjungan-${kunj.id}">
                            <a href="edit-kunjungan.html?id=${kunj.id}" class="dropdown-item">
                                <i class="ph ph-pencil" style="margin-right: 0.5rem;"></i>Edit
                            </a>
                            <button class="dropdown-item danger btn-delete-kunjungan" data-id="${kunj.id}">
                                <i class="ph ph-trash" style="margin-right: 0.5rem;"></i>Hapus
                            </button>
                        </div>
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        const paginationInfo = document.getElementById('pagination-info');
        if (paginationInfo) {
            paginationInfo.textContent = `Showing 1 to ${data.length} of ${data.length} entries`;
        }

        document.querySelectorAll('.btn-delete-kunjungan').forEach(btn => {
            btn.addEventListener('click', () => deleteKunjungan(btn.dataset.id));
        });
    };

    const openModal = () => {
        form.reset();
        document.getElementById('kunj-id').value = '';
        modalTitle.textContent = 'Tambah Kunjungan';
        modalError.style.display = 'none';
        modal.classList.add('active');
    };

    const closeModal = () => {
        modal.classList.remove('active');
    };

    const openEditModal = async (id) => {
        openModal();
        modalTitle.textContent = 'Edit Kunjungan';
        
        try {
            let kunj = null;
            if (isMock) {
                kunj = mockData.find(k => k.id == id);
            } else {
                kunj = await api.get(`/kunjungan/get/${id}`);
            }

            if (kunj) {
                document.getElementById('kunj-id').value = kunj.id || id;
                document.getElementById('kunj-customer').value = kunj.id_customer || 1;
                
                // Set datetime-local format
                if (kunj.tanggal_kunjungan) {
                    const dt = new Date(kunj.tanggal_kunjungan);
                    if (!isNaN(dt)) {
                        document.getElementById('kunj-tanggal').value = dt.toISOString().slice(0, 16);
                    } else {
                         document.getElementById('kunj-tanggal').value = kunj.tanggal_kunjungan.replace(' ', 'T');
                    }
                }
                
                document.getElementById('kunj-catatan').value = kunj.tujuan || kunj["catatan kunjungan"] || '';
                
                if (kunj.lokasi) {
                    document.getElementById('kunj-lat').value = kunj.lokasi.lautitude || '';
                    document.getElementById('kunj-long').value = kunj.lokasi.longitude || '';
                }
            }
        } catch (error) {
            alert('Gagal mengambil data detail kunjungan.');
            closeModal();
        }
    };

    const deleteKunjungan = async (id) => {
        if (confirm('Yakin Menghapus Kunjungan?')) {
            try {
                if (isMock) {
                    mockData = mockData.filter(k => k.id != id);
                } else {
                    await api.delete(`/kunjungan/delete/${id}`);
                }
                alert('Kunjungan Berhasil Dihapus');
                loadKunjungan();
            } catch (error) {
                alert(error.data?.message || 'Gagal menghapus data.');
            }
        }
    };

    // Geolocation API User Test
    btnLokasi.addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    alert("Izin Mengambil Lokasi diberikan");
                    document.getElementById('kunj-lat').value = position.coords.latitude.toFixed(6);
                    document.getElementById('kunj-long').value = position.coords.longitude.toFixed(6);
                },
                (error) => {
                    alert("Gagal mengambil lokasi: " + error.message);
                }
            );
        } else {
            alert("Geolocation tidak didukung oleh browser ini.");
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('kunj-id').value;
        const custSelect = document.getElementById('kunj-customer');
        const custName = custSelect.options[custSelect.selectedIndex].text;
        
        const payload = {
            nama_customer: custName,
            id_customer: parseInt(custSelect.value),
            tanggal_kunjungan: document.getElementById('kunj-tanggal').value.replace('T', ' '),
            "catatan kunjungan": document.getElementById('kunj-catatan').value,
            id_bukti_kunjungan: 1, // hardcoded for now, real implementation would upload file first
            lokasi: {
                lautitude: document.getElementById('kunj-lat').value || "0",
                longitude: document.getElementById('kunj-long').value || "0"
            }
        };

        // Basic validation per spec
        if (!payload.id_bukti_kunjungan) { // Simulating the failure condition in PDF
            modalError.textContent = 'isi bukti kunjungan';
            modalError.style.display = 'block';
            return;
        }

        try {
            if (isMock) {
                if (id) {
                    const index = mockData.findIndex(k => k.id == id);
                    mockData[index] = { ...mockData[index], ...payload, tujuan: payload["catatan kunjungan"] };
                } else {
                    payload.id = Date.now();
                    payload.tujuan = payload["catatan kunjungan"];
                    mockData.push(payload);
                }
            } else {
                if (id) {
                    await api.put(`/kunjungan/edit/${id}`, payload);
                } else {
                    await api.post('/kunjungan/add', payload);
                }
            }
            closeModal();
            loadKunjungan();
        } catch (error) {
            modalError.textContent = error.data?.message || 'Terjadi kesalahan pada server';
            modalError.style.display = 'block';
        }
    });

    btnFilter.addEventListener('click', () => {
        const keyword = searchInput.value.toLowerCase();
        const start = dateStart.value;
        const end = dateEnd.value;

        const filteredData = kunjunganData.filter(kunj => {
            const matchKeyword = kunj.nama_customer.toLowerCase().includes(keyword);
            
            let matchDate = true;
            if (start || end) {
                const kunjDate = kunj.tanggal_kunjungan.split(' ')[0]; // extract just YYYY-MM-DD
                if (start && kunjDate < start) matchDate = false;
                if (end && kunjDate > end) matchDate = false;
            }

            return matchKeyword && matchDate;
        });

        renderTable(filteredData);
    });

    btnTambah.addEventListener('click', openModal);
    btnCloseModal.addEventListener('click', closeModal);
    btnCancelModal.addEventListener('click', closeModal);

    loadKunjungan();
});
