import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WorkflowSteps from '@/components/WorkflowSteps.vue'

describe('WorkflowSteps', () => {
  describe('Default State', () => {
    it('should render default step when no path selected', () => {
      const wrapper = mount(WorkflowSteps, {
        props: {
          currentStep: 1,
          workflowPath: null
        }
      })

      expect(wrapper.text()).toContain('Upload Files')
      const steps = wrapper.findAll('.w-10')
      expect(steps.length).toBe(1)
    })

    it('should not show path badge when no workflow selected', () => {
      const wrapper = mount(WorkflowSteps, {
        props: {
          currentStep: 1,
          workflowPath: null
        }
      })

      const badge = wrapper.find('.inline-flex.items-center')
      expect(badge.exists()).toBe(false)
    })
  })

  describe('Quick Path', () => {
    it('should render 3 steps for quick path', () => {
      const wrapper = mount(WorkflowSteps, {
        props: {
          currentStep: 1,
          workflowPath: 'quick',
          totalSteps: 3
        }
      })

      const steps = wrapper.findAll('.w-10')
      expect(steps.length).toBe(3)
      expect(wrapper.text()).toContain('Upload Files')
      expect(wrapper.text()).toContain('Process Files')
      expect(wrapper.text()).toContain('Upload to ArcGIS')
    })

    it('should show quick path badge with blue styling', () => {
      const wrapper = mount(WorkflowSteps, {
        props: {
          currentStep: 1,
          workflowPath: 'quick',
          totalSteps: 3
        }
      })

      const badge = wrapper.find('.inline-flex.items-center')
      expect(badge.exists()).toBe(true)
      expect(badge.text()).toContain('Quick Process Path')
      expect(badge.classes()).toContain('bg-blue-100')
      expect(badge.classes()).toContain('text-blue-700')
    })

    it('should apply blue colors for active steps', () => {
      const wrapper = mount(WorkflowSteps, {
        props: {
          currentStep: 2,
          workflowPath: 'quick',
          totalSteps: 3
        }
      })

      const html = wrapper.html()
      expect(html).toContain('bg-blue-600')
    })
  })

  describe('Edit Path', () => {
    it('should render 6 steps for edit path', () => {
      const wrapper = mount(WorkflowSteps, {
        props: {
          currentStep: 1,
          workflowPath: 'edit',
          totalSteps: 6
        }
      })

      const steps = wrapper.findAll('.w-10')
      expect(steps.length).toBe(6)
      expect(wrapper.text()).toContain('Upload Files')
      expect(wrapper.text()).toContain('Generate Shapefile')
      expect(wrapper.text()).toContain('Download & Edit')
      expect(wrapper.text()).toContain('Upload Edited')
      expect(wrapper.text()).toContain('Process Files')
      expect(wrapper.text()).toContain('Upload to ArcGIS')
    })

    it('should show edit path badge with purple styling', () => {
      const wrapper = mount(WorkflowSteps, {
        props: {
          currentStep: 1,
          workflowPath: 'edit',
          totalSteps: 6
        }
      })

      const badge = wrapper.find('.inline-flex.items-center')
      expect(badge.exists()).toBe(true)
      expect(badge.text()).toContain('Edit Shapefile Path')
      expect(badge.classes()).toContain('bg-purple-100')
      expect(badge.classes()).toContain('text-purple-700')
    })

    it('should apply purple colors for active steps', () => {
      const wrapper = mount(WorkflowSteps, {
        props: {
          currentStep: 2,
          workflowPath: 'edit',
          totalSteps: 6
        }
      })

      const html = wrapper.html()
      expect(html).toContain('bg-purple-600')
    })
  })

  describe('Step States', () => {
    it('should show completed steps with checkmark', () => {
      const wrapper = mount(WorkflowSteps, {
        props: {
          currentStep: 3,
          workflowPath: 'quick',
          totalSteps: 3
        }
      })

      // Check icon is rendered (mocked as component name in setup.js)
      const html = wrapper.html()
      expect(html).toContain('Check')
    })

    it('should show step numbers for incomplete steps', () => {
      const wrapper = mount(WorkflowSteps, {
        props: {
          currentStep: 1,
          workflowPath: 'quick',
          totalSteps: 3
        }
      })

      expect(wrapper.text()).toContain('2')
      expect(wrapper.text()).toContain('3')
    })

    it('should apply active styling to current and previous steps', () => {
      const wrapper = mount(WorkflowSteps, {
        props: {
          currentStep: 2,
          workflowPath: 'quick',
          totalSteps: 3
        }
      })

      const steps = wrapper.findAll('.w-10')
      // Step 1 should be completed (has blue background)
      expect(steps[0].classes()).toContain('bg-blue-600')
      // Step 2 should be active
      expect(steps[1].classes()).toContain('bg-blue-600')
    })

    it('should show connector lines between steps', () => {
      const wrapper = mount(WorkflowSteps, {
        props: {
          currentStep: 2,
          workflowPath: 'quick',
          totalSteps: 3
        }
      })

      const connectors = wrapper.findAll('.h-0\\.5')
      expect(connectors.length).toBeGreaterThan(0)
    })
  })

  describe('Responsiveness', () => {
    it('should have overflow-x-auto for mobile responsiveness', () => {
      const wrapper = mount(WorkflowSteps, {
        props: {
          currentStep: 1,
          workflowPath: 'edit',
          totalSteps: 6
        }
      })

      const container = wrapper.find('.overflow-x-auto')
      expect(container.exists()).toBe(true)
    })

    it('should have min-w-max class for proper scrolling', () => {
      const wrapper = mount(WorkflowSteps, {
        props: {
          currentStep: 1,
          workflowPath: 'edit',
          totalSteps: 6
        }
      })

      const stepsContainer = wrapper.find('.min-w-max')
      expect(stepsContainer.exists()).toBe(true)
    })
  })
})
