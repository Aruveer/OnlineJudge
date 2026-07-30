import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/problems/`;

const problemsApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const getProblems = async () => {
  const response = await problemsApi.get('/');
  return response.data;
};

export const getProblemById = async (id) => {
  const response = await problemsApi.get(`/${id}`);
  return response.data;
};

export const createProblem = async (problemData) => {
  const response = await problemsApi.post('/', problemData);
  return response.data;
};

export const updateProblem = async (id, problemData) => {
  const response = await problemsApi.put(`/${id}`, problemData);
  return response.data;
};

export const deleteProblem = async (id) => {
  const response = await problemsApi.delete(`/${id}`);
  return response.data;
};

export const submitCode = async (problemId, code, language) => {
  const response = await problemsApi.post(`${problemId}/submit`, { code, language });
  return response.data;
};

export const getUserSubmissions = async (problemId) => {
  const response = await problemsApi.get(`${problemId}/submissions`);
  return response.data;
};

export const getLeaderboard = async () => {
  const response = await problemsApi.get('leaderboard');
  return response.data;
};

export const runCodeApi = async (code, language, input) => {
  const response = await problemsApi.post('/run', { code, language, input });
  return response.data;
};
