<template>
  <div class="education-list">
    <div class="page-header">
      <h1 class="page-title">{{ $t('nav.patientEducation') }}</h1>
    </div>

    <el-row :gutter="16">
      <el-col :span="8" v-for="edu in educations" :key="edu.id">
        <el-card class="edu-card" :body-style="{ padding: '0' }" @click="$router.push(`/patient/education/${edu.id}`)">
          <div class="edu-banner" :class="edu.status">
            <el-icon size="32"><Reading /></el-icon>
          </div>
          <div class="edu-content">
            <h3>{{ edu.title }}</h3>
            <p>{{ edu.category }} · {{ edu.duration }}分鐘</p>
            <el-progress :percentage="edu.progress" :status="edu.progress === 100 ? 'success' : ''" />
            <el-tag :type="edu.status === 'completed' ? 'success' : 'warning'" size="small" style="margin-top: 8px">
              {{ edu.status === 'completed' ? '已完成' : '待完成' }}
            </el-tag>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const educations = ref([
  { id: 1, title: '術後傷口照護', category: '外科', duration: 15, progress: 60, status: 'pending' },
  { id: 2, title: '化療期間飲食指南', category: '腫瘤科', duration: 20, progress: 0, status: 'pending' },
  { id: 3, title: '出院準備衛教', category: '通用', duration: 10, progress: 100, status: 'completed' },
])
</script>

<style scoped>
.page-header { margin-bottom: 20px; }
.page-title { font-size: 22px; font-weight: 700; color: #1a1a2e; margin: 0; }
.edu-card { cursor: pointer; transition: transform 0.2s; margin-bottom: 16px; }
.edu-card:hover { transform: translateY(-3px); }
.edu-banner { height: 80px; display: flex; align-items: center; justify-content: center; color: white; }
.edu-banner.pending { background: linear-gradient(135deg, #ef6c00, #ff9800); }
.edu-banner.completed { background: linear-gradient(135deg, #2e7d32, #4caf50); }
.edu-content { padding: 16px; }
.edu-content h3 { font-size: 15px; margin: 0 0 4px; }
.edu-content p { font-size: 12px; color: #999; margin: 0 0 8px; }
</style>
