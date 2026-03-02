<template>
  <div class="page-container">
    <div class="page-header">
      <el-button @click="$router.back()" text>← {{ $t('common.back') }}</el-button>
      <h1 class="page-title">{{ $t('gateReview.title') }} — {{ project?.name }}</h1>
      <el-tag :type="stageTagType" size="large">
        {{ $t('gateReview.stage') }} {{ currentStage }}: {{ stageName }}
      </el-tag>
    </div>

    <div v-if="project" class="gate-content">
      <!-- Stage Gate Progress Bar -->
      <el-card class="stages-card">
        <div class="stages-strip">
          <div
            v-for="(s, idx) in stages"
            :key="idx"
            class="stage-node"
            :class="{
              completed: idx < project.currentStage,
              current: idx === project.currentStage,
              future: idx > project.currentStage,
            }"
          >
            <div class="stage-circle">{{ idx }}</div>
            <div class="stage-label">{{ s }}</div>
          </div>
        </div>
      </el-card>

      <div class="gate-body">
        <!-- Left: Deliverables -->
        <el-card class="deliverables-card">
          <template #header>
            <div class="card-header-row">
              <span>{{ $t('gateReview.deliverables') }}</span>
              <el-progress
                :percentage="deliverablesProgress"
                style="width: 120px"
                :color="deliverablesProgress === 100 ? '#10b981' : '#1a73e8'"
              />
            </div>
          </template>

          <div v-if="deliverables.length" class="deliverables-list">
            <div
              v-for="d in deliverables"
              :key="d.id"
              class="deliverable-item"
              :class="{ completed: d.completed }"
            >
              <el-icon v-if="d.completed" color="#10b981"><CircleCheck /></el-icon>
              <el-icon v-else color="#9ca3af"><CircleClose /></el-icon>
              <div class="deliverable-info">
                <div class="deliverable-name">{{ d.nameZh || d.nameEn }}</div>
                <div class="deliverable-desc">{{ d.nameEn }}</div>
              </div>
              <el-tag :type="d.completed ? 'success' : 'info'" size="small">
                {{ d.completed ? $t('common.done') : $t('common.pending') }}
              </el-tag>
            </div>
          </div>
          <el-empty v-else :description="$t('common.noData')" />
        </el-card>

        <!-- Right: Reviews and Vote -->
        <div class="right-panel">
          <!-- Past Gate Reviews -->
          <el-card class="reviews-card">
            <template #header>{{ $t('gateReview.history') }}</template>
            <div v-if="gateReviews.length" class="reviews-list">
              <div v-for="gr in gateReviews" :key="gr.id" class="review-item">
                <div class="review-meta">
                  <el-tag :type="decisionType(gr.decision)" size="small">
                    {{ $t(`gateReview.decision.${gr.decision}`) }}
                  </el-tag>
                  <span class="review-stage">Stage {{ gr.stage }}</span>
                  <span class="review-date">{{ gr.date }}</span>
                </div>
                <div class="review-reviewer">{{ gr.reviewer }}</div>
                <div class="review-comments">{{ gr.comments }}</div>
              </div>
            </div>
            <el-empty v-else :description="$t('common.noData')" />
          </el-card>

          <!-- New Vote Panel (for manager/boss/admin) -->
          <el-card v-if="canApproveGate" class="vote-card">
            <template #header>{{ $t('gateReview.newReview') }}</template>
            <el-form :model="voteForm" label-position="top" size="small">
              <el-form-item :label="$t('gateReview.decision.label')">
                <el-radio-group v-model="voteForm.decision" class="vote-radio-group">
                  <el-radio-button label="go">
                    <el-icon><CircleCheck /></el-icon> {{ $t('gateReview.vote.go') }}
                  </el-radio-button>
                  <el-radio-button label="conditional">
                    <el-icon><QuestionFilled /></el-icon> {{ $t('gateReview.vote.conditional') }}
                  </el-radio-button>
                  <el-radio-button label="hold">
                    <el-icon><VideoPause /></el-icon> {{ $t('gateReview.vote.hold') }}
                  </el-radio-button>
                  <el-radio-button label="kill">
                    <el-icon><CircleClose /></el-icon> {{ $t('gateReview.vote.kill') }}
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('gateReview.comments')">
                <el-input
                  v-model="voteForm.comments"
                  type="textarea"
                  :rows="3"
                  :placeholder="$t('gateReview.commentsPlaceholder')"
                />
              </el-form-item>
              <el-button
                type="primary"
                :disabled="!voteForm.decision || !voteForm.comments"
                @click="submitVote"
              >
                {{ $t('gateReview.submitReview') }}
              </el-button>
            </el-form>
          </el-card>
        </div>
      </div>

      <!-- Advance Stage Section -->
      <el-card v-if="canApproveGate && project.currentStage < 5" class="advance-card">
        <div class="advance-row">
          <div>
            <div class="advance-title">{{ $t('gateReview.advanceStage') }}</div>
            <div class="advance-desc">
              {{ $t('gateReview.advanceStageDesc') }}
              {{ deliverablesProgress }}% {{ $t('gateReview.deliverablesComplete') }}
            </div>
          </div>
          <el-button
            type="success"
            :disabled="deliverablesProgress < 80"
            @click="advanceStage"
          >
            {{ $t('gateReview.passToStage') }} {{ project.currentStage + 1 }}
            →
          </el-button>
        </div>
      </el-card>
    </div>

    <el-empty v-else :description="$t('common.noData')" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useProjectStore } from '../../../stores/rdm-project.js'
import { useUserStore } from '../../../stores/rdm-user.js'
import { STAGES } from '../../../utils/rdm-constants.js'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const projectStore = useProjectStore()
const userStore = useUserStore()

const projectId = route.params.id
const project = computed(() => projectStore.getProjectById(projectId))
const currentStage = computed(() => project.value?.currentStage ?? 0)
const canApproveGate = computed(() => userStore.canApproveGate())

const stages = STAGES ? STAGES.map(s => s.nameEn) : ['Discovery', 'Concept', 'DVT', 'PVT', 'MP Launch', 'MP Monitor']
const stageName = computed(() => stages[currentStage.value] || '')

const stageTagType = computed(() => {
  const s = project.value?.status
  if (s === 'on_track') return 'success'
  if (s === 'at_risk') return 'warning'
  if (s === 'delayed') return 'danger'
  return 'info'
})

const deliverables = computed(() => {
  return project.value?.deliverables?.[currentStage.value] || []
})

const deliverablesProgress = computed(() => {
  if (!deliverables.value.length) return 0
  const done = deliverables.value.filter(d => d.completed).length
  return Math.round((done / deliverables.value.length) * 100)
})

const gateReviews = computed(() => project.value?.gateReviews || [])

function decisionType(d) {
  if (d === 'pass' || d === 'go') return 'success'
  if (d === 'conditional') return 'warning'
  if (d === 'hold') return 'info'
  if (d === 'kill') return 'danger'
  return 'info'
}

const voteForm = ref({ decision: '', comments: '' })

function submitVote() {
  const review = {
    id: 'gr_' + Date.now(),
    stage: currentStage.value,
    date: new Date().toISOString().split('T')[0],
    reviewer: userStore.currentUser?.name || 'Unknown',
    decision: voteForm.value.decision,
    comments: voteForm.value.comments,
  }
  projectStore.addGateReview(projectId, review)
  ElMessage.success(t('gateReview.reviewSubmitted'))
  voteForm.value = { decision: '', comments: '' }
}

async function advanceStage() {
  try {
    await ElMessageBox.confirm(
      t('gateReview.confirmAdvance'),
      t('gateReview.advanceStage'),
      { type: 'warning' }
    )
    const nextStage = (project.value?.currentStage ?? 0) + 1
    projectStore.updateProject(projectId, { currentStage: nextStage })
    ElMessage.success(t('gateReview.stageAdvanced'))
  } catch {
    // cancelled
  }
}
</script>

<style scoped>
.page-container { max-width: 1200px; }
.page-header { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }
.page-title { font-size: 20px; font-weight: 700; color: #111827; margin: 0; flex: 1; }

.stages-card { margin-bottom: 20px; }
.stages-strip { display: flex; align-items: center; gap: 0; }
.stage-node { display: flex; flex-direction: column; align-items: center; flex: 1; position: relative; }
.stage-node:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 16px;
  left: 50%;
  width: 100%;
  height: 2px;
  background: #e5e7eb;
  z-index: 0;
}
.stage-node.completed .stage-circle { background: #10b981; color: white; }
.stage-node.current .stage-circle { background: #1a73e8; color: white; border: 3px solid #93c5fd; }
.stage-node.future .stage-circle { background: #f3f4f6; color: #9ca3af; }
.stage-circle {
  width: 32px; height: 32px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 13px; position: relative; z-index: 1;
}
.stage-label { font-size: 11px; color: #6b7280; margin-top: 6px; text-align: center; }

.gate-body { display: grid; grid-template-columns: 1fr 360px; gap: 16px; margin-bottom: 16px; }

.card-header-row { display: flex; align-items: center; justify-content: space-between; }

.deliverables-list { display: flex; flex-direction: column; gap: 10px; }
.deliverable-item {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 10px; border-radius: 8px; background: #f9fafb;
  border: 1px solid #e5e7eb; transition: border-color 0.2s;
}
.deliverable-item.completed { background: #f0fdf4; border-color: #bbf7d0; }
.deliverable-info { flex: 1; }
.deliverable-name { font-size: 14px; font-weight: 600; color: #111827; }
.deliverable-desc { font-size: 12px; color: #6b7280; margin-top: 2px; }

.right-panel { display: flex; flex-direction: column; gap: 16px; }

.reviews-list { display: flex; flex-direction: column; gap: 12px; }
.review-item { padding: 10px; background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb; }
.review-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.review-stage { font-size: 12px; color: #6b7280; }
.review-date { font-size: 12px; color: #6b7280; margin-left: auto; }
.review-reviewer { font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 4px; }
.review-comments { font-size: 13px; color: #6b7280; }

.vote-radio-group { display: flex; flex-wrap: wrap; gap: 8px; }

.advance-card {}
.advance-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.advance-title { font-size: 15px; font-weight: 600; color: #111827; margin-bottom: 4px; }
.advance-desc { font-size: 13px; color: #6b7280; }
</style>
