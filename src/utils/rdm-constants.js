export const STAGES = [
  { id: 0, key: 'discovery', nameZh: '立项评审', nameEn: 'Discovery' },
  { id: 1, key: 'concept', nameZh: '概念开发', nameEn: 'Concept Development' },
  { id: 2, key: 'dvt', nameZh: '设计验证 DVT', nameEn: 'Design Validation (DVT)' },
  { id: 3, key: 'pvt', nameZh: '试产验证 PVT', nameEn: 'Pilot Run (PVT)' },
  { id: 4, key: 'mpLaunch', nameZh: '量产导入', nameEn: 'Mass Production Launch' },
  { id: 5, key: 'mpMonitor', nameZh: '量产监控', nameEn: 'Production Monitoring' },
]

export const STAGE_DELIVERABLES = {
  0: [
    { id: 'd0-1', nameZh: '市场需求文档', nameEn: 'Market Requirements Document' },
    { id: 'd0-2', nameZh: '技术可行性报告', nameEn: 'Technical Feasibility Report' },
    { id: 'd0-3', nameZh: '竞品分析', nameEn: 'Competitive Analysis' },
    { id: 'd0-4', nameZh: '项目立项申请书', nameEn: 'Project Charter' },
  ],
  1: [
    { id: 'd1-1', nameZh: '产品规格书', nameEn: 'Product Specification' },
    { id: 'd1-2', nameZh: '初步设计方案', nameEn: 'Preliminary Design' },
    { id: 'd1-3', nameZh: '材料选型报告', nameEn: 'Material Selection Report' },
    { id: 'd1-4', nameZh: '成本初估', nameEn: 'Cost Estimate' },
    { id: 'd1-5', nameZh: '专利检索报告', nameEn: 'Patent Search Report' },
    { id: 'd1-6', nameZh: '风险评估-FMEA初版', nameEn: 'Risk Assessment - FMEA Draft' },
  ],
  2: [
    { id: 'd2-1', nameZh: '详细设计&图纸', nameEn: 'Detailed Design & Drawings' },
    { id: 'd2-2', nameZh: '原型样品', nameEn: 'Prototype Samples' },
    { id: 'd2-3', nameZh: 'DVT测试报告', nameEn: 'DVT Test Report' },
    { id: 'd2-4', nameZh: '可靠性测试报告', nameEn: 'Reliability Test Report' },
    { id: 'd2-5', nameZh: '设计变更通知 ECN', nameEn: 'Design Change Notice - ECN' },
    { id: 'd2-6', nameZh: 'FMEA更新', nameEn: 'FMEA Update' },
  ],
  3: [
    { id: 'd3-1', nameZh: '制程参数确认', nameEn: 'Process Parameter Confirmation' },
    { id: 'd3-2', nameZh: 'PVT测试报告', nameEn: 'PVT Test Report' },
    { id: 'd3-3', nameZh: '良率分析报告', nameEn: 'Yield Analysis Report' },
    { id: 'd3-4', nameZh: 'SPC统计过程控制数据', nameEn: 'SPC Data' },
    { id: 'd3-5', nameZh: '检验标准-SIP', nameEn: 'Inspection Standard - SIP' },
    { id: 'd3-6', nameZh: '作业指导书-SOP', nameEn: 'SOP Documents' },
    { id: 'd3-7', nameZh: '培训记录', nameEn: 'Training Records' },
  ],
  4: [
    { id: 'd4-1', nameZh: '量产准备检查表', nameEn: 'MP Readiness Checklist' },
    { id: 'd4-2', nameZh: '首件检验报告', nameEn: 'First Article Inspection' },
    { id: 'd4-3', nameZh: 'Cpk制程能力分析', nameEn: 'Cpk Process Capability' },
    { id: 'd4-4', nameZh: '客户承认书', nameEn: 'Customer Approval' },
    { id: 'd4-5', nameZh: '量产移转报告', nameEn: 'Production Transfer Report' },
  ],
  5: [
    { id: 'd5-1', nameZh: '生产日报', nameEn: 'Daily Production Report' },
    { id: 'd5-2', nameZh: '周质量报告', nameEn: 'Weekly Quality Report' },
    { id: 'd5-3', nameZh: '客户投诉-8D报告', nameEn: 'Customer Complaint - 8D' },
    { id: 'd5-4', nameZh: 'CAPA纠正预防措施', nameEn: 'CAPA Records' },
    { id: 'd5-5', nameZh: '持续改善记录', nameEn: 'Continuous Improvement Log' },
  ],
}

export const PRODUCT_LINES = ['TGV', 'Anti-glare', 'Other']

export const PROJECT_STATUS = {
  ON_TRACK: 'on_track',
  AT_RISK: 'at_risk',
  OFF_TRACK: 'off_track',
}

export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  REVIEW: 'review',
  DONE: 'done',
}

export const PRIORITIES = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
}

export const ROLES = {
  PM: 'pm',
  ENGINEER: 'engineer',
  QUALITY: 'quality',
  MANAGER: 'manager',
}

export const LOCATIONS = {
  TAIWAN: 'taiwan',
  CHINA: 'china',
}

export const AI_TASK_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
}

export const DOCUMENT_TYPES = [
  'Technical Report',
  'Test Report',
  'Design Document',
  'Quality Document',
  'Meeting Minutes',
  'Customer Document',
  'Other',
]
