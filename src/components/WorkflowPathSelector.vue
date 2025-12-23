<template>
  <Card class="p-8">
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold mb-2">Choose Your Workflow</h2>
      <p class="text-sm text-muted-foreground">
        Select how you want to process your files
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Quick Path Card -->
      <button
        @click="selectPath('quick')"
        :disabled="!canChoose || disabled"
        class="group relative p-6 border-2 rounded-lg transition-all hover:border-blue-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200"
        :class="!canChoose || disabled ? 'border-gray-200' : 'border-gray-300'"
      >
        <div class="flex flex-col items-center text-center space-y-4">
          <!-- Icon -->
          <div class="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
            <Zap class="h-8 w-8 text-blue-600" />
          </div>

          <!-- Title -->
          <div>
            <h3 class="text-lg font-semibold mb-1">Quick Process</h3>
            <p class="text-xs text-muted-foreground">Fast and direct</p>
          </div>

          <!-- Description -->
          <ul class="text-left text-sm space-y-2 text-muted-foreground">
            <li class="flex items-start gap-2">
              <CheckCircle2 class="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>Process files directly</span>
            </li>
            <li class="flex items-start gap-2">
              <CheckCircle2 class="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>Upload to ArcGIS immediately</span>
            </li>
            <li class="flex items-start gap-2">
              <CheckCircle2 class="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>No manual editing required</span>
            </li>
          </ul>

          <!-- Button -->
          <div class="pt-2">
            <span class="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium group-hover:bg-blue-700 transition-colors">
              Choose This Path
              <ArrowRight class="h-4 w-4" />
            </span>
          </div>
        </div>
      </button>

      <!-- Edit Path Card -->
      <button
        @click="selectPath('edit')"
        :disabled="!canChoose || disabled"
        class="group relative p-6 border-2 rounded-lg transition-all hover:border-purple-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200"
        :class="!canChoose || disabled ? 'border-gray-200' : 'border-gray-300'"
      >
        <div class="flex flex-col items-center text-center space-y-4">
          <!-- Icon -->
          <div class="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
            <Edit3 class="h-8 w-8 text-purple-600" />
          </div>

          <!-- Title -->
          <div>
            <h3 class="text-lg font-semibold mb-1">Edit Shapefile First</h3>
            <p class="text-xs text-muted-foreground">For manual adjustments</p>
          </div>

          <!-- Description -->
          <ul class="text-left text-sm space-y-2 text-muted-foreground">
            <li class="flex items-start gap-2">
              <CheckCircle2 class="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <span>Generate shapefile from KML</span>
            </li>
            <li class="flex items-start gap-2">
              <CheckCircle2 class="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <span>Edit zones in QGIS</span>
            </li>
            <li class="flex items-start gap-2">
              <CheckCircle2 class="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <span>Re-upload edited shapefile</span>
            </li>
            <li class="flex items-start gap-2">
              <CheckCircle2 class="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <span>Process and upload</span>
            </li>
          </ul>

          <!-- Button -->
          <div class="pt-2">
            <span class="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-purple-600 text-white text-sm font-medium group-hover:bg-purple-700 transition-colors">
              Choose This Path
              <ArrowRight class="h-4 w-4" />
            </span>
          </div>
        </div>
      </button>
    </div>
  </Card>
</template>

<script setup>
import { Zap, Edit3, ArrowRight, CheckCircle2 } from 'lucide-vue-next'
import Card from '@/components/ui/Card.vue'

const props = defineProps({
  canChoose: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['path-selected'])

const selectPath = (path) => {
  if (!props.canChoose || props.disabled) return
  emit('path-selected', path)
}
</script>
