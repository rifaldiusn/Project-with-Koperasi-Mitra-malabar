// admin-form-kunjungan.js — GPS + Form Submit for Kunjungan
document.addEventListener('DOMContentLoaded', async () => {

    const urlParams = new URLSearchParams(window.location.search);
    const kunjunganId = urlParams.get('id');

    // Load customers for dropdown
    const customerSelect = document.getElementById('input-customer');
    if (customerSelect) {
        try {
            const customers = await api.get('/customer/');
            customerSelect.innerHTML = '<option value="">Pilih customer</option>';
            customers.forEach(c => {
                const opt = document.createElement('option');
                opt.value = c.id_customer;
                opt.textContent = c.nama;
                customerSelect.appendChild(opt);
            });
        } catch (e) {
            customerSelect.innerHTML = '<option value="">Gagal memuat customer</option>';
        }
    }

    // If Edit, load existing data
    if (kunjunganId) {
        try {
            const data = await api.get(`/kunjungan/${kunjunganId}`);
            if (document.getElementById('input-nama')) document.getElementById('input-nama').value = data.nama || '';
            if (document.getElementById('input-catatan')) document.getElementById('input-catatan').value = data.catatan || '';
            if (document.getElementById('input-lat')) document.getElementById('input-lat').value = data.latitude || '';
            if (document.getElementById('input-long')) document.getElementById('input-long').value = data.longitude || '';
            if (customerSelect) customerSelect.value = data.id_customer;
        } catch (e) {
            showToast('Gagal memuat data kunjungan', 'error');
        }
    } else {
        // Automatically fetch location on Add
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const latInput = document.getElementById('input-lat');
                    const longInput = document.getElementById('input-long');
                    if (latInput) latInput.value = pos.coords.latitude.toFixed(6);
                    if (longInput) longInput.value = pos.coords.longitude.toFixed(6);
                    showToast('Lokasi otomatis terambil!', 'success');
                },
                (err) => {
                    showToast('Gagal memuat lokasi otomatis: ' + err.message, 'error');
                }
            );
        } else {
            showToast('GPS tidak didukung oleh browser ini.', 'error');
        }
    }

    // --- GPS Geolocation (For Edit or Manual trigger) ---
    const btnLokasi = document.getElementById('btn-lokasi');
    if (btnLokasi) {
        btnLokasi.addEventListener('click', () => {
            if (navigator.geolocation) {
                btnLokasi.textContent = 'Mengambil lokasi...';
                btnLokasi.disabled = true;
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        document.getElementById('input-lat').value = pos.coords.latitude.toFixed(6);
                        document.getElementById('input-long').value = pos.coords.longitude.toFixed(6);
                        showToast('Lokasi berhasil diambil!', 'success');
                        btnLokasi.innerHTML = '<i class="ph ph-check" style="margin-right:0.25rem;"></i> Lokasi Terambil';
                        btnLokasi.disabled = false;
                    },
                    (err) => {
                        showToast('Gagal mengambil lokasi: ' + err.message, 'error');
                        btnLokasi.innerHTML = '<i class="ph ph-map-pin" style="margin-right:0.25rem;"></i> Ambil Lokasi Saat Ini';
                        btnLokasi.disabled = false;
                    }
                );
            } else {
                showToast('GPS tidak didukung oleh browser ini.', 'error');
            }
        });
    }

    // --- Form Submit Kunjungan ---
    const formKunjungan = document.getElementById('form-kunjungan');
    if (formKunjungan) {
        formKunjungan.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.querySelector('button[form="form-kunjungan"]') || formKunjungan.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Menyimpan...';
            }

            try {
                const formData = new FormData();
                formData.append('nama', document.getElementById('input-nama').value);
                formData.append('catatan', document.getElementById('input-catatan').value);
                formData.append('latitude', document.getElementById('input-lat').value);
                formData.append('longitude', document.getElementById('input-long').value);
                formData.append('id_customer', document.getElementById('input-customer').value);

                const fileInput = document.getElementById('input-file');
                if (fileInput && fileInput.files[0]) {
                    formData.append('file', fileInput.files[0]);
                } else if (!kunjunganId) {
                    showToast('Silakan pilih foto bukti kunjungan.', 'error');
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Simpan Kunjungan';
                    }
                    return;
                }

                if (kunjunganId) {
                    // PUT /api/kunjungan/{id}
                    const token = api.getToken();
                    const headers = {};
                    if (token) headers['Authorization'] = `Bearer ${token}`;
                    
                    const response = await fetch(`http://localhost:8000/api/kunjungan/${kunjunganId}`, {
                        method: 'PUT',
                        headers,
                        body: formData
                    });
                    const data = await response.json();
                    if (!response.ok) throw { status: response.status, data };
                } else {
                    // POST /api/kunjungan/
                    await api.postFormData('/kunjungan/', formData);
                }

                showToast('Kunjungan berhasil disimpan!', 'success');
                addNotification(`Kunjungan telah dicatat`);
                setTimeout(() => { window.location.href = 'kunjungan.html'; }, 1000);
            } catch (error) {
                showToast(error.data?.message || error.message || 'Gagal menyimpan kunjungan.', 'error');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Simpan Kunjungan';
                }
            }
        });
    }
});