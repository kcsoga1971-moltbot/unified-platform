<template>
  <div class="page-container">
    <div class="page-header">
      <div class="header-left">
        <el-button @click="$router.back()" :icon="'ArrowLeft'" text>{{ $t('common.back') }}</el-button>
        <h1 class="page-title">{{ $t('testData.newRecord') }}</h1>
      </div>
      <el-button type="primary" @click="saveRecord" :loading="saving">
        {{ $t('testData.saveRecord') }}
      </el-button>
    </div>

    <div class="form-layout">
      <!-- Basic Info -->
      <el-card class="form-card">
        <template #header>基本信息</template>
        <el-form :model="form" label-position="top" :rules="rules" ref="formRef">
          <el-row :gutter="16">
            <el-col :span="8">
              <el-form-item :label="$t('task.project')" prop="projectId">
                <el-select v-model="form.projectId" style="width: 100%" @change="onProjectChange">
                  <el-option v-for="p in projects" :key="p.id" :label="p.name" :value="p.id" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('testData.testType')" prop="testType">
                <el-select v-model="form.testType" style="width: 100%">
                  <el-option v-for="tp in testTypes" :key="tp" :label="tp" :value="tp" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('testData.testItem')" prop="testItem">
                <el-input v-model="form.testItem" placeholder="如：TGV孔径" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :span="6">
              <el-form-item :label="$t('testData.lsl')">
                <el-input-number v-model="form.lsl" style="width: 100%" :precision="3" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="$t('testData.target')">
                <el-input-number v-model="form.target" style="width: 100%" :precision="3" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="$t('testData.usl')">
                <el-input-number v-model="form.usl" style="width: 100%" :precision="3" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="$t('testData.unit')">
                <el-input v-model="form.unit" placeholder="μm / % / GU" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :span="8">
              <el-form-item :label="$t('testData.tester')">
                <el-input v-model="form.tester" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('testData.equipment')">
                <el-input v-model="form.equipment" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('testData.date')">
                <el-date-picker v-model="form.date" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>

      <!-- Data Entry -->
      <el-card class="form-card">
        <template #header>{{ $t('testData.measurement') }}</template>
        <DataEntryTable
          v-model="form.measurements"
          :lsl="form.lsl"
          :usl="form.usl"
          @stats-update="onStatsUpdate"
        />
      </el-card>

      <!-- Calculated Stats -->
      <el-card class="form-card" v-if="stats.mean">
        <template #header>统计结果</template>
        <el-row :gutter="16">
          <el-col :span="4">
            <div class="stat-box">
              <div class="stat-label">{{ $t('testData.mean') }}</div>
              <div class="stat-val">{{ stats.mean }}</div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="stat-box">
              <div class="stat-label">{{ $t('testData.stdDev') }}</div>
              <div class="stat-val">{{ stats.stdDev }}</div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="stat-box">
              <div class="stat-label">{{ $t('testData.min') }}</div>
              <div class="stat-val">{{ stats.min }}</div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="stat-box">
              <div class="stat-label">{{ $t('testData.max') }}</div>
              <div class="stat-val">{{ stats.max }}</div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="stat-box">
              <div class="stat-label">Cpk</div>
              <div class="stat-val" :class="cpkClass">{{ stats.cpk }}</div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="stat-box">
              <div class="stat-label">{{ $t('testData.passFail') }}</div>
              <el-tag :type="passResult ? 'success' : 'danger'">
                {{ passResult ? $t('testData.pass') : $t('testData.fail') }}
              </el-tag>
            </div>
          </el-col>
        </el-row>

        <div style="margin-top: 16px">
          <CpkGauge :cpk="stats.cpk" :cp="stats.cp" />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useProjectStore } from '../../../stores/rdm-project.js'
import { useUserStore } from '../../../stores/rdm-user.js'
import DataEntryTable from '../../../components/rdm/test/DataEntryTable.vue'
import CpkGauge from '../../../components/rdm/test/CpkGauge.vue'

const { t } = useI18n()
const router = useRouter()
const projectStore = useProjectStore()
const userStore = useUserStore()

const saving = ref(false)
const formRef = ref(null)
const projects = computed(() => projectStore.projects)
const testTypes = ['DVT', 'PVT', 'Reliability', 'Incoming', 'Outgoing']

const form = ref({
  projectId: '',
  projectName: '',
  testType: 'DVT',
  testItem: '',
  lsl: null,
  target: null,
  usl: null,
  unit: '',
  measurements: [],
  tester: userStore.currentUser?.name || '',
  equipment: '',
  date: new Date().toISOString().split('T')[0],
})

const stats = ref({ mean: 0, stdDev: 0, min: 0, max: 0, cpk: 0, cp: 0 })

const passResult = computed(() => {
  if (!form.value.measurements.length) return true
  return form.value.measurements.every(v => {
    if (form.value.lsl !== null && v < form.value.lsl) return false
    if (form.value.usl !== null && v > form.value.usl) return false
    return true
  }) && stats.value.cpk >= 1.0
})

const cpkClass = computed(() => {
  if (stats.value.cpk >= 1.33) return 'cpk-good'
  if (stats.value.cpk >= 1.0) return 'cpk-ok'
  return 'cpk-bad'
})

const rules = {
  projectId: [{ required: true, message: t('common.required') }],
  testType: [{ required: true, message: t('common.required') }],
  testItem: [{ required: true, message: t('common.required') }],
}

function onProjectChange(id) {
  const p = projects.value.find(p => p.id === id)
  if (p) form.value.projectName = p.name
}

function onStatsUpdate(newStats) {
  stats.value = newStats
}

async function saveRecord() {
  saving.value = true
  await new Promise(r => setTimeout(r, 400))
  const records = JSON.parse(localStorage.getItem('rdm_test_records') || '[]')
  const newRecord = {
    id: 'tr_' + Date.now(),
    ...form.value,
    sampleSize: form.value.measurements.length,
    mean: stats.value.mean,
    stdDev: stats.value.stdDev,
    min: stats.value.min,
    max: stats.value.max,
    cpk: stats.value.cpk,
    cp: stats.value.cp,
    result: passResult.value ? 'pass' : 'fail',
    createdAt: new Date().toISOString(),
  }
  records.unshift(newRecord)
  localStorage.setItem('rdm_test_records', JSON.stringify(records))
  saving.value = false
  ElMessage.success(t('common.operationSuccess'))
  router.push('/test-data')
}
</script>

<style scoped>
.page-container { max-width: 1100px; }
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.header-left { display: flex; align-items: center; gap: 12px; }
.page-title { font-size: 20px; font-weight: 700; color: #111827; margin: 0; }
.form-layout { display: flex; flex-direction: column; gap: 16px; }
.form-card {}
.stat-box { text-align: center; padding: 8px; background: #f9fafb; border-radius: 8px; }
.stat-label { font-size: 12px; color: #6b7280; }
.stat-val { font-size: 20px; font-weight: 700; color: #374151; margin-top: 4px; }
.cpk-good { color: #10b981; }
.cpk-ok { color: #f59e0b; }
.cpk-bad { color: #ef4444; }
</style>
