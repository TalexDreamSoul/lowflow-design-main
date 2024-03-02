<script setup lang="ts" name="AttrRender">
import { ref, computed, watchEffect } from "vue";

type AttrType = any; //number | string | boolean | Array<Number> | Array<string>

const props = defineProps<{
  item: AttrType;
  attrs: any;
  selected?: string;
  readonly?: boolean;
  placeholder?: string;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", value: AttrType): void;
}>();

const timeInterval = ref<any>();
const _ph = computed(() => props.placeholder ?? "请输入值");
const timePointSection = ref<"past" | "future">("past");
const timeCastSection = ref<"within" | "without">("within");
const type = computed(() =>
  props.selected
    ? ((_: any) => _.labelValueType || _.labelType || _.fieldType)(props.selected)
    : props.attrs.filter(
        (attr: any) =>
          attr.field === props.item.field || attr.labelName === props.item.labelName
      )?.[0]?.fieldType ?? "none"
);

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
      type: "absolute",
      value: "eq",
    },
    {
      label: "不等于",
      type: "absolute",
      value: "ne",
    },
    {
      label: "大于等于",
      type: "absolute",
      value: "ge",
    },
    {
      label: "大于",
      type: "absolute",
      value: "gt",
    },
    {
      label: "小于等于",
      type: "absolute",
      value: "le",
    },
    {
      label: "小于",
      type: "absolute",
      value: "lt",
    },
    {
      label: "区间",
      type: "absoluteInterval",
      value: "in",
    },
  ],
  相对时间: [
    {
      label: "相对当前时间点",
      type: "relative",
      value: "now",
    },
    {
      label: "相对当前时间区间",
      type: "relativeInterval",
      value: "in",
    },
  ],
};

function onOpChange(val: any) {
  timeInterval.value = null;

  const arr = operatorOptions[props.item.fieldOp];

  const item = arr.find((item: any) => item.label === val);

  props.item.timeCondition.timeType = item!.type;
}

function onTimePointChange(val: typeof timePointSection.value) {
  props.item.timeCondition.isFuture = val === "future";
}

function onTimeCastChange(val: typeof timeCastSection.value) {
  props.item.timeCondition.isWithin = val === "within";
}
</script>

<template>
  <div class="AttrRender" style="display: flex; gap: 1rem">
    <template v-if="type === 'num'">
      <template v-if="item.fieldOp === '区间'">
        <el-input
          :placeholder="_ph"
          :disabled="readonly"
          v-model.number="item.fieldValue"
        />
        <el-text>到</el-text>
        <el-input
          :placeholder="_ph"
          :disabled="readonly"
          v-model.number="item.fieldRangeValue"
        />
      </template>
      <el-input
        v-else
        :placeholder="_ph"
        :disabled="readonly"
        v-model.number="item.fieldValue"
      />
    </template>

    <el-input
      :placeholder="_ph"
      :disabled="readonly"
      v-else-if="type === 'text'"
      v-model="item.fieldValue"
    />

    <template v-else-if="type === 'date'">
      <el-select
        :placeholder="_ph"
        style="width: 193px"
        @change="onOpChange"
        :disabled="readonly"
        v-model="item.timeCondition.timeType"
        v-if="item.fieldOp.indexOf('时间') !== -1"
      >
        <el-option
          v-for="each in operatorOptions[item.fieldOp]"
          :key="each.value"
          :label="each.label"
          :value="each.label"
        />
      </el-select>
      <template v-if="item.fieldOp === '绝对时间'">
        <el-date-picker
          :disabled="readonly"
          v-if="item.timeCondition.timeType !== 'absoluteInterval'"
          v-model="timeInterval"
          type="date"
          placeholder="选择时间"
        />
        <el-date-picker
          :disabled="readonly"
          v-else
          v-model="timeInterval"
          type="daterange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        />
      </template>
      <template v-else-if="item.fieldOp === '相对时间'">
        <el-select
          :placeholder="_ph"
          :disabled="readonly"
          style="width: 120px"
          @change="onTimePointChange"
          v-model="timePointSection"
        >
          <template #prefix>
            <span class="pseudo-text">在</span>
          </template>
          <el-option value="past" label="过去" />
          <el-option value="future" label="未来" />
        </el-select>
        <el-input
          :placeholder="_ph"
          :disabled="readonly"
          style="width: 100px"
          v-model="item.timeCondition.startDay"
        >
          <template #suffix>
            <span class="pseudo-text">天</span>
          </template>
        </el-input>
        <template v-if="item.fieldOp === '相对当前时间点'">
          <el-select
            :placeholder="_ph"
            :disabled="readonly"
            @change="onTimeCastChange"
            v-model="timeCastSection"
          >
            <el-option value="within" label="之内" />
            <el-option value="without" label="之外" />
          </el-select>
        </template>
        <template v-else>
          <el-input
            :placeholder="_ph"
            style="width: 150px"
            :disabled="readonly"
            v-model="item.timeCondition.endDay"
          >
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
    <span v-else>NULL</span>
  </div>
</template>

<style lang="scss">
.AttrRender {
  height: max-content;

  line-height: 30px;
}
</style>
