<template>
  <div class="deliverable-checklist">
    <div class="checklist-header">
      <span class="progress-text">
        {{ completedCount }}/{{ deliverables.length }} {{ $t('project.deliverableCount') }}
      </span>
      <el-progress
        :percentage="progressPct"
        :stroke-width="6"
        :color="progressColor"
        style="width: 200px"
      />
    </div>

    <div class="checklist-items">
      <div
        v-for="d in deliverables"
        :key="d.id"
        class="checklist-item"
        :class="{ completed: d.completed }"
      >
        <el-checkbox
          :model-value="d.completed"
          :disabled="!editable"
          @change="$emit('toggle', d.id)"
        />
        <div class="deliverable-content">
          <span class="deliverable-name">{{ locale === 'zh-CN' ? d.nameZh : d.nameEn }}</span>
          <span v-if="d.completed" class="completed-badge">
            <el-icon size="12"><Check /></el-icon>
            {{ $t('deliverable.completed') }}
          </span>
        </div>
        <div class="deliverable-actions">
          <el-button size="small" text type="primary" @click="$emit('upload', d.id)">
            <el-icon><Upload /></el-icon>
            {{ $t('deliverable.uploadDoc') }}
          </el-button>
        </div>
      </div>
    </div>

    <div v-if="deliverables.length === 0" class="empty">
      {{ $t('common.noData') }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const props = defineProps({
  deliverables: {
    type: Array,
    default: () => [],
  },
  projectId: {
    type: String,
    required: true,
  },
  stageId: {
    type: Number,
    required: true,
  },
  editable: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['toggle', 'upload'])

const completedCount = computed(() => props.deliverables.filter((d) => d.completed).length)

const progressPct = computed(() => {
  if (!props.deliverables.length) return 0
  return Math.round((completedCount.value / props.deliverables.length) * 100)
})

const progressColor = computed(() => {
  if (progressPct.value === 100) return '#52c41a'
  if (progressPct.value > 50) return '#1a73e8'
  return '#faad14'
})
</script>

<style scoped>
.deliverable-checklist {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.checklist-header {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.progress-text {
  font-size: 13px;
  color: #6b7280;
  white-space: nowrap;
}

.checklist-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.checklist-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s;
  background: white;
}

.checklist-item.completed {
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.checklist-item:hover {
  border-color: #1a73e8;
}

.deliverable-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.deliverable-name {
  font-size: 14px;
  color: #374151;
}

.checklist-item.completed .deliverable-name {
  color: #15803d;
}

.completed-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #15803d;
  background: #dcfce7;
  padding: 2px 8px;
  border-radius: 100px;
}

.deliverable-actions {
  flex-shrink: 0;
}

.empty {
  text-align: center;
  color: #9ca3af;
  padding: 20px;
}
</style>
