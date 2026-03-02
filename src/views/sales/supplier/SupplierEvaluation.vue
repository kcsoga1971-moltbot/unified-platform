<template>
  <div>
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:12px">
        <el-button text :icon="'ArrowLeft'" @click="router.back()">{{ $t('common.back') }}</el-button>
        <h2>{{ $t('supplier.evaluation') }}: {{ supplier?.name }}</h2>
      </div>
    </div>

    <el-row :gutter="16">
      <el-col :span="12">
        <el-card>
          <template #header><span>{{ $t('supplier.evalForm') }}</span></template>
          <el-form :model="form" label-width="120px">
            <el-form-item v-for="dim in dimensions" :key="dim.key" :label="$t('supplier.' + dim.key)">
              <el-rate v-model="form[dim.key]" :max="5" show-score />
            </el-form-item>
            <el-form-item :label="$t('common.notes')">
              <el-input v-model="form.notes" type="textarea" :rows="3" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveEval">{{ $t('common.save') }}</el-button>
              <el-button @click="router.back()">{{ $t('common.cancel') }}</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header><span>{{ $t('supplier.overallScore') }}</span></template>
          <div style="text-align:center;padding:30px">
            <div style="font-size:48px;font-weight:bold;color:#0d47a1">{{ overallScore }}</div>
            <el-rate :model-value="overallScore" disabled :max="5" show-score score-template="{value}" />
          </div>
          <el-divider />
          <div v-for="dim in dimensions" :key="dim.key" class="dim-row">
            <span>{{ $t('supplier.' + dim.key) }}</span>
            <el-progress :percentage="(form[dim.key] / 5) * 100" :color="progressColor(form[dim.key])" :stroke-width="8" style="flex:1;margin:0 12px" />
            <span style="width:20px;text-align:right">{{ form[dim.key] }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSupplierStore } from '../../../stores/sales-supplier.js'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const supplierStore = useSupplierStore()

const supplier = computed(() => supplierStore.getById(route.params.id))

const dimensions = [
  { key: 'quality', weight: 0.3 },
  { key: 'delivery', weight: 0.25 },
  { key: 'price', weight: 0.25 },
  { key: 'service', weight: 0.1 },
  { key: 'compliance', weight: 0.1 }
]

const form = reactive({ quality: 4, delivery: 4, price: 4, service: 4, compliance: 4, notes: '' })

const overallScore = computed(() => {
  const total = dimensions.reduce((s, d) => s + form[d.key] * d.weight, 0)
  return parseFloat(total.toFixed(1))
})

function progressColor(val) {
  if (val >= 4) return '#67C23A'
  if (val >= 3) return '#E6A23C'
  return '#F56C6C'
}

function saveEval() {
  ElMessage.success(t('common.operationSuccess'))
  router.back()
}

onMounted(() => {
  supplierStore.fetchSuppliers()
  if (supplier.value?.scores) {
    Object.keys(supplier.value.scores).forEach(k => { form[k] = supplier.value.scores[k] })
  }
})
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { font-size: 20px; font-weight: 600; }
.dim-row { display: flex; align-items: center; padding: 8px 0; }
</style>
