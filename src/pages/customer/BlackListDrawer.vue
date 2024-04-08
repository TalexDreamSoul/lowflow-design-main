<script setup lang="ts" name="BlackListDrawer">
import EventGroup from "~/touch-flow/p/attr/condition/EventGroup.vue";
import {
  reactive,
  ref,
  defineProps,
  defineExpose,
  computed,
  watchEffect,
} from "vue";
import { BlackAddTypeEnum, BLACK_LIST_TYPE } from "~/constants";
import API from "~/api/customer";
import { checkStringEqual } from "~/utils/common";
import { ElMessage, FormInstance } from "element-plus";
import HandAdd from "./handAdd.vue";
import FilterGroup from "~/touch-flow/p/attr/condition/FilterGroup.vue";
import { CustomSearchDTO } from "~/touch-flow/touch-total";
import TouchEstimation from "~/touch-flow/page/TouchEstimation.vue";

const props = defineProps<{
  // data: any;
  type: "create" | "detail" | "edit";
  id: number;
}>();
const emits = defineEmits(["getData"]);

console.log("加载组件");
const drawerTitle = (() => {
  const map = {
    create: "新建黑名单",
    detail: "黑名单详情",
    edit: "编辑黑名单",
  };

  return computed(() => {
    const { type } = props;

    return map[type];
  });
})();

const handAddRef = ref<any>();

const defaultEventContent = {
  triggerRuleContent: {
    delayed: {
      delayedAction: "",
      delayedTime: 0,
      delayedType: "",
      delayedUnit: "",
      isDelayed: false,
    },
    eventA: {
      customEvent: {
        conditions: [
          {
            conditions: [],
            logicalChar: "或",
          },
        ],
        logicalChar: "或",
      },
      logicalChar: "或",
    },
    eventB: {
      customEvent: {
        conditions: [
          {
            conditions: [],
            logicalChar: "或",
          },
        ],
        logicalChar: "或",
      },
      logicalChar: "或",
    },
  },
};
const eventContent = reactive({ ...defaultEventContent });

const defaultRuleContent = {
  customAttr: {
    conditions: [],
    logicalChar: "或",
  },
  customEvent: {
    conditions: [],
    logicalChar: "或",
  },
  eventSequence: {
    conditions: [],
    logicalChar: "或",
  },
  logicalChar: "或",
};
const ruleContent = reactive<CustomSearchDTO>({ ...defaultRuleContent });

const defaultFormValues = {
  blacklistName: "",
  blacklistDesc: "",
  blacklistType: "",
};
const formValues = reactive<any>({ ...defaultFormValues });

const formRef = ref<FormInstance>();

const modalVisible = ref(false);
const addType = ref(BlackAddTypeEnum.Manual);

const onCancel = () => {
  for (const key in formValues) {
    formValues[key] = null;
  }
  Object.assign(eventContent, defaultEventContent);
  Object.assign(ruleContent, defaultRuleContent);
  modalVisible.value = false;
};

watchEffect(() => {
  $ignored: props;

  if (!props.type) return;

  console.log("UPDATED");

  async function _() {
    addType.value = BlackAddTypeEnum.Manual;

    if (props.type === "create") {
      Object.assign(formValues, defaultFormValues);
    } else {
      let res: any = await API.blacklistDetail({ id: props.id });
      if (!checkStringEqual(res?.code, 0)) return;
      console.log("a", res);
      Object.assign(formValues, res?.data);
      Object.assign(eventContent, res?.data?.eventContent);
      Object.assign(ruleContent, res?.data?.ruleContent);
    }

    modalVisible.value = true;
  }

  if (props.type === "create" || props.id !== -1) _();
});

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  try {
    await formEl.validate();
    let res: any;
    let customIds = handAddRef.value?.multipleSelection;
    if (props.type === "create") {
      res = await API.addBlacklist({
        ...formValues,
        customIds,
        ruleContent,
        eventContent:eventContent.triggerRuleContent,
      });
    } else {
      res = await API.updateBlacklist({
        ...formValues,
        ruleContent,
        eventContent:eventContent.triggerRuleContent,
      });
    }
    if (checkStringEqual(res?.code, 0)) {
      await emits("getData");
      onCancel();
    }
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <el-drawer :destroy-on-close="true" :close-on-click-modal="false" :size="946" v-model="modalVisible" :with-header="false" class="pd-drawer">
    <div class="pd-drawer-header">{{ drawerTitle }}</div>
    <div class="pd-drawer-content">
      <el-form :disabled="type === 'detail'" ref="formRef" :hide-required-asterisk="true" label-position="top" :model="formValues" class="form">
        <el-form-item :rules="[
    { required: true, message: '请输入黑名单名称' },
    {
      pattern: /^[\u4e00-\u9fa5a-zA-Z_\d]{1,18}$/,
      message: '仅支持数字、汉字、字母、下划线，不超过18个字符',
    },
  ]" label="黑名单名称" prop="blacklistName">
          <el-input v-model="formValues.blacklistName" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item :rules="[{ required: true, message: '请选择黑名单类型' }]" label="黑名单类型" prop="blacklistType">
          <el-select v-model="formValues.blacklistType" placeholder="请选择" clearable>
            <el-option v-for="item of BLACK_LIST_TYPE" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :rules="[{ max: 40, message: '最多可输入40字' }]" label="黑名单说明" prop="blacklistDesc">
          <el-input v-model="formValues.blacklistDesc" :autosize="{ minRows: 4 }" type="textarea" :show-word-limit="true" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <el-tabs v-model="addType" type="card" v-if="type !== 'detail'" class="add-type-tabs">
        <el-tab-pane label="手动添加" :name="BlackAddTypeEnum.Manual">
          <HandAdd ref="handAddRef" :drawerType="type" :formValues="formValues" />
        </el-tab-pane>
        <el-tab-pane label="规则添加（每天11点更新数据）" :name="BlackAddTypeEnum.StaticRule">
          <FilterGroup :custom-rule-content="ruleContent" :readonly="type === 'detail'"/>
           <TouchEstimation  :readonly="type === 'detail'" :custom-rule-content="ruleContent" />
        
        </el-tab-pane>
        <el-tab-pane label="客户事件添加" :name="BlackAddTypeEnum.RealtimeEvent">
          <EventGroup :p="eventContent" :readonly="type === 'detail'"/>
        </el-tab-pane>
      </el-tabs>
      <div class="detail" v-if="type === 'detail'">
        <div >
          <FilterGroup :custom-rule-content="ruleContent" :readonly="type === 'detail'"/>
        </div>
        <div >
          <EventGroup :p="eventContent" :readonly="type === 'detail'"/>
        </div>
        <div class="item">
          <HandAdd ref="handAddRef" :drawerType="type" :formValues="formValues" />
        </div>
      </div>
    </div>
    <div class="pd-drawer-footer">
      <el-button @click="onCancel" round>
        {{ type === 'detail' ? '返回' : '取消' }}
      </el-button>
      <el-button v-if="type !== 'detail'" @click.prevent="onSubmit(formRef)" round type="primary">保存</el-button>
    </div>
  </el-drawer>
</template>

<style lang="scss">
@import "~/touch-flow/flow-style.scss";
</style>