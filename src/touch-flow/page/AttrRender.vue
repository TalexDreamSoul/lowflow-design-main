<script setup lang="ts" name="AttrRender">
import NodeRender from "./NodeRender.vue";
import AttrScroller from "./AttrScroller.vue";
import { ref, computed, watchEffect, watch, toRefs } from "vue";

type AttrType = any; //number | string | boolean | Array<Number> | Array<string>

const props = defineProps<{
  item: AttrType;
  obj?: any;
  attrs: any;
  conditions: any[];
  selected?: string;
  readonly?: boolean;
  outside?: boolean;
  placeholder?: string;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", value: AttrType): void;
}>();

if (!props.conditions) {
  console.error("[LOW-FLOW] Make sure that this component will not be used as appPUSH touch result. Here are the stacks!")
} else console.log("AttrRender Conditions", props.conditions)

console.log('AttrRender', props)

const timeInterval = ref<any>();
const _ph = computed(() => props.placeholder ?? "请输入值");
const timePointSection = ref<"past" | "future">("past");
const timeCastSection = ref<"within" | "without">("within");
const type = computed(() =>
  props.selected
    ? ((_: any) => _.labelValueType || _.labelType || _.fieldType)(props.selected)
    : props.attrs.filter(
      (attr: any) =>
        attr.field === props.item.field //|| attr.labelName === props.item.labelName
    )?.[0]?.fieldType ?? "none"
);

const doTouchFlow = computed(() => {
  const { item } = props

  return item.field === 'touchId'
})

watchEffect(() => {
  if (!timeInterval.value) {
    return;
  }

  if (!timeInterval.value?.length) {
    props.item.timeCondition.startTime = timeInterval.value;
    return;
  }

  const [startTime, endTime] = timeInterval.value;

  props.item.timeCondition.startTime = startTime;
  props.item.timeCondition.endTime = endTime;
});

watchEffect(() => {
  // const { operator } = props.item

  // props.item.fieldOp = ''

  // if (operator.indexOf('时间') === -1) return

  if (!props.item.timeCondition) {
    props.item.timeCondition = {
      endDay: 0,
      endTime: "",
      isFuture: false,
      isWithin: false,
      startDay: 0,
      startTime: "",
      timeType: "", //operator === '绝对时间' ? 'absolute' : 'relative'
    };
  }
});

const operatorOptions: Record<
  string,
  { label: string; type: string; value: string }[]
> = {
  绝对时间: [
    {
      label: "等于",
      type: "eq",
      value: "eq",
    },
    {
      label: "不等于",
      type: "ne",
      value: "ne",
    },
    {
      label: "大于等于",
      type: "ge",
      value: "ge",
    },
    {
      label: "大于",
      type: "gt",
      value: "gt",
    },
    {
      label: "小于等于",
      type: "le",
      value: "le",
    },
    {
      label: "小于",
      type: "lt",
      value: "lt",
    },
    {
      label: "区间",
      type: "in",
      value: "in",
    },
  ],
  相对时间: [
    {
      label: "相对当前时间点",
      type: "now",
      value: "now",
    },
    {
      label: "相对当前时间区间",
      type: "in",
      value: "in",
    },
  ],
};

const { item } = toRefs(props);

watch(() => item.value.fieldOp, (newVal, oldVal) => {
  console.log(`output->props.item.fieldOp`, newVal, oldVal, item.value.timeCondition.timeType);
  item.value.timeCondition.timeType = '';
});
function onOpChange(val: any) {
  timeInterval.value = null;

  const arr = operatorOptions[props.item.fieldOp];

  const item = arr.find((item: any) => item.type === val);
  props.item.timeCondition.timeType = item!.type;
}

function onTimePointChange(val: typeof timePointSection.value) {
  props.item.timeCondition.isFuture = val === "future";
}

function onTimeCastChange(val: typeof timeCastSection.value) {
  props.item.timeCondition.isWithin = val === "within";
}

function getNodes() {
  console.log("props", props)
}
</script>

<template>
  <AttrScroller v-if="doTouchFlow" :readonly="readonly" :outside="outside"  v-model="item.fieldReplaceValue" />
  <NodeRender :conditions="conditions" :obj="obj" :readonly="readonly" v-model="item.fieldReplaceValue"
    v-else-if="item.field === 'nodeId'" />
  <el-select style="width: 120px" v-else-if="item.field === 'touchResult'" :disabled="readonly" v-model="item.fieldReplaceValue">
    <el-option value="pushRead" label="推送已读">推送已读</el-option>
    <el-option value="message" label="消息送达">消息送达</el-option>
    <el-option value="messageClick" label="消息点击">消息点击</el-option>
  </el-select>

  <div v-else-if="obj?.type !== 'label' && !(item.fieldOp?.indexOf('空') !== -1)" class="AttrRender"
    style="display: flex; gap: 1rem">
    <template v-if="type === 'num'">
      <template v-if="item.fieldOp === '区间'">
        <el-input :placeholder="_ph" :disabled="readonly" v-model.number="item.fieldValue" />
        <el-text>到</el-text>
        <el-input :placeholder="_ph" :disabled="readonly" v-model.number="item.fieldRangeValue" />
      </template>
      <el-input v-else :placeholder="_ph" :disabled="readonly" v-model.number="item.fieldValue" />
    </template>

    <el-input :placeholder="_ph" :disabled="readonly" v-else-if="type === 'text'" v-model="item.fieldValue" />

    <template v-else-if="type === 'date'">
      <el-select :placeholder="_ph" style="width: 193px" @change="onOpChange" :disabled="readonly"
        v-model="item.timeCondition.timeType" v-if="item.fieldOp.indexOf('时间') !== -1">
        <el-option v-for="(each, index) in operatorOptions[item.fieldOp]" :key="index" :value="each.type"
          :label="each.label" />
      </el-select>
      <template v-if="item.fieldOp === '绝对时间'">
        <el-date-picker :disabled="readonly" value-format="YYYY-MM-DD" v-if="item.timeCondition.timeType !== 'in'"
          v-model="timeInterval" type="date" placeholder="选择时间" />
        <el-date-picker :disabled="readonly" v-else v-model="timeInterval" value-format="YYYY-MM-DD" type="daterange"
          range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" />
      </template>
      <template v-else-if="item.fieldOp === '相对时间'">
        <el-select :placeholder="_ph" :disabled="readonly" style="width: 120px" @change="onTimePointChange"
          v-model="timePointSection">
          <template #prefix>
            <span class="pseudo-text">在</span>
          </template>
          <el-option value="past" label="过去" />
          <el-option value="future" label="未来" />
        </el-select>
        <el-input :placeholder="_ph" :disabled="readonly" style="width: 100px" v-model="item.timeCondition.startDay">
          <template #suffix>
            <span class="pseudo-text">天</span>
          </template>
        </el-input>
        <template v-if="item.timeCondition.timeType === 'in'">
          <el-input :placeholder="_ph" style="width: 150px" :disabled="readonly" v-model="item.timeCondition.endDay">
            <template #prefix>
              <span class="pseudo-text">至未来</span>
            </template>
            <template #suffix>
              <span class="pseudo-text">天之内</span>
            </template>
          </el-input>
        </template>
      </template>
    </template>

    <span v-else-if="type === 'boolean'" />
    <span v-else>
      <!-- NULL -->
    </span>
  </div>
</template>

<style lang="scss">
.AttrRender {
  height: max-content;

  line-height: 30px;

  // color: var(--el-input-text-color, var(--el-text-color-regular)) !important;
}

.el-select__placeholder {
  color: unset;
}
</style>
