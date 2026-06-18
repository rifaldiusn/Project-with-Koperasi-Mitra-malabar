document.addEventListener('DOMContentLoaded', () => {
    
    // 1. SIMULASI LOAD DATA PROFIL
    // Di aplikasi nyata, Anda bisa mengambil username/role dari localStorage 
    // atau melakukan fetch API untuk mengambil detail user yang sedang login.
    const loadUserProfile = () => {
        const username = localStorage.getItem('username') || 'demin';
        
        // Memasukkan data ke dalam elemen HTML
        // Note: Field lain di-hardcode sesuai desain, tapi bisa diganti dinamis.
        document.getElementById('info-username').textContent = username;
        document.querySelector('.user-name').textContent = 'Admin Koperasi';
    };

    // Panggil fungsi load data
    loadUserProfile();


    // 2. FUNGSI LOGOUT
    const btnLogout = document.getElementById('btn-logout');
    
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            // Tampilkan pop-up konfirmasi bawaan browser
            const confirmLogout = confirm("Apakah Anda yakin ingin keluar dari sistem?");
            
            if (confirmLogout) {
                // Hapus seluruh data sesi/token yang tersimpan di browser
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                localStorage.removeItem('role');
                
                // Redirect naik satu folder kembali ke halaman login (index.html)
                window.location.href = '../index.html';
            }
        });
    }

    // Interaksi Edit Foto (Hanya visualisasi/alert)
    const btnEditFoto = document.querySelector('.edit-badge');
    if(btnEditFoto) {
        btnEditFoto.addEventListener('click', () => {
            alert('Fitur ubah foto profil akan membuka file explorer.');
        });
    }
});