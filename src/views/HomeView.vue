<template>
  <div class="space-y-8">
    <!-- Workflow Steps -->
    <WorkflowSteps :current-step="currentStep" />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Workflow Panel -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Step 1: Upload Files -->
        <Card class="p-6">
          <div class="space-y-4">
            <div>
              <h2 class="text-2xl font-bold mb-2">Upload Files & Configuration</h2>
              <p class="text-muted-foreground">Start by uploading your KML and Excel files</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>SPK Number *</Label>
                <Input
                  v-model="spkNumber"
                  placeholder="Enter SPK number"
                  class="mt-2"
                  :disabled="loading"
                />
              </div>

              <div>
                <Label>Key ID *</Label>
                <Input
                  v-model="keyId"
                  placeholder="Enter Key ID"
                  class="mt-2"
                  :disabled="loading"
                />
              </div>
            </div>

            <FileUpload
              v-model="kmlFile"
              label="KML ZIP File *"
              accept=".zip"
              :disabled="loading"
            />

            <FileUpload
              v-model="excelFile"
              label="Excel File *"
              accept=".xlsx,.xls,.xlsm"
              :disabled="loading"
            />

            <FileUpload
              v-model="editedShapefileFile"
              label="Edited Shapefile (Optional)"
              accept=".zip"
              :disabled="loading"
            />
          </div>
        </Card>

        <!-- Step 2: Generate Shapefile for QGIS -->
        <Card class="p-6">
          <div class="space-y-4">
            <div>
              <h3 class="text-lg font-semibold mb-2">Generate Shapefile for QGIS Editing</h3>
              <p class="text-sm text-muted-foreground">
                Generate a shapefile from KML for manual editing in QGIS (optional step)
              </p>
            </div>

            <div class="flex flex-wrap gap-2">
              <Button
                @click="handleGenerateShapefile"
                :disabled="!canGenerateShapefile || loading"
              >
                <FileType class="h-4 w-4" />
                Generate Shapefile
              </Button>

              <Button
                @click="handleDownloadShapefileForEdit"
                :disabled="loading"
                variant="outline"
              >
                <Download class="h-4 w-4" />
                Download for Edit
              </Button>
            </div>
          </div>
        </Card>

        <!-- Step 3: Process Complete Workflow -->
        <Card class="p-6">
          <div class="space-y-4">
            <div>
              <h3 class="text-lg font-semibold mb-2">Process Files</h3>
              <p class="text-sm text-muted-foreground">
                Process KML and Excel files to generate final upload shapefile
              </p>
            </div>

            <div class="flex flex-wrap gap-2">
              <Button
                @click="handleProcess"
                :disabled="!canProcess || loading"
                size="lg"
              >
                <Play class="h-4 w-4" />
                Process Files
              </Button>

              <Button
                @click="handleDownloadFinalUpload"
                :disabled="loading"
                variant="outline"
              >
                <Download class="h-4 w-4" />
                Download Final ZIP
              </Button>
            </div>

            <div v-if="processResult" class="mt-4 p-4 bg-muted rounded-lg">
              <h4 class="font-semibold mb-2">Process Result</h4>
              <div class="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span class="text-muted-foreground">Total Zones:</span>
                  <span class="ml-2 font-medium">{{ processResult.total_zones }}</span>
                </div>
                <div>
                  <span class="text-muted-foreground">Columns:</span>
                  <span class="ml-2 font-medium">{{ processResult.columns?.length || 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <!-- Step 4: Upload to ArcGIS -->
        <Card class="p-6">
          <div class="space-y-4">
            <div>
              <h3 class="text-lg font-semibold mb-2">Upload to ArcGIS</h3>
              <p class="text-sm text-muted-foreground">
                Upload processed shapefile to ArcGIS Feature Server
              </p>
            </div>

            <Button
              @click="handleUploadToArcGIS"
              :disabled="!spkNumber || !keyId || loading"
              variant="default"
              size="lg"
            >
              <Upload class="h-4 w-4" />
              Upload to ArcGIS
            </Button>
          </div>
        </Card>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Loading Indicator -->
        <Card v-if="loading" class="p-6">
          <div class="flex items-center gap-3">
            <Loader2 class="h-5 w-5 animate-spin text-primary" />
            <span class="text-sm font-medium">Processing...</span>
          </div>
        </Card>

        <!-- SPK Management -->
        <SPKManagement />

        <!-- Quick Guide -->
        <Card class="p-6">
          <div class="space-y-3">
            <h3 class="font-semibold flex items-center gap-2">
              <BookOpen class="h-5 w-5" />
              Quick Guide
            </h3>
            <ol class="text-sm space-y-2 list-decimal list-inside text-muted-foreground">
              <li>Upload KML ZIP and Excel file</li>
              <li>Enter SPK number and Key ID</li>
              <li>(Optional) Generate & edit shapefile in QGIS</li>
              <li>Process files to create final ZIP</li>
              <li>Upload to ArcGIS Feature Server</li>
            </ol>
          </div>
        </Card>

        <!-- API Status -->
        <Card class="p-6">
          <div class="space-y-3">
            <h3 class="font-semibold flex items-center gap-2">
              <Server class="h-5 w-5" />
              API Status
            </h3>
            <div class="flex items-center gap-2">
              <div
                class="h-2 w-2 rounded-full"
                :class="apiHealthy ? 'bg-green-500' : 'bg-red-500'"
              />
              <span class="text-sm">
                {{ apiHealthy ? 'Connected' : 'Disconnected' }}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import {
  Play,
  Upload,
  Download,
  FileType,
  Loader2,
  BookOpen,
  Server
} from 'lucide-vue-next'

import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import FileUpload from '@/components/FileUpload.vue'
import WorkflowSteps from '@/components/WorkflowSteps.vue'
import SPKManagement from '@/components/SPKManagement.vue'

import { useFlightZoneStore } from '@/stores/flightZone'
import { flightZoneAPI } from '@/api/flightZone'

const store = useFlightZoneStore()

const {
  kmlFile,
  excelFile,
  editedShapefileFile,
  spkNumber,
  keyId,
  loading,
  currentStep,
  processResult,
  canProcess,
  canGenerateShapefile
} = storeToRefs(store)

const apiHealthy = ref(false)

onMounted(async () => {
  try {
    await flightZoneAPI.healthCheck()
    apiHealthy.value = true
  } catch (error) {
    apiHealthy.value = false
  }
})

const handleGenerateShapefile = async () => {
  await store.generateShapefile()
}

const handleProcess = async () => {
  await store.processFiles()
}

const handleUploadToArcGIS = async () => {
  await store.uploadToArcGIS()
}

const handleDownloadShapefileForEdit = async () => {
  await store.downloadShapefileForEdit()
}

const handleDownloadFinalUpload = async () => {
  await store.downloadFinalUpload()
}
</script>
