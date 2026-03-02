<template>
  <div>
    <div class="page-header">
      <h2>{{ $t('nav.goodsReceiving') }}</h2>
    </div>

    <!-- Select PO -->
    <el-card style="margin-bottom:16px">
      <template #header><span>{{ $t('purchase.selectPO') }}</span></template>
      <el-select v-model="selectedPOId" :placeholder="$t('purchase.selectPO')" filterable style="width:350px" @change="loadPO">
        <el-option v-for="po in shippedOrders" :key="po.id" :label="po.poNumber + ' - ' + getSupplierName(po.supplierId)" :value="po.id" />
      </el-select>
    </el-card>

    <div v-if="selectedPO">
      <el-card>
        <template #header>
          <div style="display:flex;justify-content:space-between">
            <span>{{ $t('purchase.receivingItems') }}: {{ selectedPO.poNumber }}</span>
            <el-button type="success" @click="completeReceiving">{{ $t('purchase.completeReceiving') }}</el-button>
          </div>
        </template>
        <el-table :data="receivingItems" border>
          <el-table-column :label="$t('product.name')" min-width="160">
            <template #default="{ row }">{{ row.productName }}</template>
          </el-table-column>
          <el-table-column :label="$t('purchase.orderedQty')" width="110">
            <template #default="{ row }">{{ row.qty }} {{ row.unit }}</template>
          </el-table-column>
          <el-table-column :label="$t('purchase.receivedQty')" width="130">
            <template #default="{ row, $index }">
              <el-input-number v-model="receivingItems[$index].receivedQty" :min="0" :max="row.qty" size="small" />
            </template>
          </el-table-column>
          <el-table-column :label="$t('purchase.inspectionResult')" width="140">
            <template #default="{ row, $index }">
              <el-select v-model="receivingItems[$index].inspection" size="small">
                <el-option :label="$t('purchase.inspection.pass')" value="pass" />
                <el-option :label="$t('purchase.inspection.fail')" value="fail" />
                <el-option :label="$t('purchase.inspection.partial')" value="partial" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column :label="$t('purchase.lotNumber')" width="140">
            <template #default="{ row, $index }">
              <el-input v-model="receivingItems[$index].lotNumber" size="small" />
            </template>
          </el-table-column>
          <el-table-column :label="$t('purchase.mfgDate')" width="130">
            <template #default="{ row, $index }">
              <el-date-picker v-model="receivingItems[$index].mfgDate" type="date" size="small" value-format="YYYY-MM-DD" style="width:120px" />
            </template>
          </el-table-column>
          <el-table-column :label="$t('purchase.expiryDate')" width="130">
            <template #default="{ row, $index }">
              <el-date-picker v-model="receivingItems[$index].expiryDate" type="date" size="small" value-format="YYYY-MM-DD" style="width:120px" />
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePurchaseStore } from '../../../stores/sales-purchase.js'
import { useSupplierStore } from '../../../stores/sales-supplier.js'
import { useInventoryStore } from '../../../stores/sales-inventory.js'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const purchaseStore = usePurchaseStore()
const supplierStore = useSupplierStore()
const inventoryStore = useInventoryStore()

const selectedPOId = ref('')
const selectedPO = ref(null)
const receivingItems = ref([])

const shippedOrders = computed(() =>
  purchaseStore.purchaseOrders.filter(o => ['shipped', 'ordered'].includes(o.status))
)

function getSupplierName(id) {
  return supplierStore.getById(id)?.name || id
}

function loadPO(id) {
  selectedPO.value = purchaseStore.getById(id)
  if (selectedPO.value) {
    receivingItems.value = selectedPO.value.items.map(item => ({
      ...item,
      receivedQty: item.qty,
      inspection: 'pass',
      lotNumber: '',
      mfgDate: '',
      expiryDate: ''
    }))
  }
}

function completeReceiving() {
  purchaseStore.updateStatus(selectedPOId.value, 'received')
  receivingItems.value.forEach(item => {
    inventoryStore.addMovement({
      productId: item.productId,
      productName: item.productName,
      direction: 'in',
      qty: item.receivedQty,
      unit: item.unit,
      reference: selectedPO.value.poNumber,
      operator: t('common.system'),
      lotNumber: item.lotNumber,
      inspection: item.inspection
    })
  })
  ElMessage.success(t('purchase.receivingComplete'))
  selectedPO.value = null
  selectedPOId.value = ''
  receivingItems.value = []
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
