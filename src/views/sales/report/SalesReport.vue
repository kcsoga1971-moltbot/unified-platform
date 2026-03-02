<template>
  <div>
    <div class="page-header">
      <h2>{{ $t('nav.salesReport') }}</h2>
      <el-button type="primary" :icon="'Download'">{{ $t('report.exportExcel') }}</el-button>
    </div>

    <!-- Period selector -->
    <el-card style="margin-bottom:16px">
      <el-radio-group v-model="period">
        <el-radio-button value="daily">{{ $t('report.daily') }}</el-radio-button>
        <el-radio-button value="weekly">{{ $t('report.weekly') }}</el-radio-button>
        <el-radio-button value="monthly">{{ $t('report.monthly') }}</el-radio-button>
        <el-radio-button value="quarterly">{{ $t('report.quarterly') }}</el-radio-button>
        <el-radio-button value="yearly">{{ $t('report.yearly') }}</el-radio-button>
      </el-radio-group>
    </el-card>

    <!-- Revenue chart -->
    <el-card style="margin-bottom:16px">
      <template #header><span>{{ $t('finance.revenue') }} {{ $t('report.trend') }}</span></template>
      <v-chart :option="revenueChartOption" style="height:300px" autoresize />
    </el-card>

    <el-row :gutter="16">
      <el-col :span="12">
        <el-card>
          <template #header><span>{{ $t('report.byProduct') }}</span></template>
          <v-chart :option="byProductOption" style="height:280px" autoresize />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header><span>{{ $t('report.byCustomer') }}</span></template>
          <v-chart :option="byCustomerOption" style="height:280px" autoresize />
        </el-card>
      </el-col>
    </el-row>

    <!-- YoY Comparison -->
    <el-card style="margin-top:16px">
      <template #header><span>{{ $t('report.yoyComparison') }}</span></template>
      <el-table :data="yoyData" border stripe>
        <el-table-column :label="$t('common.date')" prop="month" width="100" />
        <el-table-column :label="$t('finance.revenue') + ' 2024'">
          <template #default="{ row }"><CurrencyDisplay :amount="row.revenue" currency="CNY" /></template>
        </el-table-column>
        <el-table-column :label="$t('finance.revenue') + ' 2023'">
          <template #default="{ row }"><CurrencyDisplay :amount="row.prevRevenue" currency="CNY" /></template>
        </el-table-column>
        <el-table-column :label="$t('report.yoyGrowth')" width="110">
          <template #default="{ row }">
            <span :style="{ color: row.growth >= 0 ? '#67c23a' : '#f56c6c' }">
              {{ row.growth >= 0 ? '+' : '' }}{{ row.growth }}%
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { demoMonthlySales, demoProducts, demoCustomers } from '../../../utils/sales-demoData.js'
import CurrencyDisplay from '../../../components/common/CurrencyDisplay.vue'

use([CanvasRenderer, BarChart, LineChart, PieChart, GridComponent, TooltipComponent, LegendComponent])

const { t } = useI18n()
const period = ref('monthly')

const revenueChartOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', data: demoMonthlySales.map(d => d.month) },
  yAxis: { type: 'value', axisLabel: { formatter: v => (v / 10000) + '万' } },
  series: [
    { name: t('finance.revenue'), type: 'line', smooth: true, data: demoMonthlySales.map(d => d.revenue), itemStyle: { color: '#0d47a1' } },
    { name: t('finance.cogs'), type: 'line', smooth: true, data: demoMonthlySales.map(d => d.cogs), itemStyle: { color: '#e57373' } }
  ]
}))

const byProductOption = computed(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: {d}%' },
  legend: { orient: 'vertical', right: 10 },
  series: [{
    type: 'pie',
    radius: ['40%', '70%'],
    data: demoProducts.slice(0, 5).map((p, i) => ({ name: p.nameCn.substring(0, 8), value: [38, 22, 18, 12, 10][i] }))
  }]
}))

const byCustomerOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '10%', containLabel: true },
  xAxis: {
    type: 'category',
    data: demoCustomers.slice(0, 6).map(c => c.name.substring(0, 6)),
    axisLabel: { rotate: 20, fontSize: 10 }
  },
  yAxis: { type: 'value', axisLabel: { formatter: v => (v / 10000) + '万' } },
  series: [{ type: 'bar', data: [2850, 1250, 2200, 850, 620, 1800], itemStyle: { color: '#0d47a1' } }]
}))

const yoyData = computed(() => {
  return demoMonthlySales.slice(-4).map((d, i) => ({
    month: d.month.substring(5),
    revenue: d.revenue,
    prevRevenue: Math.round(d.revenue * (0.85 + i * 0.05)),
    growth: parseFloat(((d.revenue / Math.round(d.revenue * (0.85 + i * 0.05)) - 1) * 100).toFixed(1))
  }))
})
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { font-size: 20px; font-weight: 600; }
</style>
