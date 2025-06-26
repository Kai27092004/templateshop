import api from './api';

export const registerUser = (userData) => {
  // userData là một object chứa { fullName, email, password }
  return api.post('/auth/register', userData);
};

export const loginUser = (credentials) => {
  // credentials là một object chứa { email, password }
  return api.post('/auth/login', credentials);
};