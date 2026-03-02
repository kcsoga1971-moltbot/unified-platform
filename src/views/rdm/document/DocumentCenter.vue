<template>
  <div class="document-center-page">
    <div class="page-header">
      <h1 class="page-title">{{ $t('document.center') }}</h1>
      <el-button type="primary" @click="showUploadDialog = true">
        <el-icon><Upload /></el-icon>
        {{ $t('document.upload') }}
      </el-button>
    </div>

    <!-- Filters -->
    <div class="filter-bar">
      <el-select
        v-model="filters.projectId"
        :placeholder="$t('document.filterByProject')"
        clearable
        style="width: 220px"
      >
        <el-option :value="''" :label="$t('document.allProjects')" />
        <el-option v-for="p in projects" :key="p.id" :label="p.name" :value="p.id" />
      </el-select>

      <el-select
        v-model="filters.stage"
        :placeholder="$t('document.filterByStage')"
        clearable
        style="width: 180px"
      >
        <el-option :value="''" :label="$t('document.allStages')" />
        <el-option
          v-for="s in stages"
          :key="s.id"
          :label="`${s.id} - ${$t(`stages.${s.id}`)}`"
          :value="s.id"
        />
      </el-select>

      <el-select
        v-model="filters.type"
        :placeholder="$t('document.filterByType')"
        clearable
        style="width: 160px"
      >
        <el-option :value="''" :label="$t('document.allTypes')" />
        <el-option v-for="dt in documentTypes" :key="dt" :label="dt" :value="dt" />
      </el-select>

      <el-input
        v-model="filters.search"
        placeholder="搜索文档名称..."
        prefix-icon="Search"
        clearable
        style="width: 220px"
      />

      <el-button text @click="resetFilters">
        <el-icon><Refresh /></el-icon>
        {{ $t('common.reset') }}
      </el-button>

      <div style="margin-left: auto">
        <el-button-group>
          <el-button :type="viewMode === 'list' ? 'primary' : ''" @click="viewMode = 'list'">
            <el-icon><List /></el-icon>
          </el-button>
          <el-button :type="viewMode === 'tree' ? 'primary' : ''" @click="viewMode = 'tree'">
            <el-icon><Share /></el-icon>
          </el-button>
        </el-button-group>
      </div>
    </div>

    <div class="result-count">
      {{ $t('common.total') }} {{ filteredDocuments.length }} {{ $t('common.items') }}
    </div>

    <!-- Tree View -->
    <div v-if="viewMode === 'tree'" class="tree-view-layout">
      <div class="tree-panel">
        <el-tree
          :data="treeData"
          :props="treeProps"
          @node-click="onTreeNodeClick"
          highlight-current
          default-expand-all
        >
          <template #default="{ node, data }">
            <span class="tree-node">
              <el-icon v-if="data.type === 'project'"><FolderOpened /></el-icon>
              <el-icon v-else-if="data.type === 'stage'"><Folder /></el-icon>
              <el-icon v-else><Document /></el-icon>
              <span>{{ node.label }}</span>
              <el-badge v-if="data.count" :value="data.count" type="info" style="margin-left: 4px" />
            </span>
          </template>
        </el-tree>
      </div>
      <div class="tree-content">
        <DocumentList
          :documents="treeFilteredDocuments"
          @download="handleDownload"
          @preview="handlePreview"
        />
      </div>
    </div>

    <!-- List View -->
    <DocumentList
      v-else
      :documents="filteredDocuments"
      @download="handleDownload"
      @preview="handlePreview"
    />

    <DocumentUpload
      v-model="showUploadDialog"
      @uploaded="onUploaded"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { useProjectStore } from '../../../stores/rdm-project.js'
import DocumentList from '../../../components/rdm/document/DocumentList.vue'
import DocumentUpload from '../../../components/rdm/document/DocumentUpload.vue'
import { STAGES, DOCUMENT_TYPES } from '../../../utils/rdm-constants.js'
import { DEMO_DOCUMENTS } from '../../../utils/rdm-demoData.js'
import { loadFromLocalStorage, saveToLocalStorage } from '../../../utils/rdm-helpers.js'

const { t } = useI18n()
const projectStore = useProjectStore()

const viewMode = ref('list')
const showUploadDialog = ref(false)

const stages = STAGES
const documentTypes = DOCUMENT_TYPES
const projects = computed(() => projectStore.projects)

const allDocuments = ref(loadFromLocalStorage('rdm_documents', DEMO_DOCUMENTS))

const filters = ref({
  projectId: '',
  stage: '',
  type: '',
  search: '',
})

const selectedTreeNode = ref(null)

const filteredDocuments = computed(() => {
  let docs = allDocuments.value
  if (filters.value.projectId) {
    docs = docs.filter((d) => d.projectId === filters.value.projectId)
  }
  if (filters.value.stage !== '') {
    docs = docs.filter((d) => d.stage === filters.value.stage)
  }
  if (filters.value.type) {
    docs = docs.filter((d) => d.type === filters.value.type)
  }
  if (filters.value.search) {
    const q = filters.value.search.toLowerCase()
    docs = docs.filter((d) => d.name.toLowerCase().includes(q))
  }
  return docs
})

const treeFilteredDocuments = computed(() => {
  if (!selectedTreeNode.value) return filteredDocuments.value
  const node = selectedTreeNode.value
  if (node.type === 'project') {
    return filteredDocuments.value.filter((d) => d.projectId === node.id)
  }
  if (node.type === 'stage') {
    return filteredDocuments.value.filter(
      (d) => d.projectId === node.projectId && d.stage === node.stageId,
    )
  }
  return filteredDocuments.value
})

const treeData = computed(() => {
  const projectMap = {}
  for (const doc of allDocuments.value) {
    if (!projectMap[doc.projectId]) {
      projectMap[doc.projectId] = {
        id: doc.projectId,
        label: doc.projectName,
        type: 'project',
        count: 0,
        children: {},
      }
    }
    const proj = projectMap[doc.projectId]
    proj.count++
    if (!proj.children[doc.stage]) {
      proj.children[doc.stage] = {
        id: `${doc.projectId}_stage_${doc.stage}`,
        label: t(`stages.${doc.stage}`),
        type: 'stage',
        projectId: doc.projectId,
        stageId: doc.stage,
        count: 0,
        children: [],
      }
    }
    proj.children[doc.stage].count++
  }
  return Object.values(projectMap).map((p) => ({
    ...p,
    children: Object.values(p.children),
  }))
})

const treeProps = { children: 'children', label: 'label' }

function onTreeNodeClick(node) {
  selectedTreeNode.value = node
}

function resetFilters() {
  filters.value = { projectId: '', stage: '', type: '', search: '' }
}

function handleDownload(doc) {
  ElMessage.info(`${t('document.download')}: ${doc.name}`)
}

function handlePreview(doc) {
  ElMessage.info(`${t('document.preview')}: ${doc.name}`)
}

function onUploaded(newDoc) {
  allDocuments.value.unshift(newDoc)
  saveToLocalStorage('rdm_documents', allDocuments.value)
  ElMessage.success(t('document.uploadSuccess'))
}
</script>

<style scoped>
.document-center-page {
  max-width: 1400px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
}

.filter-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.result-count {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 16px;
}

.tree-view-layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 20px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

.tree-panel {
  border-right: 1px solid #e5e7eb;
  padding: 16px;
}

.tree-content {
  padding: 16px;
}

.tree-node {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}
</style>
