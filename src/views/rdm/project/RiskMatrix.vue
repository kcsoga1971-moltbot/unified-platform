<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">{{ $t('risk.matrix') }}</h1>
      <el-button type="primary" @click="showAddDialog = true">
        <el-icon><Plus /></el-icon>
        {{ $t('risk.addRisk') }}
      </el-button>
    </div>

    <!-- Filters -->
    <div class="filters-row">
      <el-select v-model="filterProject" :placeholder="$t('task.project')" clearable style="width: 200px">
        <el-option v-for="p in projects" :key="p.id" :label="p.name" :value="p.id" />
      </el-select>
      <el-select v-model="filterLevel" :placeholder="$t('risk.level.label')" clearable style="width: 140px">
        <el-option label="Critical" value="critical" />
        <el-option label="High" value="high" />
        <el-option label="Medium" value="medium" />
        <el-option label="Low" value="low" />
      </el-select>
      <el-select v-model="filterStatus" :placeholder="$t('risk.status.label')" clearable style="width: 140px">
        <el-option :label="$t('risk.status.open')" value="open" />
        <el-option :label="$t('risk.status.mitigating')" value="mitigating" />
        <el-option :label="$t('risk.status.monitoring')" value="monitoring" />
        <el-option :label="$t('risk.status.closed')" value="closed" />
      </el-select>
      <el-tag type="danger">{{ criticalCount }} Critical</el-tag>
      <el-tag type="warning">{{ highCount }} High</el-tag>
      <el-tag>{{ mediumCount }} Medium</el-tag>
    </div>

    <!-- 5x5 Risk Matrix Grid -->
    <el-card class="matrix-card">
      <template #header>{{ $t('risk.matrixTitle') }}</template>
      <div class="matrix-wrapper">
        <div class="matrix-y-label">{{ $t('risk.impact') }} →</div>
        <div class="matrix-grid">
          <!-- Header row: Impact labels -->
          <div class="matrix-corner"></div>
          <div v-for="imp in 5" :key="`hi${imp}`" class="matrix-col-label">{{ imp }}</div>

          <!-- Rows: probability 5 down to 1 -->
          <template v-for="prob in [5,4,3,2,1]" :key="`row${prob}`">
            <div class="matrix-row-label">{{ prob }}</div>
            <div
              v-for="imp in 5"
              :key="`cell${prob}-${imp}`"
              class="matrix-cell"
              :class="getCellClass(prob, imp)"
            >
              <div
                v-for="risk in getCellRisks(prob, imp)"
                :key="risk.id"
                class="risk-dot"
                :title="risk.title"
                @click="selectedRisk = risk; showRiskDialog = true"
              >
                {{ risk.id.replace('risk_', 'R') }}
              </div>
            </div>
          </template>
        </div>
        <div class="matrix-x-label">{{ $t('risk.probability') }} →</div>
      </div>
      <div class="matrix-legend">
        <span class="legend-dot critical"></span> {{ $t('risk.level.critical') }}
        <span class="legend-dot high"></span> {{ $t('risk.level.high') }}
        <span class="legend-dot medium"></span> {{ $t('risk.level.medium') }}
        <span class="legend-dot low"></span> {{ $t('risk.level.low') }}
      </div>
    </el-card>

    <!-- Risk List -->
    <el-card class="risks-list-card">
      <template #header>{{ $t('risk.list') }} ({{ filteredRisks.length }})</template>
      <div class="risks-grid">
        <RiskItem
          v-for="risk in filteredRisks"
          :key="risk.id"
          :risk="risk"
          @click="selectedRisk = risk; showRiskDialog = true"
        />
      </div>
      <el-empty v-if="!filteredRisks.length" :description="$t('common.noData')" />
    </el-card>

    <!-- Risk Detail Dialog -->
    <el-dialog
      v-model="showRiskDialog"
      :title="selectedRisk?.title"
      width="560px"
      @close="showRiskDialog = false; selectedRisk = null"
    >
      <div v-if="selectedRisk" class="risk-detail">
        <el-descriptions :column="2" border size="small">
          <el-descriptions-item :label="$t('risk.probability')">{{ selectedRisk.probability }}</el-descriptions-item>
          <el-descriptions-item :label="$t('risk.impact')">{{ selectedRisk.impact }}</el-descriptions-item>
          <el-descriptions-item :label="$t('risk.score')">{{ selectedRisk.score }}</el-descriptions-item>
          <el-descriptions-item :label="$t('risk.level.label')">
            <el-tag :type="levelTagType(selectedRisk.level)">{{ $t(`risk.level.${selectedRisk.level}`) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item :label="$t('risk.status.label')">
            <el-tag :type="statusTagType(selectedRisk.status)">{{ $t(`risk.status.${selectedRisk.status}`) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item :label="$t('risk.owner')">{{ selectedRisk.owner }}</el-descriptions-item>
          <el-descriptions-item :label="$t('task.project')" :span="2">{{ selectedRisk.projectName }}</el-descriptions-item>
          <el-descriptions-item :label="$t('risk.mitigation')" :span="2">{{ selectedRisk.mitigation }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <el-button @click="selectedRisk = null">{{ $t('common.close') }}</el-button>
        <el-button type="primary" @click="editRisk(selectedRisk)">{{ $t('common.edit') }}</el-button>
      </template>
    </el-dialog>

    <!-- Add Risk Dialog -->
    <el-dialog v-model="showAddDialog" :title="$t('risk.addRisk')" width="520px">
      <el-form :model="riskForm" label-position="top" size="small">
        <el-form-item :label="$t('risk.title')">
          <el-input v-model="riskForm.title" :placeholder="$t('risk.titlePlaceholder')" />
        </el-form-item>
        <div class="form-row">
          <el-form-item :label="$t('risk.probability')" style="flex:1">
            <el-input-number v-model="riskForm.probability" :min="1" :max="5" style="width:100%" />
          </el-form-item>
          <el-form-item :label="$t('risk.impact')" style="flex:1">
            <el-input-number v-model="riskForm.impact" :min="1" :max="5" style="width:100%" />
          </el-form-item>
        </div>
        <el-form-item :label="$t('task.project')">
          <el-select v-model="riskForm.projectId" style="width:100%">
            <el-option v-for="p in projects" :key="p.id" :label="p.name" :value="p.id" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('risk.owner')">
          <el-input v-model="riskForm.owner" />
        </el-form-item>
        <el-form-item :label="$t('risk.mitigation')">
          <el-input v-model="riskForm.mitigation" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="addRisk">{{ $t('common.save') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { useProjectStore } from '../../../stores/rdm-project.js'
import { loadFromLocalStorage, saveToLocalStorage } from '../../../utils/rdm-helpers.js'
import { DEMO_RISKS } from '../../../utils/rdm-demoData.js'
import RiskItem from '../../../components/rdm/project/RiskItem.vue'

const { t } = useI18n()
const projectStore = useProjectStore()

const risks = ref(loadFromLocalStorage('rdm_risks', DEMO_RISKS))
const projects = computed(() => projectStore.projects)

const filterProject = ref('')
const filterLevel = ref('')
const filterStatus = ref('')
const selectedRisk = ref(null)
const showRiskDialog = ref(false)
const showAddDialog = ref(false)

const riskForm = ref({
  title: '', probability: 3, impact: 3, projectId: '', owner: '', mitigation: '',
})

const filteredRisks = computed(() => {
  return risks.value.filter(r => {
    if (filterProject.value && r.projectId !== filterProject.value) return false
    if (filterLevel.value && r.level !== filterLevel.value) return false
    if (filterStatus.value && r.status !== filterStatus.value) return false
    return true
  })
})

const criticalCount = computed(() => risks.value.filter(r => r.level === 'critical').length)
const highCount = computed(() => risks.value.filter(r => r.level === 'high').length)
const mediumCount = computed(() => risks.value.filter(r => r.level === 'medium').length)

function getLevel(prob, impact) {
  const score = prob * impact
  if (score >= 15) return 'critical'
  if (score >= 9) return 'high'
  if (score >= 4) return 'medium'
  return 'low'
}

function getCellClass(prob, impact) {
  return 'cell-' + getLevel(prob, impact)
}

function getCellRisks(prob, impact) {
  return risks.value.filter(r => r.probability === prob && r.impact === impact)
}

function levelTagType(level) {
  const map = { critical: 'danger', high: 'warning', medium: '', low: 'success' }
  return map[level] || 'info'
}

function statusTagType(status) {
  const map = { open: 'danger', mitigating: 'warning', closed: 'success', monitoring: 'info' }
  return map[status] || 'info'
}

function editRisk(risk) {
  selectedRisk.value = null
  // simple inline: just log for now
  ElMessage.info(t('common.editMode'))
}

function addRisk() {
  const prob = riskForm.value.probability
  const impact = riskForm.value.impact
  const score = prob * impact
  const level = getLevel(prob, impact)
  const project = projectStore.getProjectById(riskForm.value.projectId)
  const newRisk = {
    id: 'risk_' + Date.now(),
    ...riskForm.value,
    score,
    level,
    projectName: project?.name || '',
    status: 'open',
    createdAt: new Date().toISOString(),
  }
  risks.value.unshift(newRisk)
  saveToLocalStorage('rdm_risks', risks.value)
  ElMessage.success(t('common.saved'))
  showAddDialog.value = false
  riskForm.value = { title: '', probability: 3, impact: 3, projectId: '', owner: '', mitigation: '' }
}
</script>

<style scoped>
.page-container { max-width: 1200px; }
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.page-title { font-size: 20px; font-weight: 700; color: #111827; margin: 0; }

.filters-row { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }

.matrix-card { margin-bottom: 16px; }
.matrix-wrapper { display: flex; flex-direction: column; align-items: flex-start; }
.matrix-y-label { font-size: 12px; color: #6b7280; margin-bottom: 4px; align-self: center; }
.matrix-x-label { font-size: 12px; color: #6b7280; margin-top: 4px; align-self: center; }

.matrix-grid {
  display: grid;
  grid-template-columns: 32px repeat(5, 1fr);
  grid-template-rows: 28px repeat(5, 80px);
  gap: 2px;
  width: 100%;
  max-width: 600px;
}

.matrix-corner {}
.matrix-col-label {
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 600; color: #374151;
}
.matrix-row-label {
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 600; color: #374151;
}
.matrix-cell {
  border-radius: 6px;
  display: flex; flex-wrap: wrap; align-content: flex-start;
  gap: 4px; padding: 4px; min-height: 60px;
}
.cell-critical { background: #fee2e2; }
.cell-high { background: #ffedd5; }
.cell-medium { background: #fef9c3; }
.cell-low { background: #dcfce7; }

.risk-dot {
  background: #1a73e8; color: white;
  font-size: 10px; font-weight: 600;
  padding: 2px 5px; border-radius: 4px;
  cursor: pointer; white-space: nowrap;
}
.risk-dot:hover { background: #1557b0; }

.matrix-legend {
  display: flex; align-items: center; gap: 12px;
  font-size: 12px; color: #6b7280; margin-top: 12px;
}
.legend-dot {
  display: inline-block; width: 12px; height: 12px; border-radius: 3px;
}
.legend-dot.critical { background: #fee2e2; border: 1px solid #ef4444; }
.legend-dot.high { background: #ffedd5; border: 1px solid #f97316; }
.legend-dot.medium { background: #fef9c3; border: 1px solid #eab308; }
.legend-dot.low { background: #dcfce7; border: 1px solid #10b981; }

.risks-list-card {}
.risks-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 12px; }

.risk-detail {}
.form-row { display: flex; gap: 16px; }
</style>
