import { defineStore } from 'pinia'
import { ref } from 'vue'
import { demoPurchaseOrders, demoQuoteComparisons } from '../utils/sales-demoData.js'

export const usePurchaseStore = defineStore('sales_purchase', () => {
  const purchaseOrders = ref([...demoPurchaseOrders])
  const quoteComparisons = ref([...demoQuoteComparisons])
  const loading = ref(false)

  function getById(id) {
    return purchaseOrders.value.find(p => p.id === id)
  }

  async function fetchOrders() {
    loading.value = true
    await new Promise(r => setTimeout(r, 300))
    purchaseOrders.value = [...demoPurchaseOrders]
    loading.value = false
  }

  function addOrder(order) {
    const id = 'PO' + String(purchaseOrders.value.length + 1).padStart(3, '0')
    purchaseOrders.value.unshift({ ...order, id, createdAt: new Date().toISOString() })
  }

  function updateStatus(id, status) {
    const po = purchaseOrders.value.find(p => p.id === id)
    if (po) po.status = status
  }

  return { purchaseOrders, quoteComparisons, loading, getById, fetchOrders, addOrder, updateStatus }
})
