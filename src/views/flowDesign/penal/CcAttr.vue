<script setup lang="ts">
import Segmented from '~/components/Segmented'
import {useVModels} from '@vueuse/core'
import {CcNode} from '../nodes/Cc/index'
import {computed, inject, Ref, ref, watchEffect} from "vue";
import {Field} from "~/components/Render/interface";

const activeName = ref('properties')

export interface ApprovalAttr {
  node: CcNode
}

const $props = defineProps<ApprovalAttr>()
const $emits = defineEmits<{
  (e: 'update:node', modelValue: CcNode): void
}>()
const {node} = useVModels($props, $emits)
const {fields} = inject<{
  fields: Ref<Field[]>
}>('nodeHooks')!
const allReadable = computed({
  get() {
    return node.value.formProperties.every(e => e.readable)
  },
  set(val) {
    node.value.formProperties.forEach(e => e.readable = val)
    allHidden.value = !val
  }
})
const allHidden = computed({
  get() {
    return node.value.formProperties.every(e => e.hidden)
  },
  set(val) {
    node.value.formProperties.forEach(e => e.hidden = val)
    allReadable.value = !val
  }
})

watchEffect(() => {
  const formProperties = node.value.formProperties
  node.value.formProperties = fields.value.filter(e => e.value !== undefined).map(e => ({
    id: e.id,
    name: e.title,
    readable: true,
    writeable: false,
    required: false,
    hidden: e.props.hidden || false,
  }))
  node.value.formProperties.forEach(item => {
    const properties = formProperties.find(f => f.id === item.id)
    if (properties) {
      item.readable = properties.readable
      item.writeable = properties.writeable
      item.hidden = properties.hidden
      item.required = properties.required
    }
  })
})
</script>

<template>
  <segmented v-model="activeName" stretch :block="false">
  
  </segmented>
</template>

<style scoped lang="scss">

</style>
