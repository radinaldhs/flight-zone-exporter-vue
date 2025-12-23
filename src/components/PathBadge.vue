<template>
  <div class="flex items-center justify-between p-4 rounded-lg border" :class="badgeClasses">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="iconBgClasses">
        <component :is="pathIcon" class="h-5 w-5" :class="iconClasses" />
      </div>
      <div>
        <p class="text-sm font-medium" :class="textClasses">{{ pathLabel }}</p>
        <p class="text-xs text-muted-foreground">{{ pathDescription }}</p>
      </div>
    </div>

    <Button
      variant="outline"
      size="sm"
      @click="handleReset"
      class="flex items-center gap-2"
    >
      <RotateCcw class="h-4 w-4" />
      Start Over
    </Button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Zap, Edit3, RotateCcw } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'

const props = defineProps({
  path: {
    type: String,
    required: true,
    validator: (value) => ['quick', 'edit'].includes(value)
  }
})

const emit = defineEmits(['reset'])

const pathConfig = computed(() => {
  if (props.path === 'quick') {
    return {
      icon: Zap,
      label: 'Quick Process Path',
      description: 'Direct processing and upload',
      badgeClass: 'bg-blue-50 border-blue-200',
      iconBgClass: 'bg-blue-100',
      iconClass: 'text-blue-600',
      textClass: 'text-blue-900'
    }
  }
  return {
    icon: Edit3,
    label: 'Edit Shapefile Path',
    description: 'Generate, edit, then process',
    badgeClass: 'bg-purple-50 border-purple-200',
    iconBgClass: 'bg-purple-100',
    iconClass: 'text-purple-600',
    textClass: 'text-purple-900'
  }
})

const pathIcon = computed(() => pathConfig.value.icon)
const pathLabel = computed(() => pathConfig.value.label)
const pathDescription = computed(() => pathConfig.value.description)
const badgeClasses = computed(() => pathConfig.value.badgeClass)
const iconBgClasses = computed(() => pathConfig.value.iconBgClass)
const iconClasses = computed(() => pathConfig.value.iconClass)
const textClasses = computed(() => pathConfig.value.textClass)

const handleReset = () => {
  if (confirm('This will reset your workflow progress. Continue?')) {
    emit('reset')
  }
}
</script>
