document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('table-body');
    const searchInput = document.getElementById('search-cust');
    const filterStatus = document.getElementById('filter-status');

    // Data Mockup Sesuai Figma
    let customers = [
        { id: 1, nama: "Budi Santoso", telp: "+62 812-3456-7890", email: "budi.santoso@email.com" },
        { id: 2, nama: "Siti Aminah", telp: "+62 857-9876-5432", email: "siti.aminah@email.com" },
        { id: 3, nama: "Agus Wijaya", telp: "+62 811-2233-4455", email: "agus.wijaya@email.com" },
        { id: 4, nama: "Dewi Lestari", telp: "+62 822-5566-7788", email: "dewi.lestari@email.com" },
        { id: 5, nama: "Hendra Gunawan", telp: "+62 813-9988-7766", email: "hendra.g@email.com" }
    ];

    const renderTable = (data) => {
        tableBody.innerHTML = '';
        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:2rem; color:#777;">Data tidak ditemukan</td></tr>';
            return;
        }
        data.forEach((cust, index) => {
            tableBody.innerHTML += `
                <tr>
                    <td style="padding:1rem;">${index + 1}</td>
                    <td style="padding:1rem; font-weight:600;">${cust.nama}</td>
                    <td style="padding:1rem; color:#555;">${cust.telp}</td>
                    <td style="padding:1rem; color:#555;">${cust.email}</td>
                    <td style="padding:1rem; text-align:right;">
                        <a href="edit-customer.html?id=${cust.id}" class="btn-icon" title="Edit">
                            <i class="ph ph-pencil-simple" style="font-size:18px;"></i>
                        </a>
                        <button class="btn-icon btn-delete-cust" data-id="${cust.id}" data-nama="${cust.nama}" title="Hapus">
                            <i class="ph ph-trash" style="font-size:18px; color:var(--danger);"></i>
                        </button>
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

    renderTable(customers);
});