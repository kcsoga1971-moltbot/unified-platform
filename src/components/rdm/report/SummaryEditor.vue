<template>
  <div class="summary-editor">
    <div v-if="aiGenerated" class="ai-notice">
      <el-icon><MagicStick /></el-icon>
      {{ $t('summary.aiGenerated') }}
    </div>

    <el-collapse v-model="openSections">
      <el-collapse-item
        v-for="section in sections"
        :key="section.key"
        :title="section.label"
        :name="section.key"
      >
        <!-- Array sections -->
        <div v-if="Array.isArray(modelValue[section.key])">
          <div
            v-for="(item, idx) in modelValue[section.key]"
            :key="idx"
            class="list-item"
          >
            <el-input
              v-model="modelValue[section.key][idx]"
              size="small"
              @input="$emit('update:modelValue', modelValue)"
            />
            <el-button
              size="small"
              type="danger"
              :icon="'Delete'"
              circle
              @click="removeItem(section.key, idx)"
            />
          </div>
          <el-button size="small" @click="addItem(section.key)">
            + {{ $t('common.new') }}
          </el-button>
        </div>
        <!-- String sections -->
        <el-input
          v-else
          v-model="modelValue[section.key]"
          type="textarea"
          :rows="3"
          @input="$emit('update:modelValue', modelValue)"
        />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
  modelValue: { type: Object, required: true },
  sections: { type: Array, required: true },
  aiGenerated: { type: Boolean, default: false },
})
defineEmits(['update:modelValue'])

const openSections = ref(props.sections.map(s => s.key))

function addItem(key) {
  if (Array.isArray(props.modelValue[key])) {
    props.modelValue[key].push('')
  }
}

function removeItem(key, idx) {
  if (Array.isArray(props.modelValue[key])) {
    props.modelValue[key].splice(idx, 1)
  }
}
</script>

<style scoped>
.summary-editor {}

.ai-notice {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #7c3aed;
  background: #ede9fe;
  padding: 8px 12px;
  border-radius: 6px;
  margin-bottom: 12px;
}

.list-item {
  display: flex;
  gap: 8px;
  margin-bottom: 6px;
  align-items: center;
}

.list-item .el-input {
  flex: 1;
}
</style>
