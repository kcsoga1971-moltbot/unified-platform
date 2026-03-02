import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { demoUsers } from '../utils/sales-demoData.js'

export const useUserStore = defineStore('sales_user', () => {
  const currentUser = ref(null)
  const isAuthenticated = ref(false)

  const currentRole = computed(() => currentUser.value?.role || null)

  function hasRole(roles) {
    if (!currentRole.value) return false
    if (typeof roles === 'string') return currentRole.value === roles
    return roles.includes(currentRole.value)
  }

  function canAccess(section) {
    const role = currentRole.value
    if (!role) return false
    const accessMap = {
      sales: ['boss', 'salesMgr', 'salesRep', 'admin'],
      procurement: ['boss', 'purchMgr', 'purchaser', 'admin'],
      inventory: ['boss', 'salesMgr', 'purchMgr', 'warehouse', 'admin'],
      logistics: ['boss', 'salesMgr', 'salesRep', 'purchMgr', 'purchaser', 'warehouse', 'compliance', 'admin'],
      compliance: ['boss', 'compliance', 'admin'],
      finance: ['boss', 'finance', 'admin'],
      reports: ['boss', 'salesMgr', 'purchMgr', 'finance', 'admin'],
      admin: ['admin'],
      creditMgmt: ['boss', 'salesMgr', 'finance', 'admin']
    }
    return accessMap[section]?.includes(role) || false
  }

  async function login(username, role) {
    const user = demoUsers.find(u => u.role === role) || demoUsers[0]
    currentUser.value = { ...user, role }
    isAuthenticated.value = true
    localStorage.setItem('currentUser', JSON.stringify(currentUser.value))
    return true
  }

  function logout() {
    currentUser.value = null
    isAuthenticated.value = false
    localStorage.removeItem('currentUser')
  }

  function initFromStorage() {
    const stored = localStorage.getItem('currentUser')
    if (stored) {
      try {
        currentUser.value = JSON.parse(stored)
        isAuthenticated.value = true
      } catch {
        localStorage.removeItem('currentUser')
      }
    }
  }

  return { currentUser, isAuthenticated, currentRole, hasRole, canAccess, login, logout, initFromStorage }
})
