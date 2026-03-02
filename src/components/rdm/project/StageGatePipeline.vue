<template>
  <div class="pipeline-wrapper">
    <div class="pipeline">
      <template v-for="(stage, idx) in stages" :key="stage.id">
        <div
          class="stage-item"
          :class="{
            completed: idx < currentStage,
            current: idx === currentStage,
            upcoming: idx > currentStage,
            expanded: expandedStage === idx,
          }"
          @click="toggleExpand(idx)"
        >
          <div class="stage-indicator">
            <div class="stage-circle">
              <el-icon v-if="idx < currentStage" size="16"><Check /></el-icon>
              <span v-else>{{ idx }}</span>
            </div>
          </div>
          <div class="stage-info">
            <div class="stage-label">{{ $t(`stages.${idx}`) }}</div>
            <div class="stage-sub">
              <span v-if="idx < currentStage" class="stage-status done">{{ $t('stages.completed') }}</span>
              <span v-else-if="idx === currentStage" class="stage-status active">{{ $t('stages.current') }}</span>
              <span v-else class="stage-status pending">{{ $t('stages.upcoming') }}</span>
            </div>
            <div v-if="deliverableStats[idx]" class="stage-progress-mini">
              <span class="deliverable-count">
                {{ deliverableStats[idx].done }}/{{ deliverableStats[idx].total }}
              </span>
            </div>
          </div>
          <el-icon class="expand-icon" size="12">
            <component :is="expandedStage === idx ? 'ArrowUp' : 'ArrowDown'" />
          </el-icon>
        </div>

        <!-- Arrow between stages -->
        <div v-if="idx < stages.length - 1" class="pipeline-arrow" :class="{ active: idx < currentStage }">
          <el-icon><ArrowRight /></el-icon>
        </div>
      </template>
    </div>

    <!-- Expanded Stage Detail -->
    <transition name="slide-down">
      <div v-if="expandedStage !== null" class="stage-detail">
        <div class="stage-detail-header">
          <h3>{{ $t(`stages.${expandedStage}`) }}</h3>
          <el-tag :type="stageTagType(expandedStage)">
            {{ stageStatusLabel(expandedStage) }}
          </el-tag>
        </div>
        <DeliverableChecklist
          v-if="projectDeliverables[expandedStage]"
          :deliverables="projectDeliverables[expandedStage]"
          :project-id="projectId"
          :stage-id="expandedStage"
          :editable="expandedStage === currentStage"
          @toggle="handleDeliverableToggle"
        />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { STAGES } from '../../../utils/rdm-constants.js'
import DeliverableChecklist from './DeliverableChecklist.vue'

const { t } = useI18n()

const props = defineProps({
  currentStage: {
    type: Number,
    required: true,
  },
  projectId: {
    type: String,
    required: true,
  },
  projectDeliverables: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['toggle-deliverable', 'stage-click'])

const stages = STAGES
const expandedStage = ref(props.currentStage)

const deliverableStats = computed(() => {
  const stats = {}
  for (const [stageId, deliverables] of Object.entries(props.projectDeliverables)) {
    const done = deliverables.filter((d) => d.completed).length
    stats[stageId] = { done, total: deliverables.length }
  }
  return stats
})

function toggleExpand(stageIdx) {
  expandedStage.value = expandedStage.value === stageIdx ? null : stageIdx
  emit('stage-click', stageIdx)
}

function stageTagType(idx) {
  if (idx < props.currentStage) return 'success'
  if (idx === props.currentStage) return 'primary'
  return 'info'
}

function stageStatusLabel(idx) {
  if (idx < props.currentStage) return t('stages.completed')
  if (idx === props.currentStage) return t('stages.current')
  return t('stages.upcoming')
}

function handleDeliverableToggle(deliverableId) {
  emit('toggle-deliverable', expandedStage.value, deliverableId)
}
</script>

<style scoped>
.pipeline-wrapper {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--card-shadow);
}

.pipeline {
  display: flex;
  align-items: center;
  gap: 4px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.stage-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 110px;
  padding: 12px 8px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
  position: relative;
  flex: 1;
}

.stage-item:hover {
  background: #f8fafc;
}

.stage-item.current {
  border-color: #1a73e8;
  background: #e8f0fe;
}

.stage-item.completed {
  background: #f0fdf4;
}

.stage-item.expanded {
  border-color: #1a73e8;
}

.stage-indicator {
  margin-bottom: 8px;
}

.stage-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
}

.stage-item.completed .stage-circle {
  background: #52c41a;
  color: white;
}

.stage-item.current .stage-circle {
  background: #1a73e8;
  color: white;
  box-shadow: 0 0 0 4px rgba(26, 115, 232, 0.2);
}

.stage-item.upcoming .stage-circle {
  background: #e5e7eb;
  color: #9ca3af;
}

.stage-info {
  text-align: center;
}

.stage-label {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  line-height: 1.3;
}

.stage-item.upcoming .stage-label {
  color: #9ca3af;
}

.stage-sub {
  margin-top: 4px;
}

.stage-status {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
}

.stage-status.done {
  background: #f0fdf4;
  color: #15803d;
}

.stage-status.active {
  background: #e8f0fe;
  color: #1a73e8;
}

.stage-status.pending {
  background: #f3f4f6;
  color: #9ca3af;
}

.stage-progress-mini {
  margin-top: 4px;
}

.deliverable-count {
  font-size: 11px;
  color: #6b7280;
}

.expand-icon {
  position: absolute;
  bottom: 6px;
  right: 6px;
  color: #9ca3af;
}

.pipeline-arrow {
  color: #d1d5db;
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
  padding-top: 16px;
}

.pipeline-arrow.active {
  color: #52c41a;
}

/* Stage detail */
.stage-detail {
  margin-top: 20px;
  border-top: 1px solid #e5e7eb;
  padding-top: 20px;
}

.stage-detail-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.stage-detail-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
