import { defineStore } from 'pinia'
import { ref } from 'vue'
import { demoCustomers } from '../utils/sales-demoData.js'

export const useCustomerStore = defineStore('sales_customer', () => {
  const customers = ref([...demoCustomers])
  const loading = ref(false)

  function getById(id) {
    return customers.value.find(c => c.id === id)
  }

  async function fetchCustomers() {
    loading.value = true
    await new Promise(r => setTimeout(r, 300))
    customers.value = [...demoCustomers]
    loading.value = false
  }

  function addCustomer(customer) {
    customers.value.push({ ...customer, id: 'C' + String(customers.value.length + 1).padStart(3, '0') })
  }

  function updateCustomer(id, updates) {
    const idx = customers.value.findIndex(c => c.id === id)
    if (idx !== -1) customers.value[idx] = { ...customers.value[idx], ...updates }
  }

  return { customers, loading, getById, fetchCustomers, addCustomer, updateCustomer }
})
