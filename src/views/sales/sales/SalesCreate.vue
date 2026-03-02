<template>
  <div>
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:12px">
        <el-button text :icon="'ArrowLeft'" @click="router.back()">{{ $t('common.back') }}</el-button>
        <h2>{{ $t('sales.create') }}</h2>
      </div>
    </div>

    <el-row :gutter="20">
      <el-col :span="16">
        <el-card style="margin-bottom:16px">
          <template #header><span>{{ $t('sales.orderInfo') }}</span></template>
          <el-form :model="form" label-width="120px">
            <el-form-item :label="$t('nav.customers')" required>
              <el-select v-model="form.customerId" filterable style="width:100%" @change="onCustomerChange">
                <el-option v-for="c in customerStore.customers" :key="c.id" :label="c.name" :value="c.id" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('sales.deliverySchedule')">
              <el-date-picker v-model="form.shipDate" type="date" value-format="YYYY-MM-DD" />
            </el-form-item>
            <el-form-item :label="$t('purchase.shippingMethod')">
              <el-select v-model="form.shippingMethod">
                <el-option :label="$t('logistics.seaFreight')" value="sea" />
                <el-option :label="$t('logistics.airFreight')" value="air" />
                <el-option :label="$t('logistics.landFreight')" value="land" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('common.notes')">
              <el-input v-model="form.notes" type="textarea" :rows="2" />
            </el-form-item>
          </el-form>
        </el-card>

        <el-card>
          <template #header>
            <div style="display:flex;justify-content:space-between">
              <span>{{ $t('sales.lineItems') }}</span>
              <el-button size="small" type="primary" :icon="'Plus'" @click="addLine">{{ $t('common.addItem') }}</el-button>
            </div>
          </template>
          <el-table :data="form.items" border>
            <el-table-column :label="$t('product.name')" min-width="160">
              <template #default="{ row, $index }">
                <el-select v-model="row.productId" filterable size="small" @change="onProductChange($index)">
                  <el-option v-for="p in productStore.products" :key="p.id" :label="p.nameCn" :value="p.id" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column :label="$t('common.quantity')" width="110">
              <template #default="{ row, $index }">
                <el-input-number v-model="row.qty" :min="1" size="small" @change="calcLine($index)" />
              </template>
            </el-table-column>
            <el-table-column :label="$t('common.unitPrice')" width="130">
              <template #default="{ row, $index }">
                <el-input-number v-model="row.unitPrice" :min="0" :precision="2" size="small" @change="calcLine($index)" />
              </template>
            </el-table-column>
            <el-table-column :label="$t('common.currency')" width="90">
              <template #default="{ row }">
                <el-select v-model="row.currency" size="small">
                  <el-option v-for="c in ['CNY','USD','TWD']" :key="c" :label="c" :value="c" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column :label="$t('inventory.available')" width="100">
              <template #default="{ row }">
                <el-tag :type="getStock(row.productId) < row.qty ? 'danger' : 'success'" size="small">
                  {{ getStock(row.productId) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column :label="$t('common.amount')" width="130">
              <template #default="{ row }"><CurrencyDisplay :amount="row.amount" :currency="row.currency" /></template>
            </el-table-column>
            <el-table-column width="60">
              <template #default="{ $index }">
                <el-button type="danger" text :icon="'Delete'" size="small" @click="removeLine($index)" />
              </template>
            </el-table-column>
          </el-table>
          <div class="total-row">
            <strong>{{ $t('common.total') }}: <CurrencyDisplay :amount="totalAmount" currency="CNY" /></strong>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <!-- Credit Check -->
        <el-card v-if="selectedCustomer" style="margin-bottom:16px">
          <template #header><span>{{ $t('sales.creditCheck') }}</span></template>
          <el-descriptions :column="1" border size="small">
            <el-descriptions-item :label="$t('customer.creditLimit')">
              <CurrencyDisplay :amount="selectedCustomer.creditLimit" currency="CNY" />
            </el-descriptions-item>
            <el-descriptions-item :label="$t('customer.arBalance')">
              <CurrencyDisplay :amount="selectedCustomer.arBalance" currency="CNY" color="#e57373" />
            </el-descriptions-item>
            <el-descriptions-item :label="$t('customer.available')">
              <CurrencyDisplay :amount="selectedCustomer.creditLimit - selectedCustomer.arBalance" currency="CNY" color="#67c23a" />
            </el-descriptions-item>
            <el-descriptions-item :label="$t('common.status')">
              <el-tag :type="creditOk ? 'success' : 'danger'">
                {{ creditOk ? $t('sales.creditOk') : $t('sales.creditExceeded') }}
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card>
          <template #header><span>{{ $t('purchase.summary') }}</span></template>
          <div class="summary-item">
            <span>{{ $t('nav.customers') }}</span>
            <strong>{{ selectedCustomer?.name || '-' }}</strong>
          </div>
          <div class="summary-item">
            <span>{{ $t('common.totalAmount') }}</span>
            <strong>¥{{ totalAmount.toLocaleString() }}</strong>
          </div>
          <el-divider />
          <el-button type="primary" style="width:100%" @click="saveQuotation">{{ $t('sales.saveAsQuotation') }}</el-button>
          <el-button type="success" style="width:100%;margin-top:8px" @click="confirmOrder">{{ $t('sales.confirmOrder') }}</el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCustomerStore } from '../../../stores/sales-customer.js'
import { useProductStore } from '../../../stores/sales-product.js'
import { useSalesStore } from '../../../stores/sales-sales.js'
import { useInventoryStore } from '../../../stores/sales-inventory.js'
import { ElMessage } from 'element-plus'
import CurrencyDisplay from '../../../components/common/CurrencyDisplay.vue'

const { t } = useI18n()
const router = useRouter()
const customerStore = useCustomerStore()
const productStore = useProductStore()
const salesStore = useSalesStore()
const inventoryStore = useInventoryStore()

const form = reactive({
  customerId: '',
  shipDate: '',
  shippingMethod: 'sea',
  notes: '',
  items: [{ productId: '', productName: '', qty: 1, unitPrice: 0, currency: 'CNY', amount: 0, unit: 'kg' }],
  currency: 'CNY'
})

const selectedCustomer = computed(() => customerStore.getById(form.customerId))
const totalAmount = computed(() => form.items.reduce((s, i) => s + (i.amount || 0), 0))
const creditOk = computed(() => {
  if (!selectedCustomer.value) return true
  return (selectedCustomer.value.arBalance + totalAmount.value) <= selectedCustomer.value.creditLimit
})

function onCustomerChange() {}
function addLine() {
  form.items.push({ productId: '', productName: '', qty: 1, unitPrice: 0, currency: 'CNY', amount: 0, unit: 'kg' })
}
function removeLine(index) { form.items.splice(index, 1) }
function onProductChange(index) {
  const item = form.items[index]
  const product = productStore.getById(item.productId)
  if (product) {
    item.productName = product.nameCn
    item.unit = product.stockUnit
    item.unitPrice = product.unitPriceRange.min
    item.currency = 'CNY'
    calcLine(index)
  }
}
function calcLine(index) {
  form.items[index].amount = form.items[index].qty * form.items[index].unitPrice
}
function getStock(productId) {
  if (!productId) return 0
  const prod = productStore.getById(productId)
  return prod?.currentStock || 0
}
function saveQuotation() {
  salesStore.addOrder({ ...form, status: 'quotation', totalAmount: totalAmount.value })
  ElMessage.success(t('common.operationSuccess'))
  router.push({ name: 'quotationManagement' })
}
function confirmOrder() {
  salesStore.addOrder({ ...form, status: 'confirmed', totalAmount: totalAmount.value })
  ElMessage.success(t('common.operationSuccess'))
  router.push({ name: 'salesList' })
}

customerStore.fetchCustomers()
productStore.fetchProducts()
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { font-size: 20px; font-weight: 600; }
.total-row { text-align: right; padding: 12px 16px; background: #f5f7fa; border-radius: 4px; margin-top: 8px; }
.summary-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0; font-size: 13px; }
</style>
