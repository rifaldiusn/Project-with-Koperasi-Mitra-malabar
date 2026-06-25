document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('form-akun');
    const submitBtn = document.getElementById('btn-submit');
    
    // Cek apakah ini halaman Edit (ada ID di URL)
    const urlParams = new URLSearchParams(window.location.search);
    const akunId = urlParams.get('id');

    // Jika Halaman Edit, muat data
    if (akunId) {
        try {
            const data = await api.get(`/akun/${akunId}`);
            
            const roleMapRev = { 1: 'admin', 2: 'leads', 3: 'campaign' };
            
            const inputId = document.getElementById('input-id');
            if (inputId) inputId.value = data.id_akun;
            
            document.getElementById('input-nama').value = data.nama || '';
            document.getElementById('input-telp').value = data.telp || '';
            document.getElementById('input-username').value = data.username || '';
            document.getElementById('input-role').value = roleMapRev[data.role] || '';
            
            // Note: Password usually not sent back from server, leave placeholder
            document.getElementById('input-password').placeholder = "Kosongkan jika tidak ingin mengubah password";
            document.getElementById('input-password').required = false;
        } catch (error) {
            console.error(error);
            showToast('Gagal memuat data akun untuk diedit', 'error');
        }
    }

    // Fungsi Submit Form (Tambah / Edit)
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Menyimpan...';
            }

            try {
                const roleMap = { "admin": 1, "leads": 2, "campaign": 3 };
                const roleValue = document.getElementById('input-role').value;
                
                // ponytail: Minimal direct API mapping
                const payload = {
                    nama: document.getElementById('input-nama').value,
                    telp: document.getElementById('input-telp').value,
                    username: document.getElementById('input-username').value,
                    role: roleMap[roleValue] || parseInt(roleValue)
                };
                
                const pwdInput = document.getElementById('input-password').value;
                if (pwdInput) {
                    payload.password = pwdInput;
                }

                if (akunId) {
                    await api.put(`/akun/${akunId}`, payload);
                    showToast('Data akun berhasil diperbarui!', 'success');
                    addNotification('Akun telah diperbarui');
                } else {
                    await api.post('/akun/', payload);
                    showToast('Akun baru berhasil ditambahkan!', 'success');
                    addNotification('Akun baru telah ditambahkan');
                }
                
                // Kembali ke halaman daftar akun
                setTimeout(() => { window.location.href = 'kelola-akun.html'; }, 1000);
                
            } catch (error) {
                console.error(error);
                showToast('Gagal menyimpan data akun.', 'error');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = akunId ? 'Simpan Perubahan' : 'Simpan Akun';
                }
            }
        });
    }
});