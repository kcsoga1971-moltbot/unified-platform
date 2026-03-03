<template>
  <div class="health-history">
    <div class="page-header">
      <h1 class="page-title">{{ $t('nav.patientHistory') }}</h1>
    </div>

    <el-card>
      <el-timeline>
        <el-timeline-item v-for="record in records" :key="record.id" :timestamp="record.date" placement="top" :type="record.type">
          <el-card shadow="never">
            <h4>{{ record.title }}</h4>
            <p>{{ record.description }}</p>
            <el-tag v-if="record.tag" size="small" :type="record.tagType">{{ record.tag }}</el-tag>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const records = ref([
  { id: 1, date: '2026-03-03', title: '生命徵象記錄', description: 'BP: 128/82, HR: 76, T: 36.8°C', type: 'primary', tag: '正常', tagType: 'success' },
  { id: 2, date: '2026-03-02', title: '手術紀錄', description: '大腸腫瘤切除手術順利完成', type: 'danger', tag: '手術', tagType: 'danger' },
  { id: 3, date: '2026-03-01', title: '入院評估', description: '病患入院，完成初步評估與檢查', type: 'warning', tag: '入院', tagType: 'warning' },
  { id: 4, date: '2026-02-28', title: '門診就診', description: '大腸鏡檢查發現腫瘤，建議手術治療', type: 'info', tag: '門診', tagType: 'info' },
])
</script>

<style scoped>
.page-header { margin-bottom: 20px; }
.page-title { font-size: 22px; font-weight: 700; color: #1a1a2e; margin: 0; }
</style>
