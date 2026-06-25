document.addEventListener('DOMContentLoaded', async () => {
    // 1. Ambil ID Customer dari URL Parameter (Misal: ?id=1)
    const urlParams = new URLSearchParams(window.location.search);
    const customerId = urlParams.get('id');

    if (!customerId) {
        showToast('ID Customer tidak valid atau tidak ditemukan!', 'error');
        setTimeout(() => { window.location.href = 'customer.html'; }, 1000);
        return;
    }

    const form = document.getElementById('form-edit-customer');
    const submitBtn = document.querySelector('button[form="form-edit-customer"]') || form?.querySelector('button[type="submit"]');

    // 2. Fungsi untuk mengambil data customer (Simulasi API GET /api/customer/get/1)
    const loadCustomerData = async () => {
        try {
            const data = await api.get(`/customer/${customerId}`);

            // Masukkan data ke dalam form input
            const fields = {
                'cust-id': data.id_customer,
                'cust-nama': data.nama,
                'cust-telp': data.telp,
                'cust-email': data.email,
                'cust-jenis': data.jenis,
                'cust-alamat': data.alamat,
                'cust-link': data.link_gmaps || '',
            };
            
            Object.entries(fields).forEach(([id, value]) => {
                const el = document.getElementById(id);
                if (el) el.value = value;
            });

        } catch (error) {
            showToast('Gagal memuat data customer.', 'error');
            console.error(error);
        }
    };

    // 3. Handle submit
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Menyimpan...'; }
            
            const payload = {
                nama: document.getElementById('cust-nama').value,
                telp: document.getElementById('cust-telp').value,
                email: document.getElementById('cust-email').value,
                jenis: document.getElementById('cust-jenis').value,
                alamat: document.getElementById('cust-alamat').value,
                link_gmaps: document.getElementById('cust-link').value || null
            };

            try {
                await api.put(`/customer/${customerId}`, payload);
                showToast('Customer berhasil diperbarui!', 'success');
                addNotification('Data customer telah diperbarui');
                setTimeout(() => { window.location.href = 'customer.html'; }, 1000);
            } catch (error) {
                showToast('Gagal memperbarui customer: ' + (error.message || ''), 'error');
            } finally {
                if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Simpan Customer'; }
            }
        });
    }

    // Jalankan fungsi load data saat halaman dibuka
    loadCustomerData();
});