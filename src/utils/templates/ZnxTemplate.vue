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

function saveData() {
  const { id, name, carouselId, listTitle, moduleId, titleVariables, znxContent, znxTitle, znxTitleVariables } = data

  const znxTemplate = {
    carouselId,
    listTitle,
    moduleId,
    titleVariables,
    znxContent,
    znxTitle,
    znxTitleVariables,
    type: "znx",
  }

  return {
    id,
    name,
    type: data.type,
    status: 'available',
    znxTemplate: znxTemplate,
  }
}

defineExpose({ saveData })
</script>

<template>
  <el-form label-position="top" :model="data">
    <el-form-item label="模板名称">
      <el-input v-model="data.name"></el-input>
    </el-form-item>
    <el-form-item label="模块ID">
      <el-input v-model="data.moduleId"></el-input>
    </el-form-item>
    <el-form-item label="轮播图ID">
      <el-input v-model="data.carouselId"></el-input>
    </el-form-item>
    <el-form-item label="列表标题">
      <TouchSettingContents variables="titleVariables" content="listTitle" v-model="data" buttonTitle="输入变量" />
    </el-form-item>
    <el-form-item label="站内信标题">
      <TouchSettingContents variables="znxTitleVariables" content="znxTitle" v-model="data" buttonTitle="输入变量" />
    </el-form-item>
    <el-form-item label="站内信简介">
      <TouchSettingContents variables="znxContentVariables" content="znxContent" v-model="data" buttonTitle="输入变量" />
    </el-form-item>
  </el-form>
</template>