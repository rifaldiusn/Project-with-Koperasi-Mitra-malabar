document.getElementById('btn-lokasi')?.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            document.getElementById('input-lat').value = pos.coords.latitude;
            document.getElementById('input-long').value = pos.coords.longitude;
        });
    } else {
        alert("GPS tidak didukung browser ini.");
    }
});