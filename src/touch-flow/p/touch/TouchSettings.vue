<script setup lang="ts" name="TouchSettings">
import TouchSettingContents from '../touch/TouchSettingContents.vue'
import { reactive, ref, computed } from 'vue'
import { getQryMaterial } from "~/api";
import { MaterialTemplateEditDTO } from './touch-types'
import { createTemplatePopover } from '~/utils/touch-templates'

import ZnxTemplateVue from "~/utils/templates/ZnxTemplate.vue";
import SmsTemplateVue from "~/utils/templates/SmsTemplateVue.vue";
import AppTemplateVue from "~/utils/templates/AppTemplateVue.vue";
import DigitalTemplateVue from "~/utils/templates/DigitalTemplateVue.vue";
import OutboundTemplateVue from "~/utils/templates/OutboundTemplateVue.vue";

type TemplateComponents = typeof ZnxTemplateVue | typeof SmsTemplateVue | typeof AppTemplateVue | typeof DigitalTemplateVue | typeof OutboundTemplateVue
const origin: MaterialTemplateEditDTO = {
  material: {
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
  appPushTemplate: {
    content: "",
    contentVariables: [],
    jumpAppType: "app",
    pageLink: "",
    sceneCode: "",
    title: "",
    titleVariables: []
  },
  digitalTemplate: {
    digitalTemplateDetails: []
  },
  outboundTemplate: {
    outboundCode: "",
    variables: []
  },
  znxTemplate: {
    carouselId: "",
    moduleId: "",
    znxContent: "",
    znxContentVariables: [],
    znxTitle: "",
    znxTitleVariables: [],
    listTitle: "",
    titleVariables: []
  },
  smsTemplate: {
    content: "",
    sceneCode: "",
    variables: []
  },
  type: ''
};

const props = defineProps<{
  touch: MaterialTemplateEditDTO;
  readonly?: boolean
}>();

const comp = ref<TemplateComponents>()
const touchOptions = reactive<typeof origin>(JSON.parse(JSON.stringify(origin)));

async function refreshMaterialTemplate(clearStatus: boolean = true) {
  if ( clearStatus )
    touchOptions.id = -1

  const { material } = touchOptions

  let res = await getQryMaterial({
    ...material,
    type: touchOptions.type
  });

  if (res.data?.records) {
    touchOptions.material.templates = [{
      id: -1,
      name: "不使用模板"
    }, ...res.data.records];
  }
}

function updateData() {
  const { saveData: save } = comp.value!;

  const templateData = touchOptions[curPlatform.value.propKey]

  Object.assign(templateData, save())

  Object.assign(props.touch, touchOptions)
}

function handleAddDone() {
  refreshMaterialTemplate(false)
}

function assignData(val: any) {
  let res;

  if ( val === -1 ) {
    res = origin[curPlatform.value.propKey]

    res.content = {}
    res.name = ''
    res.sceneCode = ''
  } else res = touchOptions.material.templates.find((item: any) => item.id === val)

  console.log('assign', res, touchOptions, curPlatform.value.propKey)

  Object.assign(touchOptions[curPlatform.value.propKey], { ...res.content , id: res.id, name: res.name, status: res.status })
}

const platformOptions: Record<string, {
  button: {
    label: string,
    click: Function
  },
  propKey: string,
  template: TemplateComponents
}> = {
  'sms': {
    button: {
      label: "短信",
      click: () => createTemplatePopover("新建短信模板", "sms", undefined, undefined, props.readonly).then(handleAddDone)
    },
    propKey: "smsTemplate",
    template: SmsTemplateVue
  },
  'appPush': {
    button: {
      label: "app消息",
      click: () => createTemplatePopover("新建App消息模板", "appPush", undefined, undefined, props.readonly).then(handleAddDone)
    },
    propKey: "appPushTemplate",
    template: AppTemplateVue
  },
  'digital': {
    button: {
      label: "企微",
      click: () => createTemplatePopover("新建企微模板", "digital", undefined, undefined, props.readonly).then(handleAddDone)
    },
    propKey: "digitalTemplate",
    template: DigitalTemplateVue
  },
  'outbound': {
    button: {
      label: "智能外呼",
      click: () => createTemplatePopover("新建智能外呼模板", "outbound", undefined, undefined, props.readonly).then(handleAddDone)
    },
    propKey: "outboundTemplate",
    template: OutboundTemplateVue
  },
  'znx': {
    button: {
      label: "站内信",
      click: () => createTemplatePopover("新建站内信模板", "znx", undefined, undefined, props.readonly).then(handleAddDone)
    },
    propKey: "znxTemplate",
    template: ZnxTemplateVue
  },
}

const curPlatform = computed(() => platformOptions[touchOptions.type!])

defineExpose({ updateData  })
</script>

<template>
  <div>
    <el-form>
      <el-form-item label="触达通道">
        <el-select :disabled="readonly" placeholder="请选择通道" @change="refreshMaterialTemplate" v-model="touchOptions.type"
          style="width: 120px">
          <el-option value="sms" label="短信">手机短信</el-option>
          <el-option value="appPush" label="app消息">app消息</el-option>
          <el-option value="digital" label="企微">企微</el-option>
          <el-option value="outbound" label="智能外呼">智能外呼</el-option>
          <el-option value="znx" label="站内信">站内信</el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="touchOptions.type" label="选择模版">
        <el-select @change="assignData" :disabled="readonly" v-model="touchOptions.id" style="width: 120px">
          <el-option v-for="item in (touchOptions.material.templates)" :value="item.id" :label="item.name">
            <div class="template-option">
              <span>{{ item.name }}</span>
              <span class="template-desc" v-if="(item as any)?.content?.content">
                {{ (item as any).content.content }}
              </span>
            </div>
          </el-option>
        </el-select>
        <el-button :disabled="readonly" v-if="curPlatform" @click="curPlatform.button.click" ml-1rem type="primary" plain>
          新增{{ curPlatform.button.label }}模块版本</el-button>
      </el-form-item>

      <template v-if="curPlatform">
        <component ref="comp" :disabled="readonly" :is="curPlatform.template" :data="touchOptions[curPlatform.propKey]" />
      </template>
    </el-form>
  </div>
</template>