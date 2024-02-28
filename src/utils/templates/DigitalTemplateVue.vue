<script setup lang="ts" name="ZnxTemplate">
import TouchSettingContents from "~/touch-flow/p/touch/TouchSettingContents.vue";
import { reactive, ref, watchEffect } from "vue";

import type { UploadFile, UploadFiles } from "element-plus";
import MicroEnterpriseDrag from "./MicroEnterpriseDrag.vue";

const dialogImageUrl = ref("");
const dialogVisible = ref(false);

const action = `/api/uploadMaterialFile`;
const props = defineProps<{
  data: any;
  readonly?: boolean;
}>();

const origin = {
  id: "",
  name: "",
  status: "",
  type: "digital",

  digitalTemplateDetails: {
    content: "",
    imgUrl: "",
    type: "",
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
  },
};

const data = reactive<typeof origin>(origin);

watchEffect(() => {
  const _data = props.data?.value || props.data
  if (!_data) return;

  Object.assign(data, _data);
});

function saveData() {
  const { id, name, digitalTemplateDetails } = data;
  const digitalTemplate = {
    digitalTemplateDetails,
    type: "digital",
  };

  return {
    id,
    name,
    type: data.type,
    status: "available",
    digitalTemplate,
  };
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

const list = ref<any>([]);
function getCurrentDate() {
  const currentDate = new Date().toISOString().split("T")[0];
  return currentDate;
}
function addPic(
  response: any,
  uploadFile: UploadFile,
  uploadFiles: UploadFiles
) {
  // console.log("addPic", response, uploadFile, uploadFiles)

  list.value.push({
    id: Math.random() * 1000000 + "",
    type: "image",
    imgUrl: response.data,
    name: uploadFile.name
  });
}

function addMessage() {
  list.value.push({
    id: Math.random() * 1000000 + "",
    type: "content",
    content: "",
    variables: [],
    name: "消息内容"
  });
}

function onDelete(item: any, index: number) {
  list.value.splice(index, 1);
}

function onUpload(item: any, index: number) {
  if (index < 1) return

  const temp = list.value[index];
  list.value[index] = list.value[index - 1];
  list.value[index - 1] = temp;
}

function onDownload(item: any, index: number) {
  if (index + 1 > list.value?.length || 1) return

  const temp = list.value[index];
  list.value[index] = list.value[index + 1];
  list.value[index + 1] = temp;
}
</script>

<template>
  <el-form label-position="top" :model="data">
    <el-form-item label="模板名称">
      <el-input :disabled="readonly" v-model="data.name" style="width: 50%;"></el-input>
    </el-form-item>
    <el-form-item label="企微触达方式">
      <el-select :disabled="readonly" placeholder="请选择" v-model="data.sendtype" style="width: 50%;">
        <!--
           sendMessage 发送消息
           addfriends 添加好友
   -->
        <el-option label="发送消息" value="sendMessage" />
        <el-option label="添加好友" value="addfriends" />
      </el-select>
    </el-form-item>

    <el-form-item label="消息内容">
      <TouchSettingContents :disabled="readonly" variables="variables" content="content"
        v-model="data.digitalTemplateDetails" buttonTitle="输入变量" />
    </el-form-item>

    <MicroEnterpriseDrag :disabled="readonly" @delete="onDelete" @upload="onUpload" @download="onDownload"
      style="margin-bottom: 6.5rem" v-model="list" />

    <div v-if="!readonly" class="FloatFixed">
      <el-upload :action=action :on-success="addPic" :auto-upload="true"
        :data="{ type: 'material', date: getCurrentDate() }" :show-file-list="false"
        class="upload-demo button-groupupload">
        <el-text type="primary" style="cursor: pointer;">
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
    </div>
  </el-form>
</template>
<style lang="scss" scoped>
.FloatFixed {
  &>div {
    height: 40px;
  }

  position: absolute;

  width: calc(100% - 5rem);
  bottom: 3.5rem;

  background-color: #fff;
}

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