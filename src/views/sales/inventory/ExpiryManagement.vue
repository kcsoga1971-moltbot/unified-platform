<template>
  <div>
    <div class="page-header">
      <h2>{{ $t('nav.expiryMgmt') }}</h2>
    </div>

    <!-- Filter tabs -->
    <el-card style="margin-bottom:16px">
      <el-radio-group v-model="filterDays">
        <el-radio-button :value="30">{{ $t('compliance.expiryAlert.30days') }}</el-radio-button>
        <el-radio-button :value="60">{{ $t('compliance.expiryAlert.60days') }}</el-radio-button>
        <el-radio-button :value="90">{{ $t('compliance.expiryAlert.90days') }}</el-radio-button>
        <el-radio-button :value="999">{{ $t('common.all') }}</el-radio-button>
      </el-radio-group>
    </el-card>

    <el-card>
      <el-table :data="filteredItems" :row-class-name="rowClass">
        <el-table-column :label="$t('purchase.lotNumber')" prop="lotNumber" width="160" />
        <el-table-column :label="$t('product.name')" width="180">
          <template #default="{ row }">{{ getProductName(row.productId) }}</template>
        </el-table-column>
        <el-table-column :label="$t('common.quantity')" width="110">
          <template #default="{ row }">{{ row.quantity }} {{ row.unit }}</template>
        </el-table-column>
        <el-table-column :label="$t('purchase.mfgDate')" prop="mfgDate" width="110" />
        <el-table-column :label="$t('purchase.expiryDate')" prop="expiryDate" width="110" />
        <el-table-column :label="$t('inventory.daysUntilExpiry')" width="120">
          <template #default="{ row }">
            <el-tag :type="row.daysLeft < 30 ? 'danger' : row.daysLeft < 90 ? 'warning' : 'success'" size="small">
              {{ row.daysLeft }} {{ $t('inventory.days') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('inventory.location')" prop="location" />
        <el-table-column :label="$t('common.actions')" width="160">
          <template #default="{ row }">
            <el-dropdown size="small">
              <el-button size="small" type="warning">
                {{ $t('common.actions') }}<el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>{{ $t('inventory.action.fifo') }}</el-dropdown-item>
                  <el-dropdown-item>{{ $t('inventory.action.discount') }}</el-dropdown-item>
                  <el-dropdown-item divided style="color:#f56c6c">{{ $t('inventory.action.disposal') }}</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useInventoryStore } from '../../../stores/sales-inventory.js'
import { useProductStore } from '../../../stores/sales-product.js'
import { ArrowDown } from '@element-plus/icons-vue'
import dayjs from 'dayjs'

const inventoryStore = useInventoryStore()
const productStore = useProductStore()
const filterDays = ref(90)

const allExpiring = computed(() => {
  return inventoryStore.inventory
    .map(item => ({ ...item, daysLeft: dayjs(item.expiryDate).diff(dayjs(), 'day') }))
    .filter(item => item.daysLeft <= 365)
    .sort((a, b) => a.daysLeft - b.daysLeft)
})

const filteredItems = computed(() => {
  return allExpiring.value.filter(item => item.daysLeft <= filterDays.value)
})

function getProductName(id) {
  return productStore.getById(id)?.nameCn || id
}

function rowClass({ row }) {
  if (row.daysLeft < 30) return 'danger-row'
  if (row.daysLeft < 90) return 'warning-row'
  return ''
}

onMounted(() => {
  inventoryStore.fetchInventory()
  productStore.fetchProducts()
})
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { font-size: 20px; font-weight: 600; }
</style>
