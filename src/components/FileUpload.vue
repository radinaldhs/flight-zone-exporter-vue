<template>
  <div class="space-y-2">
    <Label v-if="label">{{ label }}</Label>
    <div
      class="relative flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg transition-colors"
      :class="{
        'border-primary bg-primary/5': isDragging,
        'border-input hover:border-primary/50': !isDragging,
        'opacity-50 cursor-not-allowed': disabled
      }"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
    >
      <input
        ref="fileInputRef"
        type="file"
        :accept="accept"
        class="hidden"
        @change="handleFileChange"
        :disabled="disabled"
      />

      <div class="text-center px-4" @click="openFileDialog">
        <div v-if="!modelValue" class="cursor-pointer">
          <UploadCloud class="mx-auto h-12 w-12 text-muted-foreground mb-2" />
          <p class="text-sm text-muted-foreground">
            <span class="font-semibold text-primary hover:underline">Click to upload</span>
            or drag and drop
          </p>
          <p class="text-xs text-muted-foreground mt-1">{{ accept }}</p>
        </div>

        <div v-else class="flex items-center justify-center gap-2">
          <FileCheck class="h-6 w-6 text-green-600" />
          <div class="text-left">
            <p class="text-sm font-medium">{{ modelValue.name }}</p>
            <p class="text-xs text-muted-foreground">{{ formatFileSize(modelValue.size) }}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            class="ml-2"
            @click.stop="clearFile"
            :disabled="disabled"
          >
            <X class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { UploadCloud, FileCheck, X } from 'lucide-vue-next'
import Button from './ui/Button.vue'
import Label from './ui/Label.vue'

const props = defineProps({
  modelValue: {
    type: File,
    default: null
  },
  label: {
    type: String,
    default: ''
  },
  accept: {
    type: String,
    default: '*'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const fileInputRef = ref(null)
const isDragging = ref(false)

const openFileDialog = () => {
  if (!props.disabled) {
    fileInputRef.value?.click()
  }
}

const handleFileChange = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    emit('update:modelValue', file)
  }
}

const handleDragOver = () => {
  if (!props.disabled) {
    isDragging.value = true
  }
}

const handleDragLeave = () => {
  isDragging.value = false
}

const handleDrop = (event) => {
  isDragging.value = false
  if (props.disabled) return

  const file = event.dataTransfer?.files?.[0]
  if (file) {
    emit('update:modelValue', file)
  }
}

const clearFile = () => {
  emit('update:modelValue', null)
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
</script>
