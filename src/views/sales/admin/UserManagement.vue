<template>
  <div>
    <div class="page-header">
      <h2>{{ $t('nav.userMgmt') }}</h2>
      <el-button type="primary" :icon="'Plus'" @click="openAddUser">{{ $t('admin.addUser') }}</el-button>
    </div>

    <el-card>
      <el-table :data="demoUsers" stripe>
        <el-table-column :label="$t('common.name')" prop="name" width="100" />
        <el-table-column :label="$t('auth.username')" prop="username" width="120" />
        <el-table-column :label="$t('auth.email')" prop="email" min-width="200" />
        <el-table-column :label="$t('auth.role')" width="130">
          <template #default="{ row }">
            <el-tag size="small">{{ ROLE_LABELS[row.role] || row.role }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.status')" width="90">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'info'" size="small">
              {{ $t('common.statusValues.' + row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('admin.lastLogin')" width="150">
          <template #default="{ row }">{{ formatDateTime(row.lastLogin) }}</template>
        </el-table-column>
        <el-table-column :label="$t('common.actions')" width="160" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" size="small" @click="editUser(row)">{{ $t('common.edit') }}</el-button>
            <el-button text type="warning" size="small" @click="toggleStatus(row)">
              {{ row.status === 'active' ? $t('admin.disable') : $t('admin.enable') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Add/Edit dialog -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? $t('admin.editUser') : $t('admin.addUser')" width="480px">
      <el-form :model="userForm" label-width="80px">
        <el-form-item :label="$t('common.name')">
          <el-input v-model="userForm.name" />
        </el-form-item>
        <el-form-item :label="$t('auth.username')">
          <el-input v-model="userForm.username" />
        </el-form-item>
        <el-form-item :label="$t('auth.email')">
          <el-input v-model="userForm.email" />
        </el-form-item>
        <el-form-item :label="$t('auth.role')">
          <el-select v-model="userForm.role" style="width:100%">
            <el-option v-for="(label, key) in ROLE_LABELS" :key="key" :label="label" :value="key" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="saveUser">{{ $t('common.save') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { demoUsers } from '../../../utils/sales-demoData.js'
import { ROLE_LABELS } from '../../../utils/sales-constants.js'
import { formatDateTime } from '../../../utils/sales-helpers.js'
import { ElMessage } from 'element-plus'

const { t } = useI18n()

const dialogVisible = ref(false)
const isEdit = ref(false)
const userForm = reactive({ name: '', username: '', email: '', role: 'salesRep' })

function openAddUser() {
  isEdit.value = false
  Object.assign(userForm, { name: '', username: '', email: '', role: 'salesRep' })
  dialogVisible.value = true
}

function editUser(user) {
  isEdit.value = true
  Object.assign(userForm, user)
  dialogVisible.value = true
}

function toggleStatus(user) {
  user.status = user.status === 'active' ? 'inactive' : 'active'
  ElMessage.success(t('common.operationSuccess'))
}

function saveUser() {
  dialogVisible.value = false
  ElMessage.success(t('common.operationSuccess'))
}
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { font-size: 20px; font-weight: 600; }
</style>
