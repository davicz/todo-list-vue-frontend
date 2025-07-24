<template>
  <ul class="tasks-list">
    <TaskItem 
      v-for="task in tasks" 
      :key="task.id" 
      :task="task"
      @toggle-complete="$emit('toggle-complete', $event)"
      @delete-task="$emit('delete-task', $event)"
    />
  </ul>
</template>

<script setup>
import TaskItem from './TaskItem.vue';

// Recebe a lista de tarefas como propriedade
defineProps({
  tasks: {
    type: Array,
    required: true
  }
});

// "Repassa" os eventos do TaskItem para o Dashboard
defineEmits(['toggle-complete', 'delete-task']);
</script>

<style scoped>
.tasks-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
