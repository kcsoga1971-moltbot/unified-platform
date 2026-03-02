<template>
  <div class="register-page">
    <div class="register-card">
      <h2 class="register-title">{{ $t('auth.registerTitle') }}</h2>
      <p class="register-subtitle">{{ $t('auth.registerSubtitle') }}</p>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
      >
        <el-form-item :label="$t('auth.fullName')" prop="name">
          <el-input
            v-model="form.name"
            :placeholder="$t('auth.namePlaceholder')"
            prefix-icon="User"
            size="large"
          />
        </el-form-item>

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

        <el-form-item :label="$t('auth.confirmPassword')" prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            :placeholder="$t('auth.passwordPlaceholder')"
            prefix-icon="Lock"
            show-password
            size="large"
          />
        </el-form-item>

        <div class="form-row">
          <el-form-item :label="$t('auth.role')" prop="role" style="flex: 1">
            <el-select v-model="form.role" size="large" style="width: 100%">
              <el-option value="pm" :label="$t('auth.roles.pm')" />
              <el-option value="engineer" :label="$t('auth.roles.engineer')" />
              <el-option value="quality" :label="$t('auth.roles.quality')" />
              <el-option value="manager" :label="$t('auth.roles.manager')" />
            </el-select>
          </el-form-item>

          <el-form-item :label="$t('auth.location')" prop="location" style="flex: 1">
            <el-select v-model="form.location" size="large" style="width: 100%">
              <el-option value="taiwan" :label="$t('auth.taiwan')" />
              <el-option value="china" :label="$t('auth.china')" />
            </el-select>
          </el-form-item>
        </div>

        <el-button
          type="primary"
          size="large"
          style="width: 100%; margin-top: 8px"
          :loading="loading"
          @click="handleRegister"
        >
          {{ $t('auth.register') }}
        </el-button>
      </el-form>

      <p class="login-link">
        {{ $t('auth.hasAccount') }}
        <router-link to="/auth/login">{{ $t('auth.loginNow') }}</router-link>
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

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'engineer',
  location: 'taiwan',
})

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== form.value.password) {
    callback(new Error(t('auth.passwordMismatch')))
  } else {
    callback()
  }
}

const rules = {
  name: [{ required: true, message: t('common.required'), trigger: 'blur' }],
  email: [
    { required: true, message: t('common.required'), trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' },
  ],
  password: [{ required: true, message: t('common.required'), trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: t('common.required'), trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' },
  ],
  role: [{ required: true, message: t('common.required'), trigger: 'change' }],
}

async function handleRegister() {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    loading.value = true
    await new Promise((r) => setTimeout(r, 600))
    const result = userStore.register({
      name: form.value.name,
      email: form.value.email,
      role: form.value.role,
      location: form.value.location,
      department: 'R&D',
    })
    if (result.success) {
      ElMessage.success(t('auth.registerSuccess'))
      router.push({ name: 'Dashboard' })
    }
  } catch (e) {
    // validation failed
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  width: 100%;
}

.register-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
}

.register-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
}

.register-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 32px;
}

.form-row {
  display: flex;
  gap: 16px;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #6b7280;
}

.login-link a {
  color: #1a73e8;
  text-decoration: none;
  font-weight: 500;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
