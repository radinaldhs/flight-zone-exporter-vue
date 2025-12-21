<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header class="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="container flex h-16 items-center justify-between">
        <div class="flex items-center gap-2">
          <Plane class="h-6 w-6 text-primary" />
          <h1 class="text-xl font-bold">Flight Zone Exporter</h1>
        </div>

        <div class="flex items-center gap-4">
          <Button variant="outline" size="sm" @click="handleReset">
            <RotateCcw class="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container py-8">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="border-t mt-16">
      <div class="container py-6 text-center text-sm text-muted-foreground">
        © {{ new Date().getFullYear() }} Radinal Dewantara Husein
      </div>
    </footer>

    <!-- Global Alerts -->
    <div class="fixed bottom-4 right-4 z-50 space-y-2 max-w-md">
      <Alert v-if="error" variant="destructive" class="relative pr-10">
        <AlertCircle class="h-4 w-4" />
        <div class="ml-2 flex-1">
          <p class="font-medium">Error</p>
          <p class="text-sm">{{ error }}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          class="absolute top-2 right-2"
          @click="clearError"
        >
          <X class="h-4 w-4" />
        </Button>
      </Alert>

      <Alert v-if="successMessage" variant="success" class="relative pr-10">
        <CheckCircle class="h-4 w-4" />
        <div class="ml-2 flex-1">
          <p class="font-medium">Success</p>
          <p class="text-sm">{{ successMessage }}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          class="absolute top-2 right-2"
          @click="clearSuccess"
        >
          <X class="h-4 w-4" />
        </Button>
      </Alert>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { Plane, RotateCcw, AlertCircle, CheckCircle, X } from 'lucide-vue-next'
import Button from './components/ui/Button.vue'
import Alert from './components/ui/Alert.vue'
import { useFlightZoneStore } from './stores/flightZone'

const store = useFlightZoneStore()
const { error, successMessage } = storeToRefs(store)

const handleReset = () => {
  if (confirm('Are you sure you want to reset all fields?')) {
    store.reset()
  }
}

const clearError = () => store.clearError()
const clearSuccess = () => store.clearSuccess()
</script>
