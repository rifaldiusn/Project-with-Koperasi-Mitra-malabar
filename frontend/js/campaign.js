// ponytail: stripped modal logic — page uses tambah-campaign.html instead
document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.getElementById('campaign-grid-container');
    if (!grid) return;

    const isMock = !api.getToken() || api.getToken().startsWith('mock-token');

    const mockData = [
        { id_campaign: 1, nama: "Instagram Ads", keterangan: "Program menyebarluaskan melalui instagram ads", tanggal: "2045-11-01", batas: "2045-11-22", budget: 10000000 },
        { id_campaign: 2, nama: "Edukasi Keuangan Anggota", keterangan: "Seminar literasi keuangan dan pengenalan aplikasi", tanggal: "2045-02-15", batas: "2045-03-15", budget: 5000000 }
    ];

    const render = (data) => {
        // Pertahankan card "Buat Campaign Baru" yang sudah ada di HTML
        const staticCard = grid.querySelector('.campaign-card');
        grid.innerHTML = '';
        if (staticCard) {
            // Buat ulang card tambah
        }

        data.forEach(camp => {
            const card = document.createElement('div');
            card.className = 'campaign-card';
            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <h3 class="campaign-title">${camp.nama ?? '-'}</h3>
                    <div class="dropdown-wrapper">
                        <button class="dropdown-toggle" data-dropdown-toggle="dropdown-campaign-${camp.id_campaign}">
                            <i class="ph ph-dots-three-vertical" style="font-size: 20px;"></i>
                        </button>
                        <div class="dropdown-menu" id="dropdown-campaign-${camp.id_campaign}">
                            <a href="campaign-detail.html?id=${camp.id_campaign}" class="dropdown-item">
                                <i class="ph ph-eye" style="margin-right: 0.5rem;"></i>Lihat Detail
                            </a>
                            <a href="edit-campaign.html?id=${camp.id_campaign}" class="dropdown-item">
                                <i class="ph ph-pencil" style="margin-right: 0.5rem;"></i>Edit
                            </a>
                            <button class="dropdown-item danger btn-delete" data-id="${camp.id_campaign}">
                                <i class="ph ph-trash" style="margin-right: 0.5rem;"></i>Hapus
                            </button>
                        </div>
                    </div>
                </div>
                <p class="campaign-desc">${camp.keterangan ?? ''}</p>
                <div class="campaign-meta">
                    <span class="meta-item"><i class="ph ph-calendar"></i> ${camp.tanggal ?? '-'} s/d ${camp.batas ?? '-'}</span>
                    <span class="meta-item"><i class="ph ph-money"></i> Rp ${parseInt(camp.budget || 0).toLocaleString('id-ID')}</span>
                </div>
                <a href="campaign-detail.html?id=${camp.id_campaign}" class="btn-text-action">Lihat Detail <i class="ph ph-arrow-right"></i></a>
            `;
            grid.appendChild(card);
        });

        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                if (!confirm('Yakin hapus campaign ini?')) return;
                try {
                    await api.delete(`/campaign/${btn.dataset.id}`);
                    load();
                } catch (err) {
                    alert(err.data?.detail || 'Gagal menghapus.');
                }
            });
        });
    };

    const load = async () => {
        grid.innerHTML = '<p style="padding:1rem;">Memuat data...</p>';
        try {
            if (isMock) {
                render(mockData);
            } else {
                const data = await api.get('/campaign/');
                render(data || []);
            }
        } catch (err) {
            grid.innerHTML = `<p style="color:red;padding:1rem;">Gagal memuat campaign: ${err.data?.detail || err.message || 'Error'}</p>`;
        }
    };

    load();
});
