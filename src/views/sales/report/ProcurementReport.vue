<template>
  <div>
    <div class="page-header">
      <h2>{{ $t('nav.procurementReport') }}</h2>
      <el-button type="primary" :icon="'Download'">{{ $t('report.exportExcel') }}</el-button>
    </div>

    <el-row :gutter="16" style="margin-bottom:16px">
      <el-col :span="12">
        <el-card>
          <template #header><span>{{ $t('report.spendBySupplier') }}</span></template>
          <v-chart :option="spendBySupplierOption" style="height:300px" autoresize />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header><span>{{ $t('report.spendByCountry') }}</span></template>
          <v-chart :option="spendByCountryOption" style="height:300px" autoresize />
        </el-card>
      </el-col>
    </el-row>

    <!-- Lead time analysis -->
    <el-card style="margin-bottom:16px">
      <template #header><span>{{ $t('report.leadTimeAnalysis') }}</span></template>
      <el-table :data="leadTimeData" border stripe>
        <el-table-column :label="$t('supplier.name')" prop="name" min-width="180" />
        <el-table-column :label="$t('common.country')" width="90">
          <template #default="{ row }"><CountryFlag :code="row.country" /></template>
        </el-table-column>
        <el-table-column :label="$t('purchase.leadTime') + ' (天)'">
          <template #default="{ row }">
            <el-progress :percentage="(row.leadTimeDays / 60) * 100" :color="row.leadTimeDays > 45 ? '#f56c6c' : '#0d47a1'" :stroke-width="8" />
          </template>
        </el-table-column>
        <el-table-column :label="$t('report.avgLeadTime')" width="120">
          <template #default="{ row }">{{ row.leadTimeDays }} {{ $t('inventory.days') }}</template>
        </el-table-column>
        <el-table-column :label="$t('supplier.rating')" width="160">
          <template #default="{ row }"><el-rate :model-value="row.rating" disabled :max="5" size="small" /></template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, PieChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { demoSuppliers } from '../../../utils/sales-demoData.js'
import CountryFlag from '../../../components/common/CountryFlag.vue'

use([CanvasRenderer, BarChart, PieChart, GridComponent, TooltipComponent, LegendComponent])

const { t } = useI18n()

const spendBySupplierOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
  xAxis: {
    type: 'category',
    data: demoSuppliers.map(s => s.nameCn.substring(0, 5)),
    axisLabel: { rotate: 30, fontSize: 10 }
  },
  yAxis: { type: 'value', axisLabel: { formatter: v => (v / 10000) + '万' } },
  series: [{
    type: 'bar',
    data: demoSuppliers.map(s => s.totalPurchased),
    itemStyle: { color: '#0d47a1' }
  }]
}))

const spendByCountryOption = computed(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: ¥{c}万 ({d}%)' },
  legend: { orient: 'vertical', right: 10 },
  series: [{
    type: 'pie',
    radius: ['40%', '70%'],
    data: [
      { value: 6150, name: '🇯🇵 ' + t('country.JP') },
      { value: 3600, name: '🇰🇷 ' + t('country.KR') },
      { value: 1680, name: '🇹🇼 ' + t('country.TW') },
      { value: 920, name: '🇨🇳 ' + t('country.CN') }
    ]
  }]
}))

const leadTimeData = computed(() => demoSuppliers.map(s => ({
  name: s.name,
  nameCn: s.nameCn,
  country: s.country,
  leadTimeDays: s.leadTimeDays,
  rating: s.rating
})))
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { font-size: 20px; font-weight: 600; }
</style>
