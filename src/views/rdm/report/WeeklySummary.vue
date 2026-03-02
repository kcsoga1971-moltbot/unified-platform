<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">{{ $t('nav.weeklySummary') }}</h1>
      <el-button @click="generateWeekly" :loading="generating">
        <el-icon><MagicStick /></el-icon>
        {{ $t('summary.generateWeekly') }}
      </el-button>
    </div>

    <div class="layout-grid">
      <!-- Past 4 weeks -->
      <div class="timeline-panel">
        <div class="panel-title">{{ $t('summary.past4Weeks') }}</div>
        <div
          v-for="week in pastWeeks"
          :key="week.weekStart"
          class="week-item"
          :class="{ active: selectedWeek === week.weekStart }"
          @click="selectWeek(week.weekStart)"
        >
          <div class="week-label">{{ week.label }}</div>
          <el-tag v-if="week.summary" :type="statusTagType(week.summary.status)" size="small">
            {{ $t(`summary.${week.summary.status}`) }}
          </el-tag>
          <span v-else class="no-report">-</span>
        </div>
      </div>

      <!-- Content -->
      <div class="content-panel">
        <div v-if="currentSummary">
          <div class="summary-header">
            <div>
              <h2 class="summary-date">{{ currentSummary.weekStart }} ~ {{ currentSummary.weekEnd }}</h2>
              <el-tag :type="statusTagType(currentSummary.status)">
                {{ $t(`summary.${currentSummary.status}`) }}
              </el-tag>
            </div>
            <div class="summary-actions">
              <el-button
                v-if="currentSummary.status === 'draft' || currentSummary.status === 'confirmed'"
                type="primary"
                @click="publish"
              >
                {{ $t('summary.confirmAndPublish') }}
              </el-button>
            </div>
          </div>

          <el-card class="section-card">
            <template #header>{{ $t('summary.weekOverview') }}</template>
            <p>{{ currentSummary.weekOverview }}</p>
          </el-card>

          <el-card class="section-card">
            <template #header>{{ $t('summary.testResults') }}</template>
            <el-table :data="currentSummary.testResults || []" size="small">
              <el-table-column prop="item" label="测试项目" />
              <el-table-column prop="cpk" label="Cpk" width="80" />
              <el-table-column prop="result" label="结果" width="80">
                <template #default="{ row }">
                  <el-tag :type="row.result === 'pass' ? 'success' : 'danger'" size="small">
                    {{ row.result?.toUpperCase() }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-card>

          <el-card class="section-card">
            <template #header>{{ $t('summary.nextWeekPlan') }}</template>
            <ul class="item-list">
              <li v-for="(item, i) in currentSummary.nextWeekPlan" :key="i">{{ item }}</li>
            </ul>
          </el-card>

          <el-card class="section-card">
            <template #header>{{ $t('summary.risksIssues') }}</template>
            <ul class="item-list">
              <li v-for="(item, i) in currentSummary.risksIssues" :key="i">{{ item }}</li>
            </ul>
          </el-card>
        </div>

        <el-empty v-else :description="$t('summary.noSummaries')">
          <el-button type="primary" @click="generateWeekly">{{ $t('summary.generateWeekly') }}</el-button>
        </el-empty>
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

const { t } = useI18n()
const userStore = useUserStore()
const summaryStore = useSummaryStore()

const generating = ref(false)
const currentUser = computed(() => userStore.currentUser)

function getWeekStart(daysAgo) {
  const d = dayjs().subtract(daysAgo, 'day')
  return d.startOf('week').add(1, 'day').format('YYYY-MM-DD') // Monday
}

const selectedWeek = ref(getWeekStart(0))

const pastWeeks = computed(() => {
  return [0, 7, 14, 21].map((offset, i) => {
    const weekStart = getWeekStart(offset)
    const label = i === 0 ? '本周' : `${weekStart.slice(5)}`
    const summary = summaryStore.weeklySummaries.find(
      s => s.userId === currentUser.value?.id && s.weekStart === weekStart
    )
    return { weekStart, label, summary }
  })
})

const currentSummary = computed(() =>
  summaryStore.weeklySummaries.find(
    s => s.userId === currentUser.value?.id && s.weekStart === selectedWeek.value
  )
)

function selectWeek(weekStart) {
  selectedWeek.value = weekStart
}

async function generateWeekly() {
  generating.value = true
  await new Promise(r => setTimeout(r, 800))
  summaryStore.generateWeeklySummary(currentUser.value.id, currentUser.value.name, selectedWeek.value)
  generating.value = false
  ElMessage.success('周报草稿已生成')
}

function publish() {
  summaryStore.publishSummary(currentSummary.value.id)
  ElMessage.success('周报已发布')
}

function statusTagType(status) {
  const m = { draft: '', confirmed: 'warning', published: 'success' }
  return m[status] || ''
}
</script>

<style scoped>
.page-container { max-width: 1100px; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-title { font-size: 22px; font-weight: 700; color: #111827; margin: 0; }
.layout-grid { display: grid; grid-template-columns: 180px 1fr; gap: 20px; }
.timeline-panel { background: white; border-radius: 10px; padding: 16px; box-shadow: 0 1px 4px rgba(0,0,0,0.06); height: fit-content; }
.panel-title { font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 12px; }
.week-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 10px; border-radius: 6px; cursor: pointer; margin-bottom: 4px; transition: background 0.2s; }
.week-item:hover { background: #f0f2f5; }
.week-item.active { background: #eff6ff; }
.week-label { font-size: 13px; color: #374151; }
.no-report { font-size: 12px; color: #9ca3af; }
.content-panel { min-height: 400px; }
.summary-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
.summary-date { font-size: 18px; font-weight: 700; color: #111827; margin: 0 0 8px; }
.summary-actions { display: flex; gap: 8px; }
.section-card { margin-bottom: 12px; }
.item-list { padding-left: 20px; margin: 0; }
.item-list li { font-size: 14px; color: #374151; line-height: 1.8; }
</style>
