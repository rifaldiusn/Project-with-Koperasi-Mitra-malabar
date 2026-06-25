const API_BASE_URL = 'http://localhost:8000/api';

const api = {
    getToken: () => localStorage.getItem('token'),
    
    setToken: (token) => localStorage.setItem('token', token),
    
    removeToken: () => localStorage.removeItem('token'),

    request: async (endpoint, options = {}) => {
        const url = `${API_BASE_URL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        const token = api.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            ...options,
            headers
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    // Unauthorized - clear token and redirect to login
                    api.removeToken();
                    if (!window.location.pathname.endsWith('index.html') && window.location.pathname !== '/') {
                        // Gunakan path absolut untuk hindari nyasar ke /campaign/index.html
                        window.location.href = window.location.origin + window.location.pathname.replace(/\/(admin|campaign|leads)\/.*$/, '/index.html');
                    }
                    throw { status: 401, message: "Sesi Anda telah habis. Silakan login kembali." };
                }
                throw { status: response.status, data };
            }

            return data;
        } catch (error) {
            if (error instanceof TypeError) {
                // Network error
                console.error("Network error:", error);
                throw { status: 0, message: "Tidak dapat terhubung ke server. Pastikan server berjalan." };
            }
            throw error;
        }
    },

    get: (endpoint) => api.request(endpoint, { method: 'GET' }),
    post: (endpoint, body) => api.request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
    put: (endpoint, body) => api.request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (endpoint) => api.request(endpoint, { method: 'DELETE' }),
    postFormData: async (endpoint, formData) => {
        const url = `${API_BASE_URL}${endpoint}`;
        const token = api.getToken();
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: formData
        });
        const data = await response.json();
        if (!response.ok) throw { status: response.status, data };
        return data;
    }
};
