<script setup lang="ts" name="ZnxTemplate">
import TouchSettingContents from "~/touch-flow/p/touch/TouchSettingContents.vue";
import { useVModel } from "@vueuse/core";
import { reactive } from "vue";

const origin = {
  id: "",
  name: "",
  status: "",
  template: "",
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
    },
  ],
  znxContent: "",
  znxContentVariables: [
    {
      defaultValue: "",
      field: "",
      fieldName: "",
      fieldValue: "",
    },
  ],
  znxTitle: "",
  znxTitleVariables: [
    {
      defaultValue: "",
      field: "",
      fieldName: "",
      fieldValue: "",
    },
  ],
};

const data = reactive<typeof origin>(origin);

const props = defineProps<{
  modelValue?: boolean;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const model = useVModel(props, "modelValue", emits);

function saveData() {
  console.log("save", model, origin);
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
  <el-form label-position="top" :model="origin">
    <el-form-item label="模板名称">
      <el-input v-model="origin.name" style="width: 50%;"></el-input>
    </el-form-item>
    <el-form-item label="外呼话术模版">
      <el-select v-model="origin.template" placeholder="请选择" style="width: 50%;">
        <el-option label="外呼系统的话术模版" value="sendMessage" />
        <el-option label="外呼系统的话术模版2" value="addfriends" />
      </el-select>
    </el-form-item>
    <el-form-item label="设置变量值">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="序号" />
        <el-table-column prop="variableFilled" label="待填变量">
        </el-table-column>

        <el-table-column prop="variable" label="变量值">
          <!-- 获取的下拉选项 -->
          <el-select v-model="origin.template" placeholder="请选择" style="width: 50%;">
            <el-option label="外呼系统的话术模版" value="sendMessage" />
            <el-option label="外呼系统的话术模版2" value="addfriends" />
          </el-select>
        </el-table-column>
        <el-table-column prop="screen" label="筛选" width="300" />

        <el-table-column prop="defaultValue" label="默认值">
          <el-input v-model="origin.name" placeholder="请输入"></el-input>

        </el-table-column>
      </el-table>
    </el-form-item>
  </el-form>
</template>