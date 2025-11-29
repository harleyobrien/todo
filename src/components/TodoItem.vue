<script setup>
import { ref } from 'vue';

const props = defineProps({
  todo: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['toggle', 'delete', 'update']);

const isDeleting = ref(false);
const isEditing = ref(false);
const editText = ref('');

const handleDelete = () => {
  isDeleting.value = true;
  emit('delete', props.todo.id);
};

const startEdit = () => {
  if (props.todo.completed) return; // Don't allow editing completed tasks
  isEditing.value = true;
  editText.value = props.todo.text;
};

const saveEdit = () => {
  if (editText.value.trim() && editText.value !== props.todo.text) {
    emit('update', props.todo.id, editText.value.trim());
  }
  isEditing.value = false;
};

const cancelEdit = () => {
  isEditing.value = false;
  editText.value = '';
};

const handleKeydown = (e) => {
  if (e.key === 'Enter') {
    saveEdit();
  } else if (e.key === 'Escape') {
    cancelEdit();
  }
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
    
    <input 
      v-if="isEditing"
      v-model="editText"
      @blur="saveEdit"
      @keydown="handleKeydown"
      class="edit-input"
      ref="editInput"
      autofocus
    >
    <span 
      v-else
      class="todo-text" 
      @click="startEdit"
      :class="{ 'editable': !todo.completed }"
    >{{ todo.text }}</span>
    
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
  background: rgba(34, 197, 94, 0.1); /* Green tint for pending */
  border-radius: 12px;
  margin-bottom: 0.75rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(34, 197, 94, 0.2);
  backdrop-filter: blur(10px);
  cursor: grab;
}

.todo-item:active {
  cursor: grabbing;
}

.todo-item:hover {
  transform: translateY(-2px);
  background: rgba(34, 197, 94, 0.15);
  border-color: rgba(34, 197, 94, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.todo-item.completed {
  opacity: 0.8;
  background: rgba(239, 68, 68, 0.1); /* Red tint for completed */
  border-color: rgba(239, 68, 68, 0.2);
  cursor: default;
}

.todo-item.completed:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.3);
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

.todo-text.editable {
  cursor: text;
}

.todo-text.editable:hover {
  opacity: 0.8;
}

.edit-input {
  flex: 1;
  margin: 0 1rem;
  font-size: 1rem;
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--accent-color);
  border-radius: 6px;
  padding: 0.25rem 0.5rem;
  outline: none;
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
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  border: 2px solid #22c55e; /* Green for pending */
  transition: all 0.2s;
}

.checkbox-container:hover input ~ .checkmark {
  border-color: #16a34a;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: var(--danger-color); /* Red for completed */
  border-color: var(--danger-color);
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
