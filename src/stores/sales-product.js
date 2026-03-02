import { defineStore } from 'pinia'
import { ref } from 'vue'
import { demoProducts } from '../utils/sales-demoData.js'

export const useProductStore = defineStore('sales_product', () => {
  const products = ref([...demoProducts])
  const loading = ref(false)

  function getById(id) {
    return products.value.find(p => p.id === id)
  }

  function getByCategory(category) {
    return products.value.filter(p => p.category === category)
  }

  async function fetchProducts() {
    loading.value = true
    await new Promise(r => setTimeout(r, 300))
    products.value = [...demoProducts]
    loading.value = false
  }

  function addProduct(product) {
    products.value.push({ ...product, id: 'P' + String(products.value.length + 1).padStart(3, '0') })
  }

  function updateProduct(id, updates) {
    const idx = products.value.findIndex(p => p.id === id)
    if (idx !== -1) products.value[idx] = { ...products.value[idx], ...updates }
  }

  return { products, loading, getById, getByCategory, fetchProducts, addProduct, updateProduct }
})
