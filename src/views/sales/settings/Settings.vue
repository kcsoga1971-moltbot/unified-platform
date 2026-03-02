<template>
  <div>
    <div class="page-header">
      <h2>{{ $t('nav.settings') }}</h2>
    </div>

    <el-row :gutter="20">
      <el-col :span="16">
        <!-- Language & Region -->
        <el-card style="margin-bottom:16px">
          <template #header><span>{{ $t('settings.language') }} & {{ $t('settings.region') }}</span></template>
          <el-form :model="settingsForm" label-width="140px">
            <el-form-item :label="$t('settings.language')">
              <el-select v-model="settingsForm.language" @change="switchLang">
                <el-option label="🇨🇳 中文 (简体)" value="zh-CN" />
                <el-option label="🇺🇸 English" value="en-US" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('settings.currency')">
              <el-select v-model="settingsForm.currency">
                <el-option v-for="c in currencies" :key="c" :label="c" :value="c" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('settings.dateFormat')">
              <el-select v-model="settingsForm.dateFormat">
                <el-option label="YYYY-MM-DD" value="YYYY-MM-DD" />
                <el-option label="DD/MM/YYYY" value="DD/MM/YYYY" />
                <el-option label="MM/DD/YYYY" value="MM/DD/YYYY" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('settings.timezone')">
              <el-select v-model="settingsForm.timezone">
                <el-option label="UTC+8 (中国标准时间)" value="Asia/Shanghai" />
                <el-option label="UTC+9 (日本标准时间)" value="Asia/Tokyo" />
                <el-option label="UTC+9 (韩国标准时间)" value="Asia/Seoul" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- Notifications -->
        <el-card style="margin-bottom:16px">
          <template #header><span>{{ $t('settings.notifications') }}</span></template>
          <el-form :model="settingsForm" label-width="200px">
            <el-form-item :label="$t('settings.notif.lowStock')">
              <el-switch v-model="settingsForm.notifLowStock" />
            </el-form-item>
            <el-form-item :label="$t('settings.notif.expiryAlert')">
              <el-switch v-model="settingsForm.notifExpiry" />
            </el-form-item>
            <el-form-item :label="$t('settings.notif.arOverdue')">
              <el-switch v-model="settingsForm.notifAR" />
            </el-form-item>
            <el-form-item :label="$t('settings.notif.licenseExpiry')">
              <el-switch v-model="settingsForm.notifLicense" />
            </el-form-item>
          </el-form>
        </el-card>

        <!-- Company Info -->
        <el-card>
          <template #header><span>{{ $t('settings.companyInfo') }}</span></template>
          <el-form :model="settingsForm" label-width="140px">
            <el-form-item :label="$t('settings.companyName')">
              <el-input v-model="settingsForm.companyName" />
            </el-form-item>
            <el-form-item :label="$t('settings.companyAddress')">
              <el-input v-model="settingsForm.companyAddress" type="textarea" :rows="2" />
            </el-form-item>
            <el-form-item :label="$t('settings.taxId')">
              <el-input v-model="settingsForm.taxId" />
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <el-col :span="8">
        <!-- Profile -->
        <el-card style="margin-bottom:16px">
          <template #header><span>{{ $t('settings.profile') }}</span></template>
          <div style="text-align:center;padding:20px">
            <el-avatar :size="64" style="background-color:#0d47a1;font-size:24px">
              {{ userStore.currentUser?.name?.charAt(0) }}
            </el-avatar>
            <div style="margin-top:12px;font-size:16px;font-weight:600">{{ userStore.currentUser?.name }}</div>
            <div style="color:#909399;font-size:13px">{{ ROLE_LABELS[userStore.currentRole] }}</div>
            <el-tag style="margin-top:8px">{{ userStore.currentUser?.email }}</el-tag>
          </div>
        </el-card>

        <!-- Change Password -->
        <el-card>
          <template #header><span>{{ $t('settings.changePassword') }}</span></template>
          <el-form label-width="110px">
            <el-form-item :label="$t('settings.currentPassword')">
              <el-input type="password" show-password />
            </el-form-item>
            <el-form-item :label="$t('settings.newPassword')">
              <el-input type="password" show-password />
            </el-form-item>
            <el-form-item :label="$t('settings.confirmPassword')">
              <el-input type="password" show-password />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="changePwd">{{ $t('common.save') }}</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <div style="margin-top:20px;text-align:right">
      <el-button type="primary" size="large" @click="saveSettings">{{ $t('common.save') }}</el-button>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '../../../stores/sales-user.js'
import { ROLE_LABELS } from '../../../utils/sales-constants.js'
import { ElMessage } from 'element-plus'

const { t, locale } = useI18n()
const userStore = useUserStore()

const currencies = ['CNY', 'USD', 'JPY', 'KRW', 'TWD']

const settingsForm = reactive({
  language: locale.value,
  currency: 'CNY',
  dateFormat: 'YYYY-MM-DD',
  timezone: 'Asia/Shanghai',
  notifLowStock: true,
  notifExpiry: true,
  notifAR: true,
  notifLicense: true,
  companyName: '上海盛化贸易有限公司',
  companyAddress: '上海市浦东新区张江高科技园区',
  taxId: '91310115XXXXXXXXXX'
})

function switchLang(lang) {
  locale.value = lang
  localStorage.setItem('locale', lang)
}

function saveSettings() {
  ElMessage.success(t('common.operationSuccess'))
}

function changePwd() {
  ElMessage.success(t('settings.passwordChanged'))
}
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { font-size: 20px; font-weight: 600; }
</style>
