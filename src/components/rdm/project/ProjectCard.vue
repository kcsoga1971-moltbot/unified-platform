<template>
  <div class="project-card" @click="$emit('click', project.id)">
    <div class="card-header">
      <div class="card-title-row">
        <h3 class="project-name">{{ project.name }}</h3>
        <StatusBadge :status="project.status" />
      </div>
      <div class="project-meta">
        <el-tag size="small" type="info">{{ project.code }}</el-tag>
        <el-tag size="small" :type="productLineType">{{ project.productLine }}</el-tag>
      </div>
    </div>

    <div class="card-body">
      <div class="stage-info">
        <span class="stage-label">{{ $t('project.currentStage') }}</span>
        <el-tag type="primary" size="small">{{ $t(`stages.${project.currentStage}`) }}</el-tag>
      </div>

      <div class="progress-section">
        <div class="progress-label">
          <span>{{ $t('project.progress') }}</span>
          <span class="progress-value">{{ project.progress }}%</span>
        </div>
        <el-progress
          :percentage="project.progress"
          :stroke-width="6"
          :color="progressColor"
          :show-text="false"
        />
      </div>

      <div class="card-footer">
        <div class="pm-info">
          <div class="mini-avatar">{{ pmInitials }}</div>
          <span class="pm-name">{{ pmName }}</span>
        </div>
        <span class="update-time">
          {{ $t('project.updatedAt') }}: {{ formatDate(project.updatedAt) }}
        </span>
      </div>
    </div>

    <div class="priority-indicator" :class="`priority-${project.priority}`"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import StatusBadge from '../../common/StatusBadge.vue'
import { formatDate } from '../../../utils/rdm-helpers.js'
import { DEMO_USERS } from '../../../utils/rdm-demoData.js'

const { t } = useI18n()

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
})

defineEmits(['click'])

const productLineType = computed(() => {
  const map = { TGV: 'primary', 'Anti-glare': 'success', Other: 'info' }
  return map[props.project.productLine] || 'info'
})

const progressColor = computed(() => {
  if (props.project.progress >= 75) return '#52c41a'
  if (props.project.progress >= 40) return '#1a73e8'
  return '#faad14'
})

const pmUser = computed(() => DEMO_USERS.find((u) => u.id === props.project.pmId))
const pmName = computed(() => pmUser.value?.name || props.project.pmId || '-')
const pmInitials = computed(() => pmName.value.slice(0, 2).toUpperCase())
</script>

<style scoped>
.project-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--card-shadow);
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #e5e7eb;
  position: relative;
  overflow: hidden;
}

.project-card:hover {
  border-color: #1a73e8;
  box-shadow: 0 4px 12px rgba(26, 115, 232, 0.15);
  transform: translateY(-1px);
}

.priority-indicator {
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
}

.priority-high { background: #f5222d; }
.priority-medium { background: #faad14; }
.priority-low { background: #52c41a; }

.card-header {
  margin-bottom: 16px;
}

.card-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}

.project-name {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  flex: 1;
  line-height: 1.3;
}

.project-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stage-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stage-label {
  font-size: 13px;
  color: #6b7280;
}

.progress-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #6b7280;
}

.progress-value {
  font-weight: 600;
  color: #374151;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
}

.pm-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mini-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #1a73e8;
  color: white;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.pm-name {
  font-size: 13px;
  color: #374151;
}

.update-time {
  font-size: 12px;
  color: #9ca3af;
}
</style>
