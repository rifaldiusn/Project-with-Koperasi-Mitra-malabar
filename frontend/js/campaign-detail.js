document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const campaignId = urlParams.get('id');

    if (!campaignId) {
        alert("ID Campaign tidak ditemukan!");
        window.location.href = "campaign.html";
        return;
    }

    const errorMessage = document.getElementById('error-message');
    const isMock = api.getToken() === 'mock-token-12345';
    
    // Initial mock data structure mimicking API response
    let mockData = {
        id_campaign: 1,
        nama: "Panen Raya Malabar 2024",
        keterangan: "Campaign menyambut panen raya dengan diskon dan edukasi",
        tanggal_mulai: "15 Mar 2024",
        tanggal_selesai: "30 Jun 2024",
        budget: 45000000,
        kpi: [
            { id: 1, nama: "500 New Registrations", deskripsi: "target pendaftar baru" },
            { id: 2, nama: "Rp 2.5B Total Deposit", deskripsi: "target deposit" }
        ],
        brief: [
            { id: 1, poin: "Ambience", detail: "Suasana roastery dekat rumah" },
            { id: 2, poin: "Process Awareness", detail: "Menunjukkan value kopi asli" }
        ],
        kol: [
            { id: 1, nama: "Sasha Kamila", kategori: "Lifestyle", kode_voucher: "MALABAR24", rate_fee: 12000000 }
        ],
        tahapan: [
            { id: 1, nama: "Persiapan", aktivitas: "Riset KOL & Penentuan Brief", deadline: "20 Mar 2024", status: 1 }
        ]
    };

    let currentData = null;

    window.loadCampaignDetails = async () => {
        errorMessage.style.display = 'none';
        try {
            if (isMock) {
                currentData = mockData;
            } else {
                currentData = await api.get(`/campaign/get/${campaignId}`);
            }
            renderDetails(currentData);
        } catch (error) {
            errorMessage.style.display = 'block';
            errorMessage.textContent = error.message || 'Gagal memuat detail campaign.';
        }
    };

    const formatCurrency = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val);

    const renderDetails = (data) => {
        document.getElementById('cd-title').textContent = data.nama;
        document.getElementById('cd-start').textContent = data.tanggal_mulai;
        document.getElementById('cd-end').textContent = data.tanggal_selesai;
        document.getElementById('cd-budget').textContent = formatCurrency(data.budget);
        document.getElementById('cd-desc').textContent = data.keterangan;

        // Render KPI
        const kpiBody = document.getElementById('kpi-body');
        kpiBody.innerHTML = (data.kpi || []).map(k => `
            <li>
                <svg class="kpi-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <div style="flex:1;">
                    <div style="font-weight:600;">${k.nama}</div>
                    <div style="font-size:0.75rem; color:var(--text-muted);">${k.deskripsi}</div>
                </div>
                <div class="action-icons" style="margin-left:auto;">
                    <button class="btn-icon" onclick="openModal('kpi', ${k.id})"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                    <button class="btn-icon" onclick="deleteItem('kpi', ${k.id})"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                </div>
            </li>
        `).join('');

        // Render Brief
        const briefBody = document.getElementById('brief-body');
        briefBody.innerHTML = (data.brief || []).map(b => `
            <tr>
                <td style="font-weight:500;">${b.poin}</td>
                <td>${b.detail}</td>
                <td>
                    <div class="action-icons">
                        <button class="btn-icon" onclick="openModal('brief', ${b.id})"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                        <button class="btn-icon" onclick="deleteItem('brief', ${b.id})"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Render KOL
        const kolBody = document.getElementById('kol-body');
        kolBody.innerHTML = (data.kol || []).map(k => `
            <tr>
                <td style="font-weight:500;">${k.nama}</td>
                <td>${k.kategori}</td>
                <td><span style="background:#eee; padding:2px 6px; border-radius:4px; font-size:12px; font-weight:bold;">${k.kode_voucher}</span></td>
                <td>${formatCurrency(k.rate_fee)}</td>
                <td>
                    <div class="action-icons">
                        <button class="btn-icon" onclick="openModal('kol', ${k.id})"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                        <button class="btn-icon" onclick="deleteItem('kol', ${k.id})"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Render Tahapan
        const tahapanBody = document.getElementById('tahapan-body');
        tahapanBody.innerHTML = (data.tahapan || []).map(t => {
            const statusText = t.status === 1 ? 'Selesai' : t.status === 2 ? 'Berjalan' : 'Belum Dimulai';
            const statusColor = t.status === 1 ? '#D4EDDA' : t.status === 2 ? '#FFF3CD' : '#E2E3E5';
            const textColor = t.status === 1 ? '#155724' : t.status === 2 ? '#856404' : '#383D41';
            return `
            <tr>
                <td style="font-weight:500;">${t.nama}</td>
                <td>${t.aktivitas}</td>
                <td>${t.deadline}</td>
                <td><span style="background:${statusColor}; color:${textColor}; padding:4px 8px; border-radius:12px; font-size:0.75rem;">${statusText}</span></td>
                <td>
                    <div class="action-icons">
                        <button class="btn-icon" onclick="openModal('tahapan', ${t.id})"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                        <button class="btn-icon" onclick="deleteItem('tahapan', ${t.id})"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg></button>
                    </div>
                </td>
            </tr>
        `}).join('');
    };

    // --- Dynamic Modal Handling ---
    const modal = document.getElementById('dynamic-modal');
    const form = document.getElementById('dynamic-form');
    const fieldsContainer = document.getElementById('dyn-form-fields');
    
    window.openModal = (type, id = null) => {
        form.reset();
        document.getElementById('dyn-type').value = type;
        document.getElementById('dyn-id').value = id || '';
        document.getElementById('dyn-modal-error').style.display = 'none';

        const titlePrefix = id ? 'Edit' : 'Tambah';
        let title = '';
        let html = '';

        let item = null;
        if (id && currentData[type]) {
            item = currentData[type].find(x => x.id === id);
        }

        if (type === 'kpi') {
            title = `${titlePrefix} KPI`;
            html = `
                <div class="form-group"><label class="form-label">Nama KPI</label><input type="text" id="f-nama" class="form-control" value="${item?.nama||''}" required></div>
                <div class="form-group"><label class="form-label">Deskripsi</label><input type="text" id="f-desc" class="form-control" value="${item?.deskripsi||''}" required></div>
            `;
        } else if (type === 'brief') {
            title = `${titlePrefix} Brief`;
            html = `
                <div class="form-group"><label class="form-label">Poin Mandatory</label><input type="text" id="f-poin" class="form-control" value="${item?.poin||''}" required></div>
                <div class="form-group"><label class="form-label">Detail Pesan</label><textarea id="f-detail" class="form-control" rows="3" required>${item?.detail||''}</textarea></div>
            `;
        } else if (type === 'kol') {
            title = `${titlePrefix} KOL`;
            html = `
                <div class="form-group"><label class="form-label">Nama KOL</label><input type="text" id="f-nama" class="form-control" value="${item?.nama||''}" required></div>
                <div class="form-group"><label class="form-label">Kategori</label><input type="text" id="f-kat" class="form-control" value="${item?.kategori||''}" required></div>
                <div class="form-group"><label class="form-label">Kode Voucher</label><input type="text" id="f-voucher" class="form-control" value="${item?.kode_voucher||''}"></div>
                <div class="form-group"><label class="form-label">Rate Fee</label><input type="number" id="f-fee" class="form-control" value="${item?.rate_fee||0}" required></div>
            `;
        } else if (type === 'tahapan') {
            title = `${titlePrefix} Tahapan`;
            html = `
                <div class="form-group"><label class="form-label">Nama Tahapan</label><input type="text" id="f-nama" class="form-control" value="${item?.nama||''}" required></div>
                <div class="form-group"><label class="form-label">Aktivitas</label><input type="text" id="f-akt" class="form-control" value="${item?.aktivitas||''}" required></div>
                <div class="form-group"><label class="form-label">Deadline</label><input type="date" id="f-dead" class="form-control" value="${item?.deadline||''}" required></div>
                <div class="form-group"><label class="form-label">Status</label>
                    <select id="f-status" class="form-control">
                        <option value="0" ${item?.status==0?'selected':''}>Belum Dimulai</option>
                        <option value="2" ${item?.status==2?'selected':''}>Berjalan</option>
                        <option value="1" ${item?.status==1?'selected':''}>Selesai</option>
                    </select>
                </div>
            `;
        }

        document.getElementById('dyn-modal-title').textContent = title;
        fieldsContainer.innerHTML = html;
        modal.classList.add('active');
    };

    window.closeDynamicModal = () => {
        modal.classList.remove('active');
    };

    window.deleteItem = async (type, id) => {
        if (confirm(`Yakin Menghapus ${type.toUpperCase()}?`)) {
            try {
                if (isMock) {
                    mockData[type] = mockData[type].filter(x => x.id !== id);
                } else {
                    await api.delete(`/campaign/${type}/delete/${id}`);
                }
                loadCampaignDetails();
            } catch (error) {
                alert(error.data?.message || 'Gagal menghapus.');
            }
        }
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const type = document.getElementById('dyn-type').value;
        const id = document.getElementById('dyn-id').value;
        
        let payload = {};
        if (type === 'kpi') payload = { nama: document.getElementById('f-nama').value, deskripsi: document.getElementById('f-desc').value };
        else if (type === 'brief') payload = { poin: document.getElementById('f-poin').value, detail: document.getElementById('f-detail').value };
        else if (type === 'kol') payload = { nama: document.getElementById('f-nama').value, kategori: document.getElementById('f-kat').value, kode_voucher: document.getElementById('f-voucher').value, rate_fee: parseInt(document.getElementById('f-fee').value), id_bukti_pembayaran: 1 };
        else if (type === 'tahapan') payload = { nama: document.getElementById('f-nama').value, aktivitas: document.getElementById('f-akt').value, deadline: document.getElementById('f-dead').value, status: parseInt(document.getElementById('f-status').value) };

        try {
            if (isMock) {
                if (id) {
                    const idx = mockData[type].findIndex(x => x.id == id);
                    mockData[type][idx] = { ...mockData[type][idx], ...payload };
                } else {
                    payload.id = Date.now();
                    mockData[type].push(payload);
                }
            } else {
                if (id) {
                    await api.put(`/campaign/${type}/edit/${id}`, payload);
                } else {
                    await api.post(`/campaign/${type}/add/${campaignId}`, payload);
                }
            }
            closeDynamicModal();
            loadCampaignDetails();
        } catch (error) {
            const errDiv = document.getElementById('dyn-modal-error');
            errDiv.textContent = error.data?.message || 'Gagal menyimpan';
            errDiv.style.display = 'block';
        }
    });

    loadCampaignDetails();
});
