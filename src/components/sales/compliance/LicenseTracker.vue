<template>
  <div>
    <div v-for="license in licenses" :key="license.id" class="license-item">
      <div class="license-info">
        <span class="license-type">{{ license.type }}</span>
        <span class="license-number">{{ license.licenseNumber }}</span>
      </div>
      <div class="license-status">
        <el-progress
          :percentage="daysPercent(license)"
          :color="progressColor(license)"
          :stroke-width="6"
          style="width: 120px"
        />
        <el-tag :type="license.status === 'valid' ? 'success' : license.status === 'expiring' ? 'warning' : 'danger'" size="small">
          {{ daysLeft(license) }} {{ $t('inventory.days') }}
        </el-tag>
      </div>
    </div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs'

const props = defineProps({
  licenses: { type: Array, default: () => [] }
})

function daysLeft(license) {
  return Math.max(0, dayjs(license.expiryDate).diff(dayjs(), 'day'))
}

function daysPercent(license) {
  const total = 365
  const left = daysLeft(license)
  return Math.min(100, Math.round((left / total) * 100))
}

function progressColor(license) {
  const left = daysLeft(license)
  if (left <= 30) return '#F56C6C'
  if (left <= 90) return '#E6A23C'
  return '#67C23A'
}
</script>

<style scoped>
.license-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
.license-item:last-child { border-bottom: none; }
.license-type { font-weight: 600; font-size: 13px; display: block; }
.license-number { font-size: 12px; color: #909399; }
.license-status { display: flex; align-items: center; gap: 8px; }
</style>
