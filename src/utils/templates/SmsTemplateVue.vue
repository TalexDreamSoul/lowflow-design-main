<script setup lang="ts" name="ZnxTemplate">
import TouchSettingContents from "~/touch-flow/p/touch/TouchSettingContents.vue";
import { reactive, watchEffect } from "vue";
import { ElMessage } from "element-plus";

const props = defineProps<{
  data?: any;
  type?: any;
  readonly?: boolean;
}>();

const origin = {
  id: "",
  name: "",
  status: "",
  type: "sms",

  content: "",
  sceneCode: "",
  // variables: [
  // {
  //   field: "",
  //   fieldName: "",
  //   labelId: 0,
  //   labelName: "",
  //   labelValue: [],
  //   type: "",
  //   variables: [
  //     {
  //       compareValue: "",
  //       defaultValue: "",
  //       fieldOp: "",
  //       fieldValue: "",
  //     },
  //   ],
  // },
  // ],
};

const data = reactive<typeof origin & { variables?: Array<any> }>(origin);
watchEffect(() => {
  const _data = props.data?.value || props.data;
  if (!_data) return;

  setTimeout(() => {
    console.log("sms", data, _data);
    Object.assign(data, _data);
  });
});
function saveData() {
  const { id, name, content, sceneCode, variables } = data;
  const smsTemplate: any = {
    content,
    sceneCode,
    type: "sms",
  };

  if (variables?.length) smsTemplate.variables = variables;

  return props.type == "details" || props.type == "update"
    ? {
      id,
      name,
      type: data.type,
      status: "available",
      smsTemplate,
    }
    : {
      name,
      type: data.type,
      status: "available",
      smsTemplate,
    };
}

defineExpose({ saveData });
</script>

<template>
  <el-form label-position="top" :model="data" :disabled="type == 'details'">
    <el-form-item label="模板名称">
      <!-- placeholder="请输入模板名" -->
      <el-input show-word-limit :disabled="readonly" v-model="data.name" maxlength="50"></el-input>
    </el-form-item>
    <el-form-item label="场景码">
      <!-- placeholder="请输入场景码" -->
      <el-input :disabled="readonly" v-model="data.sceneCode"></el-input>
    </el-form-item>
    <el-form-item label="短信内容">
      <TouchSettingContents :disabled="readonly" variables="variables" content="content" v-model="data"
        buttonTitle="输入变量" />
    </el-form-item>
  </el-form>
</template>
