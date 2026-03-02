<template>
  <div class="data-entry-table">
    <div class="table-actions">
      <el-button size="small" @click="addRow">{{ $t('testData.addSample') }}</el-button>
      <el-button size="small" @click="pasteFromClipboard">粘贴数据</el-button>
    </div>
    <el-table :data="rows" border size="small" class="data-table">
      <el-table-column type="index" :label="$t('testData.sampleNo')" width="70" />
      <el-table-column :label="$t('testData.measurement')">
        <template #default="{ row, $index }">
          <el-input
            v-model.number="rows[$index].value"
            size="small"
            type="number"
            @input="updateStats"
          />
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.status')" width="80">
        <template #default="{ row }">
          <el-tag
            v-if="row.value !== null && row.value !== ''"
            :type="isInSpec(row.value) ? 'success' : 'danger'"
            size="small"
          >
            {{ isInSpec(row.value) ? 'OK' : 'NG' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column width="60">
        <template #default="{ $index }">
          <el-button size="small" type="danger" :icon="'Delete'" circle @click="removeRow($index)" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  lsl: { type: Number, default: null },
  usl: { type: Number, default: null },
  modelValue: { type: Array, default: () => [] },
})
const emit = defineEmits(['update:modelValue', 'stats-update'])

const rows = ref(props.modelValue.map(v => ({ value: v })))

if (rows.value.length === 0) {
  for (let i = 0; i < 5; i++) rows.value.push({ value: '' })
}

function isInSpec(val) {
  if (val === '' || val === null) return true
  const v = parseFloat(val)
  if (props.lsl !== null && v < props.lsl) return false
  if (props.usl !== null && v > props.usl) return false
  return true
}

function addRow() {
  rows.value.push({ value: '' })
}

function removeRow(idx) {
  rows.value.splice(idx, 1)
  updateStats()
}

function updateStats() {
  const vals = rows.value.map(r => parseFloat(r.value)).filter(v => !isNaN(v))
  emit('update:modelValue', vals)

  if (vals.length < 2) {
    emit('stats-update', { mean: 0, stdDev: 0, min: 0, max: 0, cpk: 0, cp: 0 })
    return
  }

  const mean = vals.reduce((a, b) => a + b, 0) / vals.length
  const variance = vals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (vals.length - 1)
  const stdDev = Math.sqrt(variance)
  const min = Math.min(...vals)
  const max = Math.max(...vals)

  let cpk = 0
  let cp = 0
  if (stdDev > 0 && props.lsl !== null && props.usl !== null) {
    const cpu = (props.usl - mean) / (3 * stdDev)
    const cpl = (mean - props.lsl) / (3 * stdDev)
    cpk = Math.min(cpu, cpl)
    cp = (props.usl - props.lsl) / (6 * stdDev)
  }

  emit('stats-update', {
    mean: Math.round(mean * 1000) / 1000,
    stdDev: Math.round(stdDev * 1000) / 1000,
    min: Math.round(min * 1000) / 1000,
    max: Math.round(max * 1000) / 1000,
    cpk: Math.round(cpk * 100) / 100,
    cp: Math.round(cp * 100) / 100,
  })
}

async function pasteFromClipboard() {
  try {
    const text = await navigator.clipboard.readText()
    const vals = text.split(/[\n\t\s,]+/).map(s => parseFloat(s.trim())).filter(v => !isNaN(v))
    if (vals.length > 0) {
      rows.value = vals.map(v => ({ value: v }))
      updateStats()
      ElMessage.success(`已粘贴 ${vals.length} 条数据`)
    }
  } catch {
    ElMessage.warning('请直接输入数据')
  }
}
</script>

<style scoped>
.data-entry-table {}
.table-actions { display: flex; gap: 8px; margin-bottom: 8px; }
.data-table { width: 100%; }
</style>
