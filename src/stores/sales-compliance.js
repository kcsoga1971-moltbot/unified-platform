import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { demoLicenses, demoMSDS } from '../utils/sales-demoData.js'
import dayjs from 'dayjs'

export const useComplianceStore = defineStore('sales_compliance', () => {
  const licenses = ref([...demoLicenses])
  const msds = ref([...demoMSDS])
  const loading = ref(false)

  const expiringLicenses = computed(() => {
    return licenses.value.filter(l => {
      const days = dayjs(l.expiryDate).diff(dayjs(), 'day')
      return days >= 0 && days <= 90
    })
  })

  const expiredLicenses = computed(() => {
    return licenses.value.filter(l => dayjs(l.expiryDate).isBefore(dayjs()))
  })

  async function fetchLicenses() {
    loading.value = true
    await new Promise(r => setTimeout(r, 300))
    licenses.value = [...demoLicenses]
    msds.value = [...demoMSDS]
    loading.value = false
  }

  function addLicense(license) {
    licenses.value.push({ ...license, id: 'L' + String(licenses.value.length + 1).padStart(3, '0') })
  }

  function updateLicense(id, updates) {
    const idx = licenses.value.findIndex(l => l.id === id)
    if (idx !== -1) licenses.value[idx] = { ...licenses.value[idx], ...updates }
  }

  return { licenses, msds, expiringLicenses, expiredLicenses, loading, fetchLicenses, addLicense, updateLicense }
})
