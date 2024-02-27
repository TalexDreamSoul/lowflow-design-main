<script setup lang="ts" name="TouchSettings">
import TouchSettingContents from '../touch/TouchSettingContents.vue'
import { reactive, ref } from 'vue'
import { getQryMaterial } from "~/api";
const origin = {
  touch: {
    type: -1,
    content: "",
    variables: []
  },
  material: {
    type: "",
    beginTime: "",
    endTime: "",
    name: "",
    pageNum: 10,
    pageSize: -1,
    status: "available",
    templates: [{
      id: -1,
      name: '不使用模板'
    }]
  },
  touchTemplateContent: {

  },
};

const props = defineProps<{
  touch: any;
}>();

const touchOptions = reactive<typeof origin>(origin);

async function refreshMaterialTemplate() {
  touchOptions.touch.type = -1

  const { material } = touchOptions

  let res = await getQryMaterial(material);

  if (res.data?.records) {
    touchOptions.material.templates = [{
      id: -1,
      name: "不使用模板"
    }, ...res.data.records];
  }
}

const platformOptions: any = {
  'sms': "短信",
  'appPush': "app消息",
  'digital': "数字员工",
  'outbound': "智能外呼",
  'znx': "站内信",
}

</script>

<template>
  <div>
    <el-form>
      <el-form-item label="触达通道">
        <el-select placeholder="请选择通道" @change="refreshMaterialTemplate" v-model="touchOptions.material.type"
          style="width: 120px">
          <el-option value="sms" label="短信">手机短信</el-option>
          <el-option value="appPush" label="app消息">app消息</el-option>
          <el-option value="digital" label="数字员工">数字员工</el-option>
          <el-option value="outbound" label="智能外呼">智能外呼</el-option>
          <el-option value="znx" label="站内信">站内信</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择模版">
        <el-select v-model="touchOptions.touch.type" style="width: 120px">
          <el-option v-for="item in (touchOptions.material.templates)" :value="item.id" :label="item.name">
            <div class="template-option">
              <span>{{ item.name }}</span>
              <span class="template-desc" v-if="(item as any)?.content?.content">
                {{ (item as any).content.content }}
              </span>
            </div>
          </el-option>
        </el-select>
        <el-button v-if="platformOptions[touchOptions.material.type]" ml-1rem type="primary" plain>
          新增{{ platformOptions[touchOptions.material.type] }}模块版本</el-button>
      </el-form-item>
      <el-form-item label="触达内容">
        <TouchSettingContents content="content" variables="variables" v-model="touchOptions.touch" />
      </el-form-item>
    </el-form>
  </div>
</template>