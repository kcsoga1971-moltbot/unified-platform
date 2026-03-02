<template>
  <div class="my-tasks-page">
    <div class="page-header">
      <h1 class="page-title">{{ $t('task.myTasks') }}</h1>
      <el-button type="primary" @click="showTaskForm = true">
        <el-icon><Plus /></el-icon>
        {{ $t('task.create') }}
      </el-button>
    </div>

    <!-- Reminder Banner -->
    <TaskReminder :tasks="myTasks" style="margin-bottom: 16px" />

    <!-- Filter Tabs -->
    <div class="filter-section">
      <el-radio-group v-model="activeFilter" size="large">
        <el-radio-button value="all">
          {{ $t('task.filterAll') }}
          <el-badge :value="counts.all" type="info" style="margin-left: 6px" />
        </el-radio-button>
        <el-radio-button value="today">
          {{ $t('task.filterToday') }}
          <el-badge v-if="counts.today > 0" :value="counts.today" type="warning" style="margin-left: 6px" />
        </el-radio-button>
        <el-radio-button value="week">
          {{ $t('task.filterWeek') }}
          <el-badge v-if="counts.week > 0" :value="counts.week" style="margin-left: 6px" />
        </el-radio-button>
        <el-radio-button value="overdue">
          {{ $t('task.filterOverdue') }}
          <el-badge v-if="counts.overdue > 0" :value="counts.overdue" type="danger" style="margin-left: 6px" />
        </el-radio-button>
      </el-radio-group>

      <el-select v-model="statusFilter" :placeholder="$t('common.status')" clearable style="width: 140px">
        <el-option value="todo" :label="$t('task.statusTodo')" />
        <el-option value="in_progress" :label="$t('task.statusInProgress')" />
        <el-option value="review" :label="$t('task.statusReview')" />
        <el-option value="done" :label="$t('task.statusDone')" />
      </el-select>
    </div>

    <!-- Task List -->
    <div class="task-list">
      <div v-if="filteredTasks.length === 0" class="empty-state">
        <el-icon size="60" color="#d1d5db"><CircleCheck /></el-icon>
        <p>{{ $t('task.noTasksDesc') }}</p>
      </div>

      <TransitionGroup name="task-list-anim" tag="div" class="tasks-container">
        <TaskCard
          v-for="task in filteredTasks"
          :key="task.id"
          :task="task"
          @complete="onComplete"
          @edit="onEdit"
        />
      </TransitionGroup>
    </div>

    <TaskForm v-model="showTaskForm" :task="editingTask" @save="onSave" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '../../../stores/rdm-user.js'
import { useTaskStore } from '../../../stores/rdm-task.js'
import TaskCard from '../../../components/rdm/task/TaskCard.vue'
import TaskForm from '../../../components/rdm/task/TaskForm.vue'
import TaskReminder from '../../../components/rdm/task/TaskReminder.vue'
import { isOverdue, isDueToday, isDueThisWeek } from '../../../utils/rdm-helpers.js'
import { ElMessage } from 'element-plus'

const { t } = useI18n()
const userStore = useUserStore()
const taskStore = useTaskStore()

const showTaskForm = ref(false)
const editingTask = ref(null)
const activeFilter = ref('all')
const statusFilter = ref('')

const currentUserId = computed(() => userStore.currentUser?.id)
const myTasks = computed(() => taskStore.getTasksByUser(currentUserId.value))

const counts = computed(() => ({
  all: myTasks.value.length,
  today: myTasks.value.filter((t) => isDueToday(t.dueDate) && t.status !== 'done').length,
  week: myTasks.value.filter((t) => isDueThisWeek(t.dueDate) && t.status !== 'done').length,
  overdue: myTasks.value.filter((t) => isOverdue(t.dueDate) && t.status !== 'done').length,
}))

const filteredTasks = computed(() => {
  let tasks = myTasks.value

  switch (activeFilter.value) {
    case 'today':
      tasks = tasks.filter((t) => isDueToday(t.dueDate))
      break
    case 'week':
      tasks = tasks.filter((t) => isDueThisWeek(t.dueDate))
      break
    case 'overdue':
      tasks = tasks.filter((t) => isOverdue(t.dueDate) && t.status !== 'done')
      break
  }

  if (statusFilter.value) {
    tasks = tasks.filter((t) => t.status === statusFilter.value)
  }

  // Sort: overdue first, then by date
  return tasks.slice().sort((a, b) => {
    const aOverdue = isOverdue(a.dueDate) && a.status !== 'done'
    const bOverdue = isOverdue(b.dueDate) && b.status !== 'done'
    if (aOverdue && !bOverdue) return -1
    if (!aOverdue && bOverdue) return 1
    return new Date(a.dueDate) - new Date(b.dueDate)
  })
})

function onComplete(taskId) {
  taskStore.markComplete(taskId)
  ElMessage.success(t('common.operationSuccess'))
}

function onEdit(task) {
  editingTask.value = task
  showTaskForm.value = true
}

function onSave(taskData) {
  if (taskData.id) {
    taskStore.updateTask(taskData.id, taskData)
    ElMessage.success(t('task.updateSuccess'))
  } else {
    taskStore.createTask({ ...taskData, assigneeId: currentUserId.value })
    ElMessage.success(t('task.createSuccess'))
  }
  editingTask.value = null
}
</script>

<style scoped>
.my-tasks-page {
  max-width: 900px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
}

.filter-section {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.task-list {
  min-height: 200px;
}

.tasks-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty-state {
  text-align: center;
  padding: 60px;
  color: #9ca3af;
}

.empty-state p {
  margin-top: 12px;
  font-size: 15px;
}

.task-list-anim-enter-active,
.task-list-anim-leave-active {
  transition: all 0.3s ease;
}

.task-list-anim-enter-from,
.task-list-anim-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>
