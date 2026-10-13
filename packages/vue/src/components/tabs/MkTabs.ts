import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'reka-ui'
import { defineComponent, h } from 'vue'
import type { Component, HTMLAttributes, PropType, SlotsType, VNodeChild } from 'vue'

import { useModeKitOptions } from '../../config/context.js'
import { getTabsClasses, getTabsSlotClasses } from './styles/index.js'
import { tabsActivationModes, tabsSizes, tabsVariants } from './types.js'
import type {
  TabsActivationMode,
  TabsItem,
  TabsSize,
  TabsSlots,
  TabsUI,
  TabsValue,
  TabsVariant,
} from './types.js'

export const MkTabs = defineComponent({
  name: 'MkTabs',
  inheritAttrs: false,
  props: {
    items: {
      type: Array as PropType<readonly TabsItem[]>,
      required: true,
    },
    modelValue: {
      type: [String, Number] as PropType<TabsValue>,
      default: undefined,
    },
    defaultValue: {
      type: [String, Number] as PropType<TabsValue>,
      default: undefined,
    },
    variant: {
      type: String as PropType<TabsVariant>,
      default: undefined,
      validator: (value: TabsVariant) => tabsVariants.includes(value),
    },
    size: {
      type: String as PropType<TabsSize>,
      default: undefined,
      validator: (value: TabsSize) => tabsSizes.includes(value),
    },
    activationMode: {
      type: String as PropType<TabsActivationMode>,
      default: 'automatic',
      validator: (value: TabsActivationMode) => tabsActivationModes.includes(value),
    },
    loop: {
      type: Boolean,
      default: true,
    },
    unmountOnHide: {
      type: Boolean,
      default: true,
    },
    ui: {
      type: Object as PropType<TabsUI>,
      default: undefined,
    },
  },
  emits: {
    'update:modelValue': (value: unknown): value is TabsValue =>
      typeof value === 'string' || typeof value === 'number',
  },
  slots: Object as SlotsType<TabsSlots>,
  setup(props, { attrs, emit, slots }) {
    const options = useModeKitOptions()

    return () => {
      const tabsConfig = options.ui?.tabs
      const variant = props.variant ?? tabsConfig?.defaultVariants?.variant ?? 'line'
      const size = props.size ?? tabsConfig?.defaultVariants?.size ?? 'md'
      const attributes: HTMLAttributes = attrs
      const firstEnabledItem = props.items.find((item) => !item.disabled)
      const rootProps: Record<string, unknown> = {
        ...attributes,
        as: 'div',
        activationMode: props.activationMode,
        defaultValue: props.defaultValue ?? firstEnabledItem?.value,
        orientation: 'horizontal',
        unmountOnHide: props.unmountOnHide,
        class: getTabsClasses({
          variant,
          size,
          config: tabsConfig,
          ui: props.ui,
          className: attributes.class,
        }),
        'data-mk-variant': variant,
        'data-mk-size': size,
        'onUpdate:modelValue': (value: TabsValue) => {
          emit('update:modelValue', value)
        },
      }

      if (props.modelValue !== undefined) rootProps.modelValue = props.modelValue

      return h(TabsRoot, rootProps, {
        default: ({ modelValue }: { modelValue: TabsValue | undefined }): VNodeChild[] => [
          h(
            TabsList,
            {
              as: 'div',
              loop: props.loop,
              class: getTabsSlotClasses({
                slot: 'list',
                variant,
                size,
                config: tabsConfig,
                ui: props.ui,
              }),
            },
            {
              default: () =>
                props.items.map((item) => {
                  const slotProps = { item, active: item.value === modelValue }
                  const triggerProps: Record<string, unknown> = {
                    key: item.value,
                    as: 'button',
                    value: item.value,
                    class: getTabsSlotClasses({
                      slot: 'trigger',
                      variant,
                      size,
                      config: tabsConfig,
                      ui: props.ui,
                    }),
                  }

                  if (item.disabled !== undefined) triggerProps.disabled = item.disabled

                  return h(TabsTrigger as Component, triggerProps, {
                    default: () => [
                      slots.leading
                        ? h(
                            'span',
                            {
                              class: getTabsSlotClasses({
                                slot: 'leading',
                                variant,
                                size,
                                config: tabsConfig,
                                ui: props.ui,
                              }),
                            },
                            [slots.leading(slotProps)],
                          )
                        : undefined,
                      h(
                        'span',
                        {
                          class: getTabsSlotClasses({
                            slot: 'label',
                            variant,
                            size,
                            config: tabsConfig,
                            ui: props.ui,
                          }),
                        },
                        slots.tab?.(slotProps) ?? item.label,
                      ),
                      slots.trailing
                        ? h(
                            'span',
                            {
                              class: getTabsSlotClasses({
                                slot: 'trailing',
                                variant,
                                size,
                                config: tabsConfig,
                                ui: props.ui,
                              }),
                            },
                            [slots.trailing(slotProps)],
                          )
                        : undefined,
                    ],
                  })
                }),
            },
          ),
          ...(slots.content
            ? props.items.map((item) =>
                h(
                  TabsContent,
                  {
                    key: item.value,
                    as: 'div',
                    value: item.value,
                    class: getTabsSlotClasses({
                      slot: 'content',
                      variant,
                      size,
                      config: tabsConfig,
                      ui: props.ui,
                    }),
                  },
                  {
                    default: () => slots.content?.({ item, active: item.value === modelValue }),
                  },
                ),
              )
            : []),
        ],
      })
    }
  },
})
