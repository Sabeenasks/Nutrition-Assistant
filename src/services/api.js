import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const registerUser = (payload) => api.post('/auth/register', payload);
export const loginUser = (payload) => api.post('/auth/login', payload);
export const getMeals = () => api.get('/meals');
export const createMeal = (payload) => api.post('/meals', payload);
export const updateMeal = (id, payload) => api.put(`/meals/${id}`, payload);
export const deleteMeal = (id) => api.delete(`/meals/${id}`);
export const generateAiPlan = (payload) => api.post('/plan/generate', payload);
