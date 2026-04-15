import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useFlightZoneStore } from '@/stores/flightZone'
import apiClient from '@/api/client'
import MockAdapter from 'axios-mock-adapter'
import {
  mockGenerateShapefileResponse,
  mockProcessResponse,
  mockUploadToArcGISResponse
} from '../../fixtures/mockApiResponses'
import { createMockFile } from '../../fixtures/mockFiles'

describe('FlightZone Store', () => {
  let store
  let mockAxios

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useFlightZoneStore()
    mockAxios = new MockAdapter(apiClient)
  })

  afterEach(() => {
    mockAxios.reset()
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      expect(store.kmlFile).toBeNull()
      expect(store.excelFile).toBeNull()
      expect(store.editedShapefileFile).toBeNull()
      expect(store.spkNumber).toBe('')
      expect(store.keyId).toBe('')
      expect(store.workflowPath).toBeNull()
      expect(store.loading).toBe(false)
      expect(store.quickPathStep).toBe(1)
      expect(store.editPathStep).toBe(1)
    })

    it('should have correct default values for height, width, and speed', () => {
      expect(store.height).toBe(2.5)
      expect(store.width).toBe(5)
      expect(store.speed).toBe(3.5)
    })
  })

  describe('Computed Properties', () => {
    it('canChoosePath should be falsy without all required files', () => {
      expect(store.canChoosePath).toBeFalsy()

      store.setKmlFile(createMockFile('test.zip'))
      expect(store.canChoosePath).toBeFalsy()

      store.setExcelFile(createMockFile('test.xlsx', 1024, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'))
      expect(store.canChoosePath).toBeFalsy()

      store.setSPKNumber('SPK123')
      expect(store.canChoosePath).toBeFalsy()

      store.setKeyId('KEY456')
      expect(store.canChoosePath).toBeTruthy()
    })

    it('canProcessQuickPath should validate quick path requirements', () => {
      expect(store.canProcessQuickPath).toBeFalsy()

      store.setKmlFile(createMockFile('test.zip'))
      store.setExcelFile(createMockFile('test.xlsx', 1024, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'))
      store.setSPKNumber('SPK123')
      store.setKeyId('KEY456')
      store.chooseWorkflowPath('quick')

      expect(store.canProcessQuickPath).toBeTruthy()
    })

    it('canProcessEditPath should validate edit path requirements', () => {
      expect(store.canProcessEditPath).toBeFalsy()

      store.setKmlFile(createMockFile('test.zip'))
      store.setExcelFile(createMockFile('test.xlsx', 1024, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'))
      store.setSPKNumber('SPK123')
      store.setKeyId('KEY456')
      store.chooseWorkflowPath('edit')
      store.setEditedShapefileFile(createMockFile('edited.zip'))

      expect(store.canProcessEditPath).toBeTruthy()
    })

    it('currentStepDisplay should return correct step based on path', () => {
      expect(store.currentStepDisplay).toBe(1)

      store.chooseWorkflowPath('quick')
      expect(store.currentStepDisplay).toBe(2)

      store.chooseWorkflowPath('edit')
      expect(store.currentStepDisplay).toBe(2)
    })
  })

  describe('Actions', () => {
    describe('chooseWorkflowPath', () => {
      it('should set quick path correctly', () => {
        store.chooseWorkflowPath('quick')

        expect(store.workflowPath).toBe('quick')
        expect(store.quickPathStep).toBe(2)
        expect(store.showPathDecision).toBe(false)
      })

      it('should set edit path correctly', () => {
        store.chooseWorkflowPath('edit')

        expect(store.workflowPath).toBe('edit')
        expect(store.editPathStep).toBe(2)
        expect(store.showPathDecision).toBe(false)
      })
    })

    describe('resetWorkflow', () => {
      it('should reset workflow state', () => {
        store.chooseWorkflowPath('quick')
        store.hasProcessedFinal = true
        store.quickPathStep = 3

        store.resetWorkflow()

        expect(store.workflowPath).toBeNull()
        expect(store.hasProcessedFinal).toBe(false)
        expect(store.quickPathStep).toBe(1)
      })

      it('should reset height, width, and speed to defaults', () => {
        store.height = 10
        store.width = 20
        store.speed = 15

        store.resetWorkflow()

        expect(store.height).toBe(2.5)
        expect(store.width).toBe(5)
        expect(store.speed).toBe(3.5)
      })
    })

    describe('reset', () => {
      it('should reset height, width, and speed to defaults', () => {
        store.height = 10
        store.width = 20
        store.speed = 15

        store.reset()

        expect(store.height).toBe(2.5)
        expect(store.width).toBe(5)
        expect(store.speed).toBe(3.5)
      })
    })

    describe('generateShapefile', () => {
      it('should generate shapefile successfully', async () => {
        mockAxios.onPost('/api/kml/generate-shapefile').reply(200, mockGenerateShapefileResponse)

        store.setKmlFile(createMockFile('test.zip'))
        store.setSPKNumber('SPK123')
        store.chooseWorkflowPath('edit')

        await store.generateShapefile()

        expect(store.hasGeneratedShapefile).toBe(true)
        expect(store.editingPhase).toBe('generated')
        expect(store.editPathStep).toBe(3)
      })

      it('should handle generation error', async () => {
        mockAxios.onPost('/api/kml/generate-shapefile').reply(500, { detail: 'Generation failed' })

        store.setKmlFile(createMockFile('test.zip'))
        store.setSPKNumber('SPK123')
        store.chooseWorkflowPath('edit')

        await expect(store.generateShapefile()).rejects.toThrow()
        expect(store.error).toBeTruthy()
      })
    })

    describe('processFiles', () => {
      it('should process files for quick path', async () => {
        mockAxios.onPost('/api/kml/process').reply(200, mockProcessResponse)

        store.setKmlFile(createMockFile('test.zip'))
        store.setExcelFile(createMockFile('test.xlsx', 1024, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'))
        store.setSPKNumber('SPK123')
        store.setKeyId('KEY456')
        store.chooseWorkflowPath('quick')

        await store.processFiles()

        expect(store.hasProcessedFinal).toBe(true)
        expect(store.quickPathStep).toBe(3)
        expect(store.processResult).toBeDefined()
      })

      it('should process files for edit path with edited shapefile', async () => {
        mockAxios.onPost('/api/kml/process').reply(200, mockProcessResponse)

        store.setKmlFile(createMockFile('test.zip'))
        store.setExcelFile(createMockFile('test.xlsx', 1024, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'))
        store.setSPKNumber('SPK123')
        store.setKeyId('KEY456')
        store.chooseWorkflowPath('edit')
        store.setEditedShapefileFile(createMockFile('edited.zip'))

        await store.processFiles()

        expect(store.hasProcessedFinal).toBe(true)
        expect(store.editPathStep).toBe(6)
      })
    })

    describe('uploadToArcGIS', () => {
      it('should upload to ArcGIS successfully', async () => {
        mockAxios.onPost('/api/kml/upload-to-arcgis').reply(200, mockUploadToArcGISResponse)

        store.hasProcessedFinal = true
        store.setSPKNumber('SPK123')
        store.setKeyId('KEY456')

        await store.uploadToArcGIS()

        expect(store.successMessage).toBeTruthy()
        expect(store.successMessage).toContain('Upload complete')
      })

      it('should handle upload error', async () => {
        mockAxios.onPost('/api/kml/upload-to-arcgis').reply(500, { detail: 'Upload failed' })

        store.hasProcessedFinal = true
        store.setSPKNumber('SPK123')
        store.setKeyId('KEY456')

        await expect(store.uploadToArcGIS()).rejects.toThrow()
        expect(store.error).toBeTruthy()
      })

      it('should append height, width, speed to FormData when workflowPath is edit', async () => {
        const capturedData = {}
        mockAxios.onPost('/api/kml/upload-to-arcgis').reply((config) => {
          for (const [key, value] of config.data.entries()) {
            capturedData[key] = value
          }
          return [200, mockUploadToArcGISResponse]
        })

        store.setSPKNumber('SPK123')
        store.setKeyId('KEY456')
        store.chooseWorkflowPath('edit')
        store.height = 3.0
        store.width = 6.0
        store.speed = 4.5

        await store.uploadToArcGIS()

        expect(capturedData['height']).toBe('3')
        expect(capturedData['width']).toBe('6')
        expect(capturedData['speed']).toBe('4.5')
      })

      it('should NOT append height, width, speed to FormData when workflowPath is quick', async () => {
        const capturedData = {}
        mockAxios.onPost('/api/kml/upload-to-arcgis').reply((config) => {
          for (const [key, value] of config.data.entries()) {
            capturedData[key] = value
          }
          return [200, mockUploadToArcGISResponse]
        })

        store.setSPKNumber('SPK123')
        store.setKeyId('KEY456')
        store.chooseWorkflowPath('quick')

        await store.uploadToArcGIS()

        expect(capturedData['height']).toBeUndefined()
        expect(capturedData['width']).toBeUndefined()
        expect(capturedData['speed']).toBeUndefined()
      })

      it('should NOT append height, width, speed when workflowPath is null', async () => {
        const capturedData = {}
        mockAxios.onPost('/api/kml/upload-to-arcgis').reply((config) => {
          for (const [key, value] of config.data.entries()) {
            capturedData[key] = value
          }
          return [200, mockUploadToArcGISResponse]
        })

        store.setSPKNumber('SPK123')
        store.setKeyId('KEY456')

        await store.uploadToArcGIS()

        expect(capturedData['height']).toBeUndefined()
        expect(capturedData['width']).toBeUndefined()
        expect(capturedData['speed']).toBeUndefined()
      })
    })

    describe('File setters', () => {
      it('should set KML file', () => {
        const file = createMockFile('zones.zip')
        store.setKmlFile(file)
        expect(store.kmlFile).toBe(file)
      })

      it('should set Excel file', () => {
        const file = createMockFile('data.xlsx', 1024, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        store.setExcelFile(file)
        expect(store.excelFile).toBe(file)
      })

      it('should set edited shapefile', () => {
        const file = createMockFile('edited.zip')
        store.chooseWorkflowPath('edit')
        store.setEditedShapefileFile(file)
        expect(store.editedShapefileFile).toBe(file)
        expect(store.editPathStep).toBe(5)
      })

      it('should set SPK number', () => {
        store.setSPKNumber('SPK123')
        expect(store.spkNumber).toBe('SPK123')
      })

      it('should set Key ID', () => {
        store.setKeyId('KEY456')
        expect(store.keyId).toBe('KEY456')
      })
    })
  })
})
