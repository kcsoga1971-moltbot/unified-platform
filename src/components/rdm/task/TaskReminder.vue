<template>
  <div v-if="hasReminders" class="task-reminder">
    <div v-if="overdueCount > 0" class="reminder-item overdue">
      <el-icon><Warning /></el-icon>
      <span>{{ overdueCount }} {{ $t('task.overdue') }}</span>
    </div>
    <div v-if="todayCount > 0" class="reminder-item today">
      <el-icon><Clock /></el-icon>
      <span>{{ todayCount }} {{ $t('task.dueToday') }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { isOverdue, isDueToday } from '../../../utils/rdm-helpers.js'

const props = defineProps({
  tasks: {
    type: Array,
    default: () => [],
  },
})

const activeTasks = computed(() => props.tasks.filter((t) => t.status !== 'done'))
const overdueCount = computed(() => activeTasks.value.filter((t) => isOverdue(t.dueDate)).length)
const todayCount = computed(() => activeTasks.value.filter((t) => isDueToday(t.dueDate)).length)
const hasReminders = computed(() => overdueCount.value > 0 || todayCount.value > 0)
</script>

<style scoped>
.task-reminder {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.reminder-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 500;
}

.reminder-item.overdue {
  background: #fef2f2;
  color: #b91c1c;
}

.reminder-item.today {
  background: #fffbeb;
  color: #b45309;
}
</style>
