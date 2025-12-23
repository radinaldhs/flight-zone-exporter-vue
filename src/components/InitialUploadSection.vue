<template>
  <Card class="p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold">Step 1: Upload Files</h2>
        <p class="text-sm text-muted-foreground mt-1">
          Upload required files and enter flight zone details
        </p>
      </div>
      <div v-if="completed" class="flex items-center gap-2 text-green-600">
        <CheckCircle2 class="h-5 w-5" />
        <span class="text-sm font-medium">Complete</span>
      </div>
    </div>

    <div class="space-y-6">
      <!-- SPK Number and Key ID Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label for="spkNumber">SPK Number *</Label>
          <Input
            id="spkNumber"
            v-model="spkNumberModel"
            type="text"
            required
            placeholder="Enter SPK number"
            class="mt-2"
            :disabled="disabled"
          />
        </div>

        <div>
          <Label for="keyId">Key ID *</Label>
          <Input
            id="keyId"
            v-model="keyIdModel"
            type="text"
            required
            placeholder="Enter key ID"
            class="mt-2"
            :disabled="disabled"
          />
        </div>
      </div>

      <!-- File Uploads Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label for="kmlFile">KML ZIP File *</Label>
          <FileUpload
            id="kmlFile"
            v-model="kmlFileModel"
            accept=".zip"
            class="mt-2"
            :disabled="disabled"
          />
          <p class="text-xs text-muted-foreground mt-1">
            ZIP file containing KML flight zones
          </p>
        </div>

        <div>
          <Label for="excelFile">Excel File *</Label>
          <FileUpload
            id="excelFile"
            v-model="excelFileModel"
            accept=".xlsx,.xls,.xlsm"
            class="mt-2"
            :disabled="disabled"
          />
          <p class="text-xs text-muted-foreground mt-1">
            Flight records spreadsheet
          </p>
        </div>
      </div>

      <!-- Help Text -->
      <Alert v-if="!completed" class="bg-blue-50 border-blue-200">
        <Info class="h-4 w-4 text-blue-600" />
        <div class="ml-2">
          <p class="text-sm text-blue-900">
            All fields are required to continue. After uploading, you'll choose your workflow path.
          </p>
        </div>
      </Alert>
    </div>
  </Card>
</template>

<script setup>
import { computed } from 'vue'
import { CheckCircle2, Info } from 'lucide-vue-next'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import FileUpload from '@/components/FileUpload.vue'
import Alert from '@/components/ui/Alert.vue'

const props = defineProps({
  spkNumber: {
    type: String,
    default: ''
  },
  keyId: {
    type: String,
    default: ''
  },
  kmlFile: {
    type: File,
    default: null
  },
  excelFile: {
    type: File,
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  },
  completed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:spkNumber', 'update:keyId', 'update:kmlFile', 'update:excelFile'])

const spkNumberModel = computed({
  get: () => props.spkNumber,
  set: (value) => emit('update:spkNumber', value)
})

const keyIdModel = computed({
  get: () => props.keyId,
  set: (value) => emit('update:keyId', value)
})

const kmlFileModel = computed({
  get: () => props.kmlFile,
  set: (value) => emit('update:kmlFile', value)
})

const excelFileModel = computed({
  get: () => props.excelFile,
  set: (value) => emit('update:excelFile', value)
})
</script>
