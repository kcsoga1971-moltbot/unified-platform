<template>
  <div>
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:12px">
        <el-button text :icon="'ArrowLeft'" @click="router.back()">{{ $t('common.back') }}</el-button>
        <h2>{{ $t('purchase.create') }}</h2>
      </div>
    </div>

    <el-form :model="form" ref="formRef" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="16">
          <!-- Basic Info -->
          <el-card style="margin-bottom:16px">
            <template #header><span>{{ $t('purchase.basicInfo') }}</span></template>
            <el-form-item :label="$t('nav.suppliers')" prop="supplierId" :rules="[{ required: true }]">
              <el-select v-model="form.supplierId" :placeholder="$t('common.select')" filterable style="width:100%">
                <el-option v-for="s in supplierStore.suppliers" :key="s.id" :label="s.name" :value="s.id" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('purchase.deliveryTerms')">
              <el-select v-model="form.deliveryTerms">
                <el-option v-for="term in DELIVERY_TERMS" :key="term" :label="term" :value="term" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('purchase.paymentTerms')">
              <el-select v-model="form.paymentTerms">
                <el-option v-for="term in PAYMENT_TERMS" :key="term" :label="term" :value="term" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('purchase.shippingMethod')">
              <el-select v-model="form.shippingMethod">
                <el-option :label="$t('logistics.seaFreight')" value="sea" />
                <el-option :label="$t('logistics.airFreight')" value="air" />
                <el-option :label="$t('logistics.landFreight')" value="land" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('purchase.eta')">
              <el-date-picker v-model="form.eta" type="date" value-format="YYYY-MM-DD" />
            </el-form-item>
            <el-form-item :label="$t('purchase.specialHandling')">
              <el-input v-model="form.notes" type="textarea" :rows="2" :placeholder="$t('purchase.hazmatNotes')" />
            </el-form-item>
          </el-card>

          <!-- Line Items -->
          <el-card>
            <template #header>
              <div style="display:flex;justify-content:space-between">
                <span>{{ $t('purchase.lineItems') }}</span>
                <el-button size="small" type="primary" :icon="'Plus'" @click="addLine">{{ $t('common.addItem') }}</el-button>
              </div>
            </template>
            <el-table :data="form.items" border>
              <el-table-column :label="$t('common.name')" min-width="160">
                <template #default="{ row, $index }">
                  <el-select v-model="row.productId" :placeholder="$t('common.select')" filterable size="small" @change="onProductChange($index)">
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
                    <el-option v-for="c in ['CNY','USD','JPY','KRW','TWD']" :key="c" :label="c" :value="c" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column :label="$t('common.amount')" width="130">
                <template #default="{ row }">
                  <CurrencyDisplay :amount="row.amount" :currency="row.currency" />
                </template>
              </el-table-column>
              <el-table-column width="60">
                <template #default="{ $index }">
                  <el-button type="danger" text :icon="'Delete'" size="small" @click="removeLine($index)" />
                </template>
              </el-table-column>
            </el-table>
            <div class="total-row">
              <strong>{{ $t('common.total') }}: {{ totalDisplay }}</strong>
            </div>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card>
            <template #header><span>{{ $t('purchase.summary') }}</span></template>
            <div class="summary-item">
              <span>{{ $t('nav.suppliers') }}</span>
              <strong>{{ selectedSupplierName }}</strong>
            </div>
            <div class="summary-item">
              <span>{{ $t('purchase.lineCount') }}</span>
              <strong>{{ form.items.length }}</strong>
            </div>
            <div class="summary-item">
              <span>{{ $t('common.totalAmount') }}</span>
              <strong>{{ totalDisplay }}</strong>
            </div>
            <el-divider />
            <el-button type="primary" style="width:100%" @click="saveDraft">{{ $t('purchase.saveDraft') }}</el-button>
            <el-button type="success" style="width:100%;margin-top:8px" @click="submitOrder">{{ $t('purchase.submitApproval') }}</el-button>
          </el-card>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSupplierStore } from '../../../stores/sales-supplier.js'
import { useProductStore } from '../../../stores/sales-product.js'
import { usePurchaseStore } from '../../../stores/sales-purchase.js'
import { DELIVERY_TERMS, PAYMENT_TERMS } from '../../../utils/sales-constants.js'
import { formatCurrency } from '../../../utils/currency.js'
import { ElMessage } from 'element-plus'
import CurrencyDisplay from '../../../components/common/CurrencyDisplay.vue'

const { t } = useI18n()
const router = useRouter()
const supplierStore = useSupplierStore()
const productStore = useProductStore()
const purchaseStore = usePurchaseStore()

const formRef = ref(null)

const form = reactive({
  supplierId: '',
  deliveryTerms: 'CIF',
  paymentTerms: 'T/T 60天',
  shippingMethod: 'sea',
  eta: '',
  notes: '',
  items: [{ productId: '', productName: '', qty: 1, unitPrice: 0, currency: 'USD', amount: 0, unit: 'kg' }],
  currency: 'USD'
})

const selectedSupplierName = computed(() => supplierStore.getById(form.supplierId)?.name || '-')

const totalAmount = computed(() => form.items.reduce((s, i) => s + (i.amount || 0), 0))
const totalDisplay = computed(() => {
  const currency = form.items[0]?.currency || 'USD'
  return formatCurrency(totalAmount.value, currency)
})

function addLine() {
  form.items.push({ productId: '', productName: '', qty: 1, unitPrice: 0, currency: 'USD', amount: 0, unit: 'kg' })
}

function removeLine(index) {
  form.items.splice(index, 1)
}

function onProductChange(index) {
  const item = form.items[index]
  const product = productStore.getById(item.productId)
  if (product) {
    item.productName = product.nameCn
    item.unit = product.stockUnit
    item.unitPrice = product.unitPriceRange.min
    item.currency = product.unitPriceRange.currency
    calcLine(index)
  }
}

function calcLine(index) {
  const item = form.items[index]
  item.amount = item.qty * item.unitPrice
}

function saveDraft() {
  purchaseStore.addOrder({ ...form, status: 'draft', items: [...form.items] })
  ElMessage.success(t('common.operationSuccess'))
  router.push({ name: 'purchaseList' })
}

function submitOrder() {
  purchaseStore.addOrder({ ...form, status: 'approved', items: [...form.items] })
  ElMessage.success(t('purchase.submitSuccess'))
  router.push({ name: 'purchaseList' })
}

supplierStore.fetchSuppliers()
productStore.fetchProducts()
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { font-size: 20px; font-weight: 600; }
.total-row { text-align: right; padding: 12px 16px; background: #f5f7fa; border-radius: 4px; margin-top: 8px; }
.summary-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0; font-size: 13px; }
</style>
