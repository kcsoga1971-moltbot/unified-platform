<template>
  <div>
    <div class="page-header">
      <h2>{{ $t('nav.stockMovement') }}</h2>
    </div>

    <el-card style="margin-bottom:16px">
      <el-row :gutter="12">
        <el-col :span="4">
          <el-select v-model="filterDir" :placeholder="$t('inventory.direction')" clearable>
            <el-option :label="$t('inventory.in')" value="in" />
            <el-option :label="$t('inventory.out')" value="out" />
          </el-select>
        </el-col>
        <el-col :span="5"><el-input v-model="search" :placeholder="$t('common.search')" clearable /></el-col>
        <el-col :span="3"><el-button @click="resetFilters">{{ $t('common.reset') }}</el-button></el-col>
      </el-row>
    </el-card>

    <el-card>
      <el-table :data="filteredMovements" stripe>
        <el-table-column :label="$t('common.date')" width="150">
          <template #default="{ row }">{{ formatDateTime(row.date) }}</template>
        </el-table-column>
        <el-table-column :label="$t('product.name')" prop="productName" min-width="150" />
        <el-table-column :label="$t('inventory.direction')" width="90">
          <template #default="{ row }">
            <el-tag :type="row.direction === 'in' ? 'success' : 'danger'" size="small">
              {{ row.direction === 'in' ? '▲ ' + $t('inventory.in') : '▼ ' + $t('inventory.out') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.quantity')" width="100">
          <template #default="{ row }">{{ row.qty }} {{ row.unit }}</template>
        </el-table-column>
        <el-table-column :label="$t('inventory.reference')" prop="reference" width="160" />
        <el-table-column :label="$t('purchase.lotNumber')" prop="lotNumber" width="140" />
        <el-table-column :label="$t('inventory.operator')" prop="operator" width="100" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useInventoryStore } from '../../../stores/sales-inventory.js'
import { formatDateTime } from '../../../utils/sales-helpers.js'

const inventoryStore = useInventoryStore()
const filterDir = ref('')
const search = ref('')

const filteredMovements = computed(() => {
  return inventoryStore.movements.filter(m => {
    if (filterDir.value && m.direction !== filterDir.value) return false
    if (search.value && !m.productName?.includes(search.value) && !m.reference?.includes(search.value)) return false
    return true
  })
})

function resetFilters() { filterDir.value = ''; search.value = '' }

onMounted(() => inventoryStore.fetchInventory())
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { font-size: 20px; font-weight: 600; }
</style>
