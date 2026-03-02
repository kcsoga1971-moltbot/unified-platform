<template>
  <el-table :data="items" border stripe size="small">
    <el-table-column type="index" width="50" />
    <el-table-column :label="$t('common.name')" prop="productName" min-width="160" />
    <el-table-column :label="$t('common.quantity')" prop="qty" width="100">
      <template #default="{ row }">{{ row.qty }} {{ row.unit }}</template>
    </el-table-column>
    <el-table-column :label="$t('common.unitPrice')" width="130">
      <template #default="{ row }">
        <CurrencyDisplay :amount="row.unitPrice" :currency="row.currency" />
      </template>
    </el-table-column>
    <el-table-column :label="$t('common.amount')" width="150">
      <template #default="{ row }">
        <CurrencyDisplay :amount="row.amount" :currency="row.currency" color="#0d47a1" />
      </template>
    </el-table-column>
  </el-table>
  <div class="table-footer">
    <strong>{{ $t('common.total') }}: <CurrencyDisplay :amount="total" :currency="currency" /></strong>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import CurrencyDisplay from '../../common/CurrencyDisplay.vue'

const props = defineProps({
  items: { type: Array, default: () => [] },
  currency: { type: String, default: 'CNY' }
})

const total = computed(() => props.items.reduce((s, i) => s + (i.amount || 0), 0))
</script>

<style scoped>
.table-footer { text-align: right; margin-top: 12px; padding: 8px 16px; background: #f5f7fa; border-radius: 4px; }
</style>
