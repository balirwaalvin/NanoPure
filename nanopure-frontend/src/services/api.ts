import axios from 'axios';

// API URL configuration for different environments
const getApiBaseUrl = () => {
  // Use environment variable if set (for production or custom API URL)
  return process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const fetchSensorData = async (deviceId: string) => {
  return api.get(`/sensor-data/${deviceId}`);
};

export const loginUser = async (email: string, password: string) => {
  const res = await api.post('/auth/login', { email, password });
  return res;
};

export const registerUser = async (
  username: string,
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  role?: string,
  phone?: string
) => {
  const res = await api.post('/auth/register', {
    username,
    email,
    password,
    firstName,
    lastName,
    role,
    phone
  });
  return res;
};

export const getSensorSettings = async () => {
  const res = await api.get('/sensors/settings');
  return res;
};

export const updateSensorSettings = async (settings: any) => {
  const res = await api.put('/sensors/settings', settings);
  return res;
};

export const calibrateSensor = async (id: number) => {
  const res = await api.post(`/sensors/${id}/calibrate`, {});
  return res;
};

export const resetSensor = async (id: number) => {
  const res = await api.post(`/sensors/${id}/reset`, {});
  return res;
};

export const disconnectSensor = async (id: number) => {
  const res = await api.post(`/sensors/${id}/disconnect`, {});
  return res;
};

export const getAllSensors = async () => {
  const res = await api.get('/sensors');
  return res;
};

export const updateProfile = async (profile: any) => {
  const res = await api.put('/auth/profile', profile);
  return res;
};

export const updatePreferences = async (preferences: { theme?: string; fontSize?: string }) => {
  const res = await api.put('/auth/preferences', preferences);
  return res;
};

export const getProfile = async () => {
  const res = await api.get('/auth/profile');
  return res;
};

export const startFiltration = async () => {
  const res = await api.post('/sensors/start-filtration', {});
  return res;
};

export const flushSystem = async () => {
  const res = await api.post('/sensors/flush-system', {});
  return res;
};

export const getSystemStatus = async () => {
  const res = await api.get('/sensors/system-status');
  return res;
};

export const downloadReport = async () => {
  const res = await api.get('/sensors/download-report', {
    responseType: 'blob'
  });
  return res;
};

export const getImageFeed = async () => {
  const res = await api.get('/sensors/image-feed');
  return res;
};

export const getAllAlerts = async () => {
  const res = await api.get('/alerts');
  return res;
};

export const acknowledgeAlert = async (id: number) => {
  const res = await api.put(`/alerts/${id}/acknowledge`, {});
  return res;
};

export const getSensorReadings = async (sensorId: number, limit = 50, period?: string) => {
  const params: any = { limit };
  if (period) params.period = period;
  const res = await api.get(`/sensors/${sensorId}/readings`, { params });
  return res;
};

export const testAlertNotification = async () => {
  const res = await api.post('/alerts/test-notification');
  return res;
};

export const testEmailConfiguration = async (testEmail: string) => {
  const res = await api.post('/alerts/test-email-config', { testEmail });
  return res;
};

export const triggerThresholdNotification = async (sensorId: number) => {
  const res = await api.post(`/sensors/${sensorId}/trigger-notification`);
  return res;
}; 