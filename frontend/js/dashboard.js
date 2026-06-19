// Proteksi Halaman Khusus Admin
document.addEventListener('DOMContentLoaded', () => {
    // Mengecek apakah ada user yang sedang login dan rolenya adalah admin
    const loggedInUser = localStorage.getItem('username');
    const userRole = localStorage.getItem('role');
    
    // Jika tidak ada data login ATAU rolenya bukan admin, paksa keluar ke index.html
    if (!loggedInUser || userRole !== 'admin') {
        // Bersihkan localStorage untuk keamanan
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        
        alert("Akses ditolak! Halaman ini khusus Administrator.");
        window.location.href = 'index.html'; 
    }
});