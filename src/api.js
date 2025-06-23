import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'accept': 'application/json',
    }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token && !config.url.endsWith('/login')) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  response => response, 
  async error => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.endsWith('/login') &&
      !originalRequest.url.endsWith('/refresh')
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if(refreshToken){
        try{
          const response = await axios.post(`${API_URL}/refresh`, new URLSearchParams({ refresh_token: refreshToken}));
          const newAccessToken = response.data.access_token;

          localStorage.setItem('token', newAccessToken);
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

          return api(originalRequest);
        } catch(refreshError){
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login?expired=true';
        }
      } else {
        localStorage.removeItem('token');
        window.location.href = '/login?expired=true';
      }
    }

    return Promise.reject(error);
  }
);

export default api;