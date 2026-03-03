<template>
  <div class="patient-list">
    <div class="page-header">
      <h1 class="page-title">{{ $t('nav.crnPatients') }}</h1>
      <el-button type="primary"><el-icon><Plus /></el-icon> 新增病患</el-button>
    </div>

    <el-card>
      <div class="filter-bar">
        <el-input v-model="search" placeholder="搜尋病患姓名或編號..." style="width: 300px" clearable>
          <template #prefix><el-icon><Search /></el-icon></template>
        </el-input>
        <el-select v-model="statusFilter" placeholder="狀態" clearable style="width: 150px">
          <el-option label="全部" value="" />
          <el-option label="住院中" value="admitted" />
          <el-option label="已出院" value="discharged" />
          <el-option label="追蹤中" value="follow_up" />
        </el-select>
      </div>

      <el-table :data="patients" stripe style="width: 100%">
        <el-table-column prop="id" label="病歷號" width="120" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="age" label="年齡" width="80" />
        <el-table-column prop="diagnosis" label="主要診斷" />
        <el-table-column prop="status" label="狀態" width="100">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)" size="small">{{ statusLabel(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastVisit" label="最近訪視" width="120" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button size="small" @click="$router.push(`/crn/patients/${row.id}`)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const search = ref('')
const statusFilter = ref('')

const patients = ref([
  { id: 'P001', name: '王大明', age: 65, diagnosis: '大腸癌 Stage II', status: 'admitted', lastVisit: '2026-03-02' },
  { id: 'P002', name: '李小花', age: 52, diagnosis: '乳癌術後', status: 'follow_up', lastVisit: '2026-03-01' },
  { id: 'P003', name: '張三', age: 78, diagnosis: '肺癌 Stage III', status: 'admitted', lastVisit: '2026-03-03' },
  { id: 'P004', name: '陳美玲', age: 45, diagnosis: '子宮肌瘤術後', status: 'discharged', lastVisit: '2026-02-28' },
])

const statusType = (s) => ({ admitted: 'danger', discharged: 'success', follow_up: 'warning' }[s] || 'info')
const statusLabel = (s) => ({ admitted: '住院中', discharged: '已出院', follow_up: '追蹤中' }[s] || s)
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-title { font-size: 22px; font-weight: 700; color: #1a1a2e; margin: 0; }
.filter-bar { display: flex; gap: 12px; margin-bottom: 16px; }
</style>
