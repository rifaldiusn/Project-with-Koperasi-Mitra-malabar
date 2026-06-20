document.addEventListener('DOMContentLoaded', () => {
    
    // 1. SIMULASI LOAD DATA PROFIL
    const loadUserProfile = () => {
        const username = localStorage.getItem('username') || 'admin';
        
        const infoUsername = document.getElementById('info-username');
        if (infoUsername) infoUsername.textContent = username;
        
        const userName = document.querySelector('.user-name');
        if (userName) userName.textContent = username;
    };

    loadUserProfile();

    // 2. FUNGSI LOGOUT
    const btnLogout = document.getElementById('btn-logout');
    
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            if (confirm("Apakah Anda yakin ingin keluar dari sistem?")) {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                localStorage.removeItem('role');
                
                showToast('Berhasil logout', 'success');
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 500);
            }
        });
    }

    // Interaksi Edit Foto
    const btnEditFoto = document.querySelector('.edit-badge');
    if (btnEditFoto) {
        btnEditFoto.addEventListener('click', () => {
            showToast('Fitur ubah foto profil akan segera tersedia', 'info');
        });
    }
});