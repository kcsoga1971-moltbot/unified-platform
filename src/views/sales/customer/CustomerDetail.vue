<template>
  <div>
    <div class="page-header">
      <div style="display:flex;align-items:center;gap:12px">
        <el-button text :icon="'ArrowLeft'" @click="router.back()">{{ $t('common.back') }}</el-button>
        <h2>{{ customer?.name }}</h2>
        <el-tag type="success" v-if="customer">{{ customer.grade }}{{ $t('customer.grade') }}</el-tag>
      </div>
    </div>

    <div v-if="customer">
      <el-row :gutter="16">
        <el-col :span="14">
          <el-card>
            <template #header><span>{{ $t('customer.info') }}</span></template>
            <el-descriptions :column="2" border>
              <el-descriptions-item :label="$t('common.company')">{{ customer.name }}</el-descriptions-item>
              <el-descriptions-item :label="$t('common.country')"><CountryFlag :code="customer.country" :showName="true" /></el-descriptions-item>
              <el-descriptions-item :label="$t('customer.industry')">{{ customer.industry }}</el-descriptions-item>
              <el-descriptions-item :label="$t('customer.paymentTerms')">{{ customer.paymentTerms }}</el-descriptions-item>
              <el-descriptions-item :label="$t('common.contact')">{{ customer.contactPerson }}</el-descriptions-item>
              <el-descriptions-item :label="$t('common.phone')">{{ customer.phone }}</el-descriptions-item>
              <el-descriptions-item :label="$t('common.email')">{{ customer.email }}</el-descriptions-item>
              <el-descriptions-item :label="$t('common.address')" :span="2">{{ customer.address }}</el-descriptions-item>
            </el-descriptions>
          </el-card>

          <el-card style="margin-top:16px">
            <template #header><span>{{ $t('dashboard.recentOrders') }}</span></template>
            <el-table :data="customerOrders" size="small">
              <el-table-column :label="$t('sales.soNumber')" prop="soNumber" width="140" />
              <el-table-column :label="$t('common.amount')">
                <template #default="{ row }"><CurrencyDisplay :amount="row.totalAmount" :currency="row.currency" /></template>
              </el-table-column>
              <el-table-column :label="$t('common.status')">
                <template #default="{ row }"><StatusBadge :status="row.status" /></template>
              </el-table-column>
              <el-table-column :label="$t('common.date')">
                <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>

        <el-col :span="10">
          <el-card>
            <template #header><span>{{ $t('customer.creditInfo') }}</span></template>
            <div style="padding:16px">
              <div class="credit-stat">
                <span class="credit-label">{{ $t('customer.creditLimit') }}</span>
                <CurrencyDisplay :amount="customer.creditLimit" currency="CNY" />
              </div>
              <div class="credit-stat">
                <span class="credit-label">{{ $t('customer.arBalance') }}</span>
                <CurrencyDisplay :amount="customer.arBalance" currency="CNY" color="#e57373" />
              </div>
              <div class="credit-stat">
                <span class="credit-label">{{ $t('customer.available') }}</span>
                <CurrencyDisplay :amount="customer.creditLimit - customer.arBalance" currency="CNY" color="#67c23a" />
              </div>
              <el-progress
                :percentage="Math.round(customer.arBalance / customer.creditLimit * 100)"
                :color="customer.arBalance / customer.creditLimit > 0.8 ? '#f56c6c' : '#409EFF'"
                style="margin-top:16px"
              />
              <p style="text-align:center;font-size:12px;color:#909399;margin-top:8px">
                {{ $t('customer.creditUtilization') }}: {{ (customer.arBalance / customer.creditLimit * 100).toFixed(1) }}%
              </p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCustomerStore } from '../../../stores/sales-customer.js'
import { useSalesStore } from '../../../stores/sales-sales.js'
import CountryFlag from '../../../components/common/CountryFlag.vue'
import CurrencyDisplay from '../../../components/common/CurrencyDisplay.vue'
import StatusBadge from '../../../components/common/StatusBadge.vue'
import { formatDate } from '../../../utils/sales-helpers.js'

const route = useRoute()
const router = useRouter()
const customerStore = useCustomerStore()
const salesStore = useSalesStore()

const customer = computed(() => customerStore.getById(route.params.id))
const customerOrders = computed(() => salesStore.salesOrders.filter(o => o.customerId === route.params.id))

onMounted(() => { customerStore.fetchCustomers(); salesStore.fetchOrders() })
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.page-header h2 { font-size: 20px; font-weight: 600; }
.credit-stat { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
.credit-label { color: #606266; font-size: 13px; }
</style>
