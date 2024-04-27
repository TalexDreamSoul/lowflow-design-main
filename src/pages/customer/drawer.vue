<template>
  <el-drawer
    :destroy-on-close="true"
    :close-on-click-modal="false"
    :size="946"
    v-model="modalVisible"
    :with-header="false"
    class="pd-drawer"
  >
    <div class="pd-drawer-header">{{ DrawerTitleMap[drawerType] }}</div>
    <div class="pd-drawer-content">
      <el-form
        :disabled="checkStringEqual(drawerType, DrawerType.Detail)"
        ref="formRef"
        :hide-required-asterisk="true"
        label-position="top"
        :model="formValues"
        class="form"
      >
        <el-form-item
          :rules="[
            { required: true, message: '请输入黑名单名称' },
            {
              pattern: /^[\u4e00-\u9fa5a-zA-Z_\d]{1,50}$/,
              message: '仅支持数字、汉字、字母、下划线，不超过50个字符',
            },
          ]"
          label="黑名单名称"
          prop="blacklistName"
        >
          <el-input v-model="formValues.blacklistName" placeholder="请输入" clearable maxlength="50"/>
        </el-form-item>
        <el-form-item
          :rules="[{ required: true, message: '请选择黑名单类型' }]"
          label="黑名单类型"
          prop="blacklistType"
        >
          <el-select v-model="formValues.blacklistType" placeholder="请选择" clearable>
            <el-option
              v-for="item of BLACK_LIST_TYPE"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :rules="[{ max: 140, message: '最多可输入140字' }]"
          label="黑名单说明"
          prop="blacklistDesc"
        >
          <el-input
            v-model="formValues.blacklistDesc"
            :autosize="{ minRows: 4 }"
            type="textarea"
            :show-word-limit="true"
            placeholder="请输入"
          />
        </el-form-item>
      </el-form>
      <el-tabs
        v-model="addType"
        type="card"
        v-if="drawerType !== DrawerType.Detail"
        :class="
          drawerType !== DrawerType.Detail ? 'add-type-tabs' : 'add-type-tabs detail'
        "
      >
        <el-tab-pane label="手动添加" :name="BlackAddTypeEnum.Manual">
          <HandAdd ref="handAddRef" :drawerType="drawerType" :formValues="formValues" />
        </el-tab-pane>
        <el-tab-pane
          label="规则添加（每天11点更新数据）"
          :name="BlackAddTypeEnum.StaticRule"
        >
          <div class="pannel">
            <FilterGroup :outside="true" :custom-rule-content="ruleContent" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="客户事件添加" :name="BlackAddTypeEnum.RealtimeEvent">
          <EventGroup  :outside="true" :p="eventContent" />
        </el-tab-pane>
      </el-tabs>
      <div class="detail" v-if="drawerType === DrawerType.Detail">
        <div class="item">
          <FilterGroup :outside="true" :custom-rule-content="ruleContent" />
        </div>
        <div class="item">
          <!-- <EventGroup :p="eventContent" /> -->
        </div>
        <div class="item">
          <HandAdd ref="handAddRef" :drawerType="drawerType" :formValues="formValues" />
        </div>
      </div>
    </div>
    <div class="pd-drawer-footer">
      <el-button v-if="drawerType === DrawerType.Detail" @click="onCancel" round
        >返回</el-button
      >
      <el-button v-if="drawerType !== DrawerType.Detail" @click="onCancel" round
        >取消</el-button
      >
      <el-button
        v-if="drawerType !== DrawerType.Detail"
        @click.prevent="onSubmit(formRef)"
        round
        type="primary"
        >保存</el-button
      >
    </div>
  </el-drawer>
</template>
<script lang="ts" setup>
import EventGroup from "~/touch-flow/p/attr/condition/EventGroup.vue";
import { reactive, ref, defineProps, defineExpose } from "vue";
import { BlackAddTypeEnum, BLACK_LIST_TYPE } from "~/constants";
import API from "~/api/customer";
import { checkStringEqual } from "~/utils/common";
import { ElMessage, FormInstance } from "element-plus";
import HandAdd from "./handAdd.vue";
import FilterGroup from "~/touch-flow/p/attr/condition/FilterGroup.vue";
import { CustomSearchDTO } from "~/touch-flow/touch-total";

const props = defineProps(["getData"]);

const handAddRef = ref<any>();

enum DrawerType {
  Create = "create",
  Detail = "detail",
  Edit = "edit",
}

const defaultEventContent = {
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
          conditions: [{}],
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
          conditions: [{}],
          logicalChar: "或",
        },
      ],
      logicalChar: "或",
    },
    logicalChar: "或",
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
let formValues = reactive<any>({ ...defaultFormValues });

const formRef = ref<FormInstance>();

const modalVisible = ref(false);
const drawerType = ref<string>(DrawerType.Create);
const addType = ref(BlackAddTypeEnum.Manual);

const onCancel = () => {
  for (const key in formValues) {
    formValues[key] = null;
  }
  Object.assign(eventContent, defaultEventContent);
  Object.assign(ruleContent, defaultRuleContent);
  modalVisible.value = false;
};

const handleModal = async (type: string, values?: any) => {
  addType.value = BlackAddTypeEnum.Manual;
  if (type === DrawerType.Create) {
    Object.assign(formValues, defaultFormValues);
  } else {
    let res = await API.blacklistDetail({ id: values?.id });
    if (!checkStringEqual(res?.code, 0)) return;
    Object.assign(formValues, res?.data);
    Object.assign(eventContent, res?.data?.eventContent);
    Object.assign(ruleContent, res?.data?.ruleContent);
  }
  drawerType.value = type;
  modalVisible.value = true;
};

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  try {
    await formEl.validate();
    let res;
    let customIds = handAddRef.value?.multipleSelection;
    if (drawerType.value === DrawerType.Create) {
      res = await API.addBlacklist({
        ...formValues,
        customIds,
        ruleContent,
        eventContent,
      });
    } else {
      res = await API.updateBlacklist({
        ...formValues,
        ruleContent,
        eventContent,
      });
    }
    if (checkStringEqual(res?.code, 0)) {
      await props?.getData?.();
      onCancel();
    }
  } catch (error) {
    console.error(error);
  }
};

defineExpose({ handleModal });
</script>
