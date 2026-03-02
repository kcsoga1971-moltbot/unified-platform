<template>
  <div>
    <div class="page-header">
      <h2>{{ $t('nav.customers') }}</h2>
      <el-button type="primary" :icon="'Plus'">{{ $t('customer.addCustomer') }}</el-button>
    </div>

    <el-card style="margin-bottom:16px">
      <el-row :gutter="16">
        <el-col :span="6"><el-input v-model="search" :placeholder="$t('common.search')" clearable /></el-col>
        <el-col :span="4">
          <el-select v-model="filterCountry" :placeholder="$t('common.country')" clearable>
            <el-option :label="$t('country.TW')" value="TW" />
            <el-option :label="$t('country.CN')" value="CN" />
          </el-select>
        </el-col>
        <el-col :span="4"><el-button @click="resetFilters">{{ $t('common.reset') }}</el-button></el-col>
      </el-row>
    </el-card>

    <el-card>
      <el-table :data="filteredCustomers" stripe @row-click="openDetail">
        <el-table-column :label="$t('customer.name')" min-width="150">
          <template #default="{ row }">
            <div>{{ row.name }}</div>
            <div style="font-size:12px;color:#909399">{{ row.nameCn }}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.country')" width="100">
          <template #default="{ row }"><CountryFlag :code="row.country" :showName="true" /></template>
        </el-table-column>
        <el-table-column :label="$t('customer.industry')" prop="industry" min-width="120" />
        <el-table-column :label="$t('customer.creditLimit')" width="130">
          <template #default="{ row }"><CurrencyDisplay :amount="row.creditLimit" currency="CNY" /></template>
        </el-table-column>
        <el-table-column :label="$t('customer.arBalance')" width="130">
          <template #default="{ row }">
            <CurrencyDisplay :amount="row.arBalance" currency="CNY" :color="row.arBalance / row.creditLimit > 0.8 ? '#f56c6c' : '#303133'" />
          </template>
        </el-table-column>
        <el-table-column :label="$t('customer.paymentTerms')" prop="paymentTerms" width="100" />
        <el-table-column :label="$t('common.status')" width="90">
          <template #default="{ row }"><StatusBadge :status="row.status" /></template>
        </el-table-column>
        <el-table-column :label="$t('common.actions')" width="100" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" size="small" @click.stop="openDetail(row)">{{ $t('common.details') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCustomerStore } from '../../../stores/sales-customer.js'
import CountryFlag from '../../../components/common/CountryFlag.vue'
import CurrencyDisplay from '../../../components/common/CurrencyDisplay.vue'
import StatusBadge from '../../../components/common/StatusBadge.vue'

const router = useRouter()
const customerStore = useCustomerStore()
const search = ref('')
const filterCountry = ref('')

const filteredCustomers = computed(() => {
  return customerStore.customers.filter(c => {
    if (search.value && !c.name.toLowerCase().includes(search.value.toLowerCase()) && !c.nameCn?.includes(search.value)) return false
    if (filterCountry.value && c.country !== filterCountry.value) return false
    return true
  })
})

function resetFilters() { search.value = ''; filterCountry.value = '' }
function openDetail(row) { router.push({ name: 'customerDetail', params: { id: row.id } }) }
onMounted(() => customerStore.fetchCustomers())
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { font-size: 20px; font-weight: 600; }
</style>
