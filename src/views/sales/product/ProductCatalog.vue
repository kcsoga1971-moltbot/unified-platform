<template>
  <div>
    <div class="page-header">
      <h2>{{ $t('nav.productCatalog') }}</h2>
    </div>

    <!-- Filters -->
    <el-card style="margin-bottom:16px">
      <el-row :gutter="16" align="middle">
        <el-col :span="6">
          <el-input v-model="search" :placeholder="$t('common.search')" clearable :prefix-icon="'Search'" />
        </el-col>
        <el-col :span="5">
          <el-select v-model="filterCategory" :placeholder="$t('product.category')" clearable>
            <el-option v-for="c in PRODUCT_CATEGORIES" :key="c.value" :label="$t('product.categories.' + c.value)" :value="c.value" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="filterStatus" :placeholder="$t('common.status')" clearable>
            <el-option :label="$t('common.statusValues.active')" value="active" />
            <el-option :label="$t('common.statusValues.inactive')" value="inactive" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button @click="resetFilters">{{ $t('common.reset') }}</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- Table -->
    <el-card>
      <el-table :data="filteredProducts" v-loading="loading" stripe @row-click="openDetail">
        <el-table-column :label="$t('product.name')" min-width="200">
          <template #default="{ row }">
            <div class="product-name-cell">
              <div class="name-cn">{{ row.nameCn }}</div>
              <div class="name-en">{{ row.nameEn }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('product.casNumber')" prop="casNumber" width="140" />
        <el-table-column :label="$t('product.category')" width="110">
          <template #default="{ row }">{{ $t('product.categories.' + row.category) }}</template>
        </el-table-column>
        <el-table-column :label="$t('product.hazardLevel')" width="100">
          <template #default="{ row }">
            <el-tag :type="row.hazardLevel >= 3 ? 'danger' : row.hazardLevel === 2 ? 'warning' : 'success'" size="small">
              L{{ row.hazardLevel }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('product.ghsHazards')" min-width="150">
          <template #default="{ row }">
            <HazardBadge v-for="h in row.ghsHazards" :key="h" :hazard="h" />
          </template>
        </el-table-column>
        <el-table-column :label="$t('product.shelfLife')" width="90">
          <template #default="{ row }">{{ row.shelfLife }}{{ $t('common.months') }}</template>
        </el-table-column>
        <el-table-column :label="$t('inventory.currentStock')" width="120">
          <template #default="{ row }">
            <el-tag :type="row.currentStock < row.safetyStock ? 'danger' : 'success'" size="small">
              {{ row.currentStock }} {{ row.stockUnit }}
            </el-tag>
          </template>
        </el-table-column>
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
import { useProductStore } from '../../../stores/sales-product.js'
import { PRODUCT_CATEGORIES } from '../../../utils/sales-constants.js'
import StatusBadge from '../../../components/common/StatusBadge.vue'
import HazardBadge from '../../../components/sales/compliance/HazardBadge.vue'

const router = useRouter()
const productStore = useProductStore()
const search = ref('')
const filterCategory = ref('')
const filterStatus = ref('')
const loading = ref(false)

const filteredProducts = computed(() => {
  return productStore.products.filter(p => {
    if (search.value && !p.nameCn.includes(search.value) && !p.nameEn.toLowerCase().includes(search.value.toLowerCase()) && !p.casNumber.includes(search.value)) return false
    if (filterCategory.value && p.category !== filterCategory.value) return false
    if (filterStatus.value && p.status !== filterStatus.value) return false
    return true
  })
})

function resetFilters() {
  search.value = ''
  filterCategory.value = ''
  filterStatus.value = ''
}

function openDetail(row) {
  router.push({ name: 'productDetail', params: { id: row.id } })
}

onMounted(() => productStore.fetchProducts())
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { font-size: 20px; font-weight: 600; }
.product-name-cell { cursor: pointer; }
.name-cn { font-weight: 500; }
.name-en { font-size: 12px; color: #909399; }
</style>
