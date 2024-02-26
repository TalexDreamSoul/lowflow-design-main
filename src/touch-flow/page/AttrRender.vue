<script setup lang="ts" name="AttrRender">
import { computed } from "vue";
import { useVModel } from "@vueuse/core";

type AttrType = any; //number | string | boolean | Array<Number> | Array<string>

const props = defineProps<{
  modelValue: AttrType;
  field: string;
  attrs: any;
  operator: string;
  selected?: string;
  readonly?: boolean
}>();
const emits = defineEmits<{
  (e: "update:modelValue", value: AttrType): void;
}>();

const type = computed(() => props.selected ? ((_: any) => _.labelValueType || _.labelType || _.fieldType)(props.selected) : (props.attrs.filter((attr: any) => attr.field === props.field)?.[0]?.fieldType ?? "none"));
const model = useVModel(props, "modelValue", emits);
</script>

<template>
  <div class="AttrRender">
    <el-input :disabled="readonly" v-if="type === 'num'" v-model.number="model" />
    <el-input :disabled="readonly" v-else-if="type === 'text'" v-model="model" />
    <template v-else-if="type === 'date'">
      {{operator}}
    </template>
    <span v-else-if="type === 'boolean'" />
    <span v-else>NULL</span>
  </div>
</template>
