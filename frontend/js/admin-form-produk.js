document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Logika Radio Button Status (Active / Draft)
    const statusRadios = document.querySelectorAll('.status-radio');
    statusRadios.forEach(label => {
        label.addEventListener('click', () => {
            // Hapus class active dari semua
            statusRadios.forEach(l => l.classList.remove('active'));
            // Tambahkan ke yang di-klik
            label.classList.add('active');
            // Check input radionya
            label.querySelector('input').checked = true;
        });
    });

    // 2. Cek Parameter URL (Untuk membedakan Tambah & Edit)
    const urlParams = new URLSearchParams(window.location.search);
    const prodId = urlParams.get('id');

    if (prodId) {
        // Simulasi Halaman Edit (Isi Form Otomatis)
        const pageTitle = document.getElementById('page-title');
        if (pageTitle) pageTitle.textContent = 'Edit Produk';
        const prodNama = document.getElementById('prod-nama');
        if (prodNama) prodNama.value = 'Kopi Arabika Malabar';
        const prodSku = document.getElementById('prod-sku');
        if (prodSku) prodSku.value = 'MLB-ARB-001';
    }

    // 3. Menambah Baris "Variasi Produk"
    const btnTambahVariasi = document.getElementById('btn-tambah-variasi');
    const tableVariasi = document.getElementById('variasi-table-body');

    if (btnTambahVariasi && tableVariasi) {
        btnTambahVariasi.addEventListener('click', () => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><input type="text" class="form-control" placeholder="Nama Variasi" style="padding:0.4rem;"></td>
                <td><input type="text" class="form-control" placeholder="Kode" style="padding:0.4rem;"></td>
                <td><input type="number" class="form-control" placeholder="Harga" style="padding:0.4rem;"></td>
                <td><span class="status-pill status-draft">Draft</span></td>
                <td><button type="button" class="btn-icon btn-hapus-var"><i class="ph ph-trash" style="color:var(--danger);"></i></button></td>
            `;
            tableVariasi.appendChild(tr);
            showToast('Variasi baru ditambahkan', 'success');

            // Logika hapus baris yang baru ditambahkan
            tr.querySelector('.btn-hapus-var').addEventListener('click', () => {
                tr.remove();
                showToast('Variasi dihapus', 'success');
            });
        });
    }

    // 4. Submit Form
    const formProduk = document.getElementById('form-produk');
    if (formProduk) {
        formProduk.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btnSubmit = formProduk.querySelector('button[type="submit"]') || document.querySelector('button[form="form-produk"]');
            if (btnSubmit) {
                btnSubmit.disabled = true;
                btnSubmit.textContent = 'Menyimpan...';
            }

            await new Promise(res => setTimeout(res, 800)); // Simulasi API
            
            const productName = document.getElementById('prod-nama')?.value || 'Produk';
            showToast(prodId ? `Produk "${productName}" berhasil diupdate!` : `Produk "${productName}" berhasil ditambahkan!`, 'success');
            addNotification(prodId ? `Produk "${productName}" diperbarui` : `Produk baru "${productName}" ditambahkan`);
            setTimeout(() => { window.location.href = 'produk.html'; }, 1000);
        });
    }
});