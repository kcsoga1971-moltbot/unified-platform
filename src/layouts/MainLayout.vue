<template>
  <div class="main-layout">
    <!-- Sidebar -->
    <aside class="sidebar" :class="[{ collapsed: sidebarCollapsed }, `sidebar--${currentPlatform}`]">
      <!-- Logo + Platform Switcher -->
      <div class="sidebar-header">
        <div class="logo-icon">{{ platformIcon }}</div>
        <span v-if="!sidebarCollapsed" class="logo-text">
          {{ platformLabel }}
        </span>
      </div>

      <!-- Platform switch buttons -->
      <div v-if="!sidebarCollapsed && canSwitchPlatform" class="platform-switch">
        <button
          v-if="userStore.canAccessRdm"
          class="switch-btn"
          :class="{ active: currentPlatform === 'rdm' }"
          @click="goToPlatform('rdm')"
        >RDM</button>
        <button
          v-if="userStore.canAccessSales"
          class="switch-btn"
          :class="{ active: currentPlatform === 'sales' }"
          @click="goToPlatform('sales')"
        >OPS</button>
        <button
          v-if="userStore.canAccessCrn"
          class="switch-btn"
          :class="{ active: currentPlatform === 'crn' || currentPlatform === 'patient' }"
          @click="goToPlatform('crn')"
        >CRN</button>
      </div>

      <!-- User role badge -->
      <div v-if="!sidebarCollapsed" class="role-badge-wrap">
        <el-tag :type="roleBadgeType" size="small">{{ roleLabel }}</el-tag>
        <span class="user-name-small">{{ currentUser?.name }}</span>
      </div>

      <el-menu
        :default-active="activeMenu"
        :collapse="sidebarCollapsed"
        :collapse-transition="false"
        :background-color="sidebarBgColor"
        text-color="#94a3b8"
        active-text-color="#ffffff"
        class="sidebar-menu"
        router
      >
        <!-- ===== RDM MENU ===== -->
        <template v-if="currentPlatform === 'rdm'">
          <el-menu-item index="/rdm/dashboard">
            <el-icon><DataAnalysis /></el-icon>
            <template #title>{{ $t('nav.dashboard') }}</template>
          </el-menu-item>

          <el-menu-item index="/rdm/projects">
            <el-icon><FolderOpened /></el-icon>
            <template #title>{{ canViewAll ? $t('nav.allProjects') : $t('nav.myProjects') }}</template>
          </el-menu-item>

          <el-menu-item index="/rdm/tasks/my">
            <el-icon><Finished /></el-icon>
            <template #title>{{ $t('nav.myTasks') }}</template>
          </el-menu-item>

          <el-menu-item v-if="canSeeTeam" index="/rdm/tasks/team">
            <el-icon><User /></el-icon>
            <template #title>{{ $t('nav.teamTasks') }}</template>
          </el-menu-item>

          <el-menu-item v-if="canSeeGanttMenu" index="/rdm/gantt">
            <el-icon><Calendar /></el-icon>
            <template #title>{{ $t('nav.gantt') }}</template>
          </el-menu-item>

          <el-menu-item index="/rdm/test-data">
            <el-icon><DataLine /></el-icon>
            <template #title>{{ $t('nav.testData') }}</template>
          </el-menu-item>

          <el-menu-item index="/rdm/risks">
            <el-icon><Warning /></el-icon>
            <template #title>{{ $t('nav.riskMatrix') }}</template>
          </el-menu-item>

          <el-menu-item index="/rdm/ecn">
            <el-icon><RefreshRight /></el-icon>
            <template #title>{{ $t('nav.ecn') }}</template>
          </el-menu-item>

          <el-menu-item index="/rdm/documents">
            <el-icon><Document /></el-icon>
            <template #title>{{ $t('nav.documents') }}</template>
          </el-menu-item>

          <el-menu-item index="/rdm/reports/daily">
            <el-icon><EditPen /></el-icon>
            <template #title>{{ $t('nav.dailySummary') }}</template>
          </el-menu-item>

          <el-menu-item index="/rdm/reports/weekly">
            <el-icon><Memo /></el-icon>
            <template #title>{{ $t('nav.weeklySummary') }}</template>
          </el-menu-item>

          <el-menu-item index="/rdm/reports/monthly">
            <el-icon><PieChart /></el-icon>
            <template #title>{{ $t('nav.monthlySummary') }}</template>
          </el-menu-item>

          <el-menu-item v-if="canSeeTeam" index="/rdm/reports/inbox">
            <el-icon><Message /></el-icon>
            <template #title>{{ $t('nav.summaryInbox') }}</template>
          </el-menu-item>

          <el-menu-item index="/rdm/ai">
            <el-icon><MagicStick /></el-icon>
            <template #title>{{ $t('nav.aiAssistant') }}</template>
          </el-menu-item>

          <el-menu-item v-if="isAdmin" index="/rdm/admin/users">
            <el-icon><Avatar /></el-icon>
            <template #title>{{ $t('nav.userManagement') }}</template>
          </el-menu-item>

          <el-menu-item index="/rdm/settings">
            <el-icon><Setting /></el-icon>
            <template #title>{{ $t('nav.settings') }}</template>
          </el-menu-item>
        </template>

        <!-- ===== SALES MENU ===== -->
        <template v-if="currentPlatform === 'sales'">
          <el-menu-item index="/sales/dashboard">
            <el-icon><DataAnalysis /></el-icon>
            <template #title>{{ $t('nav.dashboard') }}</template>
          </el-menu-item>

          <el-menu-item v-if="isBoss" index="/sales/boss-dashboard">
            <el-icon><TrendCharts /></el-icon>
            <template #title>{{ $t('nav.bossDashboard') }}</template>
          </el-menu-item>

          <el-sub-menu v-if="canAccess('sales')" index="sales-sub">
            <template #title>
              <el-icon><Goods /></el-icon>
              <span>{{ $t('nav.sales') }}</span>
            </template>
            <el-menu-item index="/sales/quotations">{{ $t('nav.quotations') }}</el-menu-item>
            <el-menu-item index="/sales/orders">{{ $t('nav.salesOrders') }}</el-menu-item>
            <el-menu-item index="/sales/customers">{{ $t('nav.customers') }}</el-menu-item>
            <el-menu-item v-if="canAccess('creditMgmt')" index="/sales/credit-management">{{ $t('nav.creditMgmt') }}</el-menu-item>
          </el-sub-menu>

          <el-sub-menu v-if="canAccess('procurement')" index="procurement-sub">
            <template #title>
              <el-icon><ShoppingCart /></el-icon>
              <span>{{ $t('nav.procurement') }}</span>
            </template>
            <el-menu-item index="/sales/purchase">{{ $t('nav.purchaseOrders') }}</el-menu-item>
            <el-menu-item index="/sales/suppliers">{{ $t('nav.suppliers') }}</el-menu-item>
            <el-menu-item index="/sales/quote-comparison">{{ $t('nav.purchaseInquiry') }}</el-menu-item>
            <el-menu-item index="/sales/goods-receiving">{{ $t('nav.goodsReceiving') }}</el-menu-item>
          </el-sub-menu>

          <el-sub-menu v-if="canAccess('inventory')" index="inventory-sub">
            <template #title>
              <el-icon><Box /></el-icon>
              <span>{{ $t('nav.inventory') }}</span>
            </template>
            <el-menu-item index="/sales/inventory">{{ $t('nav.stockOverview') }}</el-menu-item>
            <el-menu-item index="/sales/stock-movement">{{ $t('nav.stockMovement') }}</el-menu-item>
            <el-menu-item index="/sales/expiry-management">{{ $t('nav.expiryMgmt') }}</el-menu-item>
          </el-sub-menu>

          <el-sub-menu v-if="canAccess('logistics')" index="logistics-sub">
            <template #title>
              <el-icon><Van /></el-icon>
              <span>{{ $t('nav.logistics') }}</span>
            </template>
            <el-menu-item index="/sales/shipments">{{ $t('nav.shipmentTracking') }}</el-menu-item>
            <el-menu-item index="/sales/customs">{{ $t('nav.customsDecl') }}</el-menu-item>
          </el-sub-menu>

          <el-menu-item index="/sales/products">
            <el-icon><Collection /></el-icon>
            <template #title>{{ $t('nav.productCatalog') }}</template>
          </el-menu-item>

          <el-sub-menu v-if="canAccess('compliance')" index="compliance-sub">
            <template #title>
              <el-icon><DocumentChecked /></el-icon>
              <span>{{ $t('nav.compliance') }}</span>
            </template>
            <el-menu-item index="/sales/msds-library">{{ $t('nav.msdsLibrary') }}</el-menu-item>
            <el-menu-item index="/sales/licenses">{{ $t('nav.licenseMgmt') }}</el-menu-item>
          </el-sub-menu>

          <el-sub-menu v-if="canAccess('finance')" index="finance-sub">
            <template #title>
              <el-icon><Money /></el-icon>
              <span>{{ $t('nav.finance') }}</span>
            </template>
            <el-menu-item index="/sales/accounts-receivable">{{ $t('nav.accountsReceivable') }}</el-menu-item>
            <el-menu-item index="/sales/accounts-payable">{{ $t('nav.accountsPayable') }}</el-menu-item>
            <el-menu-item index="/sales/profit-analysis">{{ $t('nav.profitAnalysis') }}</el-menu-item>
          </el-sub-menu>

          <el-sub-menu v-if="canAccess('reports')" index="reports-sub">
            <template #title>
              <el-icon><Histogram /></el-icon>
              <span>{{ $t('nav.reports') }}</span>
            </template>
            <el-menu-item index="/sales/reports/sales">{{ $t('nav.salesReport') }}</el-menu-item>
            <el-menu-item index="/sales/reports/procurement">{{ $t('nav.procurementReport') }}</el-menu-item>
            <el-menu-item index="/sales/reports/ai-insights">{{ $t('nav.aiInsights') }}</el-menu-item>
          </el-sub-menu>

          <el-menu-item v-if="isAdmin" index="/sales/admin/users">
            <el-icon><Avatar /></el-icon>
            <template #title>{{ $t('nav.userMgmt') }}</template>
          </el-menu-item>

          <el-menu-item index="/sales/settings">
            <el-icon><Setting /></el-icon>
            <template #title>{{ $t('nav.settings') }}</template>
          </el-menu-item>
        </template>

        <!-- ===== CRN MENU (護理師端) ===== -->
        <template v-if="currentPlatform === 'crn'">
          <el-menu-item index="/crn/dashboard">
            <el-icon><DataAnalysis /></el-icon>
            <template #title>{{ $t('nav.dashboard') }}</template>
          </el-menu-item>

          <el-menu-item index="/crn/patients">
            <el-icon><User /></el-icon>
            <template #title>{{ $t('nav.crnPatients') }}</template>
          </el-menu-item>

          <el-menu-item index="/crn/tasks/create">
            <el-icon><EditPen /></el-icon>
            <template #title>{{ $t('nav.crnCreateTask') }}</template>
          </el-menu-item>

          <el-menu-item index="/crn/assign-education">
            <el-icon><Reading /></el-icon>
            <template #title>{{ $t('nav.crnAssignEducation') }}</template>
          </el-menu-item>

          <el-menu-item index="/crn/calendar">
            <el-icon><Calendar /></el-icon>
            <template #title>{{ $t('nav.crnCalendar') }}</template>
          </el-menu-item>

          <el-menu-item index="/crn/notifications">
            <el-icon><Bell /></el-icon>
            <template #title>{{ $t('nav.crnNotifications') }}</template>
          </el-menu-item>

          <el-menu-item index="/crn/settings">
            <el-icon><Setting /></el-icon>
            <template #title>{{ $t('nav.settings') }}</template>
          </el-menu-item>
        </template>

        <!-- ===== PATIENT MENU (病患端) ===== -->
        <template v-if="currentPlatform === 'patient'">
          <el-menu-item index="/patient/dashboard">
            <el-icon><DataAnalysis /></el-icon>
            <template #title>{{ $t('nav.dashboard') }}</template>
          </el-menu-item>

          <el-menu-item index="/patient/history">
            <el-icon><Document /></el-icon>
            <template #title>{{ $t('nav.patientHistory') }}</template>
          </el-menu-item>

          <el-menu-item index="/patient/education">
            <el-icon><Reading /></el-icon>
            <template #title>{{ $t('nav.patientEducation') }}</template>
          </el-menu-item>

          <el-menu-item index="/patient/body-map">
            <el-icon><Location /></el-icon>
            <template #title>{{ $t('nav.patientBodyMap') }}</template>
          </el-menu-item>

          <el-menu-item index="/patient/vitals">
            <el-icon><TrendCharts /></el-icon>
            <template #title>{{ $t('nav.patientVitals') }}</template>
          </el-menu-item>
        </template>
      </el-menu>

      <div class="sidebar-collapse-btn" @click="toggleSidebar">
        <el-icon><component :is="sidebarCollapsed ? 'Expand' : 'Fold'" /></el-icon>
      </div>
    </aside>

    <!-- Main area -->
    <div class="main-area">
      <header class="header">
        <div class="header-left">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>{{ platformLabel }}</el-breadcrumb-item>
            <el-breadcrumb-item v-for="crumb in breadcrumbs" :key="crumb.label">{{ crumb.label }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <LanguageSwitcher />
          <el-dropdown @command="handleUserCommand" trigger="click">
            <div class="user-avatar">
              <div class="avatar-circle">{{ userInitials }}</div>
              <span class="user-display-name">{{ currentUser?.name || 'User' }}</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="settings">
                  <el-icon><Setting /></el-icon> {{ $t('header.profile') }}
                </el-dropdown-item>
                <el-dropdown-item command="logout" divided>
                  <el-icon><SwitchButton /></el-icon> {{ $t('header.logout') }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <main class="content">
        <router-view v-slot="{ Component }">
          <keep-alive :include="['RdmDashboard', 'SalesDashboard', 'CrnDashboard', 'PatientDashboard', 'ProjectList']">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '../stores/user.js'
import LanguageSwitcher from '../components/common/LanguageSwitcher.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const sidebarCollapsed = ref(false)

const currentUser = computed(() => userStore.currentUser)
const currentRole = computed(() => userStore.currentRole)
const isAdmin = computed(() => currentRole.value === 'admin')
const isBoss = computed(() => ['boss', 'admin'].includes(currentRole.value))
const canViewAll = computed(() => userStore.canViewAllProjects())
const canSeeTeam = computed(() => userStore.canSeeTeamTasks())
const canSeeGanttMenu = computed(() => userStore.canSeeGantt())
const canAccess = (section) => userStore.canAccess(section)

const currentPlatform = computed(() => {
  if (route.path.startsWith('/sales')) return 'sales'
  if (route.path.startsWith('/crn')) return 'crn'
  if (route.path.startsWith('/patient')) return 'patient'
  return 'rdm'
})

const platformIcon = computed(() => {
  const map = { rdm: 'RDM', sales: 'OPS', crn: 'CRN', patient: 'PAT' }
  return map[currentPlatform.value] || 'RDM'
})

const platformLabel = computed(() => {
  const map = {
    rdm: t('unified.rdCenter'),
    sales: t('unified.opsCenter'),
    crn: t('unified.crnCenter'),
    patient: t('unified.patientCenter'),
  }
  return map[currentPlatform.value] || t('unified.rdCenter')
})

const canSwitchPlatform = computed(() => {
  const accessible = [userStore.canAccessRdm, userStore.canAccessSales, userStore.canAccessCrn].filter(Boolean)
  return accessible.length > 1
})

const sidebarBgColor = computed(() => {
  const map = { rdm: '#1e293b', sales: '#1a237e', crn: '#1b5e20', patient: '#4e342e' }
  return map[currentPlatform.value] || '#1e293b'
})

const userInitials = computed(() => {
  const name = currentUser.value?.name || 'U'
  return name.slice(0, 2).toUpperCase()
})

const roleBadgeType = computed(() => {
  const map = {
    boss: 'danger', manager: 'warning', admin: 'danger',
    rd: 'primary', mfg: 'success', qa: 'info',
    salesMgr: 'warning', salesRep: 'primary', purchMgr: 'success',
    purchaser: 'info', warehouse: '', finance: 'info', compliance: '',
    crn: 'success', patient: 'info',
  }
  return map[currentRole.value] || 'primary'
})

const roleLabel = computed(() => {
  const map = {
    boss: 'Boss', manager: '主管', rd: '研发', mfg: '制造', qa: '品质', admin: 'Admin',
    salesMgr: '销售经理', salesRep: '销售员', purchMgr: '采购经理',
    purchaser: '采购员', warehouse: '仓库', finance: '财务', compliance: '合规',
    crn: '护理师', patient: '病患',
  }
  return map[currentRole.value] || currentRole.value
})

const activeMenu = computed(() => {
  const path = route.path
  // Normalize sub-paths for active highlight
  if (path.startsWith('/rdm/projects')) return '/rdm/projects'
  if (path.startsWith('/rdm/tasks/my')) return '/rdm/tasks/my'
  if (path.startsWith('/rdm/tasks/team')) return '/rdm/tasks/team'
  if (path.startsWith('/rdm/test-data')) return '/rdm/test-data'
  if (path.startsWith('/rdm/ecn')) return '/rdm/ecn'
  if (path.startsWith('/rdm/reports/daily')) return '/rdm/reports/daily'
  if (path.startsWith('/rdm/reports/weekly')) return '/rdm/reports/weekly'
  if (path.startsWith('/rdm/reports/monthly')) return '/rdm/reports/monthly'
  if (path.startsWith('/rdm/reports/inbox')) return '/rdm/reports/inbox'
  if (path.startsWith('/sales/purchase')) return '/sales/purchase'
  if (path.startsWith('/sales/suppliers')) return '/sales/suppliers'
  if (path.startsWith('/sales/customers')) return '/sales/customers'
  if (path.startsWith('/sales/products')) return '/sales/products'
  if (path.startsWith('/sales/orders')) return '/sales/orders'
  if (path.startsWith('/crn/patients')) return '/crn/patients'
  if (path.startsWith('/crn/tasks')) return '/crn/tasks/create'
  if (path.startsWith('/patient/education')) return '/patient/education'
  return path
})

const breadcrumbs = computed(() => {
  const path = route.path
  const crumbs = []
  if (path.includes('/dashboard')) crumbs.push({ label: t('nav.dashboard') })
  else if (path.includes('/projects/create')) { crumbs.push({ label: t('nav.projects') }); crumbs.push({ label: t('project.create') }) }
  else if (path.includes('/projects/')) { crumbs.push({ label: t('nav.projects') }); crumbs.push({ label: t('project.detail') }) }
  else if (path.includes('/projects')) crumbs.push({ label: t('nav.projects') })
  else if (path.includes('/tasks/my')) crumbs.push({ label: t('nav.myTasks') })
  else if (path.includes('/tasks/team')) crumbs.push({ label: t('nav.teamTasks') })
  else if (path.includes('/gantt')) crumbs.push({ label: t('nav.gantt') })
  else if (path.includes('/documents')) crumbs.push({ label: t('nav.documents') })
  else if (path.includes('/ai')) crumbs.push({ label: t('nav.aiAssistant') })
  else if (path.includes('/settings')) crumbs.push({ label: t('nav.settings') })
  else if (path.includes('/test-data')) crumbs.push({ label: t('nav.testData') })
  else if (path.includes('/risks')) crumbs.push({ label: t('nav.riskMatrix') })
  else if (path.includes('/ecn')) crumbs.push({ label: t('nav.ecn') })
  else if (path.includes('/reports')) crumbs.push({ label: t('nav.reports') })
  else if (path.includes('/products')) crumbs.push({ label: t('nav.productCatalog') })
  else if (path.includes('/suppliers')) crumbs.push({ label: t('nav.suppliers') })
  else if (path.includes('/customers')) crumbs.push({ label: t('nav.customers') })
  else if (path.includes('/purchase')) crumbs.push({ label: t('nav.purchaseOrders') })
  else if (path.includes('/orders')) crumbs.push({ label: t('nav.salesOrders') })
  else if (path.includes('/quotations')) crumbs.push({ label: t('nav.quotations') })
  else if (path.includes('/inventory')) crumbs.push({ label: t('nav.stockOverview') })
  else if (path.includes('/stock-movement')) crumbs.push({ label: t('nav.stockMovement') })
  else if (path.includes('/shipments')) crumbs.push({ label: t('nav.shipmentTracking') })
  else if (path.includes('/customs')) crumbs.push({ label: t('nav.customsDecl') })
  else if (path.includes('/msds-library')) crumbs.push({ label: t('nav.msdsLibrary') })
  else if (path.includes('/licenses')) crumbs.push({ label: t('nav.licenseMgmt') })
  else if (path.includes('/accounts-receivable')) crumbs.push({ label: t('nav.accountsReceivable') })
  else if (path.includes('/accounts-payable')) crumbs.push({ label: t('nav.accountsPayable') })
  else if (path.includes('/profit-analysis')) crumbs.push({ label: t('nav.profitAnalysis') })
  else if (path.includes('/admin/users')) crumbs.push({ label: t('nav.userManagement') })
  else if (path.includes('/crn/patients')) crumbs.push({ label: t('nav.crnPatients') })
  else if (path.includes('/crn/tasks')) crumbs.push({ label: t('nav.crnCreateTask') })
  else if (path.includes('/crn/assign-education')) crumbs.push({ label: t('nav.crnAssignEducation') })
  else if (path.includes('/crn/calendar')) crumbs.push({ label: t('nav.crnCalendar') })
  else if (path.includes('/crn/notifications')) crumbs.push({ label: t('nav.crnNotifications') })
  else if (path.includes('/patient/history')) crumbs.push({ label: t('nav.patientHistory') })
  else if (path.includes('/patient/education')) crumbs.push({ label: t('nav.patientEducation') })
  else if (path.includes('/patient/body-map')) crumbs.push({ label: t('nav.patientBodyMap') })
  else if (path.includes('/patient/vitals')) crumbs.push({ label: t('nav.patientVitals') })
  return crumbs
})

function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

function goToPlatform(platform) {
  userStore.switchPlatform(platform)
  const dashboardMap = {
    rdm: 'RdmDashboard',
    sales: 'SalesDashboard',
    crn: 'CrnDashboard',
    patient: 'PatientDashboard',
  }
  router.push({ name: dashboardMap[platform] || 'RdmDashboard' })
}

function handleUserCommand(command) {
  if (command === 'logout') {
    userStore.logout()
    router.push({ name: 'Login' })
  } else if (command === 'settings') {
    const settingsMap = { rdm: 'RdmSettings', sales: 'SalesSettings', crn: 'CrnSettings' }
    const name = settingsMap[currentPlatform.value] || 'RdmSettings'
    router.push({ name })
  }
}
</script>

<style scoped>
.main-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  width: 220px;
  background: #1e293b;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  flex-shrink: 0;
  position: relative;
  z-index: 100;
}

.sidebar--sales {
  background: #1a237e;
}

.sidebar--crn {
  background: #1b5e20;
}

.sidebar--patient {
  background: #4e342e;
}

.sidebar--crn .logo-icon {
  background: #2e7d32;
}

.sidebar--patient .logo-icon {
  background: #6d4c41;
}

.sidebar.collapsed {
  width: 64px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 12px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  overflow: hidden;
  white-space: nowrap;
}

.logo-icon {
  width: 32px;
  height: 32px;
  background: #1a73e8;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 800;
  color: white;
  flex-shrink: 0;
}

.sidebar--sales .logo-icon {
  background: #3949ab;
}

.logo-text {
  font-size: 13px;
  font-weight: 700;
  color: white;
  overflow: hidden;
  text-overflow: ellipsis;
}

.platform-switch {
  display: flex;
  gap: 4px;
  padding: 8px 12px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.switch-btn {
  flex: 1;
  padding: 4px 0;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 6px;
  background: transparent;
  color: #94a3b8;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.switch-btn.active {
  background: #1a73e8;
  border-color: #1a73e8;
  color: white;
}

.switch-btn:hover:not(.active) {
  background: rgba(255,255,255,0.1);
  color: white;
}

.role-badge-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  overflow: hidden;
  white-space: nowrap;
}

.user-name-small {
  font-size: 11px;
  color: #94a3b8;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-menu {
  flex: 1;
  border-right: none;
  overflow-y: auto;
  overflow-x: hidden;
}

.sidebar-menu :deep(.el-menu-item) {
  height: 42px;
  margin: 1px 8px;
  border-radius: 8px;
  font-size: 13px;
}

.sidebar-menu :deep(.el-menu-item.is-active) {
  background-color: #1a73e8 !important;
}

.sidebar-menu :deep(.el-menu-item:hover) {
  background-color: rgba(255,255,255,0.08) !important;
}

.sidebar-menu :deep(.el-sub-menu__title) {
  height: 42px;
  margin: 1px 8px;
  border-radius: 8px;
  font-size: 13px;
}

.sidebar-menu :deep(.el-sub-menu__title:hover) {
  background-color: rgba(255,255,255,0.08) !important;
}

.sidebar-collapse-btn {
  padding: 12px;
  color: #64748b;
  cursor: pointer;
  display: flex;
  justify-content: center;
  border-top: 1px solid rgba(255,255,255,0.1);
  transition: color 0.2s;
}

.sidebar-collapse-btn:hover {
  color: #94a3b8;
}

.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

.header {
  height: 56px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.header-left, .header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 8px;
  transition: background 0.2s;
}

.user-avatar:hover { background: #f1f5f9; }

.avatar-circle {
  width: 30px;
  height: 30px;
  background: #1a73e8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: 600;
}

.user-display-name {
  font-size: 13px;
  color: #374151;
  font-weight: 500;
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f0f2f5;
}

@media (max-width: 768px) {
  .sidebar { width: 64px; }
  .user-display-name { display: none; }
}
</style>
