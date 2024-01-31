<script setup lang="ts" name="ZnxTemplate">
import TouchSettingContents from '~/touch-flow/p/touch/TouchSettingContents.vue';
import { useVModel } from '@vueuse/core'
import { reactive } from 'vue'

const origin = {
  id: "",
  name: "",
  status: "",
  type: "znx",
  carouselId: "",
  listTitle: "",
  moduleId: "",
  titleVariables: [
    {
      defaultValue: "",
      field: "",
      fieldName: "",
      fieldValue: "",
    }
  ],
  znxContent: "",
  znxContentVariables: [
    {
      defaultValue: "",
      field: "",
      fieldName: "",
      fieldValue: ""
    }
  ],
  znxTitle: "",
  znxTitleVariables: [
    {
      defaultValue: "",
      field: "",
      fieldName: "",
      fieldValue: "",
    }
  ],
}

const data = reactive<typeof origin>(origin)

const props = defineProps<{
  modelValue?: boolean,
}>()
const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void,
}>()

const model = useVModel(props, 'modelValue', emits)

function saveData() {
  console.log('save', model, origin)
}

defineExpose({ saveData })
</script>

<template>
  <el-form label-position="top" :model="origin">
    <el-form-item label="模板名称">
      <el-input v-model="origin.name"></el-input>
    </el-form-item>
    <el-form-item label="模板ID">
      <el-input v-model="origin.id"></el-input>
    </el-form-item>
    <el-form-item label="轮播图ID">
      <el-input v-model="origin.carouselId"></el-input>
    </el-form-item>
    <el-form-item label="列表标题">
      <TouchSettingContents variables="titleVariables" content="listTitle" v-model="origin" buttonTitle="输入变量" />
    </el-form-item>
    <el-form-item label="站内信标题">
      <TouchSettingContents variables="znxTitleVariables" content="znxTitle" v-model="origin" buttonTitle="输入变量" />
    </el-form-item>
    <el-form-item label="站内信简介">
      <TouchSettingContents variables="znxContentVariables" content="znxContent" v-model="origin" buttonTitle="输入变量" />
    </el-form-item>
  </el-form>
</template>