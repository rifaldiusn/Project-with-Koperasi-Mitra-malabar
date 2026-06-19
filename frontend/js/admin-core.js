// Memproteksi seluruh halaman di folder admin/
document.addEventListener('DOMContentLoaded', () => {
    const userRole = localStorage.getItem('role');
    
    // Jika tidak login atau bukan admin, tendang ke luar (ke index.html root)
    //if (userRole !== 'admin') {
       // alert("Sesi tidak valid. Halaman ini khusus Superadmin.");
        // window.location.href = '../index.html';
   // }
});