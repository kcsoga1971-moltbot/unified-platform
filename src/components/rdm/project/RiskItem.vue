<template>
  <div class="risk-item" :class="`level-${risk.level}`">
    <div class="risk-header">
      <el-tag :type="levelTagType" size="small" class="risk-level-tag">
        {{ $t(`risk.level.${risk.level}`) }}
      </el-tag>
      <span class="risk-id">{{ risk.id }}</span>
      <span class="risk-score">{{ $t('risk.score') }}: {{ risk.score }}</span>
    </div>
    <div class="risk-title">{{ risk.title }}</div>
    <div class="risk-meta">
      <span>{{ $t('risk.probability') }}: {{ risk.probability }}</span>
      <span>{{ $t('risk.impact') }}: {{ risk.impact }}</span>
      <span>{{ risk.projectName }}</span>
    </div>
    <div v-if="risk.mitigation" class="risk-mitigation">
      <el-icon><Shield /></el-icon>
      {{ risk.mitigation }}
    </div>
    <div class="risk-footer">
      <el-tag :type="statusTagType" size="small">{{ $t(`risk.status.${risk.status}`) }}</el-tag>
      <span class="risk-owner">{{ risk.owner }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  risk: { type: Object, required: true },
})

const levelTagType = computed(() => {
  const map = { critical: 'danger', high: 'warning', medium: '', low: 'success' }
  return map[props.risk.level] || 'info'
})

const statusTagType = computed(() => {
  const map = { open: 'danger', mitigating: 'warning', closed: 'success', monitoring: 'info' }
  return map[props.risk.status] || 'info'
})
</script>

<style scoped>
.risk-item {
  padding: 12px;
  border-radius: 8px;
  border-left: 4px solid #e5e7eb;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
}
.risk-item.level-critical { border-left-color: #ef4444; background: #fff5f5; }
.risk-item.level-high { border-left-color: #f97316; background: #fffbf5; }
.risk-item.level-medium { border-left-color: #eab308; background: #fffdf0; }
.risk-item.level-low { border-left-color: #10b981; background: #f0fdf4; }

.risk-header { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.risk-id { font-size: 11px; color: #9ca3af; }
.risk-score { font-size: 12px; color: #374151; font-weight: 600; margin-left: auto; }

.risk-title { font-size: 14px; font-weight: 600; color: #111827; margin-bottom: 6px; }

.risk-meta { display: flex; gap: 12px; font-size: 12px; color: #6b7280; margin-bottom: 6px; }

.risk-mitigation {
  display: flex; align-items: flex-start; gap: 6px;
  font-size: 12px; color: #374151;
  background: white; padding: 6px 8px; border-radius: 6px;
  border: 1px solid #e5e7eb; margin-bottom: 8px;
}

.risk-footer { display: flex; align-items: center; justify-content: space-between; }
.risk-owner { font-size: 12px; color: #6b7280; }
</style>
