<script setup lang="ts" name="TouchSettings">
import { reactive, ref, computed, watchEffect, nextTick, onMounted, watch } from "vue";
import { getQryMaterial } from "~/api";
import { MaterialTemplateEditDTO } from "./touch-types";
import { createTemplatePopover } from "~/utils/touch-templates";
import {
  dictFilterTree,
} from "~/api/index";
import ZnxTemplateVue from "~/utils/templates/ZnxTemplate.vue";
import SmsTemplateVue from "~/utils/templates/SmsTemplateVue.vue";
import AppTemplateVue from "~/utils/templates/AppTemplateVue.vue";
import DigitalTemplateVue from "~/utils/templates/DigitalTemplateVue.vue";
import OutboundTemplateVue from "~/utils/templates/OutboundTemplateVue.vue";
import { validatePropValue } from "~/touch-flow/flow-utils";
import { ElMessage } from "element-plus";

type TemplateComponents =
  | typeof ZnxTemplateVue
  | typeof SmsTemplateVue
  | typeof AppTemplateVue
  | typeof DigitalTemplateVue
  | typeof OutboundTemplateVue;
const origin: MaterialTemplateEditDTO = {
  material: {
    beginTime: "",
    endTime: "",
    name: "",
    pageNum: 10,
    pageSize: -1,
    status: "available",
    templates: [
      {
        id: -1,
        name: "不使用模板",
      },
    ],
  },
  appPushTemplate: {
    content: "",
    contentVariables: [],
    jumpAppType: "app",
    pageLink: "",
    sceneCode: "",
    title: "",
    titleVariables: [],
  },
  digitalTemplate: {
    digitalTemplateDetails: [],
  },
  outboundTemplate: {
    outboundCode: "",
    variables: [],
  },
  znxTemplate: {
    carouselId: "",
    moduleId: "",
    znxContent: "",
    znxContentVariables: [],
    znxTitle: "",
    znxTitleVariables: [],
    listTitle: "",
    titleVariables: [],
  },
  smsTemplate: {
    content: "",
    sceneCode: "",
    variables: [],
  },
  type: "",
  id: -1
};

const props = defineProps<{
  touch: MaterialTemplateEditDTO;
  readonly?: boolean;
}>();

const comp = ref<TemplateComponents>();
const showComp = ref<boolean>(false);
const touchOptions = reactive<typeof origin>(JSON.parse(JSON.stringify(origin)));

const disabled = computed(() => {
  return props.readonly || (touchOptions.id !== -1);
});

watchEffect(() => {
  if (!props.touch?.id) return;

  setTimeout(() => {

    Object.assign(touchOptions, props.touch);

    console.log("touch", Object.freeze({ ...props.touch }), Object.freeze({ ...touchOptions }), touchOptions)
    nextTick(() => {
      refreshMaterialTemplate(false).then(() => assignData(touchOptions.id))
    });
  })
});

type MaterialType = {
  name: string;
  value: string;
};

const materialType = ref<MaterialType[]>([]);

// 展示几个触达内容
const getDictmaterialType = async () => {
  const res: any = await dictFilterTree();
  let { materialTypes } = res?.data;
  let getDictmaterialList = [];
  getDictmaterialList = materialTypes.map(
    (item: { code: any; message: any }) => {
      return {
        value: item.code,
        name: item.message,
      };
    }
  );
  // getDictmaterialList.unshift({ value: "all", name: "模版总览" });
  materialType.value = getDictmaterialList;

  // console.log(materialType, "materialType");

};
onMounted(async () => {
  getDictmaterialType();
});

async function refreshMaterialTemplate(clearStatus: boolean = true) {
  if (clearStatus) touchOptions.id = -1;

  const { material } = touchOptions;

  const res: any = await getQryMaterial({
    ...material,
    type: touchOptions.type,
  });

  if (res.data?.records) {
    touchOptions.material.templates = [
      {
        id: -1,
        name: "不使用模板",
      },
      ...res.data.records,
    ];

    assignData(touchOptions.id)
  }
}

function validateData(type: string, formData: any) {
  const res = formData;

  function _(key: string, val: any) {
    if (Array.isArray(val)) {
      console.log("123 array validate", key, val);

      for (let variable of val) {
        if (variable.hasOwnProperty('field')) {
          if (!validatePropValue(variable.field)) return false
          if (!variable.fieldName && !variable.labelName) return false

          if (!variable.variables?.length) {
            return false
          }
        }
      }
      // console.log("vd ___", key, val)
    }

    return true;
  }

  // 获得 res 中每一个key 判断是否为空
  const key = type.indexOf('Template') === -1 ? `${type}Template` : type
  // console.log("vd", key, type, res);
  if (
    !validatePropValue(res[key], {
      ignores: {
        variables: {
          validate: _,
        },
        titleVariables: {
          validate: _,
        },
        znxContentVariables: {
          validate: _,
        },
        znxTitleVariables: {
          validate: _,
        },
        contentVariables: {
          validate: _,
        },
      },
    })
  ) {
    return ElMessage.error({
      message: "请完整填写信息！",
    }), false
  }

  return true
}

function updateData() {
  const _comp = comp.value;
  if (_comp) {
    const { saveData: save } = _comp

    const formData = save()
    console.log('t', curPlatform.value.propKey, touchOptions, props)
    if (!validateData(curPlatform.value.propKey, formData)) return false

    // const templateData = touchOptions[curPlatform.value.propKey];

    Object.assign(touchOptions, formData);
  }

  Object.assign(props.touch, touchOptions);

  delete props.touch.material.templates

  return true
}

function handleAddDone() {
  refreshMaterialTemplate(false);
}

function assignData(val: any) {
  showComp.value = false;

  let res;

  if (val === -1) {
    res = origin[curPlatform.value.propKey];

    // 不使用模板时使用 touch 中的参数
    res.content = touchOptions[curPlatform.value.propKey];
    res.name = "";
    res.sceneCode = "";

  } else res = touchOptions.material.templates.find((item: any) => item.id === val);

  console.log(',,', touchOptions, curPlatform.value.propKey, res)


  Object.assign(touchOptions[curPlatform.value.propKey], {
    ...res.content,
    id: res.id,
    name: res.name || props.touch.name,
    status: res.status,
  });

  setTimeout(() => (showComp.value = true), 10);
}

const platformOptions: Record<
  string,
  {
    button: {
      label: string;
      click: Function;
    };
    propKey: string;
    template: TemplateComponents;
  }
> = {
  sms: {
    button: {
      label: "短信",
      click: () =>
        createTemplatePopover(
          "新建短信模板",
          "sms",
          undefined,
          undefined,
          props.readonly
        ).then(handleAddDone),
    },
    propKey: "smsTemplate",
    template: SmsTemplateVue,
  },
  appPush: {
    button: {
      label: "app消息",
      click: () =>
        createTemplatePopover(
          "新建App消息模板",
          "appPush",
          undefined,
          undefined,
          props.readonly
        ).then(handleAddDone),
    },
    propKey: "appPushTemplate",
    template: AppTemplateVue,
  },
  digital: {
    button: {
      label: "企微",
      click: () =>
        createTemplatePopover(
          "新建企微模板",
          "digital",
          undefined,
          undefined,
          props.readonly
        ).then(handleAddDone),
    },
    propKey: "digitalTemplate",
    template: DigitalTemplateVue,
  },
  outbound: {
    button: {
      label: "智能外呼",
      click: () =>
        createTemplatePopover(
          "新建智能外呼模板",
          "outbound",
          undefined,
          undefined,
          props.readonly
        ).then(handleAddDone),
    },
    propKey: "outboundTemplate",
    template: OutboundTemplateVue,
  },
  znx: {
    button: {
      label: "站内信",
      click: () =>
        createTemplatePopover(
          "新建站内信模板",
          "znx",
          undefined,
          undefined,
          props.readonly
        ).then(handleAddDone),
    },
    propKey: "znxTemplate",
    template: ZnxTemplateVue,
  },
};

const curPlatform = computed(() => platformOptions[touchOptions.type!]);

watch(() => touchOptions.type, (val, oldVal) => {
  if (!oldVal) return

  const propKey = `${oldVal}Template`

  delete touchOptions[propKey]

  touchOptions[propKey] = JSON.parse(JSON.stringify(origin[propKey]))
})

defineExpose({ updateData });
</script>

<template>
  <div>
    <el-form>
      <el-form-item label="触达通道">
        <el-select :disabled="readonly" placeholder="请选择通道" @change="refreshMaterialTemplate"
          v-model="touchOptions.type" style="width: 120px">
          <!-- 
          <el-option value="sms" label="短信">手机短信</el-option>
          <el-option value="appPush" label="app消息">appPush</el-option>
          <el-option value="digital" label="企微">企微</el-option>
          <el-option value="outbound" label="智能外呼">智能外呼</el-option>
          <el-option value="znx" label="站内信">站内信</el-option> -->
          <el-option v-for="(item, key) in materialType" :key="key" :label="item?.name" :value="item?.value" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="touchOptions.type" label="选择模版">
        <el-select @change="assignData" :disabled="readonly" v-model="touchOptions.id" style="width: 120px">
          <el-option v-for="item in touchOptions.material.templates" :value="item.id" :label="item.name">
            <div class="template-option">
              <span>{{ item.name }}</span>
              <span class="template-desc" v-if="(item as any)?.content?.content">
                {{ (item as any).content.content }}
              </span>
            </div>
          </el-option>
        </el-select>
        <el-button :disabled="readonly" v-if="curPlatform" @click="curPlatform.button.click" ml-1rem type="primary"
          plain>
          新增{{ curPlatform.button.label }}模块版本</el-button>
      </el-form-item>

      <template v-if="curPlatform && showComp">
        <component ref="comp" :readonly="disabled" :is="curPlatform.template"
          :data="touchOptions[curPlatform.propKey]" />
      </template>
    </el-form>
  </div>
</template>
