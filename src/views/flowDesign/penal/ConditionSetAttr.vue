<script setup lang="ts">
import Segmented from "~/components/Segmented";
import { useVModels } from "@vueuse/core";
import { StartNode } from "../nodes/Start/index";
import { Field } from "~/components/Render/interface";
import { FormProperty } from "~/views/flowDesign/index";
import { computed, inject, Ref, ref, watchEffect, reactive } from "vue";

const labelPosition = ref("single");
const sizeForm = reactive({
  name: "",
  region: "",
  date1: "",
  date2: "",
  date3: "",
  delivery: false,
  type: [],
  restrictions: "",
  resourceday: "",
  resourcetimes: "",
  desc: "",
  timenine: "",
  selectedType: "",
  weekday: "",
  monthday: "",
});

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

const $props = defineProps<ApprovalAttr>();
const $emits = defineEmits<{
  (e: "update:node", modelValue: StartNode): void;
}>();
const { node } = useVModels($props, $emits);
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
/**
 * 更改隐藏
 * @param row
 */
const changeHidden = (row: FormProperty) => {
  if (row.hidden) {
    row.readable = false;
    row.writeable = false;
    row.required = false;
  }
};
/**
 * 更改可写
 * @param row
 */
const changeWriteable = (row: FormProperty) => {
  if (row.writeable) {
    row.readable = false;
    row.hidden = false;
  } else {
    row.required = false;
  }
};
/**
 * 更改可读
 * @param row
 */
const changeReadable = (row: FormProperty) => {
  if (row.readable) {
    row.writeable = false;
    row.required = false;
    row.hidden = false;
  }
};
/**
 * 更改必填
 * @param row
 */
const changeRequired = (row: FormProperty) => {
  if (row.required) {
    row.writeable = true;
    row.readable = false;
    row.hidden = false;
  }
};

// 在子组件中定义 submitEvent 方法
const submitEvent = () => {
  // 在这里写入您的提交逻辑
  console.log("执行了提交逻辑");
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
</script>

<template>
  <div>
    <el-form ref="form" :model="sizeForm" label-width="auto" label-position="left">
      <el-form-item label="流程类型：">
        <el-radio-group v-model="labelPosition" label="position control">
          <el-radio-button label="single">定时型-单次</el-radio-button>
          <el-radio-button label="Repeat">定时型-重复</el-radio-button>
          <el-radio-button label="type">触发型</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <div v-if="labelPosition === 'single'">
        <!-- 单次模块内容 -->

        <el-form-item label="流程开始时间（任务开始时间）：">
          <div class="flex-column">
            <div>
              客户在&nbsp;&nbsp;
            </div>
            <el-date-picker v-model="sizeForm.date1" type="date" label="Pick a date" placeholder="Pick a date" style="width: 150px" />&nbsp;
            <el-time-picker v-model="sizeForm.date2" label="Pick a time" placeholder="Pick a time" style="width: 80px" />
            <div>
              &nbsp;&nbsp;进入流程
            </div>
          </div>
        </el-form-item>
      </div>

      <div v-else-if="labelPosition === 'Repeat'">
        <!-- 重复模块内容 -->
        <el-form-item label="流程有效期：">
          <el-col :span="12">
            <el-date-picker v-model="sizeForm.date3" type="daterange" range-separator="至" start-placeholder="Start date" end-placeholder="End date" />
          </el-col>

        </el-form-item>

        <el-form-item label="流程开始时间(任务开始时间):">
          <div class="flex-column">
            <div>
              客户在&nbsp;&nbsp;
            </div>
            <el-select v-model="sizeForm.selectedType" placeholder="请选择" style="width: 100px">
              <el-option value="month" label="月份">月份</el-option>
              <el-option value="week" label="周">周</el-option>
              <el-option value="day" label="天">天</el-option>
            </el-select>

            <el-select v-if="sizeForm.selectedType === 'month'" v-model="sizeForm.monthday" placeholder="选择月份的天数" style="width: 100px">
              <el-option v-for="day in daysInMonth" :key="day" :label="`${day}天`" :value="day"></el-option>
            </el-select>
            &nbsp;

            <el-select v-if="sizeForm.selectedType === 'week'" v-model="sizeForm.weekday" placeholder="选择星期几" style="width: 100px">
              <el-option v-for="(day, index) in daysOfWeek" :key="index" :label="`星期${day}`" :value="day"></el-option>
            </el-select>
            &nbsp;

            <el-time-picker v-model="sizeForm.timenine" placeholder="选择时间" style="width: 80px"></el-time-picker>
            &nbsp;

            <div>
              &nbsp;&nbsp;进入流程(启动任务)
            </div>
          </div>
        </el-form-item>

        <el-form-item label="进入流程限制:">

          <el-radio-group v-model="sizeForm.restrictions">
            <!-- Unrestricted
            Enter once
            Entered multiple times -->
            <el-radio label="Unrestricted">不限制</el-radio>
            <el-radio label="once">进入一次</el-radio>
            <el-radio label="multiple">进入多次</el-radio>
          </el-radio-group>
          <div class="flex-column" v-if="sizeForm.restrictions === 'multiple'">
            <div>
              当前流程，同一客户&nbsp;&nbsp;
            </div>
            <el-input style="width: 100px" v-model="sizeForm.resourceday" label="First Name" placeholder="First Name" />
            <div>天内，最多进入
              <el-input style="width: 100px" v-model="sizeForm.resourcetimes" label="First Name" placeholder="First Name" />
              &nbsp;&nbsp;次
            </div>
          </div>
        </el-form-item>
      </div>

      <div v-else-if="labelPosition === 'type'">
        <!-- 触发型模块内容 -->
        <el-form-item label="流程有效期：">
          <el-col :span="12">
            <el-date-picker v-model="sizeForm.date3" type="daterange" range-separator="至" start-placeholder="Start date" end-placeholder="End date" />
          </el-col>

        </el-form-item>

        <el-form-item label="触发事件A：">
          <div class="pannel">
            <span>添加事件</span>
            <span>添加事件组b</span>
          </div>
        </el-form-item>
      </div>

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
</style>
