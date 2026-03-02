<template>
  <div>
    <div class="page-header">
      <h2>{{ $t('nav.quotations') }}</h2>
      <el-button type="primary" :icon="'Plus'" @click="router.push({ name: 'salesCreate' })">{{ $t('sales.newQuotation') }}</el-button>
    </div>

    <!-- Stats -->
    <el-row :gutter="16" style="margin-bottom:16px">
      <el-col :span="6" v-for="stat in quotationStats" :key="stat.label">
        <el-card shadow="hover">
          <div class="stat-val" :style="{ color: stat.color }">{{ stat.value }}</div>
          <div class="stat-lab">{{ stat.label }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <el-table :data="salesStore.quotations" stripe @row-click="openDetail">
        <el-table-column :label="$t('sales.soNumber')" prop="soNumber" width="150" />
        <el-table-column :label="$t('sales.customer')" width="160">
          <template #default="{ row }">{{ getCustomerName(row.customerId) }}</template>
        </el-table-column>
        <el-table-column :label="$t('common.amount')" width="150">
          <template #default="{ row }"><CurrencyDisplay :amount="row.totalAmount" :currency="row.currency" /></template>
        </el-table-column>
        <el-table-column :label="$t('sales.validUntil')" width="110">
          <template #default="{ row }">
            <span :style="{ color: isExpiring(row.validUntil) ? '#f56c6c' : '' }">{{ formatDate(row.validUntil) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('sales.followUpStatus')" width="110">
          <template #default="{ row }">
            <el-tag :type="row.followUpStatus === 'won' ? 'success' : row.followUpStatus === 'lost' ? 'danger' : 'warning'" size="small">
              {{ $t('sales.followUp.' + (row.followUpStatus || 'pending')) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.createdAt')" width="120">
          <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column :label="$t('common.actions')" width="160" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" size="small" @click.stop="openDetail(row)">{{ $t('common.details') }}</el-button>
            <el-button text type="success" size="small" @click.stop="convertToOrder(row)">{{ $t('sales.convertToOrder') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSalesStore } from '../../../stores/sales-sales.js'
import { useCustomerStore } from '../../../stores/sales-customer.js'
import { formatDate, daysUntil } from '../../../utils/sales-helpers.js'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import CurrencyDisplay from '../../../components/common/CurrencyDisplay.vue'

const { t } = useI18n()
const router = useRouter()
const salesStore = useSalesStore()
const customerStore = useCustomerStore()

const quotationStats = computed(() => [
  { label: t('sales.totalQuotations'), value: salesStore.quotations.length, color: '#0d47a1' },
  { label: t('sales.totalValue'), value: '¥' + (salesStore.quotations.reduce((s, o) => s + o.totalAmount, 0) / 10000).toFixed(0) + '万', color: '#67c23a' },
  { label: t('sales.pending'), value: salesStore.quotations.filter(q => q.followUpStatus === 'contacted' || !q.followUpStatus).length, color: '#e6a23c' },
  { label: t('sales.expiringSoon'), value: salesStore.quotations.filter(q => q.validUntil && daysUntil(q.validUntil) <= 7).length, color: '#f56c6c' }
])

function getCustomerName(id) {
  return customerStore.getById(id)?.name || id
}

function isExpiring(date) {
  if (!date) return false
  const days = daysUntil(date)
  return days !== null && days <= 7
}

function openDetail(row) {
  router.push({ name: 'salesDetail', params: { id: row.id } })
}

function convertToOrder(row) {
  salesStore.convertToOrder(row.id)
  ElMessage.success(t('sales.convertedToOrder'))
}

onMounted(() => {
  salesStore.fetchOrders()
  customerStore.fetchCustomers()
})
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { font-size: 20px; font-weight: 600; }
.stat-val { font-size: 28px; font-weight: bold; }
.stat-lab { font-size: 12px; color: #909399; margin-top: 4px; }
</style>
