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
      
      <div class="tasks-list-container">
        <div class="tasks-list-header">
          <h2>Minhas Tarefas</h2>
        </div>
        
        <div v-if="loading" class="loading-message">Carregando tarefas...</div>
        <div v-if="error" class="error-message">{{ error }}</div>
        
        <ul v-if="tasks.length > 0" class="tasks-list">
          <li v-for="task in tasks" :key="task.id" class="task-item" :class="{ 'task-completed': task.completed }">
            <div class="task-details">
              <h3>{{ task.title }}</h3>
              <p>{{ task.description }}</p>
              <small>Data de Vencimento: {{ task.due_date || 'N/A' }}</small>
            </div>
            <div class="task-actions">
              
            </div>
          </li>
        </ul>

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

const router = useRouter();

const user = computed(() => store.user);

const tasks = ref([]);
const loading = ref(true);
const error = ref(null);

const fetchTasks = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await apiClient.get('/tasks');
    tasks.value = response.data;
  } catch (err) {
    error.value = 'Não foi possível carregar as tarefas.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};


onMounted(() => {
  fetchTasks();
});

const handleLogout = () => {
  
  store.clearAuth();
  
  router.push('/login');
};
</script>

<style scoped>


.dashboard-container {
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  padding: 1rem;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #d1c4e9; 
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  font-size: 2rem;
  color: #4a148c; 
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.welcome-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: #6a1b9a; 
  background-color: #ede7f6; 
  padding: 0.5rem 1rem;
  border-radius: 20px;
}

.logout-button {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  background-color: #7e57c2;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.logout-button:hover {
  background-color: #5e35b1; 
}

.tasks-list-container {
  background-color: #ffffff;
  border-radius: 12px; 
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08); 
}

.tasks-list-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.tasks-list-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #333;
}

.loading-message, .error-message, .no-tasks-message {
  padding: 3rem 2rem;
  text-align: center;
  color: #6c757d;
  font-size: 1.1rem;
}

.tasks-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.task-item {
  padding: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  background-color: #fff;
  margin: 1rem;
  border-radius: 8px;
  border-left: 5px solid #ab47bc; 
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06); 
}

.task-item:last-child {
  border-bottom: none;
}

.task-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.task-details h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  color: #5e35b1;
}

.task-details p {
  margin: 0 0 0.5rem 0;
  color: #555;
}

.task-details small {
  color: #888;
  font-style: italic;
}

.task-completed {
  border-left-color: #9e9e9e;
}

.task-completed .task-details h3,
.task-completed .task-details p {
  text-decoration: line-through;
  color: #95a5a6;
}
</style>
