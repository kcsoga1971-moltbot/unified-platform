<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">{{ $t('admin.userManagement') }}</h1>
      <el-button type="primary" @click="showInviteDialog = true">
        <el-icon><Plus /></el-icon>
        {{ $t('admin.inviteUser') }}
      </el-button>
    </div>

    <!-- Stats -->
    <div class="stats-row">
      <el-card class="stat-card">
        <div class="stat-value">{{ users.length }}</div>
        <div class="stat-label">{{ $t('admin.totalUsers') }}</div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-value">{{ activeCount }}</div>
        <div class="stat-label">{{ $t('admin.activeUsers') }}</div>
      </el-card>
    </div>

    <!-- User Table -->
    <el-card class="table-card">
      <el-table :data="users" stripe>
        <el-table-column prop="avatar" width="60">
          <template #default="{ row }">
            <div class="avatar-circle">{{ row.avatar }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="name" :label="$t('admin.name')" />
        <el-table-column prop="email" :label="$t('admin.email')" />
        <el-table-column prop="role" :label="$t('admin.role')">
          <template #default="{ row }">
            <el-tag :type="getRoleTagType(row.role)" size="small">
              {{ $t(`auth.roles.${row.role}`) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="department" :label="$t('admin.department')" />
        <el-table-column prop="location" :label="$t('admin.location')">
          <template #default="{ row }">
            {{ row.location === 'taiwan' ? '台湾' : '中国大陆' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="$t('admin.status')">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
              {{ row.status === 'active' ? $t('admin.active') : $t('admin.inactive') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.actions')" width="160">
          <template #default="{ row }">
            <el-button size="small" @click="editUser(row)">{{ $t('common.edit') }}</el-button>
            <el-button
              size="small"
              :type="row.status === 'active' ? 'danger' : 'success'"
              @click="toggleStatus(row)"
            >
              {{ row.status === 'active' ? $t('admin.deactivate') : $t('admin.activate') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Edit User Dialog -->
    <el-dialog v-model="showEditDialog" :title="$t('admin.editUser')" width="480px">
      <el-form v-if="editingUser" :model="editingUser" label-position="top">
        <el-form-item :label="$t('admin.name')">
          <el-input v-model="editingUser.name" />
        </el-form-item>
        <el-form-item :label="$t('admin.role')">
          <el-select v-model="editingUser.role" style="width: 100%">
            <el-option v-for="r in roleOptions" :key="r.value" :label="r.label" :value="r.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('admin.department')">
          <el-input v-model="editingUser.department" />
        </el-form-item>
        <el-form-item :label="$t('admin.location')">
          <el-select v-model="editingUser.location" style="width: 100%">
            <el-option label="台湾" value="taiwan" />
            <el-option label="中国大陆" value="china" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditDialog = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="saveEdit">{{ $t('common.save') }}</el-button>
      </template>
    </el-dialog>

    <!-- Invite Dialog -->
    <el-dialog v-model="showInviteDialog" :title="$t('admin.inviteUser')" width="480px">
      <el-form :model="inviteForm" label-position="top">
        <el-form-item :label="$t('admin.email')">
          <el-input v-model="inviteForm.email" type="email" />
        </el-form-item>
        <el-form-item :label="$t('admin.role')">
          <el-select v-model="inviteForm.role" style="width: 100%">
            <el-option v-for="r in roleOptions" :key="r.value" :label="r.label" :value="r.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showInviteDialog = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="sendInvite">{{ $t('common.submit') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '../../../stores/rdm-user.js'

const { t } = useI18n()
const userStore = useUserStore()

const showEditDialog = ref(false)
const showInviteDialog = ref(false)
const editingUser = ref(null)

const users = ref(userStore.getAllUsers())
const activeCount = computed(() => users.value.filter(u => u.status === 'active').length)

const inviteForm = ref({ email: '', role: 'rd' })

const roleOptions = [
  { value: 'boss', label: t('auth.roles.boss') },
  { value: 'manager', label: t('auth.roles.manager') },
  { value: 'rd', label: t('auth.roles.rd') },
  { value: 'mfg', label: t('auth.roles.mfg') },
  { value: 'qa', label: t('auth.roles.qa') },
  { value: 'admin', label: t('auth.roles.admin') },
]

function getRoleTagType(role) {
  const map = { boss: 'danger', manager: 'warning', admin: 'danger', rd: 'primary', mfg: 'success', qa: 'info' }
  return map[role] || ''
}

function editUser(user) {
  editingUser.value = { ...user }
  showEditDialog.value = true
}

function saveEdit() {
  const idx = users.value.findIndex(u => u.id === editingUser.value.id)
  if (idx !== -1) {
    users.value[idx] = { ...editingUser.value }
  }
  showEditDialog.value = false
  ElMessage.success(t('admin.updateSuccess'))
}

function toggleStatus(user) {
  user.status = user.status === 'active' ? 'inactive' : 'active'
}

function sendInvite() {
  showInviteDialog.value = false
  ElMessage.success(t('admin.inviteSuccess'))
  inviteForm.value = { email: '', role: 'rd' }
}
</script>

<style scoped>
.page-container {
  max-width: 1200px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.stats-row {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card {
  flex: 0 0 160px;
  text-align: center;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #1a73e8;
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
  margin-top: 4px;
}

.table-card {
  margin-top: 0;
}

.avatar-circle {
  width: 32px;
  height: 32px;
  background: #1a73e8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: 600;
}
</style>
