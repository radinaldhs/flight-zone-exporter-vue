<template>
  <div class="min-h-[calc(100vh-theme(spacing.16))] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <Card class="w-full max-w-md p-8">
      <!-- Loading State -->
      <div v-if="loading" class="text-center space-y-4">
        <Loader2 class="mx-auto h-12 w-12 text-primary animate-spin" />
        <h2 class="text-2xl font-bold">Verifying payment...</h2>
        <p class="text-muted-foreground">Please wait while we confirm your payment</p>
      </div>

      <!-- Success State -->
      <div v-else-if="success" class="text-center space-y-6">
        <div class="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle2 class="h-10 w-10 text-green-600" />
        </div>
        <div class="space-y-2">
          <h2 class="text-2xl font-bold text-green-600">Payment Successful!</h2>
          <p class="text-muted-foreground">
            Your subscription is now active. Welcome to Flight Zone Exporter!
          </p>
        </div>
        <Button @click="goToDashboard" class="w-full" size="lg">
          Continue to Dashboard
        </Button>
      </div>

      <!-- Failed State -->
      <div v-else class="text-center space-y-6">
        <div class="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <X class="h-10 w-10 text-red-600" />
        </div>
        <div class="space-y-2">
          <h2 class="text-2xl font-bold text-red-600">Payment Failed</h2>
          <p class="text-muted-foreground">{{ errorMessage }}</p>
          <p class="text-sm text-muted-foreground">
            Payment status: <span class="font-mono font-semibold">{{ paymentStatus }}</span>
          </p>
        </div>
        <div class="space-y-3">
          <Button @click="retryPayment" variant="default" class="w-full" size="lg">
            Try Again
          </Button>
          <Button @click="goHome" variant="outline" class="w-full">
            Go to Home
          </Button>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { CheckCircle2, X, Loader2 } from 'lucide-vue-next'
import apiClient from '@/api/client'

import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'

const router = useRouter()
const route = useRoute()

const loading = ref(true)
const success = ref(false)
const errorMessage = ref('')
const paymentStatus = ref('')

onMounted(async () => {
  const orderId = route.query.order_id || route.query.payment_id

  if (!orderId) {
    errorMessage.value = 'No payment ID found in URL'
    paymentStatus.value = 'missing_id'
    loading.value = false
    return
  }

  try {
    // Check payment status from backend
    const response = await apiClient.get(`/api/payments/${orderId}/status`)

    paymentStatus.value = response.data.status

    if (response.data.status === 'success') {
      success.value = true
    } else if (response.data.status === 'pending') {
      errorMessage.value = 'Payment is still being processed. Please wait a moment and refresh this page.'
    } else {
      errorMessage.value = `Payment was not successful. Please try again.`
    }
  } catch (error) {
    errorMessage.value = error.message || 'Failed to verify payment status'
    paymentStatus.value = 'error'
  } finally {
    loading.value = false
  }
})

function goToDashboard() {
  router.push('/')
}

function goHome() {
  router.push('/')
}

async function retryPayment() {
  try {
    const response = await apiClient.post('/api/payments/create')
    window.location.href = response.data.payment_url
  } catch (error) {
    errorMessage.value = 'Failed to create new payment. Please contact support.'
  }
}
</script>
