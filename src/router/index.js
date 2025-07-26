// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { store } from '../store';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Dashboard from '../views/Dashboard.vue';
import NotFound from '../views/NotFound.vue';
import AdminPanel from '../views/AdminPanel.vue'; // 1. Importa a nova view

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
  // 2. Adiciona a nova rota de admin
  {
    path: '/admin',
    name: 'AdminPanel',
    component: AdminPanel,
    meta: { requiresAuth: true, requiresAdmin: true } // Requer autenticação E cargo de admin
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

// 3. Guarda de Navegação Global ATUALIZADA
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!store.token;
  // Verifica se o utilizador existe E se tem o cargo de admin
  const isAdmin = store.user?.roles?.some(role => role.name === 'admin');

  // Se a rota requer autenticação e o utilizador não está logado...
  if (to.meta.requiresAuth && !isAuthenticated) {
    // ...envia-o para o Login.
    next({ name: 'Login' });
  } 
  // Se a rota requer admin e o utilizador NÃO é admin...
  else if (to.meta.requiresAdmin && !isAdmin) {
    // ...envia-o para o Dashboard (uma página segura que ele pode ver).
    next({ name: 'Dashboard' });
  } 
  // Em todos os outros casos, permite a navegação.
  else {
    next();
  }
});

export default router;
