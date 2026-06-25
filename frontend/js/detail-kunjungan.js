// detail-kunjungan.js
document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const kunjunganId = urlParams.get('id');

    if (!kunjunganId) {
        showToast('ID Kunjungan tidak ditemukan', 'error');
        return;
    }

    try {
        const data = await api.get(`/kunjungan/${kunjunganId}`);
        
        if (document.getElementById('input-nama')) document.getElementById('input-nama').value = data.nama || '-';
        if (document.getElementById('input-customer')) document.getElementById('input-customer').value = data.customer ? data.customer.nama : '-';
        if (document.getElementById('input-catatan')) document.getElementById('input-catatan').value = data.catatan || '-';
        if (document.getElementById('input-lat')) document.getElementById('input-lat').value = data.latitude || '-';
        if (document.getElementById('input-long')) document.getElementById('input-long').value = data.longitude || '-';

        const detailImage = document.getElementById('detail-image');
        const noImageText = document.getElementById('no-image-text');

        if (data.file && data.file.path) {
            let imgUrl = data.file.path;
            
            // Try to extract Google Drive file ID if it's a webViewLink
            const dMatch = imgUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
            const idMatch = imgUrl.match(/id=([a-zA-Z0-9_-]+)/);
            
            if (dMatch) {
                imgUrl = `https://drive.google.com/uc?id=${dMatch[1]}`;
            } else if (idMatch) {
                imgUrl = `https://drive.google.com/uc?id=${idMatch[1]}`;
            }

            detailImage.src = imgUrl;
            detailImage.style.display = 'block';
            
            // Wrap in a link to open full image
            detailImage.style.cursor = 'pointer';
            detailImage.onclick = () => window.open(data.file.path, '_blank');
        } else {
            noImageText.style.display = 'block';
        }

    } catch (e) {
        showToast('Gagal memuat detail kunjungan', 'error');
    }
});
