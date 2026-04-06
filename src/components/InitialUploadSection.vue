<template>
  <Card class="p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-2xl font-bold">Step 1: Upload Files</h2>
        <p class="text-sm text-muted-foreground mt-1">
          Select flight zone details and upload required files
        </p>
      </div>
      <div v-if="completed" class="flex items-center gap-2 text-green-600">
        <CheckCircle2 class="h-5 w-5" />
        <span class="text-sm font-medium">Complete</span>
      </div>
    </div>

    <div class="space-y-6">
      <!-- Cascading Dropdowns -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label for="region">Region *</Label>
          <Select
            id="region"
            :model-value="store.selectedRegion"
            :options="store.regions"
            placeholder="Select Region"
            class="mt-2"
            :disabled="disabled || store.cascadeLoading"
            :loading="store.cascadeLoading && store.regions.length === 0"
            @update:model-value="store.selectRegion"
          />
        </div>

        <div>
          <Label for="district">District *</Label>
          <Select
            id="district"
            :model-value="store.selectedDistrict"
            :options="store.districts"
            placeholder="Select District"
            class="mt-2"
            :disabled="disabled || !store.selectedRegion || store.cascadeLoading"
            :loading="store.cascadeLoading && store.selectedRegion && store.districts.length === 0"
            @update:model-value="store.selectDistrict"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label for="keyId">Key ID (Petak) *</Label>
          <Combobox
            id="keyId"
            :model-value="store.keyId"
            :options="store.petaks"
            placeholder="Search or type Key ID"
            class="mt-2"
            :disabled="disabled || !store.selectedDistrict || store.cascadeLoading"
            :loading="store.cascadeLoading && store.selectedDistrict && store.petaks.length === 0"
            @update:model-value="store.selectPetak"
          />
        </div>

        <div>
          <Label for="spkNumber">SPK Number *</Label>
          <Combobox
            id="spkNumber"
            :model-value="store.spkNumber"
            :options="spkNumberOptions"
            placeholder="Search or type SPK Number"
            class="mt-2"
            :disabled="disabled || !store.keyId || store.cascadeLoading"
            :loading="store.cascadeLoading && store.keyId && store.spkNumbers.length === 0"
            @update:model-value="store.selectSpkNumber"
          />
          <p v-if="store.activity" class="text-xs text-muted-foreground mt-1">
            Activity: {{ store.activity }}
          </p>
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
import { computed, onMounted } from 'vue'
import { CheckCircle2, Info } from 'lucide-vue-next'
import Card from '@/components/ui/Card.vue'
import Select from '@/components/ui/Select.vue'
import Combobox from '@/components/ui/Combobox.vue'
import Label from '@/components/ui/Label.vue'
import FileUpload from '@/components/FileUpload.vue'
import Alert from '@/components/ui/Alert.vue'
import { useFlightZoneStore } from '@/stores/flightZone'

const props = defineProps({
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

const emit = defineEmits(['update:kmlFile', 'update:excelFile'])

const store = useFlightZoneStore()

const spkNumberOptions = computed(() =>
  store.spkNumbers.map(s => s.spk_number)
)

const kmlFileModel = computed({
  get: () => props.kmlFile,
  set: (value) => emit('update:kmlFile', value)
})

const excelFileModel = computed({
  get: () => props.excelFile,
  set: (value) => emit('update:excelFile', value)
})

onMounted(() => {
  if (store.regions.length === 0) {
    store.fetchRegions()
  }
})
</script>
