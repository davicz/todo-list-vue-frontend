<template>
  <ul class="tasks-list">
    <TaskItem 
      v-for="task in tasks" 
      :key="task.id" 
      :task="task"
      :onToggleComplete="onToggleComplete"
      :onDeleteTask="onDeleteTask"
    />
  </ul>
</template>

<script setup>
import TaskItem from './TaskItem.vue';

defineProps({
  tasks: { type: Array, required: true },
  onToggleComplete: { type: Function, required: true },
  onDeleteTask: { type: Function, required: true }
});
</script>

<style scoped>
.tasks-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
