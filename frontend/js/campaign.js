document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('campaign-grid');
    const modal = document.getElementById('modal-campaign');
    const form = document.getElementById('form-campaign');
    const modalTitle = document.getElementById('modal-title');
    const btnTambah = document.getElementById('btn-tambah-campaign');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const btnCancelModal = document.getElementById('btn-cancel-modal');
    const modalError = document.getElementById('modal-error');
    const errorMessage = document.getElementById('error-message');

    let campaignData = [];

    const isMock = api.getToken() === 'mock-token-12345';
    let mockData = [
        { id_campaign: 1, nama: "Instagram Ads", keterangan: "Program Menyebarluaskan melalui instagram ads", tanggal_mulai: "2045-11-01", tanggal_selesai: "2045-11-22", budget: 10000000 },
        { id_campaign: 2, nama: "Edukasi Keuangan Anggota", keterangan: "Seminar literasi keuangan dan pengenalan aplikasi", tanggal_mulai: "2045-02-15", tanggal_selesai: "2045-03-15", budget: 5000000 }
    ];

    const loadCampaigns = async () => {
        errorMessage.style.display = 'none';
        grid.innerHTML = '<p>Memuat data...</p>';
        
        try {
            if (isMock) {
                campaignData = mockData;
            } else {
                const response = await api.get('/campaign/get-all');
                campaignData = response.campaign || [];
            }
            renderGrid(campaignData);
        } catch (error) {
            errorMessage.style.display = 'block';
            errorMessage.textContent = error.message || 'Gagal memuat data campaign.';
            grid.innerHTML = '';
        }
    };

    const renderGrid = (data) => {
        grid.innerHTML = '';
        
        // Add "Buat Campaign Baru" placeholder card
        const createCard = document.createElement('div');
        createCard.className = 'card';
        createCard.style.display = 'flex';
        createCard.style.flexDirection = 'column';
        createCard.style.alignItems = 'center';
        createCard.style.justifyContent = 'center';
        createCard.style.borderStyle = 'dashed';
        createCard.style.cursor = 'pointer';
        createCard.style.backgroundColor = 'transparent';
        createCard.onclick = openModal;
        createCard.innerHTML = `
            <div style="width: 48px; height: 48px; border-radius: 50%; background-color: #E2E2D6; display:flex; align-items:center; justify-content:center; margin-bottom: 1rem;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </div>
            <h3 style="margin-bottom:0.25rem;">Buat Campaign Baru</h3>
            <p style="color:var(--text-muted); font-size:0.875rem;">Mulai inisiatif baru untuk anggota</p>
        `;
        grid.appendChild(createCard);

        data.forEach(camp => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-img" style="background-color: var(--primary-color);"></div>
                <div class="card-body">
                    <h3 class="card-title">${camp.nama}</h3>
                    <p class="card-desc">${camp.keterangan}</p>
                    <div class="card-meta">
                        <span class="card-meta-label">Periode</span>
                        <span class="card-meta-value">${camp.tanggal_mulai} s/d ${camp.tanggal_selesai}</span>
                    </div>
                    <div class="card-meta">
                        <span class="card-meta-label">Budget</span>
                        <span class="card-meta-value">Rp ${parseInt(camp.budget).toLocaleString('id-ID')}</span>
                    </div>
                    <div class="card-actions" style="position: relative;">
                        <a href="campaign-detail.html?id=${camp.id_campaign}" class="btn-icon" title="Lihat Detail">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </a>
                        <div class="dropdown-wrapper" style="display: inline-block;">
                            <button class="dropdown-toggle" data-dropdown-toggle="dropdown-campaign-${camp.id_campaign}">
                                <i class="ph ph-dots-three-vertical" style="font-size: 20px;"></i>
                            </button>
                            <div class="dropdown-menu" id="dropdown-campaign-${camp.id_campaign}">
                                <button class="dropdown-item btn-edit" data-id="${camp.id_campaign}">
                                    <i class="ph ph-pencil" style="margin-right: 0.5rem;"></i>Edit
                                </button>
                                <button class="dropdown-item danger btn-delete" data-id="${camp.id_campaign}">
                                    <i class="ph ph-trash" style="margin-right: 0.5rem;"></i>Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });

        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => { e.stopPropagation(); openEditModal(btn.dataset.id); });
        });
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => { e.stopPropagation(); deleteCampaign(btn.dataset.id); });
        });
    };

    const openModal = () => {
        form.reset();
        document.getElementById('camp-id').value = '';
        modalTitle.textContent = 'Tambah Campaign';
        modalError.style.display = 'none';
        modal.classList.add('active');
    };

    const closeModal = () => {
        modal.classList.remove('active');
    };

    const openEditModal = async (id) => {
        openModal();
        modalTitle.textContent = 'Edit Campaign';
        
        try {
            let camp = null;
            if (isMock) {
                camp = mockData.find(c => c.id_campaign == id);
            } else {
                camp = await api.get(`/campaign/get/${id}`);
            }

            if (camp) {
                document.getElementById('camp-id').value = camp.id_campaign;
                document.getElementById('camp-nama').value = camp.nama;
                document.getElementById('camp-ket').value = camp.keterangan;
                document.getElementById('camp-start').value = camp.tanggal_mulai;
                document.getElementById('camp-end').value = camp.tanggal_selesai;
                document.getElementById('camp-budget').value = camp.budget;
            }
        } catch (error) {
            alert('Gagal mengambil data detail campaign.');
            closeModal();
        }
    };

    const deleteCampaign = async (id) => {
        if (confirm('Yakin Menghapus Campaign?')) {
            try {
                if (isMock) {
                    mockData = mockData.filter(c => c.id_campaign != id);
                } else {
                    await api.delete(`/campaign/delete/${id}`);
                }
                alert('Campaign Berhasil Dihapus');
                loadCampaigns();
            } catch (error) {
                alert(error.data?.message || 'Gagal menghapus data.');
            }
        }
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('camp-id').value;
        const payload = {
            nama: document.getElementById('camp-nama').value,
            keterangan: document.getElementById('camp-ket').value,
            tanggal_mulai: document.getElementById('camp-start').value,
            tanggal_selesai: document.getElementById('camp-end').value,
            budget: parseInt(document.getElementById('camp-budget').value)
        };

        try {
            if (isMock) {
                if (id) {
                    const index = mockData.findIndex(c => c.id_campaign == id);
                    mockData[index] = { ...mockData[index], ...payload };
                } else {
                    payload.id_campaign = Date.now();
                    mockData.push(payload);
                }
            } else {
                if (id) {
                    await api.put(`/campaign/edit/${id}`, payload);
                } else {
                    await api.post('/campaign/add', payload);
                }
            }
            closeModal();
            loadCampaigns();
        } catch (error) {
            modalError.textContent = error.data?.message || 'Terjadi kesalahan pada server';
            modalError.style.display = 'block';
        }
    });

    btnTambah.addEventListener('click', openModal);
    btnCloseModal.addEventListener('click', closeModal);
    btnCancelModal.addEventListener('click', closeModal);

    loadCampaigns();
});
