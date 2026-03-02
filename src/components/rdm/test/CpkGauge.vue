<template>
  <div class="cpk-gauge">
    <VChart :option="option" style="height: 200px;" autoresize />
    <div class="cpk-stats">
      <div class="stat-item">
        <span class="stat-label">Cpk</span>
        <span class="stat-value" :class="cpkClass">{{ cpk }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Cp</span>
        <span class="stat-value">{{ cp }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">{{ $t('common.status') }}</span>
        <el-tag :type="cpkTagType" size="small">{{ cpkLabel }}</el-tag>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
  cpk: { type: Number, default: 0 },
  cp: { type: Number, default: 0 },
})

const cpkClass = computed(() => {
  if (props.cpk >= 1.33) return 'good'
  if (props.cpk >= 1.0) return 'ok'
  return 'bad'
})

const cpkTagType = computed(() => {
  if (props.cpk >= 1.33) return 'success'
  if (props.cpk >= 1.0) return 'warning'
  return 'danger'
})

const cpkLabel = computed(() => {
  if (props.cpk >= 1.67) return t('testData.cpkLevels.excellent')
  if (props.cpk >= 1.33) return t('testData.cpkLevels.good')
  if (props.cpk >= 1.0) return t('testData.cpkLevels.acceptable')
  return t('testData.cpkLevels.poor')
})

const option = computed(() => ({
  series: [{
    type: 'gauge',
    min: 0,
    max: 2,
    splitNumber: 4,
    axisLine: {
      lineStyle: {
        width: 20,
        color: [
          [0.5, '#ef4444'],
          [0.665, '#f59e0b'],
          [1, '#10b981'],
        ],
      },
    },
    pointer: { itemStyle: { color: '#374151' } },
    axisTick: { show: false },
    splitLine: { show: false },
    axisLabel: {
      distance: -30,
      fontSize: 11,
      formatter: (v) => v.toFixed(1),
    },
    detail: {
      fontSize: 24,
      fontWeight: 'bold',
      formatter: (v) => v.toFixed(2),
      color: props.cpk >= 1.33 ? '#10b981' : props.cpk >= 1.0 ? '#f59e0b' : '#ef4444',
    },
    data: [{ value: Math.min(props.cpk, 2), name: 'Cpk' }],
    title: { fontSize: 14, color: '#6b7280' },
  }],
}))
</script>

<style scoped>
.cpk-gauge {}
.cpk-stats { display: flex; justify-content: center; gap: 24px; margin-top: 8px; }
.stat-item { text-align: center; }
.stat-label { font-size: 12px; color: #6b7280; display: block; }
.stat-value { font-size: 20px; font-weight: 700; color: #374151; }
.stat-value.good { color: #10b981; }
.stat-value.ok { color: #f59e0b; }
.stat-value.bad { color: #ef4444; }
</style>
