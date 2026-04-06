<template>
  <div class="relative" ref="containerRef">
    <div class="relative">
      <input
        ref="inputRef"
        :class="cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-8',
          props.class
        )"
        :value="searchQuery"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="onInput"
        @focus="open = true"
        @keydown.down.prevent="highlightNext"
        @keydown.up.prevent="highlightPrev"
        @keydown.enter.prevent="selectHighlighted"
        @keydown.escape="open = false"
        v-bind="$attrs"
      />
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <svg v-if="loading" class="h-4 w-4 animate-spin text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <svg v-else class="h-4 w-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>

    <ul
      v-if="open && filteredOptions.length > 0"
      class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-background py-1 shadow-lg"
    >
      <li
        v-for="(option, index) in filteredOptions"
        :key="option"
        :class="[
          'cursor-pointer select-none px-3 py-2 text-sm',
          index === highlightedIndex ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'
        ]"
        @mousedown.prevent="selectOption(option)"
      >
        {{ option }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: 'Search or type a value'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  class: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const containerRef = ref(null)
const inputRef = ref(null)
const open = ref(false)
const searchQuery = ref(props.modelValue)
const highlightedIndex = ref(-1)

const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options
  const q = searchQuery.value.toLowerCase()
  return props.options.filter(o => o.toLowerCase().includes(q))
})

function onInput(e) {
  searchQuery.value = e.target.value
  open.value = true
  highlightedIndex.value = -1
  emit('update:modelValue', e.target.value)
}

function selectOption(option) {
  searchQuery.value = option
  open.value = false
  highlightedIndex.value = -1
  emit('update:modelValue', option)
}

function highlightNext() {
  if (highlightedIndex.value < filteredOptions.value.length - 1) {
    highlightedIndex.value++
  }
}

function highlightPrev() {
  if (highlightedIndex.value > 0) {
    highlightedIndex.value--
  }
}

function selectHighlighted() {
  if (highlightedIndex.value >= 0 && highlightedIndex.value < filteredOptions.value.length) {
    selectOption(filteredOptions.value[highlightedIndex.value])
  } else {
    open.value = false
  }
}

function onClickOutside(e) {
  if (containerRef.value && !containerRef.value.contains(e.target)) {
    open.value = false
  }
}

watch(() => props.modelValue, (val) => {
  searchQuery.value = val
})

onMounted(() => {
  document.addEventListener('mousedown', onClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onClickOutside)
})
</script>
