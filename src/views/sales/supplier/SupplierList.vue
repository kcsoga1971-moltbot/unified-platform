<template>
  <div>
    <div class="page-header">
      <h2>{{ $t('nav.suppliers') }}</h2>
      <el-button type="primary" :icon="'Plus'">{{ $t('supplier.addSupplier') }}</el-button>
    </div>

    <el-card style="margin-bottom:16px">
      <el-row :gutter="16">
        <el-col :span="6"><el-input v-model="search" :placeholder="$t('common.search')" clearable /></el-col>
        <el-col :span="4">
          <el-select v-model="filterCountry" :placeholder="$t('common.country')" clearable>
            <el-option :label="$t('country.KR')" value="KR" />
            <el-option :label="$t('country.JP')" value="JP" />
            <el-option :label="$t('country.TW')" value="TW" />
            <el-option :label="$t('country.CN')" value="CN" />
          </el-select>
        </el-col>
        <el-col :span="4"><el-button @click="resetFilters">{{ $t('common.reset') }}</el-button></el-col>
      </el-row>
    </el-card>

    <el-card>
      <el-table :data="filteredSuppliers" v-loading="loading" stripe @row-click="openDetail">
        <el-table-column :label="$t('supplier.name')" min-width="180">
          <template #default="{ row }">
            <div>{{ row.name }}</div>
            <div style="font-size:12px;color:#909399">{{ row.nameCn }}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.country')" width="100">
          <template #default="{ row }"><CountryFlag :code="row.country" :showName="true" /></template>
        </el-table-column>
        <el-table-column :label="$t('supplier.rating')" width="160">
          <template #default="{ row }">
            <el-rate :model-value="row.rating" disabled :max="5" size="small" />
          </template>
        </el-table-column>
        <el-table-column :label="$t('supplier.paymentTerms')" prop="paymentTerms" width="110" />
        <el-table-column :label="$t('purchase.leadTime')" width="90">
          <template #default="{ row }">{{ row.leadTimeDays }}{{ $t('inventory.days') }}</template>
        </el-table-column>
        <el-table-column :label="$t('common.status')" width="90">
          <template #default="{ row }"><StatusBadge :status="row.status" /></template>
        </el-table-column>
        <el-table-column :label="$t('common.actions')" width="130" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" size="small" @click.stop="openDetail(row)">{{ $t('common.details') }}</el-button>
            <el-button text type="warning" size="small" @click.stop="openEval(row)">{{ $t('supplier.evaluation') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSupplierStore } from '../../../stores/sales-supplier.js'
import CountryFlag from '../../../components/common/CountryFlag.vue'
import StatusBadge from '../../../components/common/StatusBadge.vue'

const router = useRouter()
const supplierStore = useSupplierStore()
const search = ref('')
const filterCountry = ref('')
const loading = ref(false)

const filteredSuppliers = computed(() => {
  return supplierStore.suppliers.filter(s => {
    if (search.value && !s.name.toLowerCase().includes(search.value.toLowerCase()) && !s.nameCn?.includes(search.value)) return false
    if (filterCountry.value && s.country !== filterCountry.value) return false
    return true
  })
})

function resetFilters() { search.value = ''; filterCountry.value = '' }
function openDetail(row) { router.push({ name: 'supplierDetail', params: { id: row.id } }) }
function openEval(row) { router.push({ name: 'supplierEvaluation', params: { id: row.id } }) }

onMounted(() => supplierStore.fetchSuppliers())
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { font-size: 20px; font-weight: 600; }
</style>
