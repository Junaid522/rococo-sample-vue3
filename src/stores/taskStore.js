import { defineStore } from 'pinia'
import axios from "config/axios"
import { Notify } from 'quasar'

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [],
    loading: false,
    error: null
  }),

  getters: {
    completedTasks: (state) => state.tasks.filter(task => task.completed),
    activeTasks: (state) => state.tasks.filter(task => !task.completed),
    remainingTasks: (state) => state.tasks.filter(task => !task.completed).length
  },

  actions: {
    // Fetch tasks from the API
    async getTasks(value) {
      this.loading = true
      this.error = null

      try {
        const response = await axios.get(value === 'all' ? '/todo/task' : value === 'incomplete' ? '/todo/task?filter_type=incomplete' : value === 'completed' ? '/todo/task?filter_type=completed' : '')
        this.tasks = response.data
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },

    // Add new task
    async addTask(title) {
      try {
        const response = await axios.post('/todo/task', { title })
        if (response.status === 201) {
          this.tasks.push({ text: response.data.title, completed: false })
          Notify.create({
            message: "Task created successfully.",
            color: "positive"
          });
        }
      } catch (error) {
        Notify.create({
            message: error,
            color: "negative"
          });
      }
    },

    // Update task completion status
    async updateTask(todo) {
      this.loading = true
      this.error = null

      try {
        const response = await axios.put( `/todo/task/${todo.entity_id}`, {title: todo.title, is_completed: JSON.stringify(todo.is_completed)})
        this.tasks = response.data
        Notify.create({
            message: "Task updated successfully.",
            color: "positive"
          });
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },

    // Delete task
    async deleteTask(todo) {
      try {
        await axios.delete(`/todo/task/${todo.entity_id}`)
        Notify.create({
            message: "Task deleted successfully.",
            color: "positive"
          });
      } catch (error) {
        Notify.create({
            message: error,
            color: "negative"
          });
      }
    }
  }
})
