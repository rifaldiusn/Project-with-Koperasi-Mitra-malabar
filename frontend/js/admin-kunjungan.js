document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('kunjungan-table-body');
    
    // Data dummy sesuai desain
    const kunjunganData = [
        { id: 1, nama: "Budi Ahmad", tgl: "12 Okt 2023, 09:00", tujuan: "Penawaran Kredit" },
        { id: 2, nama: "Siti Wijaya", tgl: "15 Okt 2023, 14:30", tujuan: "Survei Lokasi" }
    ];

    tableBody.innerHTML = kunjunganData.map((k, i) => `
        <tr>
            <td>${i+1}</td>
            <td>${k.nama}</td>
            <td>${k.tgl}</td>
            <td>${k.tujuan}</td>
            <td>
                <a href="detail-kunjungan.html?id=${k.id}">Lihat</a> | 
                <a href="edit-kunjungan.html?id=${k.id}">Edit</a>
            </td>
        </tr>
    `).join('');
});