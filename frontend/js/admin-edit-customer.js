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
    // Use form query or button with form attribute 
    const submitBtn = document.querySelector('button[form="form-edit-customer"]') || form?.querySelector('button[type="submit"]');

    // 2. Fungsi untuk mengambil data customer (Simulasi API GET /api/customer/get/1)
    const loadCustomerData = async () => {
        try {
            // Mock Data dari Test Plan PDF halaman 15
            const mockData = {
                id: 1,
                nama: "Budi Santoso",
                telp: "081234567890",
                email: "budi.santoso@email.com",
                jenis: "cafe",
                alamat: "Jl. Sukras"
            };

            // Masukkan data ke dalam form input
            const fields = {
                'cust-id': mockData.id,
                'cust-nama': mockData.nama,
                'cust-telp': mockData.telp,
                'cust-email': mockData.email,
                'cust-jenis': mockData.jenis,
                'cust-alamat': mockData.alamat,
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

    // Jalankan fungsi load data saat halaman dibuka
    loadCustomerData();
});