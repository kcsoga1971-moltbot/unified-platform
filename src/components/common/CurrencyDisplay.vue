<template>
  <span class="currency-amount" :style="{ color: amountColor }">
    {{ formatted }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { formatCurrency } from '../../utils/currency.js'

const props = defineProps({
  amount: { type: Number, default: 0 },
  currency: { type: String, default: 'CNY' },
  color: { type: String, default: null }
})

const formatted = computed(() => formatCurrency(props.amount, props.currency))
const amountColor = computed(() => props.color || null)
</script>

<style scoped>
.currency-amount { font-family: 'Courier New', monospace; font-weight: 600; }
</style>
