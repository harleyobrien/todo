<script setup>
import { ref, onMounted } from 'vue';
import { todoService } from './services/todo';
import TodoItem from './components/TodoItem.vue';

const todos = ref([]);
const newTodo = ref('');
const loading = ref(true);
const error = ref(null);

const fetchTodos = async () => {
  try {
    loading.value = true;
    todos.value = await todoService.getAll();
  } catch (e) {
    error.value = 'Could not load todos. Make sure the database is connected.';
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const addTodo = async () => {
  if (!newTodo.value.trim()) return;
  
  const text = newTodo.value;
  newTodo.value = ''; // Optimistic clear
  
  try {
    const todo = await todoService.create(text);
    todos.value.unshift(todo);
  } catch (e) {
    error.value = 'Failed to add todo';
    newTodo.value = text; // Restore on error
  }
};

const toggleTodo = async (todo) => {
  const originalStatus = todo.completed;
  todo.completed = !todo.completed; // Optimistic update
  
  try {
    await todoService.update(todo.id, { completed: todo.completed });
  } catch (e) {
    todo.completed = originalStatus; // Revert
    error.value = 'Failed to update todo';
  }
};

const deleteTodo = async (id) => {
  const originalTodos = [...todos.value];
  todos.value = todos.value.filter(t => t.id !== id); // Optimistic delete
  
  try {
    await todoService.delete(id);
  } catch (e) {
    todos.value = originalTodos; // Revert
    error.value = 'Failed to delete todo';
  }
};

onMounted(() => {
  fetchTodos();
});
</script>

<template>
  <div class="app-container">
    <header>
      <h1>Tasks</h1>
      <p class="subtitle">{{ todos.filter(t => !t.completed).length }} remaining</p>
    </header>

    <div class="input-group">
      <input 
        v-model="newTodo" 
        @keyup.enter="addTodo"
        type="text" 
        placeholder="What needs to be done?"
        :disabled="loading"
      >
      <button @click="addTodo" :disabled="!newTodo.trim() || loading">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      </button>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
      <button @click="error = null" class="close-error">×</button>
    </div>

    <div class="todo-list" v-if="!loading">
      <TransitionGroup name="list">
        <TodoItem 
          v-for="todo in todos" 
          :key="todo.id" 
          :todo="todo" 
          @toggle="toggleTodo"
          @delete="deleteTodo"
        />
      </TransitionGroup>
      
      <div v-if="todos.length === 0" class="empty-state">
        <p>No tasks yet. Add one above!</p>
      </div>
    </div>
    
    <div v-else class="loading">
      <div class="spinner"></div>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

header {
  margin-bottom: 2.5rem;
}

h1 {
  font-size: 3rem;
  background: linear-gradient(to right, #fff, #94a3b8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.input-group {
  position: relative;
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
}

input {
  width: 100%;
  padding: 1.25rem 1.5rem;
  border-radius: 16px;
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

input:focus {
  background: rgba(30, 41, 59, 0.8);
  border-color: var(--accent-color);
  box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.1);
}

.input-group button {
  position: absolute;
  right: 8px;
  top: 8px;
  bottom: 8px;
  width: 48px;
  border-radius: 12px;
  background: var(--accent-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.input-group button:hover:not(:disabled) {
  background: var(--accent-hover);
  transform: scale(1.05);
}

.input-group button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--border-color);
}

.error-message {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: var(--danger-color);
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-error {
  background: transparent;
  color: currentColor;
  font-size: 1.5rem;
  padding: 0 0.5rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.02);
  border-radius: 16px;
  border: 2px dashed rgba(255, 255, 255, 0.05);
}

/* Loading Spinner */
.loading {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top-color: var(--accent-color);
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* List Transitions */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.list-leave-active {
  position: absolute;
  width: 100%;
}
</style>
