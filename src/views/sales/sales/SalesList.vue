<template>
  <div>
    <div class="page-header">
      <h2>{{ $t('nav.salesOrders') }}</h2>
      <el-button type="primary" :icon="'Plus'" @click="router.push({ name: 'salesCreate' })">{{ $t('common.create') }}</el-button>
    </div>

    <el-card style="margin-bottom:16px">
      <el-row :gutter="12">
        <el-col :span="5"><el-input v-model="search" :placeholder="$t('common.search')" clearable /></el-col>
        <el-col :span="4">
          <el-select v-model="filterStatus" :placeholder="$t('common.status')" clearable>
            <el-option v-for="s in salesStatuses" :key="s" :label="$t('sales.status.' + s)" :value="s" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="filterCustomer" :placeholder="$t('nav.customers')" clearable>
            <el-option v-for="c in customerStore.customers" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-col>
        <el-col :span="3"><el-button @click="resetFilters">{{ $t('common.reset') }}</el-button></el-col>
      </el-row>
    </el-card>

    <el-card>
      <el-table :data="filteredOrders" stripe @row-click="openDetail">
        <el-table-column :label="$t('sales.soNumber')" prop="soNumber" width="150" />
        <el-table-column :label="$t('sales.customer')" width="150">
          <template #default="{ row }">{{ getCustomerName(row.customerId) }}</template>
        </el-table-column>
        <el-table-column :label="$t('common.amount')" width="150">
          <template #default="{ row }"><CurrencyDisplay :amount="row.totalAmount" :currency="row.currency" /></template>
        </el-table-column>
        <el-table-column :label="$t('common.currency')" prop="currency" width="70" />
        <el-table-column :label="$t('common.status')" width="110">
          <template #default="{ row }"><StatusBadge :status="row.status" /></template>
        </el-table-column>
        <el-table-column :label="$t('sales.shipDate')" width="110">
          <template #default="{ row }">{{ formatDate(row.shipDate) }}</template>
        </el-table-column>
        <el-table-column :label="$t('common.createdAt')" width="120">
          <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column :label="$t('common.actions')" width="130" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" size="small" @click.stop="openDetail(row)">{{ $t('common.details') }}</el-button>
            <el-button v-if="row.status === 'quotation'" text type="success" size="small" @click.stop="confirmOrder(row)">{{ $t('sales.confirm') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSalesStore } from '../../../stores/sales-sales.js'
import { useCustomerStore } from '../../../stores/sales-customer.js'
import { formatDate } from '../../../utils/sales-helpers.js'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import StatusBadge from '../../../components/common/StatusBadge.vue'
import CurrencyDisplay from '../../../components/common/CurrencyDisplay.vue'

const { t } = useI18n()
const router = useRouter()
const salesStore = useSalesStore()
const customerStore = useCustomerStore()

const search = ref('')
const filterStatus = ref('')
const filterCustomer = ref('')

const salesStatuses = ['quotation', 'confirmed', 'processing', 'shipped', 'delivered', 'invoiced', 'paid']

const filteredOrders = computed(() => {
  return salesStore.salesOrders.filter(o => {
    if (search.value && !o.soNumber?.includes(search.value)) return false
    if (filterStatus.value && o.status !== filterStatus.value) return false
    if (filterCustomer.value && o.customerId !== filterCustomer.value) return false
    return true
  })
})

function getCustomerName(id) {
  return customerStore.getById(id)?.name || id
}

function resetFilters() {
  search.value = ''
  filterStatus.value = ''
  filterCustomer.value = ''
}

function openDetail(row) {
  router.push({ name: 'salesDetail', params: { id: row.id } })
}

function confirmOrder(row) {
  salesStore.updateStatus(row.id, 'confirmed')
  ElMessage.success(t('common.operationSuccess'))
}

onMounted(() => {
  salesStore.fetchOrders()
  customerStore.fetchCustomers()
})
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { font-size: 20px; font-weight: 600; }
</style>
