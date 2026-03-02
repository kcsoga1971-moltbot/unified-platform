<template>
  <div>
    <div class="page-header">
      <h2>{{ $t('nav.customsDecl') }}</h2>
      <el-button type="primary" :icon="'Plus'">{{ $t('logistics.newDeclaration') }}</el-button>
    </div>

    <!-- Filters -->
    <el-card style="margin-bottom:16px">
      <el-row :gutter="12">
        <el-col :span="4">
          <el-select v-model="filterType" :placeholder="$t('common.type')" clearable>
            <el-option :label="$t('logistics.import')" value="import" />
            <el-option :label="$t('logistics.export')" value="export" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="filterStatus" :placeholder="$t('common.status')" clearable>
            <el-option v-for="s in customsStatuses" :key="s" :label="$t('logistics.customsStatus.' + s)" :value="s" />
          </el-select>
        </el-col>
        <el-col :span="3"><el-button @click="resetFilters">{{ $t('common.reset') }}</el-button></el-col>
      </el-row>
    </el-card>

    <el-card>
      <el-table :data="filteredDeclarations" stripe @row-click="showDetail">
        <el-table-column :label="$t('logistics.declarationNumber')" prop="declarationNumber" min-width="180" />
        <el-table-column :label="$t('common.type')" width="80">
          <template #default="{ row }">
            <el-tag :type="row.type === 'import' ? 'primary' : 'warning'" size="small">
              {{ $t('logistics.' + row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('logistics.hsCode')" prop="hsCode" width="100" />
        <el-table-column :label="$t('logistics.goods')" prop="goods" min-width="150" />
        <el-table-column :label="$t('logistics.declaredValue')" width="140">
          <template #default="{ row }">
            <CurrencyDisplay :amount="row.declaredValue" :currency="row.currency" />
          </template>
        </el-table-column>
        <el-table-column :label="$t('logistics.dutyAmount')" width="120">
          <template #default="{ row }">
            <CurrencyDisplay :amount="row.dutyAmount" :currency="row.currency" />
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.status')" width="100">
          <template #default="{ row }">
            <el-tag :type="customsStatusType(row.status)" size="small">
              {{ $t('logistics.customsStatus.' + row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('logistics.requiredDocs')" width="160">
          <template #default="{ row }">
            <div class="doc-checks">
              <el-tooltip v-for="(ok, doc) in row.docs" :key="doc" :content="$t('logistics.' + doc)">
                <el-icon :color="ok ? '#67c23a' : '#f56c6c'">
                  <component :is="ok ? 'CircleCheckFilled' : 'CircleCloseFilled'" />
                </el-icon>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Detail dialog -->
    <el-dialog v-model="dialogVisible" :title="$t('logistics.declarationDetail')" width="600px">
      <div v-if="selectedDecl">
        <el-descriptions :column="2" border>
          <el-descriptions-item :label="$t('logistics.declarationNumber')">{{ selectedDecl.declarationNumber }}</el-descriptions-item>
          <el-descriptions-item :label="$t('common.status')">
            <el-tag :type="customsStatusType(selectedDecl.status)" size="small">{{ $t('logistics.customsStatus.' + selectedDecl.status) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item :label="$t('logistics.hsCode')">{{ selectedDecl.hsCode }}</el-descriptions-item>
          <el-descriptions-item :label="$t('logistics.declaredValue')">
            <CurrencyDisplay :amount="selectedDecl.declaredValue" :currency="selectedDecl.currency" />
          </el-descriptions-item>
          <el-descriptions-item :label="$t('logistics.dutyRate')">{{ (selectedDecl.dutyRate * 100).toFixed(1) }}%</el-descriptions-item>
          <el-descriptions-item :label="$t('logistics.dutyAmount')">
            <CurrencyDisplay :amount="selectedDecl.dutyAmount" :currency="selectedDecl.currency" />
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { demoCustomsDeclarations } from '../../../utils/sales-demoData.js'
import CurrencyDisplay from '../../../components/common/CurrencyDisplay.vue'

const { t } = useI18n()
const filterType = ref('')
const filterStatus = ref('')
const dialogVisible = ref(false)
const selectedDecl = ref(null)

const customsStatuses = ['pending', 'submitted', 'cleared', 'released']

const filteredDeclarations = computed(() => {
  return demoCustomsDeclarations.filter(d => {
    if (filterType.value && d.type !== filterType.value) return false
    if (filterStatus.value && d.status !== filterStatus.value) return false
    return true
  })
})

function resetFilters() { filterType.value = ''; filterStatus.value = '' }

function showDetail(row) {
  selectedDecl.value = row
  dialogVisible.value = true
}

function customsStatusType(status) {
  const map = { pending: 'warning', submitted: '', cleared: 'success', released: 'success' }
  return map[status] || 'info'
}
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { font-size: 20px; font-weight: 600; }
.doc-checks { display: flex; gap: 4px; align-items: center; }
</style>
