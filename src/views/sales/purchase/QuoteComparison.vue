<template>
  <div>
    <div class="page-header">
      <h2>{{ $t('nav.purchaseInquiry') }}</h2>
      <el-button type="primary" @click="createPO">{{ $t('purchase.createPO') }}</el-button>
    </div>

    <el-card style="margin-bottom:16px">
      <template #header><span>{{ $t('purchase.quoteComparison') }}: {{ currentRFQ?.productName }}</span></template>
      <el-descriptions :column="3" border size="small">
        <el-descriptions-item :label="$t('product.name')">{{ currentRFQ?.productName }}</el-descriptions-item>
        <el-descriptions-item :label="$t('common.quantity')">{{ currentRFQ?.requestQty }} {{ currentRFQ?.unit }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card>
      <el-table :data="currentRFQ?.quotes || []" border>
        <el-table-column :label="$t('nav.suppliers')" min-width="180">
          <template #default="{ row }">
            <div>{{ row.supplierName }}</div>
            <el-rate :model-value="row.rating" disabled :max="5" size="small" />
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.unitPrice')" width="140">
          <template #default="{ row }">
            <CurrencyDisplay :amount="row.unitPrice" :currency="row.currency" />
            <div style="font-size:11px;color:#909399">≈ ¥{{ row.totalCNY?.toFixed(0) }}/{{ currentRFQ?.unit }}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('purchase.moq')" width="80">
          <template #default="{ row }">{{ row.moq }} {{ currentRFQ?.unit }}</template>
        </el-table-column>
        <el-table-column :label="$t('purchase.leadTime')" width="100">
          <template #default="{ row }">{{ row.leadTimeDays }} {{ $t('inventory.days') }}</template>
        </el-table-column>
        <el-table-column :label="$t('purchase.paymentTerms')" prop="paymentTerms" width="110" />
        <el-table-column :label="$t('purchase.totalCNY')" width="130">
          <template #default="{ row }">
            <span :class="{ 'best-price': row.totalCNY === minPrice }">
              ¥{{ (row.totalCNY * currentRFQ?.requestQty).toLocaleString() }}
            </span>
            <el-tag v-if="row.totalCNY === minPrice" type="success" size="small" style="margin-left:4px">{{ $t('purchase.bestPrice') }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.actions')" width="100">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="selectQuote(row)">{{ $t('purchase.selectBest') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePurchaseStore } from '../../../stores/sales-purchase.js'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import CurrencyDisplay from '../../../components/common/CurrencyDisplay.vue'

const { t } = useI18n()
const router = useRouter()
const purchaseStore = usePurchaseStore()

const currentRFQ = computed(() => purchaseStore.quoteComparisons[0])
const minPrice = computed(() => {
  const quotes = currentRFQ.value?.quotes || []
  return Math.min(...quotes.map(q => q.totalCNY))
})

function selectQuote(row) {
  ElMessage.success(t('purchase.quoteSelected') + ': ' + row.supplierName)
}

function createPO() {
  router.push({ name: 'purchaseCreate' })
}
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { font-size: 20px; font-weight: 600; }
.best-price { color: #67c23a; font-weight: bold; }
</style>
