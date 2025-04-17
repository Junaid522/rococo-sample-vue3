<template>
  <q-page class="flex flex-center q-pa-md">
    <q-card class="q-pa-md" style="max-width: 500px; width: 100%; border-radius: 12px; box-shadow: 0 10px 20px rgba(0,0,0,0.1)">
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
          :label="isEditing ? 'Update Task' : 'Add Task'"
          color="primary"
          class="full-width q-mb-md"
          @click="isEditing ? updateTodo({ ...taskSelected, title: newTodo }, $event, false) : addTodo()"
          :disabled="!newTodo.trim()"
        />

        <!-- Todo List -->
        <q-list>
          <q-item v-for="(todo, index) in filteredTodos" :key="index" class="q-mb-xs">
            <q-item-section>
              <div class="flex items-center justify-between">
                <div>
                  <input type="checkbox"
                         v-model="todo.is_completed"
                         @click="updateTodo({ ...todo, is_completed: !todo.is_completed, title: todo.title }, $event, false)"
                         class="q-mr-md"
                  />
                  <span @click="taskClick(todo)" :style="{
                    textDecoration: todo.is_completed ? 'line-through' : 'none',
                    color: todo.is_completed ? 'red' : 'inherit'
                  }" class="text-subtitle2 cursor-pointer">{{ todo.title }}</span>
                </div>
                <div>
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
}

async function deleteTodo(todo) {
  await taskStore.deleteTask(todo)
  await taskStore.getTasks('all')
}

function taskClick(item) {
  newTodo.value = item.title
  isEditing.value = true
  taskSelected.value = item
}

async function updateFilter(value) {
  await taskStore.getTasks(value)
}

</script>

<style scoped>
/* Your existing styles */
</style>
