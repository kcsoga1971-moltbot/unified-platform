<template>
  <div class="summary-card" @click="$emit('click')">
    <div class="card-header">
      <div class="author-info">
        <div class="avatar">{{ summary.userName?.slice(0, 2) }}</div>
        <div>
          <div class="author-name">{{ summary.userName }}</div>
          <div class="summary-date">{{ displayDate }}</div>
        </div>
      </div>
      <el-tag :type="statusType" size="small">{{ $t(`summary.${summary.status}`) }}</el-tag>
    </div>
    <div class="preview-text">{{ previewText }}</div>
    <div class="card-footer">
      <el-tag size="small" type="info">{{ $t(`summary.${summary.type}`) }}</el-tag>
      <span v-if="summary.aiGenerated" class="ai-badge">AI</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({ summary: { type: Object, required: true } })
defineEmits(['click'])

const statusType = computed(() => {
  const m = { draft: '', confirmed: 'warning', published: 'success' }
  return m[props.summary.status] || ''
})

const displayDate = computed(() => {
  if (props.summary.type === 'daily') return props.summary.date
  if (props.summary.type === 'weekly') return `${props.summary.weekStart} ~ ${props.summary.weekEnd}`
  return props.summary.month
})

const previewText = computed(() => {
  if (props.summary.type === 'daily') return props.summary.notes?.slice(0, 80) + '...'
  if (props.summary.type === 'weekly') return props.summary.weekOverview?.slice(0, 80) + '...'
  return props.summary.monthlyOverview?.slice(0, 80) + '...'
})
</script>

<style scoped>
.summary-card {
  background: white;
  border-radius: 10px;
  padding: 14px 16px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  cursor: pointer;
  transition: box-shadow 0.2s;
  border: 1px solid #f0f0f0;
}

.summary-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #1a73e8;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.author-name {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
}

.summary-date {
  font-size: 12px;
  color: #9ca3af;
}

.preview-text {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
  margin-bottom: 10px;
}

.card-footer {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ai-badge {
  font-size: 10px;
  background: #ede9fe;
  color: #7c3aed;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
}
</style>
