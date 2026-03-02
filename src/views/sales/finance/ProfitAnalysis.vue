<template>
  <div>
    <div class="page-header">
      <h2>{{ $t('nav.profitAnalysis') }}</h2>
    </div>

    <!-- Summary cards -->
    <el-row :gutter="16" style="margin-bottom:16px">
      <el-col :span="6" v-for="stat in profitStats" :key="stat.label">
        <el-card shadow="hover">
          <div class="stat-val" :style="{ color: stat.color }">{{ stat.value }}</div>
          <div class="stat-lab">{{ stat.label }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :span="12">
        <el-card>
          <template #header><span>{{ $t('finance.grossMarginByProduct') }}</span></template>
          <v-chart :option="productMarginOption" style="height:300px" autoresize />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header><span>{{ $t('finance.grossMarginByCustomer') }}</span></template>
          <v-chart :option="customerMarginOption" style="height:300px" autoresize />
        </el-card>
      </el-col>
    </el-row>

    <el-card style="margin-top:16px">
      <template #header><span>{{ $t('finance.marginTrend') }}</span></template>
      <v-chart :option="marginTrendOption" style="height:280px" autoresize />
    </el-card>

    <!-- Cost Breakdown -->
    <el-card style="margin-top:16px">
      <template #header><span>{{ $t('finance.costBreakdown') }}</span></template>
      <el-row :gutter="16">
        <el-col :span="12">
          <el-table :data="costBreakdown" border size="small">
            <el-table-column :label="$t('common.type')" prop="type" />
            <el-table-column :label="$t('common.amount')">
              <template #default="{ row }"><CurrencyDisplay :amount="row.amount" currency="CNY" /></template>
            </el-table-column>
            <el-table-column :label="$t('finance.proportion')" width="100">
              <template #default="{ row }">
                <el-progress :percentage="row.pct" :stroke-width="8" />
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { demoMonthlySales, demoProducts, demoCustomers } from '../../../utils/sales-demoData.js'
import CurrencyDisplay from '../../../components/common/CurrencyDisplay.vue'

use([CanvasRenderer, BarChart, LineChart, GridComponent, TooltipComponent, LegendComponent])

const { t } = useI18n()

const latest = demoMonthlySales[demoMonthlySales.length - 1]
const revenue = latest.revenue
const cogs = latest.cogs
const grossProfit = revenue - cogs
const margin = (grossProfit / revenue * 100).toFixed(1)

const profitStats = computed(() => [
  { label: t('finance.revenue'), value: '¥' + (revenue / 10000).toFixed(0) + '万', color: '#0d47a1' },
  { label: t('finance.cogs'), value: '¥' + (cogs / 10000).toFixed(0) + '万', color: '#e57373' },
  { label: t('finance.grossProfit'), value: '¥' + (grossProfit / 10000).toFixed(0) + '万', color: '#67c23a' },
  { label: t('finance.margin'), value: margin + '%', color: '#e6a23c' }
])

const productMarginOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '10%', containLabel: true },
  xAxis: {
    type: 'category',
    data: demoProducts.slice(0, 6).map(p => p.nameCn.substring(0, 6)),
    axisLabel: { rotate: 30, fontSize: 10 }
  },
  yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
  series: [{
    type: 'bar',
    data: [28, 32, 25, 35, 38, 22],
    itemStyle: { color: '#0d47a1' }
  }]
}))

const customerMarginOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '10%', containLabel: true },
  xAxis: {
    type: 'category',
    data: demoCustomers.slice(0, 6).map(c => c.name.substring(0, 5)),
    axisLabel: { rotate: 30, fontSize: 10 }
  },
  yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
  series: [{
    type: 'bar',
    data: [30, 26, 22, 28, 35, 20],
    itemStyle: { color: '#67c23a' }
  }]
}))

const marginTrendOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', data: demoMonthlySales.map(d => d.month.substring(5)) },
  yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
  series: [{
    type: 'line',
    smooth: true,
    data: demoMonthlySales.map(d => ((d.revenue - d.cogs) / d.revenue * 100).toFixed(1)),
    itemStyle: { color: '#e6a23c' },
    areaStyle: { opacity: 0.1 }
  }]
}))

const costBreakdown = computed(() => {
  const total = cogs
  return [
    { type: t('finance.productCost'), amount: Math.round(total * 0.75), pct: 75 },
    { type: t('finance.logisticsCost'), amount: Math.round(total * 0.12), pct: 12 },
    { type: t('finance.customsDuty'), amount: Math.round(total * 0.08), pct: 8 },
    { type: t('finance.storageCost'), amount: Math.round(total * 0.05), pct: 5 }
  ]
})
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { font-size: 20px; font-weight: 600; }
.stat-val { font-size: 28px; font-weight: bold; }
.stat-lab { font-size: 12px; color: #909399; margin-top: 4px; }
</style>
