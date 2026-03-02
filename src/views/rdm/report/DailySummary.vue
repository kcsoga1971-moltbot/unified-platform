<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">{{ $t('nav.dailySummary') }}</h1>
      <div class="header-actions">
        <el-button @click="generateToday" :loading="generating">
          <el-icon><MagicStick /></el-icon>
          {{ $t('summary.generateDaily') }}
        </el-button>
      </div>
    </div>

    <div class="layout-grid">
      <!-- Timeline: past 7 days -->
      <div class="timeline-panel">
        <div class="panel-title">{{ $t('summary.past7Days') }}</div>
        <div
          v-for="day in pastDays"
          :key="day.date"
          class="day-item"
          :class="{ active: selectedDate === day.date }"
          @click="selectDate(day.date)"
        >
          <div class="day-label">{{ day.label }}</div>
          <el-tag
            v-if="day.summary"
            :type="statusTagType(day.summary.status)"
            size="small"
          >
            {{ $t(`summary.${day.summary.status}`) }}
          </el-tag>
          <span v-else class="no-report">-</span>
        </div>
      </div>

      <!-- Main content -->
      <div class="content-panel">
        <div v-if="currentSummary" class="summary-detail">
          <div class="summary-header">
            <div>
              <h2 class="summary-date">{{ currentSummary.date }}</h2>
              <el-tag :type="statusTagType(currentSummary.status)">
                {{ $t(`summary.${currentSummary.status}`) }}
              </el-tag>
              <el-tag v-if="currentSummary.aiGenerated" type="info" style="margin-left: 8px">
                {{ $t('summary.aiGenerated') }}
              </el-tag>
            </div>
            <div class="summary-actions">
              <el-button v-if="currentSummary.status === 'draft'" @click="startEdit">
                {{ $t('common.edit') }}
              </el-button>
              <el-button
                v-if="currentSummary.status === 'draft' || currentSummary.status === 'confirmed'"
                type="primary"
                @click="confirmAndPublish"
              >
                {{ $t('summary.confirmAndPublish') }}
              </el-button>
            </div>
          </div>

          <div v-if="!editing" class="summary-view">
            <el-card class="section-card">
              <template #header><span>{{ $t('summary.tasksCompleted') }}</span></template>
              <ul class="item-list">
                <li v-for="(t, i) in currentSummary.tasksCompleted" :key="i">{{ t }}</li>
                <li v-if="!currentSummary.tasksCompleted?.length" class="empty">暂无</li>
              </ul>
            </el-card>

            <el-card class="section-card">
              <template #header><span>{{ $t('summary.tasksInProgress') }}</span></template>
              <ul class="item-list">
                <li v-for="(t, i) in currentSummary.tasksInProgress" :key="i">{{ t }}</li>
                <li v-if="!currentSummary.tasksInProgress?.length" class="empty">暂无</li>
              </ul>
            </el-card>

            <el-card class="section-card">
              <template #header><span>{{ $t('summary.issues') }}</span></template>
              <ul class="item-list">
                <li v-for="(t, i) in currentSummary.issues" :key="i">{{ t }}</li>
                <li v-if="!currentSummary.issues?.length" class="empty">暂无</li>
              </ul>
            </el-card>

            <el-card class="section-card">
              <template #header><span>{{ $t('summary.tomorrowPlan') }}</span></template>
              <ul class="item-list">
                <li v-for="(t, i) in currentSummary.tomorrowPlan" :key="i">{{ t }}</li>
                <li v-if="!currentSummary.tomorrowPlan?.length" class="empty">暂无</li>
              </ul>
            </el-card>

            <el-card class="section-card">
              <template #header><span>{{ $t('summary.notes') }}</span></template>
              <p>{{ currentSummary.notes || '-' }}</p>
            </el-card>
          </div>

          <div v-else class="edit-form">
            <SummaryEditor
              v-model="editDraft"
              :sections="dailySections"
              :ai-generated="currentSummary.aiGenerated"
            />
            <div class="edit-actions">
              <el-button @click="editing = false">{{ $t('common.cancel') }}</el-button>
              <el-button type="primary" @click="saveDraft">{{ $t('common.save') }}</el-button>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          <el-empty :description="$t('summary.noSummaries')">
            <el-button type="primary" @click="generateToday">
              {{ $t('summary.generateDaily') }}
            </el-button>
          </el-empty>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import { useUserStore } from '../../../stores/rdm-user.js'
import { useSummaryStore } from '../../../stores/rdm-summary.js'
import SummaryEditor from '../../../components/rdm/report/SummaryEditor.vue'

const { t } = useI18n()
const userStore = useUserStore()
const summaryStore = useSummaryStore()

const generating = ref(false)
const editing = ref(false)
const editDraft = ref({})
const selectedDate = ref(dayjs().format('YYYY-MM-DD'))

const currentUser = computed(() => userStore.currentUser)

const pastDays = computed(() => {
  const days = []
  for (let i = 0; i < 7; i++) {
    const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD')
    const label = i === 0 ? '今天' : i === 1 ? '昨天' : dayjs().subtract(i, 'day').format('MM/DD')
    const summary = summaryStore.dailySummaries.find(
      s => s.userId === currentUser.value?.id && s.date === date
    )
    days.push({ date, label, summary })
  }
  return days
})

const currentSummary = computed(() =>
  summaryStore.dailySummaries.find(
    s => s.userId === currentUser.value?.id && s.date === selectedDate.value
  )
)

const dailySections = [
  { key: 'tasksCompleted', label: t('summary.tasksCompleted') },
  { key: 'tasksInProgress', label: t('summary.tasksInProgress') },
  { key: 'issues', label: t('summary.issues') },
  { key: 'tomorrowPlan', label: t('summary.tomorrowPlan') },
  { key: 'notes', label: t('summary.notes') },
]

function selectDate(date) {
  selectedDate.value = date
  editing.value = false
}

async function generateToday() {
  generating.value = true
  await new Promise(r => setTimeout(r, 800))
  summaryStore.generateDailySummary(
    currentUser.value.id,
    currentUser.value.name,
    dayjs().format('YYYY-MM-DD')
  )
  selectedDate.value = dayjs().format('YYYY-MM-DD')
  generating.value = false
  ElMessage.success('日报草稿已生成')
}

function startEdit() {
  editDraft.value = JSON.parse(JSON.stringify(currentSummary.value))
  editing.value = true
}

function saveDraft() {
  summaryStore.updateSummary(currentSummary.value.id, editDraft.value)
  editing.value = false
  ElMessage.success(t('common.operationSuccess'))
}

function confirmAndPublish() {
  summaryStore.publishSummary(currentSummary.value.id)
  ElMessage.success('日报已发布')
}

function statusTagType(status) {
  const m = { draft: '', confirmed: 'warning', published: 'success' }
  return m[status] || ''
}
</script>

<style scoped>
.page-container { max-width: 1100px; }

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.layout-grid {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 20px;
}

.timeline-panel {
  background: white;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  height: fit-content;
}

.panel-title {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
}

.day-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 4px;
  transition: background 0.2s;
}

.day-item:hover { background: #f0f2f5; }
.day-item.active { background: #eff6ff; }

.day-label {
  font-size: 13px;
  color: #374151;
}

.no-report {
  font-size: 12px;
  color: #9ca3af;
}

.content-panel { min-height: 400px; }

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.summary-date {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px;
}

.summary-actions { display: flex; gap: 8px; }

.section-card { margin-bottom: 12px; }

.item-list {
  padding-left: 20px;
  margin: 0;
}

.item-list li {
  font-size: 14px;
  color: #374151;
  line-height: 1.8;
}

.empty { color: #9ca3af; list-style: none; }

.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
}

.empty-state {
  background: white;
  border-radius: 10px;
  padding: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
