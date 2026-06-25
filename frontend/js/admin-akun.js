document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('akun-table-body');
    const searchInput = document.getElementById('search-akun');
    
    let debounceTimer;

    const roleMapRev = { 1: 'admin', 2: 'leads', 3: 'campaign' };

    const getBadgeHTML = (roleInt) => {
        const role = roleMapRev[roleInt] || 'admin';
        let badgeClass = '';
        let dotClass = 'dot-green';
        let roleName = '';

        if (role === 'leads') {
            badgeClass = 'badge-leads'; roleName = 'Leads';
        } else if (role === 'admin') {
            badgeClass = 'badge-admin'; roleName = 'Admin';
        } else if (role === 'campaign') {
            badgeClass = 'badge-campaign'; roleName = 'Campaign'; dotClass = 'dot-gray';
        }

        return `<span class="badge-role ${badgeClass}"><span class="dot ${dotClass}"></span> ${roleName}</span>`;
    };

    const filterRole = document.getElementById('filter-role');

    const fetchAkun = async () => {
        try {
            const q = searchInput ? searchInput.value.trim() : '';
            const role = filterRole ? filterRole.value : '';
            
            let queryUrl = '/akun/search';
            const params = new URLSearchParams();
            if (q) params.append('q', q);
            if (role) params.append('role', role);
            
            if (params.toString()) {
                queryUrl += `?${params.toString()}`;
            }
            
            const data = await api.get(queryUrl);
            renderTable(data);
        } catch (error) {
            console.error("Gagal memuat data akun", error);
            if (tableBody) {
                tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:2rem; color:red;">Gagal memuat data dari server</td></tr>';
            }
        }
    };

    const renderTable = (data) => {
        if (!tableBody) return;
        tableBody.innerHTML = '';
        if (!data || data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:2rem; color:#777;">Data tidak ditemukan</td></tr>';
            return;
        }
        data.forEach((akun, index) => {
            tableBody.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td style="font-weight:600; color:#111;">${akun.username}</td>
                    <td style="font-weight:500;">${akun.nama || '-'}</td>
                    <td style="font-weight:600; color:#111;">${akun.telp || '-'}</td>
                    <td style="color:#555;">••••••••</td>
                    <td>${getBadgeHTML(akun.role)}</td>
                    <td style="text-align: right;">
                        <div class="dropdown-wrapper">
                            <button class="dropdown-toggle" data-dropdown-toggle="dropdown-akun-${akun.id_akun}">
                                <i class="ph ph-dots-three-vertical" style="font-size: 20px;"></i>
                            </button>
                            <div class="dropdown-menu" id="dropdown-akun-${akun.id_akun}">
                                <a href="edit-akun.html?id=${akun.id_akun}" class="dropdown-item">
                                    <i class="ph ph-pencil" style="margin-right: 0.5rem;"></i>Edit
                                </a>
                                <button class="dropdown-item danger btn-delete-akun" data-id="${akun.id_akun}" data-username="${akun.username}">
                                    <i class="ph ph-trash" style="margin-right: 0.5rem;"></i>Hapus
                                </button>
                            </div>
                        </div>
                    </td>
                </tr>
            `;
        });

        // Attach delete handlers
        document.querySelectorAll('.btn-delete-akun').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = parseInt(btn.dataset.id);
                const username = btn.dataset.username;
                if (confirm(`Yakin ingin menghapus akun "${username}"?`)) {
                    try {
                        await api.delete(`/akun/${id}`);
                        showToast(`Akun "${username}" berhasil dihapus`, 'success');
                        fetchAkun();
                    } catch (error) {
                        showToast(`Gagal menghapus akun`, 'error');
                    }
                }
            });
        });
    };

    // Filter Logic
    const handleFilterChange = () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            fetchAkun();
        }, 500);
    };

    if (searchInput) {
        searchInput.addEventListener('input', handleFilterChange);
    }
    if (filterRole) {
        filterRole.addEventListener('change', handleFilterChange);
    }

    // Initial load
    fetchAkun();
});