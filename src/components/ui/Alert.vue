<template>
  <div :class="cn(alertVariants({ variant }), props.class)" role="alert">
    <slot />
  </div>
</template>

<script setup>
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const props = defineProps({
  variant: {
    type: String,
    default: 'default'
  },
  class: {
    type: String,
    default: ''
  }
})

const alertVariants = cva(
  'relative w-full rounded-lg border p-4',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
        success: 'border-green-500/50 text-green-600 dark:border-green-500 [&>svg]:text-green-600'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)
</script>
