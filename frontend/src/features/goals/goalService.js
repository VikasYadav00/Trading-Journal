import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${BASE_URL}/api/v1/goals/`;

// Get user goals
const getGoals = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(API_URL, config);
  return response.data.data;
};

// Add new goal
const addGoal = async (goalData, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.post(API_URL, goalData, config);
  return response.data.data;
};

// Update goal progress or details
const updateGoal = async (goalId, goalData, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.put(API_URL + goalId, goalData, config);
  return response.data.data;
};

// Delete goal
const deleteGoal = async (goalId, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.delete(API_URL + goalId, config);
  return response.data; // usually { success: true, id: ... }
};

const goalService = { getGoals, addGoal, updateGoal, deleteGoal };
export default goalService;
