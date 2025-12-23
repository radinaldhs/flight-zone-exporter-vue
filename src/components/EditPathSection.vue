<template>
  <Card class="p-6">
    <div class="mb-6">
      <h2 class="text-2xl font-bold mb-2">Edit Shapefile Workflow</h2>
      <p class="text-sm text-muted-foreground">
        Generate, download, edit in QGIS, then upload and process
      </p>
    </div>

    <div class="space-y-6">
      <!-- Step 2: Generate Shapefile -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <h3 class="font-semibold">Step 2: Generate Shapefile</h3>
          <CheckCircle2 v-if="hasGenerated" class="h-5 w-5 text-green-600" />
        </div>

        <Button
          v-if="!hasGenerated"
          @click="$emit('generate')"
          :disabled="!canGenerate || loading"
          class="w-full"
          size="lg"
        >
          <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
          <FileCode v-else class="mr-2 h-4 w-4" />
          Generate Shapefile from KML
        </Button>

        <Alert v-if="hasGenerated" class="bg-green-50 border-green-200">
          <CheckCircle2 class="h-4 w-4 text-green-600" />
          <div class="ml-2">
            <p class="text-sm text-green-900 font-medium">
              Shapefile generated successfully! Ready to download.
            </p>
          </div>
        </Alert>
      </div>

      <!-- Step 3: Download for Edit -->
      <div v-if="hasGenerated" class="space-y-3 pt-4 border-t">
        <div class="flex items-center justify-between">
          <h3 class="font-semibold">Step 3: Download & Edit in QGIS</h3>
          <CheckCircle2 v-if="editingPhase === 'downloaded'" class="h-5 w-5 text-green-600" />
        </div>

        <Button
          @click="$emit('download-for-edit')"
          :disabled="loading"
          variant="outline"
          class="w-full"
          size="lg"
        >
          <Download class="mr-2 h-4 w-4" />
          Download Shapefile for QGIS
        </Button>

        <Alert class="bg-blue-50 border-blue-200">
          <Info class="h-4 w-4 text-blue-600" />
          <div class="ml-2">
            <p class="text-sm text-blue-900">
              <strong>Instructions:</strong>
            </p>
            <ol class="text-sm text-blue-800 mt-2 ml-4 list-decimal space-y-1">
              <li>Download the shapefile ZIP</li>
              <li>Open it in QGIS</li>
              <li>Make your edits (adjust zones, attributes, etc.)</li>
              <li>Save and export as shapefile</li>
              <li>Re-package as ZIP file</li>
              <li>Upload the edited ZIP below</li>
            </ol>
          </div>
        </Alert>
      </div>

      <!-- Step 4: Upload Edited Shapefile -->
      <div v-if="canUploadEdited || editedShapefile" class="space-y-3 pt-4 border-t">
        <div class="flex items-center justify-between">
          <h3 class="font-semibold">Step 4: Upload Edited Shapefile</h3>
          <CheckCircle2 v-if="editedShapefile" class="h-5 w-5 text-green-600" />
        </div>

        <div>
          <Label for="editedShapefile">Edited Shapefile ZIP *</Label>
          <FileUpload
            id="editedShapefile"
            v-model="editedShapefileModel"
            accept=".zip"
            class="mt-2"
            :disabled="loading"
          />
          <p class="text-xs text-muted-foreground mt-1">
            Upload the ZIP file containing your edited shapefile
          </p>
        </div>

        <Alert v-if="editedShapefile" class="bg-green-50 border-green-200">
          <CheckCircle2 class="h-4 w-4 text-green-600" />
          <div class="ml-2">
            <p class="text-sm text-green-900 font-medium">
              Edited shapefile uploaded! Ready to process.
            </p>
          </div>
        </Alert>
      </div>

      <!-- Step 5: Process Files -->
      <div v-if="editedShapefile" class="space-y-3 pt-4 border-t">
        <div class="flex items-center justify-between">
          <h3 class="font-semibold">Step 5: Process Files</h3>
          <CheckCircle2 v-if="processResult" class="h-5 w-5 text-green-600" />
        </div>

        <div v-if="!processResult">
          <Button
            @click="$emit('process')"
            :disabled="!canProcess || loading"
            class="w-full"
            size="lg"
          >
            <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
            <Cpu v-else class="mr-2 h-4 w-4" />
            Process with Edited Shapefile
          </Button>
          <p class="text-xs text-muted-foreground mt-2 text-center">
            This will merge your edited shapefile with flight records
          </p>
        </div>

        <!-- Process Result -->
        <div v-else class="space-y-4">
          <Alert class="bg-green-50 border-green-200">
            <CheckCircle2 class="h-4 w-4 text-green-600" />
            <div class="ml-2">
              <p class="font-medium text-green-900">Processing Complete!</p>
              <p class="text-sm text-green-800 mt-1">
                {{ processResult.message }}
              </p>
            </div>
          </Alert>

          <!-- Result Details -->
          <div class="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <p class="text-xs text-muted-foreground">Total Zones</p>
              <p class="text-lg font-semibold">{{ processResult.total_zones }}</p>
            </div>
            <div>
              <p class="text-xs text-muted-foreground">Filename</p>
              <p class="text-sm font-medium truncate">{{ processResult.filename }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup>
import { computed } from 'vue'
import { CheckCircle2, Download, Info, FileCode, Cpu, Loader2 } from 'lucide-vue-next'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Alert from '@/components/ui/Alert.vue'
import Label from '@/components/ui/Label.vue'
import FileUpload from '@/components/FileUpload.vue'

const props = defineProps({
  editedShapefile: {
    type: File,
    default: null
  },
  canGenerate: {
    type: Boolean,
    default: false
  },
  canUploadEdited: {
    type: Boolean,
    default: false
  },
  canProcess: {
    type: Boolean,
    default: false
  },
  hasGenerated: {
    type: Boolean,
    default: false
  },
  editingPhase: {
    type: String,
    default: null
  },
  processResult: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:editedShapefile', 'generate', 'download-for-edit', 'process'])

const editedShapefileModel = computed({
  get: () => props.editedShapefile,
  set: (value) => emit('update:editedShapefile', value)
})
</script>
