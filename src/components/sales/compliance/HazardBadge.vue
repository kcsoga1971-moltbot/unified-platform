<template>
  <span class="hazard-badge" :style="{ backgroundColor: hazardInfo.color + '22', color: hazardInfo.color, border: '1px solid ' + hazardInfo.color + '66' }">
    {{ hazardInfo.icon }} {{ showLabel ? $t(`compliance.hazard.${hazard}`) : '' }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { GHS_HAZARDS } from '../../../utils/sales-constants.js'

const props = defineProps({
  hazard: { type: String, required: true },
  showLabel: { type: Boolean, default: false }
})

const hazardInfo = computed(() => GHS_HAZARDS[props.hazard] || { label: props.hazard, icon: '⚠️', color: '#909399' })
</script>

<style scoped>
.hazard-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin: 2px;
  font-weight: 500;
}
</style>
