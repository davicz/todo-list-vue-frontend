<template>
  <li class="task-item" :class="{ 'task-completed': task.completed }" data-cy="task-item">
    <div class="task-status">
      <input 
        type="checkbox" 
        :checked="task.completed"
        @change="handleToggle"
        class="task-checkbox"
        data-cy="task-checkbox"
      />
    </div>
    <div class="task-details">
      <h3>{{ task.title }}</h3>
      <p>{{ task.description }}</p>
      <small>Data de Vencimento: {{ task.due_date || 'N/A' }}</small>
    </div>
    <div class="task-actions">
      <button @click="handleDelete" class="delete-button" data-cy="task-delete-button">
        Excluir
      </button>
    </div>
  </li>
</template>

<script setup>
const props = defineProps({
  task: { type: Object, required: true },
  onToggleComplete: { type: Function, required: true },
  onDeleteTask: { type: Function, required: true }
});

const handleToggle = () => {
  props.onToggleComplete(props.task);
};

const handleDelete = () => {
  props.onDeleteTask(props.task.id);
};
</script>

<style scoped>
/* Os seus estilos permanecem os mesmos */
.task-item { padding: 1.5rem; display: flex; align-items: center; gap: 1.5rem; transition: all 0.3s ease; background-color: #fff; margin: 1rem; border-radius: 8px; border-left: 5px solid #ab47bc; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06); }
.task-item:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1); }
.task-details { flex-grow: 1; }
.task-details h3 { margin: 0 0 0.5rem 0; font-size: 1.2rem; color: #5e35b1; }
.task-details p { margin: 0 0 0.5rem 0; color: #555; }
.task-details small { color: #888; font-style: italic; }
.task-checkbox { width: 20px; height: 20px; cursor: pointer; }
.delete-button { background: none; border: 1px solid #e74c3c; color: #e74c3c; padding: 0.4rem 0.8rem; border-radius: 4px; cursor: pointer; transition: all 0.3s ease; }
.delete-button:hover { background-color: #e74c3c; color: white; }
.task-completed { border-left-color: #9e9e9e; background-color: #f9f9f9; }
.task-completed .task-details h3,
.task-completed .task-details p { text-decoration: line-through; color: #95a5a6; }
</style>
