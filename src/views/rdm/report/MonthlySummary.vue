<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">{{ $t('nav.monthlySummary') }}</h1>
      <el-button @click="generateMonthly" :loading="generating">
        <el-icon><MagicStick /></el-icon>
        {{ $t('summary.generateMonthly') }}
      </el-button>
    </div>

    <div class="layout-grid">
      <!-- Past 6 months -->
      <div class="timeline-panel">
        <div class="panel-title">{{ $t('summary.past6Months') }}</div>
        <div
          v-for="m in pastMonths"
          :key="m.month"
          class="month-item"
          :class="{ active: selectedMonth === m.month }"
          @click="selectMonth(m.month)"
        >
          <div class="month-label">{{ m.label }}</div>
          <el-tag v-if="m.summary" :type="statusTagType(m.summary.status)" size="small">
            {{ $t(`summary.${m.summary.status}`) }}
          </el-tag>
          <span v-else class="no-report">-</span>
        </div>
      </div>

      <!-- Content -->
      <div class="content-panel">
        <div v-if="currentSummary">
          <div class="summary-header">
            <div>
              <h2 class="summary-date">{{ currentSummary.month }} {{ $t('nav.monthlySummary') }}</h2>
              <el-tag :type="statusTagType(currentSummary.status)">
                {{ $t(`summary.${currentSummary.status}`) }}
              </el-tag>
            </div>
            <el-button
              v-if="currentSummary.status !== 'published'"
              type="primary"
              @click="publish"
            >
              {{ $t('summary.confirmAndPublish') }}
            </el-button>
          </div>

          <el-card class="section-card">
            <template #header>{{ $t('summary.monthlyOverview') }}</template>
            <p>{{ currentSummary.monthlyOverview }}</p>
          </el-card>

          <el-card class="section-card">
            <template #header>{{ $t('summary.milestones') }}</template>
            <el-table :data="currentSummary.milestones || []" size="small">
              <el-table-column prop="name" label="里程碑" />
              <el-table-column prop="planned" label="计划" width="100" />
              <el-table-column prop="actual" label="实际" width="100" />
              <el-table-column prop="status" label="状态" width="80">
                <template #default="{ row }">
                  <el-tag
                    :type="row.status === 'completed' ? 'success' : row.status === 'delayed' ? 'danger' : 'warning'"
                    size="small"
                  >
                    {{ $t(`summary.milestone.${row.status}`) }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-card>

          <el-card class="section-card">
            <template #header>{{ $t('summary.qualityMetrics') }}</template>
            <el-descriptions :column="3" border size="small">
              <el-descriptions-item label="平均Cpk">{{ currentSummary.qualityMetrics?.avgCpk }}</el-descriptions-item>
              <el-descriptions-item label="综合良率">{{ currentSummary.qualityMetrics?.yield }}%</el-descriptions-item>
              <el-descriptions-item label="不良率">{{ currentSummary.qualityMetrics?.defectRate }}</el-descriptions-item>
            </el-descriptions>
          </el-card>

          <el-card class="section-card">
            <template #header>{{ $t('summary.nextMonthOutlook') }}</template>
            <p>{{ currentSummary.nextMonthOutlook }}</p>
          </el-card>
        </div>

        <el-empty v-else :description="$t('summary.noSummaries')">
          <el-button type="primary" @click="generateMonthly">{{ $t('summary.generateMonthly') }}</el-button>
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
const selectedMonth = ref(dayjs().format('YYYY-MM'))

const pastMonths = computed(() => {
  return [0, 1, 2, 3, 4, 5].map((offset) => {
    const month = dayjs().subtract(offset, 'month').format('YYYY-MM')
    const label = offset === 0 ? '本月' : month
    const summary = summaryStore.monthlySummaries.find(
      s => s.userId === currentUser.value?.id && s.month === month
    )
    return { month, label, summary }
  })
})

const currentSummary = computed(() =>
  summaryStore.monthlySummaries.find(
    s => s.userId === currentUser.value?.id && s.month === selectedMonth.value
  )
)

function selectMonth(month) { selectedMonth.value = month }

async function generateMonthly() {
  generating.value = true
  await new Promise(r => setTimeout(r, 800))
  summaryStore.generateMonthlySummary(currentUser.value.id, currentUser.value.name, selectedMonth.value)
  generating.value = false
  ElMessage.success('月报草稿已生成')
}

function publish() {
  summaryStore.publishSummary(currentSummary.value.id)
  ElMessage.success('月报已发布')
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
.month-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 10px; border-radius: 6px; cursor: pointer; margin-bottom: 4px; transition: background 0.2s; }
.month-item:hover { background: #f0f2f5; }
.month-item.active { background: #eff6ff; }
.month-label { font-size: 13px; color: #374151; }
.no-report { font-size: 12px; color: #9ca3af; }
.content-panel { min-height: 400px; }
.summary-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
.summary-date { font-size: 18px; font-weight: 700; color: #111827; margin: 0 0 8px; }
.section-card { margin-bottom: 12px; }
</style>
