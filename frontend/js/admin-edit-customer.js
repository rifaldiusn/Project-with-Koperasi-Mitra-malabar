document.addEventListener('DOMContentLoaded', async () => {
    // 1. Ambil ID Customer dari URL Parameter (Misal: ?id=1)
    const urlParams = new URLSearchParams(window.location.search);
    const customerId = urlParams.get('id');

    if (!customerId) {
        alert('ID Customer tidak valid atau tidak ditemukan!');
        window.location.href = 'customer.html';
        return;
    }

    const form = document.getElementById('form-edit-customer');
    const submitBtn = document.getElementById('btn-submit');

    // 2. Fungsi untuk mengambil data customer (Simulasi API GET /api/customer/get/1)
    const loadCustomerData = async () => {
        try {
            /* SIMULASI BACKEND:
            Jika backend sudah siap, gunakan:
            const data = await api.get(`/customer/get/${customerId}`);
            */
            
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
            document.getElementById('cust-id').value = mockData.id;
            document.getElementById('cust-nama').value = mockData.nama;
            document.getElementById('cust-telp').value = mockData.telp;
            document.getElementById('cust-email').value = mockData.email;
            document.getElementById('cust-jenis').value = mockData.jenis;
            document.getElementById('cust-alamat').value = mockData.alamat;

        } catch (error) {
            alert('Gagal memuat data customer.');
            console.error(error);
        }
    };

    // 3. Fungsi untuk Submit Form Edit (Simulasi API PUT /api/customer/edit/1)
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.textContent = 'Menyimpan...';

        const payload = {
            nama: document.getElementById('cust-nama').value,
            telp: document.getElementById('cust-telp').value,
            email: document.getElementById('cust-email').value,
            jenis: document.getElementById('cust-jenis').value,
            alamat: document.getElementById('cust-alamat').value
        };

        try {
            /*
            SIMULASI BACKEND:
            Jika backend sudah siap, gunakan:
            await api.put(`/customer/edit/${customerId}`, payload);
            */
            
            // Mock delay jaringan
            await new Promise(resolve => setTimeout(resolve, 500));
            
            alert('Data customer berhasil di update!');
            window.location.href = 'customer.html'; // Kembali ke tabel
            
        } catch (error) {
            alert(error.data?.message || 'Gagal menyimpan data.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Simpan Customer';
        }
    });

    // Jalankan fungsi load data saat halaman dibuka
    loadCustomerData();
});