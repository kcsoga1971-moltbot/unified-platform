<template>
  <el-card class="chart-card">
    <template #header>
      <span>{{ $t('dashboard.procurementByCountry') }}</span>
    </template>
    <v-chart :option="chartOption" style="height: 300px;" autoresize />
  </el-card>
</template>

<script setup>
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { useI18n } from 'vue-i18n'

use([CanvasRenderer, PieChart, TooltipComponent, LegendComponent])

const { t } = useI18n()

const chartOption = computed(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: {c}万 ({d}%)' },
  legend: { orient: 'vertical', right: 10, top: 'center' },
  series: [{
    type: 'pie',
    radius: ['40%', '70%'],
    avoidLabelOverlap: false,
    data: [
      { value: 4200, name: '🇯🇵 ' + t('country.JP') },
      { value: 2850, name: '🇰🇷 ' + t('country.KR') },
      { value: 1680, name: '🇹🇼 ' + t('country.TW') },
      { value: 920, name: '🇨🇳 ' + t('country.CN') }
    ],
    itemStyle: { borderRadius: 4 }
  }]
}))
</script>
