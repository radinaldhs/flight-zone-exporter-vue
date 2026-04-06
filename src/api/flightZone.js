import apiClient from './client'

export const flightZoneAPI = {
  // Health check
  healthCheck: () => apiClient.get('/api/health'),

  // Dashboard cascading queries
  getRegions: () => apiClient.get('/api/arcgis/dashboard/regions'),
  getDistricts: (region) => apiClient.get('/api/arcgis/dashboard/districts', { params: { region } }),
  getPetaks: (district) => apiClient.get('/api/arcgis/dashboard/petaks', { params: { district } }),
  getSpkNumbers: (petak) => apiClient.get('/api/arcgis/dashboard/spk-numbers', { params: { petak } }),

  // SPK operations
  checkSPK: (spkNumber) =>
    apiClient.post('/api/arcgis/spk/check', { spk_number: spkNumber }),

  deleteSPK: (spkNumber) =>
    apiClient.delete('/api/arcgis/spk', { data: { spk_number: spkNumber } }),

  // File processing
  generateShapefile: (formData) =>
    apiClient.post('/api/kml/generate-shapefile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  processComplete: (formData) =>
    apiClient.post('/api/kml/process', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  uploadToArcGIS: (formData) =>
    apiClient.post('/api/kml/upload-to-arcgis', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  // Downloads
  downloadShapefileForEdit: () =>
    apiClient.get('/api/kml/download/shapefile-for-edit', {
      responseType: 'blob'
    }),

  downloadFinalUpload: () =>
    apiClient.get('/api/kml/download/final-upload', {
      responseType: 'blob'
    })
}
