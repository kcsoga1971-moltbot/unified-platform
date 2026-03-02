<template>
  <div>
    <div class="page-header">
      <h2>{{ $t('nav.licenseMgmt') }}</h2>
      <el-button type="primary" :icon="'Plus'">{{ $t('compliance.addLicense') }}</el-button>
    </div>

    <!-- Alert banner for expiring/expired -->
    <el-alert
      v-if="complianceStore.expiredLicenses.length > 0"
      :title="$t('compliance.expiredAlert', { count: complianceStore.expiredLicenses.length })"
      type="error"
      show-icon
      style="margin-bottom:12px"
    />
    <el-alert
      v-if="complianceStore.expiringLicenses.length > 0"
      :title="$t('compliance.expiringAlert', { count: complianceStore.expiringLicenses.length })"
      type="warning"
      show-icon
      style="margin-bottom:16px"
    />

    <!-- Summary cards -->
    <el-row :gutter="16" style="margin-bottom:16px">
      <el-col :span="6" v-for="stat in licenseStats" :key="stat.label">
        <el-card shadow="hover">
          <div class="stat-val" :style="{ color: stat.color }">{{ stat.value }}</div>
          <div class="stat-lab">{{ stat.label }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <el-table :data="complianceStore.licenses" stripe :row-class-name="rowClass">
        <el-table-column :label="$t('compliance.licenseType')" prop="type" min-width="160" />
        <el-table-column :label="$t('compliance.licenseNumber')" prop="licenseNumber" min-width="180" />
        <el-table-column :label="$t('compliance.issuedBy')" prop="issuedBy" min-width="140" />
        <el-table-column :label="$t('compliance.issueDate')" prop="issueDate" width="110" />
        <el-table-column :label="$t('compliance.expiryDate')" width="110">
          <template #default="{ row }">
            <span :style="{ color: getDateColor(row.expiryDate) }">{{ row.expiryDate }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('inventory.daysUntilExpiry')" width="120">
          <template #default="{ row }">
            <el-tag :type="getDaysType(row.expiryDate)" size="small">
              {{ getDaysLeft(row.expiryDate) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.status')" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'valid' ? 'success' : row.status === 'expiring' ? 'warning' : 'danger'" size="small">
              {{ $t('compliance.status.' + row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('compliance.renewalStatus')" width="110">
          <template #default="{ row }">
            <el-tag v-if="row.renewalStatus" type="primary" size="small">{{ $t('compliance.renewal.' + row.renewalStatus) }}</el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.actions')" width="160" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" size="small" :icon="'Download'">{{ $t('common.download') }}</el-button>
            <el-button text type="warning" size="small" @click="renewLicense(row)">{{ $t('compliance.renewLicense') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useComplianceStore } from '../../../stores/sales-compliance.js'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'

const { t } = useI18n()
const complianceStore = useComplianceStore()

const licenseStats = computed(() => [
  { label: t('compliance.totalLicenses'), value: complianceStore.licenses.length, color: '#0d47a1' },
  { label: t('compliance.status.valid'), value: complianceStore.licenses.filter(l => l.status === 'valid').length, color: '#67c23a' },
  { label: t('compliance.status.expiring'), value: complianceStore.expiringLicenses.length, color: '#e6a23c' },
  { label: t('compliance.status.expired'), value: complianceStore.expiredLicenses.length, color: '#f56c6c' }
])

function getDaysLeft(date) {
  const days = dayjs(date).diff(dayjs(), 'day')
  if (days < 0) return t('compliance.expired')
  return days + ' ' + t('inventory.days')
}

function getDaysType(date) {
  const days = dayjs(date).diff(dayjs(), 'day')
  if (days < 0) return 'danger'
  if (days <= 30) return 'danger'
  if (days <= 90) return 'warning'
  return 'success'
}

function getDateColor(date) {
  const days = dayjs(date).diff(dayjs(), 'day')
  if (days < 0) return '#f56c6c'
  if (days <= 30) return '#f56c6c'
  if (days <= 90) return '#e6a23c'
  return '#303133'
}

function rowClass({ row }) {
  if (row.status === 'expired') return 'danger-row'
  if (row.status === 'expiring') return 'warning-row'
  return ''
}

function renewLicense(row) {
  complianceStore.updateLicense(row.id, { renewalStatus: 'in_progress' })
  ElMessage.success(t('compliance.renewalStarted'))
}

onMounted(() => complianceStore.fetchLicenses())
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { font-size: 20px; font-weight: 600; }
.stat-val { font-size: 28px; font-weight: bold; }
.stat-lab { font-size: 12px; color: #909399; margin-top: 4px; }
</style>
