document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. PENGECEKAN SESI AKTIF (AUTO-REDIRECT) ---
    // Jika user sudah punya token (sudah login sebelumnya), langsung arahkan ke foldernya masing-masing
    const currentToken = typeof api !== 'undefined' && api.getToken ? api.getToken() : localStorage.getItem('token');
    const currentRole = localStorage.getItem('role');
    
    if (currentToken && currentRole) {
        if (currentRole === 'admin') {
            window.location.href = 'admin/dashboard.html';
        } else if (currentRole === 'leads') {
            window.location.href = 'leads/customer.html';
        } else if (currentRole === 'campaign') {
            window.location.href = 'campaign/campaign.html';
        }
        return; // Hentikan eksekusi script
    }

    // --- 2. PROSES FORM LOGIN ---
    const loginForm = document.getElementById('login-form');
    const errorAlert = document.getElementById('error-alert');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const usernameInput = document.getElementById('username').value;
            const passwordInput = document.getElementById('password').value;
            const submitBtn = loginForm.querySelector('button[type="submit"]');

            // Reset alert
            errorAlert.style.display = 'none';
            submitBtn.disabled = true;
            submitBtn.textContent = 'Memproses...';

            try {
                // Mencoba hit API backend sungguhan
                const response = await api.post('/akun/login', {
                    username: usernameInput,
                    password: passwordInput
                });

                if (response.token) {
                    if (typeof api !== 'undefined' && api.setToken) {
                        api.setToken(response.token);
                    } else {
                        localStorage.setItem('token', response.token);
                    }
                    
                    const role = response.role; 
                    localStorage.setItem('role', role);
                    localStorage.setItem('username', usernameInput);
                    
                    // Routing otomatis dari respon API Backend
                    if (role === 'admin') {
                        window.location.href = 'admin/dashboard.html';
                    } else if (role === 'leads') {
                        window.location.href = 'leads/customer.html';
                    } else if (role === 'campaign') {
                        window.location.href = 'campaign/campaign.html';
                    }
                } else {
                    throw new Error("Token tidak diterima");
                }

            } catch (error) {
                console.error("Login error:", error);
                errorAlert.style.display = 'block';
                
                // --- 3. MODE BYPASS UI (Jika Backend Mati/Belum Tersedia) ---
                if (error.status === 0 || error.message.includes("fetch") || typeof api === 'undefined') {
                    
                    // Tampilkan 3 tombol khusus untuk masing-masing role
                    errorAlert.innerHTML = `
                        <strong>Mode Test UI Aktif</strong><br>
                        Koneksi ke backend gagal. Silakan gunakan bypass di bawah ini sesuai Role yang ingin Anda uji:<br>
                        
                        <div style="display: flex; gap: 0.5rem; margin-top: 1rem; flex-wrap: wrap;">
                            <button id="bypass-admin" type="button" class="btn" style="padding: 0.5rem; font-size: 0.75rem; flex: 1; background: #C9DFAD; color: #333; border: 1px solid #A3C644;">🔑 Admin</button>
                            
                            <button id="bypass-leads" type="button" class="btn" style="padding: 0.5rem; font-size: 0.75rem; flex: 1; background: #FDE68A; color: #333; border: 1px solid #FBBF24;">💼 Leads</button>
                            
                            <button id="bypass-campaign" type="button" class="btn" style="padding: 0.5rem; font-size: 0.75rem; flex: 1; background: #BFDBFE; color: #333; border: 1px solid #60A5FA;">📢 Campaign</button>
                        </div>
                    `;

                    // Fungsi Universal untuk mengatur sesi Bypass
                    const doBypass = (roleName, targetUrl) => {
                        // Set Token Palsu
                        if (typeof api !== 'undefined' && api.setToken) {
                            api.setToken('mock-token-' + roleName);
                        } else {
                            localStorage.setItem('token', 'mock-token-' + roleName);
                        }
                        
                        // Set Role dan Username Palsu
                        localStorage.setItem('role', roleName);
                        localStorage.setItem('username', 'Test ' + roleName.toUpperCase());
                        
                        // Pindah Halaman
                        window.location.href = targetUrl;
                    };

                    // Pasang event listener ke masing-masing tombol Bypass
                    document.getElementById('bypass-admin').addEventListener('click', () => {
                        doBypass('admin', 'admin/dashboard.html');
                    });
                    
                    document.getElementById('bypass-leads').addEventListener('click', () => {
                        doBypass('leads', 'leads/customer.html');
                    });
                    
                    document.getElementById('bypass-campaign').addEventListener('click', () => {
                        doBypass('campaign', 'campaign/campaign.html');
                    });

                } else {
                    // Jika API jalan, tapi password salah (Status 401)
                    errorAlert.textContent = error.data?.message || error.message || 'Username atau password salah';
                }
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Masuk';
            }
        });
    }
});