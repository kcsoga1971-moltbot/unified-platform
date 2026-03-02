<template>
  <div>
    <div class="page-header">
      <h2>{{ $t('nav.stockOverview') }}</h2>
      <el-button @click="inventoryStore.fetchInventory()">{{ $t('common.refresh') }}</el-button>
    </div>

    <!-- Alert summary -->
    <el-row :gutter="16" style="margin-bottom:16px">
      <el-col :span="6" v-for="stat in invStats" :key="stat.key">
        <el-card shadow="hover" @click="stat.onClick && stat.onClick()">
          <div class="stat-val" :style="{ color: stat.color }">{{ stat.value }}</div>
          <div class="stat-lab">{{ stat.label }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16">
      <el-col :span="16">
        <el-card>
          <template #header><span>{{ $t('inventory.byProduct') }}</span></template>
          <v-chart :option="stockBarOption" style="height:350px" autoresize />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header><span>{{ $t('inventory.byCategory') }}</span></template>
          <v-chart :option="categoryPieOption" style="height:350px" autoresize />
        </el-card>
      </el-col>
    </el-row>

    <!-- Low stock alerts -->
    <el-card style="margin-top:16px" v-if="inventoryStore.lowStockItems.length > 0">
      <template #header>
        <span style="color:#f56c6c">{{ $t('inventory.lowStockAlert') }} ({{ inventoryStore.lowStockItems.length }})</span>
      </template>
      <el-table :data="inventoryStore.lowStockItems" size="small">
        <el-table-column :label="$t('purchase.lotNumber')" prop="lotNumber" width="150" />
        <el-table-column :label="$t('common.quantity')">
          <template #default="{ row }">{{ row.quantity }} {{ row.unit }}</template>
        </el-table-column>
        <el-table-column :label="$t('inventory.location')" prop="location" />
        <el-table-column :label="$t('common.actions')" width="120">
          <template #default>
            <el-button type="primary" size="small" @click="router.push({ name: 'purchaseCreate' })">{{ $t('inventory.reorder') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useInventoryStore } from '../../../stores/sales-inventory.js'
import { useProductStore } from '../../../stores/sales-product.js'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, PieChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'

use([CanvasRenderer, BarChart, PieChart, GridComponent, TooltipComponent, LegendComponent])

const { t } = useI18n()
const router = useRouter()
const inventoryStore = useInventoryStore()
const productStore = useProductStore()

inventoryStore.fetchInventory()

const invStats = computed(() => [
  { key: 'total', label: t('inventory.totalItems'), value: inventoryStore.inventory.length, color: '#0d47a1' },
  { key: 'low', label: t('inventory.lowStock'), value: inventoryStore.lowStockItems.length, color: '#f56c6c', onClick: () => router.push({ name: 'expiryManagement' }) },
  { key: 'expiring', label: t('inventory.expiringSoon'), value: inventoryStore.expiringItems.length, color: '#e6a23c', onClick: () => router.push({ name: 'expiryManagement' }) },
  { key: 'expired', label: t('inventory.expired'), value: inventoryStore.expiredItems.length, color: '#f56c6c' }
])

const stockBarOption = computed(() => {
  const items = inventoryStore.inventory
  const productNames = items.map(i => {
    const p = productStore.getById(i.productId)
    return p ? p.nameCn.substring(0, 8) : i.productId
  })
  return {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '10%', containLabel: true },
    xAxis: { type: 'category', data: productNames, axisLabel: { rotate: 30, fontSize: 10 } },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: items.map(i => i.quantity), itemStyle: { color: '#0d47a1' } }]
  }
})

const categoryPieOption = computed(() => ({
  tooltip: { trigger: 'item' },
  legend: { orient: 'vertical', right: 10 },
  series: [{
    type: 'pie',
    radius: ['40%', '70%'],
    data: [
      { value: 2350, name: t('product.categories.hf') },
      { value: 2350, name: t('product.categories.etchant') },
      { value: 225, name: t('product.categories.photoresist') },
      { value: 2415, name: t('product.categories.other') }
    ]
  }]
}))
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { font-size: 20px; font-weight: 600; }
.stat-val { font-size: 32px; font-weight: bold; }
.stat-lab { font-size: 12px; color: #909399; margin-top: 4px; }
</style>
