<template>
  <el-dialog
    v-model="visible"
    :title="$t('gateReview.title')"
    width="560px"
    @close="handleClose"
  >
    <div class="gate-review-form">
      <el-alert
        type="info"
        :closable="false"
        style="margin-bottom: 20px"
      >
        <p>{{ $t('gateReview.prerequisitesList') }}</p>
      </el-alert>

      <el-form :model="form" label-width="100px" label-position="left">
        <el-form-item :label="$t('gateReview.stage')">
          <el-tag type="primary">{{ $t(`stages.${stageName}`) }}</el-tag>
        </el-form-item>

        <el-form-item :label="$t('gateReview.reviewer')">
          <el-select
            v-model="form.reviewer"
            :placeholder="$t('gateReview.reviewerPlaceholder')"
            style="width: 100%"
          >
            <el-option
              v-for="user in users"
              :key="user.id"
              :label="user.name"
              :value="user.name"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('gateReview.decision')">
          <el-radio-group v-model="form.decision">
            <el-radio value="pass">
              <el-tag type="success">{{ $t('gateReview.pass') }}</el-tag>
            </el-radio>
            <el-radio value="conditional">
              <el-tag type="warning">{{ $t('gateReview.conditional') }}</el-tag>
            </el-radio>
            <el-radio value="fail">
              <el-tag type="danger">{{ $t('gateReview.fail') }}</el-tag>
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item :label="$t('gateReview.comments')">
          <el-input
            v-model="form.comments"
            type="textarea"
            :rows="4"
            :placeholder="$t('gateReview.commentsPlaceholder')"
          />
        </el-form-item>

        <el-form-item :label="$t('gateReview.date')">
          <el-date-picker
            v-model="form.date"
            type="date"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <el-button @click="handleClose">{{ $t('common.cancel') }}</el-button>
      <el-button
        type="primary"
        :disabled="!form.reviewer || !form.decision"
        @click="handleSubmit"
      >
        {{ $t('common.submit') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { DEMO_USERS } from '../../../utils/rdm-demoData.js'
import dayjs from 'dayjs'

const { t } = useI18n()

const props = defineProps({
  modelValue: Boolean,
  currentStage: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['update:modelValue', 'submit'])

const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const stageName = computed(() => props.currentStage)
const users = DEMO_USERS

const form = ref({
  reviewer: '',
  decision: 'pass',
  comments: '',
  date: dayjs().format('YYYY-MM-DD'),
  stage: props.currentStage,
})

watch(() => props.currentStage, (val) => {
  form.value.stage = val
})

function handleClose() {
  visible.value = false
}

function handleSubmit() {
  emit('submit', { ...form.value, stage: props.currentStage })
  handleClose()
}
</script>

<style scoped>
.gate-review-form {
  padding: 8px 0;
}
</style>
