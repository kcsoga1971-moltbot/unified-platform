<template>
  <div class="file-uploader">
    <div
      class="upload-area"
      :class="{ 'drag-over': isDragging }"
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
      @drop.prevent="handleDrop"
      @click="triggerInput"
    >
      <input
        ref="inputRef"
        type="file"
        :accept="accept"
        :multiple="multiple"
        style="display: none"
        @change="handleChange"
      />
      <el-icon size="40" color="#94a3b8"><UploadFilled /></el-icon>
      <p class="upload-text">{{ $t('document.dragOrClick') }}</p>
      <p class="upload-hint">{{ $t('document.fileTypes') }}</p>
    </div>

    <div v-if="fileList.length > 0" class="file-list">
      <div v-for="(file, idx) in fileList" :key="idx" class="file-item">
        <el-icon><Document /></el-icon>
        <span class="file-name">{{ file.name }}</span>
        <span class="file-size">{{ formatSize(file.size) }}</span>
        <el-button size="small" type="danger" circle @click="removeFile(idx)">
          <el-icon><Close /></el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  accept: {
    type: String,
    default: '.pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg',
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  maxSize: {
    type: Number,
    default: 50, // MB
  },
})

const emit = defineEmits(['change'])

const inputRef = ref(null)
const isDragging = ref(false)
const fileList = ref([])

function triggerInput() {
  inputRef.value?.click()
}

function handleChange(event) {
  const files = Array.from(event.target.files || [])
  addFiles(files)
}

function handleDrop(event) {
  isDragging.value = false
  const files = Array.from(event.dataTransfer.files || [])
  addFiles(files)
}

function addFiles(files) {
  for (const file of files) {
    if (file.size > props.maxSize * 1024 * 1024) {
      ElMessage.warning(`${file.name} 超过最大文件大小 ${props.maxSize}MB`)
      continue
    }
    if (!props.multiple) {
      fileList.value = [file]
    } else {
      fileList.value.push(file)
    }
  }
  emit('change', props.multiple ? fileList.value : fileList.value[0] || null)
}

function removeFile(idx) {
  fileList.value.splice(idx, 1)
  emit('change', props.multiple ? fileList.value : fileList.value[0] || null)
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function reset() {
  fileList.value = []
  if (inputRef.value) inputRef.value.value = ''
}

defineExpose({ reset })
</script>

<style scoped>
.upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: #fafafa;
}

.upload-area:hover,
.upload-area.drag-over {
  border-color: #1a73e8;
  background: #e8f0fe;
}

.upload-text {
  margin-top: 12px;
  color: #374151;
  font-size: 15px;
}

.upload-hint {
  margin-top: 6px;
  color: #9ca3af;
  font-size: 13px;
}

.file-list {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.file-name {
  flex: 1;
  font-size: 13px;
  color: #374151;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  font-size: 12px;
  color: #9ca3af;
  flex-shrink: 0;
}
</style>
