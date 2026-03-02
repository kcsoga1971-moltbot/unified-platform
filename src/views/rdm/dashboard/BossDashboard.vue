<template>
  <div class="boss-dashboard">
    <h2 class="section-title">{{ $t('dashboard.allProjectsOverview') }}</h2>

    <!-- Project Status Cards -->
    <div class="project-status-grid">
      <div
        v-for="project in projects"
        :key="project.id"
        class="project-status-card"
        :class="project.status"
      >
        <div class="project-name">{{ project.name }}</div>
        <div class="project-meta">
          <span>阶段 {{ project.currentStage }}</span>
          <span class="progress-val">{{ project.progress }}%</span>
        </div>
        <el-progress :percentage="project.progress" :status="progressStatus(project.status)" :show-text="false" />
        <el-tag :type="statusTagType(project.status)" size="small" class="status-tag">
          {{ $t(`project.statusOptions.${project.status}`) }}
        </el-tag>
      </div>
    </div>

    <div class="metrics-row">
      <el-card class="metric-card">
        <div class="metric-val">{{ onTimeRate }}%</div>
        <div class="metric-label">{{ $t('dashboard.onTimeRate') }}</div>
      </el-card>
      <el-card class="metric-card">
        <div class="metric-val">{{ avgProgress }}%</div>
        <div class="metric-label">{{ $t('dashboard.overallProgress') }}</div>
      </el-card>
      <el-card class="metric-card">
        <div class="metric-val">{{ pendingApprovals }}</div>
        <div class="metric-label">{{ $t('dashboard.pendingApprovals') }}</div>
      </el-card>
    </div>

    <!-- Latest summaries -->
    <h3 class="section-subtitle">最新研发汇报</h3>
    <div class="summary-list">
      <div v-for="s in latestSummaries" :key="s.id" class="summary-item">
        <div class="summary-avatar">{{ s.userName?.slice(0, 2) }}</div>
        <div class="summary-info">
          <div class="summary-author">{{ s.userName }}</div>
          <div class="summary-date">{{ s.date || s.weekStart || s.month }}</div>
        </div>
        <el-tag :type="statusTag(s.status)" size="small">{{ $t(`summary.${s.status}`) }}</el-tag>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useProjectStore } from '../../../stores/rdm-project.js'
import { useSummaryStore } from '../../../stores/rdm-summary.js'

const projectStore = useProjectStore()
const summaryStore = useSummaryStore()

const projects = computed(() => projectStore.projects)

const onTimeRate = computed(() => {
  const onTrack = projects.value.filter(p => p.status === 'on_track').length
  return Math.round((onTrack / (projects.value.length || 1)) * 100)
})

const avgProgress = computed(() => {
  if (!projects.value.length) return 0
  return Math.round(projects.value.reduce((a, p) => a + p.progress, 0) / projects.value.length)
})

const pendingApprovals = computed(() => {
  const gateReviews = JSON.parse(localStorage.getItem('rdm_gate_reviews') || '[]')
  return gateReviews.filter(r => r.status === 'pending').length
})

const latestSummaries = computed(() => summaryStore.getSummariesForBoss().slice(0, 5))

function progressStatus(status) {
  if (status === 'at_risk') return 'warning'
  if (status === 'off_track') return 'exception'
  return ''
}

function statusTagType(status) {
  if (status === 'on_track') return 'success'
  if (status === 'at_risk') return 'warning'
  return 'danger'
}

function statusTag(status) {
  const map = { draft: '', confirmed: 'warning', published: 'success' }
  return map[status] || ''
}
</script>

<style scoped>
.boss-dashboard {}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 16px;
}

.section-subtitle {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin: 24px 0 12px;
}

.project-status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.project-status-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  border-left: 4px solid #e5e7eb;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.project-status-card.on_track { border-left-color: #10b981; }
.project-status-card.at_risk { border-left-color: #f59e0b; }
.project-status-card.off_track { border-left-color: #ef4444; }

.project-name {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
}

.project-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 8px;
}

.progress-val {
  font-weight: 600;
  color: #374151;
}

.status-tag {
  margin-top: 8px;
}

.metrics-row {
  display: flex;
  gap: 16px;
  margin-bottom: 8px;
}

.metric-card {
  flex: 1;
  text-align: center;
}

.metric-val {
  font-size: 28px;
  font-weight: 700;
  color: #1a73e8;
}

.metric-label {
  font-size: 13px;
  color: #6b7280;
  margin-top: 4px;
}

.summary-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.summary-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #1a73e8;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.summary-info {
  flex: 1;
}

.summary-author {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
}

.summary-date {
  font-size: 12px;
  color: #6b7280;
}
</style>
