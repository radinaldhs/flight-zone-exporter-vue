import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import FileUpload from '@/components/FileUpload.vue'
import Button from '@/components/ui/Button.vue'
import Label from '@/components/ui/Label.vue'

describe('FileUpload', () => {
  describe('Initial Render', () => {
    it('should render with label', () => {
      const wrapper = mount(FileUpload, {
        props: {
          label: 'Upload KML',
          accept: '.zip'
        },
        global: {
          components: { Button, Label }
        }
      })

      expect(wrapper.text()).toContain('Upload KML')
    })

    it('should show upload prompt when no file selected', () => {
      const wrapper = mount(FileUpload, {
        props: {
          modelValue: null,
          accept: '.zip'
        },
        global: {
          components: { Button, Label }
        }
      })

      expect(wrapper.text()).toContain('Click to upload')
      expect(wrapper.text()).toContain('or drag and drop')
      expect(wrapper.text()).toContain('.zip')
    })

    it('should render hidden file input with correct accept attribute', () => {
      const wrapper = mount(FileUpload, {
        props: {
          modelValue: null,
          accept: '.xlsx,.xls'
        },
        global: {
          components: { Button, Label }
        }
      })

      const input = wrapper.find('input[type="file"]')
      expect(input.exists()).toBe(true)
      expect(input.classes()).toContain('hidden')
      expect(input.attributes('accept')).toBe('.xlsx,.xls')
    })
  })

  describe('File Selection', () => {
    it('should emit update:modelValue on file selection', async () => {
      const wrapper = mount(FileUpload, {
        props: {
          modelValue: null,
          accept: '.zip'
        },
        global: {
          components: { Button, Label }
        }
      })

      const file = new File(['content'], 'test.zip', { type: 'application/zip' })
      const input = wrapper.find('input[type="file"]')

      Object.defineProperty(input.element, 'files', {
        value: [file],
        writable: false
      })

      await input.trigger('change')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')[0][0]).toEqual(file)
    })

    it('should show file name and size when file selected', () => {
      const file = new File(['a'.repeat(1024)], 'myfile.zip', { type: 'application/zip' })
      const wrapper = mount(FileUpload, {
        props: {
          modelValue: file,
          accept: '.zip'
        },
        global: {
          components: { Button, Label }
        }
      })

      expect(wrapper.text()).toContain('myfile.zip')
      expect(wrapper.text()).toContain('KB')
    })

    it('should open file dialog when clicking upload area', async () => {
      const wrapper = mount(FileUpload, {
        props: {
          modelValue: null,
          accept: '.zip'
        },
        global: {
          components: { Button, Label }
        }
      })

      const input = wrapper.find('input[type="file"]')
      const clickSpy = vi.spyOn(input.element, 'click')

      const uploadArea = wrapper.find('.text-center')
      await uploadArea.trigger('click')

      expect(clickSpy).toHaveBeenCalled()
    })
  })

  describe('Drag and Drop', () => {
    it('should set isDragging to true on dragover', async () => {
      const wrapper = mount(FileUpload, {
        props: {
          modelValue: null,
          accept: '.zip'
        },
        global: {
          components: { Button, Label }
        }
      })

      const dropZone = wrapper.find('.relative.flex')
      await dropZone.trigger('dragover')

      expect(dropZone.classes()).toContain('border-primary')
      expect(dropZone.classes()).toContain('bg-primary/5')
    })

    it('should set isDragging to false on dragleave', async () => {
      const wrapper = mount(FileUpload, {
        props: {
          modelValue: null,
          accept: '.zip'
        },
        global: {
          components: { Button, Label }
        }
      })

      const dropZone = wrapper.find('.relative.flex')
      await dropZone.trigger('dragover')
      await dropZone.trigger('dragleave')

      expect(dropZone.classes()).not.toContain('border-primary')
    })

    it('should emit update:modelValue on file drop', async () => {
      const wrapper = mount(FileUpload, {
        props: {
          modelValue: null,
          accept: '.zip'
        },
        global: {
          components: { Button, Label }
        }
      })

      const file = new File(['content'], 'dropped.zip', { type: 'application/zip' })
      const dropZone = wrapper.find('.relative.flex')

      await dropZone.trigger('drop', {
        dataTransfer: {
          files: [file]
        }
      })

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')[0][0]).toEqual(file)
    })
  })

  describe('Clear File', () => {
    it('should emit null when clearing file', async () => {
      const file = new File(['content'], 'test.zip', { type: 'application/zip' })
      const wrapper = mount(FileUpload, {
        props: {
          modelValue: file,
          accept: '.zip'
        },
        global: {
          components: { Button, Label }
        }
      })

      const clearButton = wrapper.findComponent(Button)
      await clearButton.trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')[0][0]).toBeNull()
    })
  })

  describe('Disabled State', () => {
    it('should apply disabled styling when disabled', () => {
      const wrapper = mount(FileUpload, {
        props: {
          modelValue: null,
          accept: '.zip',
          disabled: true
        },
        global: {
          components: { Button, Label }
        }
      })

      const dropZone = wrapper.find('.relative.flex')
      expect(dropZone.classes()).toContain('opacity-50')
      expect(dropZone.classes()).toContain('cursor-not-allowed')
    })

    it('should disable file input when disabled', () => {
      const wrapper = mount(FileUpload, {
        props: {
          modelValue: null,
          accept: '.zip',
          disabled: true
        },
        global: {
          components: { Button, Label }
        }
      })

      const input = wrapper.find('input[type="file"]')
      expect(input.attributes('disabled')).toBeDefined()
    })

    it('should not open file dialog when clicking while disabled', async () => {
      const wrapper = mount(FileUpload, {
        props: {
          modelValue: null,
          accept: '.zip',
          disabled: true
        },
        global: {
          components: { Button, Label }
        }
      })

      const input = wrapper.find('input[type="file"]')
      const clickSpy = vi.spyOn(input.element, 'click')

      const uploadArea = wrapper.find('.text-center')
      await uploadArea.trigger('click')

      expect(clickSpy).not.toHaveBeenCalled()
    })

    it('should not handle drag events when disabled', async () => {
      const wrapper = mount(FileUpload, {
        props: {
          modelValue: null,
          accept: '.zip',
          disabled: true
        },
        global: {
          components: { Button, Label }
        }
      })

      const dropZone = wrapper.find('.relative.flex')
      await dropZone.trigger('dragover')

      expect(dropZone.classes()).not.toContain('border-primary')
    })

    it('should not emit on drop when disabled', async () => {
      const wrapper = mount(FileUpload, {
        props: {
          modelValue: null,
          accept: '.zip',
          disabled: true
        },
        global: {
          components: { Button, Label }
        }
      })

      const file = new File(['content'], 'test.zip', { type: 'application/zip' })
      const dropZone = wrapper.find('.relative.flex')

      await dropZone.trigger('drop', {
        dataTransfer: {
          files: [file]
        }
      })

      expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    })
  })

  describe('File Size Formatting', () => {
    it('should format bytes correctly', () => {
      const wrapper = mount(FileUpload, {
        props: {
          modelValue: new File(['a'.repeat(1024)], 'test.txt'),
          accept: '*'
        },
        global: {
          components: { Button, Label }
        }
      })

      expect(wrapper.text()).toContain('KB')
    })

    it('should format 0 bytes', () => {
      const wrapper = mount(FileUpload, {
        props: {
          modelValue: new File([], 'empty.txt'),
          accept: '*'
        },
        global: {
          components: { Button, Label }
        }
      })

      expect(wrapper.text()).toContain('0 Bytes')
    })

    it('should format larger files in MB', () => {
      const largeContent = 'a'.repeat(1024 * 1024 * 2) // 2MB
      const wrapper = mount(FileUpload, {
        props: {
          modelValue: new File([largeContent], 'large.zip'),
          accept: '.zip'
        },
        global: {
          components: { Button, Label }
        }
      })

      expect(wrapper.text()).toContain('MB')
    })
  })
})
