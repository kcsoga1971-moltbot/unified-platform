<template>
  <div class="body-map">
    <div class="page-header">
      <h1 class="page-title">{{ $t('nav.patientBodyMap') }}</h1>
    </div>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-card header="身體部位標記">
          <div class="body-outline">
            <div class="body-svg">
              <svg viewBox="0 0 200 400" style="width: 200px; height: 400px;">
                <!-- Head -->
                <circle cx="100" cy="40" r="30" fill="#f5f5f5" stroke="#ccc" />
                <!-- Body -->
                <rect x="70" y="75" width="60" height="100" rx="10" fill="#f5f5f5" stroke="#ccc" />
                <!-- Left arm -->
                <rect x="30" y="80" width="35" height="15" rx="5" fill="#f5f5f5" stroke="#ccc" />
                <!-- Right arm -->
                <rect x="135" y="80" width="35" height="15" rx="5" fill="#f5f5f5" stroke="#ccc" />
                <!-- Left leg -->
                <rect x="72" y="180" width="22" height="100" rx="5" fill="#f5f5f5" stroke="#ccc" />
                <!-- Right leg -->
                <rect x="106" y="180" width="22" height="100" rx="5" fill="#f5f5f5" stroke="#ccc" />
                <!-- Markers -->
                <circle v-for="marker in markers" :key="marker.id"
                  :cx="marker.x" :cy="marker.y" r="8"
                  :fill="marker.severity === 'high' ? '#e53935' : marker.severity === 'medium' ? '#ff9800' : '#4caf50'"
                  stroke="white" stroke-width="2" style="cursor: pointer"
                  @click="selectMarker(marker)"
                />
              </svg>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card :header="selectedMarker ? selectedMarker.label : '選擇部位查看詳情'">
          <template v-if="selectedMarker">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="部位">{{ selectedMarker.label }}</el-descriptions-item>
              <el-descriptions-item label="症狀">{{ selectedMarker.symptom }}</el-descriptions-item>
              <el-descriptions-item label="嚴重度">
                <el-tag :type="selectedMarker.severity === 'high' ? 'danger' : selectedMarker.severity === 'medium' ? 'warning' : 'success'" size="small">
                  {{ { high: '嚴重', medium: '中等', low: '輕微' }[selectedMarker.severity] }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="記錄時間">{{ selectedMarker.date }}</el-descriptions-item>
              <el-descriptions-item label="備註">{{ selectedMarker.notes }}</el-descriptions-item>
            </el-descriptions>
          </template>
          <el-empty v-else description="點擊身體標記查看詳細資訊" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selectedMarker = ref(null)

const markers = ref([
  { id: 1, x: 100, y: 130, label: '腹部（手術傷口）', symptom: '術後傷口', severity: 'medium', date: '2026-03-02', notes: '傷口癒合中，無感染跡象' },
  { id: 2, x: 50, y: 85, label: '左手臂（點滴處）', symptom: '靜脈注射處', severity: 'low', date: '2026-03-03', notes: '注射處無紅腫' },
])

function selectMarker(marker) { selectedMarker.value = marker }
</script>

<style scoped>
.page-header { margin-bottom: 20px; }
.page-title { font-size: 22px; font-weight: 700; color: #1a1a2e; margin: 0; }
.body-outline { display: flex; justify-content: center; padding: 20px; }
</style>
