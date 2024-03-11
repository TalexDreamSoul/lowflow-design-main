<script setup lang="ts" name="ZnxTemplate">
import { reactive, ref, watchEffect } from "vue";

import type { UploadFile, UploadFiles } from "element-plus";
import MicroEnterpriseDrag from "./MicroEnterpriseDrag.vue";

const dialogImageUrl = ref("");
const dialogVisible = ref(false);

const action = `/api/uploadMaterialFile`;
const props = defineProps<{
  data: any;
  type?: any;
  readonly?: boolean;
}>();

const origin = {
  id: "",
  name: "",
  status: "",
  type: "digital",
  digitalTemplate: {
    digitalTemplateDetails: [],
    type: "",
  },

  // digitalTemplateDetails: {
  //   content: "",
  //   imgUrl: "",
  //   type: "",
  //   variables: [
  //     {
  //       field: "",
  //       fieldName: "",
  //       labelId: 0,
  //       labelName: "",
  //       labelValue: [],
  //       type: "",
  //       variables: [
  //         {
  //           compareValue: "",
  //           defaultValue: "",
  //           fieldOp: "",
  //           fieldValue: "",
  //         },
  //       ],
  //     },
  //   ],
  // },
};

const list = ref<any>([]);
const data = reactive<typeof origin>(origin);

watchEffect(() => {
  const _data = props.data?.value || props.data;
  if (!_data) return setTimeout(() => assignData('addFriend'), 200);

  Object.assign(data, _data);
  list.value = _data.content.digitalTemplateDetails;
  data.digitalTemplate.type = _data.content.type;
});

function saveData() {
  const { id, name } = data;
  const digitalTemplate: any = {
    digitalTemplateDetails: list.value,
    type: data.digitalTemplate.type,
  };

  // if ( digitalTemplateDetails?.length ) {
  //   digitalTemplate.digitalTemplateDetails = digitalTemplateDetails
  // }

  console.log("digital template", digitalTemplate)

  return props.type == "details" || props.type == "update"
    ? {
        id,
        name,
        type: data.type,
        status: "available",
        digitalTemplate,
      }
    : {
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

function getCurrentDate() {
  const currentDate = new Date().toISOString().split("T")[0];
  return currentDate;
}
function addPic(response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) {
  // console.log("addPic", response, uploadFile, uploadFiles)

  list.value.push({
    // id: Math.random() * 1000000 + "",
    type: "image",
    imgUrl: response.data,
    name: uploadFile.name,
  });
}

function addMessage() {
  list.value.push({
    // id: Math.random() * 1000000 + "",
    type: "content",
    content: "",
    variables: [],
    name: "消息内容",
  });
}

function onDelete(item: any, index: number) {
  list.value.splice(index, 1);
}

function onUpload(item: any, index: number) {
  if (index < 1) return;

  const temp = list.value[index];
  list.value[index] = list.value[index - 1];
  list.value[index - 1] = temp;
}

function onDownload(item: any, index: number) {
  if (index + 1 > list.value?.length || 1) return;

  const temp = list.value[index];
  list.value[index] = list.value[index + 1];
  list.value[index + 1] = temp;
}
function assignData(val: any) {
  data.digitalTemplate.type = val;
  if (val == "addFriend") {
    list.value = [
      {
        // id: Math.random() * 1000000 + "",
        type: "content",
        content: "",
        variables: [],
        name: "消息内容",
      },
    ];
  } else {
    list.value = [];
  }
}
</script>

<template>
  <el-form label-position="top" :model="data">
    <el-form-item label="模板名称">
      <el-input :disabled="readonly" v-model="data.name" style="width: 50%"></el-input>
    </el-form-item>
    <el-form-item label="企微触达方式">
      <el-select
        :disabled="readonly"
        @change="assignData"
        placeholder="请选择"
        v-model="data.digitalTemplate.type"
        style="width: 50%"
      >
        <el-option label="发送消息" value="message" />
        <el-option label="添加好友" value="addFriend" />
      </el-select>
    </el-form-item>

    <MicroEnterpriseDrag
      :readonly="readonly"
      @delete="onDelete"
      @upload="onUpload"
      @download="onDownload"
      style="margin-bottom: 6.5rem"
      v-model="list"
    />

    <div v-if="data.digitalTemplate.type != 'addFriend'">
      <div v-if="!readonly" class="FloatFixed">
        <el-upload
          :action="action"
          :on-success="addPic"
          :auto-upload="true"
          :data="{ type: 'material', date: getCurrentDate() }"
          :show-file-list="false"
          class="upload-demo button-groupupload"
        >
          <el-text type="primary" style="cursor: pointer">
            <el-icon size="14">
              <CirclePlusFilled />
            </el-icon>
            添加图片
          </el-text>
        </el-upload>
        <div class="button-group">
          <el-text type="primary" style="cursor: pointer" @click="addMessage">
            <el-icon size="14">
              <CirclePlusFilled />
            </el-icon>
            添加消息内容
          </el-text>
        </div>
      </div>
    </div>
  </el-form>
</template>
<style lang="scss" scoped>
.FloatFixed {
  & > div {
    height: 40px;
  }

  position: absolute;

  width: calc(100% - 4rem);
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
