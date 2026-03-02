<template>
  <el-card class="product-card" :body-style="{ padding: '16px' }" shadow="hover">
    <div class="product-header">
      <div class="product-name">
        <div class="name-cn">{{ product.nameCn }}</div>
        <div class="name-en">{{ product.nameEn }}</div>
      </div>
      <HazardBadge v-for="h in product.ghsHazards" :key="h" :hazard="h" />
    </div>
    <div class="product-meta">
      <el-tag size="small" type="info">CAS: {{ product.casNumber }}</el-tag>
      <el-tag size="small">{{ $t('product.shelfLife') }}: {{ product.shelfLife }}{{ $t('common.months') }}</el-tag>
    </div>
    <div class="product-stock">
      <span>{{ $t('inventory.currentStock') }}: <strong>{{ product.currentStock }} {{ product.stockUnit }}</strong></span>
    </div>
  </el-card>
</template>

<script setup>
import HazardBadge from '../compliance/HazardBadge.vue'

defineProps({
  product: { type: Object, required: true }
})
</script>

<style scoped>
.product-card { margin-bottom: 12px; cursor: pointer; transition: box-shadow 0.2s; }
.product-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
.product-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; flex-wrap: wrap; gap: 4px; }
.name-cn { font-size: 15px; font-weight: 600; }
.name-en { font-size: 12px; color: #909399; }
.product-meta { display: flex; gap: 8px; flex-wrap: wrap; margin: 8px 0; }
.product-stock { font-size: 13px; color: #606266; }
</style>
