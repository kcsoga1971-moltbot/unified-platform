import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/rdm-helpers.js'
import { DEMO_TASKS, DEMO_AI_TASKS } from '../utils/rdm-demoData.js'
import dayjs from 'dayjs'

export const useTaskStore = defineStore('rdm_task', () => {
  const tasks = ref(loadFromLocalStorage('rdm_tasks', DEMO_TASKS))
  const aiTasks = ref(loadFromLocalStorage('rdm_ai_tasks', DEMO_AI_TASKS))

  function saveTasks() {
    saveToLocalStorage('rdm_tasks', tasks.value)
  }

  function saveAiTasks() {
    saveToLocalStorage('rdm_ai_tasks', aiTasks.value)
  }

  const pendingAiTasks = computed(() => aiTasks.value.filter((t) => t.status === 'pending'))

  function getTasksByUser(userId) {
    return tasks.value.filter((t) => t.assigneeId === userId)
  }

  function getTasksByProject(projectId) {
    return tasks.value.filter((t) => t.projectId === projectId)
  }

  function getTasksByProjectAndStage(projectId, stageId) {
    return tasks.value.filter(
      (t) => t.projectId === projectId && t.stage === stageId,
    )
  }

  function getOverdueTasks() {
    const today = dayjs().format('YYYY-MM-DD')
    return tasks.value.filter(
      (t) => t.dueDate < today && t.status !== 'done',
    )
  }

  function getUpcomingTasks(days = 7) {
    const today = dayjs()
    const end = today.add(days, 'day')
    return tasks.value.filter((t) => {
      if (t.status === 'done') return false
      const due = dayjs(t.dueDate)
      return due.isAfter(today.subtract(1, 'day')) && due.isBefore(end)
    })
  }

  function createTask(taskData) {
    const newTask = {
      id: 't_' + Date.now(),
      status: 'todo',
      createdAt: new Date().toISOString(),
      ...taskData,
    }
    tasks.value.unshift(newTask)
    saveTasks()
    return newTask
  }

  function updateTask(id, updates) {
    const idx = tasks.value.findIndex((t) => t.id === id)
    if (idx !== -1) {
      tasks.value[idx] = { ...tasks.value[idx], ...updates }
      saveTasks()
      return tasks.value[idx]
    }
    return null
  }

  function deleteTask(id) {
    const idx = tasks.value.findIndex((t) => t.id === id)
    if (idx !== -1) {
      tasks.value.splice(idx, 1)
      saveTasks()
      return true
    }
    return false
  }

  function approveAiTask(aiTaskId) {
    const aiTask = aiTasks.value.find((t) => t.id === aiTaskId)
    if (!aiTask) return null

    aiTask.status = 'approved'
    saveAiTasks()

    // Create actual task
    const newTask = createTask({
      title: aiTask.title,
      description: aiTask.description,
      projectId: aiTask.projectId,
      projectName: aiTask.projectName,
      stage: aiTask.stage,
      assigneeId: aiTask.assigneeId,
      assigneeName: aiTask.assigneeName,
      dueDate: aiTask.dueDate,
      priority: aiTask.priority,
      status: 'todo',
      source: 'ai',
    })

    return newTask
  }

  function rejectAiTask(aiTaskId) {
    const aiTask = aiTasks.value.find((t) => t.id === aiTaskId)
    if (aiTask) {
      aiTask.status = 'rejected'
      saveAiTasks()
    }
  }

  function markComplete(taskId) {
    return updateTask(taskId, { status: 'done' })
  }

  return {
    tasks,
    aiTasks,
    pendingAiTasks,
    getTasksByUser,
    getTasksByProject,
    getTasksByProjectAndStage,
    getOverdueTasks,
    getUpcomingTasks,
    createTask,
    updateTask,
    deleteTask,
    approveAiTask,
    rejectAiTask,
    markComplete,
  }
})
