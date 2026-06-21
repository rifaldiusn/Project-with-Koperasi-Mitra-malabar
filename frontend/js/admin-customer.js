document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('table-body');
    const searchInput = document.getElementById('search-cust');
    const filterStatus = document.getElementById('filter-status');

    // Data Mockup Sesuai Figma + Link Google Maps
    let customers = [
        { id: 1, nama: "Budi Santoso", telp: "+62 812-3456-7890", email: "budi.santoso@email.com", link: "https://maps.app.goo.gl/abc123" },
        { id: 2, nama: "Siti Aminah", telp: "+62 857-9876-5432", email: "siti.aminah@email.com", link: "https://maps.app.goo.gl/def456" },
        { id: 3, nama: "Agus Wijaya", telp: "+62 811-2233-4455", email: "agus.wijaya@email.com", link: "https://maps.app.goo.gl/ghi789" },
        { id: 4, nama: "Dewi Lestari", telp: "+62 822-5566-7788", email: "dewi.lestari@email.com", link: "https://maps.app.goo.gl/jkl012" },
        { id: 5, nama: "Hendra Gunawan", telp: "+62 813-9988-7766", email: "hendra.g@email.com", link: "" }
    ];

    const renderTable = (data) => {
        tableBody.innerHTML = '';
        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:2rem; color:#777;">Data tidak ditemukan</td></tr>';
            return;
        }
        data.forEach((cust, index) => {
            const linkHTML = cust.link 
                ? `<a href="${cust.link}" target="_blank" rel="noopener noreferrer" style="color:#6D8A21; text-decoration:none; display:inline-flex; align-items:center; gap:4px;" title="${cust.link}"><i class="ph ph-map-pin" style="font-size:16px;"></i> Lihat Maps</a>`
                : '<span style="color:#aaa;">-</span>';

            tableBody.innerHTML += `
                <tr>
                    <td style="padding:1rem;">${index + 1}</td>
                    <td style="padding:1rem; font-weight:600;">${cust.nama}</td>
                    <td style="padding:1rem; color:#555;">${cust.telp}</td>
                    <td style="padding:1rem; color:#555;">${cust.email}</td>
                    <td style="padding:1rem;">${linkHTML}</td>
                    <td style="padding:1rem; text-align:right;">
                        <div class="dropdown-wrapper">
                            <button class="dropdown-toggle" data-dropdown-toggle="dropdown-cust-${cust.id}">
                                <i class="ph ph-dots-three-vertical" style="font-size: 20px;"></i>
                            </button>
                            <div class="dropdown-menu" id="dropdown-cust-${cust.id}">
                                <a href="edit-customer.html?id=${cust.id}" class="dropdown-item">
                                    <i class="ph ph-pencil" style="margin-right: 0.5rem;"></i>Edit
                                </a>
                                <button class="dropdown-item danger btn-delete-cust" data-id="${cust.id}" data-nama="${cust.nama}">
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
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                const nama = btn.dataset.nama;
                if (confirm(`Yakin ingin menghapus customer "${nama}"?`)) {
                    customers = customers.filter(c => c.id !== id);
                    renderTable(customers);
                    showToast(`Customer "${nama}" berhasil dihapus`, 'success');
                    addNotification(`Customer "${nama}" telah dihapus`);
                }
            });
        });

        // Update pagination info
        const pageInfo = document.getElementById('page-info');
        if (pageInfo) {
            pageInfo.textContent = `Showing 1 to ${data.length} of ${data.length} entries`;
        }
    };

    // Search filter
    const applyFilters = () => {
        const keyword = searchInput ? searchInput.value.toLowerCase() : '';
        const filtered = customers.filter(c => 
            c.nama.toLowerCase().includes(keyword) ||
            c.email.toLowerCase().includes(keyword) ||
            c.telp.includes(keyword)
        );
        renderTable(filtered);
    };

    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }

    if (filterStatus) {
        filterStatus.addEventListener('change', applyFilters);
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
        document.querySelectorAll('.dropdown-menu').forEach(menu => menu.classList.remove('active'));
    });

    renderTable(customers);
});