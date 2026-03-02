<template>
  <div class="settings-page">
    <div class="page-header">
      <h1 class="page-title">{{ $t('settings.title') }}</h1>
    </div>

    <div class="settings-layout">
      <!-- Sidebar Nav -->
      <div class="settings-nav">
        <div
          v-for="tab in tabs"
          :key="tab.key"
          class="nav-item"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          <el-icon><component :is="tab.icon" /></el-icon>
          {{ tab.label }}
        </div>
      </div>

      <!-- Settings Content -->
      <div class="settings-content">
        <!-- Profile Settings -->
        <div v-show="activeTab === 'profile'" class="settings-section">
          <h2 class="section-title">{{ $t('settings.profile') }}</h2>
          <el-form :model="profileForm" label-width="120px" label-position="left">
            <el-form-item :label="$t('settings.name')">
              <el-input v-model="profileForm.name" size="large" />
            </el-form-item>
            <el-form-item :label="$t('settings.email')">
              <el-input v-model="profileForm.email" type="email" size="large" disabled />
            </el-form-item>
            <el-form-item :label="$t('settings.role')">
              <el-select v-model="profileForm.role" size="large" style="width: 100%">
                <el-option value="pm" :label="$t('auth.roles.pm')" />
                <el-option value="engineer" :label="$t('auth.roles.engineer')" />
                <el-option value="quality" :label="$t('auth.roles.quality')" />
                <el-option value="manager" :label="$t('auth.roles.manager')" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('settings.department')">
              <el-input v-model="profileForm.department" size="large" />
            </el-form-item>
            <el-form-item :label="$t('settings.location')">
              <el-select v-model="profileForm.location" size="large" style="width: 100%">
                <el-option value="taiwan" :label="$t('auth.taiwan')" />
                <el-option value="china" :label="$t('auth.china')" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="large" @click="saveProfile">
                {{ $t('common.save') }}
              </el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- Notification Settings -->
        <div v-show="activeTab === 'notifications'" class="settings-section">
          <h2 class="section-title">{{ $t('settings.notifications') }}</h2>
          <el-form :model="notifForm" label-width="160px" label-position="left">
            <el-form-item :label="$t('settings.emailNotifications')">
              <el-switch v-model="notifForm.emailEnabled" />
              <p class="hint-text">{{ $t('settings.emailNotificationsHint') }}</p>
            </el-form-item>
            <el-form-item :label="$t('settings.reminderFrequency')">
              <el-radio-group v-model="notifForm.reminderFrequency">
                <el-radio value="daily">{{ $t('settings.daily') }}</el-radio>
                <el-radio value="weekly">{{ $t('settings.weekly') }}</el-radio>
                <el-radio value="never">{{ $t('settings.never') }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="large" @click="saveNotifications">
                {{ $t('common.save') }}
              </el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- Language Settings -->
        <div v-show="activeTab === 'language'" class="settings-section">
          <h2 class="section-title">{{ $t('settings.language') }}</h2>
          <p class="hint-text" style="margin-bottom: 20px">{{ $t('settings.languageHint') }}</p>
          <div class="lang-options">
            <div
              class="lang-option"
              :class="{ selected: currentLocale === 'zh-CN' }"
              @click="changeLocale('zh-CN')"
            >
              <div class="lang-flag">🇨🇳</div>
              <div class="lang-name">简体中文</div>
              <el-icon v-if="currentLocale === 'zh-CN'" color="#1a73e8"><Check /></el-icon>
            </div>
            <div
              class="lang-option"
              :class="{ selected: currentLocale === 'en-US' }"
              @click="changeLocale('en-US')"
            >
              <div class="lang-flag">🇺🇸</div>
              <div class="lang-name">English</div>
              <el-icon v-if="currentLocale === 'en-US'" color="#1a73e8"><Check /></el-icon>
            </div>
          </div>
        </div>

        <!-- Demo Data Reset -->
        <div v-show="activeTab === 'advanced'" class="settings-section">
          <h2 class="section-title">{{ $t('settings.resetDemo') }}</h2>
          <el-alert type="warning" :closable="false" style="margin-bottom: 20px">
            {{ $t('settings.resetDemoConfirm') }}
          </el-alert>
          <el-button type="danger" @click="handleResetDemo">
            <el-icon><Refresh /></el-icon>
            {{ $t('settings.resetDemo') }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '../../../stores/rdm-user.js'
import { setLocale } from '../../../i18n/index.js'
import { resetDemoData } from '../../../utils/rdm-demoData.js'

const { t, locale } = useI18n()
const userStore = useUserStore()

const activeTab = ref('profile')
const currentLocale = computed(() => locale.value)

const tabs = computed(() => [
  { key: 'profile', label: t('settings.profile'), icon: 'User' },
  { key: 'notifications', label: t('settings.notifications'), icon: 'Bell' },
  { key: 'language', label: t('settings.language'), icon: 'Sort' },
  { key: 'advanced', label: t('settings.resetDemo'), icon: 'Setting' },
])

const user = computed(() => userStore.currentUser)

const profileForm = ref({
  name: user.value?.name || '',
  email: user.value?.email || '',
  role: user.value?.role || 'engineer',
  department: user.value?.department || 'R&D',
  location: user.value?.location || 'taiwan',
})

const notifForm = ref({
  emailEnabled: true,
  reminderFrequency: 'daily',
})

function saveProfile() {
  userStore.updateProfile({
    name: profileForm.value.name,
    role: profileForm.value.role,
    department: profileForm.value.department,
    location: profileForm.value.location,
  })
  ElMessage.success(t('settings.profileSaved'))
}

function saveNotifications() {
  ElMessage.success(t('settings.notificationSaved'))
}

function changeLocale(lang) {
  setLocale(lang)
  ElMessage.success(t('common.operationSuccess'))
}

async function handleResetDemo() {
  try {
    await ElMessageBox.confirm(t('settings.resetDemoConfirm'), t('settings.resetDemo'), {
      type: 'warning',
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
    })
    resetDemoData()
    ElMessage.success(t('settings.resetDemoSuccess'))
    setTimeout(() => window.location.reload(), 1000)
  } catch (e) {
    // cancelled
  }
}
</script>

<style scoped>
.settings-page {
  max-width: 900px;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
}

.settings-layout {
  display: flex;
  gap: 24px;
}

.settings-nav {
  width: 200px;
  flex-shrink: 0;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 8px;
  height: fit-content;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
  transition: all 0.2s;
}

.nav-item:hover {
  background: #f3f4f6;
}

.nav-item.active {
  background: #e8f0fe;
  color: #1a73e8;
  font-weight: 500;
}

.settings-content {
  flex: 1;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 28px;
}

.settings-section {
  max-width: 540px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.hint-text {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 4px;
}

.lang-options {
  display: flex;
  gap: 16px;
}

.lang-option {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.lang-option:hover {
  border-color: #1a73e8;
}

.lang-option.selected {
  border-color: #1a73e8;
  background: #e8f0fe;
}

.lang-flag {
  font-size: 24px;
}

.lang-name {
  flex: 1;
  font-size: 15px;
  font-weight: 500;
  color: #374151;
}
</style>
