import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/ai`;

export const askAiChat = async (payload) => {
  const response = await axios.post(`${API_URL}/chat`, payload, {
    withCredentials: true,
  });
  return response.data;
};

export const getAiHint = async (payload) => {
  const response = await axios.post(`${API_URL}/hint`, payload, {
    withCredentials: true,
  });
  return response.data;
};

export const getAiReview = async (payload) => {
  const response = await axios.post(`${API_URL}/review`, payload, {
    withCredentials: true,
  });
  return response.data;
};
