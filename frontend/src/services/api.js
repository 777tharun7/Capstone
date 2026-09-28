import axios from 'axios';

const API_BASE = '/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

export const getRecommendations = async (userId = 1, modelName = null, topK = 10) => {
  const res = await apiClient.post('/recommend', {
    user_id: userId,
    model_name: modelName,
    top_k: topK
  });
  return res.data;
};

export const recordInteraction = async (userId, actionId, interactionType, modelName = null) => {
  const res = await apiClient.post('/interact', {
    user_id: userId,
    action_id: actionId,
    interaction_type: interactionType,
    model_name: modelName
  });
  return res.data;
};

export const getUserProfile = async (userId = 1) => {
  const res = await apiClient.get(`/user/${userId}`);
  return res.data;
};

export const listDemoUsers = async () => {
  const res = await apiClient.get('/users');
  return res.data;
};

export const listItems = async (page = 1, limit = 20, genre = null, search = null) => {
  const params = { page, limit };
  if (genre && genre !== 'All') params.genre = genre;
  if (search) params.search = search;
  const res = await apiClient.get('/items', { params });
  return res.data;
};

export const getItemDetail = async (actionId) => {
  const res = await apiClient.get(`/item/${actionId}`);
  return res.data;
};

export const getModelStatus = async () => {
  const res = await apiClient.get('/model-status');
  return res.data;
};

export const selectModel = async (modelName) => {
  const res = await apiClient.post('/model-select', { model_name: modelName });
  return res.data;
};

export const getResearchComparison = async () => {
  const res = await apiClient.get('/research/comparison');
  return res.data;
};

export const getTrainingHistory = async () => {
  const res = await apiClient.get('/research/training-history');
  return res.data;
};

export const triggerTraining = async (modelName, episodes = 150) => {
  const res = await apiClient.post('/train', {
    model_name: modelName,
    episodes: episodes
  });
  return res.data;
};

export const triggerEvaluation = async (numSessions = 50) => {
  const res = await apiClient.post('/evaluate', null, { params: { num_sessions: numSessions } });
  return res.data;
};

export const resetUserSession = async (userId) => {
  const res = await apiClient.post('/reset-session', { user_id: userId });
  return res.data;
};

export const getRewardWeights = async () => {
  const res = await apiClient.get('/reward-weights');
  return res.data;
};

export const updateRewardWeights = async (weights) => {
  const res = await apiClient.post('/reward-weights', weights);
  return res.data;
};

export default apiClient;
