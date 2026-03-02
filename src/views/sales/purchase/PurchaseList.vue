<template>
  <div>
    <div class="page-header">
      <h2>{{ $t('nav.purchaseOrders') }}</h2>
      <el-button type="primary" :icon="'Plus'" @click="router.push({ name: 'purchaseCreate' })">{{ $t('common.create') }}</el-button>
    </div>

    <!-- Filters -->
    <el-card style="margin-bottom:16px">
      <el-row :gutter="12">
        <el-col :span="5"><el-input v-model="search" :placeholder="$t('common.search')" clearable /></el-col>
        <el-col :span="4">
          <el-select v-model="filterStatus" :placeholder="$t('common.status')" clearable>
            <el-option v-for="s in statusOptions" :key="s.value" :label="$t('purchase.status.' + s.value)" :value="s.value" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="filterSupplier" :placeholder="$t('nav.suppliers')" clearable>
            <el-option v-for="s in supplierStore.suppliers" :key="s.id" :label="s.name" :value="s.id" />
          </el-select>
        </el-col>
        <el-col :span="4"><el-button @click="resetFilters">{{ $t('common.reset') }}</el-button></el-col>
      </el-row>
    </el-card>

    <el-card>
      <el-table :data="filteredOrders" stripe @row-click="openDetail">
        <el-table-column :label="$t('purchase.poNumber')" prop="poNumber" width="150" />
        <el-table-column :label="$t('nav.suppliers')" width="200">
          <template #default="{ row }">{{ getSupplierName(row.supplierId) }}</template>
        </el-table-column>
        <el-table-column :label="$t('common.amount')" width="150">
          <template #default="{ row }"><CurrencyDisplay :amount="row.totalAmount" :currency="row.currency" /></template>
        </el-table-column>
        <el-table-column :label="$t('common.currency')" prop="currency" width="80" />
        <el-table-column :label="$t('common.status')" width="100">
          <template #default="{ row }"><StatusBadge :status="row.status" /></template>
        </el-table-column>
        <el-table-column :label="$t('purchase.eta')" width="110">
          <template #default="{ row }">{{ formatDate(row.eta) }}</template>
        </el-table-column>
        <el-table-column :label="$t('common.createdAt')" width="120">
          <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column :label="$t('common.actions')" width="120" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" size="small" @click.stop="openDetail(row)">{{ $t('common.details') }}</el-button>
            <el-button text size="small" v-if="row.status === 'draft'" @click.stop="approveOrder(row)">{{ $t('common.approve') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePurchaseStore } from '../../../stores/sales-purchase.js'
import { useSupplierStore } from '../../../stores/sales-supplier.js'
import { formatDate } from '../../../utils/sales-helpers.js'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import StatusBadge from '../../../components/common/StatusBadge.vue'
import CurrencyDisplay from '../../../components/common/CurrencyDisplay.vue'

const { t } = useI18n()
const router = useRouter()
const purchaseStore = usePurchaseStore()
const supplierStore = useSupplierStore()

const search = ref('')
const filterStatus = ref('')
const filterSupplier = ref('')

const statusOptions = [
  { value: 'draft' }, { value: 'approved' }, { value: 'ordered' },
  { value: 'shipped' }, { value: 'received' }, { value: 'closed' }
]

const filteredOrders = computed(() => {
  return purchaseStore.purchaseOrders.filter(o => {
    if (search.value && !o.poNumber.includes(search.value)) return false
    if (filterStatus.value && o.status !== filterStatus.value) return false
    if (filterSupplier.value && o.supplierId !== filterSupplier.value) return false
    return true
  })
})

function getSupplierName(id) {
  return supplierStore.getById(id)?.name || id
}

function resetFilters() {
  search.value = ''
  filterStatus.value = ''
  filterSupplier.value = ''
}

function openDetail(row) {
  router.push({ name: 'purchaseDetail', params: { id: row.id } })
}

function approveOrder(row) {
  purchaseStore.updateStatus(row.id, 'approved')
  ElMessage.success(t('common.operationSuccess'))
}

onMounted(() => {
  purchaseStore.fetchOrders()
  supplierStore.fetchSuppliers()
})
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { font-size: 20px; font-weight: 600; }
</style>
