<template>
  <div class="min-h-[calc(100vh-theme(spacing.16))] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <Card class="w-full max-w-md p-8">
      <div class="text-center mb-8">
        <Plane class="mx-auto h-12 w-12 text-primary" />
        <h2 class="mt-6 text-3xl font-bold">Sign in to your account</h2>
        <p class="mt-2 text-sm text-muted-foreground">
          Welcome back! Please enter your credentials
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="space-y-4">
          <div>
            <Label for="email">Email address</Label>
            <Input
              id="email"
              v-model="form.email"
              type="email"
              required
              placeholder="you@example.com"
              class="mt-2"
              :disabled="loading"
            />
          </div>

          <div>
            <Label for="password">Password</Label>
            <Input
              id="password"
              v-model="form.password"
              type="password"
              required
              placeholder="••••••••"
              class="mt-2"
              :disabled="loading"
            />
          </div>
        </div>

        <Alert v-if="error" variant="destructive">
          <AlertCircle class="h-4 w-4" />
          <div class="ml-2">
            <p class="font-medium">Error</p>
            <p class="text-sm">{{ error }}</p>
          </div>
        </Alert>

        <Button type="submit" class="w-full" size="lg" :disabled="loading">
          <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
          Sign in
        </Button>

        <div class="text-center text-sm">
          <span class="text-muted-foreground">Don't have an account? </span>
          <router-link to="/register" class="text-primary hover:underline font-medium">
            Sign up
          </router-link>
        </div>
      </form>
    </Card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { Plane, AlertCircle, Loader2 } from 'lucide-vue-next'

import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import Alert from '@/components/ui/Alert.vue'

import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const { loading, error } = storeToRefs(authStore)

const form = ref({
  email: '',
  password: ''
})

const handleSubmit = async () => {
  try {
    await authStore.login(form.value)
    router.push('/')
  } catch (err) {
    console.error('Login failed:', err)
  }
}
</script>
