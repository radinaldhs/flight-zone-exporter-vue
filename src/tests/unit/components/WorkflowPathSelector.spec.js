import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WorkflowPathSelector from '@/components/WorkflowPathSelector.vue'
import Card from '@/components/ui/Card.vue'

describe('WorkflowPathSelector', () => {
  describe('Initial Render', () => {
    it('should render the title and description', () => {
      const wrapper = mount(WorkflowPathSelector, {
        props: {
          canChoose: true,
          disabled: false
        },
        global: {
          components: { Card }
        }
      })

      expect(wrapper.text()).toContain('Choose Your Workflow')
      expect(wrapper.text()).toContain('Select how you want to process your files')
    })

    it('should render both path options', () => {
      const wrapper = mount(WorkflowPathSelector, {
        props: {
          canChoose: true,
          disabled: false
        },
        global: {
          components: { Card }
        }
      })

      expect(wrapper.text()).toContain('Quick Process')
      expect(wrapper.text()).toContain('Edit Shapefile First')
    })
  })

  describe('Quick Path Option', () => {
    it('should display quick path features', () => {
      const wrapper = mount(WorkflowPathSelector, {
        props: {
          canChoose: true,
          disabled: false
        },
        global: {
          components: { Card }
        }
      })

      expect(wrapper.text()).toContain('Fast and direct')
      expect(wrapper.text()).toContain('Process files directly')
      expect(wrapper.text()).toContain('Upload to ArcGIS immediately')
      expect(wrapper.text()).toContain('No manual editing required')
    })

    it('should have blue themed styling for quick path', () => {
      const wrapper = mount(WorkflowPathSelector, {
        props: {
          canChoose: true,
          disabled: false
        },
        global: {
          components: { Card }
        }
      })

      const html = wrapper.html()
      expect(html).toContain('bg-blue-100')
      expect(html).toContain('text-blue-600')
      expect(html).toContain('bg-blue-600')
    })

    it('should emit path-selected event when quick path clicked', async () => {
      const wrapper = mount(WorkflowPathSelector, {
        props: {
          canChoose: true,
          disabled: false
        },
        global: {
          components: { Card }
        }
      })

      const buttons = wrapper.findAll('button')
      const quickButton = buttons[0]
      await quickButton.trigger('click')

      expect(wrapper.emitted('path-selected')).toBeTruthy()
      expect(wrapper.emitted('path-selected')[0]).toEqual(['quick'])
    })
  })

  describe('Edit Path Option', () => {
    it('should display edit path features', () => {
      const wrapper = mount(WorkflowPathSelector, {
        props: {
          canChoose: true,
          disabled: false
        },
        global: {
          components: { Card }
        }
      })

      expect(wrapper.text()).toContain('For manual adjustments')
      expect(wrapper.text()).toContain('Generate shapefile from KML')
      expect(wrapper.text()).toContain('Edit zones in QGIS')
      expect(wrapper.text()).toContain('Re-upload edited shapefile')
      expect(wrapper.text()).toContain('Process and upload')
    })

    it('should have purple themed styling for edit path', () => {
      const wrapper = mount(WorkflowPathSelector, {
        props: {
          canChoose: true,
          disabled: false
        },
        global: {
          components: { Card }
        }
      })

      const html = wrapper.html()
      expect(html).toContain('bg-purple-100')
      expect(html).toContain('text-purple-600')
      expect(html).toContain('bg-purple-600')
    })

    it('should emit path-selected event when edit path clicked', async () => {
      const wrapper = mount(WorkflowPathSelector, {
        props: {
          canChoose: true,
          disabled: false
        },
        global: {
          components: { Card }
        }
      })

      const buttons = wrapper.findAll('button')
      const editButton = buttons[1]
      await editButton.trigger('click')

      expect(wrapper.emitted('path-selected')).toBeTruthy()
      expect(wrapper.emitted('path-selected')[0]).toEqual(['edit'])
    })
  })

  describe('Disabled State - canChoose=false', () => {
    it('should disable both buttons when canChoose is false', () => {
      const wrapper = mount(WorkflowPathSelector, {
        props: {
          canChoose: false,
          disabled: false
        },
        global: {
          components: { Card }
        }
      })

      const buttons = wrapper.findAll('button')
      expect(buttons[0].attributes('disabled')).toBeDefined()
      expect(buttons[1].attributes('disabled')).toBeDefined()
    })

    it('should not emit event when clicking while canChoose is false', async () => {
      const wrapper = mount(WorkflowPathSelector, {
        props: {
          canChoose: false,
          disabled: false
        },
        global: {
          components: { Card }
        }
      })

      const buttons = wrapper.findAll('button')
      await buttons[0].trigger('click')

      expect(wrapper.emitted('path-selected')).toBeFalsy()
    })

    it('should apply disabled styling when canChoose is false', () => {
      const wrapper = mount(WorkflowPathSelector, {
        props: {
          canChoose: false,
          disabled: false
        },
        global: {
          components: { Card }
        }
      })

      const buttons = wrapper.findAll('button')
      const html = wrapper.html()

      // Check that disabled attribute is set
      buttons.forEach(button => {
        expect(button.attributes('disabled')).toBeDefined()
      })

      // Check that the disabled: classes are in the HTML
      expect(html).toContain('disabled:opacity-50')
      expect(html).toContain('disabled:cursor-not-allowed')
    })
  })

  describe('Disabled State - disabled=true', () => {
    it('should disable both buttons when disabled is true', () => {
      const wrapper = mount(WorkflowPathSelector, {
        props: {
          canChoose: true,
          disabled: true
        },
        global: {
          components: { Card }
        }
      })

      const buttons = wrapper.findAll('button')
      expect(buttons[0].attributes('disabled')).toBeDefined()
      expect(buttons[1].attributes('disabled')).toBeDefined()
    })

    it('should not emit event when clicking while disabled', async () => {
      const wrapper = mount(WorkflowPathSelector, {
        props: {
          canChoose: true,
          disabled: true
        },
        global: {
          components: { Card }
        }
      })

      const buttons = wrapper.findAll('button')
      await buttons[0].trigger('click')

      expect(wrapper.emitted('path-selected')).toBeFalsy()
    })
  })

  describe('Hover Effects', () => {
    it('should have hover classes for interactive states', () => {
      const wrapper = mount(WorkflowPathSelector, {
        props: {
          canChoose: true,
          disabled: false
        },
        global: {
          components: { Card }
        }
      })

      const buttons = wrapper.findAll('button')
      buttons.forEach(button => {
        expect(button.classes()).toContain('hover:shadow-lg')
      })
    })
  })

  describe('Responsive Layout', () => {
    it('should have responsive grid layout', () => {
      const wrapper = mount(WorkflowPathSelector, {
        props: {
          canChoose: true,
          disabled: false
        },
        global: {
          components: { Card }
        }
      })

      const grid = wrapper.find('.grid')
      expect(grid.classes()).toContain('grid-cols-1')
      expect(grid.classes()).toContain('md:grid-cols-2')
    })
  })

  describe('Icons', () => {
    it('should render Zap icon for quick path', () => {
      const wrapper = mount(WorkflowPathSelector, {
        props: {
          canChoose: true,
          disabled: false
        },
        global: {
          components: { Card }
        }
      })

      const html = wrapper.html()
      expect(html).toContain('Zap')
    })

    it('should render Edit3 icon for edit path', () => {
      const wrapper = mount(WorkflowPathSelector, {
        props: {
          canChoose: true,
          disabled: false
        },
        global: {
          components: { Card }
        }
      })

      const html = wrapper.html()
      expect(html).toContain('Edit3')
    })

    it('should render CheckCircle2 icons for features', () => {
      const wrapper = mount(WorkflowPathSelector, {
        props: {
          canChoose: true,
          disabled: false
        },
        global: {
          components: { Card }
        }
      })

      const html = wrapper.html()
      expect(html).toContain('CheckCircle2')
    })
  })
})
