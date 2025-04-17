<template>
  <q-page class="flex flex-center q-pa-md">
    <q-card class="q-pa-md" style="max-width: 650px; width: 100%; border-radius: 12px; box-shadow: none">
      <q-card-section class="q-pt-none">
        <div class="text-h5 text-primary text-center q-mb-md">Add Tasks</div>

        <q-input
          filled
          v-model="searchQuery"
          label="Search Tasks"
          dense
          class="q-mb-md"
          debounce="300"
        />

        <q-input
          filled
          v-model="newTodo"
          label="What needs to be done?"
          dense
          autofocus
          class="q-mb-md"
        />

        <q-btn
          :label="'Add Task'"
          color="primary"
          class="full-width q-mb-md"
          @click="addTodo"
          :disabled="!newTodo.trim()"
        />

        <!-- Todo List -->
        <q-list class="scrollable-list">
          <q-item v-for="(todo, index) in filteredTodos" :key="index" class="q-mb-xs">
            <q-item-section>
              <div class="flex items-center justify-between">
                <label class="custom-checkbox">
                  <input type="checkbox"
                         v-model="todo.is_completed"
                         @click="updateTodo({ ...todo, is_completed: !todo.is_completed, title: todo.title }, $event, false)"
                         class="q-mr-md"
                  />
                  <span class="checkmark"></span>
                </label>
                <div v-if="isEditing && index === taskSelectedIndex" class="flex" style="flex-grow: 1; display: flex; align-items: center;">
                  <q-input
                    filled
                    v-model="newTodo"
                    label="What needs to be done?"
                    dense
                    autofocus
                    class="q-mb-md"
                    style="flex-grow: 1; margin-right: 10px;"
                  />
                  <q-btn
                    icon="check"
                    @click="updateTodo({ ...taskSelected, title: newTodo }, $event, false)"
                    class="q-ml-md"
                    color="primary"
                    flat
                    style="flex-shrink: 0;"
                  />
                </div>
                <div v-if="!isEditing || taskSelectedIndex !== index" style="width: 520px; margin-top: 10px" class="flex justify-between">
                  <span v-if="!isEditing || taskSelectedIndex !== index"
                        @click="taskClick(todo, index)"
                        :style="{
        textDecoration: todo.is_completed ? 'line-through' : 'none',
      }"
                        class="text-subtitle2 cursor-pointer todo-title"
                        style="width: 300px; max-width: 300px;">{{ todo.title }}</span>
                  <q-btn
                    icon="delete"
                    dense
                    @click="deleteTodo(todo)"
                    class="q-ml-md no-hover-btn"
                    style="width: 50px"
                    color="negative"
                    flat
                  />
                </div>
              </div>
            </q-item-section>
          </q-item>
        </q-list>

        <div class="q-mt-md q-gutter-md row items-center justify-between">
          <div class="text-caption">
            <span>{{ filteredTodos.length }} items</span>
          </div>
          <div>
            <q-btn flat label="All" @click="updateFilter('all')" />
            <q-btn flat label="In Complete" @click="updateFilter('incomplete')" />
            <q-btn flat label="Completed" @click="updateFilter('completed')" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTaskStore } from 'stores/taskStore.js'

const newTodo = ref('')
const searchQuery = ref('')
const isEditing = ref(false)
const taskSelected = ref(null)
const taskSelectedIndex = ref('')
const taskStore = useTaskStore()

onMounted(async () => {
  await taskStore.getTasks('all')
})

const filter = ref('all')

const filteredTodos = computed(() => {
  const tasks = taskStore.tasks.data || []

  let filteredList = tasks.filter(todo => {
    return todo.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  })
  filteredList.sort((a, b) => {
    return a.is_completed - b.is_completed;
  });

  if (filter.value === 'incomplete') {
    filteredList = filteredList.filter(todo => !todo.is_completed)
  } else if (filter.value === 'completed') {
    filteredList = filteredList.filter(todo => todo.is_completed)
  }

  return filteredList
})

async function addTodo() {
  if (newTodo.value.trim()) {
    await taskStore.addTask(newTodo.value.trim())
    newTodo.value = ''
    await taskStore.getTasks('all')
  }
}

async function updateTodo(todo, event, eventRequired) {
  const isCompleted = eventRequired ? event.target.checked : todo.is_completed;
  await taskStore.updateTask({ ...todo, is_completed: isCompleted });
  newTodo.value = '';
  await taskStore.getTasks('all');
  isEditing.value = false
}

async function deleteTodo(todo) {
  await taskStore.deleteTask(todo)
  await taskStore.getTasks('all')
}

function taskClick(item, index) {
  newTodo.value = item.title
  isEditing.value = true
  taskSelected.value = item
  taskSelectedIndex.value = index
}

async function updateFilter(value) {
  await taskStore.getTasks(value)
}

</script>

<style scoped>
/* Your existing styles */
.scrollable-list {
  max-height: 400px; /* Set a fixed height */
  overflow-y: auto;  /* Enable vertical scrolling */
}

.custom-checkbox {
  position: relative;
  display: inline-block;
  cursor: pointer;
  width: 18px; /* Adjust size as needed */
  height: 18px; /* Adjust size as needed */
}

.custom-checkbox input {
  opacity: 0; /* Hide the default checkbox */
  position: absolute;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: transparent; /* Make the background transparent */
  border: 2px solid #ccc; /* Border color */
  border-radius: 50%; /* Make it circular */
  transition: background-color 0.3s, border-color 0.3s;
}

.custom-checkbox input:checked + .checkmark {
  background-color: transparent; /* Keep it transparent when checked */
  border-color: green; /* Change border color when checked */
}

.custom-checkbox input:checked + .checkmark::after {
  content: "";
  position: absolute;
  left: 4.5px; /* Adjust position for the checkmark */
  top: 1.5px; /* Adjust position for the checkmark */
  width: 5px; /* Width of the checkmark */
  height: 10px; /* Height of the checkmark */
  border: solid green; /* Checkmark color */
  border-width: 0 2px 2px 0; /* Create the checkmark shape */
  transform: rotate(45deg); /* Rotate to form a checkmark */
}

.todo-title {
  display: inline-block; /* Ensure it behaves like a block element */
  width: 300px; /* Fixed width */
  max-width: 300px; /* Max width */
  overflow: hidden; /* Hide overflow text */
  text-overflow: ellipsis; /* Show ellipsis (...) for overflow text */
  white-space: nowrap; /* Prevent text from wrapping to the next line */
}
</style>
