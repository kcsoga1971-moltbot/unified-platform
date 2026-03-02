<template>
  <el-dropdown @command="changeLocale" trigger="click">
    <el-button size="small" plain>
      <el-icon><Sort /></el-icon>
      {{ currentLabel }}
      <el-icon class="el-icon--right"><ArrowDown /></el-icon>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="lang in locales"
          :key="lang.value"
          :command="lang.value"
          :class="{ 'is-active': locale === lang.value }"
        >
          {{ lang.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLocale } from '../../i18n/index.js'

const { locale } = useI18n()

const locales = [
  { value: 'zh-CN', label: '简体中文' },
  { value: 'en-US', label: 'English' },
]

const currentLabel = computed(() => {
  const found = locales.find((l) => l.value === locale.value)
  return found ? found.label : 'ZH'
})

function changeLocale(lang) {
  setLocale(lang)
}
</script>

<style scoped>
:deep(.is-active) {
  color: #1a73e8;
  font-weight: 600;
}
</style>
