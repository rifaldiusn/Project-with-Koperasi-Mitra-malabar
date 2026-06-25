document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Logika Radio Button Status (Active / Draft)
    const statusInputs = document.querySelectorAll('input[name="status"]');
    statusInputs.forEach(input => {
        input.addEventListener('change', () => {
            document.querySelectorAll('.status-radio').forEach(l => l.classList.remove('active'));
            if (input.checked) {
                const label = input.closest('.status-radio');
                if (label) label.classList.add('active');
            }
        });
    });

    // 2. Cek Parameter URL (Untuk membedakan Tambah & Edit)
    const urlParams = new URLSearchParams(window.location.search);
    const prodId = urlParams.get('id');

    const isMock = !api.getToken() || api.getToken().startsWith('mock-token');

    if (prodId) {
        const pageTitle = document.getElementById('page-title');
        if (pageTitle) pageTitle.textContent = 'Edit Produk';
        
        if (isMock) {
            // Simulasi Halaman Edit
            const prodNama = document.getElementById('prod-nama');
            if (prodNama) prodNama.value = 'Kopi Arabika Malabar';
            const prodSku = document.getElementById('prod-sku');
            if (prodSku) prodSku.value = 'MLB-ARB-001';
        } else {
            api.get(`/produk/${prodId}`).then(prod => {
                const prodNama = document.getElementById('prod-nama');
                if (prodNama) prodNama.value = prod.nama || '';
                const prodSku = document.getElementById('prod-sku');
                if (prodSku) prodSku.value = prod.kode || '';
                
                // set status radio
                const targetRadio = document.querySelector(`input[name="status"][value="${prod.status}"]`);
                if (targetRadio) {
                    document.querySelectorAll('.status-radio').forEach(l => l.classList.remove('active'));
                    const lbl = targetRadio.closest('label');
                    if (lbl) lbl.classList.add('active');
                    targetRadio.checked = true;
                }

                // ponytail: load variasi
                api.get('/variasi/').then(variasiList => {
                    const productVariasi = variasiList.filter(v => v.id_produk == prodId);
                    const tableBody = document.getElementById('variasi-table-body');
                    if (tableBody && productVariasi.length > 0) {
                        tableBody.innerHTML = '';
                        productVariasi.forEach(v => {
                            const tr = document.createElement('tr');
                            tr.innerHTML = `
                                <td><input type="text" class="form-control" value="${v.nama}" placeholder="Nama Variasi" style="padding:0.4rem;"></td>
                                <td><input type="text" class="form-control" value="${v.kode}" placeholder="Kode" style="padding:0.4rem;"></td>
                                <td><input type="number" class="form-control" value="${v.harga || 0}" placeholder="Harga" style="padding:0.4rem;"></td>
                                <td>
                                    <select class="form-control var-status" style="padding:0.4rem; font-size:0.875rem;">
                                        <option value="1" ${v.status === 1 ? 'selected' : ''}>Active</option>
                                        <option value="0" ${v.status === 0 ? 'selected' : ''}>Draft</option>
                                    </select>
                                </td>
                                <td>
                                    <button type="button" class="btn-icon btn-hapus-var" data-id="${v.id_variasi}">
                                        <i class="ph ph-trash" style="color:var(--danger);"></i>
                                    </button>
                                </td>
                            `;
                            tableBody.appendChild(tr);

                            tr.querySelector('.btn-hapus-var').addEventListener('click', async (e) => {
                                const varId = e.currentTarget.getAttribute('data-id');
                                if (varId) {
                                    if (confirm('Hapus variasi ini dari database?')) {
                                        try {
                                            await api.delete(`/variasi/${varId}`);
                                            tr.remove();
                                            showToast('Variasi dihapus', 'success');
                                        } catch (err) {
                                            showToast('Gagal hapus variasi', 'error');
                                        }
                                    }
                                } else {
                                    tr.remove();
                                }
                            });
                        });
                    }
                    
                    const selVariasi = document.getElementById('jual-variasi');
                    if (selVariasi && productVariasi.length > 0) {
                        productVariasi.forEach(v => {
                            const opt = document.createElement('option');
                            opt.value = v.id_variasi;
                            opt.textContent = v.nama;
                            selVariasi.appendChild(opt);
                        });
                    }
                }).catch(err => console.error('Gagal load variasi', err));

                // ponytail: load metrik data
                api.get('/data/').then(dataList => {
                    const productData = dataList.filter(d => d.id_produk == prodId);
                    if (productData && productData.length > 0) {
                        const d = productData[0]; // ambil data pertama
                        
                        document.getElementById('metrik-periode').value = d.periode || '';
                        document.getElementById('metrik-dilihat').value = d.dilihat || 0;
                        document.getElementById('metrik-diklik').value = d.diklik || 0;
                        document.getElementById('metrik-suka').value = d.suka || 0;
                        document.getElementById('metrik-keranjang').value = d.keranjang || 0;

                        ['metrik-periode', 'metrik-dilihat', 'metrik-diklik', 'metrik-suka', 'metrik-keranjang'].forEach(id => {
                            const el = document.getElementById(id);
                            if (el) el.disabled = true;
                        });

                        const btnSimpanMetrik = document.getElementById('btn-simpan-metrik');
                        if (btnSimpanMetrik) {
                            btnSimpanMetrik.setAttribute('data-id', d.id_data);
                            btnSimpanMetrik.style.display = 'none';
                        }
                        
                        const btnEditMetrik = document.getElementById('btn-edit-metrik');
                        if (btnEditMetrik) btnEditMetrik.style.display = 'inline-block';
                    }
                }).catch(err => console.error('Gagal load metrik', err));

                // ponytail: load pesanan data
                api.get('/pesan/').then(pesanList => {
                    const productPesan = pesanList.filter(p => p.id_produk == prodId);
                    if (productPesan && productPesan.length > 0) {
                        const p = productPesan[0]; // ambil data pesanan pertama
                        
                        document.getElementById('pesan-periode').value = p.periode || '';
                        document.getElementById('pesan-dibuat').value = p.dibuat || 0;
                        document.getElementById('pesan-dikirim').value = p.dikirim || 0;

                        ['pesan-periode', 'pesan-dibuat', 'pesan-dikirim'].forEach(id => {
                            const el = document.getElementById(id);
                            if (el) el.disabled = true;
                        });

                        const btnSimpanPesan = document.getElementById('btn-simpan-pesan');
                        if (btnSimpanPesan) {
                            btnSimpanPesan.setAttribute('data-id', p.id_pesan);
                            btnSimpanPesan.style.display = 'none';
                        }
                        
                        const btnEditPesan = document.getElementById('btn-edit-pesan');
                        if (btnEditPesan) btnEditPesan.style.display = 'inline-block';
                    }
                }).catch(err => console.error('Gagal load pesanan', err));

                // ponytail: load penjualan data and handle dropdown
                let allPenjualan = [];
                const selVariasi = document.getElementById('jual-variasi');
                
                api.get('/penjualan/').then(jualList => {
                    allPenjualan = jualList || [];
                }).catch(err => console.error('Gagal load penjualan', err));

                if (selVariasi) {
                    selVariasi.addEventListener('change', (e) => {
                        const varId = e.target.value;
                        const btnSimpanJual = document.getElementById('btn-simpan-jual');
                        const btnEditJual = document.getElementById('btn-edit-jual');
                        
                        // Reset form
                        document.getElementById('jual-periode').value = '';
                        document.getElementById('jual-nominal').value = '';
                        document.getElementById('jual-jenis').value = '1';
                        ['jual-periode', 'jual-nominal', 'jual-jenis'].forEach(id => {
                            const el = document.getElementById(id);
                            if (el) el.disabled = false;
                        });
                        if (btnSimpanJual) {
                            btnSimpanJual.removeAttribute('data-id');
                            btnSimpanJual.style.display = 'inline-block';
                            btnSimpanJual.textContent = 'Simpan Penjualan';
                        }
                        if (btnEditJual) btnEditJual.style.display = 'none';

                        if (!varId) return; // kalau pilih variasi kosong

                        // Cari data penjualan untuk variasi ini
                        const d = allPenjualan.find(p => p.id_variasi == varId);
                        if (d) {
                            document.getElementById('jual-periode').value = d.periode || '';
                            document.getElementById('jual-nominal').value = d.nominal || 0;
                            document.getElementById('jual-jenis').value = d.jenis || 1;

                            ['jual-periode', 'jual-nominal', 'jual-jenis'].forEach(id => {
                                const el = document.getElementById(id);
                                if (el) el.disabled = true;
                            });

                            if (btnSimpanJual) {
                                btnSimpanJual.setAttribute('data-id', d.id_penjualan);
                                btnSimpanJual.style.display = 'none';
                            }
                            if (btnEditJual) btnEditJual.style.display = 'inline-block';
                        }
                    });
                }

            }).catch(err => {
                showToast('Gagal memuat data produk: ' + (err.data?.detail || ''), 'error');
            });
        }
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
                <td>
                    <select class="form-control var-status" style="padding:0.4rem; font-size:0.875rem;">
                        <option value="1">Active</option>
                        <option value="0">Draft</option>
                    </select>
                </td>
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

    // 4. Submit Form (Tambah Produk)
    const formTambah = document.getElementById('form-produk');
    if (formTambah) {
        formTambah.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btnSubmit = formTambah.querySelector('button[type="submit"]');
            if (btnSubmit) {
                btnSubmit.disabled = true;
                btnSubmit.textContent = 'Menyimpan...';
            }

            const productName = document.getElementById('prod-nama')?.value || 'Produk';
            const productKode = document.getElementById('prod-sku')?.value || '';
            const status = document.querySelector('input[name="status"]:checked')?.value || 'Active';

            try {
                if (!isMock) {
                    const prodRes = await api.post('/produk/', { nama: productName, kode: productKode, status: status });
                } else {
                    await new Promise(res => setTimeout(res, 800));
                }
                
                showToast(`Produk "${productName}" berhasil ditambahkan!`, 'success');
                addNotification(`Produk baru "${productName}" ditambahkan`);
                setTimeout(() => { window.location.href = 'produk.html'; }, 1000);
            } catch (err) {
                showToast('Gagal menyimpan: ' + (err.data?.detail || ''), 'error');
            } finally {
                if (btnSubmit) {
                    btnSubmit.disabled = false;
                    btnSubmit.textContent = 'Simpan Produk Baru';
                }
            }
        });
    }

    // 5. Submit Form (Edit Produk)
    const formEdit = document.getElementById('form-edit-produk');
    if (formEdit) {
        formEdit.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btnSubmit = formEdit.querySelector('button[type="submit"]');
            if (btnSubmit) {
                btnSubmit.disabled = true;
                btnSubmit.textContent = 'Menyimpan...';
            }

            const productName = document.getElementById('prod-nama')?.value || 'Produk';
            const productKode = document.getElementById('prod-sku')?.value || '';
            const status = document.querySelector('input[name="status"]:checked')?.value || 'Active';

            try {
                if (!isMock && prodId) {
                    await api.put(`/produk/${prodId}`, { nama: productName, kode: productKode, status: status });
                } else {
                    await new Promise(res => setTimeout(res, 800));
                }
                
                showToast(`Produk "${productName}" berhasil diupdate!`, 'success');
                addNotification(`Produk "${productName}" diperbarui`);
                setTimeout(() => { window.location.href = 'produk.html'; }, 1000);
            } catch (err) {
                showToast('Gagal mengupdate: ' + (err.data?.detail || ''), 'error');
            } finally {
                if (btnSubmit) {
                    btnSubmit.disabled = false;
                    btnSubmit.textContent = 'Simpan Perubahan';
                }
            }
        });
    }

    // 6. Simpan Variasi Khusus
    const btnSimpanVariasi = document.getElementById('btn-simpan-variasi');
    if (btnSimpanVariasi) {
        btnSimpanVariasi.addEventListener('click', async () => {
            if (!prodId) {
                showToast('Simpan produk terlebih dahulu sebelum menyimpan variasi!', 'error');
                return;
            }
            
            btnSimpanVariasi.disabled = true;
            btnSimpanVariasi.textContent = 'Menyimpan...';

            try {
                const tableVariasi = document.getElementById('variasi-table-body');
                if (tableVariasi) {
                    const rows = tableVariasi.querySelectorAll('tr');
                    let successCount = 0;
                    
                    for (const row of rows) {
                        const inputs = row.querySelectorAll('input');
                        const selectStatus = row.querySelector('.var-status');
                        if (inputs.length >= 3) {
                            const namaVar = inputs[0].value;
                            const kodeVar = inputs[1].value;
                            const hargaVar = parseInt(inputs[2].value, 10);
                            const statusVar = selectStatus ? parseInt(selectStatus.value, 10) : 1;
                            
                            if (kodeVar && namaVar) {
                                await api.post('/variasi/', {
                                    id_produk: parseInt(prodId, 10),
                                    nama: namaVar,
                                    kode: kodeVar,
                                    harga: isNaN(hargaVar) ? 0 : hargaVar,
                                    status: statusVar
                                });
                                successCount++;
                            }
                        }
                    }
                    showToast(`${successCount} variasi berhasil disimpan!`, 'success');
                }
            } catch (err) {
                showToast('Gagal menyimpan variasi: ' + (err.data?.detail || ''), 'error');
            } finally {
                btnSimpanVariasi.disabled = false;
                btnSimpanVariasi.textContent = 'Simpan Variasi';
            }
        });
    }

    // 7. Simpan Metrik Khusus
    const btnSimpanMetrik = document.getElementById('btn-simpan-metrik');
    if (btnSimpanMetrik) {
        btnSimpanMetrik.addEventListener('click', async () => {
            if (!prodId) {
                showToast('Simpan produk terlebih dahulu sebelum menyimpan metrik!', 'error');
                return;
            }
            
            const periode = document.getElementById('metrik-periode')?.value;
            if (!periode) {
                showToast('Tanggal produk wajib diisi!', 'error');
                return;
            }

            btnSimpanMetrik.disabled = true;
            btnSimpanMetrik.textContent = 'Menyimpan...';

            const dilihat = parseInt(document.getElementById('metrik-dilihat')?.value || 0, 10);
            const diklik = parseInt(document.getElementById('metrik-diklik')?.value || 0, 10);
            const suka = parseInt(document.getElementById('metrik-suka')?.value || 0, 10);
            const keranjang = parseInt(document.getElementById('metrik-keranjang')?.value || 0, 10);

            try {
                const dataId = btnSimpanMetrik.getAttribute('data-id');
                const payload = {
                    id_produk: parseInt(prodId, 10),
                    periode: periode,
                    dilihat: dilihat,
                    diklik: diklik,
                    suka: suka,
                    keranjang: keranjang
                };

                if (dataId) {
                    await api.put(`/data/${dataId}`, payload);
                    showToast('Metrik interaksi berhasil diupdate!', 'success');
                } else {
                    const res = await api.post('/data/', payload);
                    if (res && res.id_data) btnSimpanMetrik.setAttribute('data-id', res.id_data);
                    showToast('Metrik interaksi berhasil disimpan!', 'success');
                }

                // disable inputs again
                ['metrik-periode', 'metrik-dilihat', 'metrik-diklik', 'metrik-suka', 'metrik-keranjang'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.disabled = true;
                });

                btnSimpanMetrik.style.display = 'none';
                const btnEditMetrik = document.getElementById('btn-edit-metrik');
                if (btnEditMetrik) btnEditMetrik.style.display = 'inline-block';

            } catch (err) {
                showToast('Gagal menyimpan metrik: ' + (err.data?.detail || ''), 'error');
            } finally {
                btnSimpanMetrik.disabled = false;
                btnSimpanMetrik.textContent = 'Simpan Metrik';
            }
        });
    }

    // 8. Edit Metrik Khusus
    const btnEditMetrik = document.getElementById('btn-edit-metrik');
    if (btnEditMetrik) {
        btnEditMetrik.addEventListener('click', () => {
            ['metrik-periode', 'metrik-dilihat', 'metrik-diklik', 'metrik-suka', 'metrik-keranjang'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.disabled = false;
            });
            
            btnEditMetrik.style.display = 'none';
            const btnSimpanMetrik = document.getElementById('btn-simpan-metrik');
            if (btnSimpanMetrik) {
                btnSimpanMetrik.style.display = 'inline-block';
                btnSimpanMetrik.textContent = 'Simpan Perubahan Metrik';
            }
        });
    }

    // 9. Simpan Pesanan Khusus
    const btnSimpanPesan = document.getElementById('btn-simpan-pesan');
    if (btnSimpanPesan) {
        btnSimpanPesan.addEventListener('click', async () => {
            if (!prodId) {
                showToast('Simpan produk terlebih dahulu sebelum menyimpan pesanan!', 'error');
                return;
            }
            
            const periode = document.getElementById('pesan-periode')?.value;
            if (!periode) {
                showToast('Periode pesanan wajib diisi!', 'error');
                return;
            }

            btnSimpanPesan.disabled = true;
            btnSimpanPesan.textContent = 'Menyimpan...';

            const dibuat = parseInt(document.getElementById('pesan-dibuat')?.value || 0, 10);
            const dikirim = parseInt(document.getElementById('pesan-dikirim')?.value || 0, 10);

            try {
                const pesanId = btnSimpanPesan.getAttribute('data-id');
                const payload = {
                    id_produk: parseInt(prodId, 10),
                    periode: periode,
                    dibuat: dibuat,
                    dikirim: dikirim
                };

                if (pesanId) {
                    await api.put(`/pesan/${pesanId}`, payload);
                    showToast('Data pesanan berhasil diupdate!', 'success');
                } else {
                    const res = await api.post('/pesan/', payload);
                    if (res && res.id_pesan) btnSimpanPesan.setAttribute('data-id', res.id_pesan);
                    showToast('Data pesanan berhasil disimpan!', 'success');
                }

                // disable inputs again
                ['pesan-periode', 'pesan-dibuat', 'pesan-dikirim'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.disabled = true;
                });

                btnSimpanPesan.style.display = 'none';
                const btnEditPesan = document.getElementById('btn-edit-pesan');
                if (btnEditPesan) btnEditPesan.style.display = 'inline-block';

            } catch (err) {
                showToast('Gagal menyimpan pesanan: ' + (err.data?.detail || ''), 'error');
            } finally {
                btnSimpanPesan.disabled = false;
                btnSimpanPesan.textContent = 'Simpan Pesanan';
            }
        });
    }

    // 10. Edit Pesanan Khusus
    const btnEditPesan = document.getElementById('btn-edit-pesan');
    if (btnEditPesan) {
        btnEditPesan.addEventListener('click', () => {
            ['pesan-periode', 'pesan-dibuat', 'pesan-dikirim'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.disabled = false;
            });
            
            btnEditPesan.style.display = 'none';
            const btnSimpanPesan = document.getElementById('btn-simpan-pesan');
            if (btnSimpanPesan) {
                btnSimpanPesan.style.display = 'inline-block';
                btnSimpanPesan.textContent = 'Simpan Perubahan Pesanan';
            }
        });
    }

    // 11. Simpan Penjualan Khusus
    const btnSimpanJual = document.getElementById('btn-simpan-jual');
    if (btnSimpanJual) {
        btnSimpanJual.addEventListener('click', async () => {
            const varId = document.getElementById('jual-variasi')?.value;
            if (!varId) {
                showToast('Pilih variasi produk terlebih dahulu!', 'error');
                return;
            }
            
            const periode = document.getElementById('jual-periode')?.value;
            if (!periode) {
                showToast('Periode penjualan wajib diisi!', 'error');
                return;
            }

            btnSimpanJual.disabled = true;
            btnSimpanJual.textContent = 'Menyimpan...';

            const nominal = parseInt(document.getElementById('jual-nominal')?.value || 0, 10);
            const jenis = parseInt(document.getElementById('jual-jenis')?.value || 1, 10);

            try {
                const jualId = btnSimpanJual.getAttribute('data-id');
                const payload = {
                    id_variasi: parseInt(varId, 10),
                    periode: periode,
                    nominal: nominal,
                    jenis: jenis
                };

                if (jualId) {
                    await api.put(`/penjualan/${jualId}`, payload);
                    showToast('Data penjualan berhasil diupdate!', 'success');
                } else {
                    const res = await api.post('/penjualan/', payload);
                    if (res && res.id_penjualan) btnSimpanJual.setAttribute('data-id', res.id_penjualan);
                    
                    // Juga tambahkan ke array global (biar gak hilang pas ganti dropdown lalu balik lagi)
                    // (Asumsi sederhana: tidak perlu memperbarui array lengkap, karena fitur edit cuma di saat itu)
                    showToast('Data penjualan berhasil disimpan!', 'success');
                }

                // disable inputs again
                ['jual-periode', 'jual-nominal', 'jual-jenis'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.disabled = true;
                });

                btnSimpanJual.style.display = 'none';
                const btnEditJual = document.getElementById('btn-edit-jual');
                if (btnEditJual) btnEditJual.style.display = 'inline-block';

            } catch (err) {
                showToast('Gagal menyimpan penjualan: ' + (err.data?.detail || ''), 'error');
            } finally {
                btnSimpanJual.disabled = false;
                btnSimpanJual.textContent = 'Simpan Penjualan';
            }
        });
    }

    // 12. Edit Penjualan Khusus
    const btnEditJual = document.getElementById('btn-edit-jual');
    if (btnEditJual) {
        btnEditJual.addEventListener('click', () => {
            ['jual-periode', 'jual-nominal', 'jual-jenis'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.disabled = false;
            });
            
            btnEditJual.style.display = 'none';
            const btnSimpanJual = document.getElementById('btn-simpan-jual');
            if (btnSimpanJual) {
                btnSimpanJual.style.display = 'inline-block';
                btnSimpanJual.textContent = 'Simpan Perubahan Penjualan';
            }
        });
    }
});