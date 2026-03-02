import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/rdm-helpers.js'
import { DEMO_USERS } from '../utils/rdm-demoData.js'

export const useUserStore = defineStore('rdm_user', () => {
  const currentUser = ref(loadFromLocalStorage('rdm_user', null))
  const isLoggedIn = computed(() => !!currentUser.value && currentUser.value.isLoggedIn)

  const userRole = computed(() => currentUser.value?.role || 'rd')

  // RBAC permission functions
  function canViewAllProjects() {
    return ['boss', 'manager', 'admin'].includes(userRole.value)
  }

  function canEditProject(projectId) {
    if (['manager', 'admin'].includes(userRole.value)) return true
    if (['rd', 'mfg', 'qa'].includes(userRole.value)) {
      return isMyProject(projectId)
    }
    return false
  }

  function canManageUsers() {
    return userRole.value === 'admin'
  }

  function canApproveGate() {
    return ['boss', 'manager', 'admin'].includes(userRole.value)
  }

  function canInputData(projectId) {
    if (['rd', 'mfg', 'qa'].includes(userRole.value)) {
      return isMyProject(projectId)
    }
    return ['manager', 'admin'].includes(userRole.value)
  }

  function isMyProject(projectId) {
    const projects = loadFromLocalStorage('rdm_projects', [])
    const project = projects.find(p => p.id === projectId)
    if (!project) return false
    const userId = currentUser.value?.id
    return project.team?.includes(userId) || project.pmId === userId
  }

  function canSeeTeamTasks() {
    return ['boss', 'manager', 'admin'].includes(userRole.value)
  }

  function canSeeGantt() {
    return ['manager', 'admin'].includes(userRole.value)
  }

  function login(email, password) {
    const demoUser = DEMO_USERS.find((u) => u.email === email)
    if (demoUser || (email === 'demo@rdm.com' && password === 'demo123')) {
      const user = demoUser || {
        id: 'u_demo',
        name: 'Demo User',
        email: email,
        role: 'rd',
        department: 'R&D',
        location: 'taiwan',
        avatar: 'DU',
        status: 'active',
      }
      const loggedInUser = { ...user, isLoggedIn: true }
      currentUser.value = loggedInUser
      saveToLocalStorage('rdm_user', loggedInUser)
      return { success: true, user: loggedInUser }
    }
    // In demo mode, allow any login
    const fallbackUser = {
      id: 'u_' + Date.now(),
      name: email.split('@')[0],
      email: email,
      role: 'rd',
      department: 'R&D',
      location: 'taiwan',
      avatar: email.slice(0, 2).toUpperCase(),
      isLoggedIn: true,
      status: 'active',
    }
    currentUser.value = fallbackUser
    saveToLocalStorage('rdm_user', fallbackUser)
    return { success: true, user: fallbackUser }
  }

  function loginAsRole(role) {
    const roleUserMap = {
      boss: 'zhao.mingkang@rdm.com',
      manager: 'lin.daming@rdm.com',
      rd: 'wang.zhiyuan@rdm.com',
      mfg: 'zhang.yating@rdm.com',
      qa: 'li.jianguo@rdm.com',
      admin: 'admin@rdm.com',
    }
    const email = roleUserMap[role] || 'wang.zhiyuan@rdm.com'
    return login(email, 'demo123')
  }

  function register(userData) {
    const newUser = {
      id: 'u_' + Date.now(),
      ...userData,
      avatar: userData.name ? userData.name.slice(0, 2).toUpperCase() : 'NU',
      isLoggedIn: true,
      status: 'active',
    }
    currentUser.value = newUser
    saveToLocalStorage('rdm_user', newUser)
    return { success: true, user: newUser }
  }

  function logout() {
    currentUser.value = null
    localStorage.removeItem('rdm_user')
  }

  function updateProfile(profileData) {
    if (currentUser.value) {
      currentUser.value = { ...currentUser.value, ...profileData }
      saveToLocalStorage('rdm_user', currentUser.value)
    }
  }

  function getAllUsers() {
    return DEMO_USERS
  }

  function updateUserRole(userId, role) {
    // In demo mode, just update the local list
    const users = getAllUsers()
    const user = users.find(u => u.id === userId)
    if (user) {
      user.role = role
      // If current user is being updated, update them too
      if (currentUser.value?.id === userId) {
        currentUser.value = { ...currentUser.value, role }
        saveToLocalStorage('rdm_user', currentUser.value)
      }
    }
    return { success: true }
  }

  return {
    currentUser,
    isLoggedIn,
    userRole,
    login,
    loginAsRole,
    register,
    logout,
    updateProfile,
    getAllUsers,
    updateUserRole,
    canViewAllProjects,
    canEditProject,
    canManageUsers,
    canApproveGate,
    canInputData,
    isMyProject,
    canSeeTeamTasks,
    canSeeGantt,
  }
})
