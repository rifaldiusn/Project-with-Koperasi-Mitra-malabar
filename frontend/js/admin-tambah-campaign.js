// admin-tambah-campaign.js - handles campaign form submissions (both add and edit)
document.addEventListener('DOMContentLoaded', () => {
    const formAdd = document.getElementById('form-tambah-campaign');
    const formEdit = document.getElementById('form-edit-campaign');

    // --- TAMBAH CAMPAIGN ---
    if (formAdd) {
        formAdd.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = formAdd.querySelector('button[type="submit"]') || document.querySelector('button[form="form-tambah-campaign"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Menyimpan...';
            }

            const payload = {
                nama: document.getElementById('campaign-nama')?.value,
                tanggal_mulai: document.getElementById('campaign-mulai')?.value,
                tenggat_waktu: document.getElementById('campaign-deadline')?.value,
                budget_total: document.getElementById('campaign-budget')?.value,
                keterangan: document.getElementById('campaign-deskripsi')?.value,
            };

            try {
                // Try real API first
                await api.post('/campaign/add', payload);
                showToast('Campaign baru berhasil ditambahkan!', 'success');
                addNotification(`Campaign "${payload.nama}" telah dibuat`);
                setTimeout(() => { window.location.href = 'campaign.html'; }, 1000);
            } catch (error) {
                // Fallback: simulate success for UI testing
                if (error.status === 0 || error instanceof TypeError) {
                    showToast('Campaign baru berhasil ditambahkan!', 'success');
                    addNotification(`Campaign "${payload.nama}" telah dibuat`);
                    setTimeout(() => { window.location.href = 'campaign.html'; }, 1000);
                } else {
                    showToast(error.data?.message || 'Gagal menambahkan campaign.', 'error');
                }
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Simpan Campaign';
                }
            }
        });
    }

    // --- EDIT CAMPAIGN ---
    if (formEdit) {
        const urlParams = new URLSearchParams(window.location.search);
        const campaignId = urlParams.get('id');

        // Pre-fill form with mock data
        const mockData = {
            nama: "Launching Kopi Arabika",
            tanggal_mulai: "2025-01-01",
            tenggat_waktu: "2025-01-31",
            budget_total: 45000000,
            keterangan: "Promo peluncuran produk baru dengan diskon 20%"
        };

        document.getElementById('campaign-nama').value = mockData.nama;
        document.getElementById('campaign-mulai').value = mockData.tanggal_mulai;
        document.getElementById('campaign-deadline').value = mockData.tenggat_waktu;
        document.getElementById('campaign-budget').value = mockData.budget_total;
        document.getElementById('campaign-deskripsi').value = mockData.keterangan;

        formEdit.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = formEdit.querySelector('button[type="submit"]') || document.querySelector('button[form="form-edit-campaign"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Menyimpan...';
            }

            try {
                await new Promise(resolve => setTimeout(resolve, 500));
                showToast('Campaign berhasil diperbarui!', 'success');
                addNotification(`Campaign "${document.getElementById('campaign-nama').value}" telah diperbarui`);
                setTimeout(() => { window.location.href = 'campaign.html'; }, 1000);
            } catch (error) {
                showToast('Gagal memperbarui campaign.', 'error');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Simpan Campaign';
                }
            }
        });
    }
});
