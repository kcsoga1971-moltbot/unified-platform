<template>
  <div>
    <div class="page-header">
      <h2>{{ $t('nav.bossDashboard') }}</h2>
    </div>

    <!-- P&L Summary -->
    <el-row :gutter="16">
      <el-col :span="6" v-for="item in plItems" :key="item.key">
        <el-card class="pl-card" shadow="hover">
          <div class="pl-value" :style="{ color: item.color }">{{ item.value }}</div>
          <div class="pl-label">{{ item.label }}</div>
          <div v-if="item.trend" class="pl-trend" :style="{ color: item.trend > 0 ? '#67c23a' : '#f56c6c' }">
            {{ item.trend > 0 ? '▲' : '▼' }} {{ Math.abs(item.trend) }}%
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Sales Pipeline -->
    <el-card style="margin-top:20px">
      <template #header><span>{{ $t('boss.salesPipeline') }}</span></template>
      <el-row :gutter="0" class="pipeline">
        <el-col :span="6" v-for="stage in pipelineStages" :key="stage.key" class="pipeline-stage">
          <div class="pipeline-count">{{ stage.count }}</div>
          <div class="pipeline-label">{{ stage.label }}</div>
          <div class="pipeline-amount">¥{{ (stage.amount / 10000).toFixed(0) }}{{ $t('common.wan') }}</div>
        </el-col>
      </el-row>
    </el-card>

    <!-- AR/AP Summary + Alerts -->
    <el-row :gutter="16" style="margin-top:20px">
      <el-col :span="12">
        <el-card>
          <template #header><span>{{ $t('boss.arApSummary') }}</span></template>
          <el-descriptions :column="1" border size="small">
            <el-descriptions-item :label="$t('finance.totalAR')">
              <span style="color:#0d47a1;font-weight:bold">¥{{ (10780000 / 10000).toFixed(0) }}{{ $t('common.wan') }}</span>
            </el-descriptions-item>
            <el-descriptions-item :label="$t('finance.totalAP')">
              <span style="color:#f56c6c;font-weight:bold">¥{{ (3830000 / 10000).toFixed(0) }}{{ $t('common.wan') }}</span>
            </el-descriptions-item>
            <el-descriptions-item :label="$t('finance.netAR')">
              <span style="color:#67c23a;font-weight:bold">¥{{ ((10780000 - 3830000) / 10000).toFixed(0) }}{{ $t('common.wan') }}</span>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header><span>{{ $t('boss.alerts') }}</span></template>
          <el-alert v-for="alert in bossAlerts" :key="alert.id" :title="alert.title" :type="alert.type" show-icon :closable="false" style="margin-bottom:8px" />
        </el-card>
      </el-col>
    </el-row>

    <!-- Charts row -->
    <el-row :gutter="16" style="margin-top:20px">
      <el-col :span="24">
        <SalesChart />
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSalesStore } from '../../../stores/sales-sales.js'
import { useInventoryStore } from '../../../stores/sales-inventory.js'
import { useComplianceStore } from '../../../stores/sales-compliance.js'
import SalesChart from '../../../components/sales/dashboard/SalesChart.vue'
import { demoMonthlySales } from '../../../utils/sales-demoData.js'

const { t } = useI18n()
const salesStore = useSalesStore()
const inventoryStore = useInventoryStore()
const complianceStore = useComplianceStore()

const latest = demoMonthlySales[demoMonthlySales.length - 1]
const prev = demoMonthlySales[demoMonthlySales.length - 2]

const plItems = computed(() => [
  { key: 'revenue', label: t('finance.revenue'), value: '¥' + (latest.revenue / 10000).toFixed(0) + t('common.wan'), color: '#0d47a1', trend: parseFloat(((latest.revenue - prev.revenue) / prev.revenue * 100).toFixed(1)) },
  { key: 'cogs', label: t('finance.cogs'), value: '¥' + (latest.cogs / 10000).toFixed(0) + t('common.wan'), color: '#e57373', trend: null },
  { key: 'gross', label: t('finance.grossProfit'), value: '¥' + ((latest.revenue - latest.cogs) / 10000).toFixed(0) + t('common.wan'), color: '#67c23a', trend: null },
  { key: 'margin', label: t('finance.margin'), value: ((latest.revenue - latest.cogs) / latest.revenue * 100).toFixed(1) + '%', color: '#e6a23c', trend: null }
])

const pipelineStages = computed(() => {
  const stages = {
    quotation: { count: 0, amount: 0 },
    confirmed: { count: 0, amount: 0 },
    shipped: { count: 0, amount: 0 },
    paid: { count: 0, amount: 0 }
  }
  for (const o of salesStore.salesOrders) {
    const bucket = o.status === 'processing' ? 'confirmed' : o.status
    if (bucket in stages) {
      stages[bucket].count++
      stages[bucket].amount += o.totalAmount
    }
  }
  return [
    { key: 'quotation', label: t('boss.pipeline.quotation'), ...stages.quotation },
    { key: 'confirmed', label: t('boss.pipeline.order'), ...stages.confirmed },
    { key: 'shipped', label: t('boss.pipeline.shipped'), ...stages.shipped },
    { key: 'paid', label: t('boss.pipeline.collected'), ...stages.paid }
  ]
})

const bossAlerts = computed(() => {
  const alerts = []
  if (inventoryStore.lowStockItems.length > 0) {
    alerts.push({ id: 'low-stock', title: t('boss.alert.lowStock', { count: inventoryStore.lowStockItems.length }), type: 'warning' })
  }
  if (complianceStore.expiringLicenses.length > 0) {
    alerts.push({ id: 'licenses', title: t('boss.alert.expiringLicenses', { count: complianceStore.expiringLicenses.length }), type: 'error' })
  }
  if (complianceStore.expiredLicenses?.length > 0) {
    alerts.push({ id: 'expired', title: t('boss.alert.expiredLicenses', { count: complianceStore.expiredLicenses.length }), type: 'error' })
  }
  alerts.push({ id: 'ar', title: t('boss.alert.overdueAR'), type: 'warning' })
  return alerts
})
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { font-size: 20px; font-weight: 600; }
.pl-card { text-align: center; padding: 8px 0; }
.pl-value { font-size: 28px; font-weight: bold; margin-bottom: 8px; }
.pl-label { font-size: 13px; color: #909399; }
.pl-trend { font-size: 12px; margin-top: 4px; }
.pipeline { text-align: center; }
.pipeline-stage { padding: 16px; border-right: 1px solid #f0f0f0; }
.pipeline-stage:last-child { border-right: none; }
.pipeline-count { font-size: 32px; font-weight: bold; color: #0d47a1; }
.pipeline-label { font-size: 13px; color: #606266; margin: 4px 0; }
.pipeline-amount { font-size: 14px; color: #67c23a; font-weight: 600; }
</style>
