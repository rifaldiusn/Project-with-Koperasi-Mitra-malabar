document.addEventListener('DOMContentLoaded', async () => {
    
    const idAkun = localStorage.getItem('id_akun');
    
    if (!idAkun) {
        showToast("Sesi tidak valid, harap login kembali", "error");
        setTimeout(() => {
            window.location.href = '../index.html'; 
        }, 1500);
        return;
    }

    // Load profile data
    try {
        const akunData = await api.get(`/akun/${idAkun}`);
        
        // Populate fields
        let roleName = "Admin";
        if (akunData.role === 2) roleName = "Sales / Leads";
        else if (akunData.role === 3) roleName = "Marketing / Campaign";

        document.getElementById('user-name-display').textContent = akunData.nama || '-';
        document.getElementById('user-role-display').textContent = roleName;
        
        const avatarInitial = document.getElementById('user-avatar-initial');
        if (avatarInitial) {
            const displayName = akunData.nama || akunData.username || 'A';
            avatarInitial.textContent = displayName.charAt(0).toUpperCase();
        }
        
        document.getElementById('info-nama').textContent = akunData.nama || '-';
        document.getElementById('info-jabatan').textContent = roleName;
        document.getElementById('info-telp').textContent = akunData.telp || '-';
        document.getElementById('info-username').textContent = akunData.username || '-';

        // Hide email field since Akun table doesn't have an email column
        const emailField = document.getElementById('info-email');
        if (emailField && emailField.parentElement) {
            emailField.parentElement.style.display = 'none';
        }

    } catch (err) {
        console.error(err);
        showToast("Gagal memuat profil", "error");
    }

    // Fungsi Tombol Logout
    const btnLogout = document.getElementById('btn-logout');
    
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            const confirmLogout = confirm("Apakah Anda yakin ingin keluar?");
            
            if (confirmLogout) {
                // Bersihkan cache login browser
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                localStorage.removeItem('role');
                localStorage.removeItem('id_akun');
                
                // Arahkan kembali ke halaman awal
                let base = window.location.origin + window.location.pathname.replace(/\/(admin|campaign|leads)\/.*$/, '');
                if (!base.endsWith('/')) base += '/';
                window.location.href = base + 'index.html';
            }
        });
    }
});