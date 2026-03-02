import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)

export function formatDate(date, format = 'YYYY-MM-DD') {
  if (!date) return '-'
  return dayjs(date).format(format)
}

export function formatDateTime(date) {
  if (!date) return '-'
  return dayjs(date).format('YYYY-MM-DD HH:mm')
}

export function fromNow(date) {
  if (!date) return '-'
  return dayjs(date).locale('zh-cn').fromNow()
}

export function daysUntil(date) {
  if (!date) return null
  return dayjs(date).diff(dayjs(), 'day')
}

export function daysAgo(date) {
  if (!date) return null
  return dayjs().diff(dayjs(date), 'day')
}

export function generateId(prefix = '') {
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
  return prefix ? `${prefix}-${ts}${rand}` : `${ts}${rand}`
}

export function getStatusColor(status) {
  const colorMap = {
    draft: '#909399',
    approved: '#409EFF',
    ordered: '#67C23A',
    shipped: '#E6A23C',
    received: '#67C23A',
    closed: '#909399',
    quotation: '#909399',
    confirmed: '#409EFF',
    processing: '#E6A23C',
    delivered: '#67C23A',
    invoiced: '#409EFF',
    paid: '#67C23A',
    active: '#67C23A',
    inactive: '#909399',
    expired: '#F56C6C',
    expiring: '#E6A23C',
    valid: '#67C23A',
    pending: '#E6A23C',
    submitted: '#409EFF',
    cleared: '#67C23A',
    released: '#67C23A',
    booked: '#909399',
    pickedUp: '#409EFF',
    inTransit: '#E6A23C',
    customs: '#F56C6C',
    pass: '#67C23A',
    fail: '#F56C6C',
    partial: '#E6A23C'
  }
  return colorMap[status] || '#909399'
}

export function truncate(str, len = 30) {
  if (!str) return ''
  return str.length > len ? str.substring(0, len) + '...' : str
}

export function percentageColor(pct) {
  if (pct >= 30) return '#67C23A'
  if (pct >= 15) return '#E6A23C'
  return '#F56C6C'
}

export function sumBy(arr, key) {
  return arr.reduce((acc, item) => acc + (Number(item[key]) || 0), 0)
}

export function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const k = item[key]
    if (!acc[k]) acc[k] = []
    acc[k].push(item)
    return acc
  }, {})
}
