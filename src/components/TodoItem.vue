<script setup>
import { ref } from 'vue';

const props = defineProps({
  todo: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['toggle', 'delete']);

const isDeleting = ref(false);

const handleDelete = () => {
  isDeleting.value = true;
  emit('delete', props.todo.id);
};
</script>

<template>
  <div class="todo-item" :class="{ 'completed': todo.completed, 'deleting': isDeleting }">
    <label class="checkbox-container">
      <input 
        type="checkbox" 
        :checked="todo.completed" 
        @change="$emit('toggle', todo)"
      >
      <span class="checkmark"></span>
    </label>
    
    <span class="todo-text">{{ todo.text }}</span>
    
    <button class="delete-btn" @click="handleDelete" aria-label="Delete todo">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
    </button>
  </div>
</template>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  margin-bottom: 0.75rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.todo-item:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.todo-item.completed {
  opacity: 0.7;
}

.todo-item.completed .todo-text {
  text-decoration: line-through;
  color: var(--text-secondary);
}

.todo-text {
  flex: 1;
  margin: 0 1rem;
  font-size: 1rem;
  color: var(--text-primary);
  transition: color 0.2s;
}

/* Custom Checkbox */
.checkbox-container {
  display: block;
  position: relative;
  padding-left: 24px;
  cursor: pointer;
  user-select: none;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: -10px;
  left: 0;
  height: 22px;
  width: 22px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.2s;
}

.checkbox-container:hover input ~ .checkmark {
  border-color: var(--accent-color);
}

.checkbox-container input:checked ~ .checkmark {
  background-color: var(--accent-color);
  border-color: var(--accent-color);
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 6px;
  top: 2px;
  width: 6px;
  height: 12px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

/* Delete Button */
.delete-btn {
  background: transparent;
  color: var(--text-secondary);
  padding: 0.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateX(10px);
  transition: all 0.2s;
}

.todo-item:hover .delete-btn {
  opacity: 1;
  transform: translateX(0);
}

.delete-btn:hover {
  color: var(--danger-color);
  background: rgba(239, 68, 68, 0.1);
}

.deleting {
  transform: translateX(100%);
  opacity: 0;
}
</style>
