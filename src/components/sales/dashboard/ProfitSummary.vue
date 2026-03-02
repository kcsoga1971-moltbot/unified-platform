<template>
  <el-card>
    <template #header>
      <span>{{ $t('dashboard.profitSummary') }}</span>
    </template>
    <el-row :gutter="16">
      <el-col :span="6">
        <div class="stat-item">
          <div class="stat-value primary">{{ formatCurrency(revenue, 'CNY') }}</div>
          <div class="stat-label">{{ $t('finance.revenue') }}</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-item">
          <div class="stat-value danger">{{ formatCurrency(cogs, 'CNY') }}</div>
          <div class="stat-label">{{ $t('finance.cogs') }}</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-item">
          <div class="stat-value success">{{ formatCurrency(grossProfit, 'CNY') }}</div>
          <div class="stat-label">{{ $t('finance.grossProfit') }}</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-item">
          <div class="stat-value" :style="{ color: marginColor }">{{ margin.toFixed(1) }}%</div>
          <div class="stat-label">{{ $t('finance.margin') }}</div>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup>
import { computed } from 'vue'
import { demoMonthlySales } from '../../../utils/sales-demoData.js'
import { formatCurrency } from '../../../utils/currency.js'
import { percentageColor } from '../../../utils/sales-helpers.js'

const latest = demoMonthlySales[demoMonthlySales.length - 1]
const revenue = latest.revenue
const cogs = latest.cogs
const grossProfit = computed(() => revenue - cogs)
const margin = computed(() => (grossProfit.value / revenue) * 100)
const marginColor = computed(() => percentageColor(margin.value))
</script>

<style scoped>
.stat-item { text-align: center; padding: 16px 8px; }
.stat-value { font-size: 20px; font-weight: bold; }
.stat-label { font-size: 12px; color: #909399; margin-top: 4px; }
.primary { color: #0d47a1; }
.danger { color: #f56c6c; }
.success { color: #67c23a; }
</style>
