<template>
  <div class="patient-dashboard">
    <div class="page-header">
      <h1 class="page-title">{{ $t('nav.dashboard') }}</h1>
      <p class="page-sub">{{ currentUser?.name }}，歡迎回來</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card" @click="$router.push('/patient/education')">
        <div class="stat-icon green"><el-icon size="24"><Reading /></el-icon></div>
        <div class="stat-content">
          <div class="stat-value">3</div>
          <div class="stat-label">待完成衛教</div>
        </div>
      </div>
      <div class="stat-card" @click="$router.push('/patient/vitals')">
        <div class="stat-icon blue"><el-icon size="24"><TrendCharts /></el-icon></div>
        <div class="stat-content">
          <div class="stat-value">正常</div>
          <div class="stat-label">最新生命徵象</div>
        </div>
      </div>
      <div class="stat-card" @click="$router.push('/patient/history')">
        <div class="stat-icon orange"><el-icon size="24"><Document /></el-icon></div>
        <div class="stat-content">
          <div class="stat-value">5</div>
          <div class="stat-label">健康紀錄</div>
        </div>
      </div>
    </div>

    <el-card header="今日提醒" style="margin-top: 20px">
      <div class="reminder-item">
        <el-icon color="#e53935"><Bell /></el-icon>
        <span>10:00 — 請記得按時服藥</span>
      </div>
      <div class="reminder-item">
        <el-icon color="#2e7d32"><Reading /></el-icon>
        <span>請完成「術後傷口照護」衛教教材</span>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '../../../stores/user.js'

defineOptions({ name: 'PatientDashboard' })

const userStore = useUserStore()
const currentUser = computed(() => userStore.currentUser)
</script>

<style scoped>
.page-header { margin-bottom: 20px; }
.page-title { font-size: 22px; font-weight: 700; color: #1a1a2e; margin: 0; }
.page-sub { font-size: 13px; color: #64748b; margin-top: 4px; }
.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.stat-card { background: white; border-radius: 12px; padding: 20px; display: flex; align-items: center; gap: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); cursor: pointer; transition: transform 0.2s; }
.stat-card:hover { transform: translateY(-2px); }
.stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; }
.stat-icon.green { background: #2e7d32; }
.stat-icon.blue { background: #1565c0; }
.stat-icon.orange { background: #ef6c00; }
.stat-value { font-size: 24px; font-weight: 700; color: #1a1a2e; }
.stat-label { font-size: 12px; color: #64748b; margin-top: 2px; }
.reminder-item { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid #f5f5f5; font-size: 14px; }
.reminder-item:last-child { border-bottom: none; }
</style>
