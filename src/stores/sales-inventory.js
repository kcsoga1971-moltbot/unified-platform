import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { demoInventory, demoStockMovements, demoProducts } from '../utils/sales-demoData.js'
import dayjs from 'dayjs'

const productMap = Object.fromEntries(demoProducts.map(p => [p.id, p]))

export const useInventoryStore = defineStore('sales_inventory', () => {
  const inventory = ref([...demoInventory])
  const movements = ref([...demoStockMovements])
  const loading = ref(false)

  const lowStockItems = computed(() => {
    return inventory.value.filter(item => {
      const product = productMap[item.productId]
      return product && item.quantity < product.safetyStock
    })
  })

  const expiringItems = computed(() => {
    return inventory.value
      .map(item => ({ ...item, daysLeft: dayjs(item.expiryDate).diff(dayjs(), 'day') }))
      .filter(item => item.daysLeft <= 90 && item.daysLeft > 0)
      .sort((a, b) => a.daysLeft - b.daysLeft)
  })

  const expiredItems = computed(() => {
    return inventory.value.filter(item => dayjs(item.expiryDate).isBefore(dayjs()))
  })

  async function fetchInventory() {
    loading.value = true
    await new Promise(r => setTimeout(r, 300))
    inventory.value = [...demoInventory]
    movements.value = [...demoStockMovements]
    loading.value = false
  }

  function addMovement(movement) {
    movements.value.unshift({ ...movement, id: 'SM' + String(movements.value.length + 1).padStart(3, '0'), date: new Date().toISOString() })
  }

  return { inventory, movements, lowStockItems, expiringItems, expiredItems, loading, fetchInventory, addMovement }
})
