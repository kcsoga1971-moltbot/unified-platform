<template>
  <el-card class="chart-card">
    <template #header>
      <span>{{ $t('dashboard.salesTrend') }}</span>
    </template>
    <v-chart :option="chartOption" style="height: 300px;" autoresize />
  </el-card>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { demoMonthlySales } from '../../../utils/sales-demoData.js'

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, LegendComponent])

const { t } = useI18n()

const chartOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: [t('dashboard.revenue'), t('dashboard.cogs')] },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: {
    type: 'category',
    data: demoMonthlySales.map(d => d.month.substring(5))
  },
  yAxis: { type: 'value', axisLabel: { formatter: v => (v / 10000) + '万' } },
  series: [
    {
      name: t('dashboard.revenue'),
      type: 'line',
      smooth: true,
      data: demoMonthlySales.map(d => d.revenue),
      itemStyle: { color: '#0d47a1' },
      areaStyle: { opacity: 0.1 }
    },
    {
      name: t('dashboard.cogs'),
      type: 'line',
      smooth: true,
      data: demoMonthlySales.map(d => d.cogs),
      itemStyle: { color: '#e57373' },
      areaStyle: { opacity: 0.1 }
    }
  ]
}))
</script>
