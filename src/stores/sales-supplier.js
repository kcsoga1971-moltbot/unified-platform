import { defineStore } from 'pinia'
import { ref } from 'vue'
import { demoSuppliers } from '../utils/sales-demoData.js'

export const useSupplierStore = defineStore('sales_supplier', () => {
  const suppliers = ref([...demoSuppliers])
  const loading = ref(false)

  function getById(id) {
    return suppliers.value.find(s => s.id === id)
  }

  async function fetchSuppliers() {
    loading.value = true
    await new Promise(r => setTimeout(r, 300))
    suppliers.value = [...demoSuppliers]
    loading.value = false
  }

  function addSupplier(supplier) {
    suppliers.value.push({ ...supplier, id: 'S' + String(suppliers.value.length + 1).padStart(3, '0') })
  }

  function updateSupplier(id, updates) {
    const idx = suppliers.value.findIndex(s => s.id === id)
    if (idx !== -1) suppliers.value[idx] = { ...suppliers.value[idx], ...updates }
  }

  return { suppliers, loading, getById, fetchSuppliers, addSupplier, updateSupplier }
})
