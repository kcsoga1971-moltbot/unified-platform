<template>
  <el-dialog
    v-model="visible"
    :title="$t('document.upload')"
    width="560px"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      label-position="left"
    >
      <el-form-item :label="$t('document.name')" prop="name">
        <el-input
          v-model="form.name"
          :placeholder="$t('document.namePlaceholder')"
        />
      </el-form-item>

      <el-form-item :label="$t('document.project')" prop="projectId">
        <el-select
          v-model="form.projectId"
          :placeholder="$t('document.projectPlaceholder')"
          style="width: 100%"
          @change="onProjectChange"
        >
          <el-option
            v-for="p in projects"
            :key="p.id"
            :label="p.name"
            :value="p.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('document.stage')">
        <el-select
          v-model="form.stage"
          :placeholder="$t('document.stagePlaceholder')"
          style="width: 100%"
        >
          <el-option
            v-for="s in stages"
            :key="s.id"
            :label="`${s.id} - ${locale === 'zh-CN' ? s.nameZh : s.nameEn}`"
            :value="s.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('document.documentType')" prop="type">
        <el-select
          v-model="form.type"
          :placeholder="$t('document.typePlaceholder')"
          style="width: 100%"
        >
          <el-option
            v-for="dt in documentTypes"
            :key="dt"
            :label="dt"
            :value="dt"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('document.documentVersion')">
        <el-input
          v-model="form.version"
          :placeholder="$t('document.versionPlaceholder')"
        />
      </el-form-item>

      <el-form-item :label="$t('document.description')">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="3"
          :placeholder="$t('document.descriptionPlaceholder')"
        />
      </el-form-item>

      <el-form-item :label="$t('document.selectFile')">
        <FileUploader ref="uploaderRef" @change="onFileChange" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" :loading="uploading" @click="handleSubmit">
        {{ $t('document.upload') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { useProjectStore } from '../../../stores/rdm-project.js'
import { STAGES, DOCUMENT_TYPES } from '../../../utils/rdm-constants.js'
import FileUploader from '../../common/FileUploader.vue'

const { t, locale } = useI18n()
const projectStore = useProjectStore()

const props = defineProps({
  modelValue: Boolean,
  presetProjectId: String,
  presetStageId: Number,
})

const emit = defineEmits(['update:modelValue', 'uploaded'])

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const formRef = ref(null)
const uploaderRef = ref(null)
const uploading = ref(false)

const stages = STAGES
const documentTypes = DOCUMENT_TYPES
const projects = computed(() => projectStore.projects)

const form = ref({
  name: '',
  projectId: props.presetProjectId || '',
  projectName: '',
  stage: props.presetStageId ?? 0,
  type: '',
  version: '1.0',
  description: '',
  file: null,
})

watch(() => props.presetProjectId, (val) => {
  if (val) {
    form.value.projectId = val
    const project = projectStore.getProjectById(val)
    if (project) form.value.projectName = project.name
  }
})

watch(() => props.presetStageId, (val) => {
  if (val !== undefined && val !== null) {
    form.value.stage = val
  }
})

const rules = {
  name: [{ required: true, message: t('common.required'), trigger: 'blur' }],
  projectId: [{ required: true, message: t('common.required'), trigger: 'change' }],
  type: [{ required: true, message: t('common.required'), trigger: 'change' }],
}

function onProjectChange(projectId) {
  const project = projects.value.find((p) => p.id === projectId)
  if (project) {
    form.value.projectName = project.name
    form.value.stage = project.currentStage
  }
}

function onFileChange(file) {
  form.value.file = file
}

async function handleSubmit() {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    uploading.value = true

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const newDoc = {
      id: 'doc_' + Date.now(),
      name: form.value.name,
      type: form.value.type,
      version: form.value.version,
      description: form.value.description,
      projectId: form.value.projectId,
      projectName: form.value.projectName,
      stage: form.value.stage,
      uploadedBy: '当前用户',
      uploadedAt: new Date().toISOString(),
      size: form.value.file ? `${(form.value.file.size / 1024 / 1024).toFixed(1)} MB` : 'N/A',
      fileType: form.value.file?.name.split('.').pop() || 'pdf',
      versions: [
        {
          version: form.value.version,
          uploadedAt: new Date().toISOString(),
          uploadedBy: '当前用户',
        },
      ],
    }

    emit('uploaded', newDoc)
    ElMessage.success(t('document.uploadSuccess'))
    handleClose()
  } catch (e) {
    console.error(e)
  } finally {
    uploading.value = false
  }
}

function handleClose() {
  visible.value = false
  form.value = {
    name: '',
    projectId: '',
    projectName: '',
    stage: 0,
    type: '',
    version: '1.0',
    description: '',
    file: null,
  }
  uploaderRef.value?.reset()
}
</script>
