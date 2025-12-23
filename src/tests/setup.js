import { vi } from 'vitest'
import { config } from '@vue/test-utils'

// Mock lucide-vue-next icons
vi.mock('lucide-vue-next', () => ({
  Check: { name: 'Check', template: '<div>Check</div>' },
  Zap: { name: 'Zap', template: '<div>Zap</div>' },
  Edit3: { name: 'Edit3', template: '<div>Edit3</div>' },
  Upload: { name: 'Upload', template: '<div>Upload</div>' },
  Download: { name: 'Download', template: '<div>Download</div>' },
  Loader2: { name: 'Loader2', template: '<div>Loader2</div>' },
  FileCode: { name: 'FileCode', template: '<div>FileCode</div>' },
  CheckCircle2: { name: 'CheckCircle2', template: '<div>CheckCircle2</div>' },
  Info: { name: 'Info', template: '<div>Info</div>' },
  Server: { name: 'Server', template: '<div>Server</div>' },
  HelpCircle: { name: 'HelpCircle', template: '<div>HelpCircle</div>' },
  RotateCcw: { name: 'RotateCcw', template: '<div>RotateCcw</div>' },
  Cpu: { name: 'Cpu', template: '<div>Cpu</div>' },
  UploadCloud: { name: 'UploadCloud', template: '<div>UploadCloud</div>' },
  FileCheck: { name: 'FileCheck', template: '<div>FileCheck</div>' },
  X: { name: 'X', template: '<div>X</div>' },
  ArrowRight: { name: 'ArrowRight', template: '<div>ArrowRight</div>' }
}))

// Global test config
config.global.mocks = {
  $t: (key) => key // Mock i18n if used
}
