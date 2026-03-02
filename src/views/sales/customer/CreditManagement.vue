<template>
  <div>
    <div class="page-header">
      <h2>{{ $t('nav.creditMgmt') }}</h2>
    </div>

    <!-- Summary cards -->
    <el-row :gutter="16" style="margin-bottom:20px">
      <el-col :span="6" v-for="c in creditSummary" :key="c.label">
        <el-card shadow="hover">
          <div class="credit-card-value" :style="{ color: c.color }">{{ c.value }}</div>
          <div class="credit-card-label">{{ c.label }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- AR Aging table -->
    <el-card>
      <template #header><span>{{ $t('finance.aging') }} ({{ $t('finance.byCustomer') }})</span></template>
      <el-table :data="arData" border stripe>
        <el-table-column :label="$t('customer.name')" prop="customerName" min-width="140" />
        <el-table-column :label="$t('finance.current')" width="110">
          <template #default="{ row }"><CurrencyDisplay :amount="row.current" currency="CNY" /></template>
        </el-table-column>
        <el-table-column :label="$t('finance.days1_30')" width="110">
          <template #default="{ row }"><CurrencyDisplay :amount="row.days1_30" currency="CNY" /></template>
        </el-table-column>
        <el-table-column :label="$t('finance.days31_60')" width="110">
          <template #default="{ row }"><CurrencyDisplay :amount="row.days31_60" currency="CNY" /></template>
        </el-table-column>
        <el-table-column :label="$t('finance.days61_90')" width="110">
          <template #default="{ row }"><CurrencyDisplay :amount="row.days61_90" currency="CNY" /></template>
        </el-table-column>
        <el-table-column :label="$t('finance.daysOver90')" width="110">
          <template #default="{ row }">
            <CurrencyDisplay :amount="row.daysOver90" currency="CNY" :color="row.daysOver90 > 0 ? '#f56c6c' : ''" />
          </template>
        </el-table-column>
        <el-table-column :label="$t('finance.totalAR')" width="130">
          <template #default="{ row }"><CurrencyDisplay :amount="row.total" currency="CNY" color="#0d47a1" /></template>
        </el-table-column>
        <el-table-column :label="$t('customer.paymentTerms')" prop="paymentTerms" width="100" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { demoARData } from '../../../utils/sales-demoData.js'
import CurrencyDisplay from '../../../components/common/CurrencyDisplay.vue'

const { t } = useI18n()
const arData = demoARData

const totalAR = computed(() => arData.reduce((s, r) => s + r.total, 0))
const overdueAR = computed(() => arData.reduce((s, r) => s + r.daysOver90 + r.days61_90, 0))

const creditSummary = computed(() => [
  { label: t('finance.totalAR'), value: '¥' + (totalAR.value / 10000).toFixed(0) + t('common.wan'), color: '#0d47a1' },
  { label: t('customer.overdueAR'), value: '¥' + (overdueAR.value / 10000).toFixed(0) + t('common.wan'), color: '#f56c6c' },
  { label: t('customer.customers'), value: arData.length + t('common.unit.company'), color: '#303133' },
  { label: t('customer.overdueRate'), value: (overdueAR.value / totalAR.value * 100).toFixed(1) + '%', color: overdueAR.value / totalAR.value > 0.1 ? '#f56c6c' : '#67c23a' }
])
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { font-size: 20px; font-weight: 600; }
.credit-card-value { font-size: 24px; font-weight: bold; margin-bottom: 4px; }
.credit-card-label { font-size: 12px; color: #909399; }
</style>
