<template>
  <el-card>
    <template #header>
      <span>{{ $t('compliance.msdsDoc') }}: {{ msds?.productName }}</span>
    </template>
    <div v-if="msds">
      <el-descriptions :column="2" border size="small">
        <el-descriptions-item :label="$t('common.version')">{{ msds.version }}</el-descriptions-item>
        <el-descriptions-item :label="$t('common.issueDate')">{{ msds.issueDate }}</el-descriptions-item>
        <el-descriptions-item :label="$t('compliance.language')">
          <el-tag v-for="lang in msds.languages" :key="lang" size="small" style="margin-right:4px">{{ lang }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('common.status')">
          <StatusBadge :status="msds.status" />
        </el-descriptions-item>
      </el-descriptions>
      <div style="margin-top: 16px">
        <el-button type="primary" :icon="'Download'" size="small">{{ $t('common.download') }} MSDS</el-button>
      </div>
    </div>
    <el-empty v-else :description="$t('common.noData')" />
  </el-card>
</template>

<script setup>
import StatusBadge from '../../common/StatusBadge.vue'

defineProps({
  msds: { type: Object, default: null }
})
</script>
