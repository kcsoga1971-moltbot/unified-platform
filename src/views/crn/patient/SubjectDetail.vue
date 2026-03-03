<template>
  <div class="subject-detail">
    <div class="page-header">
      <el-button @click="$router.back()"><el-icon><ArrowLeft /></el-icon> 返回</el-button>
      <h1 class="page-title">病患詳情</h1>
    </div>

    <el-row :gutter="20">
      <el-col :span="8">
        <el-card header="基本資料">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="病歷號">{{ patient.id }}</el-descriptions-item>
            <el-descriptions-item label="姓名">{{ patient.name }}</el-descriptions-item>
            <el-descriptions-item label="年齡">{{ patient.age }} 歲</el-descriptions-item>
            <el-descriptions-item label="主要診斷">{{ patient.diagnosis }}</el-descriptions-item>
            <el-descriptions-item label="狀態">
              <el-tag :type="patient.status === 'admitted' ? 'danger' : 'success'" size="small">
                {{ patient.status === 'admitted' ? '住院中' : '已出院' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="主治醫師">{{ patient.doctor }}</el-descriptions-item>
            <el-descriptions-item label="床號">{{ patient.bed }}</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card header="護理紀錄">
          <el-timeline>
            <el-timeline-item v-for="note in nursingNotes" :key="note.id" :timestamp="note.time" placement="top">
              <el-card shadow="never">
                <p><strong>{{ note.type }}</strong> — {{ note.content }}</p>
                <p style="color: #999; font-size: 12px;">護理師: {{ note.nurse }}</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({ id: String })

const patient = ref({
  id: props.id || 'P001',
  name: '王大明',
  age: 65,
  diagnosis: '大腸癌 Stage II',
  status: 'admitted',
  doctor: '林醫師',
  bed: '3A-12',
})

const nursingNotes = ref([
  { id: 1, time: '2026-03-03 08:00', type: '生命徵象', content: 'BP: 128/82, HR: 76, T: 36.8°C, SpO2: 98%', nurse: '陳護理師' },
  { id: 2, time: '2026-03-03 10:30', type: '傷口照護', content: '術後傷口換藥完成，傷口乾淨無感染跡象', nurse: '陳護理師' },
  { id: 3, time: '2026-03-02 16:00', type: '衛教', content: '術後飲食衛教完成，病患表示理解', nurse: '陳護理師' },
])
</script>

<style scoped>
.page-header { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
.page-title { font-size: 22px; font-weight: 700; color: #1a1a2e; margin: 0; }
</style>
