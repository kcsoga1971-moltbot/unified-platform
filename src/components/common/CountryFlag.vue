<template>
  <span class="country-flag" :title="countryName">{{ flag }} {{ showName ? countryName : '' }}</span>
</template>

<script setup>
import { computed } from 'vue'
import { COUNTRIES } from '../../utils/sales-constants.js'

const props = defineProps({
  code: { type: String, required: true },
  showName: { type: Boolean, default: false }
})

const flag = computed(() => COUNTRIES[props.code]?.flag || props.code)
const countryName = computed(() => COUNTRIES[props.code]?.name || props.code)
</script>

<style scoped>
.country-flag { white-space: nowrap; }
</style>
