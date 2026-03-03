<template>
  <div class="create-task">
    <div class="page-header">
      <h1 class="page-title">{{ $t('nav.crnCreateTask') }}</h1>
    </div>

    <el-card>
      <el-form :model="form" label-width="120px" style="max-width: 700px">
        <el-form-item label="任務類型" required>
          <el-select v-model="form.type" placeholder="選擇任務類型" style="width: 100%">
            <el-option label="給藥" value="medication" />
            <el-option label="換藥" value="dressing" />
            <el-option label="衛教" value="education" />
            <el-option label="生命徵象量測" value="vitals" />
            <el-option label="抽血" value="blood_draw" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="病患" required>
          <el-select v-model="form.patientId" placeholder="選擇病患" style="width: 100%">
            <el-option label="P001 王大明" value="P001" />
            <el-option label="P002 李小花" value="P002" />
            <el-option label="P003 張三" value="P003" />
          </el-select>
        </el-form-item>
        <el-form-item label="排程時間" required>
          <el-date-picker v-model="form.scheduledAt" type="datetime" placeholder="選擇時間" style="width: 100%" />
        </el-form-item>
        <el-form-item label="優先級">
          <el-radio-group v-model="form.priority">
            <el-radio value="high">高</el-radio>
            <el-radio value="medium">中</el-radio>
            <el-radio value="low">低</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="備註">
          <el-input v-model="form.notes" type="textarea" rows="3" placeholder="任務備註..." />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">建立任務</el-button>
          <el-button @click="$router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const form = ref({
  type: '',
  patientId: '',
  scheduledAt: null,
  priority: 'medium',
  notes: '',
})

function handleSubmit() {
  ElMessage.success('任務建立成功（演示模式）')
}
</script>

<style scoped>
.page-header { margin-bottom: 20px; }
.page-title { font-size: 22px; font-weight: 700; color: #1a1a2e; margin: 0; }
</style>
