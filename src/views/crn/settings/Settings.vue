<template>
  <div class="crn-settings">
    <div class="page-header">
      <h1 class="page-title">{{ $t('nav.settings') }}</h1>
    </div>

    <el-card>
      <el-tabs>
        <el-tab-pane label="個人資料">
          <el-form label-width="100px" style="max-width: 500px">
            <el-form-item label="姓名">
              <el-input :model-value="currentUser?.name" disabled />
            </el-form-item>
            <el-form-item label="角色">
              <el-input :model-value="currentUser?.role === 'crn' ? '護理師' : '病患'" disabled />
            </el-form-item>
            <el-form-item label="Email">
              <el-input :model-value="currentUser?.email" disabled />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="通知設定">
          <el-form label-width="160px" style="max-width: 500px">
            <el-form-item label="任務到期提醒">
              <el-switch v-model="notifSettings.taskDue" />
            </el-form-item>
            <el-form-item label="生命徵象異常提醒">
              <el-switch v-model="notifSettings.vitalAlert" />
            </el-form-item>
            <el-form-item label="衛教完成通知">
              <el-switch v-model="notifSettings.educationComplete" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '../../../stores/user.js'

const userStore = useUserStore()
const currentUser = computed(() => userStore.currentUser)

const notifSettings = ref({
  taskDue: true,
  vitalAlert: true,
  educationComplete: true,
})
</script>

<style scoped>
.page-header { margin-bottom: 20px; }
.page-title { font-size: 22px; font-weight: 700; color: #1a1a2e; margin: 0; }
</style>
