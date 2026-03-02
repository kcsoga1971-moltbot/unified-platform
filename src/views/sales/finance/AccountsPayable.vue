<template>
  <div>
    <div class="page-header">
      <h2>{{ $t('nav.accountsPayable') }}</h2>
    </div>

    <!-- Summary -->
    <el-row :gutter="16" style="margin-bottom:16px">
      <el-col :span="6" v-for="stat in apStats" :key="stat.label">
        <el-card shadow="hover">
          <div class="stat-val" :style="{ color: stat.color }">{{ stat.value }}</div>
          <div class="stat-lab">{{ stat.label }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <template #header><span>{{ $t('finance.aging') }} - {{ $t('nav.accountsPayable') }}</span></template>
      <el-table :data="demoAPData" border stripe show-summary :summary-method="getSummary">
        <el-table-column :label="$t('supplier.name')" prop="supplierName" min-width="180" fixed />
        <el-table-column :label="$t('finance.current')" width="130">
          <template #default="{ row }"><CurrencyDisplay :amount="row.current" currency="CNY" /></template>
        </el-table-column>
        <el-table-column :label="$t('finance.days1_30')" width="130">
          <template #default="{ row }"><CurrencyDisplay :amount="row.days1_30" currency="CNY" /></template>
        </el-table-column>
        <el-table-column :label="$t('finance.totalAP')" width="140">
          <template #default="{ row }"><CurrencyDisplay :amount="row.total" currency="CNY" color="#e57373" /></template>
        </el-table-column>
        <el-table-column :label="$t('finance.dueDate')" width="110">
          <template #default="{ row }">
            <span :style="{ color: isDueSoon(row.dueDate) ? '#f56c6c' : '' }">{{ formatDate(row.dueDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('purchase.paymentTerms')" prop="paymentTerms" width="110" />
        <el-table-column :label="$t('common.actions')" width="100" fixed="right">
          <template #default>
            <el-button text type="primary" size="small">{{ $t('finance.pay') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Upcoming payments -->
    <el-card style="margin-top:16px">
      <template #header><span>{{ $t('finance.upcomingPayments') }}</span></template>
      <el-table :data="upcomingPayments" size="small" stripe>
        <el-table-column :label="$t('supplier.name')" prop="supplierName" />
        <el-table-column :label="$t('finance.dueDate')">
          <template #default="{ row }">
            <span :style="{ color: isDueSoon(row.dueDate) ? '#f56c6c' : '#e6a23c' }">{{ formatDate(row.dueDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.amount')">
          <template #default="{ row }"><CurrencyDisplay :amount="row.total" currency="CNY" /></template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { demoAPData } from '../../../utils/sales-demoData.js'
import CurrencyDisplay from '../../../components/common/CurrencyDisplay.vue'
import { formatDate, daysUntil } from '../../../utils/sales-helpers.js'
import dayjs from 'dayjs'

const { t } = useI18n()

const totalAP = computed(() => demoAPData.reduce((s, r) => s + r.total, 0))
const dueSoon = computed(() => demoAPData.filter(r => {
  const days = dayjs(r.dueDate).diff(dayjs(), 'day')
  return days >= 0 && days <= 7
}))

const apStats = computed(() => [
  { label: t('finance.totalAP'), value: '¥' + (totalAP.value / 10000).toFixed(0) + '万', color: '#e57373' },
  { label: t('finance.dueThisWeek'), value: '¥' + (dueSoon.value.reduce((s, r) => s + r.total, 0) / 10000).toFixed(0) + '万', color: '#f56c6c' },
  { label: t('finance.supplierCount'), value: demoAPData.length, color: '#0d47a1' },
  { label: t('finance.avgDays'), value: '45' + t('inventory.days'), color: '#909399' }
])

const upcomingPayments = computed(() => {
  return [...demoAPData]
    .filter(r => dayjs(r.dueDate).diff(dayjs(), 'day') >= 0)
    .sort((a, b) => dayjs(a.dueDate).diff(dayjs(b.dueDate)))
    .slice(0, 5)
})

function isDueSoon(date) {
  return dayjs(date).diff(dayjs(), 'day') <= 7
}

function getSummary({ columns, data }) {
  return columns.map((col, i) => {
    if (i === 0) return t('common.total')
    const keys = ['current', 'days1_30', 'total']
    const key = keys[i - 1]
    if (key && data.length > 0 && key in data[0]) {
      const sum = data.reduce((s, r) => s + (r[key] || 0), 0)
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
