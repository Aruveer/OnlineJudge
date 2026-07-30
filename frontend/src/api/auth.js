import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/`;

const authApi = axios.create({
  baseURL: API_URL,
  withCredentials: true, // important for cookies
});

export const register = async (userData) => {
  const response = await authApi.post('register', userData);
  return response.data;
};

export const login = async (userData) => {
  const response = await authApi.post('login', userData);
  return response.data;
};

export const logout = async () => {
  const response = await authApi.post('logout');
  return response.data;
};

export const getStats = async () => {
  const response = await authApi.get('stats');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await authApi.put('profile', profileData);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await authApi.get('users');
  return response.data;
};
