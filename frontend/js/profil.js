document.addEventListener('DOMContentLoaded', () => {
    
    // Pengecekan agar hanya Admin yang bisa membuka halaman ini
    const userRole = localStorage.getItem('role');
    
    if (userRole !== 'admin') {
        alert("Akses ditolak!");
        window.location.href = 'index.html'; 
        return; 
    }

    // Fungsi Tombol Logout
    const btnLogout = document.getElementById('btn-logout');
    
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            const confirmLogout = confirm("Apakah Anda yakin ingin keluar?");
            
            if (confirmLogout) {
                // Bersihkan cache login browser
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                localStorage.removeItem('role');
                
                // Arahkan kembali ke halaman awal
                window.location.href = 'index.html';
            }
        });
    }
});