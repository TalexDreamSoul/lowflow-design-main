<script setup lang="ts" name="ZnxTemplate">
import TouchSettingContents from "~/touch-flow/p/touch/TouchSettingContents.vue";
import { useVModel } from "@vueuse/core";
import { reactive, ref } from "vue";
import { Delete, Download, Plus, ZoomIn } from "@element-plus/icons-vue";

import type { UploadFile } from "element-plus";
import MicroEnterpriseDrag from "./MicroEnterpriseDrag.vue";

const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const disabled = ref(false);

const origin = {
  id: "",
  name: "",
  status: "",
  type: "znx",
  sendtype: "sendMessage",
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

const handleRemove = (file: UploadFile) => {
  console.log(file);
};

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!;
  dialogVisible.value = true;
};

const handleDownload = (file: UploadFile) => {
  console.log(file);
};

const list = ref([
  {
    id: "1",
    name: "模板1",
  },
  {
    id: "2",
    name: "模板2",
  },
  {
    id: "3",
    name: "模板3",
  },
  {
    id: "4",
    name: "模板4",
  }
])
</script>

<template>
  <el-form label-position="top" :model="origin">
    <el-form-item label="模板名称">
      <el-input v-model="origin.name" style="width: 50%;"></el-input>
    </el-form-item>
    <el-form-item label="企微触达方式">
      <el-select v-model="origin.sendtype" style="width: 50%;">
        <!--
           sendMessage 发送消息
           addfriends 添加好友
   -->
        <el-option label="发送消息" value="sendMessage" />
        <el-option label="添加好友" value="addfriends" />
      </el-select>
    </el-form-item>

    <el-form-item label="消息内容">
      <TouchSettingContents variables="titleVariables" content="listTitle" v-model="origin" buttonTitle="输入变量" />
    </el-form-item>

    <MicroEnterpriseDrag v-model="list" />

    <el-upload action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" :auto-upload="false"
      class="upload-demo button-groupupload">
      <el-text type="primary" style="cursor: pointer;" @click="addPic">
        <el-icon size="14">
          <CirclePlusFilled />
        </el-icon>
        添加图片
      </el-text>
    </el-upload>
    <div class="button-group">
      <el-text type="primary" style="cursor: pointer;" @click="addMessage">
        <el-icon size="14">
          <CirclePlusFilled />
        </el-icon>
        添加消息内容
      </el-text>
    </div>
  </el-form>
</template>
<style scoped>
.button-group {
  background: #ecf1fc;
  align-items: center;
  padding: 10px;
  border-radius: 4px;
  border: 1px dashed #b3aaaa;
  margin: 12px 0;
  cursor: pointer;
}

.button-groupupload {
  padding-top: 10px;
  padding-left: 10px;
  background: #ecf1fc;
  align-items: center;
  border-radius: 4px;
  border: 1px dashed #b3aaaa;
  margin: 12px 0;
  cursor: pointer;
}
</style>