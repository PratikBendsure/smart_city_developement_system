import axios from 'axios';

const API = axios.create({
    baseURL: '',
});

// Attach JWT token from localStorage
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const authAPI = {
    register: (data) => API.post('/api/auth/register', data),
    login: (data) => API.post('/api/auth/login', data),
    me: () => API.get('/api/auth/me'),
    updateProfile: (data) => API.put('/api/auth/profile', data),
};

export const complaintsAPI = {
    submit: (formData) => API.post('/api/complaints', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
    getPublic: () => API.get('/api/complaints/public'),
    track: (id) => API.get(`/api/complaints/track/${id}`),
    getMine: () => API.get('/api/complaints'),
    getStats: () => API.get('/api/complaints/stats'),
    upvote: (id) => API.post(`/api/complaints/${id}/upvote`),
};

export const adminAPI = {
    getComplaints: (params) => API.get('/api/admin/complaints', { params }),
    updateStatus: (id, data) => API.put(`/api/admin/complaints/${id}/status`, data),
    getStats: () => API.get('/api/admin/stats'),
    getUsers: () => API.get('/api/admin/users'),
};

export const aiAPI = {
    classify: (formData) => API.post('/api/ai/classify', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

export const activityAPI = {
    getAll: (params) => API.get('/api/activity', { params }),
    getMine: (params) => API.get('/api/activity/me', { params }),
    logLogout: () => API.post('/api/activity/logout'),
};

export default API;
