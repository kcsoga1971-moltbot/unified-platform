<template>
  <div class="task-card" :class="urgencyClass">
    <div class="task-header">
      <div class="task-title-row">
        <span class="task-title">{{ task.title }}</span>
        <el-tag :type="priorityType" size="small">
          {{ $t(`task.priorities.${task.priority}`) }}
        </el-tag>
      </div>
    </div>

    <div class="task-meta">
      <div class="meta-item">
        <el-icon size="13"><FolderOpened /></el-icon>
        <span>{{ task.projectName }}</span>
      </div>
      <div class="meta-item">
        <el-icon size="13"><Grid /></el-icon>
        <span>{{ $t(`stages.${task.stage}`) }}</span>
      </div>
      <div class="meta-item" v-if="task.assigneeName">
        <el-icon size="13"><User /></el-icon>
        <span>{{ task.assigneeName }}</span>
      </div>
      <div class="meta-item" :class="dueDateClass">
        <el-icon size="13"><Calendar /></el-icon>
        <span>{{ formatDueDate() }}</span>
      </div>
    </div>

    <div class="task-footer">
      <el-tag :type="statusType" size="small">
        {{ statusLabel }}
      </el-tag>
      <div class="task-actions">
        <el-button
          v-if="task.status !== 'done'"
          size="small"
          type="success"
          text
          @click.stop="$emit('complete', task.id)"
        >
          <el-icon><Check /></el-icon>
          {{ $t('task.markComplete') }}
        </el-button>
        <el-button size="small" text @click.stop="$emit('edit', task)">
          <el-icon><Edit /></el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import { isOverdue, isDueToday } from '../../../utils/rdm-helpers.js'

const { t } = useI18n()

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
})

defineEmits(['complete', 'edit'])

const priorityType = computed(() => {
  const map = { high: 'danger', medium: 'warning', low: 'info' }
  return map[props.task.priority] || 'info'
})

const statusType = computed(() => {
  const map = { todo: 'info', in_progress: 'primary', review: 'warning', done: 'success' }
  return map[props.task.status] || 'info'
})

const statusLabel = computed(() => {
  const map = {
    todo: t('task.statusTodo'),
    in_progress: t('task.statusInProgress'),
    review: t('task.statusReview'),
    done: t('task.statusDone'),
  }
  return map[props.task.status] || props.task.status
})

const urgencyClass = computed(() => {
  if (props.task.status === 'done') return 'status-done'
  if (isOverdue(props.task.dueDate)) return 'urgency-overdue'
  if (isDueToday(props.task.dueDate)) return 'urgency-today'
  return ''
})

const dueDateClass = computed(() => {
  if (props.task.status === 'done') return ''
  if (isOverdue(props.task.dueDate)) return 'overdue'
  if (isDueToday(props.task.dueDate)) return 'due-today'
  return ''
})

function formatDueDate() {
  if (!props.task.dueDate) return '-'
  const d = dayjs(props.task.dueDate)
  if (isOverdue(props.task.dueDate) && props.task.status !== 'done') {
    return `${t('task.overdue')}: ${d.format('MM/DD')}`
  }
  if (isDueToday(props.task.dueDate)) {
    return t('task.dueToday')
  }
  return d.format('YYYY-MM-DD')
}
</script>

<style scoped>
.task-card {
  background: white;
  border-radius: 10px;
  padding: 14px 16px;
  border: 1px solid #e5e7eb;
  box-shadow: var(--card-shadow);
  transition: all 0.2s;
  cursor: default;
}

.task-card:hover {
  border-color: #1a73e8;
  box-shadow: 0 2px 8px rgba(26, 115, 232, 0.1);
}

.task-card.urgency-overdue {
  border-left: 3px solid #f5222d;
  background: #fff5f5;
}

.task-card.urgency-today {
  border-left: 3px solid #faad14;
  background: #fffdf0;
}

.task-card.status-done {
  opacity: 0.7;
}

.task-header {
  margin-bottom: 10px;
}

.task-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.task-title {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  flex: 1;
  line-height: 1.4;
}

.task-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #6b7280;
}

.meta-item.overdue {
  color: #f5222d;
  font-weight: 500;
}

.meta-item.due-today {
  color: #d97706;
  font-weight: 500;
}

.task-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.task-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
