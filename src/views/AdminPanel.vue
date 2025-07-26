<template>
  <div class="admin-panel-container">
    <header class="admin-header">
      <h1>Painel de Administração</h1>
      <router-link to="/" class="back-button">Voltar ao Dashboard</router-link>
    </header>

    <div class="admin-section">
      <h2>Gerir Utilizadores</h2>
      <div v-if="loading" class="loading-message">A carregar utilizadores...</div>
      <div v-else>
        <table class="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Cargo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.roles.map(role => role.name).join(', ') }}</td>
              <td>
                <button @click="deleteUser(user)" class="delete-button" :disabled="isCurrentUser(user.id)">
                  Apagar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import apiClient from '../services/api';
import { store } from '../store';

const users = ref([]);
const loading = ref(true);

const fetchUsers = async () => {
  try {
    // A resposta da API do Laravel com paginate() tem os dados dentro de 'data'
    const response = await apiClient.get('/admin/users');
    users.value = response.data.data; 
  } catch (error) {
    console.error("Erro ao buscar utilizadores:", error);
    alert('Não foi possível carregar os utilizadores.');
  } finally {
    loading.value = false;
  }
};

const deleteUser = async (userToDelete) => {
  if (confirm(`Tem a certeza que quer apagar o utilizador ${userToDelete.name}?`)) {
    try {
      await apiClient.delete(`/admin/users/${userToDelete.id}`);
      users.value = users.value.filter(u => u.id !== userToDelete.id);
      alert('Utilizador apagado com sucesso.');
    } catch (error) {
      console.error("Erro ao apagar utilizador:", error);
      alert(error.response?.data?.message || 'Não foi possível apagar o utilizador.');
    }
  }
};

// Função para desativar o botão de apagar para o próprio utilizador logado
const isCurrentUser = (userId) => {
  return store.user?.id === userId;
};

onMounted(fetchUsers);
</script>

<style scoped>
.admin-panel-container {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
  color: #333;
}
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #d1c4e9;
}
.admin-header h1 {
  color: #4a148c;
}
.back-button {
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  background-color: #7e57c2;
  color: white;
  text-decoration: none;
  font-weight: bold;
}
.admin-section {
  background-color: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.08);
}
.users-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1.5rem;
}
.users-table th, .users-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}
.users-table th {
  background-color: #f8f9fa;
}
.delete-button {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}
.delete-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
