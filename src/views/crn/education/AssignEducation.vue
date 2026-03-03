<template>
  <div class="assign-education">
    <div class="page-header">
      <h1 class="page-title">{{ $t('nav.crnAssignEducation') }}</h1>
    </div>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-card header="衛教教材庫">
          <el-input v-model="search" placeholder="搜尋衛教教材..." clearable style="margin-bottom: 12px" />
          <div v-for="material in materials" :key="material.id" class="material-item" @click="selectMaterial(material)">
            <div class="material-icon"><el-icon><Reading /></el-icon></div>
            <div class="material-info">
              <div class="material-title">{{ material.title }}</div>
              <div class="material-desc">{{ material.category }} · {{ material.duration }}分鐘</div>
            </div>
            <el-tag size="small" type="info">{{ material.format }}</el-tag>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card header="指派設定">
          <el-form label-width="100px">
            <el-form-item label="已選教材">
              <el-tag v-if="selectedMaterial" closable @close="selectedMaterial = null">{{ selectedMaterial.title }}</el-tag>
              <span v-else style="color: #999">請從左側選擇</span>
            </el-form-item>
            <el-form-item label="指派病患">
              <el-select v-model="selectedPatients" multiple placeholder="選擇病患" style="width: 100%">
                <el-option label="P001 王大明" value="P001" />
                <el-option label="P002 李小花" value="P002" />
                <el-option label="P003 張三" value="P003" />
              </el-select>
            </el-form-item>
            <el-form-item label="截止日期">
              <el-date-picker v-model="dueDate" type="date" style="width: 100%" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :disabled="!selectedMaterial || !selectedPatients.length" @click="handleAssign">
                確認指派
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const search = ref('')
const selectedMaterial = ref(null)
const selectedPatients = ref([])
const dueDate = ref(null)

const materials = ref([
  { id: 1, title: '術後傷口照護', category: '外科', duration: 15, format: '圖文' },
  { id: 2, title: '化療期間飲食指南', category: '腫瘤科', duration: 20, format: '影片' },
  { id: 3, title: '糖尿病自我管理', category: '內科', duration: 25, format: '互動' },
  { id: 4, title: '跌倒預防衛教', category: '通用', duration: 10, format: '圖文' },
])

function selectMaterial(m) { selectedMaterial.value = m }
function handleAssign() { ElMessage.success('衛教指派成功（演示模式）') }
</script>

<style scoped>
.page-header { margin-bottom: 20px; }
.page-title { font-size: 22px; font-weight: 700; color: #1a1a2e; margin: 0; }
.material-item { display: flex; align-items: center; gap: 12px; padding: 10px; border-radius: 8px; cursor: pointer; transition: background 0.2s; }
.material-item:hover { background: #f0f9f0; }
.material-icon { width: 40px; height: 40px; background: #e8f5e9; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #2e7d32; }
.material-title { font-size: 14px; font-weight: 600; }
.material-desc { font-size: 12px; color: #999; }
</style>
