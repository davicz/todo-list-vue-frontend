// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { store } from '../store';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Dashboard from '../views/Dashboard.vue';
import NotFound from '../views/NotFound.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true } // Esta rota precisa de autenticação
  },
  // Rota para páginas não encontradas
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guarda de Navegação Global
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.token) {
    next({ name: 'Login' });

} else {
    next();

}
});

export default router;