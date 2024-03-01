<script setup lang="ts" name="ZnxTemplate">
import TouchSettingContents from "~/touch-flow/p/touch/TouchSettingContents.vue";
import { reactive, watchEffect } from "vue";
import { title } from "process";

const props = defineProps<{
  data: any;
  type?: any;
  readonly?: boolean;
}>();

const origin = {
  id: "",
  name: "",
  status: "",
  type: "znx",
  carouselId: "",
  listTitle: "",
  moduleId: "",
  znxContent: "",
  znxTitle: "",
};

const data = reactive<
  typeof origin & {
    titleVariables?: Array<any>;
    znxContentVariables?: Array<any>;
    znxTitleVariables?: Array<any>;
  }
>(origin);

watchEffect(() => {
  const _data = props.data?.value || props.data;
  if (!_data) return;

  console.log("znx", data, origin, props);

  Object.assign(data, _data);
});

function saveData() {
  const {
    id,
    name,
    carouselId,
    listTitle,
    moduleId,
    titleVariables,
    znxContent,
    znxTitle,
    znxTitleVariables,
    znxContentVariables,
  } = data;

  const znxTemplate: any = {
    carouselId,
    listTitle,
    moduleId,
    znxContent,
    znxTitle,
    type: "znx",
  };

  if (titleVariables?.length) {
    znxTemplate.titleVariables = titleVariables;
  }

  if (znxTitleVariables?.length) {
    znxTemplate.znxTitleVariables = znxTitleVariables;
  }

  if (znxContentVariables?.length) {
    znxTemplate.znxContentVariables = znxContentVariables;
  }

  return props.type == "details" || props.type == "update"
    ? {
        id,
        name,
        type: data.type,
        status: "available",
        znxTemplate: znxTemplate,
      }
    : {
        name,
        type: data.type,
        status: "available",
        znxTemplate: znxTemplate,
      };
}

defineExpose({ saveData });
</script>

<template>
  <el-form label-position="top" :model="data">
    <el-form-item label="模板名称">
      <el-input :disabled="readonly" v-model="data.name"></el-input>
    </el-form-item>
    <el-form-item label="模块ID">
      <el-input :disabled="readonly" v-model="data.moduleId"></el-input>
    </el-form-item>
    <el-form-item label="轮播图ID">
      <el-input :disabled="readonly" v-model="data.carouselId"></el-input>
    </el-form-item>
    <el-form-item label="列表标题">
      <TouchSettingContents
        :disabled="readonly"
        variables="titleVariables"
        content="listTitle"
        v-model="data"
        buttonTitle="输入变量"
      />
    </el-form-item>
    <el-form-item label="站内信标题">
      <TouchSettingContents
        :disabled="readonly"
        variables="znxTitleVariables"
        content="znxTitle"
        v-model="data"
        buttonTitle="输入变量"
      />
    </el-form-item>
    <el-form-item label="站内信简介">
      <TouchSettingContents
        :disabled="readonly"
        variables="znxContentVariables"
        content="znxContent"
        v-model="data"
        buttonTitle="输入变量"
      />
    </el-form-item>
  </el-form>
</template>
