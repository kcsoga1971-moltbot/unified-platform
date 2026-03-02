<template>
  <div class="ai-assistant-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">{{ $t('ai.assistant') }}</h1>
        <p class="page-sub">{{ $t('ai.humanLoopNote') }}</p>
      </div>
      <el-tag type="warning" size="large">
        <el-icon><UserFilled /></el-icon>
        {{ $t('ai.humanInLoop') }}
      </el-tag>
    </div>

    <el-tabs v-model="activeTab" type="border-card" class="ai-tabs">
      <!-- Email Inbox Tab -->
      <el-tab-pane name="email">
        <template #label>
          <span>
            <el-icon><Message /></el-icon>
            {{ $t('ai.emailInbox') }}
            <el-badge v-if="emails.length > 0" :value="emails.length" style="margin-left: 6px" />
          </span>
        </template>

        <div class="email-list">
          <div v-if="emails.length === 0" class="empty-state">
            {{ $t('ai.noEmails') }}
          </div>
          <div
            v-for="email in emails"
            :key="email.id"
            class="email-card"
            :class="{ expanded: expandedEmail === email.id }"
          >
            <div class="email-header" @click="toggleEmail(email.id)">
              <div class="email-info">
                <div class="email-from">
                  <div class="sender-avatar">{{ email.fromName.slice(0, 2).toUpperCase() }}</div>
                  <div>
                    <div class="sender-name">{{ email.fromName }}</div>
                    <div class="sender-email">{{ email.from }}</div>
                  </div>
                </div>
                <div class="email-subject">{{ email.subject }}</div>
              </div>
              <div class="email-meta">
                <span class="email-date">{{ formatDate(email.date) }}</span>
                <el-icon><component :is="expandedEmail === email.id ? 'ArrowUp' : 'ArrowDown'" /></el-icon>
              </div>
            </div>

            <div v-if="expandedEmail === email.id" class="email-body">
              <div class="ai-summary-box">
                <div class="summary-label">
                  <el-icon><MagicStick /></el-icon>
                  {{ $t('ai.aiSummary') }}
                </div>
                <p class="summary-text">{{ email.aiSummary }}</p>
              </div>

              <div class="email-tasks" v-if="email.hasExtractedTasks">
                <div class="tasks-label">{{ $t('ai.suggestedTasks') }}</div>
                <div
                  v-for="aiTaskId in email.aiTaskIds"
                  :key="aiTaskId"
                  class="ai-task-preview"
                >
                  <template v-if="getAiTask(aiTaskId)">
                    <div class="ai-task-title">{{ getAiTask(aiTaskId)?.title }}</div>
                    <el-tag size="small" :type="getPriorityType(getAiTask(aiTaskId)?.priority)">
                      {{ $t(`common.${getAiTask(aiTaskId)?.priority}`) }}
                    </el-tag>
                    <el-tag size="small" type="warning">
                      {{ $t('ai.pendingConfirmation') }}
                    </el-tag>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <!-- Meeting Minutes Tab -->
      <el-tab-pane name="meeting">
        <template #label>
          <span>
            <el-icon><VideoCamera /></el-icon>
            {{ $t('ai.meetingMinutes') }}
          </span>
        </template>

        <div class="meeting-section">
          <div class="upload-meeting-card">
            <el-icon size="48" color="#94a3b8"><VideoCamera /></el-icon>
            <h3>{{ $t('ai.uploadMeeting') }}</h3>
            <p>{{ $t('ai.uploadMeetingHint') }}</p>
            <el-button type="primary" @click="simulateMeetingUpload">
              <el-icon><Upload /></el-icon>
              {{ $t('ai.uploadMeeting') }}
            </el-button>
          </div>

          <div v-if="meetingProcessed" class="meeting-result">
            <el-alert type="success" :closable="false" style="margin-bottom: 16px">
              {{ $t('ai.meetingProcessing') }}
            </el-alert>

            <div class="meeting-output">
              <h4>{{ $t('ai.aiSummary') }}</h4>
              <p>2026年2月25日PVT进度评审会摘要：讨论了AG-Film Pro项目PVT阶段进展，确认良率达92%。识别出3项行动事项，包括设备校准、SOP文件完善和SPC数据补充。下次会议定于3月4日。</p>
              <div class="action-items">
                <h4>{{ $t('ai.suggestedTasks') }}</h4>
                <el-tag type="warning" style="margin-bottom: 12px">
                  {{ $t('ai.reviewRequired') }}
                </el-tag>
                <div
                  v-for="aiTask in meetingAiTasks"
                  :key="aiTask.id"
                  class="meeting-task-card"
                >
                  <div class="meeting-task-header">
                    <span class="meeting-task-title">{{ aiTask.title }}</span>
                    <el-tag size="small" type="warning">{{ $t('ai.pendingConfirmation') }}</el-tag>
                  </div>
                  <p class="meeting-task-desc">{{ aiTask.aiSummary }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <!-- Task Review Queue Tab -->
      <el-tab-pane name="queue">
        <template #label>
          <span>
            <el-icon><Bell /></el-icon>
            {{ $t('ai.taskReviewQueue') }}
            <el-badge
              v-if="pendingAiTasks.length > 0"
              :value="pendingAiTasks.length"
              type="danger"
              style="margin-left: 6px"
            />
          </span>
        </template>

        <div class="queue-header">
          <el-alert type="warning" :closable="false" style="margin-bottom: 20px">
            <template #title>
              <span>
                <el-icon><InfoFilled /></el-icon>
                {{ $t('ai.humanLoopNote') }}
              </span>
            </template>
          </el-alert>

          <div v-if="pendingAiTasks.length > 0" class="bulk-actions">
            <el-button type="success" size="small" @click="approveAll">
              <el-icon><Check /></el-icon>
              {{ $t('ai.approveAll') }}
            </el-button>
          </div>
        </div>

        <div v-if="pendingAiTasks.length === 0" class="empty-state">
          <el-icon size="60" color="#d1d5db"><CircleCheck /></el-icon>
          <p>{{ $t('ai.noQueue') }}</p>
        </div>

        <div class="ai-task-queue">
          <div
            v-for="aiTask in allAiTasks"
            :key="aiTask.id"
            class="ai-task-card"
            :class="`status-${aiTask.status}`"
          >
            <div class="ai-task-card-header">
              <div class="ai-task-header-left">
                <el-tag size="small" :type="sourceTagType(aiTask.source)">
                  <el-icon><component :is="aiTask.source === 'email' ? 'Message' : 'VideoCamera'" /></el-icon>
                  {{ aiTask.source === 'email' ? $t('ai.emailSource') : $t('ai.meetingSource') }}
                </el-tag>
                <el-tag
                  size="small"
                  :type="aiTask.status === 'pending' ? 'warning' : aiTask.status === 'approved' ? 'success' : 'danger'"
                >
                  {{ aiTask.status === 'pending' ? $t('ai.pendingConfirmation') : aiTask.status === 'approved' ? $t('common.approved') : $t('common.rejected') }}
                </el-tag>
              </div>
              <el-tag size="small" :type="getPriorityType(aiTask.priority)">
                {{ $t(`common.${aiTask.priority}`) }}
              </el-tag>
            </div>

            <h4 class="ai-task-title">{{ aiTask.title }}</h4>
            <p class="ai-task-desc">{{ aiTask.description }}</p>

            <div class="ai-task-meta">
              <div class="meta-item">
                <el-icon size="13"><User /></el-icon>
                <span>{{ $t('ai.assignee') }}: {{ aiTask.assigneeName }}</span>
              </div>
              <div class="meta-item">
                <el-icon size="13"><Calendar /></el-icon>
                <span>{{ $t('ai.suggestedDueDate') }}: {{ aiTask.dueDate }}</span>
              </div>
              <div class="meta-item">
                <el-icon size="13"><FolderOpened /></el-icon>
                <span>{{ aiTask.projectName }}</span>
              </div>
            </div>

            <div class="ai-summary-box" style="margin: 12px 0">
              <div class="summary-label">
                <el-icon><MagicStick /></el-icon>
                {{ $t('ai.aiSummary') }}
              </div>
              <p class="summary-text">{{ aiTask.aiSummary }}</p>
              <div class="source-detail">
                <el-icon size="12"><Document /></el-icon>
                {{ aiTask.sourceDetail }}
              </div>
            </div>

            <div v-if="aiTask.status === 'pending'" class="ai-task-actions">
              <el-button type="success" size="small" @click="approveTask(aiTask.id)">
                <el-icon><Check /></el-icon>
                {{ $t('ai.approve') }}
              </el-button>
              <el-button size="small" @click="editAiTask(aiTask)">
                <el-icon><Edit /></el-icon>
                {{ $t('ai.edit') }}
              </el-button>
              <el-button type="danger" size="small" plain @click="rejectTask(aiTask.id)">
                <el-icon><Close /></el-icon>
                {{ $t('ai.reject') }}
              </el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- Edit AI Task Dialog -->
    <TaskForm v-model="showTaskForm" :task="editingAiTask" @save="onAiTaskSave" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { useTaskStore } from '../../../stores/rdm-task.js'
import TaskForm from '../../../components/rdm/task/TaskForm.vue'
import { DEMO_EMAILS } from '../../../utils/rdm-demoData.js'
import { formatDate, getPriorityType } from '../../../utils/rdm-helpers.js'

const { t } = useI18n()
const taskStore = useTaskStore()

const activeTab = ref('queue')
const expandedEmail = ref(null)
const meetingProcessed = ref(false)
const showTaskForm = ref(false)
const editingAiTask = ref(null)

const emails = ref(DEMO_EMAILS)
const allAiTasks = computed(() => taskStore.aiTasks)
const pendingAiTasks = computed(() => taskStore.pendingAiTasks)

const meetingAiTasks = computed(() =>
  allAiTasks.value.filter((t) => t.source === 'meeting').slice(0, 2),
)

function getAiTask(id) {
  return allAiTasks.value.find((t) => t.id === id)
}

function toggleEmail(id) {
  expandedEmail.value = expandedEmail.value === id ? null : id
}

function sourceTagType(source) {
  return source === 'email' ? 'primary' : 'success'
}

function approveTask(id) {
  taskStore.approveAiTask(id)
  ElMessage.success(t('ai.approvedSuccess'))
}

function rejectTask(id) {
  taskStore.rejectAiTask(id)
  ElMessage.success(t('ai.rejectedSuccess'))
}

function approveAll() {
  const pending = [...pendingAiTasks.value]
  for (const task of pending) {
    taskStore.approveAiTask(task.id)
  }
  ElMessage.success(`${pending.length} ${t('ai.approvedSuccess')}`)
}

function editAiTask(aiTask) {
  editingAiTask.value = {
    title: aiTask.title,
    description: aiTask.description,
    projectId: aiTask.projectId,
    projectName: aiTask.projectName,
    stage: aiTask.stage,
    assigneeId: aiTask.assigneeId,
    assigneeName: aiTask.assigneeName,
    dueDate: aiTask.dueDate,
    priority: aiTask.priority,
    status: 'todo',
  }
  showTaskForm.value = true
}

function onAiTaskSave(taskData) {
  taskStore.createTask(taskData)
  ElMessage.success(t('ai.approvedSuccess'))
  editingAiTask.value = null
}

function simulateMeetingUpload() {
  meetingProcessed.value = false
  setTimeout(() => {
    meetingProcessed.value = true
    ElMessage.success(t('common.operationSuccess'))
  }, 1500)
}
</script>

<style scoped>
.ai-assistant-page {
  max-width: 1100px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
}

.page-sub {
  font-size: 13px;
  color: #6b7280;
  margin-top: 4px;
  max-width: 600px;
}

.ai-tabs {
  min-height: 400px;
}

/* Email */
.email-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.email-card {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
  background: white;
}

.email-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.email-header:hover {
  background: #f8fafc;
}

.email-info {
  flex: 1;
}

.email-from {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.sender-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #1a73e8;
  color: white;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
}

.sender-name {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.sender-email {
  font-size: 12px;
  color: #9ca3af;
}

.email-subject {
  font-size: 14px;
  color: #111827;
  font-weight: 500;
}

.email-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.email-date {
  font-size: 12px;
  color: #9ca3af;
}

.email-body {
  padding: 16px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

/* AI Summary Box */
.ai-summary-box {
  background: #e8f0fe;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
}

.summary-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #1a73e8;
  margin-bottom: 6px;
}

.summary-text {
  font-size: 13px;
  color: #374151;
  line-height: 1.5;
}

.source-detail {
  font-size: 11px;
  color: #6b7280;
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.email-tasks {
  margin-top: 12px;
}

.tasks-label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.ai-task-preview {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  margin-bottom: 6px;
}

.ai-task-title {
  flex: 1;
  font-size: 13px;
  color: #374151;
}

/* Meeting */
.meeting-section {
  padding: 8px;
}

.upload-meeting-card {
  text-align: center;
  padding: 60px;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  background: #f9fafb;
  margin-bottom: 24px;
}

.upload-meeting-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin: 16px 0 8px;
}

.upload-meeting-card p {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 20px;
}

.meeting-result {
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e5e7eb;
}

.meeting-output h4 {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.meeting-output p {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 16px;
  line-height: 1.5;
}

.action-items {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.meeting-task-card {
  padding: 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-top: 10px;
}

.meeting-task-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
}

.meeting-task-title {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

.meeting-task-desc {
  font-size: 12px;
  color: #6b7280;
}

/* Queue */
.queue-header {
  margin-bottom: 4px;
}

.bulk-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.ai-task-queue {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ai-task-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 18px;
  transition: all 0.2s;
}

.ai-task-card.status-pending {
  border-left: 4px solid #faad14;
}

.ai-task-card.status-approved {
  border-left: 4px solid #52c41a;
  opacity: 0.8;
}

.ai-task-card.status-rejected {
  border-left: 4px solid #f5222d;
  opacity: 0.6;
}

.ai-task-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.ai-task-header-left {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.ai-task-title {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 6px;
}

.ai-task-desc {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
  margin-bottom: 12px;
}

.ai-task-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 8px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #6b7280;
}

.ai-task-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f3f4f6;
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
</style>
