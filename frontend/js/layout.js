// layout.js handles injecting the sidebar and top navigation into pages
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication on all pages except index.html
    const path = window.location.pathname;
    if (!path.endsWith('index.html') && path !== '/' && path !== '/frontend/') {
        if (!api.getToken()) {
            // Determine correct index.html path based on current directory
            const depth = path.split('/').filter(p => p).length - (path.endsWith('/') ? 1 : 0);
            const indexPath = '../'.repeat(Math.max(depth - 1, 0)) + 'index.html';
            window.location.href = indexPath;
            return;
        }
    }

    // Get user role from localStorage (default to admin if not set)
    const userRole = localStorage.getItem('role') || 'admin';
    const currentPage = path.split('/').pop();
    // Determine base href based on current directory (admin/, campaign/, leads/)
    const segments = path.split('/');
    const roleDir = segments.length > 2 ? segments[segments.length - 2] : ''; // admin, campaign, or leads
    const baseHref = roleDir ? './' : './';

    // Function to check if menu item should be active
    const isActive = (pagePattern) => {
        if (pagePattern === 'dashboard.html' && currentPage === 'dashboard.html') return true;
        if (pagePattern.includes('*')) {
            return currentPage.startsWith(pagePattern.replace('*', ''));
        }
        return currentPage === pagePattern;
    };

    // Build menu items based on role
    let menuItems = '';
    
    // Admin & Leads have Dashboard
    if (userRole === 'admin' || userRole === 'leads') {
        menuItems += `
            <a href="${baseHref}dashboard.html" class="menu-item ${isActive('dashboard.html') ? 'active' : ''}">
                <i class="ph ph-squares-four" style="font-size: 20px;"></i>
                Dashboard
            </a>
        `;
    }

    // Admin & Leads have Customer & Kunjungan
    if (userRole === 'admin' || userRole === 'leads') {
        menuItems += `
            <a href="${baseHref}customer.html" class="menu-item ${isActive('customer.html') || isActive('tambah-customer.html') || isActive('edit-customer.html') ? 'active' : ''}">
                <i class="ph ph-users" style="font-size: 20px;"></i>
                Customer
            </a>
            <a href="${baseHref}kunjungan.html" class="menu-item ${isActive('kunjungan.html') || isActive('tambah-kunjungan.html') || isActive('edit-kunjungan.html') ? 'active' : ''}">
                <i class="ph ph-map-pin" style="font-size: 20px;"></i>
                Kunjungan
            </a>
        `;
    }

    // Admin & Campaign have Campaign
    if (userRole === 'admin' || userRole === 'campaign') {
        menuItems += `
            <a href="${baseHref}campaign.html" class="menu-item ${isActive('campaign.html') || isActive('tambah-campaign.html') || isActive('campaign-detail.html') || isActive('edit-campaign.html') ? 'active' : ''}">
                <i class="ph ph-note-pencil" style="font-size: 20px;"></i>
                Campaign
            </a>
        `;
    }

    // Produk & Riwayat - all roles
    menuItems += `
        <a href="${baseHref}produk.html" class="menu-item ${isActive('produk.html') || isActive('tambah-produk.html') || isActive('edit-produk.html') ? 'active' : ''}">
            <i class="ph ph-package" style="font-size: 20px;"></i>
            Produk
        </a>
        <a href="${baseHref}riwayat.html" class="menu-item ${isActive('riwayat.html') ? 'active' : ''}">
            <i class="ph ph-clock-counter-clockwise" style="font-size: 20px;"></i>
            Riwayat
        </a>
    `;

    // Kelola Akun - only admin
    if (userRole === 'admin') {
        menuItems += `
            <a href="${baseHref}kelola-akun.html" class="menu-item ${isActive('kelola-akun.html') || isActive('tambah-akun.html') || isActive('edit-akun.html') ? 'active' : ''}" style="margin-top: 2rem;">
                <i class="ph ph-user-gear" style="font-size: 20px;"></i>
                Kelola Akun
            </a>
        `;
    }

    // Logout - all roles
    menuItems += `
        <a href="#" id="logout-btn" class="menu-item" style="margin-top: auto;">
            <i class="ph ph-sign-out" style="font-size: 20px;"></i>
            Logout
        </a>
    `;

    // Determine logo path based on current directory
    const currentPath = window.location.pathname;
    let logoPath = 'images/id-11134233.png'; // Default for index.html
    if (currentPath.includes('/admin/') || currentPath.includes('/campaign/') || currentPath.includes('/leads/')) {
        logoPath = '../images/id-11134233.png';
    }
    
    const sidebarHTML = `
        <aside class="sidebar">
            <div class="sidebar-header">
                <img src="${logoPath}" alt="Logo Koperasi Mitra Malabar" style="max-width: 180px; max-height: 120px; width: auto; height: auto; object-fit: contain;">
            </div>
            <nav class="sidebar-menu">
                ${menuItems}
            </nav>
        </aside>
    `;

    const topbarHTML = `
        <header class="top-bar">
            <div class="search-wrapper">
                <i class="ph ph-magnifying-glass" style="font-size: 18px; color: #888;"></i>
                <input type="text" placeholder="Cari..." id="global-search-input">
            </div>
            <div class="user-profile">
                <div class="notif-wrapper" style="position:relative;">
                    <button class="btn-icon" id="btn-bell" title="Notifikasi">
                        <i class="ph ph-bell" style="font-size: 20px;"></i>
                        <span class="notif-badge" id="notif-badge">3</span>
                    </button>
                    <div class="notif-panel" id="notif-panel">
                        <div class="notif-panel-header">
                            <strong>Notifikasi</strong>
                            <button class="btn-clear-notif" id="btn-clear-notif">Tandai dibaca</button>
                        </div>
                        <div class="notif-list" id="notif-list">
                            <!-- Populated by JS -->
                        </div>
                    </div>
                </div>
                <div class="settings-wrapper" style="position:relative;">
                    <button class="btn-icon" id="btn-gear" title="Pengaturan">
                        <i class="ph ph-gear" style="font-size: 20px;"></i>
                    </button>
                    <div class="settings-panel" id="settings-panel">
                        <div class="settings-panel-header">
                            <strong>Pengaturan</strong>
                        </div>
                        <a href="${baseHref}profil.html" class="settings-item">
                            <i class="ph ph-user" style="margin-right:0.5rem;"></i> Profil Saya
                        </a>
                        ${userRole === 'admin' ? `<a href="${baseHref}kelola-akun.html" class="settings-item">
                            <i class="ph ph-user-gear" style="margin-right:0.5rem;"></i> Kelola Akun
                        </a>` : ''}
                        <button class="settings-item settings-item-danger" id="settings-logout">
                            <i class="ph ph-sign-out" style="margin-right:0.5rem;"></i> Logout
                        </button>
                    </div>
                </div>
                <a href="${baseHref}profil.html" class="user-avatar-link">
                    <div class="avatar" style="background-color: var(--primary-dark); color: white; display: flex; align-items:center; justify-content:center; font-weight:bold; font-size:14px;">${localStorage.getItem('username')?.charAt(0).toUpperCase() || 'A'}</div>
                </a>
            </div>
        </header>
    `;

    // Create toast container for notifications
    const toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    document.body.appendChild(toastContainer);

    const appContainer = document.querySelector('.app-container');
    if (appContainer) {
        // Remove existing sidebar/topbar if any (to avoid duplication)
        const existingSidebar = appContainer.querySelector('.sidebar');
        if (existingSidebar) existingSidebar.remove();
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            const existingTopbar = mainContent.querySelector('.top-bar');
            if (existingTopbar) existingTopbar.remove();
        }

        // Insert new sidebar and topbar
        appContainer.insertAdjacentHTML('afterbegin', sidebarHTML);
        if (mainContent) {
            mainContent.insertAdjacentHTML('afterbegin', topbarHTML);
        }
    }

    // --- NOTIFICATION PANEL (Bell icon) ---
    const bellBtn = document.getElementById('btn-bell');
    const notifPanel = document.getElementById('notif-panel');
    const notifBadge = document.getElementById('notif-badge');
    const notifList = document.getElementById('notif-list');
    const btnClearNotif = document.getElementById('btn-clear-notif');

    // Mock notification data
    let notifications = [
        { id: 1, text: 'Customer baru "Andi Pratama" ditambahkan', time: '5 menit lalu', read: false },
        { id: 2, text: 'Campaign "Panen Raya" telah diperbarui', time: '1 jam lalu', read: false },
        { id: 3, text: 'Kunjungan ke "Toko Makmur" dijadwalkan besok', time: '2 jam lalu', read: false },
    ];

    const renderNotifications = () => {
        if (!notifList) return;
        if (notifications.length === 0) {
            notifList.innerHTML = '<div class="notif-empty"><i class="ph ph-bell-slash" style="font-size:2rem; color:#ccc;"></i><p>Tidak ada notifikasi</p></div>';
            if (notifBadge) notifBadge.style.display = 'none';
            return;
        }
        const unreadCount = notifications.filter(n => !n.read).length;
        if (notifBadge) {
            notifBadge.textContent = unreadCount;
            notifBadge.style.display = unreadCount > 0 ? 'flex' : 'none';
        }
        notifList.innerHTML = notifications.map(n => `
            <div class="notif-item ${n.read ? 'read' : ''}" data-id="${n.id}">
                <div class="notif-dot ${n.read ? '' : 'unread'}"></div>
                <div class="notif-content">
                    <p class="notif-text">${n.text}</p>
                    <span class="notif-time">${n.time}</span>
                </div>
            </div>
        `).join('');
    };

    if (bellBtn && notifPanel) {
        bellBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notifPanel.classList.toggle('active');
            // Close settings panel if open
            const sp = document.getElementById('settings-panel');
            if (sp) sp.classList.remove('active');
        });

        if (btnClearNotif) {
            btnClearNotif.addEventListener('click', () => {
                notifications.forEach(n => n.read = true);
                renderNotifications();
            });
        }
        renderNotifications();
    }

    // --- SETTINGS PANEL (Gear icon) ---
    const gearBtn = document.getElementById('btn-gear');
    const settingsPanel = document.getElementById('settings-panel');

    if (gearBtn && settingsPanel) {
        gearBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            settingsPanel.classList.toggle('active');
            // Close notif panel if open
            if (notifPanel) notifPanel.classList.remove('active');
        });
    }

    const settingsLogout = document.getElementById('settings-logout');
    if (settingsLogout) {
        settingsLogout.addEventListener('click', () => {
            doLogout();
        });
    }

    // Close panels when clicking outside
    document.addEventListener('click', (e) => {
        if (notifPanel && !notifPanel.contains(e.target) && e.target !== bellBtn && !bellBtn?.contains(e.target)) {
            notifPanel.classList.remove('active');
        }
        if (settingsPanel && !settingsPanel.contains(e.target) && e.target !== gearBtn && !gearBtn?.contains(e.target)) {
            settingsPanel.classList.remove('active');
        }
    });

    // --- GLOBAL SEARCH ---
    const globalSearchInput = document.getElementById('global-search-input');
    if (globalSearchInput) {
        globalSearchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const query = globalSearchInput.value.trim().toLowerCase();
                if (!query) return;

                // Search through visible table rows on current page
                const rows = document.querySelectorAll('.data-table tbody tr');
                let matchCount = 0;
                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    if (text.includes(query)) {
                        row.style.display = '';
                        row.style.backgroundColor = '#FFFDE7';
                        matchCount++;
                    } else {
                        row.style.display = 'none';
                    }
                });

                // Also try searching campaign cards
                const cards = document.querySelectorAll('.campaign-card');
                cards.forEach(card => {
                    const text = card.textContent.toLowerCase();
                    if (text.includes(query)) {
                        card.style.display = '';
                        card.style.boxShadow = '0 0 0 2px var(--primary-color)';
                    } else {
                        card.style.display = 'none';
                    }
                });

                if (matchCount === 0 && cards.length === 0) {
                    showToast(`Tidak ditemukan hasil untuk "${globalSearchInput.value}"`, 'error');
                } else {
                    showToast(`${matchCount || cards.length} hasil ditemukan`, 'success');
                }
            }
        });

        // Reset on clear
        globalSearchInput.addEventListener('input', () => {
            if (globalSearchInput.value === '') {
                document.querySelectorAll('.data-table tbody tr').forEach(row => {
                    row.style.display = '';
                    row.style.backgroundColor = '';
                });
                document.querySelectorAll('.campaign-card').forEach(card => {
                    card.style.display = '';
                    card.style.boxShadow = '';
                });
            }
        });
    }

    // --- LOGOUT HANDLING ---
    const doLogout = async () => {
        try {
            await api.get('/akun/logout');
        } catch (error) {
            console.error("Logout API error, clearing token anyway", error);
        } finally {
            api.removeToken();
            localStorage.removeItem('role');
            localStorage.removeItem('username');
            // Redirect to correct index.html
            const segments = window.location.pathname.split('/');
            const depth = segments.filter(p => p).length - (window.location.pathname.endsWith('/') ? 1 : 0);
            const indexPath = '../'.repeat(Math.max(depth - 1, 0)) + 'index.html';
            window.location.href = indexPath;
        }
    };

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            if (confirm('Apakah Anda yakin ingin keluar?')) {
                doLogout();
            }
        });
    }
});

// Toast notification helper - available globally
window.showToast = (message, type = 'success') => {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const iconName = type === 'success' ? 'ph-check-circle' : type === 'error' ? 'ph-x-circle' : 'ph-info';
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="ph ${iconName}"></i>
        </div>
        <div class="toast-message">${message}</div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="ph ph-x"></i>
        </button>
    `;
    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
};

// Helper to add notification to the panel
window.addNotification = (text) => {
    const notifList = document.getElementById('notif-list');
    const notifBadge = document.getElementById('notif-badge');
    if (!notifList) return;

    const item = document.createElement('div');
    item.className = 'notif-item';
    item.innerHTML = `
        <div class="notif-dot unread"></div>
        <div class="notif-content">
            <p class="notif-text">${text}</p>
            <span class="notif-time">Baru saja</span>
        </div>
    `;
    notifList.prepend(item);

    // Update badge
    if (notifBadge) {
        const current = parseInt(notifBadge.textContent || '0');
        notifBadge.textContent = current + 1;
        notifBadge.style.display = 'flex';
    }

    // Remove "no notifications" message if present
    const empty = notifList.querySelector('.notif-empty');
    if (empty) empty.remove();
};
