<script setup lang="ts" name="AttrTrigger">
import { ref, computed, watch } from "vue";
import { useVModel } from "@vueuse/core";

const props = defineProps<{
  modelValue: any;
  attrs: any;
  item: any;
  conditions: Array<any>;
  placeholder?: string;
  readonly?: boolean;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", modelValue: any): void;
  (e: "updateType", type: "attr" | "label"): void;
}>();

if (!props.conditions) {
  console.error("[LOW-FLOW] Make sure that this component will not be used as appPUSH touch result. Here are the stacks!")
} else console.log("Trigger Conditions", props.conditions)

const model = useVModel(props, "modelValue", emits);
const ph = computed(() => props?.placeholder ?? "选择字段");

const allowNode = computed(() => props.conditions?.filter(item => item.attr?.field === 'touchId')?.length)
const haveNode = computed(() => props.conditions?.filter(item => item.attr?.field === 'nodeId')?.length)

watch(
  () => model.value,
  (val) => {
    const { attrs, item } = props;

    const res = attrs.find((item: any) => item.field === val);
    if (!res) return;

    if (item.attr?.hasOwnProperty?.('fieldType')) {
      item.attr.fieldType = res.fieldType;
      item.attr.fieldName = res.fieldName;

      item.attr.fieldOp = ''
    }
    else {
      item.fieldType = res.fieldType;
      item.fieldName = res.fieldName;

      item.fieldOp = res.fieldOp
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="Trigger-Wrapper">
    <el-select :disabled="readonly || !!(model === 'touchId' && haveNode)" class="trigger-container" v-model="model"
      :placeholder="ph">
      <el-option :disabled="!!(item.field === 'touchId' && allowNode) || (item.field === 'nodeId' && (model === 'touchId' || !allowNode))"
        v-for="item in attrs" :key="item.field" :label="item.fieldName" :value="item.field" />
    </el-select>
  </div>
</template>

<style scoped lang="scss">
.Trigger-Wrapper {
  min-width: 120px;
}
</style>
