import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { flightZoneAPI } from '@/api/flightZone'

export const useFlightZoneStore = defineStore('flightZone', () => {
  // State
  const kmlFile = ref(null)
  const excelFile = ref(null)
  const editedShapefileFile = ref(null)
  const spkNumber = ref('')
  const keyId = ref('')
  const height = ref(2.5)
  const width = ref(5)
  const speed = ref(3.5)

  // Cascade dropdown state
  const regions = ref([])
  const districts = ref([])
  const petaks = ref([])
  const spkNumbers = ref([])
  const selectedRegion = ref('')
  const selectedDistrict = ref('')
  const activity = ref('')
  const cascadeLoading = ref(false)

  const loading = ref(false)
  const error = ref(null)
  const successMessage = ref(null)

  const currentStep = ref(1)
  const processResult = ref(null)
  const spkCheckResult = ref(null)

  // Workflow path tracking
  const workflowPath = ref(null) // null | 'quick' | 'edit'
  const editingPhase = ref(null) // null | 'generated' | 'downloaded' | 'uploaded'
  const showPathDecision = ref(false)
  const hasGeneratedShapefile = ref(false)
  const hasProcessedFinal = ref(false)
  const arcgisUploadDone = ref(false)
  const quickPathStep = ref(1) // 1: upload, 2: process, 3: final
  const editPathStep = ref(1) // 1-6: upload, generate, download, upload-edited, process, final

  // Computed
  const canProcess = computed(() => {
    return kmlFile.value && excelFile.value && spkNumber.value && keyId.value
  })

  const canGenerateShapefile = computed(() => {
    return kmlFile.value && spkNumber.value
  })

  const canChoosePath = computed(() => {
    return kmlFile.value && excelFile.value && spkNumber.value && keyId.value
  })

  const canProcessQuickPath = computed(() => {
    return workflowPath.value === 'quick' && canProcess.value
  })

  const canGenerateForEdit = computed(() => {
    return workflowPath.value === 'edit' && kmlFile.value && spkNumber.value
  })

  const canUploadEditedShapefile = computed(() => {
    return workflowPath.value === 'edit' && hasGeneratedShapefile.value
  })

  const canProcessEditPath = computed(() => {
    return (
      workflowPath.value === 'edit' &&
      editedShapefileFile.value &&
      excelFile.value &&
      spkNumber.value &&
      keyId.value
    )
  })

  const canUploadToArcGIS = computed(() => {
    return hasProcessedFinal.value && spkNumber.value && keyId.value
  })

  const currentStepDisplay = computed(() => {
    if (!workflowPath.value) return 1
    if (workflowPath.value === 'quick') return quickPathStep.value
    return editPathStep.value
  })

  // Actions
  const setKmlFile = (file) => {
    kmlFile.value = file
    error.value = null
  }

  const setExcelFile = (file) => {
    excelFile.value = file
    error.value = null
  }

  const setEditedShapefileFile = (file) => {
    editedShapefileFile.value = file
    error.value = null

    // If in edit path and file uploaded, advance to process step
    if (file && workflowPath.value === 'edit') {
      editingPhase.value = 'uploaded'
      editPathStep.value = 5
    }
  }

  const setSPKNumber = (value) => {
    spkNumber.value = value
    error.value = null
  }

  const setKeyId = (value) => {
    keyId.value = value
    error.value = null
  }

  const fetchRegions = async () => {
    cascadeLoading.value = true
    try {
      const response = await flightZoneAPI.getRegions()
      regions.value = response.data.values
    } catch (err) {
      error.value = err.message
    } finally {
      cascadeLoading.value = false
    }
  }

  const selectRegion = async (value) => {
    selectedRegion.value = value
    selectedDistrict.value = ''
    keyId.value = ''
    spkNumber.value = ''
    activity.value = ''
    districts.value = []
    petaks.value = []
    spkNumbers.value = []
    if (!value) return
    cascadeLoading.value = true
    try {
      const response = await flightZoneAPI.getDistricts(value)
      districts.value = response.data.values
    } catch (err) {
      error.value = err.message
    } finally {
      cascadeLoading.value = false
    }
  }

  const selectDistrict = async (value) => {
    selectedDistrict.value = value
    keyId.value = ''
    spkNumber.value = ''
    activity.value = ''
    petaks.value = []
    spkNumbers.value = []
    if (!value) return
    cascadeLoading.value = true
    try {
      const response = await flightZoneAPI.getPetaks(value)
      petaks.value = response.data.values
    } catch (err) {
      error.value = err.message
    } finally {
      cascadeLoading.value = false
    }
  }

  const selectPetak = async (value) => {
    keyId.value = value
    spkNumber.value = ''
    activity.value = ''
    spkNumbers.value = []
    if (!value) return
    cascadeLoading.value = true
    try {
      const response = await flightZoneAPI.getSpkNumbers(value)
      spkNumbers.value = response.data.values
    } catch (err) {
      error.value = err.message
    } finally {
      cascadeLoading.value = false
    }
  }

  const selectSpkNumber = (value) => {
    spkNumber.value = value
    const match = spkNumbers.value.find(s => s.spk_number === value)
    activity.value = match ? match.activity : ''
  }

  const clearError = () => {
    error.value = null
  }

  const clearSuccess = () => {
    successMessage.value = null
  }

  const reset = () => {
    kmlFile.value = null
    excelFile.value = null
    editedShapefileFile.value = null
    spkNumber.value = ''
    keyId.value = ''
    loading.value = false
    error.value = null
    successMessage.value = null
    currentStep.value = 1
    processResult.value = null
    spkCheckResult.value = null

    // Reset cascade state
    regions.value = []
    districts.value = []
    petaks.value = []
    spkNumbers.value = []
    selectedRegion.value = ''
    selectedDistrict.value = ''
    activity.value = ''
    cascadeLoading.value = false

    height.value = 2.5
    width.value = 5
    speed.value = 3.5

    // Reset workflow path state
    workflowPath.value = null
    editingPhase.value = null
    showPathDecision.value = false
    hasGeneratedShapefile.value = false
    hasProcessedFinal.value = false
    arcgisUploadDone.value = false
    quickPathStep.value = 1
    editPathStep.value = 1
  }

  const chooseWorkflowPath = (path) => {
    workflowPath.value = path
    showPathDecision.value = false
    error.value = null

    if (path === 'quick') {
      quickPathStep.value = 2 // Move to process step
    } else if (path === 'edit') {
      editPathStep.value = 2 // Move to generate step
    }
  }

  const resetWorkflow = () => {
    workflowPath.value = null
    editingPhase.value = null
    showPathDecision.value = false
    hasGeneratedShapefile.value = false
    hasProcessedFinal.value = false
    quickPathStep.value = 1
    editPathStep.value = 1
    editedShapefileFile.value = null
    processResult.value = null
    currentStep.value = 1
    error.value = null
    successMessage.value = null
    height.value = 2.5
    width.value = 5
    speed.value = 3.5
    arcgisUploadDone.value = false
  }

  const checkSPK = async () => {
    if (!spkNumber.value) {
      error.value = 'Please enter SPK number'
      return
    }

    loading.value = true
    error.value = null

    try {
      const response = await flightZoneAPI.checkSPK(spkNumber.value)
      spkCheckResult.value = response.data

      if (response.data.exists) {
        successMessage.value = `Found ${response.data.count} existing record(s) for SPK ${spkNumber.value}`
      } else {
        successMessage.value = `No existing records found for SPK ${spkNumber.value}`
      }

      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteSPK = async () => {
    if (!spkNumber.value) {
      error.value = 'Please enter SPK number'
      return
    }

    loading.value = true
    error.value = null

    try {
      const response = await flightZoneAPI.deleteSPK(spkNumber.value)
      successMessage.value = response.data.message
      spkCheckResult.value = null
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const generateShapefile = async () => {
    if (!canGenerateShapefile.value) {
      error.value = 'Please upload KML ZIP and enter SPK number'
      return
    }

    loading.value = true
    error.value = null

    try {
      const formData = new FormData()
      formData.append('kml_zip', kmlFile.value)
      formData.append('spk_number', spkNumber.value)

      const response = await flightZoneAPI.generateShapefile(formData)
      successMessage.value = response.data.message
      currentStep.value = 2

      // Update workflow state
      hasGeneratedShapefile.value = true
      editingPhase.value = 'generated'
      if (workflowPath.value === 'edit') {
        editPathStep.value = 3
      }

      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const processFiles = async () => {
    if (!canProcess.value) {
      error.value = 'Please upload all required files and enter SPK number and Key ID'
      return
    }

    loading.value = true
    error.value = null

    try {
      const formData = new FormData()
      formData.append('kml_zip', kmlFile.value)
      formData.append('excel_file', excelFile.value)
      formData.append('spk_number', spkNumber.value)
      formData.append('key_id', keyId.value)

      if (editedShapefileFile.value) {
        formData.append('edited_shapefile', editedShapefileFile.value)
      }

      const response = await flightZoneAPI.processComplete(formData)
      processResult.value = response.data
      successMessage.value = response.data.message
      currentStep.value = 3

      // Update workflow state
      hasProcessedFinal.value = true
      if (workflowPath.value === 'quick') {
        quickPathStep.value = 3
      } else if (workflowPath.value === 'edit') {
        editPathStep.value = 6
      }

      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const uploadToArcGIS = async () => {
    if (!spkNumber.value || !keyId.value) {
      error.value = 'Please enter SPK number and Key ID'
      return
    }

    loading.value = true
    error.value = null

    try {
      const formData = new FormData()
      formData.append('spk_number', spkNumber.value)
      formData.append('key_id', keyId.value)

      if (workflowPath.value === 'edit') {
        formData.append('height', height.value)
        formData.append('width', width.value)
        formData.append('speed', speed.value)
      }

      const response = await flightZoneAPI.uploadToArcGIS(formData)
      successMessage.value = response.data.message
      currentStep.value = 4
      arcgisUploadDone.value = true
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const downloadShapefileForEdit = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await flightZoneAPI.downloadShapefileForEdit()
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'zones_for_edit.zip')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      successMessage.value = 'Shapefile downloaded successfully'

      // Update editing phase
      editingPhase.value = 'downloaded'
      // Stay on step 3, user will manually edit
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const downloadFinalUpload = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await flightZoneAPI.downloadFinalUpload()
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'final_upload.zip')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      successMessage.value = 'Final upload ZIP downloaded successfully'
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    kmlFile,
    excelFile,
    editedShapefileFile,
    spkNumber,
    keyId,
    height,
    width,
    speed,
    loading,
    error,
    successMessage,
    currentStep,
    processResult,
    spkCheckResult,

    // Cascade dropdown state
    regions,
    districts,
    petaks,
    spkNumbers,
    selectedRegion,
    selectedDistrict,
    activity,
    cascadeLoading,

    // Workflow path state
    workflowPath,
    editingPhase,
    showPathDecision,
    hasGeneratedShapefile,
    hasProcessedFinal,
    arcgisUploadDone,
    quickPathStep,
    editPathStep,

    // Computed
    canProcess,
    canGenerateShapefile,
    canChoosePath,
    canProcessQuickPath,
    canGenerateForEdit,
    canUploadEditedShapefile,
    canProcessEditPath,
    canUploadToArcGIS,
    currentStepDisplay,

    // Actions
    setKmlFile,
    setExcelFile,
    setEditedShapefileFile,
    setSPKNumber,
    setKeyId,
    fetchRegions,
    selectRegion,
    selectDistrict,
    selectPetak,
    selectSpkNumber,
    clearError,
    clearSuccess,
    reset,
    chooseWorkflowPath,
    resetWorkflow,
    checkSPK,
    deleteSPK,
    generateShapefile,
    processFiles,
    uploadToArcGIS,
    downloadShapefileForEdit,
    downloadFinalUpload
  }
})
