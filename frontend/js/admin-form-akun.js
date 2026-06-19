document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('form-akun');
    const submitBtn = document.getElementById('btn-submit');
    
    // Cek apakah ini halaman Edit (ada ID di URL)
    const urlParams = new URLSearchParams(window.location.search);
    const akunId = urlParams.get('id');

    // Jika Halaman Edit, muat data dummy
    if (akunId) {
        // Simulasi Ambil Data dari API
        const mockData = {
            id: 1, 
            nama: "Syafiq Gunawan", 
            pass: "asikbanget", 
            telp: "08555555444", 
            username: "syafi22", 
            role: "leads"
        };

        document.getElementById('input-id').value = mockData.id;
        document.getElementById('input-nama').value = mockData.nama;
        document.getElementById('input-password').value = mockData.pass;
        document.getElementById('input-telp').value = mockData.telp;
        document.getElementById('input-username').value = mockData.username;
        document.getElementById('input-role').value = mockData.role;
    }

    // Fungsi Submit Form (Tambah / Edit)
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            submitBtn.disabled = true;
            submitBtn.textContent = 'Menyimpan...';

            try {
                // Simulasi delay request ke server
                await new Promise(resolve => setTimeout(resolve, 600));
                
                if (akunId) {
                    alert('Data akun berhasil diperbarui!');
                } else {
                    alert('Akun baru berhasil ditambahkan!');
                }
                
                // Kembali ke halaman daftar akun
                window.location.href = 'kelola-akun.html';
                
            } catch (error) {
                alert('Gagal menyimpan data akun.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = akunId ? 'Simpan Perubahan' : 'Simpan Akun';
            }
        });
    }
});