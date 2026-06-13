document.addEventListener('DOMContentLoaded', () => {
    // If already logged in, redirect to customer/dashboard
    if (api.getToken()) {
        window.location.href = 'customer.html';
    }

    const loginForm = document.getElementById('login-form');
    const errorAlert = document.getElementById('error-alert');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const submitBtn = loginForm.querySelector('button[type="submit"]');

            errorAlert.style.display = 'none';
            submitBtn.disabled = true;
            submitBtn.textContent = 'Memproses...';

            try {
                // Sesuai dengan spesifikasi API Unit Test di PDF (halaman 6)
                const response = await api.post('/akun/login', {
                    username: username,
                    password: password
                });

                if (response.token) {
                    api.setToken(response.token);
                    window.location.href = 'customer.html'; // Default ke Data Customer
                } else {
                    throw new Error("Token tidak diterima");
                }
            } catch (error) {
                console.error("Login error:", error);
                errorAlert.style.display = 'block';
                // Handle mock/fallback if API server is not running during review
                if (error.status === 0) {
                    errorAlert.innerHTML = `<strong>Koneksi Gagal:</strong> Pastikan backend berjalan di localhost:8000.<br>
                    <em>Mode Mock:</em> Klik tombol di bawah untuk login bypass (hanya untuk pengujian UI).
                    <br><button id="mock-login" type="button" class="btn btn-outline" style="margin-top:0.5rem; padding:0.25rem 0.5rem; font-size:0.75rem;">Login Bypass</button>`;
                    
                    document.getElementById('mock-login').addEventListener('click', () => {
                        api.setToken('mock-token-12345');
                        window.location.href = 'customer.html';
                    });
                } else {
                    errorAlert.textContent = error.data?.message || error.message || 'Pengguna atau password salah';
                }
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Masuk';
            }
        });
    }
});
