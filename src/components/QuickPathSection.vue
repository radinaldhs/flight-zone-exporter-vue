<template>
  <Card class="p-6">
    <div class="mb-6">
      <h2 class="text-2xl font-bold mb-2">Step 2: Process Files</h2>
      <p class="text-sm text-muted-foreground">
        Process your KML and Excel files to create the final shapefile
      </p>
    </div>

    <div class="space-y-6">
      <!-- Process Button -->
      <div v-if="!processResult">
        <Button
          @click="$emit('process')"
          :disabled="!canProcess || loading"
          class="w-full"
          size="lg"
        >
          <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
          <Zap v-else class="mr-2 h-4 w-4" />
          Process Files
        </Button>
        <p class="text-xs text-muted-foreground mt-2 text-center">
          This will merge your KML zones with flight records from the Excel file
        </p>
      </div>

      <!-- Process Result -->
      <div v-else class="space-y-4">
        <Alert class="bg-green-50 border-green-200">
          <CheckCircle2 class="h-4 w-4 text-green-600" />
          <div class="ml-2">
            <p class="font-medium text-green-900">Processing Complete!</p>
            <p class="text-sm text-green-800 mt-1">
              {{ processResult.message }}
            </p>
          </div>
        </Alert>

        <!-- Result Details -->
        <div class="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <p class="text-xs text-muted-foreground">Total Zones</p>
            <p class="text-lg font-semibold">{{ processResult.total_zones }}</p>
          </div>
          <div>
            <p class="text-xs text-muted-foreground">Filename</p>
            <p class="text-sm font-medium truncate">{{ processResult.filename }}</p>
          </div>
        </div>

        <!-- Download Option -->
        <Button
          @click="$emit('download')"
          variant="outline"
          class="w-full"
          :disabled="loading"
        >
          <Download class="mr-2 h-4 w-4" />
          Download Final ZIP (Optional)
        </Button>
        <p class="text-xs text-muted-foreground text-center">
          You can download the processed file manually, or continue to upload directly to ArcGIS
        </p>
      </div>
    </div>
  </Card>
</template>

<script setup>
import { Zap, CheckCircle2, Download, Loader2 } from 'lucide-vue-next'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Alert from '@/components/ui/Alert.vue'

defineProps({
  canProcess: {
    type: Boolean,
    default: false
  },
  processResult: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['process', 'download'])
</script>
