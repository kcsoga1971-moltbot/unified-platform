<template>
  <div>
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:12px">
        <el-button text :icon="'ArrowLeft'" @click="router.back()">{{ $t('common.back') }}</el-button>
        <h2>{{ order?.soNumber }}</h2>
        <StatusBadge v-if="order" :status="order.status" />
      </div>
      <div>
        <el-button v-if="order?.status === 'quotation'" type="success" @click="confirmOrder">{{ $t('sales.confirmOrder') }}</el-button>
        <el-button v-if="order?.status === 'confirmed'" type="warning" @click="shipOrder">{{ $t('sales.shipOrder') }}</el-button>
        <el-button :icon="'Printer'">{{ $t('sales.generatePDF') }}</el-button>
      </div>
    </div>

    <div v-if="order">
      <el-row :gutter="16">
        <el-col :span="14">
          <el-card style="margin-bottom:16px">
            <template #header><span>{{ $t('sales.orderInfo') }}</span></template>
            <el-descriptions :column="2" border size="small">
              <el-descriptions-item :label="$t('sales.soNumber')">{{ order.soNumber }}</el-descriptions-item>
              <el-descriptions-item :label="$t('sales.customer')">{{ customerName }}</el-descriptions-item>
              <el-descriptions-item :label="$t('sales.shipDate')">{{ formatDate(order.shipDate) }}</el-descriptions-item>
              <el-descriptions-item :label="$t('sales.deliveryDate')">{{ formatDate(order.deliveryDate) }}</el-descriptions-item>
              <el-descriptions-item v-if="order.trackingNumber" :label="$t('logistics.trackingNo')">{{ order.trackingNumber }}</el-descriptions-item>
              <el-descriptions-item :label="$t('sales.paymentStatus')">
                <el-tag :type="order.paymentStatus === 'paid' ? 'success' : 'warning'">
                  {{ $t('sales.paymentStatus.' + (order.paymentStatus || 'unpaid')) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item v-if="order.notes" :label="$t('common.notes')" :span="2">{{ order.notes }}</el-descriptions-item>
            </el-descriptions>
          </el-card>

          <el-card>
            <template #header><span>{{ $t('purchase.lineItems') }}</span></template>
            <OrderItemTable :items="order.items" :currency="order.currency" />
          </el-card>
        </el-col>

        <el-col :span="10">
          <el-card style="margin-bottom:16px">
            <template #header><span>{{ $t('purchase.orderTimeline') }}</span></template>
            <OrderTimeline :order="order" type="sales" />
          </el-card>
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
import { useSalesStore } from '../../../stores/sales-sales.js'
import { useCustomerStore } from '../../../stores/sales-customer.js'
import { formatDate } from '../../../utils/sales-helpers.js'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import StatusBadge from '../../../components/common/StatusBadge.vue'
import OrderTimeline from '../../../components/sales/order/OrderTimeline.vue'
import OrderItemTable from '../../../components/sales/order/OrderItemTable.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const salesStore = useSalesStore()
const customerStore = useCustomerStore()

const order = computed(() => salesStore.getById(route.params.id))
const customerName = computed(() => customerStore.getById(order.value?.customerId)?.name || '')
const docList = computed(() => {
  if (!order.value) return []
  const docs = [order.value.soNumber + '-SO.pdf']
  if (order.value.invoiceNumber) docs.push(order.value.invoiceNumber + '.pdf')
  return docs
})

function confirmOrder() {
  salesStore.updateStatus(order.value.id, 'confirmed')
  ElMessage.success(t('common.operationSuccess'))
}
function shipOrder() {
  salesStore.updateStatus(order.value.id, 'shipped')
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
