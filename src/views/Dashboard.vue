<template>
  <div class="dashboard-container">
    <div v-if="notification.message" :class="['notification', notification.type]">
      {{ notification.message }}
    </div>

    <header class="dashboard-header">
      <h1>Minha Lista de Tarefas</h1>
      <div class="user-info">
        <!-- NOVO: Link para o Painel de Admin -->
        <router-link v-if="isAdmin" to="/admin" class="admin-button">Painel Admin</router-link>
        <span class="welcome-text" data-cy="welcome-message">Olá, {{ user?.name || 'Utilizador' }}!</span>
        <button @click="handleLogout" class="logout-button">Logout</button>
      </div>
    </header>

    <main class="tasks-section">
      <AddTaskForm v-if="isAdmin" @task-added="handleTaskAdded" />
      
      <div class="tasks-list-container">
        <div class="tasks-list-header">
          <h2>Minhas Tarefas</h2>
          <input 
            type="text" 
            v-model="searchTerm"
            placeholder="Pesquisar tarefas..."
            class="search-input"
          />
        </div>
        
        <div v-if="loading" class="loading-message">A carregar tarefas...</div>
        <div v-if="error" class="error-message">{{ error }}</div>
        
        <TaskList 
          v-if="!loading && tasks.length > 0"
          :tasks="tasks"
          :onToggleComplete="handleToggleComplete"
          :onDeleteTask="handleDeleteTask"
        />

        <div v-if="!loading && tasks.length === 0" class="no-tasks-message">
          <span v-if="searchTerm">Nenhuma tarefa encontrada para "{{ searchTerm }}".</span>
          <span v-else>Você ainda não tem tarefas.</span>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '../services/api';
import { store } from '../store';

import AddTaskForm from '../components/AddTaskForm.vue';
import TaskList from '../components/TaskList.vue';

const router = useRouter();

// --- MUDANÇA IMPORTANTE AQUI ---
// Em vez de pegar o 'user' uma vez, criamos uma propriedade computada.
// Isto garante que qualquer alteração no 'store.user' será refletida aqui instantaneamente.
const user = computed(() => store.user);
const isAdmin = computed(() => {
  // A verificação agora é feita dentro da propriedade computada, tornando-a reativa.
  return user.value?.roles?.some(role => role.name === 'admin');
});


const tasks = ref([]);
const loading = ref(true);
const error = ref(null);
const notification = ref({ message: null, type: 'success' });
const searchTerm = ref('');
let debounceTimer = null;

const showNotification = (message, type = 'success') => {
  notification.value = { message, type };
  setTimeout(() => {
    notification.value.message = null;
  }, 3000);
};

const fetchTasks = async (search = '') => {
  try {
    loading.value = true;
    error.value = null;
    const response = await apiClient.get('/tasks', {
      params: { search }
    });
    tasks.value = response.data;
  } catch (err) {
    error.value = 'Não foi possível carregar as tarefas.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => fetchTasks());

watch(searchTerm, (newSearchTerm) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    fetchTasks(newSearchTerm);
  }, 500);
});

const handleTaskAdded = (newTask) => {
  fetchTasks(searchTerm.value);
  showNotification('Tarefa adicionada com sucesso!', 'success');
};

const handleToggleComplete = async (task) => {
  try {
    const response = await apiClient.put(`/tasks/${task.id}`, { completed: !task.completed });
    const index = tasks.value.findIndex(t => t.id === task.id);
    if (index !== -1) tasks.value[index] = response.data;
  } catch (err) {
    showNotification('Erro ao atualizar a tarefa.', 'error');
  }
};

const handleDeleteTask = async (taskId) => {
  if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;
  try {
    await apiClient.delete(`/tasks/${taskId}`);
    tasks.value = tasks.value.filter(t => t.id !== taskId);
    showNotification('Tarefa excluída com sucesso.', 'success');
  } catch (err) {
    showNotification('Erro ao excluir a tarefa.', 'error');
  }
};

const handleLogout = async () => {
    try {
        await apiClient.post('/logout');
    } catch (error) {
        console.error('Logout falhou no servidor, a limpar o lado do cliente de qualquer maneira.', error);
    } finally {
        store.clearAuth();
        router.push('/login');
    }
};
</script>

<style scoped>
/* Adicionando estilos para o botão de admin */
.admin-button {
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  background-color: #f39c12;
  color: white;
  font-weight: bold;
  text-decoration: none;
  transition: background-color 0.3s ease;
  margin-right: 1rem; /* Adiciona espaço entre os botões */
}
.admin-button:hover {
  background-color: #e67e22;
}
.tasks-list-header { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; border-bottom: 1px solid #eee; }
.search-input { padding: 0.5rem 0.75rem; border: 1px solid #ccc; border-radius: 6px; width: 250px; transition: all 0.3s ease; }
.search-input:focus { border-color: #7e57c2; box-shadow: 0 0 0 3px rgba(126, 87, 194, 0.2); outline: none; }
.dashboard-container { width: 100%; max-width: 960px; margin: 0 auto; padding: 1rem; }
.dashboard-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 1.5rem; border-bottom: 1px solid #d1c4e9; margin-bottom: 2rem; }
.dashboard-header h1 { font-size: 2rem; color: #4a148c; }
.user-info { display: flex; align-items: center; gap: 1.5rem; }
.welcome-text { font-size: 1.1rem; font-weight: 600; color: #6a1b9a; background-color: #ede7f6; padding: 0.5rem 1rem; border-radius: 20px; }
.logout-button { padding: 0.6rem 1.2rem; border: none; border-radius: 6px; background-color: #7e57c2; color: white; font-weight: bold; cursor: pointer; transition: background-color 0.3s ease; }
.logout-button:hover { background-color: #5e35b1; }
.tasks-list-container { background-color: #ffffff; border-radius: 12px; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08); }
.tasks-list-header h2 { margin: 0; font-size: 1.25rem; color: #333; }
.loading-message, .error-message, .no-tasks-message { padding: 3rem 2rem; text-align: center; color: #6c757d; font-size: 1.1rem; }
.notification { position: fixed; top: 20px; right: 20px; padding: 1rem 1.5rem; border-radius: 8px; color: #fff; font-weight: bold; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000; }
.notification.success { background-color: #28a745; }
.notification.error { background-color: #dc3545; }
</style>
