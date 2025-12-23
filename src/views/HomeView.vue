<template>
  <div class="space-y-8">
    <!-- Path Badge (if path chosen) -->
    <PathBadge
      v-if="workflowPath"
      :path="workflowPath"
      @reset="handleResetPath"
    />

    <!-- Dynamic Workflow Steps -->
    <WorkflowSteps
      :current-step="currentStepDisplay"
      :workflow-path="workflowPath"
      :total-steps="workflowPath === 'quick' ? 3 : 6"
    />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Workflow Panel -->
      <div class="lg:col-span-2 space-y-6">

        <!-- SECTION 1: Initial Upload (Always Visible) -->
        <InitialUploadSection
          v-model:spk-number="spkNumber"
          v-model:key-id="keyId"
          v-model:kml-file="kmlFile"
          v-model:excel-file="excelFile"
          :disabled="loading || workflowPath !== null"
          :completed="canChoosePath"
        />

        <!-- SECTION 2: Path Decision (Show after initial upload complete) -->
        <WorkflowPathSelector
          v-if="canChoosePath && !workflowPath"
          :can-choose="canChoosePath"
          :disabled="loading"
          @path-selected="handlePathSelected"
        />

        <!-- SECTION 3a: Quick Path Workflow (Conditional) -->
        <QuickPathSection
          v-if="workflowPath === 'quick'"
          :can-process="canProcessQuickPath"
          :process-result="processResult"
          :loading="loading"
          @process="handleProcess"
          @download="handleDownloadFinalUpload"
        />

        <!-- SECTION 3b: Edit Path Workflow (Conditional) -->
        <EditPathSection
          v-if="workflowPath === 'edit'"
          v-model:edited-shapefile="editedShapefileFile"
          :can-generate="canGenerateForEdit"
          :can-upload-edited="canUploadEditedShapefile"
          :can-process="canProcessEditPath"
          :has-generated="hasGeneratedShapefile"
          :editing-phase="editingPhase"
          :process-result="processResult"
          :loading="loading"
          @generate="handleGenerateShapefile"
          @download-for-edit="handleDownloadShapefileForEdit"
          @process="handleProcess"
        />

        <!-- SECTION 4: Final Upload (Show after processing complete) -->
        <FinalUploadSection
          v-if="hasProcessedFinal"
          :can-upload="canUploadToArcGIS"
          :loading="loading"
          @upload-to-arcgis="handleUploadToArcGIS"
          @download-manual="handleDownloadFinalUpload"
        />

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
        <QuickGuide :workflow-path="workflowPath" />

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
import { Loader2, Server } from 'lucide-vue-next'

import Card from '@/components/ui/Card.vue'
import WorkflowSteps from '@/components/WorkflowSteps.vue'
import PathBadge from '@/components/PathBadge.vue'
import WorkflowPathSelector from '@/components/WorkflowPathSelector.vue'
import InitialUploadSection from '@/components/InitialUploadSection.vue'
import QuickPathSection from '@/components/QuickPathSection.vue'
import EditPathSection from '@/components/EditPathSection.vue'
import FinalUploadSection from '@/components/FinalUploadSection.vue'
import SPKManagement from '@/components/SPKManagement.vue'
import QuickGuide from '@/components/QuickGuide.vue'

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
  processResult,
  workflowPath,
  editingPhase,
  hasGeneratedShapefile,
  hasProcessedFinal,
  canChoosePath,
  canProcessQuickPath,
  canGenerateForEdit,
  canUploadEditedShapefile,
  canProcessEditPath,
  canUploadToArcGIS,
  currentStepDisplay
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

const handlePathSelected = (path) => {
  store.chooseWorkflowPath(path)
}

const handleResetPath = () => {
  store.resetWorkflow()
}

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
