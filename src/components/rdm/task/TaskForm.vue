<template>
  <el-dialog
    v-model="visible"
    :title="isEdit ? $t('task.edit') : $t('task.create')"
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
      <el-form-item :label="$t('task.title')" prop="title">
        <el-input
          v-model="form.title"
          :placeholder="$t('task.titlePlaceholder')"
        />
      </el-form-item>

      <el-form-item :label="$t('task.description')">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="3"
          :placeholder="$t('task.descriptionPlaceholder')"
        />
      </el-form-item>

      <el-form-item :label="$t('task.project')" prop="projectId">
        <el-select
          v-model="form.projectId"
          :placeholder="$t('task.projectPlaceholder')"
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

      <el-form-item :label="$t('task.stage')">
        <el-select
          v-model="form.stage"
          :placeholder="$t('task.stagePlaceholder')"
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

      <el-form-item :label="$t('task.assignee')">
        <el-select
          v-model="form.assigneeId"
          :placeholder="$t('task.assigneePlaceholder')"
          style="width: 100%"
          @change="onAssigneeChange"
        >
          <el-option
            v-for="u in users"
            :key="u.id"
            :label="u.name"
            :value="u.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('task.dueDate')">
        <el-date-picker
          v-model="form.dueDate"
          type="date"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          style="width: 100%"
        />
      </el-form-item>

      <el-form-item :label="$t('task.priority')">
        <el-radio-group v-model="form.priority">
          <el-radio value="high">
            <el-tag type="danger" size="small">{{ $t('common.high') }}</el-tag>
          </el-radio>
          <el-radio value="medium">
            <el-tag type="warning" size="small">{{ $t('common.medium') }}</el-tag>
          </el-radio>
          <el-radio value="low">
            <el-tag type="info" size="small">{{ $t('common.low') }}</el-tag>
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item :label="$t('task.status')">
        <el-select v-model="form.status" style="width: 100%">
          <el-option value="todo" :label="$t('task.statusTodo')" />
          <el-option value="in_progress" :label="$t('task.statusInProgress')" />
          <el-option value="review" :label="$t('task.statusReview')" />
          <el-option value="done" :label="$t('task.statusDone')" />
        </el-select>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">{{ $t('common.cancel') }}</el-button>
      <el-button type="primary" @click="handleSubmit">
        {{ isEdit ? $t('common.save') : $t('common.create') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProjectStore } from '../../../stores/rdm-project.js'
import { STAGES } from '../../../utils/rdm-constants.js'
import { DEMO_USERS } from '../../../utils/rdm-demoData.js'

const { t, locale } = useI18n()
const projectStore = useProjectStore()

const props = defineProps({
  modelValue: Boolean,
  task: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'save'])

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const isEdit = computed(() => !!props.task?.id)

const stages = STAGES
const users = DEMO_USERS
const projects = computed(() => projectStore.projects)

const formRef = ref(null)

const defaultForm = () => ({
  title: '',
  description: '',
  projectId: '',
  projectName: '',
  stage: 0,
  assigneeId: '',
  assigneeName: '',
  dueDate: '',
  priority: 'medium',
  status: 'todo',
})

const form = ref(defaultForm())

watch(
  () => props.task,
  (task) => {
    if (task) {
      form.value = { ...defaultForm(), ...task }
    } else {
      form.value = defaultForm()
    }
  },
  { immediate: true },
)

const rules = {
  title: [{ required: true, message: t('common.required'), trigger: 'blur' }],
  projectId: [{ required: true, message: t('common.required'), trigger: 'change' }],
}

function onProjectChange(projectId) {
  const project = projects.value.find((p) => p.id === projectId)
  if (project) {
    form.value.projectName = project.name
    form.value.stage = project.currentStage
  }
}

function onAssigneeChange(userId) {
  const user = users.find((u) => u.id === userId)
  if (user) {
    form.value.assigneeName = user.name
  }
}

async function handleSubmit() {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    emit('save', { ...form.value })
    handleClose()
  } catch (e) {
    // validation failed
  }
}

function handleClose() {
  visible.value = false
  form.value = defaultForm()
}
</script>
