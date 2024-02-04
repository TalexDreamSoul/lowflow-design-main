<script setup lang="ts" name="ZnxTemplate">
import TouchSettingContents from "~/touch-flow/p/touch/TouchSettingContents.vue";
import { useVModel } from "@vueuse/core";
import { reactive, watchEffect } from "vue";

const props = defineProps<{
  data?: any;
  type?: any;
}>();

const origin = {
  id: "",
  name: "",
  status: "",
  type: "sms",

  content: "",
  sceneCode: "",
  variables: [
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
          fieldValue: "",
        },
      ],
    },
  ],
};

const data = reactive<typeof origin>(origin);
watchEffect(() => {
  const _data = props.data.value;
  console.log(data, origin);
  Object.assign(data, _data);
});
function saveData() {
  const { id, name, content, sceneCode, variables } = data;
  const smsTemplate = {
    content,
    sceneCode,
    variables,
    type: "sms",
  };

  return props.type=='details'||props.type=='update'?{
    id,
    name,
    type: data.type,
    status: "available",
    smsTemplate,
  }:{
    name,
    type: data.type,
    status: "available",
    smsTemplate,
  };
}

defineExpose({ saveData });
</script>

<template>
  <el-form label-position="top" :model="data" :disabled="type=='details'">
    <el-form-item label="模板名称">
      <el-input v-model="data.name"></el-input>
    </el-form-item>
    <el-form-item label="场景码">
      <el-input v-model="data.sceneCode" placeholder="请输入"></el-input>
    </el-form-item>
    <el-form-item label="短信内容">
      <TouchSettingContents variables="variables" content="listTitle" v-model="data" buttonTitle="输入变量" />
    </el-form-item>
  </el-form>
</template>