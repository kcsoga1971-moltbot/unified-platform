<template>
  <div>
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:12px">
        <el-button text :icon="'ArrowLeft'" @click="router.back()">{{ $t('common.back') }}</el-button>
        <h2>{{ product?.nameCn }}</h2>
      </div>
    </div>

    <div v-if="product">
      <el-row :gutter="16">
        <el-col :span="16">
          <el-card>
            <template #header><span>{{ $t('product.detail') }}</span></template>
            <el-descriptions :column="2" border>
              <el-descriptions-item :label="$t('product.nameCn')">{{ product.nameCn }}</el-descriptions-item>
              <el-descriptions-item :label="$t('product.nameEn')">{{ product.nameEn }}</el-descriptions-item>
              <el-descriptions-item :label="$t('product.casNumber')">{{ product.casNumber }}</el-descriptions-item>
              <el-descriptions-item :label="$t('product.category')">{{ $t('product.categories.' + product.category) }}</el-descriptions-item>
              <el-descriptions-item :label="$t('product.shelfLife')">{{ product.shelfLife }} {{ $t('common.months') }}</el-descriptions-item>
              <el-descriptions-item :label="$t('common.status')"><StatusBadge :status="product.status" /></el-descriptions-item>
              <el-descriptions-item :label="$t('product.storageReq')" :span="2">
                {{ $t('product.temperature') }}: {{ product.storageReq?.temperature }} |
                {{ $t('product.humidity') }}: {{ product.storageReq?.humidity }} |
                {{ $t('product.lightSensitive') }}: {{ product.storageReq?.light ? $t('common.yes') : $t('common.no') }}
              </el-descriptions-item>
              <el-descriptions-item :label="$t('product.ghsPictograms')" :span="2">
                <HazardBadge v-for="h in product.ghsHazards" :key="h" :hazard="h" :showLabel="true" />
              </el-descriptions-item>
              <el-descriptions-item :label="$t('common.notes')" :span="2">{{ product.description }}</el-descriptions-item>
            </el-descriptions>
          </el-card>

          <!-- Supplier & Price -->
          <el-card style="margin-top:16px">
            <template #header><span>{{ $t('product.suppliers') }}</span></template>
            <el-table :data="productSuppliers" size="small">
              <el-table-column :label="$t('common.name')" prop="name" />
              <el-table-column :label="$t('common.country')" width="100">
                <template #default="{ row }"><CountryFlag :code="row.country" :showName="true" /></template>
              </el-table-column>
              <el-table-column :label="$t('supplier.rating')" width="80">
                <template #default="{ row }">
                  <el-rate :model-value="row.rating" disabled size="small" :max="5" />
                </template>
              </el-table-column>
              <el-table-column :label="$t('common.actions')" width="80">
                <template #default="{ row }">
                  <el-button text type="primary" size="small" @click="router.push({ name: 'supplierDetail', params: { id: row.id } })">{{ $t('common.view') }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card>
            <template #header><span>{{ $t('inventory.currentStock') }}</span></template>
            <div style="text-align:center;padding:20px">
              <div style="font-size:36px;font-weight:bold;color:#0d47a1">{{ product.currentStock }}</div>
              <div style="color:#909399">{{ product.stockUnit }}</div>
              <el-tag :type="product.currentStock < product.safetyStock ? 'danger' : 'success'" style="margin-top:8px">
                {{ $t('inventory.safetyStock') }}: {{ product.safetyStock }}
              </el-tag>
            </div>
          </el-card>
          <MSDSViewer :msds="productMSDS" style="margin-top:16px" />
        </el-col>
      </el-row>
    </div>

    <el-empty v-else :description="$t('common.noData')" />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '../../../stores/sales-product.js'
import { useSupplierStore } from '../../../stores/sales-supplier.js'
import { useComplianceStore } from '../../../stores/sales-compliance.js'
import StatusBadge from '../../../components/common/StatusBadge.vue'
import HazardBadge from '../../../components/sales/compliance/HazardBadge.vue'
import CountryFlag from '../../../components/common/CountryFlag.vue'
import MSDSViewer from '../../../components/sales/product/MSDSViewer.vue'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const supplierStore = useSupplierStore()
const complianceStore = useComplianceStore()

const product = computed(() => productStore.getById(route.params.id))
const productSuppliers = computed(() => supplierStore.suppliers.filter(s => product.value?.supplierId?.includes(s.id)))
const productMSDS = computed(() => complianceStore.msds?.find(m => m.productId === route.params.id))

onMounted(() => {
  productStore.fetchProducts()
  supplierStore.fetchSuppliers()
  complianceStore.fetchLicenses()
})
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { font-size: 20px; font-weight: 600; }
</style>
