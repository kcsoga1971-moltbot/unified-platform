<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">{{ $t('testData.center') }}</h1>
      <el-button type="primary" @click="$router.push('/test-data/new')">
        <el-icon><Plus /></el-icon>
        {{ $t('testData.newRecord') }}
      </el-button>
    </div>

    <!-- Filters -->
    <el-card class="filter-card">
      <el-row :gutter="16">
        <el-col :span="8">
          <el-select v-model="filterProject" :placeholder="$t('testData.filterByProject')" clearable style="width: 100%">
            <el-option :label="$t('testData.allProjects')" value="" />
            <el-option v-for="p in projects" :key="p.id" :label="p.name" :value="p.id" />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select v-model="filterType" :placeholder="$t('testData.filterByType')" clearable style="width: 100%">
            <el-option :label="$t('testData.allTypes')" value="" />
            <el-option v-for="tp in testTypes" :key="tp" :label="tp" :value="tp" />
          </el-select>
        </el-col>
      </el-row>
    </el-card>

    <!-- Tabs -->
    <el-tabs v-model="activeTab" class="content-tabs">
      <el-tab-pane :label="$t('testData.dvt')" name="DVT" />
      <el-tab-pane :label="$t('testData.pvt')" name="PVT" />
      <el-tab-pane :label="$t('testData.reliability')" name="Reliability" />
      <el-tab-pane :label="$t('testData.spc')" name="SPC" />
    </el-tabs>

    <!-- Record List -->
    <div v-if="activeTab !== 'SPC'">
      <el-table :data="filteredRecords" stripe @row-click="viewRecord">
        <el-table-column prop="testItem" :label="$t('testData.testItem')" />
        <el-table-column prop="projectName" :label="$t('task.project')" />
        <el-table-column :label="$t('testData.lsl')">
          <template #default="{ row }">{{ row.lsl }} {{ row.unit }}</template>
        </el-table-column>
        <el-table-column :label="$t('testData.target')">
          <template #default="{ row }">{{ row.target }} {{ row.unit }}</template>
        </el-table-column>
        <el-table-column :label="$t('testData.usl')">
          <template #default="{ row }">{{ row.usl }} {{ row.unit }}</template>
        </el-table-column>
        <el-table-column prop="mean" :label="$t('testData.mean')" />
        <el-table-column prop="cpk" :label="$t('testData.cpk')">
          <template #default="{ row }">
            <span :class="cpkClass(row.cpk)">{{ row.cpk }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('testData.passFail')" width="90">
          <template #default="{ row }">
            <el-tag :type="row.result === 'pass' ? 'success' : 'danger'" size="small">
              {{ row.result === 'pass' ? $t('testData.pass') : $t('testData.fail') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="date" :label="$t('testData.date')" width="110" />
        <el-table-column width="80">
          <template #default="{ row }">
            <el-button size="small" @click.stop="viewRecord(row)">{{ $t('testData.viewReport') }}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="!filteredRecords.length" class="empty-state">
        <el-empty :description="$t('testData.noRecords')" />
      </div>
    </div>

    <!-- SPC Tab -->
    <div v-else class="spc-section">
      <el-card>
        <template #header>SPC 控制图 - 防眩光雾度值监控</template>
        <SPCChart :data="spcData" :lsl="3.0" :usl="8.0" />
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectStore } from '../../../stores/rdm-project.js'
import { DEMO_SPC_DATA } from '../../../utils/rdm-demoData.js'
import SPCChart from '../../../components/rdm/test/SPCChart.vue'

const router = useRouter()
const projectStore = useProjectStore()

const filterProject = ref('')
const filterType = ref('')
const activeTab = ref('DVT')

const projects = computed(() => projectStore.projects)
const testTypes = ['DVT', 'PVT', 'Reliability', 'Incoming', 'Outgoing']
const spcData = DEMO_SPC_DATA

const allRecords = ref(JSON.parse(localStorage.getItem('rdm_test_records') || '[]'))

const filteredRecords = computed(() => {
  let list = allRecords.value.filter(r => r.testType === activeTab.value)
  if (filterProject.value) list = list.filter(r => r.projectId === filterProject.value)
  return list
})

function viewRecord(row) {
  router.push(`/test-data/${row.id}`)
}

function cpkClass(cpk) {
  if (cpk >= 1.33) return 'cpk-good'
  if (cpk >= 1.0) return 'cpk-ok'
  return 'cpk-bad'
}
</script>

<style scoped>
.page-container { max-width: 1200px; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.page-title { font-size: 22px; font-weight: 700; color: #111827; margin: 0; }
.filter-card { margin-bottom: 16px; }
.content-tabs { margin-bottom: 16px; }
.empty-state { padding: 40px; background: white; border-radius: 8px; }
.spc-section { margin-top: 0; }
.cpk-good { color: #10b981; font-weight: 600; }
.cpk-ok { color: #f59e0b; font-weight: 600; }
.cpk-bad { color: #ef4444; font-weight: 600; }
:deep(.el-table__row) { cursor: pointer; }
</style>
