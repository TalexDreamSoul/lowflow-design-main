<script setup lang="ts" name="ZnxTemplate">
import TouchSettingContents from "~/touch-flow/p/touch/TouchSettingContents.vue";
import { useVModel } from "@vueuse/core";
import { reactive } from "vue";
const origin ={
  id: "",
  name: "",
  status: "",
  type: "appPush",

  content: "",
  contentVariables: [
    {
      field: "",
      fieldName: "",
      labelId: 0,
      labelName: "",
      labelValue: [],
      type: "",
      variables: [
        {
          compareValue: "",
          defaultValue: "",
          fieldOp: "",
          fieldValue: ""
        }
      ]
    }
  ],
  jumpAppType: "",
  pageLink: "",
  sceneCode: "",
  title: "",
  titleVariables: [
    {
      field: "",
      fieldName: "",
      labelId: 0,
      labelName: "",
      labelValue: [],
      type: "",
      variables: [
        {
          compareValue: "",
          defaultValue: "",
          fieldOp: "",
          fieldValue: ""
        }
      ]
    }
  ]

}

const data = reactive<typeof origin>(origin);


function saveData() {
  console.log("save", data, origin);
}

defineExpose({ saveData });
</script>

<template>
  <el-form label-position="top" :model="data">
    <el-form-item label="模板名称">
      <el-input v-model="data.name"></el-input>
    </el-form-item>
    <el-form-item label="场景码">
      <el-input v-model="data.sceneCode" placeholder="请输入"></el-input>
    </el-form-item>
    <el-form-item label="推送标题">
      <TouchSettingContents variables="titleVariables" content="listTitle" v-model="data" buttonTitle="输入变量" />
    </el-form-item>
    <el-form-item label="推送内容">
      <TouchSettingContents variables="znxTitleVariables" content="znxTitle" v-model="data" buttonTitle="输入变量" />
    </el-form-item>

    <div style="font-size: 14px;
    color: rgba(0, 0, 0, 0.9);
    display: flex;align-items: center;    margin: 12px 0;
    ">
      <div>
        点击推送后&nbsp;&nbsp;&nbsp;
      </div>
      <el-radio-group v-model="data.jumpAppType">
        <el-radio label="app">跳转App原生页面</el-radio>
        <el-radio label="booth">跳转App展位</el-radio>
      </el-radio-group>
    </div>
    <el-form-item label="跳转页面位置参数">
      <el-input v-model="data.pageLink" placeholder="填写Code"></el-input>
    </el-form-item>
    
  </el-form>
</template>