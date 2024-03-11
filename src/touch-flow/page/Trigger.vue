<script setup lang="ts" name="AttrTrigger">
import { ref, computed, watch } from "vue";
import { useVModel } from "@vueuse/core";

const props = defineProps<{
  modelValue: any;
  attrs: any;
  item: any;
  placeholder?: string;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", modelValue: any): void;
  (e: "updateType", type: "attr" | "label"): void;
}>();

const model = useVModel(props, "modelValue", emits);
const ph = computed(() => props?.placeholder ?? "选择字段");

watch(
  () => model.value,
  (val) => {
    const { attrs, item } = props;

    const res = attrs.find((item: any) => item.field === val);
    if (!res) return;

    if (item.attr?.hasOwnProperty?.('fieldType')) {
      item.attr.fieldType = res.fieldType;
      item.attr.fieldName = res.fieldName;
    }
    else {
      item.fieldType = res.fieldType;
      item.fieldName = res.fieldName;
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="Trigger-Wrapper">
    <el-select class="trigger-container" v-model="model" :placeholder="ph">
      <el-option v-for="item in attrs" :key="item.field" :label="item.fieldName" :value="item.field" />
    </el-select>
  </div>
</template>

<style scoped lang="scss">
.Trigger-Wrapper {
  min-width: 120px;
}
</style>
