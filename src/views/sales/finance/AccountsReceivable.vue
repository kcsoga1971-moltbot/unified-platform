<template>
  <div>
    <div class="page-header">
      <h2>{{ $t('nav.accountsReceivable') }}</h2>
      <el-button type="primary" :icon="'Download'">{{ $t('report.exportExcel') }}</el-button>
    </div>

    <!-- Summary -->
    <el-row :gutter="16" style="margin-bottom:16px">
      <el-col :span="6" v-for="stat in arStats" :key="stat.label">
        <el-card shadow="hover">
          <div class="stat-val" :style="{ color: stat.color }">{{ stat.value }}</div>
          <div class="stat-lab">{{ stat.label }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- AR Aging table -->
    <el-card>
      <template #header>
        <span>{{ $t('finance.aging') }} - {{ $t('nav.accountsReceivable') }}</span>
      </template>
      <el-table :data="demoARData" border stripe show-summary :summary-method="getSummary">
        <el-table-column :label="$t('customer.name')" prop="customerName" min-width="140" fixed />
        <el-table-column :label="$t('finance.current')" width="120">
          <template #default="{ row }"><CurrencyDisplay :amount="row.current" currency="CNY" /></template>
        </el-table-column>
        <el-table-column :label="$t('finance.days1_30')" width="120">
          <template #default="{ row }"><CurrencyDisplay :amount="row.days1_30" currency="CNY" /></template>
        </el-table-column>
        <el-table-column :label="$t('finance.days31_60')" width="120">
          <template #default="{ row }"><CurrencyDisplay :amount="row.days31_60" currency="CNY" /></template>
        </el-table-column>
        <el-table-column :label="$t('finance.days61_90')" width="120">
          <template #default="{ row }"><CurrencyDisplay :amount="row.days61_90" currency="CNY" /></template>
        </el-table-column>
        <el-table-column :label="$t('finance.daysOver90')" width="130">
          <template #default="{ row }">
            <CurrencyDisplay :amount="row.daysOver90" currency="CNY" :color="row.daysOver90 > 0 ? '#f56c6c' : ''" />
          </template>
        </el-table-column>
        <el-table-column :label="$t('finance.totalAR')" width="140">
          <template #default="{ row }"><CurrencyDisplay :amount="row.total" currency="CNY" color="#0d47a1" /></template>
        </el-table-column>
        <el-table-column :label="$t('customer.paymentTerms')" prop="paymentTerms" width="100" />
        <el-table-column :label="$t('common.actions')" width="120" fixed="right">
          <template #default>
            <el-button text type="warning" size="small">{{ $t('finance.collection') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { demoARData } from '../../../utils/sales-demoData.js'
import CurrencyDisplay from '../../../components/common/CurrencyDisplay.vue'
import { formatCurrency } from '../../../utils/currency.js'

const { t } = useI18n()

const totalAR = computed(() => demoARData.reduce((s, r) => s + r.total, 0))
const overdueAR = computed(() => demoARData.reduce((s, r) => s + r.daysOver90 + r.days61_90, 0))
const currentAR = computed(() => demoARData.reduce((s, r) => s + r.current, 0))

const arStats = computed(() => [
  { label: t('finance.totalAR'), value: '¥' + (totalAR.value / 10000).toFixed(0) + '万', color: '#0d47a1' },
  { label: t('finance.currentAR'), value: '¥' + (currentAR.value / 10000).toFixed(0) + '万', color: '#67c23a' },
  { label: t('finance.overdueAR'), value: '¥' + (overdueAR.value / 10000).toFixed(0) + '万', color: '#f56c6c' },
  { label: t('finance.overdueRate'), value: (overdueAR.value / totalAR.value * 100).toFixed(1) + '%', color: overdueAR.value / totalAR.value > 0.15 ? '#f56c6c' : '#67c23a' }
])

function getSummary({ columns, data }) {
  const keys = ['current', 'days1_30', 'days31_60', 'days61_90', 'daysOver90', 'total']
  return columns.map((col, i) => {
    if (i === 0) return t('common.total')
    const key = keys[i - 1]
    if (key && data.length > 0 && key in data[0]) {
      const sum = data.reduce((s, row) => s + (row[key] || 0), 0)
      return '¥' + sum.toLocaleString()
    }
    return ''
  })
}
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { font-size: 20px; font-weight: 600; }
.stat-val { font-size: 28px; font-weight: bold; }
.stat-lab { font-size: 12px; color: #909399; margin-top: 4px; }
</style>
