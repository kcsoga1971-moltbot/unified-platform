<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">{{ $t('gantt.title') }}</h1>
      <div class="header-controls">
        <el-select v-model="selectedProject" :placeholder="$t('task.project')" clearable style="width: 220px">
          <el-option v-for="p in projects" :key="p.id" :label="p.name" :value="p.id" />
        </el-select>
        <el-radio-group v-model="viewMode" size="small">
          <el-radio-button label="month">{{ $t('gantt.month') }}</el-radio-button>
          <el-radio-button label="quarter">{{ $t('gantt.quarter') }}</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <el-card v-if="chartOption" class="gantt-card">
      <VChart :option="chartOption" style="height: 500px;" autoresize />
    </el-card>

    <!-- Task List Below Chart -->
    <el-card class="task-list-card">
      <template #header>
        <div class="task-list-header">
          <span>{{ $t('gantt.taskList') }}</span>
          <el-tag>{{ ganttTasks.length }} {{ $t('gantt.tasks') }}</el-tag>
        </div>
      </template>
      <el-table :data="ganttTasks" size="small" stripe>
        <el-table-column :label="$t('task.title')" prop="title" min-width="200" show-overflow-tooltip />
        <el-table-column :label="$t('task.project')" prop="projectName" width="160" show-overflow-tooltip />
        <el-table-column :label="$t('gantt.stage')" width="100">
          <template #default="{ row }">
            <el-tag size="small" type="info">{{ stageName(row.stage) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('task.startDate')" prop="startDate" width="110" />
        <el-table-column :label="$t('task.dueDate')" prop="dueDate" width="110" />
        <el-table-column :label="$t('task.status')" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)" size="small">{{ $t(`task.column.${row.status}`) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('task.assignee')" prop="assigneeName" width="100" />
        <el-table-column :label="$t('task.progress')" width="130">
          <template #default="{ row }">
            <el-progress :percentage="row.progress || 0" size="small" />
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-if="!ganttTasks.length" :description="$t('common.noData')" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTaskStore } from '../../../stores/rdm-task.js'
import { useProjectStore } from '../../../stores/rdm-project.js'
import { useUserStore } from '../../../stores/rdm-user.js'
import dayjs from 'dayjs'

const { t } = useI18n()
const taskStore = useTaskStore()
const projectStore = useProjectStore()
const userStore = useUserStore()

const selectedProject = ref('')
const viewMode = ref('month')

const STAGE_LABELS = ['Discovery', 'Concept', 'DVT', 'PVT', 'MP Launch', 'MP Monitor']

const projects = computed(() => {
  if (userStore.canViewAllProjects()) return projectStore.projects
  return projectStore.projects.filter(p => userStore.isMyProject(p.id))
})

const allTasks = computed(() => {
  const tasks = taskStore.tasks || []
  const projectMap = {}
  projectStore.projects.forEach(p => { projectMap[p.id] = p })
  return tasks.map(t => ({
    ...t,
    projectName: projectMap[t.projectId]?.name || '',
    stage: projectMap[t.projectId]?.currentStage ?? 0,
  }))
})

const ganttTasks = computed(() => {
  return allTasks.value
    .filter(t => {
      if (selectedProject.value && t.projectId !== selectedProject.value) return false
      if (!t.dueDate) return false
      return true
    })
    .map(t => ({
      ...t,
      startDate: t.startDate || dayjs(t.dueDate).subtract(7, 'day').format('YYYY-MM-DD'),
    }))
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
})

function stageName(stage) {
  return STAGE_LABELS[stage] || `S${stage}`
}

function statusType(s) {
  const map = { done: 'success', in_progress: 'warning', todo: 'info', blocked: 'danger' }
  return map[s] || 'info'
}

// Stage colors per stage index
const STAGE_COLORS = ['#8b5cf6', '#1a73e8', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444']

const chartOption = computed(() => {
  if (!ganttTasks.value.length) return null

  const today = dayjs()
  const tasks = ganttTasks.value

  // Determine date range
  const allDates = tasks.flatMap(t => [dayjs(t.startDate), dayjs(t.dueDate)])
  const minDate = allDates.reduce((a, b) => (a.isBefore(b) ? a : b))
  const maxDate = allDates.reduce((a, b) => (a.isAfter(b) ? a : b))

  const startTs = minDate.subtract(7, 'day').valueOf()
  const endTs = maxDate.add(14, 'day').valueOf()
  const todayTs = today.valueOf()

  // Build bar data
  const yCategories = tasks.map(t => t.title.length > 20 ? t.title.slice(0, 20) + '…' : t.title)

  const barData = tasks.map((task, idx) => {
    const start = dayjs(task.startDate).valueOf()
    const end = dayjs(task.dueDate).valueOf()
    const color = STAGE_COLORS[task.stage % STAGE_COLORS.length]
    const isLate = task.status !== 'done' && dayjs(task.dueDate).isBefore(today)
    return {
      value: [idx, start, end, task.progress || 0],
      itemStyle: {
        color: isLate ? '#ef4444' : color,
        borderRadius: 4,
        opacity: task.status === 'done' ? 0.5 : 1,
      },
    }
  })

  return {
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const task = tasks[params.value[0]]
        return `<b>${task.title}</b><br/>
          ${task.startDate} → ${task.dueDate}<br/>
          Progress: ${task.progress || 0}%<br/>
          Assignee: ${task.assigneeName || '-'}`
      },
    },
    grid: { top: 20, bottom: 80, left: 200, right: 60 },
    xAxis: {
      type: 'time',
      min: startTs,
      max: endTs,
      axisLabel: {
        formatter: (val) => dayjs(val).format(viewMode.value === 'month' ? 'MM/DD' : 'YYYY/MM'),
        fontSize: 11,
      },
      splitLine: { show: true, lineStyle: { type: 'dashed', color: '#e5e7eb' } },
    },
    yAxis: {
      type: 'category',
      data: yCategories,
      axisLabel: { fontSize: 11, width: 180, overflow: 'truncate' },
    },
    series: [
      {
        type: 'custom',
        renderItem: (params, api) => {
          const categoryIndex = api.value(0)
          const start = api.coord([api.value(1), categoryIndex])
          const end = api.coord([api.value(2), categoryIndex])
          const height = api.size([0, 1])[1] * 0.6
          const x = start[0]
          const y = start[1] - height / 2
          const width = Math.max(end[0] - start[0], 2)
          const progress = api.value(3) / 100
          return {
            type: 'group',
            children: [
              // Background bar
              {
                type: 'rect',
                shape: { x, y, width, height },
                style: {
                  ...api.style(),
                  opacity: 0.25,
                },
              },
              // Progress bar
              {
                type: 'rect',
                shape: { x, y, width: width * progress, height },
                style: api.style(),
              },
            ],
          }
        },
        data: barData,
        encode: { x: [1, 2], y: 0 },
      },
      // Today line (as scatter with markLine trick — use a dummy series)
      {
        type: 'line',
        markLine: {
          silent: true,
          symbol: ['none', 'none'],
          data: [{ xAxis: todayTs }],
          lineStyle: { color: '#ef4444', width: 2, type: 'dashed' },
          label: { formatter: 'Today', color: '#ef4444', fontSize: 11 },
        },
        data: [],
      },
    ],
    dataZoom: [
      { type: 'slider', xAxisIndex: 0, bottom: 10, height: 20, start: 0, end: 100 },
    ],
  }
})
</script>

<style scoped>
.page-container { max-width: 1400px; }
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
.page-title { font-size: 20px; font-weight: 700; color: #111827; margin: 0; }
.header-controls { display: flex; align-items: center; gap: 12px; }
.gantt-card { margin-bottom: 16px; }
.task-list-card {}
.task-list-header { display: flex; align-items: center; justify-content: space-between; }
</style>
