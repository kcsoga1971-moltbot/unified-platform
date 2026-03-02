<template>
  <div>
    <div class="page-header">
      <h2>{{ $t('nav.shipmentTracking') }}</h2>
    </div>

    <!-- Summary Stats -->
    <el-row :gutter="16" style="margin-bottom:16px">
      <el-col :span="6" v-for="stat in shipStats" :key="stat.label">
        <el-card shadow="hover">
          <div class="stat-val" :style="{ color: stat.color }">{{ stat.value }}</div>
          <div class="stat-lab">{{ stat.label }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card>
      <el-table :data="demoShipments" stripe>
        <el-table-column :label="$t('logistics.trackingNo')" prop="trackingNumber" min-width="170" />
        <el-table-column :label="$t('logistics.origin')" width="80">
          <template #default="{ row }"><CountryFlag :code="row.origin" /></template>
        </el-table-column>
        <el-table-column :label="$t('logistics.destination')" width="90">
          <template #default="{ row }"><CountryFlag :code="row.destination || 'CN'" /></template>
        </el-table-column>
        <el-table-column :label="$t('logistics.carrier')" prop="carrier" width="130" />
        <el-table-column :label="$t('logistics.goods')" prop="goods" min-width="160" />
        <el-table-column :label="$t('common.status')" width="120">
          <template #default="{ row }">
            <el-tag :type="shipStatusType(row.status)" size="small">
              {{ $t('logistics.shipmentStatus.' + row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('logistics.eta')" width="110">
          <template #default="{ row }">{{ formatDate(row.eta) }}</template>
        </el-table-column>
        <el-table-column :label="$t('logistics.weight')" prop="weight" width="90" />
        <el-table-column :label="$t('common.actions')" width="80">
          <template #default>
            <el-button text type="primary" size="small">{{ $t('common.view') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { demoShipments } from '../../../utils/sales-demoData.js'
import { formatDate } from '../../../utils/sales-helpers.js'
import CountryFlag from '../../../components/common/CountryFlag.vue'

const { t } = useI18n()

const shipStats = computed(() => [
  { label: t('logistics.totalShipments'), value: demoShipments.length, color: '#0d47a1' },
  { label: t('logistics.inTransit'), value: demoShipments.filter(s => s.status === 'inTransit').length, color: '#e6a23c' },
  { label: t('logistics.inCustoms'), value: demoShipments.filter(s => s.status === 'customs').length, color: '#f56c6c' },
  { label: t('logistics.delivered'), value: demoShipments.filter(s => s.status === 'delivered').length, color: '#67c23a' }
])

function shipStatusType(status) {
  const map = { booked: 'info', pickedUp: '', inTransit: 'warning', customs: 'danger', delivered: 'success' }
  return map[status] || 'info'
}
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { font-size: 20px; font-weight: 600; }
.stat-val { font-size: 32px; font-weight: bold; }
.stat-lab { font-size: 12px; color: #909399; margin-top: 4px; }
</style>
