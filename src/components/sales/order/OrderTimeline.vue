<template>
  <el-timeline>
    <el-timeline-item
      v-for="(event, index) in events"
      :key="index"
      :timestamp="event.time"
      :type="event.type"
      :color="event.color"
    >
      {{ event.label }}
    </el-timeline-item>
  </el-timeline>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatDateTime } from '../../../utils/sales-helpers.js'

const { t } = useI18n()

const props = defineProps({
  order: { type: Object, required: true },
  type: { type: String, default: 'purchase' } // 'purchase' | 'sales'
})

const events = computed(() => {
  const o = props.order
  const list = []

  if (o.createdAt) list.push({ time: formatDateTime(o.createdAt), label: t('purchase.status.draft') + ' - ' + t('common.created'), type: 'primary', color: '#409EFF' })
  if (o.approvedAt) list.push({ time: formatDateTime(o.approvedAt), label: t('purchase.status.approved'), type: 'success', color: '#67C23A' })
  if (o.shipDate) list.push({ time: formatDateTime(o.shipDate), label: t('purchase.status.shipped'), type: 'warning', color: '#E6A23C' })
  if (o.receivedDate || o.deliveryDate) list.push({ time: formatDateTime(o.receivedDate || o.deliveryDate), label: t('purchase.status.received'), type: 'success', color: '#67C23A' })

  return list
})
</script>
