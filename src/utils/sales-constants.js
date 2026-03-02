export const ROLES = {
  BOSS: 'boss',
  SALES_MGR: 'salesMgr',
  SALES_REP: 'salesRep',
  PURCH_MGR: 'purchMgr',
  PURCHASER: 'purchaser',
  WAREHOUSE: 'warehouse',
  FINANCE: 'finance',
  COMPLIANCE: 'compliance',
  ADMIN: 'admin'
}

export const ROLE_LABELS = {
  boss: '总经理',
  salesMgr: '销售经理',
  salesRep: '销售员',
  purchMgr: '采购经理',
  purchaser: '采购员',
  warehouse: '仓库管理员',
  finance: '财务',
  compliance: '合规专员',
  admin: '系统管理员'
}

export const CURRENCIES = {
  CNY: { symbol: '¥', name: '人民币', flag: '🇨🇳' },
  USD: { symbol: '$', name: '美元', flag: '🇺🇸' },
  JPY: { symbol: '¥', name: '日元', flag: '🇯🇵' },
  KRW: { symbol: '₩', name: '韩元', flag: '🇰🇷' },
  TWD: { symbol: 'NT$', name: '新台币', flag: '🇹🇼' }
}

export const COUNTRIES = {
  CN: { name: '中国', flag: '🇨🇳', nameEn: 'China' },
  JP: { name: '日本', flag: '🇯🇵', nameEn: 'Japan' },
  KR: { name: '韩国', flag: '🇰🇷', nameEn: 'South Korea' },
  TW: { name: '台湾', flag: '🇹🇼', nameEn: 'Taiwan' },
  US: { name: '美国', flag: '🇺🇸', nameEn: 'United States' }
}

export const PURCHASE_STATUS = {
  DRAFT: 'draft',
  APPROVED: 'approved',
  ORDERED: 'ordered',
  SHIPPED: 'shipped',
  RECEIVED: 'received',
  CLOSED: 'closed'
}

export const SALES_STATUS = {
  QUOTATION: 'quotation',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  INVOICED: 'invoiced',
  PAID: 'paid'
}

export const SHIPMENT_STATUS = {
  BOOKED: 'booked',
  PICKED_UP: 'pickedUp',
  IN_TRANSIT: 'inTransit',
  CUSTOMS: 'customs',
  DELIVERED: 'delivered'
}

export const CUSTOMS_STATUS = {
  PENDING: 'pending',
  SUBMITTED: 'submitted',
  CLEARED: 'cleared',
  RELEASED: 'released'
}

export const GHS_HAZARDS = {
  explosive: { label: '爆炸物', icon: '💥', color: '#FF6B00' },
  flammable: { label: '易燃', icon: '🔥', color: '#FF4444' },
  oxidizer: { label: '氧化性', icon: '⭕', color: '#FF9900' },
  compressed: { label: '加压气体', icon: '🔵', color: '#4444FF' },
  corrosive: { label: '腐蚀性', icon: '⚗️', color: '#AA44AA' },
  toxic: { label: '有毒', icon: '☠️', color: '#000000' },
  harmful: { label: '有害', icon: '❗', color: '#FF6600' },
  environmental: { label: '环境危害', icon: '🌿', color: '#006600' },
  irritant: { label: '刺激性', icon: '❕', color: '#FF9900' }
}

export const DELIVERY_TERMS = ['EXW', 'FOB', 'CIF', 'DDP', 'DAP', 'FCA']

export const PAYMENT_TERMS = ['T/T 30天', 'T/T 60天', 'T/T 90天', 'L/C 30天', '货到付款', '预付款']

export const LICENSE_TYPES = [
  '危化品经营许可证',
  '进口许可证',
  '出口许可证',
  '环评批复',
  '安全生产许可证'
]

export const PRODUCT_CATEGORIES = [
  { value: 'hf', label: '氢氟酸类' },
  { value: 'etchant', label: '蚀刻液类' },
  { value: 'photoresist', label: '光刻胶类' },
  { value: 'other', label: '其他特化品' }
]

export const HAZARD_LEVELS = [
  { value: 1, label: '低危', color: '#67C23A' },
  { value: 2, label: '中危', color: '#E6A23C' },
  { value: 3, label: '高危', color: '#F56C6C' },
  { value: 4, label: '极危', color: '#8B0000' }
]

export const APPROVAL_THRESHOLD_USD = 50000
