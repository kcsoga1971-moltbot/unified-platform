<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">{{ $t('ecn.title') }}</h1>
      <el-button type="primary" @click="$router.push('/ecn/new')">
        <el-icon><Plus /></el-icon>
        {{ $t('ecn.createECN') }}
      </el-button>
    </div>

    <!-- Stats Row -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-num">{{ records.length }}</div>
        <div class="stat-label">{{ $t('ecn.total') }}</div>
      </div>
      <div class="stat-card pending">
        <div class="stat-num">{{ pendingCount }}</div>
        <div class="stat-label">{{ $t('ecn.status.pending') }}</div>
      </div>
      <div class="stat-card approved">
        <div class="stat-num">{{ approvedCount }}</div>
        <div class="stat-label">{{ $t('ecn.status.approved') }}</div>
      </div>
      <div class="stat-card implemented">
        <div class="stat-num">{{ implementedCount }}</div>
        <div class="stat-label">{{ $t('ecn.status.implemented') }}</div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-row">
      <el-input
        v-model="search"
        :placeholder="$t('common.search')"
        prefix-icon="Search"
        clearable
        style="width: 240px"
      />
      <el-select v-model="filterProject" :placeholder="$t('task.project')" clearable style="width: 200px">
        <el-option v-for="p in projects" :key="p.id" :label="p.name" :value="p.id" />
      </el-select>
      <el-select v-model="filterStatus" :placeholder="$t('ecn.status.label')" clearable style="width: 140px">
        <el-option :label="$t('ecn.status.draft')" value="draft" />
        <el-option :label="$t('ecn.status.pending')" value="pending" />
        <el-option :label="$t('ecn.status.approved')" value="approved" />
        <el-option :label="$t('ecn.status.rejected')" value="rejected" />
        <el-option :label="$t('ecn.status.implemented')" value="implemented" />
      </el-select>
      <el-select v-model="filterType" :placeholder="$t('ecn.type.label')" clearable style="width: 160px">
        <el-option :label="$t('ecn.type.spec')" value="spec" />
        <el-option :label="$t('ecn.type.material')" value="material" />
        <el-option :label="$t('ecn.type.process')" value="process" />
        <el-option :label="$t('ecn.type.design')" value="design" />
      </el-select>
    </div>

    <!-- ECN Table -->
    <el-card>
      <el-table :data="filteredRecords" stripe row-class-name="ecn-row" @row-click="openRecord">
        <el-table-column :label="$t('ecn.ecnNo')" prop="ecnNo" width="130" />
        <el-table-column :label="$t('ecn.type.label')" width="120">
          <template #default="{ row }">
            <el-tag size="small" type="info">{{ $t(`ecn.type.${row.type}`) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('ecn.title')" prop="title" min-width="200" show-overflow-tooltip />
        <el-table-column :label="$t('task.project')" prop="projectName" width="180" show-overflow-tooltip />
        <el-table-column :label="$t('ecn.priority')" width="90">
          <template #default="{ row }">
            <el-tag :type="priorityType(row.priority)" size="small">
              {{ $t(`ecn.priorityOptions.${row.priority}`) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('ecn.status.label')" width="110">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)" size="small">
              {{ $t(`ecn.status.${row.status}`) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('ecn.initiator')" prop="initiatorName" width="100" />
        <el-table-column :label="$t('ecn.createdAt')" prop="createdAt" width="110">
          <template #default="{ row }">{{ row.createdAt?.split('T')[0] }}</template>
        </el-table-column>
        <el-table-column width="80">
          <template #default="{ row }">
            <el-button size="small" text @click.stop="openRecord(row)">
              {{ $t('common.view') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-if="!filteredRecords.length" :description="$t('common.noData')" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectStore } from '../../../stores/rdm-project.js'
import { loadFromLocalStorage } from '../../../utils/rdm-helpers.js'
import { DEMO_ECN_RECORDS } from '../../../utils/rdm-demoData.js'

const router = useRouter()
const projectStore = useProjectStore()

// Normalize ECN records to consistent field names
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

const search = ref('')
const filterProject = ref('')
const filterStatus = ref('')
const filterType = ref('')

const filteredRecords = computed(() => {
  return records.value.filter(r => {
    if (search.value && !r.title.toLowerCase().includes(search.value.toLowerCase()) && !r.ecnNo.toLowerCase().includes(search.value.toLowerCase())) return false
    if (filterProject.value && r.projectId !== filterProject.value) return false
    if (filterStatus.value && r.status !== filterStatus.value) return false
    if (filterType.value && r.type !== filterType.value) return false
    return true
  })
})

const pendingCount = computed(() => records.value.filter(r => r.status === 'pending').length)
const approvedCount = computed(() => records.value.filter(r => r.status === 'approved').length)
const implementedCount = computed(() => records.value.filter(r => r.status === 'implemented').length)

function priorityType(p) {
  const map = { critical: 'danger', high: 'warning', medium: '', low: 'success' }
  return map[p] || 'info'
}

function statusType(s) {
  const map = { draft: 'info', pending: 'warning', approved: 'success', rejected: 'danger', implemented: '' }
  return map[s] || 'info'
}

function openRecord(row) {
  router.push(`/ecn/${row.id}`)
}
</script>

<style scoped>
.page-container { max-width: 1200px; }
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.page-title { font-size: 20px; font-weight: 700; color: #111827; margin: 0; }

.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 16px; }
.stat-card {
  background: white; border: 1px solid #e5e7eb; border-radius: 10px;
  padding: 16px; text-align: center;
}
.stat-card.pending { border-top: 3px solid #f59e0b; }
.stat-card.approved { border-top: 3px solid #10b981; }
.stat-card.implemented { border-top: 3px solid #1a73e8; }
.stat-num { font-size: 28px; font-weight: 700; color: #111827; }
.stat-label { font-size: 12px; color: #6b7280; margin-top: 4px; }

.filters-row { display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
:deep(.ecn-row) { cursor: pointer; }
</style>
