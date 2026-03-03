import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const RDM_ROLES = ['boss', 'manager', 'rd', 'mfg', 'qa', 'admin']
const SALES_ROLES = ['boss', 'salesMgr', 'salesRep', 'purchMgr', 'purchaser', 'warehouse', 'finance', 'compliance', 'admin']
const CRN_ROLES = ['crn', 'patient', 'admin']

const DEFAULT_PLATFORM = {
  boss: 'rdm', manager: 'rdm', rd: 'rdm', mfg: 'rdm', qa: 'rdm',
  salesMgr: 'sales', salesRep: 'sales', purchMgr: 'sales',
  purchaser: 'sales', warehouse: 'sales', finance: 'sales', compliance: 'sales',
  crn: 'crn', patient: 'crn',
  admin: 'rdm',
}

const DEMO_USERS = [
  { id: 'u1', name: '赵明康', email: 'zhao.mingkang@company.com', role: 'boss' },
  { id: 'u2', name: '林大明', email: 'lin.daming@company.com', role: 'manager' },
  { id: 'u3', name: '王志远', email: 'wang.zhiyuan@company.com', role: 'rd' },
  { id: 'u4', name: '张雅婷', email: 'zhang.yating@company.com', role: 'mfg' },
  { id: 'u5', name: '李建国', email: 'li.jianguo@company.com', role: 'qa' },
  { id: 'u6', name: '陈销售', email: 'chen.xiaoshou@company.com', role: 'salesMgr' },
  { id: 'u7', name: '赵销售员', email: 'zhao.salesrep@company.com', role: 'salesRep' },
  { id: 'u8', name: '王采购', email: 'wang.caigou@company.com', role: 'purchMgr' },
  { id: 'u9', name: '刘仓库', email: 'liu.cangku@company.com', role: 'warehouse' },
  { id: 'u10', name: '张财务', email: 'zhang.caiwu@company.com', role: 'finance' },
  { id: 'u11', name: '陈合规', email: 'chen.hegui@company.com', role: 'compliance' },
  { id: 'u12', name: '系统管理员', email: 'admin@company.com', role: 'admin' },
  { id: 'u13', name: '陈护理师', email: 'chen.crn@hospital.com', role: 'crn' },
  { id: 'u14', name: '王病患', email: 'wang.patient@hospital.com', role: 'patient' },
]

export const useUserStore = defineStore('unified_user', () => {
  const currentUser = ref(null)
  const isAuthenticated = ref(false)
  const activePlatform = ref('rdm')

  const currentRole = computed(() => currentUser.value?.role || null)
  const isLoggedIn = computed(() => isAuthenticated.value)
  const canAccessRdm = computed(() => RDM_ROLES.includes(currentRole.value))
  const canAccessSales = computed(() => SALES_ROLES.includes(currentRole.value))
  const canAccessCrn = computed(() => CRN_ROLES.includes(currentRole.value))

  // RDM permission helpers (used by rdm views via rdm-user store)
  function canViewAllProjects() {
    return ['boss', 'manager', 'admin'].includes(currentRole.value)
  }
  function canSeeTeamTasks() {
    return ['boss', 'manager', 'admin'].includes(currentRole.value)
  }
  function canSeeGantt() {
    return ['manager', 'admin'].includes(currentRole.value)
  }

  // Sales permission helpers
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
      creditMgmt: ['boss', 'salesMgr', 'finance', 'admin'],
    }
    return accessMap[section]?.includes(role) || false
  }

  function login(email, password) {
    const user = DEMO_USERS.find((u) => u.email === email)
    if (user || password === 'demo123') {
      const loginUser = user || DEMO_USERS[2]
      currentUser.value = { ...loginUser, isLoggedIn: true }
      isAuthenticated.value = true
      activePlatform.value = DEFAULT_PLATFORM[loginUser.role] || 'rdm'
      _persist()
      return { success: true }
    }
    return { success: false }
  }

  function loginByRole(role) {
    const user = DEMO_USERS.find((u) => u.role === role) || DEMO_USERS[0]
    currentUser.value = { ...user, isLoggedIn: true }
    isAuthenticated.value = true
    activePlatform.value = DEFAULT_PLATFORM[role] || 'rdm'
    _persist()
    return { success: true }
  }

  function logout() {
    currentUser.value = null
    isAuthenticated.value = false
    localStorage.removeItem('unified_user')
    localStorage.removeItem('unified_platform')
    localStorage.removeItem('rdm_user')
    localStorage.removeItem('currentUser')
  }

  function switchPlatform(platform) {
    if (platform === 'rdm' && canAccessRdm.value) {
      activePlatform.value = 'rdm'
      localStorage.setItem('unified_platform', 'rdm')
    } else if (platform === 'sales' && canAccessSales.value) {
      activePlatform.value = 'sales'
      localStorage.setItem('unified_platform', 'sales')
    } else if (platform === 'crn' && canAccessCrn.value) {
      activePlatform.value = 'crn'
      localStorage.setItem('unified_platform', 'crn')
    }
  }

  function initFromStorage() {
    const stored = localStorage.getItem('unified_user')
    if (stored) {
      try {
        currentUser.value = JSON.parse(stored)
        isAuthenticated.value = true
        const storedPlatform = localStorage.getItem('unified_platform')
        activePlatform.value = storedPlatform || DEFAULT_PLATFORM[currentUser.value.role] || 'rdm'
        return
      } catch {
        localStorage.removeItem('unified_user')
      }
    }
    // Fallback: check rdm_user
    const rdmUser = localStorage.getItem('rdm_user')
    if (rdmUser) {
      try {
        const u = JSON.parse(rdmUser)
        if (u?.isLoggedIn) {
          currentUser.value = u
          isAuthenticated.value = true
          activePlatform.value = 'rdm'
        }
      } catch {}
    }
  }

  function _persist() {
    localStorage.setItem('unified_user', JSON.stringify(currentUser.value))
    localStorage.setItem('unified_platform', activePlatform.value)
    // Compatibility with rdm-user store
    if (RDM_ROLES.includes(currentRole.value)) {
      localStorage.setItem('rdm_user', JSON.stringify({ ...currentUser.value, isLoggedIn: true }))
    }
    // Compatibility with sales-user store
    localStorage.setItem('currentUser', JSON.stringify(currentUser.value))
  }

  return {
    currentUser, isAuthenticated, isLoggedIn, currentRole,
    activePlatform, canAccessRdm, canAccessSales, canAccessCrn,
    canViewAllProjects, canSeeTeamTasks, canSeeGantt, canAccess,
    login, loginByRole, logout, switchPlatform, initFromStorage,
  }
})
