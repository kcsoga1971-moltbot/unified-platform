import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)

export function formatDate(date, format = 'YYYY-MM-DD') {
  if (!date) return '-'
  return dayjs(date).format(format)
}

export function formatRelativeTime(date, locale = 'zh') {
  if (!date) return '-'
  if (locale === 'zh') {
    dayjs.locale('zh-cn')
  } else {
    dayjs.locale('en')
  }
  return dayjs(date).fromNow()
}

export function isOverdue(date) {
  if (!date) return false
  return dayjs(date).isBefore(dayjs(), 'day')
}

export function isDueToday(date) {
  if (!date) return false
  return dayjs(date).isSame(dayjs(), 'day')
}

export function isDueThisWeek(date) {
  if (!date) return false
  const now = dayjs()
  const end = now.endOf('week')
  const d = dayjs(date)
  return d.isAfter(now) && d.isBefore(end)
}

export function isDueWithinDays(date, days = 7) {
  if (!date) return false
  const now = dayjs()
  const end = now.add(days, 'day')
  return dayjs(date).isBefore(end) && dayjs(date).isAfter(now.subtract(1, 'day'))
}

export function generateProjectCode(productLine) {
  const prefix = productLine === 'TGV' ? 'TGV' : productLine === 'Anti-glare' ? 'AG' : 'PRJ'
  const year = dayjs().format('YYYY')
  const rand = Math.floor(Math.random() * 900 + 100)
  return `${prefix}-${year}-${rand}`
}

export function getStatusColor(status) {
  const map = {
    on_track: '#52c41a',
    at_risk: '#faad14',
    off_track: '#f5222d',
  }
  return map[status] || '#999'
}

export function getTaskStatusType(status) {
  const map = {
    todo: 'info',
    in_progress: 'primary',
    review: 'warning',
    done: 'success',
  }
  return map[status] || 'info'
}

export function getPriorityType(priority) {
  const map = {
    high: 'danger',
    medium: 'warning',
    low: 'info',
  }
  return map[priority] || 'info'
}

export function calculateProgress(deliverables) {
  if (!deliverables || deliverables.length === 0) return 0
  const done = deliverables.filter((d) => d.completed).length
  return Math.round((done / deliverables.length) * 100)
}

export function saveToLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error('localStorage save error:', e)
  }
}

export function loadFromLocalStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (e) {
    console.error('localStorage load error:', e)
    return defaultValue
  }
}

export function debounce(fn, delay = 300) {
  let timer
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}
