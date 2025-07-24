<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <h1>Minha Lista de Tarefas</h1>
      <div class="user-info">
        <span class="welcome-text">Olá, {{ user?.name || 'Usuário' }}!</span>
        <button @click="handleLogout" class="logout-button">Logout</button>
      </div>
    </header>

    <main class="tasks-section">
      <!-- 1. Usando o componente de formulário (só aparece para admins) -->
      <AddTaskForm v-if="isAdmin" @task-added="handleTaskAdded" />
      
      <div class="tasks-list-container">
        <div class="tasks-list-header">
          <h2>Minhas Tarefas</h2>
        </div>
        
        <div v-if="loading" class="loading-message">Carregando tarefas...</div>
        <div v-if="error" class="error-message">{{ error }}</div>
        
        <!-- 2. Usando o componente da lista de tarefas -->
        <TaskList 
          v-if="!loading && tasks.length > 0"
          :tasks="tasks"
          @toggle-complete="handleToggleComplete"
          @delete-task="handleDeleteTask"
        />

        <div v-if="!loading && tasks.length === 0" class="no-tasks-message">
          Você ainda não tem tarefas.
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import apiClient from '../services/api';
import { store } from '../store';

// Importando os novos componentes filhos
import AddTaskForm from '../components/AddTaskForm.vue';
import TaskList from '../components/TaskList.vue';

const router = useRouter();
const user = computed(() => store.user);
const isAdmin = computed(() => user.value?.roles?.some(role => role.name === 'admin'));

const tasks = ref([]);
const loading = ref(true);
const error = ref(null);

// A lógica principal de dados permanece aqui no componente "pai"
const fetchTasks = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await apiClient.get('/tasks');
    tasks.value = response.data;
  } catch (err) {
    error.value = 'Não foi possível carregar as tarefas.';
  } finally {
    loading.value = false;
  }
};

onMounted(fetchTasks);

// Métodos que lidam com os eventos emitidos pelos componentes filhos
const handleTaskAdded = (newTask) => {
  tasks.value.push(newTask);
};

const handleToggleComplete = async (task) => {
  try {
    const response = await apiClient.put(`/tasks/${task.id}`, { completed: !task.completed });
    const index = tasks.value.findIndex(t => t.id === task.id);
    if (index !== -1) tasks.value[index] = response.data;
  } catch (err) {
    alert('Erro ao atualizar a tarefa.');
  }
};

const handleDeleteTask = async (taskId) => {
  if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;
  try {
    await apiClient.delete(`/tasks/${taskId}`);
    tasks.value = tasks.value.filter(t => t.id !== taskId);
  } catch (err) {
    alert('Erro ao excluir a tarefa.');
  }
};

const handleLogout = () => {
  store.clearAuth();
  router.push('/login');
};
</script>

<style scoped>
/* Os estilos do Dashboard agora são mais simples, focados apenas no layout geral */
.dashboard-container { width: 100%; max-width: 960px; margin: 0 auto; padding: 1rem; }
.dashboard-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 1.5rem; border-bottom: 1px solid #d1c4e9; margin-bottom: 2rem; }
.dashboard-header h1 { font-size: 2rem; color: #4a148c; }
.user-info { display: flex; align-items: center; gap: 1.5rem; }
.welcome-text { font-size: 1.1rem; font-weight: 600; color: #6a1b9a; background-color: #ede7f6; padding: 0.5rem 1rem; border-radius: 20px; }
.logout-button { padding: 0.6rem 1.2rem; border: none; border-radius: 6px; background-color: #7e57c2; color: white; font-weight: bold; cursor: pointer; transition: background-color 0.3s ease; }
.logout-button:hover { background-color: #5e35b1; }
.tasks-list-container { background-color: #ffffff; border-radius: 12px; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08); }
.tasks-list-header { padding: 1.5rem; border-bottom: 1px solid #eee; }
.tasks-list-header h2 { margin: 0; font-size: 1.25rem; color: #333; }
.loading-message, .error-message, .no-tasks-message { padding: 3rem 2rem; text-align: center; color: #6c757d; font-size: 1.1rem; }
</style>
