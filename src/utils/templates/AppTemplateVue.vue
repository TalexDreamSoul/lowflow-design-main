<script setup lang="ts" name="ZnxTemplate">
import TouchSettingContents from "~/touch-flow/p/touch/TouchSettingContents.vue";
import { useVModel } from "@vueuse/core";
import { reactive, watchEffect } from "vue";

const props = defineProps<{
  data: any;
  type?: any;
  readonly?: boolean;
}>()

const origin = {
  id: "",
  name: "",
  status: "",
  type: "appPush",

  content: "",
  jumpAppType: "",
  pageLink: "",
  sceneCode: "",
  title: "",
}

const data = reactive<typeof origin & { contentVariables?: Array<any>, titleVariables?: Array<any> }>(origin);

watchEffect(() => {
  const _data = props.data?.value || props.data
  if (!_data) return

  Object.assign(data, _data)
})

function saveData() {
  const { id, name, content, contentVariables, jumpAppType, pageLink, sceneCode, title, titleVariables } = data;
  const appPushTemplate: any = {
    content,
    jumpAppType,
    pageLink,
    sceneCode,
    title,
    type: "appPush",
  };

  if ( contentVariables?.length ) {
    appPushTemplate.contentVariables = contentVariables
  }

  if ( titleVariables?.length ) {
    appPushTemplate.titleVariables = titleVariables
  }

  return props.type == "details" || props.type == "update" ? {
    id,
    name,
    type: data.type,
    status: "available",
    appPushTemplate,
  } : {
    name,
    type: data.type,
    status: "available",
    appPushTemplate,
  };
}

defineExpose({ saveData });
</script>

<template>
  <el-form label-position="top" :model="data">
    <el-form-item label="模板名称">
      <el-input :disabled="readonly" v-model="data.name"></el-input>
    </el-form-item>
    <el-form-item label="场景码">
      <el-input :disabled="readonly" v-model="data.sceneCode" placeholder="请输入"></el-input>
    </el-form-item>
    <el-form-item label="推送标题">
      <TouchSettingContents :disabled="readonly" variables="titleVariables" content="title" v-model="data"
        buttonTitle="输入变量" />
    </el-form-item>
    <el-form-item label="推送内容">
      <TouchSettingContents :disabled="readonly" variables="contentVariables" content="content" v-model="data"
        buttonTitle="输入变量" />
    </el-form-item>

    <div style="font-size: 14px;
    color: rgba(0, 0, 0, 0.9);
    display: flex;align-items: center;    margin: 12px 0;
    ">
      <div>
        点击推送后&nbsp;&nbsp;&nbsp;
      </div>
      <el-radio-group :disabled="readonly" v-model="data.jumpAppType">
        <el-radio label="app">跳转App原生页面</el-radio>
        <el-radio label="booth">跳转App展位</el-radio>
      </el-radio-group>
    </div>
    <el-form-item label="跳转页面位置参数">
      <el-input :disabled="readonly" v-model="data.pageLink" placeholder="填写Code"></el-input>
    </el-form-item>

  </el-form>
</template>