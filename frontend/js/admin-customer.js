document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('table-body');
    const searchInput = document.getElementById('search-cust');

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
        data.forEach((cust, index) => {
            tableBody.innerHTML += `
                <tr>
                    <td style="padding:1rem;">${index + 1}</td>
                    <td style="padding:1rem; font-weight:600;">${cust.nama}</td>
                    <td style="padding:1rem; color:#555;">${cust.telp}</td>
                    <td style="padding:1rem; color:#555;">${cust.email}</td>
                    <td style="padding:1rem; text-align:right;">
                        <button class="btn-icon">✏️</button>
                        <button class="btn-icon">🗑️</button>
                    </td>
                </tr>
            `;
        });
    };

    // Filter Logic
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const keyword = e.target.value.toLowerCase();
            const filtered = customers.filter(c => c.nama.toLowerCase().includes(keyword));
            renderTable(filtered);
        });
    }

    renderTable(customers);
});