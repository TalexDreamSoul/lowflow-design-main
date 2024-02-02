<script setup lang="ts" name="ZnxTemplate">
import TouchSettingContents from "~/touch-flow/p/touch/TouchSettingContents.vue";
import { useVModel } from "@vueuse/core";
import { reactive } from "vue";

const origin = {
  id: "",
  name: "",
  status: "",
  type: "outbound",

  outboundCode: "",
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

function saveData() {
  const { id, name, outboundCode, variables } = data;
  const outboundTemplate = {
    outboundCode,
    variables,
    type: "outbound",
  };

  return {
    id,
    name,
    type: data.type,
    status: "available",
    outboundTemplate,
  };
}

defineExpose({ saveData });
const tableData = [
  {
    id: "01",
    variableFilled: "生肖",
    variable: "variable",
    screen: "screen",
    defaultValue: "defaultValue",
  },
  {
    id: "01",
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
      <el-input v-model="data.name" style="width: 50%;"></el-input>
    </el-form-item>
    <el-form-item label="外呼话术模版">
      <el-select v-model="data.template" placeholder="请选择" style="width: 50%;">
        <el-option label="外呼系统的话术模版" value="sendMessage" />
        <el-option label="外呼系统的话术模版2" value="addfriends" />
      </el-select>
    </el-form-item>
    <el-form-item label="设置变量值">
      <el-table :data="tableData" style="width: 100% ----el-table-header-bg-color: #EDEFF4;--el-table-header-bg-color: #EDEFF4;--el-table-tr-bg-color: #F7F8FB;--el-table-header-text-color:#333;">
        <el-table-column prop="id" label="序号" />
        <el-table-column prop="variableFilled" label="待填变量">
        </el-table-column>

        <el-table-column prop="variable" label="变量值">
          <!-- 获取的下拉选项 -->
          <el-select v-model="data.template" placeholder="请选择" style="width: 100px;">
            <el-option label="外呼系统的话术模版" value="sendMessage" />
            <el-option label="外呼系统的话术模版2" value="addfriends" />
          </el-select>
        </el-table-column>
        <el-table-column prop="screen" label="筛选" width="300" />

        <el-table-column prop="defaultValue" label="默认值">
          <el-input v-model="data.name" placeholder="请输入"></el-input>

        </el-table-column>
      </el-table>
    </el-form-item>
  </el-form>
</template>
<style scoped>
.el-table th.el-table__cell {
  background-color: #dbdbdb !important;
}
</style>