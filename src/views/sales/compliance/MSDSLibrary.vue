<template>
  <div>
    <div class="page-header">
      <h2>{{ $t('nav.msdsLibrary') }}</h2>
      <el-button type="primary" :icon="'Upload'">{{ $t('common.upload') }} MSDS</el-button>
    </div>

    <!-- Filters -->
    <el-card style="margin-bottom:16px">
      <el-row :gutter="12">
        <el-col :span="6"><el-input v-model="search" :placeholder="$t('common.search')" clearable /></el-col>
        <el-col :span="4">
          <el-select v-model="filterStatus" :placeholder="$t('common.status')" clearable>
            <el-option :label="$t('compliance.status.valid')" value="valid" />
            <el-option :label="$t('compliance.status.expiring')" value="expiring" />
          </el-select>
        </el-col>
        <el-col :span="3"><el-button @click="resetFilters">{{ $t('common.reset') }}</el-button></el-col>
      </el-row>
    </el-card>

    <el-card>
      <el-table :data="filteredMSDS" stripe>
        <el-table-column :label="$t('product.name')" min-width="180">
          <template #default="{ row }">
            <div>{{ row.productName }}</div>
            <el-tag size="small" type="info">{{ row.version }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('compliance.language')" min-width="160">
          <template #default="{ row }">
            <el-tag v-for="lang in row.languages" :key="lang" size="small" style="margin:2px">{{ lang }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.issueDate')" prop="issueDate" width="110" />
        <el-table-column :label="$t('compliance.expiryDate')" width="110">
          <template #default="{ row }">
            <span :style="{ color: row.status === 'expiring' ? '#e6a23c' : '' }">{{ row.expiryDate }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.status')" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'valid' ? 'success' : 'warning'" size="small">
              {{ $t('compliance.status.' + row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('compliance.fileSize')" prop="fileSize" width="90" />
        <el-table-column :label="$t('common.actions')" width="160" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" size="small" :icon="'Download'">{{ $t('common.download') }}</el-button>
            <el-button text type="warning" size="small" :icon="'Upload'">{{ $t('common.upload') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useComplianceStore } from '../../../stores/sales-compliance.js'

const { t } = useI18n()
const complianceStore = useComplianceStore()

const search = ref('')
const filterStatus = ref('')

const filteredMSDS = computed(() => {
  return complianceStore.msds.filter(m => {
    if (search.value && !m.productName.includes(search.value)) return false
    if (filterStatus.value && m.status !== filterStatus.value) return false
    return true
  })
})

function resetFilters() { search.value = ''; filterStatus.value = '' }

onMounted(() => complianceStore.fetchLicenses())
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { font-size: 20px; font-weight: 600; }
</style>
