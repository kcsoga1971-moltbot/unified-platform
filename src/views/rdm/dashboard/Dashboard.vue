<template>
  <div class="dashboard">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ $t('dashboard.title') }}</h1>
        <p class="page-sub">{{ $t('dashboard.welcome') }}, {{ currentUser?.name }}!</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="$router.push('/projects/create')">
          <el-icon><Plus /></el-icon>
          {{ $t('dashboard.newProject') }}
        </el-button>
        <el-button @click="showTaskForm = true">
          <el-icon><Plus /></el-icon>
          {{ $t('dashboard.newTask') }}
        </el-button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon blue"><el-icon size="24"><FolderOpened /></el-icon></div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.totalProjects }}</div>
          <div class="stat-label">{{ $t('dashboard.totalProjects') }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green"><el-icon size="24"><TrendCharts /></el-icon></div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.activeProjects }}</div>
          <div class="stat-label">{{ $t('dashboard.activeProjects') }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon red"><el-icon size="24"><Warning /></el-icon></div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.overdueTasks }}</div>
          <div class="stat-label">{{ $t('dashboard.overdueTasks') }}</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon orange"><el-icon size="24"><Bell /></el-icon></div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.pendingGateReviews }}</div>
          <div class="stat-label">{{ $t('dashboard.pendingGateReviews') }}</div>
        </div>
      </div>
    </div>

    <div class="dashboard-body">
      <!-- Left Column -->
      <div class="left-col">
        <!-- Pipeline Chart -->
        <div class="card chart-card">
          <div class="card-header">
            <h3>{{ $t('dashboard.pipelineOverview') }}</h3>
          </div>
          <VChart :option="pipelineChartOption" style="height: 280px" autoresize />
        </div>

        <!-- Recent Activity -->
        <div class="card">
          <div class="card-header">
            <h3>{{ $t('dashboard.recentActivity') }}</h3>
            <el-button size="small" text type="primary" @click="$router.push('/projects')">
              {{ $t('dashboard.viewAll') }}
            </el-button>
          </div>
          <div v-if="recentActivities.length === 0" class="empty-state">
            {{ $t('dashboard.noActivity') }}
          </div>
          <el-timeline v-else class="activity-timeline">
            <el-timeline-item
              v-for="act in recentActivities"
              :key="act.id"
              :timestamp="formatDate(act.timestamp)"
              placement="top"
              :type="activityType(act.type)"
            >
              <div class="activity-item">
                <span class="activity-user">{{ act.userName }}</span>
                <span class="activity-desc">{{ act.description }}</span>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>

      <!-- Right Column -->
      <div class="right-col">
        <!-- Project Status Summary -->
        <div class="card">
          <div class="card-header">
            <h3>{{ $t('nav.projects') }}</h3>
            <el-button size="small" text type="primary" @click="$router.push('/projects')">
              {{ $t('dashboard.viewAll') }}
            </el-button>
          </div>
          <div class="project-summary-list">
            <div
              v-for="project in projects"
              :key="project.id"
              class="project-summary-item"
              @click="$router.push(`/projects/${project.id}`)"
            >
              <div class="project-summary-header">
                <span class="project-summary-name">{{ project.name }}</span>
                <StatusBadge :status="project.status" />
              </div>
              <div class="project-summary-meta">
                <el-tag size="small" type="primary">{{ $t(`stages.${project.currentStage}`) }}</el-tag>
                <span class="project-progress-text">{{ project.progress }}%</span>
              </div>
              <el-progress
                :percentage="project.progress"
                :stroke-width="4"
                :show-text="false"
                style="margin-top: 6px"
              />
            </div>
          </div>
        </div>

        <!-- Upcoming Deadlines -->
        <div class="card">
          <div class="card-header">
            <h3>{{ $t('dashboard.upcomingDeadlines') }}</h3>
          </div>
          <div v-if="upcomingTasks.length === 0" class="empty-state">
            {{ $t('dashboard.noDeadlines') }}
          </div>
          <div v-else class="deadline-list">
            <div
              v-for="task in upcomingTasks.slice(0, 6)"
              :key="task.id"
              class="deadline-item"
            >
              <div class="deadline-date" :class="{ 'is-today': isDueToday(task.dueDate) }">
                <span class="deadline-day">{{ formatDay(task.dueDate) }}</span>
                <span class="deadline-month">{{ formatMonth(task.dueDate) }}</span>
              </div>
              <div class="deadline-content">
                <div class="deadline-title">{{ task.title }}</div>
                <div class="deadline-project">{{ task.projectName }}</div>
              </div>
              <el-tag :type="getPriorityType(task.priority)" size="small">
                {{ $t(`common.${task.priority}`) }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
    </div>

    <TaskForm v-model="showTaskForm" @save="onTaskSave" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '../../../stores/rdm-user.js'
import { useProjectStore } from '../../../stores/rdm-project.js'
import { useTaskStore } from '../../../stores/rdm-task.js'
import StatusBadge from '../../../components/common/StatusBadge.vue'
import TaskForm from '../../../components/rdm/task/TaskForm.vue'
import { formatDate, isDueToday, getPriorityType } from '../../../utils/rdm-helpers.js'
import dayjs from 'dayjs'

const { t } = useI18n()
const userStore = useUserStore()
const projectStore = useProjectStore()
const taskStore = useTaskStore()

const showTaskForm = ref(false)

const currentUser = computed(() => userStore.currentUser)
const projects = computed(() => projectStore.projects)
const recentActivities = computed(() => projectStore.getRecentActivities(6))
const upcomingTasks = computed(() => taskStore.getUpcomingTasks(7))

const stats = computed(() => ({
  totalProjects: projects.value.length,
  activeProjects: projects.value.filter((p) => p.currentStage < 5).length,
  overdueTasks: taskStore.getOverdueTasks().length,
  pendingGateReviews: taskStore.pendingAiTasks.length,
}))

const pipelineChartOption = computed(() => {
  const stageNames = [0, 1, 2, 3, 4, 5].map((i) => t(`stages.${i}`))
  const stageCounts = [0, 1, 2, 3, 4, 5].map(
    (i) => projects.value.filter((p) => p.currentStage === i).length,
  )

  return {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: stageNames,
      axisLabel: { rotate: 30, fontSize: 11 },
    },
    yAxis: { type: 'value', minInterval: 1 },
    series: [
      {
        name: t('dashboard.projectsLabel'),
        type: 'bar',
        data: stageCounts,
        itemStyle: {
          color: function (params) {
            const colors = ['#94a3b8', '#60a5fa', '#3b82f6', '#1d4ed8', '#059669', '#10b981']
            return colors[params.dataIndex] || '#1a73e8'
          },
          borderRadius: [4, 4, 0, 0],
        },
      },
    ],
    grid: { left: 40, right: 20, top: 20, bottom: 60 },
  }
})

function activityType(type) {
  const map = {
    task_completed: 'success',
    gate_review: 'primary',
    document_upload: 'info',
    task_created: '',
    project_created: 'warning',
  }
  return map[type] || ''
}

function formatDay(dateStr) {
  return dayjs(dateStr).format('DD')
}

function formatMonth(dateStr) {
  return dayjs(dateStr).format('MMM')
}

function onTaskSave(taskData) {
  taskStore.createTask(taskData)
}
</script>

<style scoped>
.dashboard {
  max-width: 1400px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
}

.page-sub {
  color: #6b7280;
  margin-top: 4px;
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: var(--card-shadow);
  border: 1px solid #e5e7eb;
}

.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon.blue { background: #e8f0fe; color: #1a73e8; }
.stat-icon.green { background: #f0fdf4; color: #15803d; }
.stat-icon.red { background: #fef2f2; color: #b91c1c; }
.stat-icon.orange { background: #fffbeb; color: #b45309; }

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
  margin-top: 2px;
}

.dashboard-body {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 20px;
}

.left-col,
.right-col {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--card-shadow);
  border: 1px solid #e5e7eb;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.chart-card {
  min-height: 320px;
}

.activity-timeline {
  padding-left: 8px;
}

.activity-item {
  display: flex;
  gap: 8px;
  font-size: 13px;
  flex-wrap: wrap;
}

.activity-user {
  font-weight: 500;
  color: #374151;
}

.activity-desc {
  color: #6b7280;
}

.empty-state {
  text-align: center;
  color: #9ca3af;
  padding: 24px;
  font-size: 14px;
}

.project-summary-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.project-summary-item {
  cursor: pointer;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s;
}

.project-summary-item:hover {
  border-color: #1a73e8;
  background: #f8faff;
}

.project-summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  gap: 8px;
}

.project-summary-name {
  font-size: 13px;
  font-weight: 500;
  color: #111827;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.project-summary-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.project-progress-text {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
}

.deadline-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.deadline-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.deadline-date {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: #f3f4f6;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.deadline-date.is-today {
  background: #e8f0fe;
}

.deadline-day {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  line-height: 1;
}

.deadline-month {
  font-size: 10px;
  color: #6b7280;
  text-transform: uppercase;
}

.deadline-content {
  flex: 1;
  min-width: 0;
}

.deadline-title {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.deadline-project {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (max-width: 1100px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .dashboard-body {
    grid-template-columns: 1fr;
  }
}
</style>
