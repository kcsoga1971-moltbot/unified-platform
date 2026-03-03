<template>
  <div class="crn-dashboard">
    <div class="page-header">
      <h1 class="page-title">{{ $t('nav.dashboard') }}</h1>
      <p class="page-sub">{{ $t('dashboard.welcome') }}, {{ currentUser?.name }}</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon green"><el-icon size="24"><User /></el-icon></div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.totalPatients }}</div>
          <div class="stat-label">管理病患數</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon blue"><el-icon size="24"><Finished /></el-icon></div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.pendingTasks }}</div>
          <div class="stat-label">待處理任務</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon orange"><el-icon size="24"><Reading /></el-icon></div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.educationAssigned }}</div>
          <div class="stat-label">已指派衛教</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon red"><el-icon size="24"><Bell /></el-icon></div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.alerts }}</div>
          <div class="stat-label">通知提醒</div>
        </div>
      </div>
    </div>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card header="今日任務">
          <el-empty v-if="!todayTasks.length" description="今日暫無任務" />
          <div v-for="task in todayTasks" :key="task.id" class="task-item">
            <el-tag :type="task.urgent ? 'danger' : 'info'" size="small">{{ task.type }}</el-tag>
            <span class="task-title">{{ task.title }}</span>
            <span class="task-patient">{{ task.patient }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card header="近期行事曆">
          <el-empty description="近期暫無排程" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useUserStore } from '../../../stores/user.js'

defineOptions({ name: 'CrnDashboard' })

const userStore = useUserStore()
const currentUser = computed(() => userStore.currentUser)

const stats = ref({
  totalPatients: 12,
  pendingTasks: 5,
  educationAssigned: 8,
  alerts: 2,
})

const todayTasks = ref([
  { id: 1, type: '給藥', title: '08:00 投藥提醒', patient: '王大明', urgent: true },
  { id: 2, type: '衛教', title: '術後傷口照護衛教', patient: '李小花', urgent: false },
  { id: 3, type: '量測', title: '血壓量測', patient: '張三', urgent: false },
])
</script>

<style scoped>
.crn-dashboard { padding: 0; }
.page-header { margin-bottom: 20px; }
.page-title { font-size: 22px; font-weight: 700; color: #1a1a2e; margin: 0; }
.page-sub { font-size: 13px; color: #64748b; margin-top: 4px; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.stat-card { background: white; border-radius: 12px; padding: 20px; display: flex; align-items: center; gap: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
.stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; }
.stat-icon.green { background: #2e7d32; }
.stat-icon.blue { background: #1565c0; }
.stat-icon.orange { background: #ef6c00; }
.stat-icon.red { background: #c62828; }
.stat-value { font-size: 24px; font-weight: 700; color: #1a1a2e; }
.stat-label { font-size: 12px; color: #64748b; margin-top: 2px; }
.task-item { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
.task-item:last-child { border-bottom: none; }
.task-title { flex: 1; font-size: 13px; color: #333; }
.task-patient { font-size: 12px; color: #999; }
</style>
