<template>
  <div class="project-list-page">
    <div class="page-header">
      <h1 class="page-title">{{ $t('project.list') }}</h1>
      <el-button type="primary" @click="$router.push('/projects/create')">
        <el-icon><Plus /></el-icon>
        {{ $t('project.create') }}
      </el-button>
    </div>

    <!-- Filters -->
    <div class="filter-bar">
      <el-input
        v-model="filters.search"
        :placeholder="$t('project.searchPlaceholder')"
        prefix-icon="Search"
        clearable
        style="width: 280px"
      />
      <el-select
        v-model="filters.productLine"
        :placeholder="$t('project.filterByProductLine')"
        clearable
        style="width: 160px"
      >
        <el-option v-for="pl in productLines" :key="pl" :label="pl" :value="pl" />
      </el-select>
      <el-select
        v-model="filters.stage"
        :placeholder="$t('project.filterByStage')"
        clearable
        style="width: 180px"
      >
        <el-option
          v-for="s in stages"
          :key="s.id"
          :label="`${s.id} - ${$t(`stages.${s.id}`)}`"
          :value="s.id"
        />
      </el-select>
      <el-select
        v-model="filters.status"
        :placeholder="$t('project.filterByStatus')"
        clearable
        style="width: 140px"
      >
        <el-option value="on_track" :label="$t('project.statusOptions.on_track')" />
        <el-option value="at_risk" :label="$t('project.statusOptions.at_risk')" />
        <el-option value="off_track" :label="$t('project.statusOptions.off_track')" />
      </el-select>
      <el-button text @click="resetFilters">
        <el-icon><Refresh /></el-icon>
        {{ $t('common.reset') }}
      </el-button>

      <div style="margin-left: auto; display: flex; gap: 8px">
        <el-button-group>
          <el-button :type="viewMode === 'card' ? 'primary' : ''" @click="viewMode = 'card'">
            <el-icon><Grid /></el-icon>
          </el-button>
          <el-button :type="viewMode === 'table' ? 'primary' : ''" @click="viewMode = 'table'">
            <el-icon><List /></el-icon>
          </el-button>
        </el-button-group>
      </div>
    </div>

    <div class="result-count">
      {{ $t('common.total') }} {{ filteredProjects.length }} {{ $t('common.items') }}
    </div>

    <!-- Card View -->
    <div v-if="viewMode === 'card'" class="card-grid">
      <ProjectCard
        v-for="project in filteredProjects"
        :key="project.id"
        :project="project"
        @click="goToProject"
      />
      <div v-if="filteredProjects.length === 0" class="empty-state">
        <el-icon size="60" color="#d1d5db"><FolderOpened /></el-icon>
        <p>{{ $t('project.noProjects') }}</p>
        <el-button type="primary" @click="$router.push('/projects/create')">
          {{ $t('project.createFirst') }}
        </el-button>
      </div>
    </div>

    <!-- Table View -->
    <div v-else class="table-view">
      <el-table :data="filteredProjects" stripe @row-click="(row) => goToProject(row.id)">
        <el-table-column :label="$t('project.name')" min-width="200">
          <template #default="{ row }">
            <div class="table-project-name">
              <span class="name-text">{{ row.name }}</span>
              <el-tag size="small" type="info">{{ row.code }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('project.productLine')" width="120">
          <template #default="{ row }">
            <el-tag size="small">{{ row.productLine }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('project.currentStage')" width="160">
          <template #default="{ row }">
            <el-tag size="small" type="primary">{{ $t(`stages.${row.currentStage}`) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('project.progress')" width="140">
          <template #default="{ row }">
            <div class="table-progress">
              <el-progress
                :percentage="row.progress"
                :stroke-width="6"
                :show-text="false"
                style="flex: 1"
              />
              <span class="progress-num">{{ row.progress }}%</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('project.status')" width="100">
          <template #default="{ row }">
            <StatusBadge :status="row.status" />
          </template>
        </el-table-column>
        <el-table-column :label="$t('project.pm')" width="100">
          <template #default="{ row }">
            <span>{{ getPmName(row.pmId) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('project.updatedAt')" width="120">
          <template #default="{ row }">
            <span>{{ formatDate(row.updatedAt) }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useProjectStore } from '../../../stores/rdm-project.js'
import ProjectCard from '../../../components/rdm/project/ProjectCard.vue'
import StatusBadge from '../../../components/common/StatusBadge.vue'
import { STAGES, PRODUCT_LINES } from '../../../utils/rdm-constants.js'
import { formatDate } from '../../../utils/rdm-helpers.js'
import { DEMO_USERS } from '../../../utils/rdm-demoData.js'

const { t } = useI18n()
const router = useRouter()
const projectStore = useProjectStore()

const viewMode = ref('card')
const stages = STAGES
const productLines = PRODUCT_LINES

const filters = ref({
  search: '',
  productLine: '',
  stage: '',
  status: '',
})

const filteredProjects = computed(() => {
  let result = projectStore.projects
  if (filters.value.search) {
    const q = filters.value.search.toLowerCase()
    result = result.filter(
      (p) => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q),
    )
  }
  if (filters.value.productLine) {
    result = result.filter((p) => p.productLine === filters.value.productLine)
  }
  if (filters.value.stage !== '') {
    result = result.filter((p) => p.currentStage === filters.value.stage)
  }
  if (filters.value.status) {
    result = result.filter((p) => p.status === filters.value.status)
  }
  return result
})

function resetFilters() {
  filters.value = { search: '', productLine: '', stage: '', status: '' }
}

function goToProject(id) {
  router.push(`/projects/${id}`)
}

function getPmName(pmId) {
  const user = DEMO_USERS.find((u) => u.id === pmId)
  return user?.name || pmId || '-'
}
</script>

<style scoped>
.project-list-page {
  max-width: 1400px;
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

.filter-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.result-count {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 16px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 20px;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px;
  color: #9ca3af;
}

.empty-state p {
  margin: 16px 0 24px;
  font-size: 16px;
}

.table-view {
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.table-project-name {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.name-text {
  font-weight: 500;
  color: #111827;
}

.table-progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-num {
  font-size: 12px;
  color: #374151;
  width: 32px;
  flex-shrink: 0;
}

:deep(.el-table__row) {
  cursor: pointer;
}
</style>
