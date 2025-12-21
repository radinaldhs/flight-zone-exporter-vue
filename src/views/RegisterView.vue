<template>
  <div class="min-h-[calc(100vh-theme(spacing.16))] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <Card class="w-full max-w-2xl p-8">
      <div class="text-center mb-8">
        <Plane class="mx-auto h-12 w-12 text-primary" />
        <h2 class="mt-6 text-3xl font-bold">Create your account</h2>
        <p class="mt-2 text-sm text-muted-foreground">
          Register to access the Flight Zone Exporter
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- GIS Credentials -->
        <div class="space-y-4">
          <h3 class="font-semibold text-lg">ArcGIS Credentials</h3>
          <p class="text-sm text-muted-foreground">
            Your GIS Auth credentials will be used to login to the app and for ArcGIS operations
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label for="gisAuthUsername">GIS Auth Username *</Label>
              <Input
                id="gisAuthUsername"
                v-model="form.gis_auth_username"
                type="text"
                required
                placeholder="agasha123"
                class="mt-2"
                :disabled="loading"
              />
            </div>

            <div>
              <Label for="gisAuthPassword">GIS Auth Password *</Label>
              <Input
                id="gisAuthPassword"
                v-model="form.gis_auth_password"
                type="password"
                required
                maxlength="72"
                placeholder="••••••••"
                class="mt-2"
                :disabled="loading"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label for="gisUsername">GIS Username *</Label>
              <Input
                id="gisUsername"
                v-model="form.gis_username"
                type="text"
                required
                placeholder="fmiseditor"
                class="mt-2"
                :disabled="loading"
              />
            </div>

            <div>
              <Label for="gisPassword">GIS Password *</Label>
              <Input
                id="gisPassword"
                v-model="form.gis_password"
                type="password"
                required
                maxlength="72"
                placeholder="••••••••"
                class="mt-2"
                :disabled="loading"
              />
            </div>
          </div>

          <div>
            <Label for="fullName">Full Name (optional)</Label>
            <Input
              id="fullName"
              v-model="form.full_name"
              type="text"
              placeholder="John Doe"
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
          Create account
        </Button>

        <div class="text-center text-sm">
          <span class="text-muted-foreground">Already have an account? </span>
          <router-link to="/login" class="text-primary hover:underline font-medium">
            Sign in
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
  gis_auth_username: '',
  gis_auth_password: '',
  gis_username: '',
  gis_password: '',
  full_name: ''
})

const handleSubmit = async () => {
  try {
    await authStore.register(form.value)
    router.push('/')
  } catch (err) {
    console.error('Registration failed:', err)
  }
}
</script>
