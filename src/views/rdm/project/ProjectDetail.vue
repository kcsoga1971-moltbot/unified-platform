<template>
  <div class="project-detail-page">
    <!-- Loading -->
    <div v-if="!project" class="loading-state">
      <el-empty description="项目不存在" />
      <el-button @click="$router.push('/projects')">{{ $t('common.back') }}</el-button>
    </div>

    <template v-else>
      <!-- Header -->
      <div class="project-header">
        <div class="header-left">
          <el-button text @click="$router.push('/projects')">
            <el-icon><ArrowLeft /></el-icon>
            {{ $t('common.back') }}
          </el-button>
          <div class="project-title-group">
            <h1 class="project-name">{{ project.name }}</h1>
            <div class="project-badges">
              <el-tag type="info">{{ project.code }}</el-tag>
              <el-tag>{{ project.productLine }}</el-tag>
              <StatusBadge :status="project.status" />
              <el-tag :type="priorityType">{{ $t(`project.priorities.${project.priority}`) }}</el-tag>
            </div>
          </div>
        </div>
        <div class="header-right">
          <el-button type="primary" @click="showGateReviewDialog = true">
            <el-icon><StarFilled /></el-icon>
            {{ $t('project.initiateGateReview') }}
          </el-button>
        </div>
      </div>

      <!-- Stage Gate Pipeline -->
      <div class="section">
        <StageGatePipeline
          :current-stage="project.currentStage"
          :project-id="project.id"
          :project-deliverables="project.deliverables"
          @toggle-deliverable="handleDeliverableToggle"
          @stage-click="onStageClick"
        />
      </div>

      <!-- Main Content with Tabs -->
      <div class="project-body">
        <div class="main-content">
          <el-tabs v-model="activeTab" type="border-card">
            <!-- Stage Details Tab -->
            <el-tab-pane :label="$t('project.stageDeliverables')" name="deliverables">
              <div class="stage-selector">
                <el-radio-group v-model="selectedStage" size="small">
                  <el-radio-button v-for="(s, idx) in stages" :key="s.id" :value="idx">
                    {{ idx }}. {{ $t(`stages.${idx}`) }}
                  </el-radio-button>
                </el-radio-group>
              </div>

              <div class="stage-content" v-if="project.deliverables[selectedStage]">
                <div class="stage-content-header">
                  <h3>{{ $t(`stages.${selectedStage}`) }}</h3>
                  <el-tag :type="stageTagType(selectedStage)">
                    {{ selectedStage < project.currentStage ? $t('stages.completed') : selectedStage === project.currentStage ? $t('stages.current') : $t('stages.upcoming') }}
                  </el-tag>
                </div>

                <DeliverableChecklist
                  :deliverables="project.deliverables[selectedStage]"
                  :project-id="project.id"
                  :stage-id="selectedStage"
                  :editable="selectedStage === project.currentStage"
                  @toggle="(id) => handleDeliverableToggle(selectedStage, id)"
                  @upload="openUploadForDeliverable"
                />

                <!-- Stage Notes -->
                <div class="stage-notes-section">
                  <h4>{{ $t('project.stageNotes') }}</h4>
                  <el-input
                    v-model="stageNotesText"
                    type="textarea"
                    :rows="3"
                    :placeholder="$t('project.stageNotesPlaceholder')"
                  />
                  <el-button
                    size="small"
                    type="primary"
                    style="margin-top: 8px"
                    @click="saveStageNotes"
                  >
                    {{ $t('common.save') }}
                  </el-button>
                </div>

                <!-- Stage Tasks -->
                <div class="stage-tasks-section">
                  <h4>{{ $t('project.stageTasks') }}</h4>
                  <div v-if="stageTasks.length === 0" class="no-data-text">
                    {{ $t('project.noStageTasks') }}
                  </div>
                  <div v-else class="stage-tasks-list">
                    <TaskCard
                      v-for="task in stageTasks"
                      :key="task.id"
                      :task="task"
                      @complete="onTaskComplete"
                      @edit="onTaskEdit"
                    />
                  </div>
                </div>
              </div>
            </el-tab-pane>

            <!-- Gate Review History -->
            <el-tab-pane :label="$t('project.gateReviewHistory')" name="reviews">
              <div v-if="!project.gateReviews || project.gateReviews.length === 0" class="no-data-text">
                {{ $t('gateReview.noHistory') }}
              </div>
              <el-timeline v-else>
                <el-timeline-item
                  v-for="review in project.gateReviews"
                  :key="review.id"
                  :timestamp="review.date"
                  placement="top"
                  :type="reviewDecisionType(review.decision)"
                >
                  <div class="review-card">
                    <div class="review-header">
                      <span class="review-stage">{{ $t(`stages.${review.stage}`) }}</span>
                      <el-tag :type="reviewDecisionType(review.decision)">
                        {{ $t(`gateReview.${review.decision}`) }}
                      </el-tag>
                    </div>
                    <p class="review-reviewer">{{ $t('gateReview.reviewer') }}: {{ review.reviewer }}</p>
                    <p class="review-comments">{{ review.comments }}</p>
                  </div>
                </el-timeline-item>
              </el-timeline>
            </el-tab-pane>
          </el-tabs>
        </div>

        <!-- Right Panel -->
        <div class="right-panel">
          <!-- Project Info -->
          <div class="info-card">
            <h3 class="info-card-title">{{ $t('project.projectInfo') }}</h3>
            <div class="info-items">
              <div class="info-item">
                <span class="info-label">{{ $t('project.progress') }}</span>
                <div class="info-value">
                  <el-progress :percentage="project.progress" :stroke-width="8" />
                </div>
              </div>
              <div class="info-item">
                <span class="info-label">{{ $t('project.pm') }}</span>
                <span class="info-value">{{ getPmName(project.pmId) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ $t('project.rdLocation') }}</span>
                <span class="info-value">{{ $t(`project.locations.${project.rdLocation}`) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ $t('project.mfgLocation') }}</span>
                <span class="info-value">{{ $t(`project.locations.${project.mfgLocation}`) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ $t('project.startDate') }}</span>
                <span class="info-value">{{ formatDate(project.startDate) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">{{ $t('project.endDate') }}</span>
                <span class="info-value">{{ formatDate(project.endDate) }}</span>
              </div>
            </div>
          </div>

          <!-- Team Members -->
          <div class="info-card">
            <h3 class="info-card-title">{{ $t('project.team') }}</h3>
            <div class="team-list">
              <div v-for="memberId in project.team" :key="memberId" class="team-member">
                <div class="member-avatar">{{ getMemberInitials(memberId) }}</div>
                <div class="member-info">
                  <span class="member-name">{{ getMemberName(memberId) }}</span>
                  <span class="member-role">{{ getMemberRole(memberId) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Risk Placeholder -->
          <div class="info-card risk-placeholder">
            <h3 class="info-card-title">{{ $t('project.risks') }}</h3>
            <p class="placeholder-text">{{ $t('project.phase2Placeholder') }}</p>
          </div>
        </div>
      </div>
    </template>

    <!-- Gate Review Dialog -->
    <GateReviewDialog
      v-model="showGateReviewDialog"
      :current-stage="project?.currentStage || 0"
      @submit="handleGateReviewSubmit"
    />

    <!-- Task Form Dialog -->
    <TaskForm v-model="showTaskForm" :task="editingTask" @save="onTaskSave" />

    <!-- Document Upload Dialog -->
    <DocumentUpload
      v-model="showDocumentUpload"
      :preset-project-id="project?.id"
      :preset-stage-id="selectedStage"
      @uploaded="onDocumentUploaded"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useProjectStore } from '../../../stores/rdm-project.js'
import { useTaskStore } from '../../../stores/rdm-task.js'
import StageGatePipeline from '../../../components/rdm/project/StageGatePipeline.vue'
import DeliverableChecklist from '../../../components/rdm/project/DeliverableChecklist.vue'
import GateReviewDialog from '../../../components/rdm/project/GateReviewDialog.vue'
import StatusBadge from '../../../components/common/StatusBadge.vue'
import TaskCard from '../../../components/rdm/task/TaskCard.vue'
import TaskForm from '../../../components/rdm/task/TaskForm.vue'
import DocumentUpload from '../../../components/rdm/document/DocumentUpload.vue'
import { STAGES } from '../../../utils/rdm-constants.js'
import { formatDate } from '../../../utils/rdm-helpers.js'
import { DEMO_USERS } from '../../../utils/rdm-demoData.js'

const { t } = useI18n()
const route = useRoute()
const projectStore = useProjectStore()
const taskStore = useTaskStore()

const stages = STAGES
const activeTab = ref('deliverables')
const selectedStage = ref(0)
const showGateReviewDialog = ref(false)
const showTaskForm = ref(false)
const showDocumentUpload = ref(false)
const editingTask = ref(null)

const project = computed(() => projectStore.getProjectById(route.params.id))

watch(
  () => project.value,
  (p) => {
    if (p) {
      selectedStage.value = p.currentStage
    }
  },
  { immediate: true },
)

const stageNotesText = ref('')
watch(
  [project, selectedStage],
  ([p, stage]) => {
    if (p) {
      stageNotesText.value = p.stageNotes?.[stage] || ''
    }
  },
  { immediate: true },
)

const stageTasks = computed(() => {
  if (!project.value) return []
  return taskStore.getTasksByProjectAndStage(project.value.id, selectedStage.value)
})

const priorityType = computed(() => {
  const map = { high: 'danger', medium: 'warning', low: 'info' }
  return map[project.value?.priority] || 'info'
})

function stageTagType(idx) {
  if (!project.value) return 'info'
  if (idx < project.value.currentStage) return 'success'
  if (idx === project.value.currentStage) return 'primary'
  return 'info'
}

function handleDeliverableToggle(stageId, deliverableId) {
  if (!project.value) return
  projectStore.toggleDeliverable(project.value.id, stageId, deliverableId)
}

function onStageClick(stageIdx) {
  selectedStage.value = stageIdx
}

function saveStageNotes() {
  if (!project.value) return
  projectStore.updateStageNotes(project.value.id, selectedStage.value, stageNotesText.value)
  ElMessage.success(t('common.operationSuccess'))
}

function openUploadForDeliverable() {
  showDocumentUpload.value = true
}

function handleGateReviewSubmit(review) {
  if (!project.value) return
  projectStore.addGateReview(project.value.id, review)
  ElMessage.success(t('gateReview.success'))
}

function reviewDecisionType(decision) {
  const map = { pass: 'success', fail: 'danger', conditional: 'warning' }
  return map[decision] || 'info'
}

function getPmName(pmId) {
  const user = DEMO_USERS.find((u) => u.id === pmId)
  return user?.name || pmId || '-'
}

function getMemberName(memberId) {
  return DEMO_USERS.find((u) => u.id === memberId)?.name || memberId
}

function getMemberInitials(memberId) {
  return getMemberName(memberId).slice(0, 2).toUpperCase()
}

function getMemberRole(memberId) {
  const user = DEMO_USERS.find((u) => u.id === memberId)
  return user ? t(`auth.roles.${user.role}`) : ''
}

function onTaskComplete(taskId) {
  taskStore.markComplete(taskId)
  ElMessage.success(t('common.operationSuccess'))
}

function onTaskEdit(task) {
  editingTask.value = task
  showTaskForm.value = true
}

function onTaskSave(taskData) {
  if (taskData.id) {
    taskStore.updateTask(taskData.id, taskData)
  } else {
    taskStore.createTask(taskData)
  }
  editingTask.value = null
}

function onDocumentUploaded(doc) {
  // In a real app, save to document store
  ElMessage.success(t('document.uploadSuccess'))
}
</script>

<style scoped>
.project-detail-page {
  max-width: 1400px;
}

.loading-state {
  text-align: center;
  padding: 60px;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.project-title-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.project-name {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
}

.project-badges {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.section {
  margin-bottom: 20px;
}

.project-body {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 20px;
}

.main-content {
  min-width: 0;
}

.stage-selector {
  margin-bottom: 20px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.stage-content-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.stage-content-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.stage-notes-section {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.stage-notes-section h4,
.stage-tasks-section h4 {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
}

.stage-tasks-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.stage-tasks-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.no-data-text {
  color: #9ca3af;
  font-size: 14px;
  padding: 16px 0;
}

/* Right Panel */
.right-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e5e7eb;
  box-shadow: var(--card-shadow);
}

.info-card-title {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f3f4f6;
}

.info-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.info-label {
  font-size: 13px;
  color: #6b7280;
  flex-shrink: 0;
}

.info-value {
  font-size: 13px;
  color: #374151;
  font-weight: 500;
  flex: 1;
  text-align: right;
}

.team-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.team-member {
  display: flex;
  align-items: center;
  gap: 10px;
}

.member-avatar {
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

.member-info {
  display: flex;
  flex-direction: column;
}

.member-name {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

.member-role {
  font-size: 12px;
  color: #9ca3af;
}

.risk-placeholder {
  background: #f8fafc;
  border: 1px dashed #d1d5db;
}

.placeholder-text {
  font-size: 13px;
  color: #9ca3af;
  text-align: center;
  padding: 12px 0;
}

/* Review */
.review-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 14px;
}

.review-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.review-stage {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.review-reviewer {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 6px;
}

.review-comments {
  font-size: 13px;
  color: #374151;
  line-height: 1.5;
}

@media (max-width: 1100px) {
  .project-body {
    grid-template-columns: 1fr;
  }
}
</style>
