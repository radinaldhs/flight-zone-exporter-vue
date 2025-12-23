<template>
  <Card class="p-4">
    <div class="flex items-center gap-2 mb-3">
      <HelpCircle class="h-4 w-4 text-primary" />
      <h3 class="font-semibold text-sm">Quick Guide</h3>
    </div>

    <div v-if="!workflowPath" class="space-y-2 text-xs text-muted-foreground">
      <p class="font-medium text-foreground">Getting Started:</p>
      <ol class="ml-4 space-y-1 list-decimal">
        <li>Enter your SPK Number and Key ID</li>
        <li>Upload KML ZIP file with flight zones</li>
        <li>Upload Excel file with flight records</li>
        <li>Choose your workflow path</li>
      </ol>
    </div>

    <div v-else-if="workflowPath === 'quick'" class="space-y-2 text-xs text-muted-foreground">
      <p class="font-medium text-blue-700">Quick Process Path:</p>
      <ol class="ml-4 space-y-1 list-decimal">
        <li>Files uploaded ✓</li>
        <li>Click "Process Files" to merge data</li>
        <li>Upload directly to ArcGIS or download manually</li>
      </ol>
      <p class="text-xs italic mt-2">
        This path skips shapefile editing and goes straight to processing.
      </p>
    </div>

    <div v-else-if="workflowPath === 'edit'" class="space-y-2 text-xs text-muted-foreground">
      <p class="font-medium text-purple-700">Edit Shapefile Path:</p>
      <ol class="ml-4 space-y-1 list-decimal">
        <li>Files uploaded ✓</li>
        <li>Generate shapefile from KML</li>
        <li>Download shapefile ZIP</li>
        <li>Edit in QGIS (adjust zones, attributes, etc.)</li>
        <li>Re-upload edited shapefile ZIP</li>
        <li>Process files</li>
        <li>Upload to ArcGIS or download manually</li>
      </ol>
      <p class="text-xs italic mt-2">
        This path allows manual editing in QGIS before processing.
      </p>
    </div>

    <div class="mt-3 pt-3 border-t">
      <p class="text-xs text-muted-foreground">
        <strong>Need help?</strong> Check the
        <a href="#" class="text-blue-600 hover:underline">documentation</a>
      </p>
    </div>
  </Card>
</template>

<script setup>
import { HelpCircle } from 'lucide-vue-next'
import Card from '@/components/ui/Card.vue'

defineProps({
  workflowPath: {
    type: String,
    default: null,
    validator: (value) => !value || ['quick', 'edit'].includes(value)
  }
})
</script>
