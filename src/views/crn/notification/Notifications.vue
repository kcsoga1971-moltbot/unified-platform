<template>
  <div class="crn-notifications">
    <div class="page-header">
      <h1 class="page-title">{{ $t('nav.crnNotifications') }}</h1>
      <el-button size="small" @click="markAllRead">全部已讀</el-button>
    </div>

    <el-card>
      <div v-for="notification in notifications" :key="notification.id" class="notification-item" :class="{ unread: !notification.read }">
        <div class="notification-icon" :class="notification.type">
          <el-icon><component :is="iconMap[notification.type]" /></el-icon>
        </div>
        <div class="notification-content">
          <div class="notification-title">{{ notification.title }}</div>
          <div class="notification-desc">{{ notification.message }}</div>
          <div class="notification-time">{{ notification.time }}</div>
        </div>
      </div>
      <el-empty v-if="!notifications.length" description="暫無通知" />
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const iconMap = { alert: 'Warning', task: 'Finished', education: 'Reading', system: 'Bell' }

const notifications = ref([
  { id: 1, type: 'alert', title: '病患生命徵象異常', message: '王大明血壓偏高 (158/95)，請注意觀察', time: '10分鐘前', read: false },
  { id: 2, type: 'task', title: '任務到期提醒', message: '張三的換藥任務即將到期', time: '30分鐘前', read: false },
  { id: 3, type: 'education', title: '衛教完成通知', message: '李小花已完成「化療期間飲食指南」衛教', time: '2小時前', read: true },
  { id: 4, type: 'system', title: '系統更新', message: '護理紀錄模板已更新，請查看', time: '昨天', read: true },
])

function markAllRead() {
  notifications.value.forEach(n => n.read = true)
}
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-title { font-size: 22px; font-weight: 700; color: #1a1a2e; margin: 0; }
.notification-item { display: flex; gap: 12px; padding: 14px; border-bottom: 1px solid #f0f0f0; transition: background 0.2s; }
.notification-item:last-child { border-bottom: none; }
.notification-item.unread { background: #f0f9f0; }
.notification-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0; }
.notification-icon.alert { background: #e53935; }
.notification-icon.task { background: #1565c0; }
.notification-icon.education { background: #2e7d32; }
.notification-icon.system { background: #78909c; }
.notification-title { font-weight: 600; font-size: 14px; }
.notification-desc { font-size: 13px; color: #666; margin-top: 4px; }
.notification-time { font-size: 11px; color: #999; margin-top: 4px; }
</style>
