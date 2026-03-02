import dayjs from 'dayjs'

const now = dayjs()
const d = (offset) => now.add(offset, 'day').format('YYYY-MM-DD')
const dt = (offset) => now.add(offset, 'day').format('YYYY-MM-DD HH:mm:ss')

export const demoProducts = [
  {
    id: 'P001',
    nameCn: '超纯氢氟酸 49%',
    nameEn: 'Ultra-pure Hydrofluoric Acid 49%',
    casNumber: '7664-39-3',
    category: 'hf',
    hazardLevel: 4,
    ghsHazards: ['corrosive', 'toxic', 'harmful'],
    storageReq: { temperature: '2-25°C', humidity: '<60%', light: false, special: '耐氟容器，隔离存放' },
    unitPriceRange: { min: 8500, max: 12000, currency: 'CNY', unit: '吨' },
    stockUnit: 'kg',
    shelfLife: 24,
    status: 'active',
    supplierId: ['S002', 'S004'],
    msdsId: 'M001',
    description: '用于半导体晶圆蚀刻、清洗工艺',
    safetyStock: 500,
    currentStock: 1250
  },
  {
    id: 'P002',
    nameCn: '缓冲氧化物蚀刻液 BOE 6:1',
    nameEn: 'Buffered Oxide Etch BOE 6:1',
    casNumber: 'N/A (mixture)',
    category: 'etchant',
    hazardLevel: 3,
    ghsHazards: ['corrosive', 'harmful'],
    storageReq: { temperature: '5-30°C', humidity: '<70%', light: false, special: '防腐蚀包装' },
    unitPriceRange: { min: 15000, max: 22000, currency: 'CNY', unit: '吨' },
    stockUnit: 'L',
    shelfLife: 18,
    status: 'active',
    supplierId: ['S002', 'S005'],
    msdsId: 'M002',
    description: '用于SiO2蚀刻，含HF和NH4F缓冲体系',
    safetyStock: 200,
    currentStock: 850
  },
  {
    id: 'P003',
    nameCn: '铝蚀刻液',
    nameEn: 'Aluminum Etchant',
    casNumber: 'N/A (mixture)',
    category: 'etchant',
    hazardLevel: 2,
    ghsHazards: ['corrosive', 'irritant'],
    storageReq: { temperature: '5-35°C', humidity: '<80%', light: false, special: '避免与碱接触' },
    unitPriceRange: { min: 5000, max: 8000, currency: 'CNY', unit: '吨' },
    stockUnit: 'L',
    shelfLife: 12,
    status: 'active',
    supplierId: ['S001', 'S005'],
    msdsId: 'M003',
    description: '用于铝金属层图案化蚀刻',
    safetyStock: 300,
    currentStock: 1500
  },
  {
    id: 'P004',
    nameCn: '正性光刻胶 AZ1500',
    nameEn: 'Positive Photoresist AZ1500',
    casNumber: 'N/A (mixture)',
    category: 'photoresist',
    hazardLevel: 2,
    ghsHazards: ['flammable', 'harmful', 'irritant'],
    storageReq: { temperature: '-20~4°C', humidity: '<50%', light: true, special: '避光冷藏，黄色安全灯操作' },
    unitPriceRange: { min: 35000, max: 55000, currency: 'CNY', unit: '吨' },
    stockUnit: 'L',
    shelfLife: 12,
    status: 'active',
    supplierId: ['S001', 'S003'],
    msdsId: 'M004',
    description: 'g/i线正性光刻胶，适用于微米级图案化',
    safetyStock: 50,
    currentStock: 180
  },
  {
    id: 'P005',
    nameCn: '负性光刻胶 SU-8',
    nameEn: 'Negative Photoresist SU-8',
    casNumber: 'N/A (mixture)',
    category: 'photoresist',
    hazardLevel: 2,
    ghsHazards: ['flammable', 'irritant'],
    storageReq: { temperature: '-20~4°C', humidity: '<50%', light: true, special: '避光冷藏' },
    unitPriceRange: { min: 80000, max: 120000, currency: 'CNY', unit: '吨' },
    stockUnit: 'L',
    shelfLife: 6,
    status: 'active',
    supplierId: ['S003'],
    msdsId: 'M005',
    description: '厚膜负性光刻胶，适用于MEMS和封装工艺',
    safetyStock: 20,
    currentStock: 45
  },
  {
    id: 'P006',
    nameCn: '光刻胶去除剂 NMP',
    nameEn: 'Photoresist Stripper NMP',
    casNumber: '872-50-4',
    category: 'other',
    hazardLevel: 2,
    ghsHazards: ['harmful', 'irritant'],
    storageReq: { temperature: '5-30°C', humidity: '<75%', light: false, special: '通风储存' },
    unitPriceRange: { min: 12000, max: 18000, currency: 'CNY', unit: '吨' },
    stockUnit: 'L',
    shelfLife: 24,
    status: 'active',
    supplierId: ['S006'],
    msdsId: 'M006',
    description: 'N-甲基吡咯烷酮，高效光刻胶剥离剂',
    safetyStock: 200,
    currentStock: 120
  },
  {
    id: 'P007',
    nameCn: 'IPA 异丙醇 电子级',
    nameEn: 'IPA Electronic Grade',
    casNumber: '67-63-0',
    category: 'other',
    hazardLevel: 1,
    ghsHazards: ['flammable', 'irritant'],
    storageReq: { temperature: '10-25°C', humidity: '<80%', light: false, special: '远离火源' },
    unitPriceRange: { min: 8000, max: 12000, currency: 'CNY', unit: '吨' },
    stockUnit: 'L',
    shelfLife: 36,
    status: 'active',
    supplierId: ['S005'],
    msdsId: 'M007',
    description: '电子级异丙醇，用于晶圆清洗和干燥',
    safetyStock: 500,
    currentStock: 2200
  },
  {
    id: 'P008',
    nameCn: '双氧水 电子级 H₂O₂',
    nameEn: 'Hydrogen Peroxide Electronic Grade',
    casNumber: '7722-84-1',
    category: 'other',
    hazardLevel: 2,
    ghsHazards: ['oxidizer', 'corrosive', 'harmful'],
    storageReq: { temperature: '2-15°C', humidity: '<60%', light: false, special: '避免有机物污染，防爆储存' },
    unitPriceRange: { min: 6000, max: 10000, currency: 'CNY', unit: '吨' },
    stockUnit: 'kg',
    shelfLife: 12,
    status: 'active',
    supplierId: ['S004'],
    msdsId: 'M008',
    description: '31%/49%电子级双氧水，SC-1/SC-2清洗液组分',
    safetyStock: 300,
    currentStock: 95
  }
]

export const demoSuppliers = [
  {
    id: 'S001',
    name: 'Samsung SDI Chemical',
    nameCn: '三星SDI化学',
    country: 'KR',
    address: '京畿道水原市 SDI研发中心',
    contactPerson: 'Kim Ji-ho',
    phone: '+82-31-8099-xxxx',
    email: 'chem.sales@samsungsdi.com',
    products: ['P003', 'P004'],
    rating: 4.5,
    status: 'active',
    currency: 'KRW',
    paymentTerms: 'T/T 60天',
    deliveryTerms: 'CIF',
    leadTimeDays: 30,
    scores: { quality: 4.8, delivery: 4.5, price: 4.0, service: 4.5, compliance: 5.0 },
    totalPurchased: 2850000,
    notes: '主要光刻胶和蚀刻液供应商，品质稳定，交期准时'
  },
  {
    id: 'S002',
    name: 'Stella Chemifa',
    nameCn: 'Stella化工',
    country: 'JP',
    address: '大阪府岸和田市 Stella化学工业园',
    contactPerson: 'Yamamoto Kenji',
    phone: '+81-72-445-xxxx',
    email: 'export@stellachemifa.co.jp',
    products: ['P001', 'P002'],
    rating: 5.0,
    status: 'active',
    currency: 'JPY',
    paymentTerms: 'T/T 60天',
    deliveryTerms: 'CIF',
    leadTimeDays: 45,
    scores: { quality: 5.0, delivery: 4.8, price: 3.5, service: 5.0, compliance: 5.0 },
    totalPurchased: 4200000,
    notes: '全球顶级HF和BOE供应商，品质无可挑剔，价格较高'
  },
  {
    id: 'S003',
    name: 'Tokyo Ohka Kogyo (TOK)',
    nameCn: '东京应化',
    country: 'JP',
    address: '神奈川县川崎市 TOK技术研究所',
    contactPerson: 'Nakamura Hiroshi',
    phone: '+81-44-435-xxxx',
    email: 'overseas@tok.co.jp',
    products: ['P004', 'P005'],
    rating: 4.8,
    status: 'active',
    currency: 'JPY',
    paymentTerms: 'L/C 30天',
    deliveryTerms: 'CIF',
    leadTimeDays: 60,
    scores: { quality: 5.0, delivery: 4.5, price: 3.0, service: 4.8, compliance: 5.0 },
    totalPurchased: 1950000,
    notes: '高端光刻胶首选，交期较长，需提前备货'
  },
  {
    id: 'S004',
    name: 'Formosa Plastics Chemical',
    nameCn: '台塑石化',
    country: 'TW',
    address: '台湾云林县麦寮乡台塑工业园',
    contactPerson: '王志强',
    phone: '+886-5-693-xxxx',
    email: 'export@fpc.com.tw',
    products: ['P001', 'P008'],
    rating: 4.2,
    status: 'active',
    currency: 'TWD',
    paymentTerms: 'T/T 30天',
    deliveryTerms: 'FOB',
    leadTimeDays: 21,
    scores: { quality: 4.2, delivery: 4.5, price: 4.5, service: 4.0, compliance: 4.0 },
    totalPurchased: 1680000,
    notes: '台湾本地供应商，交期短，价格有竞争力'
  },
  {
    id: 'S005',
    name: 'Jianghua Microelectronics Materials',
    nameCn: '江化微',
    country: 'CN',
    address: '江苏省镇江市江化微电子材料园',
    contactPerson: '李明',
    phone: '+86-511-8576-xxxx',
    email: 'sales@jhmm.com.cn',
    products: ['P002', 'P003', 'P007'],
    rating: 3.8,
    status: 'active',
    currency: 'CNY',
    paymentTerms: 'T/T 30天',
    deliveryTerms: 'DDP',
    leadTimeDays: 14,
    scores: { quality: 3.8, delivery: 4.0, price: 5.0, service: 4.0, compliance: 3.5 },
    totalPurchased: 920000,
    notes: '国产替代供应商，价格优势明显，品质持续改进中'
  },
  {
    id: 'S006',
    name: 'Dongjin Semichem',
    nameCn: '东进世美肯',
    country: 'KR',
    address: '忠清南道天安市 Dongjin化工园',
    contactPerson: 'Park Sung-jin',
    phone: '+82-41-530-xxxx',
    email: 'global@dongjin.com',
    products: ['P004', 'P006'],
    rating: 4.0,
    status: 'active',
    currency: 'KRW',
    paymentTerms: 'T/T 60天',
    deliveryTerms: 'CIF',
    leadTimeDays: 35,
    scores: { quality: 4.0, delivery: 4.2, price: 4.3, service: 3.8, compliance: 4.5 },
    totalPurchased: 750000,
    notes: 'NMP类产品质量好，光刻胶新增备用供应商'
  }
]

export const demoCustomers = [
  {
    id: 'C001',
    name: 'TSMC',
    nameCn: '台积电',
    country: 'TW',
    industry: '半导体晶圆代工',
    creditLimit: 10000000,
    arBalance: 2850000,
    paymentTerms: 'Net 60',
    status: 'active',
    contactPerson: '张文华',
    phone: '+886-3-578-xxxx',
    email: 'procurement@tsmc.com',
    address: '台湾新竹县宝山乡 台积电12厂',
    salesRep: 'U004',
    grade: 'A',
    totalSales: 28500000,
    currency: 'USD'
  },
  {
    id: 'C002',
    name: 'UMC',
    nameCn: '联华电子',
    country: 'TW',
    industry: '半导体晶圆代工',
    creditLimit: 5000000,
    arBalance: 1200000,
    paymentTerms: 'Net 60',
    status: 'active',
    contactPerson: '陈志明',
    phone: '+886-3-578-xxxx',
    email: 'purchase@umc.com',
    address: '台湾新竹科学园区 联华电子',
    salesRep: 'U004',
    grade: 'A',
    totalSales: 12500000,
    currency: 'USD'
  },
  {
    id: 'C003',
    name: 'SMIC',
    nameCn: '中芯国际',
    country: 'CN',
    industry: '半导体晶圆代工',
    creditLimit: 8000000,
    arBalance: 3200000,
    paymentTerms: 'Net 90',
    status: 'active',
    contactPerson: '李建国',
    phone: '+86-21-3861-xxxx',
    email: 'supply@smics.com',
    address: '上海市浦东新区张江高科技园区 中芯国际',
    salesRep: 'U005',
    grade: 'A',
    totalSales: 22000000,
    currency: 'CNY'
  },
  {
    id: 'C004',
    name: 'Hua Hong Semiconductor',
    nameCn: '华虹半导体',
    country: 'CN',
    industry: '半导体晶圆代工',
    creditLimit: 4000000,
    arBalance: 980000,
    paymentTerms: 'Net 60',
    status: 'active',
    contactPerson: '王磊',
    phone: '+86-21-5855-xxxx',
    email: 'procurement@hhgrace.com',
    address: '上海市浦东新区金桥出口加工区 华虹',
    salesRep: 'U005',
    grade: 'B',
    totalSales: 8500000,
    currency: 'CNY'
  },
  {
    id: 'C005',
    name: 'AUO',
    nameCn: '友达光电',
    country: 'TW',
    industry: '显示面板',
    creditLimit: 3000000,
    arBalance: 450000,
    paymentTerms: 'Net 30',
    status: 'active',
    contactPerson: '黄建志',
    phone: '+886-3-500-xxxx',
    email: 'chem.buy@auo.com',
    address: '台湾新竹市 友达光电园区',
    salesRep: 'U004',
    grade: 'B',
    totalSales: 6200000,
    currency: 'TWD'
  },
  {
    id: 'C006',
    name: 'BOE Technology',
    nameCn: '京东方',
    country: 'CN',
    industry: '显示面板',
    creditLimit: 6000000,
    arBalance: 2100000,
    paymentTerms: 'Net 90',
    status: 'active',
    contactPerson: '刘洋',
    phone: '+86-10-6280-xxxx',
    email: 'chem@boe.com.cn',
    address: '北京市海淀区 BOE科技园',
    salesRep: 'U005',
    grade: 'A',
    totalSales: 18000000,
    currency: 'CNY'
  },
  {
    id: 'C007',
    name: 'ASE Group',
    nameCn: '日月光集团',
    country: 'TW',
    industry: '封装测试',
    creditLimit: 2000000,
    arBalance: 320000,
    paymentTerms: 'Net 30',
    status: 'active',
    contactPerson: '林志远',
    phone: '+886-7-361-xxxx',
    email: 'purchase@aseglobal.com',
    address: '台湾高雄市楠梓加工出口区 日月光',
    salesRep: 'U004',
    grade: 'B',
    totalSales: 4500000,
    currency: 'TWD'
  },
  {
    id: 'C008',
    name: 'Tianma Microelectronics',
    nameCn: '天马微电子',
    country: 'CN',
    industry: '显示面板',
    creditLimit: 3000000,
    arBalance: 680000,
    paymentTerms: 'Net 60',
    status: 'active',
    contactPerson: '张伟',
    phone: '+86-755-3378-xxxx',
    email: 'materials@tianma.cn',
    address: '深圳市南山区科技园 天马微电子',
    salesRep: 'U005',
    grade: 'B',
    totalSales: 5800000,
    currency: 'CNY'
  }
]

export const demoPurchaseOrders = [
  {
    id: 'PO001',
    poNumber: 'PO-2024-0301',
    supplierId: 'S002',
    items: [
      { productId: 'P001', productName: '超纯氢氟酸 49%', qty: 5000, unit: 'kg', unitPrice: 11.2, currency: 'USD', amount: 56000 },
      { productId: 'P002', productName: '缓冲氧化物蚀刻液 BOE 6:1', qty: 1000, unit: 'L', unitPrice: 18.5, currency: 'USD', amount: 18500 }
    ],
    totalAmount: 74500,
    currency: 'USD',
    status: 'received',
    deliveryTerms: 'CIF',
    paymentTerms: 'T/T 60天',
    shippingMethod: '海运',
    eta: d(-5),
    receivedDate: d(-3),
    createdAt: dt(-45),
    approvedAt: dt(-44),
    notes: '台积电Q1备货，加急处理',
    trackingNumber: 'YMLUW123456789',
    approvedBy: 'U001'
  },
  {
    id: 'PO002',
    poNumber: 'PO-2024-0302',
    supplierId: 'S003',
    items: [
      { productId: 'P004', productName: '正性光刻胶 AZ1500', qty: 200, unit: 'L', unitPrice: 42000, currency: 'JPY', amount: 8400000 },
      { productId: 'P005', productName: '负性光刻胶 SU-8', qty: 50, unit: 'L', unitPrice: 98000, currency: 'JPY', amount: 4900000 }
    ],
    totalAmount: 13300000,
    currency: 'JPY',
    status: 'shipped',
    deliveryTerms: 'CIF',
    paymentTerms: 'L/C 30天',
    shippingMethod: '空运',
    eta: d(8),
    createdAt: dt(-20),
    approvedAt: dt(-19),
    trackingNumber: 'ANA-KIX-PVG-88823',
    approvedBy: 'U001',
    notes: '光刻胶需避光运输，需特殊包装'
  },
  {
    id: 'PO003',
    poNumber: 'PO-2024-0303',
    supplierId: 'S005',
    items: [
      { productId: 'P007', productName: 'IPA 异丙醇 电子级', qty: 10000, unit: 'L', unitPrice: 9.5, currency: 'CNY', amount: 95000 },
      { productId: 'P003', productName: '铝蚀刻液', qty: 2000, unit: 'L', unitPrice: 6.2, currency: 'CNY', amount: 12400 }
    ],
    totalAmount: 107400,
    currency: 'CNY',
    status: 'approved',
    deliveryTerms: 'DDP',
    paymentTerms: 'T/T 30天',
    shippingMethod: '陆运',
    eta: d(7),
    createdAt: dt(-3),
    approvedAt: dt(-2),
    approvedBy: 'U001',
    notes: '常规补货'
  },
  {
    id: 'PO004',
    poNumber: 'PO-2024-0304',
    supplierId: 'S001',
    items: [
      { productId: 'P004', productName: '正性光刻胶 AZ1500', qty: 100, unit: 'L', unitPrice: 42000, currency: 'KRW', amount: 4200000 }
    ],
    totalAmount: 4200000,
    currency: 'KRW',
    status: 'draft',
    deliveryTerms: 'CIF',
    paymentTerms: 'T/T 60天',
    shippingMethod: '海运',
    eta: d(35),
    createdAt: dt(-1),
    notes: '备用光刻胶采购，待价格确认'
  },
  {
    id: 'PO005',
    poNumber: 'PO-2024-0305',
    supplierId: 'S004',
    items: [
      { productId: 'P008', productName: '双氧水 电子级 H₂O₂', qty: 2000, unit: 'kg', unitPrice: 85, currency: 'TWD', amount: 170000 }
    ],
    totalAmount: 170000,
    currency: 'TWD',
    status: 'ordered',
    deliveryTerms: 'FOB',
    paymentTerms: 'T/T 30天',
    shippingMethod: '海运',
    eta: d(15),
    createdAt: dt(-10),
    approvedAt: dt(-9),
    approvedBy: 'U003',
    trackingNumber: 'KMTC-KHH-PVG-55123'
  }
]

export const demoSalesOrders = [
  {
    id: 'SO001',
    soNumber: 'SO-2024-0401',
    customerId: 'C001',
    items: [
      { productId: 'P001', productName: '超纯氢氟酸 49%', qty: 2000, unit: 'kg', unitPrice: 1650, currency: 'CNY', amount: 3300000 },
      { productId: 'P002', productName: '缓冲氧化物蚀刻液 BOE 6:1', qty: 500, unit: 'L', unitPrice: 1650, currency: 'CNY', amount: 825000 }
    ],
    totalAmount: 4125000,
    currency: 'CNY',
    status: 'delivered',
    shipDate: d(-10),
    deliveryDate: d(-7),
    paymentStatus: 'unpaid',
    invoiceNumber: 'INV-2024-0401',
    createdAt: dt(-25),
    salesRep: 'U004',
    notes: 'TSMC月度常规订单'
  },
  {
    id: 'SO002',
    soNumber: 'SO-2024-0402',
    customerId: 'C003',
    items: [
      { productId: 'P004', productName: '正性光刻胶 AZ1500', qty: 80, unit: 'L', unitPrice: 3850, currency: 'CNY', amount: 308000 },
      { productId: 'P007', productName: 'IPA 异丙醇 电子级', qty: 2000, unit: 'L', unitPrice: 12.5, currency: 'CNY', amount: 25000 }
    ],
    totalAmount: 333000,
    currency: 'CNY',
    status: 'processing',
    shipDate: d(5),
    paymentStatus: 'unpaid',
    createdAt: dt(-8),
    salesRep: 'U005',
    notes: '中芯Q2首批订单'
  },
  {
    id: 'SO003',
    soNumber: 'SO-2024-0403',
    customerId: 'C006',
    items: [
      { productId: 'P003', productName: '铝蚀刻液', qty: 1000, unit: 'L', unitPrice: 7.2, currency: 'CNY', amount: 7200 },
      { productId: 'P008', productName: '双氧水 电子级 H₂O₂', qty: 500, unit: 'kg', unitPrice: 9.5, currency: 'CNY', amount: 4750 }
    ],
    totalAmount: 11950,
    currency: 'CNY',
    status: 'confirmed',
    shipDate: d(12),
    paymentStatus: 'unpaid',
    createdAt: dt(-3),
    salesRep: 'U005',
    notes: '京东方Q2计划订单确认'
  },
  {
    id: 'SO004',
    soNumber: 'SO-2024-0404',
    customerId: 'C002',
    items: [
      { productId: 'P005', productName: '负性光刻胶 SU-8', qty: 20, unit: 'L', unitPrice: 9200, currency: 'CNY', amount: 184000 }
    ],
    totalAmount: 184000,
    currency: 'CNY',
    status: 'quotation',
    validUntil: d(30),
    followUpStatus: 'contacted',
    createdAt: dt(-5),
    salesRep: 'U004',
    notes: 'UMC新产品评估用料'
  },
  {
    id: 'SO005',
    soNumber: 'SO-2024-0405',
    customerId: 'C001',
    items: [
      { productId: 'P001', productName: '超纯氢氟酸 49%', qty: 3000, unit: 'kg', unitPrice: 1620, currency: 'CNY', amount: 4860000 },
      { productId: 'P002', productName: '缓冲氧化物蚀刻液 BOE 6:1', qty: 800, unit: 'L', unitPrice: 1650, currency: 'CNY', amount: 1320000 }
    ],
    totalAmount: 6180000,
    currency: 'CNY',
    status: 'shipped',
    shipDate: d(-2),
    trackingNumber: 'SF1234567890',
    paymentStatus: 'unpaid',
    createdAt: dt(-15),
    salesRep: 'U004',
    notes: 'TSMC Q2大单，优先发货'
  },
  {
    id: 'SO006',
    soNumber: 'SO-2024-0406',
    customerId: 'C005',
    items: [
      { productId: 'P007', productName: 'IPA 异丙醇 电子级', qty: 5000, unit: 'L', unitPrice: 13, currency: 'TWD', amount: 65000 }
    ],
    totalAmount: 65000,
    currency: 'TWD',
    status: 'invoiced',
    shipDate: d(-20),
    deliveryDate: d(-18),
    paymentStatus: 'partial',
    invoiceNumber: 'INV-2024-0406',
    createdAt: dt(-30),
    salesRep: 'U004',
    notes: 'AUO月度IPA订单，已部分收款'
  }
]

export const demoInventory = [
  { id: 'INV001', productId: 'P001', lotNumber: 'HF-2024-031', mfgDate: '2024-03-01', expiryDate: d(580), quantity: 750, unit: 'kg', location: 'A区-耐酸仓-01' },
  { id: 'INV002', productId: 'P001', lotNumber: 'HF-2024-029', mfgDate: '2024-02-15', expiryDate: d(40), quantity: 500, unit: 'kg', location: 'A区-耐酸仓-02' },
  { id: 'INV003', productId: 'P002', lotNumber: 'BOE-2024-022', mfgDate: '2024-02-20', expiryDate: d(420), quantity: 850, unit: 'L', location: 'A区-耐酸仓-03' },
  { id: 'INV004', productId: 'P003', lotNumber: 'AE-2024-018', mfgDate: '2024-01-18', expiryDate: d(200), quantity: 1500, unit: 'L', location: 'B区-普通仓-05' },
  { id: 'INV005', productId: 'P004', lotNumber: 'PR-2024-012', mfgDate: '2024-01-12', expiryDate: d(25), quantity: 100, unit: 'L', location: 'C区-冷藏仓-02' },
  { id: 'INV006', productId: 'P004', lotNumber: 'PR-2024-028', mfgDate: '2024-02-28', expiryDate: d(335), quantity: 80, unit: 'L', location: 'C区-冷藏仓-03' },
  { id: 'INV007', productId: 'P005', lotNumber: 'SU8-2024-020', mfgDate: '2024-02-20', expiryDate: d(80), quantity: 45, unit: 'L', location: 'C区-冷藏仓-04' },
  { id: 'INV008', productId: 'P006', lotNumber: 'NMP-2024-015', mfgDate: '2024-01-15', expiryDate: d(620), quantity: 120, unit: 'L', location: 'B区-通风仓-08' },
  { id: 'INV009', productId: 'P007', lotNumber: 'IPA-2024-025', mfgDate: '2024-02-25', expiryDate: d(900), quantity: 2200, unit: 'L', location: 'B区-防爆仓-01' },
  { id: 'INV010', productId: 'P008', lotNumber: 'H2O2-2024-010', mfgDate: '2024-01-10', expiryDate: d(10), quantity: 95, unit: 'kg', location: 'D区-冷藏仓-01' }
]

export const demoStockMovements = [
  { id: 'SM001', date: dt(-30), productId: 'P001', productName: '超纯氢氟酸 49%', direction: 'in', qty: 5000, unit: 'kg', reference: 'PO-2024-0301', operator: '仓库员甲', lotNumber: 'HF-2024-031' },
  { id: 'SM002', date: dt(-25), productId: 'P001', productName: '超纯氢氟酸 49%', direction: 'out', qty: 2000, unit: 'kg', reference: 'SO-2024-0401', operator: '仓库员甲', lotNumber: 'HF-2024-029' },
  { id: 'SM003', date: dt(-20), productId: 'P007', productName: 'IPA 异丙醇 电子级', direction: 'in', qty: 5000, unit: 'L', reference: 'PO-2024-0303', operator: '仓库员乙', lotNumber: 'IPA-2024-025' },
  { id: 'SM004', date: dt(-18), productId: 'P007', productName: 'IPA 异丙醇 电子级', direction: 'out', qty: 5000, unit: 'L', reference: 'SO-2024-0406', operator: '仓库员乙', lotNumber: 'IPA-2024-025' },
  { id: 'SM005', date: dt(-15), productId: 'P001', productName: '超纯氢氟酸 49%', direction: 'out', qty: 3000, unit: 'kg', reference: 'SO-2024-0405', operator: '仓库员甲', lotNumber: 'HF-2024-031' },
  { id: 'SM006', date: dt(-10), productId: 'P004', productName: '正性光刻胶 AZ1500', direction: 'in', qty: 200, unit: 'L', reference: 'PO-2024-0302', operator: '仓库员丙', lotNumber: 'PR-2024-028' },
  { id: 'SM007', date: dt(-8), productId: 'P004', productName: '正性光刻胶 AZ1500', direction: 'out', qty: 80, unit: 'L', reference: 'SO-2024-0402', operator: '仓库员丙', lotNumber: 'PR-2024-012' },
  { id: 'SM008', date: dt(-5), productId: 'P008', productName: '双氧水 电子级 H₂O₂', direction: 'in', qty: 2000, unit: 'kg', reference: 'PO-2024-0305', operator: '仓库员甲', lotNumber: 'H2O2-2024-010' },
  { id: 'SM009', date: dt(-3), productId: 'P003', productName: '铝蚀刻液', direction: 'in', qty: 2000, unit: 'L', reference: 'PO-2024-0303', operator: '仓库员乙', lotNumber: 'AE-2024-018' },
  { id: 'SM010', date: dt(-1), productId: 'P008', productName: '双氧水 电子级 H₂O₂', direction: 'out', qty: 500, unit: 'kg', reference: 'SO-2024-0403', operator: '仓库员甲', lotNumber: 'H2O2-2024-010' }
]

export const demoShipments = [
  {
    id: 'SH001',
    trackingNumber: 'YMLUW123456789',
    origin: 'JP',
    destination: 'CN',
    carrier: '阳明海运',
    status: 'delivered',
    eta: d(-5),
    actualDelivery: d(-3),
    relatedPO: 'PO-2024-0301',
    goods: '超纯氢氟酸, BOE蚀刻液',
    weight: '6.5吨',
    container: '20GP'
  },
  {
    id: 'SH002',
    trackingNumber: 'ANA-KIX-PVG-88823',
    origin: 'JP',
    destination: 'CN',
    carrier: '全日空货运',
    status: 'inTransit',
    eta: d(8),
    relatedPO: 'PO-2024-0302',
    goods: '正性光刻胶, 负性光刻胶',
    weight: '250kg',
    container: '空运件'
  },
  {
    id: 'SH003',
    trackingNumber: 'KMTC-KHH-PVG-55123',
    origin: 'TW',
    destination: 'CN',
    carrier: '高丽海运',
    status: 'customs',
    eta: d(15),
    relatedPO: 'PO-2024-0305',
    goods: '双氧水电子级',
    weight: '2吨',
    container: '20GP'
  },
  {
    id: 'SH004',
    trackingNumber: 'SF1234567890',
    origin: 'CN',
    destination: 'CN',
    carrier: '顺丰速运',
    status: 'inTransit',
    eta: d(2),
    relatedSO: 'SO-2024-0405',
    goods: '超纯氢氟酸, BOE蚀刻液',
    weight: '3.8吨',
    container: '特种货运'
  }
]

export const demoCustomsDeclarations = [
  {
    id: 'CD001',
    declarationNumber: 'IMPORT-2024-03-0145',
    type: 'import',
    relatedPO: 'PO-2024-0301',
    hsCode: '2811.11',
    declaredValue: 74500,
    currency: 'USD',
    dutyRate: 0.05,
    dutyAmount: 3725,
    status: 'released',
    submittedAt: d(-7),
    clearedAt: d(-4),
    goods: '超纯氢氟酸, BOE蚀刻液',
    origin: 'JP',
    docs: { invoice: true, packingList: true, msds: true, importLicense: true }
  },
  {
    id: 'CD002',
    declarationNumber: 'IMPORT-2024-03-0187',
    type: 'import',
    relatedPO: 'PO-2024-0302',
    hsCode: '3707.10',
    declaredValue: 13300000,
    currency: 'JPY',
    dutyRate: 0.03,
    dutyAmount: 399000,
    status: 'pending',
    submittedAt: null,
    goods: '光刻胶',
    origin: 'JP',
    docs: { invoice: true, packingList: false, msds: true, importLicense: true }
  },
  {
    id: 'CD003',
    declarationNumber: 'EXPORT-2024-03-0062',
    type: 'export',
    relatedSO: 'SO-2024-0401',
    hsCode: '2811.11',
    declaredValue: 4125000,
    currency: 'CNY',
    dutyRate: 0,
    dutyAmount: 0,
    status: 'cleared',
    submittedAt: d(-12),
    clearedAt: d(-10),
    goods: '超纯氢氟酸, BOE蚀刻液',
    destination: 'TW',
    docs: { invoice: true, packingList: true, msds: true, importLicense: true }
  }
]

export const demoLicenses = [
  {
    id: 'L001',
    type: '危化品经营许可证',
    licenseNumber: '沪危经字(2022)第0123号',
    issuedBy: '上海市应急管理局',
    issueDate: '2022-03-15',
    expiryDate: d(380),
    status: 'valid',
    renewalStatus: null,
    documents: ['危化品经营许可证.pdf']
  },
  {
    id: 'L002',
    type: '进口许可证',
    licenseNumber: 'HF-IMP-2024-00234',
    issuedBy: '商务部',
    issueDate: '2024-01-01',
    expiryDate: d(25),
    status: 'expiring',
    renewalStatus: 'in_progress',
    documents: ['进口许可证2024.pdf']
  },
  {
    id: 'L003',
    type: '出口许可证',
    licenseNumber: 'CHEM-EXP-2023-11567',
    issuedBy: '商务部',
    issueDate: '2023-06-01',
    expiryDate: d(-15),
    status: 'expired',
    renewalStatus: 'submitted',
    documents: ['出口许可证2023.pdf']
  },
  {
    id: 'L004',
    type: '环评批复',
    licenseNumber: '沪环评(2021)123号',
    issuedBy: '上海市生态环境局',
    issueDate: '2021-09-20',
    expiryDate: d(580),
    status: 'valid',
    renewalStatus: null,
    documents: ['环评批复.pdf']
  },
  {
    id: 'L005',
    type: '安全生产许可证',
    licenseNumber: '沪(危化)安许证字[2022]000456',
    issuedBy: '上海市应急管理局',
    issueDate: '2022-01-15',
    expiryDate: d(55),
    status: 'expiring',
    renewalStatus: null,
    documents: ['安全生产许可证.pdf']
  }
]

export const demoMSDS = [
  { id: 'M001', productId: 'P001', productName: '超纯氢氟酸 49%', version: 'v3.2', issueDate: '2024-01-15', expiryDate: d(700), languages: ['zh-CN', 'en-US', 'ja-JP', 'ko-KR'], status: 'valid', fileSize: '2.3MB', uploadedBy: '合规专员' },
  { id: 'M002', productId: 'P002', productName: '缓冲氧化物蚀刻液 BOE 6:1', version: 'v2.1', issueDate: '2024-02-01', expiryDate: d(720), languages: ['zh-CN', 'en-US', 'ja-JP'], status: 'valid', fileSize: '1.8MB', uploadedBy: '合规专员' },
  { id: 'M003', productId: 'P003', productName: '铝蚀刻液', version: 'v1.5', issueDate: '2023-08-20', expiryDate: d(180), languages: ['zh-CN', 'en-US'], status: 'valid', fileSize: '1.5MB', uploadedBy: '合规专员' },
  { id: 'M004', productId: 'P004', productName: '正性光刻胶 AZ1500', version: 'v4.0', issueDate: '2024-01-20', expiryDate: d(680), languages: ['zh-CN', 'en-US', 'ja-JP', 'ko-KR'], status: 'valid', fileSize: '3.1MB', uploadedBy: '合规专员' },
  { id: 'M005', productId: 'P005', productName: '负性光刻胶 SU-8', version: 'v2.8', issueDate: '2024-02-10', expiryDate: d(690), languages: ['zh-CN', 'en-US', 'ja-JP'], status: 'valid', fileSize: '2.7MB', uploadedBy: '合规专员' },
  { id: 'M006', productId: 'P006', productName: '光刻胶去除剂 NMP', version: 'v1.9', issueDate: '2023-11-05', expiryDate: d(60), languages: ['zh-CN', 'en-US'], status: 'expiring', fileSize: '1.2MB', uploadedBy: '合规专员' },
  { id: 'M007', productId: 'P007', productName: 'IPA 异丙醇 电子级', version: 'v3.5', issueDate: '2024-01-08', expiryDate: d(710), languages: ['zh-CN', 'en-US', 'ja-JP', 'ko-KR'], status: 'valid', fileSize: '1.6MB', uploadedBy: '合规专员' },
  { id: 'M008', productId: 'P008', productName: '双氧水 电子级 H₂O₂', version: 'v2.3', issueDate: '2023-12-15', expiryDate: d(620), languages: ['zh-CN', 'en-US', 'ja-JP'], status: 'valid', fileSize: '2.0MB', uploadedBy: '合规专员' }
]

export const demoARData = [
  { customerId: 'C001', customerName: 'TSMC', current: 1200000, days1_30: 850000, days31_60: 500000, days61_90: 300000, daysOver90: 0, total: 2850000, currency: 'CNY', lastPayment: d(-30), paymentTerms: 'Net 60' },
  { customerId: 'C002', customerName: 'UMC', current: 600000, days1_30: 400000, days31_60: 200000, days61_90: 0, daysOver90: 0, total: 1200000, currency: 'CNY', lastPayment: d(-20), paymentTerms: 'Net 60' },
  { customerId: 'C003', customerName: 'SMIC', current: 1000000, days1_30: 800000, days31_60: 800000, days61_90: 400000, daysOver90: 200000, total: 3200000, currency: 'CNY', lastPayment: d(-45), paymentTerms: 'Net 90' },
  { customerId: 'C004', customerName: '华虹半导体', current: 480000, days1_30: 300000, days31_60: 200000, days61_90: 0, daysOver90: 0, total: 980000, currency: 'CNY', lastPayment: d(-25), paymentTerms: 'Net 60' },
  { customerId: 'C005', customerName: 'AUO', current: 200000, days1_30: 150000, days31_60: 100000, days61_90: 0, daysOver90: 0, total: 450000, currency: 'CNY', lastPayment: d(-15), paymentTerms: 'Net 30' },
  { customerId: 'C006', customerName: '京东方', current: 800000, days1_30: 600000, days31_60: 500000, days61_90: 200000, daysOver90: 0, total: 2100000, currency: 'CNY', lastPayment: d(-35), paymentTerms: 'Net 90' }
]

export const demoAPData = [
  { supplierId: 'S001', supplierName: 'Samsung SDI Chemical', current: 500000, days1_30: 300000, days31_60: 0, days61_90: 0, daysOver90: 0, total: 800000, currency: 'CNY', dueDate: d(15), paymentTerms: 'T/T 60天' },
  { supplierId: 'S002', supplierName: 'Stella Chemifa', current: 1200000, days1_30: 800000, days31_60: 200000, days61_90: 0, daysOver90: 0, total: 2200000, currency: 'CNY', dueDate: d(8), paymentTerms: 'T/T 60天' },
  { supplierId: 'S003', supplierName: 'Tokyo Ohka Kogyo', current: 600000, days1_30: 0, days31_60: 0, days61_90: 0, daysOver90: 0, total: 600000, currency: 'CNY', dueDate: d(25), paymentTerms: 'L/C 30天' },
  { supplierId: 'S004', supplierName: 'Formosa Plastics', current: 150000, days1_30: 0, days31_60: 0, days61_90: 0, daysOver90: 0, total: 150000, currency: 'CNY', dueDate: d(12), paymentTerms: 'T/T 30天' },
  { supplierId: 'S005', supplierName: '江化微', current: 80000, days1_30: 0, days31_60: 0, days61_90: 0, daysOver90: 0, total: 80000, currency: 'CNY', dueDate: d(5), paymentTerms: 'T/T 30天' }
]

export const demoUsers = [
  { id: 'U001', name: '王总', username: 'boss', role: 'boss', email: 'boss@chem.com', status: 'active', lastLogin: dt(-1) },
  { id: 'U002', name: '张经理', username: 'salesmgr', role: 'salesMgr', email: 'salesmgr@chem.com', status: 'active', lastLogin: dt(-1) },
  { id: 'U003', name: '李经理', username: 'purchmgr', role: 'purchMgr', email: 'purchmgr@chem.com', status: 'active', lastLogin: dt(-2) },
  { id: 'U004', name: '陈小华', username: 'salesrep1', role: 'salesRep', email: 'salesrep1@chem.com', status: 'active', lastLogin: dt(-1) },
  { id: 'U005', name: '刘明', username: 'salesrep2', role: 'salesRep', email: 'salesrep2@chem.com', status: 'active', lastLogin: dt(0) },
  { id: 'U006', name: '赵采购', username: 'purchaser1', role: 'purchaser', email: 'purchaser1@chem.com', status: 'active', lastLogin: dt(-3) },
  { id: 'U007', name: '周仓管', username: 'warehouse1', role: 'warehouse', email: 'warehouse1@chem.com', status: 'active', lastLogin: dt(0) },
  { id: 'U008', name: '吴财务', username: 'finance1', role: 'finance', email: 'finance1@chem.com', status: 'active', lastLogin: dt(-1) },
  { id: 'U009', name: '郑合规', username: 'compliance1', role: 'compliance', email: 'compliance1@chem.com', status: 'active', lastLogin: dt(-2) },
  { id: 'U010', name: '管理员', username: 'admin', role: 'admin', email: 'admin@chem.com', status: 'active', lastLogin: dt(0) }
]

export const demoMonthlySales = [
  { month: '2023-04', revenue: 8200000, cogs: 6150000 },
  { month: '2023-05', revenue: 9100000, cogs: 6825000 },
  { month: '2023-06', revenue: 8800000, cogs: 6600000 },
  { month: '2023-07', revenue: 10200000, cogs: 7650000 },
  { month: '2023-08', revenue: 9500000, cogs: 7125000 },
  { month: '2023-09', revenue: 11000000, cogs: 8250000 },
  { month: '2023-10', revenue: 12500000, cogs: 9375000 },
  { month: '2023-11', revenue: 11800000, cogs: 8850000 },
  { month: '2023-12', revenue: 13200000, cogs: 9900000 },
  { month: '2024-01', revenue: 10500000, cogs: 7875000 },
  { month: '2024-02', revenue: 11200000, cogs: 8400000 },
  { month: '2024-03', revenue: 12800000, cogs: 9600000 }
]

export const demoQuoteComparisons = [
  {
    id: 'QC001',
    productId: 'P004',
    productName: '正性光刻胶 AZ1500',
    requestQty: 200,
    unit: 'L',
    quotes: [
      { supplierId: 'S001', supplierName: 'Samsung SDI Chemical', unitPrice: 42000, currency: 'KRW', moq: 100, leadTimeDays: 30, paymentTerms: 'T/T 60天', rating: 4.5, totalCNY: 62160 },
      { supplierId: 'S003', supplierName: 'Tokyo Ohka Kogyo', unitPrice: 38500, currency: 'JPY', moq: 50, leadTimeDays: 60, paymentTerms: 'L/C 30天', rating: 4.8, totalCNY: 74004 },
      { supplierId: 'S006', supplierName: 'Dongjin Semichem', unitPrice: 39000, currency: 'KRW', moq: 100, leadTimeDays: 35, paymentTerms: 'T/T 60天', rating: 4.0, totalCNY: 57720 }
    ]
  }
]
