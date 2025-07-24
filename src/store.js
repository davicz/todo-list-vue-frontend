import { reactive } from 'vue';

export const store = reactive({
  
  token: localStorage.getItem('token') || null,
  
  user: JSON.parse(localStorage.getItem('user')) || null,

  setAuth(token, user) {
    this.token = token;
    this.user = user;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  clearAuth() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
});