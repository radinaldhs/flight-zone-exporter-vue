<template>
  <div class="min-h-[calc(100vh-theme(spacing.16))] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <Card class="w-full max-w-lg p-8">
      <div class="text-center space-y-6">
        <div class="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
          <AlertCircle class="h-10 w-10 text-amber-600" />
        </div>

        <div class="space-y-2">
          <h2 class="text-2xl font-bold text-amber-600">Subscription Expired</h2>
          <p class="text-muted-foreground">{{ message }}</p>
        </div>

        <Alert variant="warning">
          <AlertCircle class="h-4 w-4" />
          <div class="ml-2 space-y-1">
            <p class="font-medium">Action Required</p>
            <p class="text-sm">
              Your subscription has expired. Please renew to continue using Flight Zone Exporter.
            </p>
            <p class="text-sm font-semibold mt-2">
              Monthly Subscription: Rp 4,000,000
            </p>
          </div>
        </Alert>

        <div class="space-y-3">
          <Button
            @click="renewSubscription"
            :disabled="loading"
            variant="default"
            class="w-full"
            size="lg"
          >
            <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
            Renew Subscription Now
          </Button>

          <Button
            @click="goBack"
            variant="outline"
            class="w-full"
          >
            Go Back
          </Button>
        </div>

        <div v-if="error" class="text-sm text-red-600">
          {{ error }}
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AlertCircle, Loader2 } from 'lucide-vue-next'
import apiClient from '@/api/client'

import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Alert from '@/components/ui/Alert.vue'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const error = ref('')

const message = computed(() => {
  return route.query.message || 'Your subscription has expired. Please renew to continue.'
})

async function renewSubscription() {
  loading.value = true
  error.value = ''

  try {
    const response = await apiClient.post('/api/payments/create')
    // Redirect to Midtrans payment page
    window.location.href = response.data.payment_url
  } catch (err) {
    error.value = err.message || 'Failed to create payment. Please try again.'
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.back()
}
</script>
