import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/rdm-helpers.js'
import { DEMO_SUMMARIES } from '../utils/rdm-demoData.js'
import dayjs from 'dayjs'

export const useSummaryStore = defineStore('rdm_summary', () => {
  const summaries = ref(loadFromLocalStorage('rdm_summaries', DEMO_SUMMARIES))

  function saveSummaries() {
    saveToLocalStorage('rdm_summaries', summaries.value)
  }

  const dailySummaries = computed(() => summaries.value.filter(s => s.type === 'daily'))
  const weeklySummaries = computed(() => summaries.value.filter(s => s.type === 'weekly'))
  const monthlySummaries = computed(() => summaries.value.filter(s => s.type === 'monthly'))

  function getSummariesForUser(userId) {
    return summaries.value.filter(s => s.userId === userId)
  }

  function getSummariesForBoss() {
    return summaries.value.filter(s => s.status === 'published' || s.status === 'confirmed')
  }

  function getSummaryById(id) {
    return summaries.value.find(s => s.id === id) || null
  }

  function generateDailySummary(userId, userName, date) {
    const tasks = loadFromLocalStorage('rdm_tasks', [])
    const userTasks = tasks.filter(t => t.assigneeId === userId)
    const todayTasks = userTasks.filter(t => t.status === 'done')
    const inProgress = userTasks.filter(t => t.status === 'in_progress')

    const existing = summaries.value.find(s => s.type === 'daily' && s.userId === userId && s.date === date)
    if (existing) return existing

    const newSummary = {
      id: 'sum_' + Date.now(),
      type: 'daily',
      userId,
      userName,
      date,
      status: 'draft',
      tasksCompleted: todayTasks.slice(0, 3).map(t => t.title),
      tasksInProgress: inProgress.slice(0, 3).map(t => `${t.title}（进行中）`),
      issues: ['暂无重大问题'],
      tomorrowPlan: ['继续推进当前任务', '参加项目例会'],
      notes: 'AI 自动生成的日报草稿，请确认后发布。',
      aiGenerated: true,
      confirmedAt: null,
      publishedAt: null,
      createdAt: new Date().toISOString(),
    }
    summaries.value.unshift(newSummary)
    saveSummaries()
    return newSummary
  }

  function generateWeeklySummary(userId, userName, weekStart) {
    const weekEnd = dayjs(weekStart).add(4, 'day').format('YYYY-MM-DD')
    const existing = summaries.value.find(s => s.type === 'weekly' && s.userId === userId && s.weekStart === weekStart)
    if (existing) return existing

    const newSummary = {
      id: 'sum_' + Date.now(),
      type: 'weekly',
      userId,
      userName,
      weekStart,
      weekEnd,
      status: 'draft',
      weekOverview: `${weekStart} 至 ${weekEnd} 周报（AI草稿）`,
      projectProgress: [],
      completedDeliverables: [],
      testResults: [],
      decisions: [],
      nextWeekPlan: ['继续推进项目任务'],
      risksIssues: [],
      aiGenerated: true,
      confirmedAt: null,
      publishedAt: null,
      createdAt: new Date().toISOString(),
    }
    summaries.value.unshift(newSummary)
    saveSummaries()
    return newSummary
  }

  function generateMonthlySummary(userId, userName, month) {
    const existing = summaries.value.find(s => s.type === 'monthly' && s.userId === userId && s.month === month)
    if (existing) return existing

    const newSummary = {
      id: 'sum_' + Date.now(),
      type: 'monthly',
      userId,
      userName,
      month,
      status: 'draft',
      monthlyOverview: `${month} 月度总结（AI草稿）`,
      milestones: [],
      stageTransitions: [],
      qualityMetrics: { avgCpk: 0, yield: 0, defectRate: '0%' },
      resourceUtilization: {},
      budgetStatus: { planned: 0, actual: 0, variance: '0%' },
      nextMonthOutlook: '持续推进项目进度',
      aiGenerated: true,
      confirmedAt: null,
      publishedAt: null,
      createdAt: new Date().toISOString(),
    }
    summaries.value.unshift(newSummary)
    saveSummaries()
    return newSummary
  }

  function updateSummary(id, updates) {
    const idx = summaries.value.findIndex(s => s.id === id)
    if (idx !== -1) {
      summaries.value[idx] = { ...summaries.value[idx], ...updates }
      saveSummaries()
      return summaries.value[idx]
    }
    return null
  }

  function confirmSummary(summaryId) {
    const idx = summaries.value.findIndex(s => s.id === summaryId)
    if (idx !== -1) {
      summaries.value[idx].status = 'confirmed'
      summaries.value[idx].confirmedAt = new Date().toISOString()
      saveSummaries()
      return summaries.value[idx]
    }
  }

  function publishSummary(summaryId) {
    const idx = summaries.value.findIndex(s => s.id === summaryId)
    if (idx !== -1) {
      summaries.value[idx].status = 'published'
      summaries.value[idx].confirmedAt = summaries.value[idx].confirmedAt || new Date().toISOString()
      summaries.value[idx].publishedAt = new Date().toISOString()
      saveSummaries()
      return summaries.value[idx]
    }
  }

  function addComment(summaryId, comment) {
    const idx = summaries.value.findIndex(s => s.id === summaryId)
    if (idx !== -1) {
      if (!summaries.value[idx].comments) summaries.value[idx].comments = []
      summaries.value[idx].comments.push({
        id: 'cmt_' + Date.now(),
        text: comment,
        createdAt: new Date().toISOString(),
      })
      saveSummaries()
    }
  }

  return {
    summaries,
    dailySummaries,
    weeklySummaries,
    monthlySummaries,
    getSummariesForUser,
    getSummariesForBoss,
    getSummaryById,
    generateDailySummary,
    generateWeeklySummary,
    generateMonthlySummary,
    updateSummary,
    confirmSummary,
    publishSummary,
    addComment,
  }
})
