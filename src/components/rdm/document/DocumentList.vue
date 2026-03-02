<template>
  <div class="document-list">
    <div v-if="documents.length === 0" class="empty-state">
      <el-icon size="48" color="#d1d5db"><Document /></el-icon>
      <p>{{ $t('document.noDocuments') }}</p>
    </div>

    <div v-else class="doc-items">
      <div v-for="doc in documents" :key="doc.id" class="doc-item">
        <div class="doc-icon">
          <el-icon size="24" :color="fileIconColor(doc.fileType)">
            <component :is="fileIcon(doc.fileType)" />
          </el-icon>
        </div>

        <div class="doc-info">
          <div class="doc-name">{{ doc.name }}</div>
          <div class="doc-meta">
            <el-tag size="small" type="info">{{ doc.type }}</el-tag>
            <el-tag size="small">v{{ doc.version }}</el-tag>
            <span class="doc-project">{{ doc.projectName }}</span>
            <span class="doc-stage">{{ $t(`stages.${doc.stage}`) }}</span>
          </div>
          <div class="doc-sub">
            <span>{{ $t('document.uploadedBy') }}: {{ doc.uploadedBy }}</span>
            <span>{{ formatDate(doc.uploadedAt) }}</span>
            <span>{{ doc.size }}</span>
          </div>
        </div>

        <div class="doc-actions">
          <el-tooltip :content="$t('document.versionHistory')">
            <el-button size="small" text @click="showVersionHistory(doc)">
              <el-icon><Timer /></el-icon>
              {{ doc.versions?.length || 1 }}
            </el-button>
          </el-tooltip>
          <el-button size="small" type="primary" text @click="$emit('download', doc)">
            <el-icon><Download /></el-icon>
            {{ $t('document.download') }}
          </el-button>
        </div>
      </div>
    </div>

    <!-- Version History Dialog -->
    <el-dialog
      v-model="versionDialogVisible"
      :title="$t('document.versionHistory')"
      width="480px"
    >
      <div v-if="selectedDoc">
        <p class="selected-doc-name">{{ selectedDoc.name }}</p>
        <el-timeline>
          <el-timeline-item
            v-for="v in (selectedDoc.versions || []).slice().reverse()"
            :key="v.version"
            :timestamp="formatDate(v.uploadedAt)"
            placement="top"
          >
            <div class="version-item">
              <el-tag size="small" type="primary">v{{ v.version }}</el-tag>
              <span>{{ v.uploadedBy }}</span>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { formatDate } from '../../../utils/rdm-helpers.js'

defineProps({
  documents: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['download', 'preview'])

const versionDialogVisible = ref(false)
const selectedDoc = ref(null)

function showVersionHistory(doc) {
  selectedDoc.value = doc
  versionDialogVisible.value = true
}

function fileIcon(type) {
  const map = {
    pdf: 'Document',
    xlsx: 'Grid',
    xls: 'Grid',
    docx: 'Memo',
    doc: 'Memo',
    png: 'Picture',
    jpg: 'Picture',
    jpeg: 'Picture',
  }
  return map[type?.toLowerCase()] || 'Document'
}

function fileIconColor(type) {
  const map = {
    pdf: '#f5222d',
    xlsx: '#52c41a',
    xls: '#52c41a',
    docx: '#1a73e8',
    doc: '#1a73e8',
    png: '#722ed1',
    jpg: '#722ed1',
  }
  return map[type?.toLowerCase()] || '#6b7280'
}
</script>

<style scoped>
.doc-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.doc-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  transition: all 0.2s;
}

.doc-item:hover {
  border-color: #1a73e8;
  box-shadow: 0 2px 8px rgba(26, 115, 232, 0.08);
}

.doc-icon {
  width: 40px;
  height: 40px;
  background: #f3f4f6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.doc-info {
  flex: 1;
  min-width: 0;
}

.doc-name {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.doc-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 4px;
}

.doc-project,
.doc-stage {
  font-size: 12px;
  color: #6b7280;
}

.doc-sub {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #9ca3af;
}

.doc-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #9ca3af;
}

.empty-state p {
  margin-top: 12px;
  font-size: 15px;
}

.selected-doc-name {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.version-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #374151;
}
</style>
