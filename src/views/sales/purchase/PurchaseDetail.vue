<template>
  <div>
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:12px">
        <el-button text :icon="'ArrowLeft'" @click="router.back()">{{ $t('common.back') }}</el-button>
        <h2>{{ order?.poNumber }}</h2>
        <StatusBadge v-if="order" :status="order.status" />
      </div>
      <div>
        <el-button v-if="order?.status === 'draft'" type="success" @click="approve">{{ $t('common.approve') }}</el-button>
        <el-button :icon="'Printer'">{{ $t('common.print') }}</el-button>
      </div>
    </div>

    <div v-if="order">
      <!-- Approval Flow -->
      <el-card style="margin-bottom:16px">
        <template #header><span>{{ $t('purchase.approvalFlow') }}</span></template>
        <ApprovalFlow :order="order" />
      </el-card>

      <el-row :gutter="16">
        <el-col :span="14">
          <!-- PO Header -->
          <el-card style="margin-bottom:16px">
            <template #header><span>{{ $t('purchase.poInfo') }}</span></template>
            <el-descriptions :column="2" border size="small">
              <el-descriptions-item :label="$t('purchase.poNumber')">{{ order.poNumber }}</el-descriptions-item>
              <el-descriptions-item :label="$t('nav.suppliers')">{{ supplierName }}</el-descriptions-item>
              <el-descriptions-item :label="$t('purchase.deliveryTerms')">{{ order.deliveryTerms }}</el-descriptions-item>
              <el-descriptions-item :label="$t('purchase.paymentTerms')">{{ order.paymentTerms }}</el-descriptions-item>
              <el-descriptions-item :label="$t('purchase.shippingMethod')">{{ order.shippingMethod }}</el-descriptions-item>
              <el-descriptions-item :label="$t('purchase.eta')">{{ formatDate(order.eta) }}</el-descriptions-item>
              <el-descriptions-item v-if="order.trackingNumber" :label="$t('logistics.trackingNo')">{{ order.trackingNumber }}</el-descriptions-item>
              <el-descriptions-item v-if="order.notes" :label="$t('common.notes')" :span="2">{{ order.notes }}</el-descriptions-item>
            </el-descriptions>
          </el-card>

          <!-- Line Items -->
          <el-card style="margin-bottom:16px">
            <template #header><span>{{ $t('purchase.lineItems') }}</span></template>
            <OrderItemTable :items="order.items" :currency="order.currency" />
          </el-card>
        </el-col>

        <el-col :span="10">
          <!-- Timeline -->
          <el-card style="margin-bottom:16px">
            <template #header><span>{{ $t('purchase.orderTimeline') }}</span></template>
            <OrderTimeline :order="order" type="purchase" />
          </el-card>

          <!-- Documents -->
          <el-card>
            <template #header><span>{{ $t('common.attachments') }}</span></template>
            <div v-for="doc in docList" :key="doc" style="padding:6px 0">
              <el-link type="primary" :icon="'Document'">{{ doc }}</el-link>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <el-empty v-else :description="$t('common.noData')" />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePurchaseStore } from '../../../stores/sales-purchase.js'
import { useSupplierStore } from '../../../stores/sales-supplier.js'
import { formatDate } from '../../../utils/sales-helpers.js'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import StatusBadge from '../../../components/common/StatusBadge.vue'
import OrderTimeline from '../../../components/sales/order/OrderTimeline.vue'
import OrderItemTable from '../../../components/sales/order/OrderItemTable.vue'
import ApprovalFlow from '../../../components/sales/order/ApprovalFlow.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const purchaseStore = usePurchaseStore()
const supplierStore = useSupplierStore()

const order = computed(() => purchaseStore.getById(route.params.id))
const supplierName = computed(() => supplierStore.getById(order.value?.supplierId)?.name || '')
const docList = computed(() => {
  const docs = []
  if (order.value) {
    docs.push(order.value.poNumber + '-PO.pdf')
    if (order.value.status !== 'draft') docs.push(order.value.poNumber + '-Invoice.pdf')
    if (['shipped', 'received', 'closed'].includes(order.value.status)) docs.push(order.value.poNumber + '-PackingList.pdf')
  }
  return docs
})

function approve() {
  purchaseStore.updateStatus(order.value.id, 'approved')
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
