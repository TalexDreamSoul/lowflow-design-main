<script setup lang="ts">
import Segmented from "~/components/Segmented";
import { useVModels } from "@vueuse/core";
import { StartNode } from "../nodes/Start/index";
import { Field } from "~/components/Render/interface";
import { FormProperty } from "~/views copy/flowDesign/index";
import { computed, inject, Ref, ref, watchEffect, reactive } from "vue";
import { Delete, CirclePlus, CircleClose } from "@element-plus/icons-vue";

import EventGroupFilter from "~/components/EventGroup/index.vue";
import BehaviorFoldingGroup from "~/components/BehaviorFoldingGroup/index.vue";
import { FlowNode } from "../nodes/Node";


import useNode from '../../flowDesign/hooks/useNode'; // 请替换为正确的路径



const labelPosition = ref("single");
const sizeForm = reactive({
  name: "",
  region: "",
  date1: "",
  date2: "",
  date3: "",
  delivery: false,
  value1: false,
  type: [],
  restrictions: "",
  resourceday: "",
  resourcetimes: "",
  desc: "",
  timenine: "",
  selectedType: "",
  weekday: "",
  monthday: "",
  num: 1,
});
const planB = ref(false);
const daysInMonth = computed(() => {
  const days = [];
  for (let i = 1; i <= 31; i++) {
    days.push(i);
  }
  return days;
});
const daysOfWeek = computed(() => ["一", "二", "三", "四", "五", "六", "日"]);

export interface ApprovalAttr {
  node: StartNode;
}
const logicalOperator = ref("and");

const $props = defineProps<ApprovalAttr>();
const $emits = defineEmits<{
  (e: "update:node", modelValue: StartNode): void;
}>();
const { node } = useVModels($props, $emits);
console.log(node.value, "StartNode");
const { fields } = inject<{
  fields: Ref<Field[]>;
}>("nodeHooks")!;

// 全部可写
const allWriteable = computed({
  get() {
    return node.value.formProperties.every((e) => e.writeable);
  },
  set(val) {
    node.value.formProperties.forEach((e) => (e.writeable = val));
    if (val) {
      allReadable.value = false;
      allHidden.value = false;
    } else {
      allRequired.value = false;
    }
  },
});

function onSubmit() {
  console.log("submit!");
}
// 全部必填
const allRequired = computed({
  get() {
    return node.value.formProperties.every((e) => e.required);
  },
  set(val) {
    node.value.formProperties.forEach((e) => (e.required = val));
    if (val) {
      allWriteable.value = true;
      allReadable.value = false;
      allHidden.value = false;
    }
  },
});
// 全部可读
const allReadable = computed({
  get() {
    return node.value.formProperties.every((e) => e.readable);
  },
  set(val) {
    node.value.formProperties.forEach((e) => (e.readable = val));
    if (val) {
      allWriteable.value = false;
      allHidden.value = false;
      allRequired.value = false;
    }
  },
});
// 全部隐藏
const allHidden = computed({
  get() {
    return node.value.formProperties.every((e) => e.hidden);
  },
  set(val) {
    node.value.formProperties.forEach((e) => (e.hidden = val));
    if (val) {
      allWriteable.value = false;
      allRequired.value = false;
      allReadable.value = false;
    }
  },
});
const { addNode } = useNode(node, fields);

// 在子组件中定义 submitEvent 方法
const submitEvent = () => {
  // 在这里写入您的提交逻辑
  console.log(node.value, "执行了提交逻辑");
  // addNode("approval",node.value)
  addNode("policySettings",node.value)

};

// 暴露 submitEvent 方法给父组件使用
defineExpose({ submitEvent });
watchEffect(() => {
  const formProperties = node.value.formProperties;
  node.value.formProperties = fields.value
    .filter((e) => e.value !== undefined)
    .map((e) => ({
      id: e.id,
      name: e.title,
      readable: e.props.disabled || false,
      writeable: !e.props.disabled || false,
      hidden: e.props.hidden || false,
      required: (e.props.required && !e.props.disabled) || false,
    }));
  node.value.formProperties.forEach((item) => {
    const properties = formProperties.find((f) => f.id === item.id);
    if (properties) {
      item.readable = properties.readable;
      item.writeable = properties.writeable;
      item.hidden = properties.hidden;
      item.required = properties.required;
    }
  });
});

/**
 * 添加条件条件组b
 */
const addGroup = () => {
  planB.value = !planB.value;
};
</script>

<template>
  <div>
    <el-form ref="form" :model="sizeForm" label-width="auto" label-position="left">

      <el-form-item label="选择策略器名称：">
        <el-input v-model="sizeForm.name" placeholder="填写名称" />

      </el-form-item>
      <el-form-item label="分流类型：">
        <el-radio-group v-model="labelPosition">
          <el-radio label="single">不分流</el-radio>
          <el-radio label="Repeat">按属性用户行为分流</el-radio>
          <el-radio label="type">按触发事件分流</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-collapse accordion>

        <el-collapse-item title="用户属性行为分流" name="4" v-if="labelPosition === 'Repeat'">
          <div>
            进入该期策略的用户需要满足以下条件：
          </div>
          <el-form-item label="">

            <div class="pannel">
              <div class="filter-container">
                <div class="logical-operator">
                  <div class="logical-operator__line"></div>
                  <el-switch v-model="logicalOperator" inline-prompt style="--el-switch-on-color: #409EFF; --el-switch-off-color: #67C23A" active-value="and" inactive-value="or" active-text="且" inactive-text="或" />
                </div>
                <div class="filter-option-content">

                  <el-collapse>
                    <el-collapse-item title=" 客户属性满足" class="custom-collapse-item">
                      <BehaviorFoldingGroup v-model="node.conditions" :filter-fields="fields" />

                    </el-collapse-item>
                    <el-collapse-item title=" 客户行为满足" class="custom-collapse-item">
                      <BehaviorFoldingGroup v-model="node.conditions" :filter-fields="fields" />

                    </el-collapse-item>

                    <el-collapse-item title=" 行为序列满足" class="custom-collapse-item">
                      <BehaviorFoldingGroup v-model="node.conditions" :filter-fields="fields" />

                    </el-collapse-item>
                  </el-collapse>
                </div>

              </div>

            </div>
          </el-form-item>
        </el-collapse-item>

        <el-collapse-item title="按触发事件分流" name="5" v-if="labelPosition === 'type'">
          <div class="flex-column">
            <div>
              进入该器策略的客户需要满足以下条件：在&nbsp;&nbsp;
            </div>
            <el-input-number v-model="sizeForm.num" :min="1" :max="10" />
            <el-select v-model="sizeForm.selectedType" placeholder="请选择" style="width: 100px">
              <el-option value="month" label="月份">分钟</el-option>
              <el-option value="week" label="周">小时</el-option>
              <el-option value="day" label="天">天</el-option>
            </el-select>
            <div>后判断客户
              <el-select v-model="sizeForm.selectedType" placeholder="请选择" style="width: 100px">
                <el-option value="month" label="月份">本人</el-option>
                <el-option value="week" label="周">小时</el-option>
                <el-option value="day" label="天">天</el-option>
              </el-select>
            </div>

          </div>
          <div>
            <BehaviorFoldingGroup v-model="node.conditions" :filter-fields="fields" />
          </div>
        </el-collapse-item>

        <el-collapse-item name="1">
          <template #title>
            <el-icon class="header-icon">
              <info-filled />
            </el-icon>
            延迟设置

          </template>
          <div>
            <div class="flex-column">

              <el-select v-model="sizeForm.selectedType" placeholder="请选择" style="width: 100px">
                <el-option value="month" label="月份">延迟</el-option>
                <el-option value="week" label="周">小时</el-option>
                <el-option value="day" label="天">天</el-option>
              </el-select>
              <el-input-number v-model="sizeForm.num" :min="1" :max="10" />
              <el-select v-model="sizeForm.selectedType" placeholder="请选择" style="width: 100px">
                <el-option value="month" label="月份">分钟</el-option>
                <el-option value="week" label="周">小时</el-option>
                <el-option value="day" label="天">天</el-option>
              </el-select>
              <div>针对符合该装置策略条件的客户

                <el-select v-model="sizeForm.selectedType" placeholder="请选择" style="width: 100px">
                  <el-option value="month" label="月份">发送触达并打上标签</el-option>
                  <el-option value="week" label="周">小时</el-option>
                  <el-option value="day" label="天">天</el-option>
                </el-select>
              </div>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="触达设置" name="2">
          <el-form-item label="触达通道：">
            <el-col :span="12">
              <el-select v-model="sizeForm.selectedType" placeholder="请选择" style="width: 100px">
                <el-option value="month" label="月份">发送触达并打上标签</el-option>
                <el-option value="week" label="周">小时</el-option>
                <el-option value="day" label="天">天</el-option>
              </el-select>
            </el-col>

          </el-form-item>

          <el-form-item label="选择模版：">
            <el-select v-model="sizeForm.selectedType" placeholder="请选择" style="width: 100px">
              <el-option value="month" label="月份">发送触达并打上标签</el-option>
              <el-option value="week" label="周">小时</el-option>
              <el-option value="day" label="天">天</el-option>
            </el-select><el-button type="primary">新增短信模块版本</el-button>
          </el-form-item>

          <el-form-item label="触达内容：">
            <div>定制组件位置</div>
          </el-form-item>

        </el-collapse-item>
        <el-collapse-item title="标签设置" name="3">

          <div class="flex-column">
            <div>
              符合该设备策略条件的用户打上&nbsp;&nbsp;
            </div>
            <el-select v-model="sizeForm.selectedType" placeholder="标签名称" style="width: 100px">
              <el-option value="month" label="月份">分钟</el-option>
              <el-option value="week" label="周">小时</el-option>
              <el-option value="day" label="天">天</el-option>
            </el-select>
            <div>
              标签
            </div>
          </div>
          <div>
            股票触达客户
          </div>
          <el-form-item label="列表触达客户总数：">
            <div>111定制组件位置</div>
          </el-form-item>
          <el-form-item label="策略器目标设置:">
            <el-switch v-model="sizeForm.value1" />
          </el-form-item>
        </el-collapse-item>

      </el-collapse>
    </el-form>
  </div>
</template>

<style scoped lang="scss">
.flex-column {
  display: -webkit-inline-box !important;
  align-items: flex-start !important;
  flex-direction: column !important;
}
.pannel {
  width: 100%;
  min-height: 200px;
  padding: 18px 15px;
  background-color: #f5f8fc;
}
.underright {
  width: 100%;
  height: 12px;
}
.filter-filter-item__add {
  position: absolute;
  right: 12px;
}

.flex-column {
  display: -webkit-inline-box !important;
  align-items: flex-start !important;
  flex-direction: column !important;
}
.pannel {
  width: 100%;
  min-height: 200px;
  padding: 18px 15px;
}
.underright {
  width: 100%;
  height: 12px;
}
.filter-filter-item__add {
  position: absolute;
  right: 12px;
}

:deep(.el-form-item) {
  margin-right: 0;
  margin-bottom: 0;
}
.el-collapse {
  border: none !important;
}
.custom-collapse-item .el-collapse-item__header {
  border-bottom: none !important;
  background-color: #f5f8fc !important;
}

.filter-container {
  border-radius: 3px;
  display: flex;

  .logical-operator {
    position: relative;
    display: flex;
    align-items: center;
    overflow: hidden;
    min-width: 60px;
    padding-right: 5px;

    .logical-operator__line {
      position: absolute;
      left: calc(32% - 1px);
      width: 30px;
      border-width: 1px 0 1px 1px;
      border-top-style: solid;
      border-bottom-style: solid;
      border-left-style: solid;
      border-top-color: var(--el-border-color);
      border-bottom-color: var(--el-border-color);
      border-left-color: var(--el-border-color);
      border-image: initial;
      border-right-style: initial;
      border-right-color: initial;
      border-radius: 5px 0 0 5px;
      height: calc(100% - 48px);

      &::before {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        transform: translateX(100%) translateY(-50%);
        width: 6px;
        height: 6px;
        border: var(--el-border);
        border-radius: 50%;
      }

      &::after {
        content: "";
        position: absolute;
        bottom: 0;
        right: 0;
        transform: translateX(100%) translateY(50%);
        width: 6px;
        height: 6px;
        border: var(--el-border);
        border-radius: 50%;
      }
    }
  }

  .filter-option-content {
    position: relative;
    width: 100%;

    .filter-item-rule {
      display: flex;
      align-items: center;
      min-height: 48px;
    }

    .filter-filter-item__add {
      border-style: dashed;
      width: 100%;
    }
  }
}
</style>
