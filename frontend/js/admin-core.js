// admin-core.js - Core interactive features for all pages
document.addEventListener('DOMContentLoaded', () => {
    console.log("Admin core loaded");

    // --- MODAL HANDLING ---
    // Open modal
    const openModalButtons = document.querySelectorAll('[data-modal-target]');
    openModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-modal-target');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
            }
        });
    });

    // Close modal
    const closeModalButtons = document.querySelectorAll('[data-modal-close]');
    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal-overlay');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });

    // Close modal when clicking outside content
    const modalOverlays = document.querySelectorAll('.modal-overlay');
    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
            }
        });
    });

    // --- DROPDOWN ACTION HANDLING ---
    // Use Event Delegation for dropdown toggles so dynamic tables work automatically
    document.addEventListener('click', (e) => {
        const toggle = e.target.closest('[data-dropdown-toggle], [data-dropdown-target]');
        if (toggle) {
            e.stopImmediatePropagation();
            const dropdownId = toggle.getAttribute('data-dropdown-toggle') || toggle.getAttribute('data-dropdown-target');
            const dropdown = document.getElementById(dropdownId);
            if (dropdown) {
                // Close all other dropdowns first
                document.querySelectorAll('.dropdown-menu').forEach(menu => {
                    if (menu.id !== dropdownId) menu.classList.remove('active');
                });
                
                if (!dropdown.classList.contains('active')) {
                    const rect = toggle.getBoundingClientRect();
                    const spaceBelow = window.innerHeight - rect.bottom;
                    const tr = toggle.closest('tr');
                    const tbody = toggle.closest('tbody');
                    let isLastRows = false;
                    
                    if (tr && tbody) {
                        const rows = Array.from(tbody.children);
                        const rowIndex = rows.indexOf(tr);
                        if (rows.length - rowIndex <= 2) {
                            isLastRows = true;
                        }
                    }
                    
                    if (spaceBelow < 150 || isLastRows) {
                        dropdown.style.top = 'auto';
                        dropdown.style.bottom = '100%';
                        dropdown.style.marginTop = '0';
                        dropdown.style.marginBottom = '0.5rem';
                    } else {
                        dropdown.style.top = '100%';
                        dropdown.style.bottom = 'auto';
                        dropdown.style.marginTop = '0.5rem';
                        dropdown.style.marginBottom = '0';
                    }
                }
                dropdown.classList.toggle('active');
            }
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        document.querySelectorAll('.dropdown-menu.active').forEach(menu => {
            menu.classList.remove('active');
        });
    });

    // --- TOGGLE VIEW / TABS HANDLING ---
    const tabButtons = document.querySelectorAll('[data-tab-target]');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabTarget = button.getAttribute('data-tab-target');
            
            // Update active button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show active tab content
            document.querySelectorAll('[data-tab-content]').forEach(content => {
                content.style.display = content.getAttribute('data-tab-content') === tabTarget ? 'block' : 'none';
            });
        });
    });

    // --- ROLE PROTECTION (Optional, commented out per original code) ---
    // const userRole = localStorage.getItem('role');
    // const path = window.location.pathname;
    // // Example: Check if page is kelola-akun and user is not admin
    // if (path.includes('kelola-akun') && userRole !== 'admin') {
    //     alert('Anda tidak memiliki izin untuk mengakses halaman ini');
    //     window.history.back();
    // }
});
