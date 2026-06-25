// ponytail: fetch campaign + sub-resources in parallel, show empty state if none
document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const campaignId = params.get('id');
    if (!campaignId) { alert('ID Campaign tidak ditemukan!'); window.location.href = 'campaign.html'; return; }

    const isMock = !api.getToken() || api.getToken().startsWith('mock-token');
    const fmt = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(val || 0);
    const empty = (msg) => `<tr><td colspan="99" style="text-align:center;color:var(--text-muted);padding:1rem;">${msg}</td></tr>`;
    const emptyLi = (msg) => `<li style="color:var(--text-muted);padding:0.5rem 0;">${msg}</li>`;

    const load = async () => {
        try {
            let campaign, kpiList, briefList, kolList;

            if (isMock) {
                // ponytail: mock minimal — no sub-resources so empty states trigger
                campaign = { id_campaign: campaignId, nama: 'Demo Campaign', keterangan: '-', tanggal: '-', batas: '-', budget: 0 };
                kpiList = []; briefList = []; kolList = [];
            } else {
                const reqs = await Promise.allSettled([
                    api.get(`/campaign/${campaignId}`),
                    api.get('/kpi/').then(r => r.filter(k => k.id_campaign == campaignId)),
                    api.get('/brief/').then(r => r.filter(b => b.id_campaign == campaignId)),
                    api.get('/kol/')
                ]);
                if (reqs[0].status === 'rejected') throw reqs[0].reason;
                campaign = reqs[0].value;
                kpiList = reqs[1].status === 'fulfilled' ? reqs[1].value : [];
                briefList = reqs[2].status === 'fulfilled' ? reqs[2].value : [];
                kolList = reqs[3].status === 'fulfilled' ? reqs[3].value : [];
            }

            // Info campaign
            document.getElementById('cd-breadcrumb').textContent = campaign.nama ?? '-';
            document.getElementById('cd-title').textContent = campaign.nama ?? '-';
            document.getElementById('cd-start').textContent = campaign.tanggal ?? '-';
            document.getElementById('cd-end').textContent = campaign.batas ?? '-';
            document.getElementById('cd-budget').textContent = fmt(campaign.budget);
            document.getElementById('cd-desc').textContent = campaign.keterangan ?? '-';

            // Pre-fill edit form
            document.getElementById('edit-nama').value = campaign.nama ?? '';
            document.getElementById('edit-tanggal').value = campaign.tanggal ?? '';
            document.getElementById('edit-batas').value = campaign.batas ?? '';
            document.getElementById('edit-budget').value = campaign.budget ?? '';
            document.getElementById('edit-keterangan').value = campaign.keterangan ?? '';

            // Sisa waktu
            if (campaign.tanggal && campaign.batas) {
                const today = new Date(); today.setHours(0,0,0,0);
                const start = new Date(campaign.tanggal);
                const end = new Date(campaign.batas);
                const sisaHari = Math.max(0, Math.ceil((end - today) / 86400000));
                const totalHari = Math.max(1, Math.ceil((end - start) / 86400000));
                const pct = Math.min(100, Math.round((sisaHari / totalHari) * 100));
                document.getElementById('cd-sisa-hari').textContent = sisaHari > 0 ? `${sisaHari} hari lagi` : 'Sudah berakhir';
                document.getElementById('cd-sisa-bar').style.width = pct + '%';
            }

            // KPI
            const kpiBody = document.getElementById('kpi-body');
            kpiBody.innerHTML = kpiList.length
                ? kpiList.map(k => `
                    <li>
                        <svg class="kpi-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <div style="flex:1;">
                            <div style="font-weight:600;">${k.nama ?? '-'}</div>
                            <div style="font-size:0.75rem;color:var(--text-muted);">${k.deskripsi ?? ''}</div>
                        </div>
                        <div class="action-icons" style="margin-left:auto;">
                            <button class="btn-icon" onclick="deleteItem('kpi',${k.id_kpi})">🗑</button>
                        </div>
                    </li>`).join('')
                : emptyLi('Belum ada KPI untuk campaign ini.');

            // Brief
            const briefBody = document.getElementById('brief-body');
            briefBody.innerHTML = briefList.length
                ? briefList.map(b => `
                    <tr>
                        <td style="font-weight:500;">${b.poin ?? '-'}</td>
                        <td>${b.detail_pesan ?? '-'}</td>
                        <td><button class="btn-icon" onclick="deleteItem('brief',${b.id_brief})">🗑</button></td>
                    </tr>`).join('')
                : empty('Belum ada Brief untuk campaign ini.');

            // KOL List (Global)
            const kolBody = document.getElementById('kol-body');
            kolBody.innerHTML = kolList.length
                ? kolList.map(k => `
                    <tr>
                        <td style="font-weight:500;">${k.nama ?? '-'}</td>
                        <td>${k.kategori ?? '-'}</td>
                        <td>${k.rate ?? '-'}</td>
                        <td><button class="btn-icon" onclick="deleteItem('kol',${k.id_kol})">🗑</button></td>
                    </tr>`).join('')
                : empty('Belum ada KOL di sistem.');

        } catch (err) {
            console.error(err);
            alert('Gagal memuat detail campaign: ' + (err.data?.detail || err.message || 'Error'));
        }
    };

    window.deleteItem = async (type, id) => {
        if (!confirm(`Yakin hapus ${type.toUpperCase()} ini?`)) return;
        try {
            await api.delete(`/${type}/${id}`);
            load();
        } catch (err) {
            alert(err.data?.detail || 'Gagal menghapus.');
        }
    };

    // Simpan edit campaign
    document.getElementById('btn-simpan-edit').addEventListener('click', async () => {
        if (isMock) { alert('Hanya simulasi UI, data tidak disimpan ke server sungguhan.'); return; }
        const btn = document.getElementById('btn-simpan-edit');
        const errEl = document.getElementById('edit-error');
        errEl.style.display = 'none';
        btn.disabled = true; btn.textContent = 'Menyimpan...';
        try {
            await api.put(`/campaign/${campaignId}`, {
                nama: document.getElementById('edit-nama').value,
                tanggal: document.getElementById('edit-tanggal').value,
                batas: document.getElementById('edit-batas').value,
                budget: parseInt(document.getElementById('edit-budget').value),
                keterangan: document.getElementById('edit-keterangan').value,
            });
            document.getElementById('modal-edit-campaign').classList.remove('active');
            load();
        } catch (err) {
            errEl.textContent = err.data?.detail || 'Gagal menyimpan.';
            errEl.style.display = 'block';
        } finally {
            btn.disabled = false; btn.textContent = 'Simpan Perubahan';
        }
    });

    // Simpan tambah Brief
    document.getElementById('btn-simpan-brief').addEventListener('click', async () => {
        if (isMock) { alert('Hanya simulasi UI, data tidak disimpan ke server sungguhan.'); return; }
        const btn = document.getElementById('btn-simpan-brief');
        const errEl = document.getElementById('brief-error');
        errEl.style.display = 'none';
        btn.disabled = true; btn.textContent = 'Menyimpan...';
        try {
            await api.post('/brief/', {
                poin: document.getElementById('brief-poin').value,
                detail_pesan: document.getElementById('brief-detail').value,
                id_campaign: parseInt(campaignId),
            });
            document.getElementById('brief-poin').value = '';
            document.getElementById('brief-detail').value = '';
            document.getElementById('modal-edit-brief').classList.remove('active');
            load();
        } catch (err) {
            errEl.textContent = err.data?.detail || 'Gagal menyimpan Brief.';
            errEl.style.display = 'block';
        } finally {
            btn.disabled = false; btn.textContent = 'Simpan Brief';
        }
    });

    // Simpan tambah KPI
    document.getElementById('btn-simpan-kpi').addEventListener('click', async () => {
        if (isMock) { alert('Hanya simulasi UI, data tidak disimpan ke server sungguhan.'); return; }
        const btn = document.getElementById('btn-simpan-kpi');
        const errEl = document.getElementById('kpi-error');
        errEl.style.display = 'none';
        btn.disabled = true; btn.textContent = 'Menyimpan...';
        try {
            await api.post('/kpi/', {
                nama: document.getElementById('kpi-nama').value,
                deskripsi: document.getElementById('kpi-deskripsi').value,
                id_campaign: parseInt(campaignId),
            });
            document.getElementById('kpi-nama').value = '';
            document.getElementById('kpi-deskripsi').value = '';
            document.getElementById('modal-edit-kpi').classList.remove('active');
            load();
        } catch (err) {
            errEl.textContent = err.data?.detail || 'Gagal menyimpan KPI.';
            errEl.style.display = 'block';
        } finally {
            btn.disabled = false; btn.textContent = 'Simpan KPI';
        }
    });

    // Simpan tambah KOL
    document.getElementById('btn-simpan-kol').addEventListener('click', async () => {
        if (isMock) { alert('Hanya simulasi UI, data tidak disimpan ke server sungguhan.'); return; }
        const btn = document.getElementById('btn-simpan-kol');
        const errEl = document.getElementById('kol-error');
        errEl.style.display = 'none';
        btn.disabled = true; btn.textContent = 'Menyimpan...';
        try {
            await api.post('/kol/', {
                nama: document.getElementById('kol-nama').value,
                kategori: document.getElementById('kol-kategori').value,
                rate: document.getElementById('kol-rate').value,
            });
            document.getElementById('kol-nama').value = '';
            document.getElementById('kol-kategori').value = '';
            document.getElementById('kol-rate').value = '';
            document.getElementById('modal-add-kol').classList.remove('active');
            alert('KOL berhasil ditambahkan ke database global.');
        } catch (err) {
            errEl.textContent = err.data?.detail || 'Gagal menyimpan KOL.';
            errEl.style.display = 'block';
        } finally {
            btn.disabled = false; btn.textContent = 'Simpan KOL';
        }
    });

    load();
});
