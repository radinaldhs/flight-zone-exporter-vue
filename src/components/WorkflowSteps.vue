<template>
  <div class="w-full py-4">
    <div class="flex items-center justify-between">
      <div v-for="step in steps" :key="step.number" class="flex-1">
        <div class="flex items-center">
          <div
            class="flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all"
            :class="{
              'border-primary bg-primary text-primary-foreground': currentStep >= step.number,
              'border-muted bg-background text-muted-foreground': currentStep < step.number
            }"
          >
            <Check v-if="currentStep > step.number" class="h-5 w-5" />
            <span v-else class="text-sm font-semibold">{{ step.number }}</span>
          </div>

          <div
            v-if="step.number !== steps.length"
            class="flex-1 h-0.5 mx-2"
            :class="{
              'bg-primary': currentStep > step.number,
              'bg-muted': currentStep <= step.number
            }"
          />
        </div>

        <div class="mt-2">
          <p
            class="text-sm font-medium"
            :class="{
              'text-foreground': currentStep >= step.number,
              'text-muted-foreground': currentStep < step.number
            }"
          >
            {{ step.title }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Check } from 'lucide-vue-next'

defineProps({
  currentStep: {
    type: Number,
    required: true
  }
})

const steps = [
  { number: 1, title: 'Upload Files' },
  { number: 2, title: 'Generate Shapefile' },
  { number: 3, title: 'Process Data' },
  { number: 4, title: 'Upload to ArcGIS' }
]
</script>
