<template>
  <el-card>
    <template #header>
      <span>{{ $t('dashboard.lowStockAlerts') }}</span>
    </template>
    <div v-if="alerts.length === 0" class="no-alerts">
      <el-icon color="#67C23A" size="24"><CircleCheckFilled /></el-icon>
      <p>{{ $t('inventory.allNormal') }}</p>
    </div>
    <el-table v-else :data="alerts" size="small">
      <el-table-column :label="$t('common.name')" prop="productName" />
      <el-table-column :label="$t('inventory.currentStock')" prop="quantity" width="100" />
      <el-table-column :label="$t('inventory.daysUntilExpiry')" width="120">
        <template #default="{ row }">
          <el-tag :type="row.daysLeft < 30 ? 'danger' : 'warning'" size="small">
            {{ row.daysLeft }} {{ $t('inventory.days') }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import { computed } from 'vue'
import { useInventoryStore } from '../../../stores/sales-inventory.js'
import { useProductStore } from '../../../stores/sales-product.js'

const inventoryStore = useInventoryStore()
const productStore = useProductStore()

const alerts = computed(() => {
  return inventoryStore.expiringItems.slice(0, 5).map(item => {
    const product = productStore.getById(item.productId)
    return { ...item, productName: product?.nameCn || item.productId }
  })
})
</script>

<style scoped>
.no-alerts { text-align: center; padding: 20px; color: #909399; }
</style>
