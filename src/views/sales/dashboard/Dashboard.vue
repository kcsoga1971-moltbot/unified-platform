<template>
  <div class="dashboard">
    <!-- Page header -->
    <div class="page-header">
      <h2>{{ $t('nav.dashboard') }}</h2>
      <div class="header-actions">
        <el-button type="primary" :icon="'Plus'" @click="router.push({ name: 'salesCreate' })">{{ $t('dashboard.newQuotation') }}</el-button>
        <el-button :icon="'Refresh'" @click="loadData">{{ $t('common.refresh') }}</el-button>
      </div>
    </div>

    <!-- Stats cards -->
    <el-row :gutter="16" class="stats-row">
      <el-col :xs="12" :sm="8" :md="6" v-for="stat in statsCards" :key="stat.key">
        <el-card class="stat-card" shadow="hover" @click="stat.onClick && stat.onClick()">
          <div class="stat-content">
            <el-icon :size="32" :color="stat.color">
              <component :is="stat.icon" />
            </el-icon>
            <div class="stat-text">
              <div class="stat-value" :style="{ color: stat.color }">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Charts row -->
    <el-row :gutter="16" style="margin-top:20px">
      <el-col :span="16">
        <SalesChart />
      </el-col>
      <el-col :span="8">
        <ProcurementChart />
      </el-col>
    </el-row>

    <!-- Bottom row -->
    <el-row :gutter="16" style="margin-top:20px">
      <el-col :span="12">
        <InventoryAlert />
      </el-col>
      <el-col :span="12">
        <ProfitSummary />
      </el-col>
    </el-row>

    <!-- Recent orders -->
    <el-card style="margin-top:20px">
      <template #header>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span>{{ $t('dashboard.recentOrders') }}</span>
          <el-button text @click="router.push({ name: 'salesList' })">{{ $t('common.view') }} {{ $t('common.all') }}</el-button>
        </div>
      </template>
      <el-table :data="recentOrders" size="small">
        <el-table-column :label="$t('common.number')" prop="soNumber" width="140" />
        <el-table-column :label="$t('sales.customer')">
          <template #default="{ row }">{{ getCustomerName(row.customerId) }}</template>
        </el-table-column>
        <el-table-column :label="$t('common.amount')" width="140">
          <template #default="{ row }"><CurrencyDisplay :amount="row.totalAmount" :currency="row.currency" /></template>
        </el-table-column>
        <el-table-column :label="$t('common.status')" width="100">
          <template #default="{ row }"><StatusBadge :status="row.status" /></template>
        </el-table-column>
        <el-table-column :label="$t('common.date')" width="120">
          <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSalesStore } from '../../../stores/sales-sales.js'
import { useCustomerStore } from '../../../stores/sales-customer.js'
import { useInventoryStore } from '../../../stores/sales-inventory.js'
import { useComplianceStore } from '../../../stores/sales-compliance.js'
import { usePurchaseStore } from '../../../stores/sales-purchase.js'
import { demoMonthlySales } from '../../../utils/sales-demoData.js'
import { formatDate } from '../../../utils/sales-helpers.js'
import SalesChart from '../../../components/sales/dashboard/SalesChart.vue'
import ProcurementChart from '../../../components/sales/dashboard/ProcurementChart.vue'
import InventoryAlert from '../../../components/sales/dashboard/InventoryAlert.vue'
import ProfitSummary from '../../../components/sales/dashboard/ProfitSummary.vue'
import StatusBadge from '../../../components/common/StatusBadge.vue'
import CurrencyDisplay from '../../../components/common/CurrencyDisplay.vue'

const { t } = useI18n()
const router = useRouter()
const salesStore = useSalesStore()
const customerStore = useCustomerStore()
const inventoryStore = useInventoryStore()
const complianceStore = useComplianceStore()
const purchaseStore = usePurchaseStore()

const latest = demoMonthlySales[demoMonthlySales.length - 1]
const monthlySales = latest.revenue
const monthlyProcurement = latest.cogs * 0.9
const grossMargin = ((latest.revenue - latest.cogs) / latest.revenue * 100).toFixed(1)

const pendingOrders = computed(() => salesStore.activeOrders?.filter(o => ['confirmed', 'processing'].includes(o.status)).length ?? 0)
const pendingPO = computed(() => purchaseStore.purchaseOrders.filter(o => o.status === 'draft').length)

const statsCards = computed(() => [
  { key: 'sales', label: t('dashboard.monthlySales'), value: '¥' + (monthlySales / 10000).toFixed(0) + t('common.wan'), color: '#0d47a1', icon: 'TrendCharts', onClick: () => router.push({ name: 'salesList' }) },
  { key: 'procurement', label: t('dashboard.monthlyProcurement'), value: '¥' + (monthlyProcurement / 10000).toFixed(0) + t('common.wan'), color: '#e57373', icon: 'ShoppingCart', onClick: () => router.push({ name: 'purchaseList' }) },
  { key: 'margin', label: t('dashboard.grossMargin'), value: grossMargin + '%', color: '#67c23a', icon: 'DataLine' },
  { key: 'pendingOrders', label: t('dashboard.pendingOrders'), value: String(pendingOrders.value), color: '#e6a23c', icon: 'Document', onClick: () => router.push({ name: 'salesList' }) },
  { key: 'lowStock', label: t('dashboard.lowStockAlerts'), value: String(inventoryStore.lowStockItems.length), color: '#f56c6c', icon: 'Warning', onClick: () => router.push({ name: 'inventoryDashboard' }) },
  { key: 'expiring', label: t('dashboard.expiringProducts'), value: String(inventoryStore.expiringItems.length), color: '#e6a23c', icon: 'Timer', onClick: () => router.push({ name: 'expiryManagement' }) },
  { key: 'approvals', label: t('dashboard.pendingApprovals'), value: String(pendingPO.value), color: '#909399', icon: 'DocumentChecked' },
  { key: 'licenses', label: t('compliance.expiryAlert.label'), value: String(complianceStore.expiringLicenses.length), color: '#f56c6c', icon: 'Stamp', onClick: () => router.push({ name: 'licenseManagement' }) }
])

const recentOrders = computed(() => salesStore.salesOrders.slice(0, 5))

function getCustomerName(id) {
  return customerStore.getById(id)?.name || id
}

function loadData() {
  salesStore.fetchOrders()
  inventoryStore.fetchInventory()
}
</script>

<style scoped>
.dashboard { }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { font-size: 20px; font-weight: 600; color: #303133; }
.header-actions { display: flex; gap: 8px; }
.stats-row { margin-bottom: 4px; }
.stat-card { cursor: pointer; transition: transform 0.2s; margin-bottom: 16px; }
.stat-card:hover { transform: translateY(-2px); }
.stat-content { display: flex; align-items: center; gap: 16px; }
.stat-value { font-size: 24px; font-weight: bold; }
.stat-label { font-size: 12px; color: #909399; margin-top: 4px; }
</style>
