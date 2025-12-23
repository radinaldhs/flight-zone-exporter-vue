<template>
  <Card class="p-6 border-2 border-green-200 bg-green-50">
    <div class="mb-6">
      <h2 class="text-2xl font-bold mb-2">Final Step: Upload to ArcGIS</h2>
      <p class="text-sm text-muted-foreground">
        Choose how to upload your processed shapefile
      </p>
    </div>

    <div class="space-y-4">
      <!-- Primary Action: Upload to ArcGIS -->
      <Button
        @click="$emit('upload-to-arcgis')"
        :disabled="!canUpload || loading"
        class="w-full bg-green-600 hover:bg-green-700"
        size="lg"
      >
        <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
        <Upload v-else class="mr-2 h-5 w-5" />
        Upload to ArcGIS
      </Button>

      <!-- Secondary Action: Manual Download -->
      <div class="text-center">
        <p class="text-sm text-muted-foreground mb-2">or</p>
        <button
          @click="$emit('download-manual')"
          :disabled="loading"
          class="text-sm text-blue-600 hover:text-blue-800 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download class="inline h-4 w-4 mr-1" />
          Download final ZIP manually
        </button>
        <p class="text-xs text-muted-foreground mt-1">
          Download the processed file if you want to upload it yourself
        </p>
      </div>

      <!-- Info Alert -->
      <Alert class="bg-blue-50 border-blue-200">
        <Info class="h-4 w-4 text-blue-600" />
        <div class="ml-2">
          <p class="text-sm text-blue-900">
            <strong>What happens when you upload:</strong>
          </p>
          <ul class="text-sm text-blue-800 mt-2 ml-4 list-disc space-y-1">
            <li>System checks if SPK already exists in ArcGIS</li>
            <li>If exists, old data will be automatically deleted</li>
            <li>New processed shapefile will be uploaded</li>
            <li>Features will be added with your SPK and Key ID</li>
          </ul>
        </div>
      </Alert>
    </div>
  </Card>
</template>

<script setup>
import { Upload, Download, Info, Loader2 } from 'lucide-vue-next'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Alert from '@/components/ui/Alert.vue'

defineProps({
  canUpload: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['upload-to-arcgis', 'download-manual'])
</script>
