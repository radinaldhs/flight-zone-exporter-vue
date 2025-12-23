<template>
  <div class="w-full py-4">
    <!-- Path Indicator Badge -->
    <div v-if="workflowPath" class="flex justify-center mb-4">
      <div
        class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium"
        :class="pathBadgeClasses"
      >
        <component :is="pathIcon" class="h-3 w-3" />
        {{ pathLabel }}
      </div>
    </div>

    <!-- Steps Progress -->
    <div class="overflow-x-auto">
      <div class="flex items-center justify-between min-w-max px-4">
        <div v-for="step in currentSteps" :key="step.number" class="flex-1 min-w-[100px]">
          <div class="flex items-center">
            <div
              class="flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all"
              :class="getStepClasses(step)"
            >
              <Check v-if="currentStep > step.number" class="h-5 w-5" />
              <span v-else class="text-sm font-semibold">{{ step.number }}</span>
            </div>

            <div
              v-if="step.number !== currentSteps.length"
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
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Check, Zap, Edit3 } from 'lucide-vue-next'

const props = defineProps({
  currentStep: {
    type: Number,
    required: true
  },
  workflowPath: {
    type: String,
    default: null,
    validator: (value) => !value || ['quick', 'edit'].includes(value)
  },
  totalSteps: {
    type: Number,
    default: 4
  }
})

const quickPathSteps = [
  { number: 1, title: 'Upload Files' },
  { number: 2, title: 'Process Files' },
  { number: 3, title: 'Upload to ArcGIS' }
]

const editPathSteps = [
  { number: 1, title: 'Upload Files' },
  { number: 2, title: 'Generate Shapefile' },
  { number: 3, title: 'Download & Edit' },
  { number: 4, title: 'Upload Edited' },
  { number: 5, title: 'Process Files' },
  { number: 6, title: 'Upload to ArcGIS' }
]

const defaultSteps = [
  { number: 1, title: 'Upload Files' }
]

const currentSteps = computed(() => {
  if (!props.workflowPath) return defaultSteps
  if (props.workflowPath === 'quick') return quickPathSteps
  return editPathSteps
})

const pathIcon = computed(() => {
  if (props.workflowPath === 'quick') return Zap
  if (props.workflowPath === 'edit') return Edit3
  return null
})

const pathLabel = computed(() => {
  if (props.workflowPath === 'quick') return 'Quick Process Path'
  if (props.workflowPath === 'edit') return 'Edit Shapefile Path'
  return ''
})

const pathBadgeClasses = computed(() => {
  if (props.workflowPath === 'quick') {
    return 'bg-blue-100 text-blue-700 border border-blue-300'
  }
  if (props.workflowPath === 'edit') {
    return 'bg-purple-100 text-purple-700 border border-purple-300'
  }
  return ''
})

const getStepClasses = (step) => {
  const baseClasses = {
    'border-primary bg-primary text-primary-foreground': props.currentStep >= step.number,
    'border-muted bg-background text-muted-foreground': props.currentStep < step.number
  }

  // Add path-specific colors for active steps
  if (props.currentStep >= step.number) {
    if (props.workflowPath === 'quick') {
      return {
        'border-blue-600 bg-blue-600 text-white': true
      }
    } else if (props.workflowPath === 'edit') {
      return {
        'border-purple-600 bg-purple-600 text-white': true
      }
    }
  }

  return baseClasses
}
</script>
