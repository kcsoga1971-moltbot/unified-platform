<template>
  <div class="patient-vitals">
    <div class="page-header">
      <h1 class="page-title">{{ $t('nav.patientVitals') }}</h1>
    </div>

    <div class="vitals-grid">
      <el-card v-for="vital in vitals" :key="vital.label" class="vital-card">
        <div class="vital-header">
          <span class="vital-label">{{ vital.label }}</span>
          <el-tag :type="vital.status" size="small">{{ vital.statusLabel }}</el-tag>
        </div>
        <div class="vital-value">{{ vital.value }}</div>
        <div class="vital-unit">{{ vital.unit }}</div>
        <div class="vital-time">最後更新: {{ vital.time }}</div>
      </el-card>
    </div>

    <el-card header="歷史紀錄" style="margin-top: 20px">
      <el-table :data="history" stripe>
        <el-table-column prop="date" label="日期" width="160" />
        <el-table-column prop="bp" label="血壓" width="120" />
        <el-table-column prop="hr" label="心率" width="100" />
        <el-table-column prop="temp" label="體溫" width="100" />
        <el-table-column prop="spo2" label="血氧" width="100" />
        <el-table-column prop="nurse" label="記錄者" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const vitals = ref([
  { label: '血壓', value: '128/82', unit: 'mmHg', status: 'success', statusLabel: '正常', time: '08:00' },
  { label: '心率', value: '76', unit: 'bpm', status: 'success', statusLabel: '正常', time: '08:00' },
  { label: '體溫', value: '36.8', unit: '°C', status: 'success', statusLabel: '正常', time: '08:00' },
  { label: '血氧', value: '98', unit: '%', status: 'success', statusLabel: '正常', time: '08:00' },
])

const history = ref([
  { date: '2026-03-03 08:00', bp: '128/82', hr: '76', temp: '36.8°C', spo2: '98%', nurse: '陳護理師' },
  { date: '2026-03-02 20:00', bp: '132/85', hr: '78', temp: '37.0°C', spo2: '97%', nurse: '林護理師' },
  { date: '2026-03-02 08:00', bp: '135/88', hr: '82', temp: '37.2°C', spo2: '96%', nurse: '陳護理師' },
  { date: '2026-03-01 20:00', bp: '140/90', hr: '85', temp: '37.5°C', spo2: '95%', nurse: '林護理師' },
])
</script>

<style scoped>
.page-header { margin-bottom: 20px; }
.page-title { font-size: 22px; font-weight: 700; color: #1a1a2e; margin: 0; }
.vitals-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.vital-card { text-align: center; }
.vital-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.vital-label { font-size: 14px; font-weight: 600; color: #555; }
.vital-value { font-size: 36px; font-weight: 700; color: #1a1a2e; }
.vital-unit { font-size: 13px; color: #999; }
.vital-time { font-size: 11px; color: #bbb; margin-top: 4px; }
</style>
