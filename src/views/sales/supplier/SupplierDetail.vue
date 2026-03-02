<template>
  <div>
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:12px">
        <el-button text :icon="'ArrowLeft'" @click="router.back()">{{ $t('common.back') }}</el-button>
        <h2>{{ supplier?.name }}</h2>
      </div>
      <el-button type="primary" @click="router.push({ name: 'supplierEvaluation', params: { id: supplier?.id } })">{{ $t('supplier.evaluation') }}</el-button>
    </div>

    <div v-if="supplier">
      <el-row :gutter="16">
        <el-col :span="14">
          <el-card>
            <template #header><span>{{ $t('common.company') }}{{ $t('common.details') }}</span></template>
            <el-descriptions :column="2" border>
              <el-descriptions-item :label="$t('supplier.name')">{{ supplier.name }}</el-descriptions-item>
              <el-descriptions-item :label="$t('supplier.nameCn')">{{ supplier.nameCn }}</el-descriptions-item>
              <el-descriptions-item :label="$t('common.country')"><CountryFlag :code="supplier.country" :showName="true" /></el-descriptions-item>
              <el-descriptions-item :label="$t('supplier.rating')">
                <el-rate :model-value="supplier.rating" disabled :max="5" />
              </el-descriptions-item>
              <el-descriptions-item :label="$t('common.address')" :span="2">{{ supplier.address }}</el-descriptions-item>
              <el-descriptions-item :label="$t('common.contact')">{{ supplier.contactPerson }}</el-descriptions-item>
              <el-descriptions-item :label="$t('common.phone')">{{ supplier.phone }}</el-descriptions-item>
              <el-descriptions-item :label="$t('common.email')">{{ supplier.email }}</el-descriptions-item>
              <el-descriptions-item :label="$t('supplier.paymentTerms')">{{ supplier.paymentTerms }}</el-descriptions-item>
              <el-descriptions-item :label="$t('purchase.deliveryTerms')">{{ supplier.deliveryTerms }}</el-descriptions-item>
              <el-descriptions-item :label="$t('purchase.leadTime')">{{ supplier.leadTimeDays }} {{ $t('inventory.days') }}</el-descriptions-item>
            </el-descriptions>
          </el-card>

          <!-- Scores -->
          <el-card style="margin-top:16px">
            <template #header><span>{{ $t('supplier.evalScores') }}</span></template>
            <el-row>
              <el-col :span="12" v-for="(score, key) in supplier.scores" :key="key">
                <div class="score-item">
                  <span class="score-label">{{ $t('supplier.' + key) }}</span>
                  <el-rate :model-value="score" disabled :max="5" />
                  <span class="score-value">{{ score }}</span>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </el-col>

        <el-col :span="10">
          <el-card>
            <template #header><span>{{ $t('supplier.purchaseHistory') }}</span></template>
            <div style="text-align:center;padding:20px">
              <div style="font-size:28px;font-weight:bold;color:#0d47a1">¥{{ (supplier.totalPurchased / 10000).toFixed(0) }}{{ $t('common.wan') }}</div>
              <div style="color:#909399;margin-top:4px">{{ $t('supplier.totalPurchased') }}</div>
            </div>
            <el-table :data="relatedOrders" size="small">
              <el-table-column :label="$t('purchase.poNumber')" prop="poNumber" />
              <el-table-column :label="$t('common.amount')">
                <template #default="{ row }">{{ row.currency }} {{ row.totalAmount?.toLocaleString() }}</template>
              </el-table-column>
              <el-table-column :label="$t('common.status')">
                <template #default="{ row }"><StatusBadge :status="row.status" /></template>
              </el-table-column>
            </el-table>
          </el-card>
          <el-card style="margin-top:16px">
            <template #header><span>{{ $t('supplier.notes') }}</span></template>
            <p style="color:#606266;line-height:1.6">{{ supplier.notes }}</p>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSupplierStore } from '../../../stores/sales-supplier.js'
import { usePurchaseStore } from '../../../stores/sales-purchase.js'
import CountryFlag from '../../../components/common/CountryFlag.vue'
import StatusBadge from '../../../components/common/StatusBadge.vue'

const route = useRoute()
const router = useRouter()
const supplierStore = useSupplierStore()
const purchaseStore = usePurchaseStore()

const supplier = computed(() => supplierStore.getById(route.params.id))
const relatedOrders = computed(() => purchaseStore.purchaseOrders.filter(o => o.supplierId === route.params.id))

onMounted(() => { supplierStore.fetchSuppliers(); purchaseStore.fetchOrders() })
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { font-size: 20px; font-weight: 600; }
.score-item { display: flex; align-items: center; gap: 8px; padding: 8px 0; }
.score-label { width: 60px; color: #606266; font-size: 13px; }
.score-value { color: #e6a23c; font-weight: bold; }
</style>
