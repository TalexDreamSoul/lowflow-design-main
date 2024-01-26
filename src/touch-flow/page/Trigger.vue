<script setup lang="ts" name="AttrTrigger">
import { computed } from "vue";
import { useVModel } from "@vueuse/core";

const props = defineProps<{
  modelValue: any;
  attrs: any;
  placeholder?: string;
  multiple?: boolean;
}>();
const emits = defineEmits<{
  (e: "update:model-value", modelValue: any): void;
}>();

const model = useVModel(props, "modelValue", emits);
const ph = computed(() => props?.placeholder ?? "选择字段");
</script>

<template>
  <el-tree-select v-if="multiple" v-model="model" :data="attrs" :render-after-expand="false" />
  <!-- <el-option-group v-if="multiple" v-for="(group, index) in attrs" :key="index" :label="group.label">
        <template v-for="(option, i) in group.options" :key="i">
          <el-option v-if="!option.labelValue?.data?.length" :key="option.field"
            :label="option.fieldName ?? option.labelName" :value="option.fieldValue" />

          <el-option-group v-else :label="option.labelName">
            <el-option v-for="item in option.labelValue.data" :key="`${group.label}-${item}`" :label="item"
              :value="`${group.label}-${item}`" />
          </el-option-group>
        </template>
      </el-option-group> -->
  <el-select v-else class="trigger-container" v-model="model" :placeholder="ph">
    <el-option v-for="item in attrs" :key="item.field" :label="item.fieldName" :value="item.field" />
  </el-select>
</template>

<style scoped lang="scss"></style>
