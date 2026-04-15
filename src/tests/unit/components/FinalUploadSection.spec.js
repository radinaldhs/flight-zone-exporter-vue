import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FinalUploadSection from '@/components/FinalUploadSection.vue'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Label from '@/components/ui/Label.vue'
import Alert from '@/components/ui/Alert.vue'

const defaultProps = {
  canUpload: true,
  loading: false,
  workflowPath: null,
  height: 2.5,
  width: 5,
  speed: 3.5
}

const mountComponent = (props = {}) =>
  mount(FinalUploadSection, {
    props: { ...defaultProps, ...props },
    global: {
      components: { Card, Button, Label, Alert }
    }
  })

describe('FinalUploadSection', () => {
  describe('Flight Parameters visibility', () => {
    it('shows the Flight Parameters section when workflowPath is edit', () => {
      const wrapper = mountComponent({ workflowPath: 'edit' })
      expect(wrapper.text()).toContain('Flight Parameters')
    })

    it('hides the Flight Parameters section when workflowPath is quick', () => {
      const wrapper = mountComponent({ workflowPath: 'quick' })
      expect(wrapper.text()).not.toContain('Flight Parameters')
    })

    it('hides the Flight Parameters section when workflowPath is null', () => {
      const wrapper = mountComponent({ workflowPath: null })
      expect(wrapper.text()).not.toContain('Flight Parameters')
    })
  })

  describe('Input default values', () => {
    it('displays the default height value', () => {
      const wrapper = mountComponent({ workflowPath: 'edit', height: 2.5 })
      const heightInput = wrapper.find('#height')
      expect(parseFloat(heightInput.element.value)).toBe(2.5)
    })

    it('displays the default width value', () => {
      const wrapper = mountComponent({ workflowPath: 'edit', width: 5 })
      const widthInput = wrapper.find('#width')
      expect(parseFloat(widthInput.element.value)).toBe(5)
    })

    it('displays the default speed value', () => {
      const wrapper = mountComponent({ workflowPath: 'edit', speed: 3.5 })
      const speedInput = wrapper.find('#speed')
      expect(parseFloat(speedInput.element.value)).toBe(3.5)
    })

    it('reflects custom prop values in the inputs', () => {
      const wrapper = mountComponent({ workflowPath: 'edit', height: 4.0, width: 8.0, speed: 6.0 })
      expect(parseFloat(wrapper.find('#height').element.value)).toBe(4.0)
      expect(parseFloat(wrapper.find('#width').element.value)).toBe(8.0)
      expect(parseFloat(wrapper.find('#speed').element.value)).toBe(6.0)
    })
  })

  describe('handleNumberInput - valid input', () => {
    it('emits update:height with the parsed value for a valid positive number', async () => {
      const wrapper = mountComponent({ workflowPath: 'edit' })
      const input = wrapper.find('#height')
      await input.setValue('3.5')
      await input.trigger('input')
      expect(wrapper.emitted('update:height')).toBeTruthy()
      expect(wrapper.emitted('update:height')[0][0]).toBe(3.5)
    })

    it('emits update:width with the parsed value for a valid positive number', async () => {
      const wrapper = mountComponent({ workflowPath: 'edit' })
      const input = wrapper.find('#width')
      await input.setValue('7')
      await input.trigger('input')
      expect(wrapper.emitted('update:width')).toBeTruthy()
      expect(wrapper.emitted('update:width')[0][0]).toBe(7)
    })

    it('emits update:speed with the parsed value for a valid positive number', async () => {
      const wrapper = mountComponent({ workflowPath: 'edit' })
      const input = wrapper.find('#speed')
      await input.setValue('5.0')
      await input.trigger('input')
      expect(wrapper.emitted('update:speed')).toBeTruthy()
      expect(wrapper.emitted('update:speed')[0][0]).toBe(5.0)
    })
  })

  describe('handleNumberInput - invalid input falls back to default', () => {
    it('emits the height fallback (2.5) when input is NaN', async () => {
      const wrapper = mountComponent({ workflowPath: 'edit' })
      const input = wrapper.find('#height')
      await input.setValue('abc')
      await input.trigger('input')
      expect(wrapper.emitted('update:height')).toBeTruthy()
      expect(wrapper.emitted('update:height')[0][0]).toBe(2.5)
    })

    it('emits the height fallback (2.5) when input is empty', async () => {
      const wrapper = mountComponent({ workflowPath: 'edit' })
      const input = wrapper.find('#height')
      await input.setValue('')
      await input.trigger('input')
      expect(wrapper.emitted('update:height')).toBeTruthy()
      expect(wrapper.emitted('update:height')[0][0]).toBe(2.5)
    })

    it('emits the width fallback (5) when input is negative', async () => {
      const wrapper = mountComponent({ workflowPath: 'edit' })
      const input = wrapper.find('#width')
      await input.setValue('-3')
      await input.trigger('input')
      expect(wrapper.emitted('update:width')).toBeTruthy()
      expect(wrapper.emitted('update:width')[0][0]).toBe(5)
    })

    it('emits the speed fallback (3.5) when input is zero', async () => {
      const wrapper = mountComponent({ workflowPath: 'edit' })
      const input = wrapper.find('#speed')
      await input.setValue('0')
      await input.trigger('input')
      expect(wrapper.emitted('update:speed')).toBeTruthy()
      expect(wrapper.emitted('update:speed')[0][0]).toBe(3.5)
    })
  })

  describe('Upload button', () => {
    it('emits upload-to-arcgis when Upload button is clicked', async () => {
      const wrapper = mountComponent({ canUpload: true })
      const uploadBtn = wrapper.findComponent(Button)
      await uploadBtn.trigger('click')
      expect(wrapper.emitted('upload-to-arcgis')).toBeTruthy()
    })

    it('disables the Upload button when canUpload is false', () => {
      const wrapper = mountComponent({ canUpload: false })
      const btn = wrapper.find('button')
      expect(btn.attributes('disabled')).toBeDefined()
    })

    it('disables the Upload button when loading is true', () => {
      const wrapper = mountComponent({ loading: true })
      const btn = wrapper.find('button')
      expect(btn.attributes('disabled')).toBeDefined()
    })
  })
})
