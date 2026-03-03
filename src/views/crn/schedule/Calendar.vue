<template>
  <div class="crn-calendar">
    <div class="page-header">
      <h1 class="page-title">{{ $t('nav.crnCalendar') }}</h1>
      <el-button type="primary" @click="$router.push('/crn/tasks/create')">
        <el-icon><Plus /></el-icon> 新增排程
      </el-button>
    </div>

    <el-card>
      <div class="calendar-nav">
        <el-button @click="prevWeek"><el-icon><ArrowLeft /></el-icon></el-button>
        <span class="calendar-title">2026年3月 第1週</span>
        <el-button @click="nextWeek"><el-icon><ArrowRight /></el-icon></el-button>
      </div>

      <div class="week-grid">
        <div v-for="day in weekDays" :key="day.date" class="day-column">
          <div class="day-header" :class="{ today: day.isToday }">
            <div class="day-name">{{ day.name }}</div>
            <div class="day-date">{{ day.date }}</div>
          </div>
          <div class="day-events">
            <div v-for="event in day.events" :key="event.id" class="event-item" :class="event.type">
              <div class="event-time">{{ event.time }}</div>
              <div class="event-title">{{ event.title }}</div>
              <div class="event-patient">{{ event.patient }}</div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const weekDays = ref([
  { name: '一', date: '3/3', isToday: true, events: [
    { id: 1, time: '08:00', title: '投藥', patient: '王大明', type: 'medication' },
    { id: 2, time: '10:30', title: '換藥', patient: '張三', type: 'dressing' },
  ]},
  { name: '二', date: '3/4', isToday: false, events: [
    { id: 3, time: '09:00', title: '衛教', patient: '李小花', type: 'education' },
  ]},
  { name: '三', date: '3/5', isToday: false, events: [] },
  { name: '四', date: '3/6', isToday: false, events: [
    { id: 4, time: '14:00', title: '抽血', patient: '王大明', type: 'blood' },
  ]},
  { name: '五', date: '3/7', isToday: false, events: [] },
])

function prevWeek() {}
function nextWeek() {}
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-title { font-size: 22px; font-weight: 700; color: #1a1a2e; margin: 0; }
.calendar-nav { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
.calendar-title { font-size: 16px; font-weight: 600; }
.week-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; min-height: 400px; }
.day-column { border: 1px solid #eee; border-radius: 8px; overflow: hidden; }
.day-header { padding: 8px; text-align: center; background: #f5f5f5; }
.day-header.today { background: #e8f5e9; }
.day-name { font-weight: 600; font-size: 13px; }
.day-date { font-size: 11px; color: #999; }
.day-events { padding: 4px; }
.event-item { padding: 6px 8px; border-radius: 6px; margin-bottom: 4px; font-size: 12px; }
.event-item.medication { background: #fce4ec; }
.event-item.dressing { background: #e3f2fd; }
.event-item.education { background: #e8f5e9; }
.event-item.blood { background: #fff3e0; }
.event-time { font-weight: 600; }
.event-title { margin-top: 2px; }
.event-patient { color: #999; font-size: 11px; }
</style>
