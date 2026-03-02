<template>
  <div class="team-tasks-page">
    <div class="page-header">
      <h1 class="page-title">{{ $t('task.teamTasks') }}</h1>
      <div class="header-actions">
        <el-button-group>
          <el-button :type="viewMode === 'kanban' ? 'primary' : ''" @click="viewMode = 'kanban'">
            <el-icon><Grid /></el-icon>
            {{ $t('task.kanbanView') }}
          </el-button>
          <el-button :type="viewMode === 'list' ? 'primary' : ''" @click="viewMode = 'list'">
            <el-icon><List /></el-icon>
            {{ $t('task.listView') }}
          </el-button>
        </el-button-group>
        <el-button type="primary" @click="showTaskForm = true">
          <el-icon><Plus /></el-icon>
          {{ $t('task.create') }}
        </el-button>
      </div>
    </div>

    <!-- Filters -->
    <div class="filter-bar">
      <el-select v-model="groupBy" style="width: 160px" v-if="viewMode === 'list'">
        <el-option value="none" :label="$t('common.all')" />
        <el-option value="project" :label="$t('task.groupByProject')" />
        <el-option value="assignee" :label="$t('task.groupByAssignee')" />
        <el-option value="stage" :label="$t('task.groupByStage')" />
      </el-select>
      <el-select v-model="priorityFilter" :placeholder="$t('task.priority')" clearable style="width: 140px">
        <el-option value="high" :label="$t('common.high')" />
        <el-option value="medium" :label="$t('common.medium')" />
        <el-option value="low" :label="$t('common.low')" />
      </el-select>
      <el-select v-model="assigneeFilter" :placeholder="$t('task.assignee')" clearable style="width: 140px">
        <el-option v-for="u in users" :key="u.id" :label="u.name" :value="u.id" />
      </el-select>
      <el-button text @click="resetFilters">
        <el-icon><Refresh /></el-icon>
        {{ $t('common.reset') }}
      </el-button>
      <span class="result-count">{{ $t('common.total') }} {{ filteredTasks.length }} {{ $t('common.items') }}</span>
    </div>

    <!-- Kanban View -->
    <div v-if="viewMode === 'kanban'" class="kanban-board">
      <div v-for="col in columns" :key="col.status" class="kanban-column">
        <div class="kanban-header" :class="`col-${col.status}`">
          <span class="col-title">{{ col.label }}</span>
          <el-badge :value="kanbanTasks[col.status]?.length || 0" type="info" />
        </div>
        <div class="kanban-items">
          <TaskCard
            v-for="task in kanbanTasks[col.status]"
            :key="task.id"
            :task="task"
            @complete="onComplete"
            @edit="onEdit"
          />
          <div v-if="!kanbanTasks[col.status]?.length" class="kanban-empty">
            {{ $t('task.noTasks') }}
          </div>
        </div>
      </div>
    </div>

    <!-- List View -->
    <div v-else class="list-view">
      <template v-if="groupBy === 'none' || !groupBy">
        <div class="tasks-container">
          <TaskCard
            v-for="task in filteredTasks"
            :key="task.id"
            :task="task"
            @complete="onComplete"
            @edit="onEdit"
          />
          <div v-if="filteredTasks.length === 0" class="empty-state">
            {{ $t('task.noTasksDesc') }}
          </div>
        </div>
      </template>

      <template v-else>
        <div v-for="(group, key) in groupedTasks" :key="key" class="task-group">
          <div class="group-header">
            <span class="group-title">{{ key }}</span>
            <el-badge :value="group.length" type="info" />
          </div>
          <div class="tasks-container">
            <TaskCard
              v-for="task in group"
              :key="task.id"
              :task="task"
              @complete="onComplete"
              @edit="onEdit"
            />
          </div>
        </div>
      </template>
    </div>

    <TaskForm v-model="showTaskForm" :task="editingTask" @save="onSave" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTaskStore } from '../../../stores/rdm-task.js'
import TaskCard from '../../../components/rdm/task/TaskCard.vue'
import TaskForm from '../../../components/rdm/task/TaskForm.vue'
import { DEMO_USERS } from '../../../utils/rdm-demoData.js'
import { ElMessage } from 'element-plus'

const { t } = useI18n()
const taskStore = useTaskStore()

const viewMode = ref('kanban')
const showTaskForm = ref(false)
const editingTask = ref(null)
const groupBy = ref('none')
const priorityFilter = ref('')
const assigneeFilter = ref('')

const users = DEMO_USERS

const columns = computed(() => [
  { status: 'todo', label: t('task.column.todo') },
  { status: 'in_progress', label: t('task.column.in_progress') },
  { status: 'review', label: t('task.column.review') },
  { status: 'done', label: t('task.column.done') },
])

const filteredTasks = computed(() => {
  let tasks = taskStore.tasks
  if (priorityFilter.value) tasks = tasks.filter((t) => t.priority === priorityFilter.value)
  if (assigneeFilter.value) tasks = tasks.filter((t) => t.assigneeId === assigneeFilter.value)
  return tasks
})

const kanbanTasks = computed(() => {
  const cols = {}
  for (const col of columns.value) {
    cols[col.status] = filteredTasks.value.filter((t) => t.status === col.status)
  }
  return cols
})

const groupedTasks = computed(() => {
  const groups = {}
  for (const task of filteredTasks.value) {
    let key = ''
    if (groupBy.value === 'project') key = task.projectName || 'Unknown'
    else if (groupBy.value === 'assignee') key = task.assigneeName || 'Unassigned'
    else if (groupBy.value === 'stage') key = t(`stages.${task.stage}`)
    if (!groups[key]) groups[key] = []
    groups[key].push(task)
  }
  return groups
})

function resetFilters() {
  priorityFilter.value = ''
  assigneeFilter.value = ''
}

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
    taskStore.createTask(taskData)
    ElMessage.success(t('task.createSuccess'))
  }
  editingTask.value = null
}
</script>

<style scoped>
.team-tasks-page {
  max-width: 1400px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.filter-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.result-count {
  font-size: 13px;
  color: #6b7280;
  margin-left: auto;
}

/* Kanban */
.kanban-board {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  align-items: start;
}

.kanban-column {
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #e5e7eb;
}

.kanban-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  padding: 8px 12px;
  border-radius: 8px;
}

.col-todo { background: #f3f4f6; }
.col-in_progress { background: #e8f0fe; }
.col-review { background: #fffbeb; }
.col-done { background: #f0fdf4; }

.col-title {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

.kanban-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 100px;
}

.kanban-empty {
  text-align: center;
  color: #d1d5db;
  font-size: 13px;
  padding: 20px;
}

/* List view */
.list-view {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.tasks-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.task-group {
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
}

.group-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.tasks-container {
  padding: 12px 16px;
}

.empty-state {
  text-align: center;
  color: #9ca3af;
  padding: 40px;
}

@media (max-width: 1100px) {
  .kanban-board {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .kanban-board {
    grid-template-columns: 1fr;
  }
}
</style>
