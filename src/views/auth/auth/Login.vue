<template>
  <div class="login-page">
    <div class="login-card">
      <h2 class="login-title">{{ $t('auth.loginTitle') }}</h2>
      <p class="login-subtitle">{{ $t('auth.loginSubtitle') }}</p>

      <!-- Demo Role Selector -->
      <div class="demo-role-section">
        <div class="demo-role-label">{{ $t('auth.selectDemoRole') }}</div>
        <div class="role-grid">
          <div
            v-for="role in demoRoles"
            :key="role.code"
            class="role-card"
            :class="{ active: selectedRole === role.code }"
            @click="selectRole(role)"
          >
            <span class="role-icon">{{ role.icon }}</span>
            <span class="role-name">{{ $t(`auth.roles.${role.code}`) }}</span>
          </div>
        </div>
        <p v-if="selectedRole" class="role-desc">
          {{ $t(`auth.roleDescriptions.${selectedRole}`) }}
        </p>
      </div>

      <el-divider />

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        @submit.prevent="handleLogin"
      >
        <el-form-item :label="$t('auth.email')" prop="email">
          <el-input
            v-model="form.email"
            type="email"
            :placeholder="$t('auth.emailPlaceholder')"
            prefix-icon="Message"
            size="large"
          />
        </el-form-item>

        <el-form-item :label="$t('auth.password')" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            :placeholder="$t('auth.passwordPlaceholder')"
            prefix-icon="Lock"
            show-password
            size="large"
          />
        </el-form-item>

        <el-button
          type="primary"
          size="large"
          style="width: 100%; margin-top: 8px"
          :loading="loading"
          @click="handleLogin"
        >
          {{ $t('auth.login') }}
        </el-button>
      </el-form>

      <p class="register-link">
        {{ $t('auth.noAccount') }}
        <router-link to="/auth/register">{{ $t('auth.registerNow') }}</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '../../../stores/user.js'

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)
const formRef = ref(null)
const selectedRole = ref('rd')

const demoRoles = [
  { code: 'boss', icon: '👔', email: 'zhao.mingkang@company.com' },
  { code: 'manager', icon: '📋', email: 'lin.daming@company.com' },
  { code: 'rd', icon: '🔬', email: 'wang.zhiyuan@company.com' },
  { code: 'mfg', icon: '🏭', email: 'zhang.yating@company.com' },
  { code: 'qa', icon: '✅', email: 'li.jianguo@company.com' },
  { code: 'salesMgr', icon: '💼', email: 'chen.xiaoshou@company.com' },
  { code: 'purchMgr', icon: '🛒', email: 'wang.caigou@company.com' },
  { code: 'warehouse', icon: '📦', email: 'liu.cangku@company.com' },
  { code: 'finance', icon: '💰', email: 'zhang.caiwu@company.com' },
  { code: 'admin', icon: '⚙️', email: 'admin@company.com' },
]

const form = ref({
  email: 'wang.zhiyuan@company.com',
  password: 'demo123',
})

const rules = {
  email: [
    { required: true, message: t('common.required'), trigger: 'blur' },
    { type: 'email', message: t('validation.email'), trigger: 'blur' },
  ],
  password: [{ required: true, message: t('common.required'), trigger: 'blur' }],
}

function selectRole(role) {
  selectedRole.value = role.code
  form.value.email = role.email
  form.value.password = 'demo123'
}

async function handleLogin() {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    loading.value = true
    await new Promise((r) => setTimeout(r, 400))
    const result = userStore.login(form.value.email, form.value.password)
    if (result.success) {
      ElMessage.success(t('auth.loginSuccess'))
      const platform = userStore.activePlatform
      router.push({ name: platform === 'sales' ? 'SalesDashboard' : 'RdmDashboard' })
    } else {
      ElMessage.error(t('auth.loginFailed'))
    }
  } catch (e) {
    // form validation failed
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  width: 100%;
}

.login-card {
  background: white;
  border-radius: 16px;
  padding: 36px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
}

.login-title {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 4px;
}

.login-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 20px;
}

.demo-role-section {
  margin-bottom: 4px;
}

.demo-role-label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 10px;
}

.role-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.role-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 6px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: #f9fafb;
}

.role-card:hover {
  border-color: #1a73e8;
  background: #eff6ff;
}

.role-card.active {
  border-color: #1a73e8;
  background: #eff6ff;
  box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.2);
}

.role-icon {
  font-size: 18px;
}

.role-name {
  font-size: 11px;
  color: #374151;
  font-weight: 500;
  text-align: center;
}

.role-desc {
  font-size: 12px;
  color: #6b7280;
  background: #f0f9ff;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #bae6fd;
  margin-top: 8px;
}

.register-link {
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
  color: #6b7280;
}

.register-link a {
  color: #1a73e8;
  text-decoration: none;
  font-weight: 500;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>
