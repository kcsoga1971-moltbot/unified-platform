<template>
  <div class="spc-chart">
    <div class="chart-title">{{ $t('testData.xbarChart') }}</div>
    <VChart :option="xbarOption" style="height: 220px;" autoresize />
    <div class="chart-title" style="margin-top: 16px">{{ $t('testData.rChart') }}</div>
    <VChart :option="rOption" style="height: 180px;" autoresize />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  data: { type: Array, default: () => [] }, // [{batch, mean, range}]
  lsl: { type: Number, default: null },
  usl: { type: Number, default: null },
})

// Control limit constants for subgroup size n=5
const A2 = 0.577
const D4 = 2.114
const D3 = 0

const stats = computed(() => {
  if (!props.data.length) return { xdbar: 0, rbar: 0, uclX: 0, lclX: 0, uclR: 0, lclR: 0 }
  const xdbar = props.data.reduce((a, b) => a + b.mean, 0) / props.data.length
  const rbar = props.data.reduce((a, b) => a + b.range, 0) / props.data.length
  const uclX = xdbar + A2 * rbar
  const lclX = xdbar - A2 * rbar
  const uclR = D4 * rbar
  const lclR = D3 * rbar
  return { xdbar, rbar, uclX, lclX, uclR, lclR }
})

const xbarOption = computed(() => {
  const s = stats.value
  const means = props.data.map(d => d.mean)
  const outOfControl = means.map(v => v > s.uclX || v < s.lclX)

  return {
    tooltip: { trigger: 'axis' },
    legend: { data: [t('testData.xbarChart'), t('testData.ucl'), t('testData.cl'), t('testData.lcl')], bottom: 0, itemWidth: 14, textStyle: { fontSize: 11 } },
    grid: { top: 10, bottom: 40, left: 50, right: 20 },
    xAxis: { type: 'category', data: props.data.map(d => `批次${d.batch}`), axisLabel: { fontSize: 11 } },
    yAxis: { type: 'value', scale: true, axisLabel: { fontSize: 11 } },
    series: [
      {
        name: t('testData.xbarChart'),
        type: 'line',
        data: means.map((v, i) => ({
          value: v,
          itemStyle: { color: outOfControl[i] ? '#ef4444' : '#1a73e8' },
          symbolSize: outOfControl[i] ? 10 : 6,
        })),
        lineStyle: { color: '#1a73e8' },
        symbol: 'circle',
      },
      { name: t('testData.ucl'), type: 'line', data: means.map(() => Math.round(s.uclX * 1000) / 1000), lineStyle: { color: '#ef4444', type: 'dashed' }, symbol: 'none', showInLegend: true },
      { name: t('testData.cl'), type: 'line', data: means.map(() => Math.round(s.xdbar * 1000) / 1000), lineStyle: { color: '#10b981', type: 'solid' }, symbol: 'none' },
      { name: t('testData.lcl'), type: 'line', data: means.map(() => Math.round(s.lclX * 1000) / 1000), lineStyle: { color: '#ef4444', type: 'dashed' }, symbol: 'none', showInLegend: false },
    ],
  }
})

const rOption = computed(() => {
  const s = stats.value
  const ranges = props.data.map(d => d.range)

  return {
    tooltip: { trigger: 'axis' },
    grid: { top: 10, bottom: 40, left: 50, right: 20 },
    xAxis: { type: 'category', data: props.data.map(d => `批次${d.batch}`), axisLabel: { fontSize: 11 } },
    yAxis: { type: 'value', scale: true, axisLabel: { fontSize: 11 } },
    series: [
      {
        name: t('testData.rChart'),
        type: 'line',
        data: ranges.map((v, i) => ({
          value: v,
          itemStyle: { color: v > s.uclR ? '#ef4444' : '#7c3aed' },
          symbolSize: v > s.uclR ? 10 : 6,
        })),
        lineStyle: { color: '#7c3aed' },
        symbol: 'circle',
      },
      { name: t('testData.ucl'), type: 'line', data: ranges.map(() => Math.round(s.uclR * 1000) / 1000), lineStyle: { color: '#ef4444', type: 'dashed' }, symbol: 'none' },
      { name: t('testData.cl'), type: 'line', data: ranges.map(() => Math.round(s.rbar * 1000) / 1000), lineStyle: { color: '#10b981' }, symbol: 'none' },
    ],
  }
})
</script>

<style scoped>
.spc-chart {}
.chart-title { font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 4px; }
</style>
