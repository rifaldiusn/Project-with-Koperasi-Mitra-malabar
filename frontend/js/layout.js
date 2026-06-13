// layout.js handles injecting the sidebar and top navigation into pages
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication on all pages except index.html
    if (!window.location.pathname.endsWith('index.html') && window.location.pathname !== '/' && window.location.pathname !== '/frontend/') {
        if (!api.getToken()) {
            window.location.href = 'index.html';
            return;
        }
    }

    const currentPage = window.location.pathname.split('/').pop();

    const sidebarHTML = `
        <aside class="sidebar">
            <div class="sidebar-header">
                <div class="logo-circle" style="width: 32px; height: 32px; background-color: var(--primary-color); color: var(--white); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">M</div>
                <div class="sidebar-logo-text" style="font-size: 1rem; color: var(--secondary-color); font-weight:700;">Mitra Malabar</div>
            </div>
            <nav class="sidebar-menu">
                <a href="#" class="menu-item ${currentPage === 'dashboard.html' ? 'active' : ''}">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                    Dashboard
                </a>
                <a href="customer.html" class="menu-item ${currentPage === 'customer.html' ? 'active' : ''}">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    Customer
                </a>
                <a href="kunjungan.html" class="menu-item ${currentPage === 'kunjungan.html' ? 'active' : ''}">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    Kunjungan
                </a>
                <a href="campaign.html" class="menu-item ${currentPage.includes('campaign') ? 'active' : ''}">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    Campaign
                </a>
                <a href="produk.html" class="menu-item ${currentPage.includes('produk') ? 'active' : ''}">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                    Produk
                </a>
                <a href="riwayat.html" class="menu-item ${currentPage === 'riwayat.html' ? 'active' : ''}">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    Riwayat
                </a>
                <a href="#" id="logout-btn" class="menu-item" style="margin-top: auto;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    Logout
                </a>
            </nav>
        </aside>
    `;

    const topbarHTML = `
        <header class="top-bar">
            <div class="search-bar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <input type="text" placeholder="Search...">
            </div>
            <div class="user-profile">
                <button class="btn-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                </button>
                <button class="btn-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                </button>
                <div class="avatar" style="background-color: var(--primary-dark); color: white; display: flex; align-items:center; justify-content:center; font-weight:bold; font-size:12px;">A</div>
            </div>
        </header>
    `;

    const appContainer = document.querySelector('.app-container');
    if (appContainer) {
        appContainer.insertAdjacentHTML('afterbegin', sidebarHTML);
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.insertAdjacentHTML('afterbegin', topbarHTML);
        }
    }

    // Logout handling
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                // Call logout API endpoint
                await api.get('/akun/logout');
            } catch (error) {
                console.error("Logout API error, clearing token anyway", error);
            } finally {
                api.removeToken();
                window.location.href = 'index.html';
            }
        });
    }
});
