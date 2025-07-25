<template>
  <div class="add-task-container">
    <h3>Adicionar Nova Tarefa</h3>
    <form @submit.prevent="handleCreateTask" class="add-task-form">
      <div class="form-row">
        <input type="text" v-model="newTask.title" placeholder="Título da tarefa" required data-cy="add-task-title-input">
        <input type="text" v-model="newTask.description" placeholder="Descrição">
      </div>
      <div class="form-row">
        <input type="date" v-model="newTask.due_date">
        <input type="number" v-model="newTask.user_id" placeholder="ID do Utilizador" required data-cy="add-task-user-id-input">
        <button type="submit" data-cy="add-task-submit-button">Adicionar</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import apiClient from '../services/api';

const emit = defineEmits(['task-added']);

const newTask = ref({
  title: '',
  description: '',
  due_date: '',
  user_id: ''
});

const handleCreateTask = async () => {
  try {
    const response = await apiClient.post('/tasks', newTask.value);
    emit('task-added', response.data);
    newTask.value = { title: '', description: '', due_date: '', user_id: '' };
  } catch (err) {
    alert('Erro ao criar a tarefa. Verifique se você é um admin e os dados estão corretos.');
    console.error(err);
  }
};
</script>

<style scoped>
.add-task-container { background-color: #fafafa; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem; border: 1px dashed #d1c4e9; }
.add-task-form { display: flex; flex-direction: column; gap: 1rem; }
.add-task-form .form-row { display: flex; gap: 1rem; }
.add-task-form input { flex-grow: 1; padding: 0.75rem; border: 1px solid #ccc; border-radius: 4px; }
.add-task-form button { padding: 0.75rem; border: none; border-radius: 4px; background-color: #673ab7; color: white; font-weight: bold; cursor: pointer; }
</style>
