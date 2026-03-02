<template>
  <div class="page-container">
    <div class="page-header">
      <el-button @click="$router.back()" text>← {{ $t('common.back') }}</el-button>
      <h1 class="page-title">{{ $t('testData.title') }} - {{ record?.testItem }}</h1>
      <el-button @click="window.print()">{{ $t('common.print') }}</el-button>
    </div>

    <div v-if="record">
      <!-- Pass/Fail Banner -->
      <div class="result-banner" :class="record.result">
        <el-icon v-if="record.result === 'pass'"><CircleCheck /></el-icon>
        <el-icon v-else><CircleClose /></el-icon>
        {{ record.result === 'pass' ? $t('testData.pass') : $t('testData.fail') }}
      </div>

      <!-- Basic Info -->
      <el-card class="info-card">
        <el-descriptions :column="3" border size="small">
          <el-descriptions-item :label="$t('testData.testItem')">{{ record.testItem }}</el-descriptions-item>
          <el-descriptions-item :label="$t('testData.testType')">{{ record.testType }}</el-descriptions-item>
          <el-descriptions-item :label="$t('task.project')">{{ record.projectName }}</el-descriptions-item>
          <el-descriptions-item :label="$t('testData.lsl')">{{ record.lsl }} {{ record.unit }}</el-descriptions-item>
          <el-descriptions-item :label="$t('testData.target')">{{ record.target }} {{ record.unit }}</el-descriptions-item>
          <el-descriptions-item :label="$t('testData.usl')">{{ record.usl }} {{ record.unit }}</el-descriptions-item>
          <el-descriptions-item :label="$t('testData.mean')">{{ record.mean }} {{ record.unit }}</el-descriptions-item>
          <el-descriptions-item :label="$t('testData.stdDev')">{{ record.stdDev }}</el-descriptions-item>
          <el-descriptions-item :label="$t('testData.sampleSize')">{{ record.sampleSize }}</el-descriptions-item>
          <el-descriptions-item :label="$t('testData.tester')">{{ record.tester }}</el-descriptions-item>
          <el-descriptions-item :label="$t('testData.equipment')">{{ record.equipment }}</el-descriptions-item>
          <el-descriptions-item :label="$t('testData.date')">{{ record.date }}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <div class="charts-row">
        <!-- Cpk Gauge -->
        <el-card class="chart-card">
          <template #header>{{ $t('testData.cpk') }}</template>
          <CpkGauge :cpk="record.cpk" :cp="record.cp" />
        </el-card>

        <!-- Histogram -->
        <el-card class="chart-card">
          <template #header>{{ $t('testData.histogram') }}</template>
          <VChart :option="histogramOption" style="height: 250px;" autoresize />
        </el-card>
      </div>

      <!-- Data Table -->
      <el-card class="data-card">
        <template #header>测量数据</template>
        <el-table :data="tableData" size="small" stripe>
          <el-table-column type="index" :label="$t('testData.sampleNo')" width="80" />
          <el-table-column :label="$t('testData.measurement')">
            <template #default="{ row }">
              <span :class="{ 'out-of-spec': !row.inSpec }">{{ row.value }} {{ record.unit }}</span>
            </template>
          </el-table-column>
          <el-table-column width="80">
            <template #default="{ row }">
              <el-tag :type="row.inSpec ? 'success' : 'danger'" size="small">
                {{ row.inSpec ? 'OK' : 'NG' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <el-empty v-else :description="$t('common.noData')" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import CpkGauge from '../../../components/rdm/test/CpkGauge.vue'

const { t } = useI18n()
const route = useRoute()

const records = JSON.parse(localStorage.getItem('rdm_test_records') || '[]')
const record = computed(() => records.find(r => r.id === route.params.id) || null)

const tableData = computed(() => {
  if (!record.value?.measurements) return []
  return record.value.measurements.map(v => ({
    value: v,
    inSpec: (!record.value.lsl || v >= record.value.lsl) && (!record.value.usl || v <= record.value.usl),
  }))
})

const histogramOption = computed(() => {
  if (!record.value?.measurements) return {}
  const vals = record.value.measurements
  const min = Math.min(...vals)
  const max = Math.max(...vals)
  const binCount = Math.min(10, Math.ceil(vals.length / 3))
  const binSize = (max - min) / binCount || 1
  const bins = Array(binCount).fill(0)
  vals.forEach(v => {
    const idx = Math.min(Math.floor((v - min) / binSize), binCount - 1)
    bins[idx]++
  })
  const labels = bins.map((_, i) => (min + i * binSize).toFixed(2))

  return {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: labels, axisLabel: { rotate: 30, fontSize: 11 } },
    yAxis: { type: 'value' },
    grid: { top: 20, bottom: 60, left: 40, right: 20 },
    series: [{
      type: 'bar',
      data: bins.map((v, i) => ({
        value: v,
        itemStyle: {
          color: record.value.lsl && parseFloat(labels[i]) < record.value.lsl
            ? '#ef4444'
            : record.value.usl && parseFloat(labels[i]) > record.value.usl
              ? '#ef4444'
              : '#1a73e8',
        },
      })),
    }],
    markLine: {
      data: [
        record.value.lsl ? { xAxis: record.value.lsl.toString(), name: 'LSL', lineStyle: { color: '#ef4444' } } : null,
        record.value.usl ? { xAxis: record.value.usl.toString(), name: 'USL', lineStyle: { color: '#ef4444' } } : null,
      ].filter(Boolean),
    },
  }
})
</script>

<style scoped>
.page-container { max-width: 1100px; }
.page-header { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
.page-title { font-size: 20px; font-weight: 700; color: #111827; margin: 0; flex: 1; }
.result-banner { display: flex; align-items: center; gap: 12px; font-size: 20px; font-weight: 700; padding: 16px 24px; border-radius: 10px; margin-bottom: 16px; }
.result-banner.pass { background: #d1fae5; color: #065f46; }
.result-banner.fail { background: #fee2e2; color: #991b1b; }
.info-card { margin-bottom: 16px; }
.charts-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
.chart-card {}
.data-card {}
.out-of-spec { color: #ef4444; font-weight: 600; }
</style>
