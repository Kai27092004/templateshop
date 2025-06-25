import api from './api';

export const registerUser = (userData) => {
  // userData là một object chứa { fullName, email, password }
  return api.post('/auth/register', userData);
};