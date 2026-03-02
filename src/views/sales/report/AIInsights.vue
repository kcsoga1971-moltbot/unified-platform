<template>
  <div>
    <div class="page-header">
      <h2>{{ $t('nav.aiInsights') }}</h2>
      <el-button :loading="refreshing" @click="refresh">🤖 {{ $t('report.refreshInsights') }}</el-button>
    </div>

    <!-- Key metrics -->
    <el-row :gutter="16" style="margin-bottom:20px">
      <el-col :span="8" v-for="metric in keyMetrics" :key="metric.label">
        <el-card shadow="hover" class="metric-card">
          <div class="metric-icon">{{ metric.icon }}</div>
          <div class="metric-value" :style="{ color: metric.color }">{{ metric.value }}</div>
          <div class="metric-label">{{ metric.label }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- AI Insight cards -->
    <div class="insight-grid">
      <el-card v-for="insight in insights" :key="insight.id" class="insight-card" :class="'insight-' + insight.type">
        <div class="insight-header">
          <span class="insight-icon">{{ insight.icon }}</span>
          <el-tag :type="insight.tagType" size="small">{{ $t('report.insightType.' + insight.type) }}</el-tag>
        </div>
        <h3 class="insight-title">{{ insight.title }}</h3>
        <p class="insight-body">{{ insight.body }}</p>
        <div class="insight-actions">
          <el-button size="small" type="primary" @click="handleAction(insight)">{{ insight.action }}</el-button>
          <el-button size="small" text>{{ $t('common.close') }}</el-button>
        </div>
      </el-card>
    </div>

    <!-- Market Trends -->
    <el-card style="margin-top:20px">
      <template #header><span>{{ $t('report.marketTrend') }}</span></template>
      <el-row :gutter="16">
        <el-col :span="12">
          <v-chart :option="trendChartOption" style="height:250px" autoresize />
        </el-col>
        <el-col :span="12">
          <el-table :data="marketData" size="small" border>
            <el-table-column :label="$t('product.name')" prop="product" min-width="140" />
            <el-table-column :label="$t('report.demand')" width="90">
              <template #default="{ row }">
                <span :style="{ color: row.trend === 'up' ? '#67c23a' : '#f56c6c' }">
                  {{ row.trend === 'up' ? '▲' : '▼' }} {{ row.pct }}%
                </span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('report.recommendation')" min-width="120" prop="rec" />
          </el-table>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { demoMonthlySales } from '../../../utils/sales-demoData.js'

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, LegendComponent])

const { t } = useI18n()
const router = useRouter()
const refreshing = ref(false)

const keyMetrics = computed(() => [
  { label: t('report.aiAccuracy'), value: '94.2%', color: '#67c23a', icon: '🎯' },
  { label: t('report.insightCount'), value: '12', color: '#0d47a1', icon: '💡' },
  { label: t('report.actionItems'), value: '4', color: '#e6a23c', icon: '⚡' }
])

const insights = computed(() => [
  {
    id: 1,
    type: 'opportunity',
    tagType: 'success',
    icon: '📈',
    title: t('report.aiCard.hfDemandTitle'),
    body: t('report.aiCard.hfDemand'),
    action: t('purchase.createPO')
  },
  {
    id: 2,
    type: 'risk',
    tagType: 'danger',
    icon: '⚠️',
    title: t('report.aiCard.photoresistLeadTitle'),
    body: t('report.aiCard.photoresistLead'),
    action: t('report.aiCard.diversifySupply')
  },
  {
    id: 3,
    type: 'alert',
    tagType: 'warning',
    icon: '💳',
    title: t('report.aiCard.creditAlertTitle'),
    body: t('report.aiCard.creditAlert'),
    action: t('nav.creditMgmt')
  },
  {
    id: 4,
    type: 'action',
    tagType: 'warning',
    icon: '⏰',
    title: t('report.aiCard.expiryAlertTitle'),
    body: t('report.aiCard.expiryAlert'),
    action: t('nav.expiryMgmt')
  }
])

const trendChartOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', data: demoMonthlySales.slice(-6).map(d => d.month.substring(5)) },
  yAxis: { type: 'value', axisLabel: { formatter: v => (v / 10000) + '万' } },
  series: [{
    type: 'line',
    smooth: true,
    data: demoMonthlySales.slice(-6).map(d => d.revenue),
    itemStyle: { color: '#0d47a1' },
    areaStyle: { opacity: 0.1 }
  }]
}))

const marketData = computed(() => [
  { product: t('product.hfShort'), trend: 'up', pct: 23, rec: t('report.increaseStock') },
  { product: t('product.photoresistShort'), trend: 'up', pct: 15, rec: t('report.diversify') },
  { product: t('product.ipaShort'), trend: 'down', pct: 5, rec: t('report.holdStock') },
  { product: t('product.h2o2Short'), trend: 'up', pct: 10, rec: t('report.monitor') }
])

function handleAction(insight) {
  if (insight.id === 1) router.push({ name: 'purchaseCreate' })
  else if (insight.id === 3) router.push({ name: 'creditManagement' })
  else if (insight.id === 4) router.push({ name: 'expiryManagement' })
}

async function refresh() {
  refreshing.value = true
  await new Promise(r => setTimeout(r, 1200))
  refreshing.value = false
}
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { font-size: 20px; font-weight: 600; }
.metric-card { text-align: center; padding: 8px 0; }
.metric-icon { font-size: 32px; margin-bottom: 8px; }
.metric-value { font-size: 28px; font-weight: bold; }
.metric-label { font-size: 12px; color: #909399; margin-top: 4px; }
.insight-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.insight-card { border-left: 4px solid #0d47a1; }
.insight-opportunity { border-left-color: #67c23a; }
.insight-risk { border-left-color: #f56c6c; }
.insight-alert { border-left-color: #e6a23c; }
.insight-action { border-left-color: #e6a23c; }
.insight-header { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.insight-icon { font-size: 20px; }
.insight-title { font-size: 15px; font-weight: 600; color: #303133; margin-bottom: 8px; }
.insight-body { font-size: 13px; color: #606266; line-height: 1.6; margin-bottom: 12px; }
.insight-actions { display: flex; gap: 8px; }
</style>
