<template>
  <div v-if="subscription" class="subscription-status">
    <!-- Whitelisted / Free Access -->
    <div v-if="subscription.is_whitelisted" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
      <CheckCircle2 class="h-4 w-4 mr-1.5" />
      Free Access
    </div>

    <!-- Active Subscription -->
    <div v-else-if="subscription.subscription_status === 'active'" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
      <CheckCircle2 class="h-4 w-4 mr-1.5" />
      Active until {{ formatDate(subscription.subscription_end_date) }}
    </div>

    <!-- Grace Period -->
    <div v-else-if="subscription.subscription_status === 'grace_period'" class="space-y-2">
      <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-700">
        <AlertCircle class="h-4 w-4 mr-1.5" />
        Grace Period - Renew Soon!
      </div>
      <Button @click="renewSubscription" size="sm" variant="outline" class="ml-2">
        Renew Now
      </Button>
    </div>

    <!-- Expired -->
    <div v-else-if="subscription.subscription_status === 'expired'" class="space-y-2">
      <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
        <X class="h-4 w-4 mr-1.5" />
        Subscription Expired
      </div>
      <Button @click="renewSubscription" size="sm" class="ml-2">
        Renew Subscription
      </Button>
    </div>

    <!-- Inactive (not paid yet) -->
    <div v-else class="space-y-2">
      <div class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
        <AlertCircle class="h-4 w-4 mr-1.5" />
        Payment Required
      </div>
      <Button @click="renewSubscription" size="sm" class="ml-2">
        Complete Payment
      </Button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { CheckCircle2, AlertCircle, X } from 'lucide-vue-next'
import apiClient from '@/api/client'
import Button from './ui/Button.vue'

const subscription = ref(null)

onMounted(async () => {
  try {
    const response = await apiClient.get('/api/subscriptions/status')
    subscription.value = response.data
  } catch (error) {
    console.error('Failed to fetch subscription status:', error)
  }
})

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

async function renewSubscription() {
  try {
    const response = await apiClient.post('/api/payments/create')
    window.location.href = response.data.payment_url
  } catch (error) {
    console.error('Failed to create payment:', error)
    alert('Failed to create payment. Please try again.')
  }
}
</script>

<style scoped>
.subscription-status {
  @apply flex items-center gap-2;
}
</style>
