document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('akun-table-body');
    const searchInput = document.getElementById('search-akun');

    // Data Mockup Sesuai Screenshot Figma
    let akunData = [
        { id: 1, username: "syafi22", nama: "Syafiq Gunawan", telp: "08555555444", pass: "asikbanget", role: "leads" },
        { id: 2, username: "rashRtur", nama: "Syafiq Gunawan", telp: "08555555444", pass: "weef", role: "admin" },
        { id: 3, username: "hhgg11", nama: "Syafiq Gunawan", telp: "08555555444", pass: "lockuo", role: "campaign" },
        { id: 4, username: "u7ytt", nama: "Syafiq", telp: "08555555444", pass: "hbhee", role: "leads" }
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
                        <a href="edit-akun.html?id=${akun.id}" class="btn-icon" title="Edit">✏️</a>
                        <button class="btn-icon" onclick="deleteAkun(${akun.id})" title="Hapus">🗑️</button>
                    </td>
                </tr>
            `;
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

    // Delete Logic
    window.deleteAkun = (id) => {
        if(confirm('Yakin ingin menghapus akun ini?')) {
            akunData = akunData.filter(a => a.id !== id);
            renderTable(akunData);
        }
    };

    renderTable(akunData);
});