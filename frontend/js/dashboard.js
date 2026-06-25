// dashboard.js - Script for Dashboard Charts

document.addEventListener('DOMContentLoaded', () => {
    // Populate year dropdown (from current year down to base year)
    const yearSelect = document.getElementById('erd-pesan-year');
    const startAppYear = 2024; // Tahun aplikasi/data mulai berjalan
    if (yearSelect) {
        const currentYear = new Date().getFullYear();
        // Selalu tampilkan dari tahun saat ini (bahkan jika tahun 2036) turun ke startAppYear
        for (let y = currentYear; y >= startAppYear; y--) {
            const option = document.createElement('option');
            option.value = y;
            option.textContent = y;
            yearSelect.appendChild(option);
        }
    }

    const startMonthSelect = document.getElementById('erd-pesan-start-month');
    const endMonthSelect = document.getElementById('erd-pesan-end-month');
    let erdPesananChartInstance = null;

    const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

    const loadErdPesananData = async () => {
        if (!yearSelect || !startMonthSelect || !endMonthSelect) return;
        
        const year = yearSelect.value;
        const startMonth = startMonthSelect.value;
        const endMonth = endMonthSelect.value;

        try {
            const data = await api.get(`/pesan/chart/data?year=${year}&start_month=${startMonth}&end_month=${endMonth}`);
            
            // Format data for Chart.js
            const labels = [];
            const dataDibuat = [];
            const dataDikirim = [];

            // data contains array of {bulan: 1, dibuat: 10, dikirim: 5}
            // we should fill gaps if necessary, or just use what we get.
            // A simple approach is just looping from startMonth to endMonth
            for (let m = parseInt(startMonth); m <= parseInt(endMonth); m++) {
                labels.push(monthNames[m]);
                const found = data.find(d => d.bulan === m);
                if (found) {
                    dataDibuat.push(found.dibuat);
                    dataDikirim.push(found.dikirim);
                } else {
                    dataDibuat.push(0);
                    dataDikirim.push(0);
                }
            }

            // Calculate max value for dynamic scaling
            const maxVal = Math.max(...dataDibuat, ...dataDikirim);
            const dynamicMax = maxVal > 0 ? maxVal + Math.ceil(maxVal * 0.1) : 10; // add 10% padding or default to 10

            renderErdPesananChart(labels, dataDibuat, dataDikirim, dynamicMax);
        } catch (error) {
            console.error('Failed to load ERD Pesanan chart data:', error);
            showToast('Gagal memuat data grafik pesanan', 'error');
        }
    };

    const renderErdPesananChart = (labels, dataDibuat, dataDikirim, dynamicMax) => {
        const ctx = document.getElementById('erdPesananChart');
        if (!ctx) return;

        if (erdPesananChartInstance) {
            erdPesananChartInstance.destroy();
        }

        erdPesananChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Dibuat',
                        data: dataDibuat,
                        backgroundColor: '#6D8A21',
                        borderRadius: 4
                    },
                    {
                        label: 'Dikirim',
                        data: dataDikirim,
                        backgroundColor: '#B4D368',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        suggestedMax: dynamicMax,
                        ticks: {
                            precision: 0
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            boxWidth: 8
                        }
                    }
                }
            }
        });
    };

    // --- ERD Data Chart Logic ---
    const erdDataYearSelect = document.getElementById('erd-data-year');
    if (erdDataYearSelect) {
        const currentYear = new Date().getFullYear();
        // Selalu tampilkan dari tahun saat ini (bahkan jika tahun 2036) turun ke startAppYear
        for (let y = currentYear; y >= startAppYear; y--) {
            const option = document.createElement('option');
            option.value = y;
            option.textContent = y;
            erdDataYearSelect.appendChild(option);
        }
    }

    const erdDataStartMonthSelect = document.getElementById('erd-data-start-month');
    const erdDataEndMonthSelect = document.getElementById('erd-data-end-month');
    let erdDataChartInstance = null;

    const loadErdDataChartData = async () => {
        if (!erdDataYearSelect || !erdDataStartMonthSelect || !erdDataEndMonthSelect) return;
        
        const year = erdDataYearSelect.value;
        const startMonth = erdDataStartMonthSelect.value;
        const endMonth = erdDataEndMonthSelect.value;

        try {
            const data = await api.get(`/data/chart/produk?year=${year}&start_month=${startMonth}&end_month=${endMonth}`);
            
            const labels = [];
            const dataDilihat = [];
            const dataDiklik = [];
            const dataSuka = [];
            const dataKeranjang = [];

            for (let m = parseInt(startMonth); m <= parseInt(endMonth); m++) {
                labels.push(monthNames[m]);
                const found = data.find(d => d.bulan === m);
                if (found) {
                    dataDilihat.push(found.dilihat);
                    dataDiklik.push(found.diklik);
                    dataSuka.push(found.suka);
                    dataKeranjang.push(found.keranjang);
                } else {
                    dataDilihat.push(0);
                    dataDiklik.push(0);
                    dataSuka.push(0);
                    dataKeranjang.push(0);
                }
            }

            // Calculate max value for dynamic scaling
            const maxVal = Math.max(...dataDilihat, ...dataDiklik, ...dataSuka, ...dataKeranjang);
            const dynamicMax = maxVal > 0 ? maxVal + Math.ceil(maxVal * 0.1) : 10; // add 10% padding or default to 10

            renderErdDataChart(labels, dataDilihat, dataDiklik, dataSuka, dataKeranjang, dynamicMax);
        } catch (error) {
            console.error('Failed to load ERD Data chart data:', error);
            showToast('Gagal memuat data grafik ERD Data', 'error');
        }
    };

    const renderErdDataChart = (labels, dataDilihat, dataDiklik, dataSuka, dataKeranjang, dynamicMax) => {
        const ctx = document.getElementById('erdDataChart');
        if (!ctx) return;

        if (erdDataChartInstance) {
            erdDataChartInstance.destroy();
        }

        erdDataChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Dilihat',
                        data: dataDilihat,
                        backgroundColor: '#D1E189', // Lightest Green
                        borderRadius: 4
                    },
                    {
                        label: 'Diklik',
                        data: dataDiklik,
                        backgroundColor: '#A3C644', // Primary Color
                        borderRadius: 4
                    },
                    {
                        label: 'Suka',
                        data: dataSuka,
                        backgroundColor: '#6D8A21', // Primary Dark
                        borderRadius: 4
                    },
                    {
                        label: 'Keranjang',
                        data: dataKeranjang,
                        backgroundColor: '#4A5B22', // Secondary Color
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        suggestedMax: dynamicMax,
                        ticks: {
                            precision: 0
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            boxWidth: 8
                        }
                    }
                }
            }
        });
    };

    // --- Tren Penjualan Chart Logic ---
    const trenPenjualanYearSelect = document.getElementById('tren-penjualan-year');
    if (trenPenjualanYearSelect) {
        const currentYear = new Date().getFullYear();
        for (let y = currentYear; y >= startAppYear; y--) {
            const option = document.createElement('option');
            option.value = y;
            option.textContent = y;
            trenPenjualanYearSelect.appendChild(option);
        }
    }

    const trenPenjualanStartMonthSelect = document.getElementById('tren-penjualan-start-month');
    const trenPenjualanEndMonthSelect = document.getElementById('tren-penjualan-end-month');
    const trenPenjualanVariasiSelect = document.getElementById('tren-penjualan-variasi');
    let trenPenjualanChartInstance = null;

    // Load variations for dropdown
    const loadVariasiDropdown = async () => {
        if (!trenPenjualanVariasiSelect) return;
        try {
            const variasiList = await api.get('/variasi/');
            variasiList.forEach(v => {
                const option = document.createElement('option');
                option.value = v.id_variasi;
                option.textContent = v.nama;
                trenPenjualanVariasiSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Failed to load variasi:', error);
        }
    };

    const loadTrenPenjualanChartData = async () => {
        if (!trenPenjualanYearSelect || !trenPenjualanStartMonthSelect || !trenPenjualanEndMonthSelect) return;
        
        const year = trenPenjualanYearSelect.value;
        const startMonth = trenPenjualanStartMonthSelect.value;
        const endMonth = trenPenjualanEndMonthSelect.value;
        const variasiId = trenPenjualanVariasiSelect ? trenPenjualanVariasiSelect.value : '';

        try {
            let url = `/penjualan/chart/data?year=${year}&start_month=${startMonth}&end_month=${endMonth}`;
            if (variasiId) {
                url += `&id_variasi=${variasiId}`;
            }
            const data = await api.get(url);
            
            const labels = [];
            const dataNominal = [];

            for (let m = parseInt(startMonth); m <= parseInt(endMonth); m++) {
                labels.push(monthNames[m]);
                const found = data.find(d => d.bulan === m);
                if (found) {
                    dataNominal.push(found.total_nominal);
                } else {
                    dataNominal.push(0);
                }
            }

            // Calculate max value for dynamic scaling
            const maxVal = Math.max(...dataNominal);
            const dynamicMax = maxVal > 0 ? maxVal + Math.ceil(maxVal * 0.1) : 10;

            renderTrenPenjualanChart(labels, dataNominal, dynamicMax);
        } catch (error) {
            console.error('Failed to load Tren Penjualan chart data:', error);
            showToast('Gagal memuat data grafik tren penjualan', 'error');
        }
    };

    const renderTrenPenjualanChart = (labels, dataNominal, dynamicMax) => {
        const ctx = document.getElementById('trenPenjualanChart');
        if (!ctx) return;

        if (trenPenjualanChartInstance) {
            trenPenjualanChartInstance.destroy();
        }

        trenPenjualanChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Total Penjualan (Rp)',
                        data: dataNominal,
                        borderColor: '#6D8A21',
                        backgroundColor: 'rgba(109, 138, 33, 0.1)',
                        borderWidth: 3,
                        pointBackgroundColor: '#A3C644',
                        pointBorderColor: '#6D8A21',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        fill: true,
                        tension: 0.3 // makes the line slightly curved
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        suggestedMax: dynamicMax,
                        ticks: {
                            precision: 0,
                            callback: function(value) {
                                return 'Rp ' + new Intl.NumberFormat('id-ID').format(value);
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            boxWidth: 8
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    };

    // --- Kunjungan Chart Logic ---
    const kunjunganYearSelect = document.getElementById('kunjungan-year');
    if (kunjunganYearSelect) {
        const currentYear = new Date().getFullYear();
        for (let y = currentYear; y >= startAppYear; y--) {
            const option = document.createElement('option');
            option.value = y;
            option.textContent = y;
            kunjunganYearSelect.appendChild(option);
        }
    }

    const kunjunganStartMonthSelect = document.getElementById('kunjungan-start-month');
    const kunjunganEndMonthSelect = document.getElementById('kunjungan-end-month');
    let kunjunganChartInstance = null;

    const loadKunjunganChartData = async () => {
        if (!kunjunganYearSelect || !kunjunganStartMonthSelect || !kunjunganEndMonthSelect) return;
        
        const year = kunjunganYearSelect.value;
        const startMonth = kunjunganStartMonthSelect.value;
        const endMonth = kunjunganEndMonthSelect.value;

        try {
            const data = await api.get(`/kunjungan/chart/data?year=${year}&start_month=${startMonth}&end_month=${endMonth}`);
            
            const labels = [];
            const dataKunjungan = [];

            for (let m = parseInt(startMonth); m <= parseInt(endMonth); m++) {
                labels.push(monthNames[m]);
                const found = data.find(d => d.bulan === m);
                if (found) {
                    dataKunjungan.push(found.total_kunjungan);
                } else {
                    dataKunjungan.push(0);
                }
            }

            // Calculate max value for dynamic scaling
            const maxVal = Math.max(...dataKunjungan);
            const dynamicMax = maxVal > 0 ? maxVal + Math.ceil(maxVal * 0.1) : 10;

            renderKunjunganChart(labels, dataKunjungan, dynamicMax);
        } catch (error) {
            console.error('Failed to load Kunjungan chart data:', error);
            showToast('Gagal memuat data grafik kunjungan', 'error');
        }
    };

    const renderKunjunganChart = (labels, dataKunjungan, dynamicMax) => {
        const ctx = document.getElementById('kunjunganChart');
        if (!ctx) return;

        if (kunjunganChartInstance) {
            kunjunganChartInstance.destroy();
        }

        kunjunganChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Total Kunjungan',
                        data: dataKunjungan,
                        borderColor: '#F1C40F', // distinct color (yellow)
                        backgroundColor: 'rgba(241, 196, 15, 0.1)',
                        borderWidth: 3,
                        pointBackgroundColor: '#F39C12',
                        pointBorderColor: '#F1C40F',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        fill: true,
                        tension: 0.3 // makes the line slightly curved
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        suggestedMax: dynamicMax,
                        ticks: {
                            precision: 0
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            boxWidth: 8
                        }
                    }
                }
            }
        });
    };

    // --- Campaign Chart Logic ---
    const campaignYearSelect = document.getElementById('campaign-year');
    if (campaignYearSelect) {
        const currentYear = new Date().getFullYear();
        for (let y = currentYear; y >= startAppYear; y--) {
            const option = document.createElement('option');
            option.value = y;
            option.textContent = y;
            campaignYearSelect.appendChild(option);
        }
    }

    const campaignStartMonthSelect = document.getElementById('campaign-start-month');
    const campaignEndMonthSelect = document.getElementById('campaign-end-month');
    let campaignChartInstance = null;

    const loadCampaignChartData = async () => {
        if (!campaignYearSelect || !campaignStartMonthSelect || !campaignEndMonthSelect) return;
        
        const year = campaignYearSelect.value;
        const startMonth = campaignStartMonthSelect.value;
        const endMonth = campaignEndMonthSelect.value;

        try {
            const data = await api.get(`/campaign/chart/data?year=${year}&start_month=${startMonth}&end_month=${endMonth}`);
            
            const labels = [];
            const dataCampaign = [];

            for (let m = parseInt(startMonth); m <= parseInt(endMonth); m++) {
                labels.push(monthNames[m]);
                const found = data.find(d => d.bulan === m);
                if (found) {
                    dataCampaign.push(found.total_campaign);
                } else {
                    dataCampaign.push(0);
                }
            }

            // Calculate max value for dynamic scaling
            const maxVal = Math.max(...dataCampaign);
            const dynamicMax = maxVal > 0 ? maxVal + Math.ceil(maxVal * 0.1) : 10;

            renderCampaignChart(labels, dataCampaign, dynamicMax);
        } catch (error) {
            console.error('Failed to load Campaign chart data:', error);
            showToast('Gagal memuat data grafik campaign', 'error');
        }
    };

    const renderCampaignChart = (labels, dataCampaign, dynamicMax) => {
        const ctx = document.getElementById('campaignChart');
        if (!ctx) return;

        if (campaignChartInstance) {
            campaignChartInstance.destroy();
        }

        campaignChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Total Campaign',
                        data: dataCampaign,
                        borderColor: '#9B59B6', // distinct color (purple)
                        backgroundColor: 'rgba(155, 89, 182, 0.1)',
                        borderWidth: 3,
                        pointBackgroundColor: '#8E44AD',
                        pointBorderColor: '#9B59B6',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        fill: true,
                        tension: 0.3 // slightly curved
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        suggestedMax: dynamicMax,
                        ticks: {
                            precision: 0
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            boxWidth: 8
                        }
                    }
                }
            }
        });
    };

    // Event listeners
    if (yearSelect) yearSelect.addEventListener('change', loadErdPesananData);
    if (startMonthSelect) startMonthSelect.addEventListener('change', loadErdPesananData);
    if (endMonthSelect) endMonthSelect.addEventListener('change', loadErdPesananData);

    if (erdDataYearSelect) erdDataYearSelect.addEventListener('change', loadErdDataChartData);
    if (erdDataStartMonthSelect) erdDataStartMonthSelect.addEventListener('change', loadErdDataChartData);
    if (erdDataEndMonthSelect) erdDataEndMonthSelect.addEventListener('change', loadErdDataChartData);

    if (trenPenjualanVariasiSelect) trenPenjualanVariasiSelect.addEventListener('change', loadTrenPenjualanChartData);
    if (trenPenjualanYearSelect) trenPenjualanYearSelect.addEventListener('change', loadTrenPenjualanChartData);
    if (trenPenjualanStartMonthSelect) trenPenjualanStartMonthSelect.addEventListener('change', loadTrenPenjualanChartData);
    if (trenPenjualanEndMonthSelect) trenPenjualanEndMonthSelect.addEventListener('change', loadTrenPenjualanChartData);

    if (kunjunganYearSelect) kunjunganYearSelect.addEventListener('change', loadKunjunganChartData);
    if (kunjunganStartMonthSelect) kunjunganStartMonthSelect.addEventListener('change', loadKunjunganChartData);
    if (kunjunganEndMonthSelect) kunjunganEndMonthSelect.addEventListener('change', loadKunjunganChartData);

    if (campaignYearSelect) campaignYearSelect.addEventListener('change', loadCampaignChartData);
    if (campaignStartMonthSelect) campaignStartMonthSelect.addEventListener('change', loadCampaignChartData);
    if (campaignEndMonthSelect) campaignEndMonthSelect.addEventListener('change', loadCampaignChartData);

    // Initial load
    loadErdPesananData();
    loadErdDataChartData();
    loadKunjunganChartData();
    loadCampaignChartData();
    loadVariasiDropdown().then(() => loadTrenPenjualanChartData());
});