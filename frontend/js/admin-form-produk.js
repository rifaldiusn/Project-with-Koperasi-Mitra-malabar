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
        document.getElementById('page-title').textContent = 'Edit Produk';
        document.getElementById('prod-nama').value = 'Kopi Arabika Malabar';
        document.getElementById('prod-sku').value = 'MLB-ARB-001';
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

            // Logika hapus baris yang baru ditambahkan
            tr.querySelector('.btn-hapus-var').addEventListener('click', () => {
                tr.remove();
            });
        });
    }

    // 4. Submit Form
    const formProduk = document.getElementById('form-produk');
    if (formProduk) {
        formProduk.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btnSubmit = formProduk.querySelector('button[type="submit"]');
            btnSubmit.disabled = true;
            btnSubmit.textContent = 'Menyimpan...';

            await new Promise(res => setTimeout(res, 800)); // Simulasi API
            
            alert(prodId ? 'Produk berhasil diupdate!' : 'Produk baru berhasil ditambahkan!');
            window.location.href = 'produk.html';
        });
    }
});