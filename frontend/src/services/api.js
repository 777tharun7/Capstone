import axios from 'axios';
import itemsData from '../data/items.json';
import evalResults from '../data/evaluation_results.json';
import ppoHistory from '../data/ppo_training_history.json';
import dqnHistory from '../data/dqn_training_history.json';
import banditHistory from '../data/bandit_training_history.json';
import { MOVIE_DETAILS } from '../utils/movieDatabase';

const API_BASE = '/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

// Demo / Fallback State Simulation for Static Live Hosting (e.g. GitHub Pages)
const clientUserStates = {};
const DEFAULT_WEIGHTS = {
  click: 1.0,
  like: 2.5,
  share: 3.5,
  watch_time: 1.5,
  skip: -1.5,
  fatigue_penalty: 0.8,
  diversity_bonus: 0.5,
  novelty_bonus: 0.3,
  retention_reward: 2.0,
};
let localWeights = { ...DEFAULT_WEIGHTS };
let localActiveModel = 'PPO';

const getUserClientState = (userId = 1) => {
  if (!clientUserStates[userId]) {
    clientUserStates[userId] = {
      step: 0,
      satisfaction: 0.82,
      boredom: 0.08,
      history: [],
      recentGenres: [],
      consecutiveSkips: 0,
      totalInteractions: 14,
    };
  }
  return clientUserStates[userId];
};

export const getRecommendations = async (userId = 1, modelName = null, topK = 10) => {
  try {
    const res = await apiClient.post('/recommend', {
      user_id: userId,
      model_name: modelName,
      top_k: topK
    });
    return res.data;
  } catch (err) {
    // Fallback to client simulation
    const model = modelName || localActiveModel;
    const uState = getUserClientState(userId);
    const allItems = Array.isArray(itemsData) ? itemsData : (itemsData.items || []);
    
    // Sort / rank items depending on model
    const ranked = allItems.slice(0, 50).map((it, idx) => {
      let score = 0.95 - idx * 0.015;
      if (model === 'PPO') score += (Math.sin(idx + uState.step) * 0.04);
      if (model === 'DQN') score += (Math.cos(idx * 0.5) * 0.03);
      if (model === 'Contextual Bandit') score = 0.88 - idx * 0.018;
      if (model === 'Collaborative Filtering') score = 0.82 - idx * 0.02;

      const details = MOVIE_DETAILS[it.title] || {};
      return {
        action_id: it.action_id ?? idx,
        item_id: it.item_id ?? (idx + 1),
        title: it.title,
        genres: it.genres || ['Drama'],
        match_score: Math.max(0.4, Math.min(0.99, Number(score.toFixed(3)))),
        predicted_reward: Math.max(0.5, Number((score * 3.8).toFixed(2))),
        confidence: Math.max(0.65, Number((0.92 - idx * 0.01).toFixed(2))),
        rank: idx + 1,
        poster: details.poster || it.poster || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80",
        backdrop: details.backdrop || it.backdrop || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80",
        director: details.director || "Acclaimed Director",
        imdb_rating: details.imdb_rating || it.average_rating || 8.0,
        overview: details.overview || "An engaging cinematic journey exploring rich characters and intricate storylines.",
        duration: details.duration || "1h 54m",
        year: details.year || 1995
      };
    }).slice(0, topK);

    return {
      recommendations: ranked,
      active_model: model,
      model_type: model.includes('PPO') || model.includes('DQN') ? 'Deep Reinforcement Learning' : 'Baseline Heuristic',
      epsilon: model === 'DQN' ? 0.05 : 0.0,
      user_id: userId,
      session_step: uState.step,
      satisfaction: Number(uState.satisfaction.toFixed(2)),
      boredom: Number(uState.boredom.toFixed(2)),
      retention_probability: Number((Math.max(0.1, uState.satisfaction * (1.0 - uState.boredom * 0.7))).toFixed(2)),
      user_state: Array.from({ length: 48 }, (_, i) => Number((Math.sin(i + uState.step) * 0.5 + 0.5).toFixed(3)))
    };
  }
};

export const recordInteraction = async (userId, actionId, interactionType, modelName = null) => {
  try {
    const res = await apiClient.post('/interact', {
      user_id: userId,
      action_id: actionId,
      interaction_type: interactionType,
      model_name: modelName
    });
    return res.data;
  } catch (err) {
    const uState = getUserClientState(userId);
    uState.step += 1;
    uState.totalInteractions += 1;
    
    let baseR = 1.0;
    if (interactionType === 'click') {
      baseR = localWeights.click;
      uState.satisfaction = Math.min(1.0, uState.satisfaction + 0.03);
      uState.boredom = Math.max(0.0, uState.boredom + 0.01);
      uState.consecutiveSkips = 0;
    } else if (interactionType === 'like') {
      baseR = localWeights.like;
      uState.satisfaction = Math.min(1.0, uState.satisfaction + 0.06);
      uState.boredom = Math.max(0.0, uState.boredom - 0.03);
      uState.consecutiveSkips = 0;
    } else if (interactionType === 'share') {
      baseR = localWeights.share;
      uState.satisfaction = Math.min(1.0, uState.satisfaction + 0.09);
      uState.boredom = Math.max(0.0, uState.boredom - 0.05);
      uState.consecutiveSkips = 0;
    } else if (interactionType === 'skip') {
      baseR = localWeights.skip;
      uState.satisfaction = Math.max(0.1, uState.satisfaction - 0.08);
      uState.boredom = Math.min(1.0, uState.boredom + 0.12);
      uState.consecutiveSkips += 1;
    }

    const diversityB = localWeights.diversity_bonus;
    const noveltyB = localWeights.novelty_bonus;
    const fatigueP = uState.boredom * localWeights.fatigue_penalty;
    const totalR = baseR + diversityB + noveltyB - fatigueP;

    return {
      success: true,
      reward: Number(totalR.toFixed(3)),
      reward_breakdown: {
        immediate_reward: Number(baseR.toFixed(2)),
        diversity_bonus: Number(diversityB.toFixed(2)),
        novelty_bonus: Number(noveltyB.toFixed(2)),
        fatigue_penalty: Number((-fatigueP).toFixed(2)),
        retention_reward: Number((uState.satisfaction * 1.5).toFixed(2))
      },
      session_step: uState.step,
      satisfaction: Number(uState.satisfaction.toFixed(2)),
      boredom: Number(uState.boredom.toFixed(2)),
      is_session_done: uState.consecutiveSkips >= 4 || uState.step >= 30,
      retention_probability: Number((uState.satisfaction * (1.0 - uState.boredom * 0.7)).toFixed(2))
    };
  }
};

export const getUserProfile = async (userId = 1) => {
  try {
    const res = await apiClient.get(`/user/${userId}`);
    return res.data;
  } catch (err) {
    const uState = getUserClientState(userId);
    return {
      user_id: userId,
      name: userId === 1 ? "Tharun Devanboina (Demo)" : `Research User #${userId}`,
      age: 24,
      gender: "M",
      occupation: "AI Engineer / Researcher",
      favorite_genres: ["Action", "Sci-Fi", "Drama", "Thriller"],
      total_interactions: uState.totalInteractions,
      current_session: {
        step: uState.step,
        satisfaction: Number(uState.satisfaction.toFixed(2)),
        boredom: Number(uState.boredom.toFixed(2)),
        retention_probability: Number((uState.satisfaction * (1.0 - uState.boredom * 0.7)).toFixed(2))
      }
    };
  }
};

export const listDemoUsers = async () => {
  try {
    const res = await apiClient.get('/users');
    return res.data;
  } catch (err) {
    return [
      { id: 1, name: "Tharun Devanboina", age: 24, occupation: "AI Engineer", favorite_genres: ["Action", "Sci-Fi", "Drama"], interactions_count: 48 },
      { id: 2, name: "Alex Morgan", age: 28, occupation: "Data Scientist", favorite_genres: ["Comedy", "Romance", "Drama"], interactions_count: 35 },
      { id: 3, name: "Sarah Connor", age: 34, occupation: "Executive", favorite_genres: ["Sci-Fi", "Action", "Thriller"], interactions_count: 62 },
      { id: 4, name: "David Miller", age: 45, occupation: "Educator", favorite_genres: ["Documentary", "History", "Drama"], interactions_count: 29 },
      { id: 5, name: "Elena Rostova", age: 22, occupation: "Student", favorite_genres: ["Animation", "Adventure", "Fantasy"], interactions_count: 51 }
    ];
  }
};

export const listItems = async (page = 1, limit = 20, genre = null, search = null) => {
  try {
    const params = { page, limit };
    if (genre && genre !== 'All') params.genre = genre;
    if (search) params.search = search;
    const res = await apiClient.get('/items', { params });
    return res.data;
  } catch (err) {
    let allItems = Array.isArray(itemsData) ? itemsData : (itemsData.items || []);
    if (genre && genre !== 'All') {
      allItems = allItems.filter(it => (it.genres || []).includes(genre));
    }
    if (search) {
      const q = search.toLowerCase();
      allItems = allItems.filter(it => it.title.toLowerCase().includes(q));
    }
    const start = (page - 1) * limit;
    const items = allItems.slice(start, start + limit).map(it => {
      const details = MOVIE_DETAILS[it.title] || {};
      return {
        ...it,
        poster: details.poster || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80",
        backdrop: details.backdrop || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80",
        director: details.director || "Acclaimed Director",
        imdb_rating: details.imdb_rating || it.average_rating || 8.0,
      };
    });
    return {
      items,
      total: allItems.length,
      page,
      pages: Math.ceil(allItems.length / limit)
    };
  }
};

export const getItemDetail = async (actionId) => {
  try {
    const res = await apiClient.get(`/item/${actionId}`);
    return res.data;
  } catch (err) {
    const allItems = Array.isArray(itemsData) ? itemsData : (itemsData.items || []);
    const it = allItems.find(x => x.action_id === Number(actionId)) || allItems[0] || {};
    const details = MOVIE_DETAILS[it.title] || {};
    return {
      action_id: it.action_id ?? actionId,
      item_id: it.item_id ?? 1,
      title: it.title || "Star Wars (1977)",
      genres: it.genres || ["Action", "Adventure", "Sci-Fi"],
      average_rating: it.average_rating || 4.35,
      num_ratings: it.num_ratings || 583,
      poster: details.poster || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80",
      backdrop: details.backdrop || "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1200&auto=format&fit=crop&q=80",
      overview: details.overview || "An epic cinematic masterpiece exploring the depths of space, heroism, and destiny.",
      director: details.director || "George Lucas",
      cast: details.cast || ["Mark Hamill", "Harrison Ford", "Carrie Fisher"],
      duration: details.duration || "2h 01m",
      year: details.year || 1977,
      imdb_rating: details.imdb_rating || 8.6,
      tagline: details.tagline || "May the Force be with you."
    };
  }
};

export const getModelStatus = async () => {
  try {
    const res = await apiClient.get('/model-status');
    return res.data;
  } catch (err) {
    return {
      active_model: localActiveModel,
      models: {
        "PPO": { loaded: true, type: "Proximal Policy Optimization", memory_size: "1.4 MB", device: "CPU", episodes_trained: 300, avg_return: 28.6 },
        "DQN": { loaded: true, type: "Deep Q-Network", memory_size: "1.2 MB", device: "CPU", episodes_trained: 300, avg_return: 24.2 },
        "Contextual Bandit": { loaded: true, type: "LinUCB Linear Upper Confidence Bound", memory_size: "320 KB", episodes_trained: 150, avg_return: 17.8 },
        "Collaborative Filtering": { loaded: true, type: "Matrix Factorization SVD", memory_size: "512 KB", episodes_trained: 1, avg_return: 14.1 }
      }
    };
  }
};

export const selectModel = async (modelName) => {
  localActiveModel = modelName;
  try {
    const res = await apiClient.post('/model-select', { model_name: modelName });
    return res.data;
  } catch (err) {
    return { active_model: modelName, message: `Switched active recommendation model to ${modelName}` };
  }
};

export const getResearchComparison = async () => {
  try {
    const res = await apiClient.get('/research/comparison');
    return res.data;
  } catch (err) {
    return evalResults;
  }
};

export const getTrainingHistory = async () => {
  try {
    const res = await apiClient.get('/research/training-history');
    return res.data;
  } catch (err) {
    return {
      ppo: ppoHistory,
      dqn: dqnHistory,
      bandit: banditHistory
    };
  }
};

export const triggerTraining = async (modelName, episodes = 150) => {
  try {
    const res = await apiClient.post('/train', {
      model_name: modelName,
      episodes: episodes
    });
    return res.data;
  } catch (err) {
    return {
      status: "completed",
      model: modelName,
      episodes: episodes,
      final_reward: modelName === 'PPO' ? 29.4 : modelName === 'DQN' ? 24.8 : 18.2,
      message: `Offline simulation training finished for ${modelName} over ${episodes} episodes.`
    };
  }
};

export const triggerEvaluation = async (numSessions = 50) => {
  try {
    const res = await apiClient.post('/evaluate', null, { params: { num_sessions: numSessions } });
    return res.data;
  } catch (err) {
    return evalResults;
  }
};

export const resetUserSession = async (userId) => {
  try {
    const res = await apiClient.post('/reset-session', { user_id: userId });
    return res.data;
  } catch (err) {
    clientUserStates[userId] = {
      step: 0,
      satisfaction: 0.85,
      boredom: 0.05,
      history: [],
      recentGenres: [],
      consecutiveSkips: 0,
      totalInteractions: 10,
    };
    return {
      user_id: userId,
      message: `User #${userId} simulation session reset successfully`,
      new_state: getUserClientState(userId)
    };
  }
};

export const getRewardWeights = async () => {
  try {
    const res = await apiClient.get('/reward-weights');
    return res.data;
  } catch (err) {
    return localWeights;
  }
};

export const updateRewardWeights = async (weights) => {
  localWeights = { ...localWeights, ...weights };
  try {
    const res = await apiClient.post('/reward-weights', weights);
    return res.data;
  } catch (err) {
    return {
      status: "success",
      weights: localWeights
    };
  }
};

export default apiClient;
