<script setup lang="ts" name="ZnxTemplate">
import TouchSettingContents from "~/touch-flow/p/touch/TouchSettingContents.vue";
import { useVModel } from "@vueuse/core";
import { reactive, watchEffect } from "vue";

const props = defineProps<{
  data: any;
  type?: any;
  readonly?: boolean;
}>();

const origin = {
  id: "",
  name: "",
  status: "",
  type: "outbound",
  outboundCode: "",
};

const data = reactive<typeof origin & { variables?: Array<any> }>(origin);

watchEffect(() => {
  const _data = props.data?.value || props.data;
  if (!_data) return;

  Object.assign(data, _data);
});

function saveData() {
  const { id, name, outboundCode, variables } = data;
  const outboundTemplate: any = {
    outboundCode,
    type: "outbound",
  };

  // if (variables?.length) {
  //   outboundTemplate.variables = variables;
  // }

  return props.type == "details" || props.type == "update"
    ? {
      id,
      name,
      type: data.type,
      status: "available",
      outboundTemplate,
    }
    : {
      name,
      type: data.type,
      status: "available",
      outboundTemplate,
    };
}

defineExpose({ saveData });
const tableData = [
  {
    id: "001",
    variableFilled: "生肖",
    variable: "variable",
    screen: "screen",
    defaultValue: "defaultValue",
  },
  {
    id: "002",
    variableFilled: "性别",
    variable: "variable",
    screen: "screen",
    defaultValue: "defaultValue",
  },
];
</script>

<template>
  <el-form label-position="top" :model="data">
    <el-form-item label="模板名称">
      <el-input show-word-limit :disabled="readonly" v-model="data.name" style="width: 50%" maxlength="50"></el-input>
    </el-form-item>
    <el-form-item label="外呼唯一标志">
      <el-input :disabled="readonly" v-model="data.outboundCode" style="width: 50%"></el-input>
    </el-form-item>
    <el-form-item label="外呼话术模版">
      <el-select :disabled="readonly" v-model="data.template" placeholder="请选择" style="width: 50%">
        <el-option label="外呼系统的话术模版" value="sendMessage" />
        <el-option label="外呼系统的话术模版2" value="addfriends" />
      </el-select>
    </el-form-item>
    <el-form-item label="设置变量值">
      <el-table :disabled="readonly" :data="tableData"
        style="width: 100% ----el-table-header-bg-color: #EDEFF4;--el-table-header-bg-color: #EDEFF4;--el-table-tr-bg-color: #F7F8FB;--el-table-header-text-color:#333;">
        <el-table-column prop="id" label="序号" />
        <el-table-column prop="variableFilled" label="待填变量"> </el-table-column>

        <el-table-column prop="variable" label="变量值">
          <!-- 获取的下拉选项 -->
          <el-select v-model="data.template" placeholder="请选择" style="width: 100px">
            <el-option label="外呼系统的话术模版" value="sendMessage" />
            <el-option label="外呼系统的话术模版2" value="addfriends" />
          </el-select>
        </el-table-column>
        <el-table-column prop="screen" label="筛选" width="300"> 123 </el-table-column>

        <el-table-column prop="defaultValue" label="默认值">
          <el-input v-model="data.name" placeholder="请输入"></el-input>
        </el-table-column>
      </el-table>
    </el-form-item>
  </el-form>
</template>

<style>
.BaseTemplate {
  width: 60%;
}
</style>

<style scoped>
.el-table th.el-table__cell {
  background-color: #dbdbdb !important;
}
</style>
