<template>
  <el-drawer :destroy-on-close="true" :close-on-click-modal="false" :size="946" v-model="modalVisible"
    :with-header="false" class="pd-drawer">
    <div class="pd-drawer-header">{{ DrawerTitleMap[drawerType] }}</div>
    <div class="pd-drawer-content">
      <el-form :disabled="checkStringEqual(drawerType, DrawerType.Detail)" ref="formRef" :hide-required-asterisk="true"
        label-position="top" :model="formValues" class="form">
        <el-form-item :rules="[
          { required: true, message: '请输入黑名单名称' },
          {
            pattern: /^[\u4e00-\u9fa5a-zA-Z_\d]{1,18}$/,
            message: '仅支持数字、汉字、字母、下划线，不超过18个字符',
          },
        ]" label="黑名单名称" prop="blacklistName">
          <el-input  v-model="formValues.blacklistName" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item :rules="[{ required: true, message: '请选择黑名单类型' }]" label="黑名单类型" prop="blacklistType">
          <el-select  v-model="formValues.blacklistType" placeholder="请选择" clearable>
            <el-option v-for="item of BLACK_LIST_TYPE" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :rules="[{ max: 40, message: '最多可输入40字' }]" label="黑名单说明" prop="blacklistDesc">
          <el-input v-model="formValues.blacklistDesc" :autosize="{ minRows: 4 }" type="textarea" :show-word-limit="true"
            placeholder="请输入" />
        </el-form-item>
      </el-form>
      <el-tabs v-model="addType" type="card" :class="drawerType !== DrawerType.Detail
        ? 'add-type-tabs'
        : 'add-type-tabs detail'
        ">
        <el-tab-pane label="手动添加" :name="BlackAddTypeEnum.Manual">
          <HandAdd ref="handAddRef" :drawerType="drawerType" :formValues="formValues" />
        </el-tab-pane>
        <el-tab-pane label="规则添加（每天11点更新数据）" :name="BlackAddTypeEnum.StaticRule">
          <div class="pannel">
            <LogicalLine v-model="customRuleContent.logicalChar">
              <BehaviorGroup @add="attrsAdd" title="客户属性满足">
                <CustomAttr :custom="customRuleContent.customAttr" />
              </BehaviorGroup>
              <BehaviorGroup @add="behaviorAdd" title="客户行为满足">
                <CustomBehavior :custom="customRuleContent.customEvent" />
              </BehaviorGroup>
              <BehaviorGroup @add="sequenceAdd" title="行为序列满足">
                <CustomBehaviorSequence :custom="customRuleContent.eventSequence" />
              </BehaviorGroup>
            </LogicalLine>
          </div>
        </el-tab-pane>
        <el-tab-pane label="客户事件添加" :name="BlackAddTypeEnum.RealtimeEvent">
          <section-group :trigger-rule-content="triggerRuleContent" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="pd-drawer-footer">
      <el-button v-if="drawerType === DrawerType.Detail" @click="modalVisible = false"
        round>返回</el-button>
      <el-button v-if="drawerType !== DrawerType.Detail"  @click="modalVisible = false"
        round>取消</el-button>
      <el-button v-if="drawerType !== DrawerType.Detail"  @click.prevent="onSubmit(formRef)" round
        type="primary">保存</el-button>
    </div>
  </el-drawer>
</template>
<script lang="ts" setup>
import sectionGroup from "./section-group.vue";
import LogicalLine from "../../touch-flow/p/behavior/LogicalLine.vue";
import { CustomSearchDTO } from "../../touch-flow/p/behavior/marketing";
import BehaviorGroup from "../../touch-flow/p/behavior/BehaviorGroup.vue";
import CustomAttr from "../../touch-flow/p/behavior/CustomAttr.vue";
import CustomBehavior from "../../touch-flow/p/behavior/CustomBehavior.vue";
import CustomBehaviorSequence from "../../touch-flow/p/behavior/sequence/CustomBehaviorSequence.vue";
import { reactive, ref, defineProps, defineExpose } from "vue";
import { BlackAddTypeEnum, BLACK_LIST_TYPE } from "~/constants";
import API from "~/api/customer";
import { checkStringEqual } from "~/utils/common";
import { ElMessage, FormInstance } from "element-plus";
import HandAdd from "./handAdd.vue";

const props = defineProps(["getData"]);

const handAddRef = ref<any>();

enum DrawerType {
  Create = "create",
  Detail = "detail",
  Edit = "edit",
}

const triggerRuleContent = reactive({
      "eventA": {
        "customEvent": {
          "conditions": [{
            "conditions": [{}],
            "logicalChar": "或"
          }],
          "logicalChar": "或"
        },
        "logicalChar": "或"
      },
      "eventB": {
        "customEvent": {
          "conditions": [{
            "conditions": [{}],
            "logicalChar": "或"
          }],
          "logicalChar": "或"
        },
        "logicalChar": "或"
      }
    })

const customRuleContent = reactive<CustomSearchDTO>({
  customAttr: {
    conditions: [
      {
        conditions: [
          // {}
        ],
        logicalChar: "或",
      }
    ],
    logicalChar: "或",
  },
  customEvent: {
    conditions: [
      {
        conditions: [
          // {}
        ],
        logicalChar: "或",
      }
    ],
    logicalChar: "或",
  },
  eventSequence: {
    conditions: [
      {
        conditions: [
          // {}
        ],
        logicalChar: "或",
      }
    ],
    logicalChar: "或",
  },
  logicalChar: "或",
});

const DrawerTitleMap: any = {
  [DrawerType.Create]: "新建黑名单",
  [DrawerType.Detail]: "黑名单详情",
  [DrawerType.Edit]: "编辑黑名单",
};

const defaultFormValues = {
  blacklistName: "",
  blacklistDesc: "",
  blacklistType: "",
};
let formValues = reactive({ ...defaultFormValues });

const formRef = ref<FormInstance>();

const modalVisible = ref(false);
const drawerType = ref<string>(DrawerType.Create);
const addType = ref(BlackAddTypeEnum.Manual);

const handleModal = async (type: string, values?: any) => {
  addType.value = BlackAddTypeEnum.Manual;
  if (type === DrawerType.Create) {
    Object.assign(formValues, defaultFormValues);
  } else {
    let res = await API.blacklistDetail({ id: values?.id });
    if (!checkStringEqual(res?.code, 0)) return;
    Object.assign(formValues, res?.data);
  }
  drawerType.value = type;
  modalVisible.value = true;
};

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  try {
    await formEl.validate();
    let res;
    let customIds = null;
    if (drawerType.value === DrawerType.Create) {
      res = await API.addBlacklist({
        ...formValues,
        customIds,
      });
    } else {
      res = await API.updateBlacklist({
        ...formValues,
        customIds,
      });
    }
    if (checkStringEqual(res?.code, 0)) {
      await props?.getData?.();
      modalVisible.value = false;
    }
  } catch (error) {
    console.error(error);
  }
};

function attrsAdd() {
  let attr = customRuleContent.customAttr!.conditions!;

  const obj = {
    conditions: [{ conditions: {} }],
    logicalChar: "或",
  };

  attr.push({
    conditions: [obj],
    logicalChar: "或",
  });
}

function behaviorAdd() {
  let attr = customRuleContent.customEvent!.conditions!;

  const obj = {
    conditions: [{ conditions: {} }],
    logicalChar: "或",
  };

  attr.push({
    conditions: [obj],
    logicalChar: "或",
  });
}

function sequenceAdd() {
  let attr = customRuleContent.eventSequence!.conditions!;

  const obj = {
    conditions: [{ conditions: [{}] }],
    logicalChar: "或",
  };

  attr.push({
    conditions: [obj],
    logicalChar: "或",
  });
}

defineExpose({ handleModal });
</script>