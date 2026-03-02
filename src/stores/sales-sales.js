import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { demoSalesOrders } from '../utils/sales-demoData.js'

export const useSalesStore = defineStore('sales_orders', () => {
  const salesOrders = ref([...demoSalesOrders])
  const loading = ref(false)

  const quotations = computed(() => salesOrders.value.filter(o => o.status === 'quotation'))
  const activeOrders = computed(() => salesOrders.value.filter(o => o.status !== 'quotation' && o.status !== 'paid'))

  function getById(id) {
    return salesOrders.value.find(o => o.id === id)
  }

  async function fetchOrders() {
    loading.value = true
    await new Promise(r => setTimeout(r, 300))
    salesOrders.value = [...demoSalesOrders]
    loading.value = false
  }

  function addOrder(order) {
    const id = 'SO' + String(salesOrders.value.length + 1).padStart(3, '0')
    salesOrders.value.unshift({ ...order, id, createdAt: new Date().toISOString() })
  }

  function updateStatus(id, status) {
    const so = salesOrders.value.find(o => o.id === id)
    if (so) so.status = status
  }

  function convertToOrder(quotationId) {
    const q = salesOrders.value.find(o => o.id === quotationId)
    if (q) q.status = 'confirmed'
  }

  return { salesOrders, quotations, activeOrders, loading, getById, fetchOrders, addOrder, updateStatus, convertToOrder }
})
