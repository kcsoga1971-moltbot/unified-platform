import { createRouter, createWebHashHistory } from 'vue-router'
import { useUserStore } from '../stores/user.js'

const RDM_ROLES = ['boss', 'manager', 'rd', 'mfg', 'qa', 'admin']
const SALES_ROLES = ['boss', 'salesMgr', 'salesRep', 'purchMgr', 'purchaser', 'warehouse', 'finance', 'compliance', 'admin']
const CRN_ROLES = ['crn', 'patient', 'admin']

const routes = [
  {
    path: '/auth',
    component: () => import('../layouts/AuthLayout.vue'),
    children: [
      { path: 'login', name: 'Login', component: () => import('../views/auth/auth/Login.vue') },
      { path: 'register', name: 'Register', component: () => import('../views/auth/auth/Register.vue') },
    ],
  },
  // RDM Platform
  {
    path: '/rdm',
    component: () => import('../layouts/MainLayout.vue'),
    meta: { requiresAuth: true, platform: 'rdm' },
    children: [
      { path: '', redirect: '/rdm/dashboard' },
      { path: 'dashboard', name: 'RdmDashboard', component: () => import('../views/rdm/dashboard/Dashboard.vue') },
      { path: 'boss-dashboard', name: 'RdmBossDashboard', component: () => import('../views/rdm/dashboard/BossDashboard.vue') },
      { path: 'projects', name: 'ProjectList', component: () => import('../views/rdm/project/ProjectList.vue') },
      { path: 'projects/create', name: 'ProjectCreate', component: () => import('../views/rdm/project/ProjectCreate.vue') },
      { path: 'projects/:id', name: 'ProjectDetail', component: () => import('../views/rdm/project/ProjectDetail.vue'), props: true },
      { path: 'projects/:id/gate-review', name: 'GateReview', component: () => import('../views/rdm/project/GateReview.vue'), props: true },
      { path: 'tasks/my', name: 'MyTasks', component: () => import('../views/rdm/task/MyTasks.vue') },
      { path: 'tasks/team', name: 'TeamTasks', component: () => import('../views/rdm/task/TeamTasks.vue') },
      { path: 'gantt', name: 'GanttChart', component: () => import('../views/rdm/task/GanttChart.vue') },
      { path: 'documents', name: 'DocumentCenter', component: () => import('../views/rdm/document/DocumentCenter.vue') },
      { path: 'test-data', name: 'TestDataCenter', component: () => import('../views/rdm/test/TestDataCenter.vue') },
      { path: 'test-data/new', name: 'TestRecordForm', component: () => import('../views/rdm/test/TestRecordForm.vue') },
      { path: 'test-data/:id', name: 'TestReport', component: () => import('../views/rdm/test/TestReport.vue'), props: true },
      { path: 'risks', name: 'RiskMatrix', component: () => import('../views/rdm/project/RiskMatrix.vue') },
      { path: 'ecn', name: 'ECNList', component: () => import('../views/rdm/project/ECNList.vue') },
      { path: 'ecn/new', name: 'ECNCreate', component: () => import('../views/rdm/project/ECNDetail.vue') },
      { path: 'ecn/:id', name: 'ECNDetail', component: () => import('../views/rdm/project/ECNDetail.vue'), props: true },
      { path: 'reports/daily', name: 'DailySummary', component: () => import('../views/rdm/report/DailySummary.vue') },
      { path: 'reports/weekly', name: 'WeeklySummary', component: () => import('../views/rdm/report/WeeklySummary.vue') },
      { path: 'reports/monthly', name: 'MonthlySummary', component: () => import('../views/rdm/report/MonthlySummary.vue') },
      { path: 'reports/inbox', name: 'SummaryInbox', component: () => import('../views/rdm/report/SummaryInbox.vue') },
      { path: 'ai', name: 'AIAssistant', component: () => import('../views/rdm/ai/AIAssistant.vue') },
      { path: 'admin/users', name: 'RdmUserManagement', component: () => import('../views/rdm/admin/UserManagement.vue') },
      { path: 'settings', name: 'RdmSettings', component: () => import('../views/rdm/settings/Settings.vue') },
    ],
  },
  // Sales Platform
  {
    path: '/sales',
    component: () => import('../layouts/MainLayout.vue'),
    meta: { requiresAuth: true, platform: 'sales' },
    children: [
      { path: '', redirect: '/sales/dashboard' },
      { path: 'dashboard', name: 'SalesDashboard', component: () => import('../views/sales/dashboard/Dashboard.vue') },
      { path: 'boss-dashboard', name: 'SalesBossDashboard', component: () => import('../views/sales/dashboard/BossDashboard.vue') },
      { path: 'products', name: 'ProductCatalog', component: () => import('../views/sales/product/ProductCatalog.vue') },
      { path: 'products/:id', name: 'ProductDetail', component: () => import('../views/sales/product/ProductDetail.vue') },
      { path: 'suppliers', name: 'SupplierList', component: () => import('../views/sales/supplier/SupplierList.vue') },
      { path: 'suppliers/:id', name: 'SupplierDetail', component: () => import('../views/sales/supplier/SupplierDetail.vue') },
      { path: 'suppliers/:id/evaluate', name: 'SupplierEvaluation', component: () => import('../views/sales/supplier/SupplierEvaluation.vue') },
      { path: 'customers', name: 'CustomerList', component: () => import('../views/sales/customer/CustomerList.vue') },
      { path: 'customers/:id', name: 'CustomerDetail', component: () => import('../views/sales/customer/CustomerDetail.vue') },
      { path: 'credit-management', name: 'CreditManagement', component: () => import('../views/sales/customer/CreditManagement.vue') },
      { path: 'purchase', name: 'PurchaseList', component: () => import('../views/sales/purchase/PurchaseList.vue') },
      { path: 'purchase/create', name: 'PurchaseCreate', component: () => import('../views/sales/purchase/PurchaseCreate.vue') },
      { path: 'purchase/:id', name: 'PurchaseDetail', component: () => import('../views/sales/purchase/PurchaseDetail.vue') },
      { path: 'quote-comparison', name: 'QuoteComparison', component: () => import('../views/sales/purchase/QuoteComparison.vue') },
      { path: 'goods-receiving', name: 'GoodsReceiving', component: () => import('../views/sales/purchase/GoodsReceiving.vue') },
      { path: 'orders', name: 'SalesList', component: () => import('../views/sales/sales/SalesList.vue') },
      { path: 'orders/create', name: 'SalesCreate', component: () => import('../views/sales/sales/SalesCreate.vue') },
      { path: 'orders/:id', name: 'SalesDetail', component: () => import('../views/sales/sales/SalesDetail.vue') },
      { path: 'quotations', name: 'QuotationManagement', component: () => import('../views/sales/sales/QuotationManagement.vue') },
      { path: 'inventory', name: 'InventoryDashboard', component: () => import('../views/sales/inventory/InventoryDashboard.vue') },
      { path: 'stock-movement', name: 'StockMovement', component: () => import('../views/sales/inventory/StockMovement.vue') },
      { path: 'expiry-management', name: 'ExpiryManagement', component: () => import('../views/sales/inventory/ExpiryManagement.vue') },
      { path: 'shipments', name: 'ShipmentTracker', component: () => import('../views/sales/logistics/ShipmentTracker.vue') },
      { path: 'customs', name: 'CustomsDeclaration', component: () => import('../views/sales/logistics/CustomsDeclaration.vue') },
      { path: 'msds-library', name: 'MSDSLibrary', component: () => import('../views/sales/compliance/MSDSLibrary.vue') },
      { path: 'licenses', name: 'LicenseManagement', component: () => import('../views/sales/compliance/LicenseManagement.vue') },
      { path: 'accounts-receivable', name: 'AccountsReceivable', component: () => import('../views/sales/finance/AccountsReceivable.vue') },
      { path: 'accounts-payable', name: 'AccountsPayable', component: () => import('../views/sales/finance/AccountsPayable.vue') },
      { path: 'profit-analysis', name: 'ProfitAnalysis', component: () => import('../views/sales/finance/ProfitAnalysis.vue') },
      { path: 'reports/sales', name: 'SalesReport', component: () => import('../views/sales/report/SalesReport.vue') },
      { path: 'reports/procurement', name: 'ProcurementReport', component: () => import('../views/sales/report/ProcurementReport.vue') },
      { path: 'reports/ai-insights', name: 'AIInsights', component: () => import('../views/sales/report/AIInsights.vue') },
      { path: 'admin/users', name: 'SalesUserManagement', component: () => import('../views/sales/admin/UserManagement.vue') },
      { path: 'settings', name: 'SalesSettings', component: () => import('../views/sales/settings/Settings.vue') },
    ],
  },
  // CRN Platform (護理師端)
  {
    path: '/crn',
    component: () => import('../layouts/MainLayout.vue'),
    meta: { requiresAuth: true, platform: 'crn' },
    children: [
      { path: '', redirect: '/crn/dashboard' },
      { path: 'dashboard', name: 'CrnDashboard', component: () => import('../views/crn/dashboard/Dashboard.vue') },
      { path: 'patients', name: 'CrnPatientList', component: () => import('../views/crn/patient/PatientList.vue') },
      { path: 'patients/:id', name: 'CrnSubjectDetail', component: () => import('../views/crn/patient/SubjectDetail.vue'), props: true },
      { path: 'tasks/create', name: 'CrnCreateTask', component: () => import('../views/crn/task/CreateTask.vue') },
      { path: 'assign-education', name: 'CrnAssignEducation', component: () => import('../views/crn/education/AssignEducation.vue') },
      { path: 'calendar', name: 'CrnCalendar', component: () => import('../views/crn/schedule/Calendar.vue') },
      { path: 'notifications', name: 'CrnNotifications', component: () => import('../views/crn/notification/Notifications.vue') },
      { path: 'settings', name: 'CrnSettings', component: () => import('../views/crn/settings/Settings.vue') },
    ],
  },
  // Patient Platform (病患端)
  {
    path: '/patient',
    component: () => import('../layouts/MainLayout.vue'),
    meta: { requiresAuth: true, platform: 'patient' },
    children: [
      { path: '', redirect: '/patient/dashboard' },
      { path: 'dashboard', name: 'PatientDashboard', component: () => import('../views/crn/patient-portal/Dashboard.vue') },
      { path: 'history', name: 'PatientHealthHistory', component: () => import('../views/crn/patient-portal/HealthHistory.vue') },
      { path: 'education', name: 'PatientEducation', component: () => import('../views/crn/patient-portal/EducationList.vue') },
      { path: 'education/:id', name: 'PatientEducationDetail', component: () => import('../views/crn/patient-portal/EducationDetail.vue'), props: true },
      { path: 'body-map', name: 'PatientBodyMap', component: () => import('../views/crn/patient-portal/BodyMap.vue') },
      { path: 'vitals', name: 'PatientVitals', component: () => import('../views/crn/patient-portal/Vitals.vue') },
    ],
  },
  { path: '/', redirect: '/auth/login' },
  { path: '/:pathMatch(.*)*', redirect: '/auth/login' },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  userStore.initFromStorage()

  const isAuth = userStore.isAuthenticated
  const role = userStore.currentRole

  if (to.meta.requiresAuth && !isAuth) {
    next({ name: 'Login' })
    return
  }

  if ((to.name === 'Login' || to.name === 'Register') && isAuth) {
    const platform = userStore.activePlatform
    const dashboardMap = { sales: 'SalesDashboard', crn: 'CrnDashboard', patient: 'PatientDashboard' }
    next({ name: dashboardMap[platform] || 'RdmDashboard' })
    return
  }

  // Platform access check
  if (to.meta.platform === 'rdm' && isAuth && !RDM_ROLES.includes(role)) {
    next({ name: 'SalesDashboard' })
    return
  }
  if (to.meta.platform === 'sales' && isAuth && !SALES_ROLES.includes(role)) {
    next({ name: 'RdmDashboard' })
    return
  }
  if (to.meta.platform === 'crn' && isAuth && !CRN_ROLES.includes(role)) {
    next({ name: 'RdmDashboard' })
    return
  }
  if (to.meta.platform === 'patient' && isAuth && !['patient', 'admin'].includes(role)) {
    next({ name: 'CrnDashboard' })
    return
  }

  next()
})

export default router
