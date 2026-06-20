document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('akun-table-body');
    const searchInput = document.getElementById('search-akun');

    // Data Mockup Sesuai Screenshot Figma
    let akunData = [
        { id: 1, username: "syafi22", nama: "Syafiq Gunawan", telp: "08555555444", pass: "••••••••", role: "leads" },
        { id: 2, username: "rashRtur", nama: "Syafiq Gunawan", telp: "08555555444", pass: "••••••••", role: "admin" },
        { id: 3, username: "hhgg11", nama: "Syafiq Gunawan", telp: "08555555444", pass: "••••••••", role: "campaign" },
        { id: 4, username: "u7ytt", nama: "Syafiq", telp: "08555555444", pass: "••••••••", role: "leads" }
    ];

    const getBadgeHTML = (role) => {
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

    const renderTable = (data) => {
        tableBody.innerHTML = '';
        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:2rem; color:#777;">Data tidak ditemukan</td></tr>';
            return;
        }
        data.forEach((akun, index) => {
            tableBody.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td style="font-weight:600; color:#111;">${akun.username}</td>
                    <td style="font-weight:500;">${akun.nama}</td>
                    <td style="font-weight:600; color:#111;">${akun.telp}</td>
                    <td style="color:#555;">${akun.pass}</td>
                    <td>${getBadgeHTML(akun.role)}</td>
                    <td style="text-align: right;">
                        <a href="edit-akun.html?id=${akun.id}" class="btn-icon" title="Edit"><i class="ph ph-pencil-simple" style="font-size:18px;"></i></a>
                        <button class="btn-icon btn-delete-akun" data-id="${akun.id}" data-username="${akun.username}" title="Hapus"><i class="ph ph-trash" style="font-size:18px; color:var(--danger);"></i></button>
                    </td>
                </tr>
            `;
        });

        // Attach delete handlers
        document.querySelectorAll('.btn-delete-akun').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                const username = btn.dataset.username;
                if (confirm(`Yakin ingin menghapus akun "${username}"?`)) {
                    akunData = akunData.filter(a => a.id !== id);
                    renderTable(akunData);
                    showToast(`Akun "${username}" berhasil dihapus`, 'success');
                    addNotification(`Akun "${username}" telah dihapus`);
                }
            });
        });
    };

    // Filter Logic
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const keyword = e.target.value.toLowerCase();
            const filtered = akunData.filter(a => 
                a.username.toLowerCase().includes(keyword) || 
                a.nama.toLowerCase().includes(keyword)
            );
            renderTable(filtered);
        });
    }

    renderTable(akunData);
});