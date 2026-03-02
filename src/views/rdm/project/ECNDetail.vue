<template>
  <div class="page-container">
    <div class="page-header">
      <el-button @click="$router.back()" text>← {{ $t('common.back') }}</el-button>
      <h1 class="page-title">
        {{ isNew ? $t('ecn.createECN') : (record?.ecnNo + ' — ' + record?.title) }}
      </h1>
      <el-tag v-if="record && !isNew" :type="statusType(record.status)" size="large">
        {{ $t(`ecn.status.${record.status}`) }}
      </el-tag>
    </div>

    <!-- Form (new or edit draft) -->
    <div v-if="isNew || record?.status === 'draft'" class="ecn-form-wrapper">
      <el-card>
        <el-form :model="form" label-position="top" size="small">
          <div class="form-row">
            <el-form-item :label="$t('ecn.type.label')" style="flex:1">
              <el-select v-model="form.type" style="width:100%">
                <el-option :label="$t('ecn.type.spec')" value="spec" />
                <el-option :label="$t('ecn.type.material')" value="material" />
                <el-option :label="$t('ecn.type.process')" value="process" />
                <el-option :label="$t('ecn.type.design')" value="design" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('ecn.priority')" style="flex:1">
              <el-select v-model="form.priority" style="width:100%">
                <el-option :label="$t('ecn.priorityOptions.critical')" value="critical" />
                <el-option :label="$t('ecn.priorityOptions.high')" value="high" />
                <el-option :label="$t('ecn.priorityOptions.medium')" value="medium" />
                <el-option :label="$t('ecn.priorityOptions.low')" value="low" />
              </el-select>
            </el-form-item>
          </div>
          <el-form-item :label="$t('ecn.title')">
            <el-input v-model="form.title" :placeholder="$t('ecn.titlePlaceholder')" />
          </el-form-item>
          <el-form-item :label="$t('task.project')">
            <el-select v-model="form.projectId" style="width:100%">
              <el-option v-for="p in projects" :key="p.id" :label="p.name" :value="p.id" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('ecn.reason')">
            <el-input v-model="form.reason" type="textarea" :rows="3" />
          </el-form-item>
          <el-form-item :label="$t('ecn.description')">
            <el-input v-model="form.description" type="textarea" :rows="4" />
          </el-form-item>
          <el-form-item :label="$t('ecn.impactAnalysis')">
            <el-input v-model="form.impactAnalysis" type="textarea" :rows="3" />
          </el-form-item>
          <el-form-item :label="$t('ecn.implementationPlan')">
            <el-input v-model="form.implementationPlan" type="textarea" :rows="3" />
          </el-form-item>
          <div class="form-actions">
            <el-button @click="$router.back()">{{ $t('common.cancel') }}</el-button>
            <el-button @click="saveDraft">{{ $t('ecn.saveDraft') }}</el-button>
            <el-button type="primary" @click="submitForReview">{{ $t('ecn.submitReview') }}</el-button>
          </div>
        </el-form>
      </el-card>
    </div>

    <!-- View Mode (existing non-draft record) -->
    <div v-else-if="record" class="ecn-view">
      <!-- Details Card -->
      <el-card class="detail-card">
        <template #header>{{ $t('ecn.basicInfo') }}</template>
        <el-descriptions :column="3" border size="small">
          <el-descriptions-item :label="$t('ecn.ecnNo')">{{ record.ecnNo }}</el-descriptions-item>
          <el-descriptions-item :label="$t('ecn.type.label')">
            <el-tag size="small">{{ $t(`ecn.type.${record.type}`) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item :label="$t('ecn.priority')">
            <el-tag :type="priorityType(record.priority)" size="small">
              {{ $t(`ecn.priority.${record.priority}`) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item :label="$t('task.project')" :span="2">{{ record.projectName }}</el-descriptions-item>
          <el-descriptions-item :label="$t('ecn.initiator')">{{ record.initiatorName }}</el-descriptions-item>
          <el-descriptions-item :label="$t('ecn.title')" :span="3">{{ record.title }}</el-descriptions-item>
          <el-descriptions-item :label="$t('ecn.reason')" :span="3">{{ record.reason }}</el-descriptions-item>
          <el-descriptions-item :label="$t('ecn.description')" :span="3">{{ record.description }}</el-descriptions-item>
          <el-descriptions-item :label="$t('ecn.impactAnalysis')" :span="3">{{ record.impactAnalysis }}</el-descriptions-item>
          <el-descriptions-item :label="$t('ecn.implementationPlan')" :span="3">{{ record.implementationPlan }}</el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- Workflow Timeline -->
      <el-card class="workflow-card">
        <template #header>{{ $t('ecn.workflow') }}</template>
        <el-timeline>
          <el-timeline-item
            v-for="(step, idx) in record.workflow"
            :key="step.id || idx"
            :type="stepType(step.status || (step.step === 'approved' ? 'completed' : 'completed'))"
            :timestamp="step.date || ''"
          >
            <div class="timeline-step">
              <span class="step-role">{{ step.role ? $t(`ecn.workflow.${step.role}`) : step.step }}</span>
              <el-tag :type="stepType(step.status)" size="small" v-if="step.status">
                {{ $t(`ecn.workflowStatus.${step.status}`) }}
              </el-tag>
            </div>
            <div v-if="step.approver || step.actor" class="step-approver">{{ step.approver || step.actor }}</div>
            <div v-if="step.comments || step.comment" class="step-comments">{{ step.comments || step.comment }}</div>

            <!-- Action for pending step (if can approve) -->
            <div v-if="step.status === 'pending' && canApprove" class="step-actions">
              <el-input
                v-model="approvalComment"
                :placeholder="$t('ecn.approvalCommentPlaceholder')"
                size="small"
                style="width: 300px; margin-right: 8px"
              />
              <el-button size="small" type="success" @click="approve(step)">{{ $t('ecn.approve') }}</el-button>
              <el-button size="small" type="danger" @click="reject(step)">{{ $t('ecn.reject') }}</el-button>
            </div>
          </el-timeline-item>
        </el-timeline>
      </el-card>

      <!-- Implement button for approved -->
      <div v-if="record.status === 'approved' && canApprove" class="implement-row">
        <el-button type="primary" @click="markImplemented">
          {{ $t('ecn.markImplemented') }}
        </el-button>
      </div>
    </div>

    <el-empty v-else :description="$t('common.noData')" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { useProjectStore } from '../../../stores/rdm-project.js'
import { useUserStore } from '../../../stores/rdm-user.js'
import { loadFromLocalStorage, saveToLocalStorage } from '../../../utils/rdm-helpers.js'
import { DEMO_ECN_RECORDS } from '../../../utils/rdm-demoData.js'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const projectStore = useProjectStore()
const userStore = useUserStore()

const isNew = computed(() => route.params.id === 'new' || !route.params.id)

function normalizeEcn(r) {
  return {
    ...r,
    ecnNo: r.ecnNo || r.ecnNumber,
    type: r.type || r.changeType,
    initiatorName: r.initiatorName || r.requestorName,
  }
}

const records = ref(loadFromLocalStorage('rdm_ecn', DEMO_ECN_RECORDS).map(normalizeEcn))
const projects = computed(() => projectStore.projects)
const canApprove = computed(() => userStore.canApproveGate())

const record = computed(() => {
  if (isNew.value) return null
  return records.value.find(r => r.id === route.params.id) || null
})

const form = ref({
  type: 'spec',
  priority: 'medium',
  title: '',
  projectId: '',
  reason: '',
  description: '',
  impactAnalysis: '',
  implementationPlan: '',
})

const approvalComment = ref('')

function statusType(s) {
  const map = { draft: 'info', pending: 'warning', approved: 'success', rejected: 'danger', implemented: '' }
  return map[s] || 'info'
}

function priorityType(p) {
  const map = { critical: 'danger', high: 'warning', medium: '', low: 'success' }
  return map[p] || 'info'
}

function stepType(s) {
  const map = { completed: 'success', pending: 'warning', rejected: 'danger', waiting: 'info' }
  return map[s] || 'info'
}

function generateEcnNo() {
  const d = new Date()
  return `ECN-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}-${String(records.value.length+1).padStart(3,'0')}`
}

function buildNewRecord(status) {
  const project = projectStore.getProjectById(form.value.projectId)
  return {
    id: 'ecn_' + Date.now(),
    ecnNo: generateEcnNo(),
    ...form.value,
    projectName: project?.name || '',
    initiatorId: userStore.currentUser?.id,
    initiatorName: userStore.currentUser?.name || 'Unknown',
    status,
    workflow: [
      { id: 'w1', role: 'initiator', status: 'completed', approver: userStore.currentUser?.name, date: new Date().toISOString().split('T')[0], comments: '' },
      { id: 'w2', role: 'engineer', status: status === 'pending' ? 'pending' : 'waiting', approver: '', date: '', comments: '' },
      { id: 'w3', role: 'manager', status: 'waiting', approver: '', date: '', comments: '' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

function saveDraft() {
  const newRecord = buildNewRecord('draft')
  records.value.unshift(newRecord)
  saveToLocalStorage('rdm_ecn', records.value)
  ElMessage.success(t('common.saved'))
  router.push(`/ecn/${newRecord.id}`)
}

function submitForReview() {
  if (!form.value.title || !form.value.projectId) {
    ElMessage.error(t('common.required'))
    return
  }
  const newRecord = buildNewRecord('pending')
  records.value.unshift(newRecord)
  saveToLocalStorage('rdm_ecn', records.value)
  ElMessage.success(t('ecn.submitted'))
  router.push(`/ecn/${newRecord.id}`)
}

function approve(step) {
  const idx = records.value.findIndex(r => r.id === record.value?.id)
  if (idx === -1) return
  const rec = { ...records.value[idx] }
  const stepIdx = rec.workflow.findIndex(w => w.id === step.id)
  rec.workflow[stepIdx].status = 'completed'
  rec.workflow[stepIdx].approver = userStore.currentUser?.name
  rec.workflow[stepIdx].date = new Date().toISOString().split('T')[0]
  rec.workflow[stepIdx].comments = approvalComment.value
  // advance next step
  if (stepIdx + 1 < rec.workflow.length) {
    rec.workflow[stepIdx + 1].status = 'pending'
  } else {
    rec.status = 'approved'
  }
  rec.updatedAt = new Date().toISOString()
  records.value[idx] = rec
  saveToLocalStorage('rdm_ecn', records.value)
  approvalComment.value = ''
  ElMessage.success(t('ecn.approved'))
}

function reject(step) {
  const idx = records.value.findIndex(r => r.id === record.value?.id)
  if (idx === -1) return
  const rec = { ...records.value[idx] }
  const stepIdx = rec.workflow.findIndex(w => w.id === step.id)
  rec.workflow[stepIdx].status = 'rejected'
  rec.workflow[stepIdx].approver = userStore.currentUser?.name
  rec.workflow[stepIdx].date = new Date().toISOString().split('T')[0]
  rec.workflow[stepIdx].comments = approvalComment.value
  rec.status = 'rejected'
  rec.updatedAt = new Date().toISOString()
  records.value[idx] = rec
  saveToLocalStorage('rdm_ecn', records.value)
  approvalComment.value = ''
  ElMessage.warning(t('ecn.rejected'))
}

function markImplemented() {
  const idx = records.value.findIndex(r => r.id === record.value?.id)
  if (idx === -1) return
  records.value[idx].status = 'implemented'
  records.value[idx].implementedAt = new Date().toISOString()
  saveToLocalStorage('rdm_ecn', records.value)
  ElMessage.success(t('ecn.implementedSuccess'))
}
</script>

<style scoped>
.page-container { max-width: 1100px; }
.page-header { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }
.page-title { font-size: 20px; font-weight: 700; color: #111827; margin: 0; flex: 1; }

.form-row { display: flex; gap: 16px; }
.form-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 8px; }

.detail-card { margin-bottom: 16px; }
.workflow-card { margin-bottom: 16px; }

.timeline-step { display: flex; align-items: center; gap: 8px; }
.step-role { font-size: 14px; font-weight: 600; color: #111827; }
.step-approver { font-size: 13px; color: #374151; margin-top: 4px; }
.step-comments { font-size: 12px; color: #6b7280; margin-top: 4px; font-style: italic; }
.step-actions { margin-top: 8px; display: flex; align-items: center; gap: 8px; }

.implement-row { display: flex; justify-content: flex-end; margin-top: 8px; }
</style>
