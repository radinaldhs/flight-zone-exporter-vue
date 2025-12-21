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

  const loading = ref(false)
  const error = ref(null)
  const successMessage = ref(null)

  const currentStep = ref(1)
  const processResult = ref(null)
  const spkCheckResult = ref(null)

  // Computed
  const canProcess = computed(() => {
    return kmlFile.value && excelFile.value && spkNumber.value && keyId.value
  })

  const canGenerateShapefile = computed(() => {
    return kmlFile.value && spkNumber.value
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
  }

  const setSPKNumber = (value) => {
    spkNumber.value = value
    error.value = null
  }

  const setKeyId = (value) => {
    keyId.value = value
    error.value = null
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

      const response = await flightZoneAPI.uploadToArcGIS(formData)
      successMessage.value = response.data.message
      currentStep.value = 4
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
    loading,
    error,
    successMessage,
    currentStep,
    processResult,
    spkCheckResult,

    // Computed
    canProcess,
    canGenerateShapefile,

    // Actions
    setKmlFile,
    setExcelFile,
    setEditedShapefileFile,
    setSPKNumber,
    setKeyId,
    clearError,
    clearSuccess,
    reset,
    checkSPK,
    deleteSPK,
    generateShapefile,
    processFiles,
    uploadToArcGIS,
    downloadShapefileForEdit,
    downloadFinalUpload
  }
})
