<template>
  <div class="approval-flow">
    <el-steps :active="activeStep" align-center>
      <el-step :title="$t('purchase.status.draft')" :icon="'Edit'" />
      <el-step :title="$t('purchase.status.approved')" :icon="'Check'" />
      <el-step :title="$t('purchase.status.ordered')" :icon="'Document'" />
      <el-step :title="$t('purchase.status.shipped')" :icon="'Van'" />
      <el-step :title="$t('purchase.status.received')" :icon="'CircleCheck'" />
    </el-steps>
    <div v-if="order.approvedBy" class="approval-info">
      <el-tag type="success" size="small">{{ $t('purchase.approvedBy') }}: {{ order.approvedBy }}</el-tag>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  order: { type: Object, required: true }
})

const stepMap = { draft: 0, approved: 1, ordered: 2, shipped: 3, received: 4, closed: 4 }
const activeStep = computed(() => stepMap[props.order.status] ?? 0)
</script>

<style scoped>
.approval-flow { padding: 16px 0; }
.approval-info { text-align: center; margin-top: 12px; }
</style>
