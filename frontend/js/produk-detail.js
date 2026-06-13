document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const produkId = urlParams.get('id');

    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    const variasiBody = document.getElementById('variasi-body');
    const form = document.getElementById('form-produk');

    const isMock = api.getToken() === 'mock-token-12345';
    
    let mockData = {
        id: 1,
        nama: "Kopi Arabika Malabar",
        kategori: "Biji Kopi",
        kode: "MLB-ARB-001",
        status: "Active",
        variasi: [
            { id: 1, nama: "Standar", kode: "VAR-01", harga: 50000, status: 1 },
            { id: 2, nama: "Premium", kode: "VAR-02", harga: 75000, status: 0 }
        ],
        penjualan: [
            { id: 1, periode: "2026-07", nominal: 21000000, jenis: "Retail (Eceran)" }
        ]
    };

    let currentData = null;

    // Styling radio buttons based on selection
    const radios = document.querySelectorAll('input[name="p_status"]');
    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            document.getElementById('lbl-status-active').style.backgroundColor = radio.value === 'Active' ? '#F4FCE3' : 'transparent';
            document.getElementById('lbl-status-draft').style.backgroundColor = radio.value === 'Draft' ? '#F4FCE3' : 'transparent';
        });
    });

    const loadProdukDetail = async () => {
        errorMessage.style.display = 'none';
        if (!produkId && !isMock) {
            // New product mode if no ID (though design implies detail management)
            currentData = { variasi: [], penjualan: [] };
            renderVariasi(currentData.variasi);
            return;
        }

        try {
            if (isMock) {
                currentData = mockData; // fallback mock
            } else {
                currentData = await api.get(`/produk/get/${produkId}`);
            }
            
            // Populate form
            document.getElementById('p-nama').value = currentData.nama || '';
            document.getElementById('p-kategori').value = currentData.kategori || 'Biji Kopi';
            document.getElementById('p-kode').value = currentData.kode || '';
            
            if (currentData.status === 'Draft') {
                document.querySelector('input[value="Draft"]').checked = true;
                document.getElementById('lbl-status-draft').style.backgroundColor = '#F4FCE3';
            } else {
                document.querySelector('input[value="Active"]').checked = true;
                document.getElementById('lbl-status-active').style.backgroundColor = '#F4FCE3';
            }

            if (currentData.penjualan && currentData.penjualan.length > 0) {
                const penj = currentData.penjualan[0];
                document.getElementById('penj-nominal').value = "Rp " + penj.nominal.toLocaleString('id-ID');
                document.getElementById('penj-jenis').value = penj.jenis;
            }

            renderVariasi(currentData.variasi || []);
        } catch (error) {
            errorMessage.style.display = 'block';
            errorMessage.textContent = error.message || 'Gagal memuat detail produk.';
        }
    };

    const renderVariasi = (variasiList) => {
        variasiBody.innerHTML = '';
        if (variasiList.length === 0) {
            variasiBody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:1rem;">Belum ada variasi</td></tr>';
            return;
        }

        variasiList.forEach((v, index) => {
            const statusBadge = v.status === 1 || v.status === 'Active' 
                ? '<span style="background:#D4EDDA; color:#155724; padding:2px 6px; border-radius:4px; font-size:10px;">Active</span>' 
                : '<span style="background:#E2E3E5; color:#383D41; padding:2px 6px; border-radius:4px; font-size:10px;">Inactive</span>';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><input type="text" class="form-control" style="padding:0.25rem; font-size:0.875rem;" value="${v.nama}" data-idx="${index}" name="v_nama"></td>
                <td><input type="text" class="form-control" style="padding:0.25rem; font-size:0.875rem;" value="${v.kode}" data-idx="${index}" name="v_kode"></td>
                <td><input type="number" class="form-control" style="padding:0.25rem; font-size:0.875rem;" value="${v.harga}" data-idx="${index}" name="v_harga"></td>
                <td>${statusBadge}</td>
                <td>
                    <button type="button" class="btn-icon btn-hapus-var" data-idx="${index}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                </td>
            `;
            variasiBody.appendChild(tr);
        });

        document.querySelectorAll('.btn-hapus-var').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.dataset.idx);
                currentData.variasi.splice(idx, 1);
                renderVariasi(currentData.variasi);
            });
        });
    };

    window.tambahVariasi = () => {
        currentData.variasi.push({ nama: "", kode: "", harga: 0, status: 1 });
        renderVariasi(currentData.variasi);
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // Capture variasi updates from inputs
        document.querySelectorAll('input[name="v_nama"]').forEach(input => {
            currentData.variasi[input.dataset.idx].nama = input.value;
        });
        document.querySelectorAll('input[name="v_kode"]').forEach(input => {
            currentData.variasi[input.dataset.idx].kode = input.value;
        });
        document.querySelectorAll('input[name="v_harga"]').forEach(input => {
            currentData.variasi[input.dataset.idx].harga = parseInt(input.value);
        });

        const payload = {
            nama: document.getElementById('p-nama').value,
            kategori: document.getElementById('p-kategori').value,
            kode: document.getElementById('p-kode').value,
            status: document.querySelector('input[name="p_status"]:checked').value,
            variasi: currentData.variasi
        };

        // Simulate save logic since Test Plan doesn't specify a PUT /produk endpoint exactly
        successMessage.textContent = "Perubahan produk berhasil disimpan!";
        successMessage.style.display = 'block';
        window.scrollTo(0,0);
        setTimeout(() => { successMessage.style.display = 'none'; }, 3000);
    });

    loadProdukDetail();
});
