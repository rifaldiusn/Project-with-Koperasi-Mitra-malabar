document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('kunjungan-table-body');
    const searchInput = document.getElementById('search-kunjungan');
    const dateStartInput = document.getElementById('date-start');
    const dateEndInput = document.getElementById('date-end');
    
    let debounceTimer;

    const fetchKunjungan = async () => {
        try {
            const q = searchInput ? searchInput.value.trim() : '';
            const start = dateStartInput ? dateStartInput.value : '';
            const end = dateEndInput ? dateEndInput.value : '';
            
            let queryUrl = '/kunjungan/search?';
            const params = new URLSearchParams();
            if (q) params.append('q', q);
            if (start) params.append('start_date', start);
            if (end) params.append('end_date', end);
            
            const data = await api.get(queryUrl + params.toString());
            renderTable(data);
        } catch (error) {
            console.error("Gagal memuat data kunjungan", error);
            if (tableBody) {
                tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:2rem; color:red;">Gagal memuat data dari server</td></tr>';
            }
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const d = new Date(dateStr);
        return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const renderTable = (data) => {
        if (!tableBody) return;
        tableBody.innerHTML = '';
        if (!data || data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:2rem; color:#777;">Data tidak ditemukan</td></tr>';
            return;
        }
        data.forEach((k, i) => {
            const customerName = k.customer ? k.customer.nama : '-';
            const tujuan = k.catatan || '-';
            const tanggal = formatDate(k.tanggal);

            tableBody.innerHTML += `
                <tr>
                    <td>${i+1}</td>
                    <td style="font-weight:600;">${k.nama}</td>
                    <td style="color:#555;">${customerName}</td>
                    <td style="color:#555;">${tanggal}</td>
                    <td style="color:#555;">${tujuan}</td>
                    <td style="text-align:right;">
                        <div class="dropdown-wrapper">
                            <button class="dropdown-toggle" data-dropdown-target="dropdown-kunjungan-${k.id_kunjungan}">
                                <i class="ph ph-dots-three-vertical" style="font-size: 20px;"></i>
                            </button>
                            <div class="dropdown-menu" id="dropdown-kunjungan-${k.id_kunjungan}">
                                <a href="detail-kunjungan.html?id=${k.id_kunjungan}" class="dropdown-item">
                                    <i class="ph ph-eye" style="margin-right: 0.5rem;"></i>Lihat Detail
                                </a>
                                <a href="edit-kunjungan.html?id=${k.id_kunjungan}" class="dropdown-item">
                                    <i class="ph ph-pencil" style="margin-right: 0.5rem;"></i>Edit
                                </a>
                                <button class="dropdown-item danger btn-delete-kunjungan" data-id="${k.id_kunjungan}" data-nama="${k.nama}">
                                    <i class="ph ph-trash" style="margin-right: 0.5rem;"></i>Hapus
                                </button>
                            </div>
                        </div>
                    </td>
                </tr>
            `;
        });

        // Attach delete handlers
        tableBody.querySelectorAll('.btn-delete-kunjungan').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = parseInt(btn.dataset.id);
                const nama = btn.dataset.nama;
                if (confirm(`Yakin ingin menghapus "${nama}"?`)) {
                    try {
                        await api.delete(`/kunjungan/${id}`);
                        showToast(`Kunjungan "${nama}" berhasil dihapus`, 'success');
                        fetchKunjungan();
                    } catch (error) {
                        showToast(`Gagal menghapus kunjungan`, 'error');
                    }
                }
            });
        });
    };

    const handleFilterChange = () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            fetchKunjungan();
        }, 500);
    };

    if (searchInput) searchInput.addEventListener('input', handleFilterChange);
    if (dateStartInput) dateStartInput.addEventListener('change', handleFilterChange);
    if (dateEndInput) dateEndInput.addEventListener('change', handleFilterChange);

    // Initial load
    fetchKunjungan();
});