import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${BASE_URL}/api/v1/auth/`;

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL + 'register', userData);

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
    localStorage.setItem('token', response.data.token);
  }

  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData);

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
    localStorage.setItem('token', response.data.token);
  }

  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

// Update Profile
const updateProfile = async (userData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(API_URL + 'profile', userData, config);

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
    localStorage.setItem('token', response.data.token);
  }

  return response.data;
};

// Forgot Password
const forgotPassword = async (emailData) => {
  const response = await axios.post(API_URL + 'forgot-password', emailData);
  return response.data;
};

// Reset Password
const resetPassword = async (resetData) => {
  const response = await axios.post(API_URL + 'reset-password', resetData);
  return response.data;
};

const authService = {
  register,
  logout,
  login,
  updateProfile,
  forgotPassword,
  resetPassword,
};

export default authService;
