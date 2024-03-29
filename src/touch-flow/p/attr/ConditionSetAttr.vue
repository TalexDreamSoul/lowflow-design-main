<script setup lang="ts" name="ConditionSetAttr">
import { computed, ref, inject, reactive, onMounted, watch } from "vue";
import { Delete, CirclePlusFilled } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import DayJs from 'dayjs'
import { dictFilterTree as getDictFilterTree } from "~/api/index";
import TouchBlockGenre from "~/touch-flow/p/genre/TouchBlockGenre.vue";
import FlowTypeSelector from "./condition/FlowTypeSelector.vue";
import { validatePropValue } from "~/touch-flow/flow-utils";
import EventGroup from "./condition/EventGroup.vue";

const dict = ref<any>();
const timeFuncs: { [func: string]: any } = {
  immediately: [
    (obj: any) => {
      const { date1, date2 } = obj;
      if (!date1 || !date2) return false;

      // 同步date1的日期和date2的时间为一个
      const date = new Date(date1);
      const time = new Date(date2);

      date.setHours(time.getHours());
      date.setMinutes(time.getMinutes());
      date.setSeconds(time.getSeconds());

      return date;
    },
    (obj: any) => {
      if (!props.p._executeTime) return false;

      const date = new Date(props.p._executeTime);
      obj.date1 = date.toString();
      obj.date2 = date.toString();
    },
  ],
  repeat: [
    (obj: any) => {
      return obj.date3;
    },
    (obj: any) => {
      const { startTime, endTime } = props.p
      if (!startTime || !endTime) return false;

      obj.date3 = [startTime, endTime]//props.p._executeTime;
    },
  ],
  trigger: [
    (obj: any) => {
      return obj.date3;
    },
    (obj: any) => {
      const { startTime, endTime } = props.p
      if (!startTime || !endTime) return false;

      obj.date3 = [startTime, endTime]
    },
  ],
};

const sizeForm = reactive({
  executeType: "immediately",
  time: {
    funcs: timeFuncs,
  },
  date1: "",
  date2: "",
  date3: "",

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

  repeatTime: {
    repeatDay: [],
    repeatTime: "",
    repeatType: "month", // month week day
  },

  enterType: "noLimit",
  enterCount: 1,
  enterDay: 1,
});

const daysOfWeek = computed(() => ["一", "二", "三", "四", "五", "六", "日"]);

const props = defineProps<{
  p: any;
  dict: any;
  readonly?: boolean;
}>();

Object.assign(sizeForm, props.p);

if (props.p.executeTime) {
  props.p._executeTime = DayJs(props.p.executeTime).format("YYYY-MM-DD HH:mm:ss");
}

if (props.p.executeType) {
  const [, analyze] = sizeForm.time.funcs[props.p.executeType!.toLowerCase()];

  analyze(sizeForm);
}

function saveData() {
  const lp: string = sizeForm.executeType;
  if (!lp) return false;

  const funcs = sizeForm.time.funcs;

  const [parse] = funcs[lp.toLowerCase()];

  const date = parse(sizeForm);

  if (!(date instanceof Date) && !Array.isArray(date)) {
    console.log("parse error", parse, lp, date);

    ElMessage({
      message: "请正确选择时间格式！",
      type: "error",
    });
    return false;
  }

  // 判断流程开始时间
  const { repeatTime } = sizeForm;
  console.log("rt", repeatTime);
  if (lp == "repeat" && !validatePropValue(repeatTime.repeatTime)) {
    ElMessage({
      message: "请正确填写流程开始时间！",
      type: "error",
    });
    return false;
  }

  const { enterType, enterCount, enterDay } = sizeForm;
  if (enterType === "multi" && !validatePropValue([enterCount, enterDay])) {
    ElMessage({
      message: "请正确填写进入流程限制！",
      type: "error",
    });
    return false;
  }

  console.log("Date Save", date, props.p);

  const _format = "YYYY-MM-DD HH:mm:ss";
  let timeFormat;

  if (Array.isArray(date)) {
    timeFormat = [...date].map(item => DayJs(item).format(_format));

    props.p.startTime = timeFormat[0]
    props.p.endTime = timeFormat[1]

    props.p.executeTime = null
  } else {
    timeFormat = DayJs(date).format(_format);

    console.log(">>>", timeFormat)

    props.p.executeTime = timeFormat
  }

  Object.assign(props.p, {
    _executeTime: date,
    // executeTime: timeFormat,
    executeType: lp,
    repeatTime: repeatTime,
    enterType,
    enterCount,
    enterDay,
    triggerRuleContent: sizeForm.triggerRuleContent,
  });

  return true;
}

type IRegSaveFunc = (regFunc: () => boolean) => void;
const regSaveFunc: IRegSaveFunc = inject("save")!;
regSaveFunc(saveData);

onMounted(async () => {
  const res = await getDictFilterTree(
    {
      pageNum: "1",
      pageSize: "999"
    }
  );

  if (res.data) {
    dict.value = res.data;
  }
});
const defaultTime2: [Date, Date] = [
  new Date(2000, 0, 0, 0, 0, 0),
  new Date(2000, 0, 0, 23, 59, 59),
];
</script>

<template>
  <el-form :disabled="readonly" class="MainForm" ref="form" :model="sizeForm" label-width="auto" label-position="top">
    <el-form-item label="流程类型">
      <FlowTypeSelector :readonly="readonly" v-model="sizeForm.executeType" />
    </el-form-item>
    <br />

    <el-form-item v-if="sizeForm.executeType === 'immediately'" label="流程开始时间（任务开始时间）">
      <el-text> 客户在&nbsp;&nbsp; </el-text>
      <el-date-picker :disabled="readonly" v-model="sizeForm.date1" type="date" label="选择日期" placeholder="选择日期"
        value-format="YYYY-MM-DD" style="width: 150px" />&nbsp;
      <el-time-picker :disabled="readonly" v-model="sizeForm.date2" label="选择时间" placeholder="选择时间"
        style="width: 120px" />
      <el-text> &nbsp;&nbsp;进入流程 </el-text>
    </el-form-item>

    <div v-else-if="sizeForm.executeType === 'repeat'">
      <el-form-item label="流程有效期：">
        <el-date-picker :disabled="readonly" v-model="sizeForm.date3" type="datetimerange"
          value-format="YYYY-MM-DD HH:mm:ss" style="max-width: 382px" range-separator="至" start-placeholder="开始日期"
          end-placeholder="结束日期" :default-time="defaultTime2" />
      </el-form-item>

      <br />
      <el-form-item label="流程开始时间(任务开始时间)">
        <el-text> 客户在&nbsp; </el-text>
        &nbsp;
        <el-select @change="Object.assign(sizeForm.repeatTime, { repeatDay: [], repeatTime: '' })"
          v-model="sizeForm.repeatTime.repeatType" style="width: 100px">
          <el-option value="month" label="每月">每月</el-option>
          <el-option value="week" label="每周">每周</el-option>
          <el-option value="day" label="每天">每天</el-option>
        </el-select>
        &nbsp;
        &nbsp;
        <el-select v-if="sizeForm.repeatTime.repeatType === 'month'" v-model="sizeForm.repeatTime.repeatDay"
          placeholder="选择月份的天数" style="width: 150px" multiple collapse-tags>
          <el-option v-for="day in 30" :key="day" :label="`${day}号`" :value="day"></el-option>
        </el-select>
        &nbsp;
        <el-select v-if="sizeForm.repeatTime.repeatType === 'week'" v-model="sizeForm.repeatTime.repeatDay"
          placeholder="选择星期几" style="width: 150px" multiple collapse-tags>
          <el-option v-for="(day, index) in daysOfWeek" :key="index" :label="`星期${day}`" :value="index + 1"></el-option>
        </el-select>
        &nbsp;
        <el-time-picker v-model="sizeForm.repeatTime.repeatTime" value-format="HH:mm" placeholder="选择时间"
          style="width: 120px"></el-time-picker>
        &nbsp;&nbsp;
        <el-text>进入流程(启动任务) </el-text>
      </el-form-item>
    </div>

    <div v-else-if="sizeForm.executeType === 'trigger'">
      <el-form-item label="流程有效期">
        <el-col :span="12">
          <el-date-picker v-model="sizeForm.date3" type="datetimerange" value-format="YYYY-MM-DD" range-separator="至"
            start-placeholder="开始日期" end-placeholder="结束日期" />
        </el-col>
      </el-form-item>

      <br />
      <EventGroup :readonly="readonly" :p="sizeForm" />
    </div>

    <template v-if="sizeForm.executeType !== 'immediately'">
      <br />
      <el-form-item label="进入流程限制">
        <el-radio-group v-model="sizeForm.enterType">
          <el-radio label="noLimit">不限制</el-radio>
          <el-radio label="once">进入一次</el-radio>
          <el-radio label="multi">进入多次</el-radio>
        </el-radio-group>
      </el-form-item>
      <div class="flex-column" v-if="sizeForm.enterType === 'multi'">
        <el-text>当前流程，同一客户</el-text>&nbsp;
        <el-input-number :max="30" :min="1" style="width: 100px" v-model="sizeForm.enterDay" placeholder="天数" />
        <el-text>&nbsp;天内，最多进入</el-text>&nbsp;
        <el-input-number :min="1" style="width: 100px" v-model="sizeForm.enterCount" placeholder="次数" />
        <el-text> &nbsp;次 </el-text>
      </div>
    </template>
  </el-form>
</template>

<style scoped lang="scss">
.flex-column {
  display: flex;

  gap: 0.5rem;
}

.pannel {
  width: 100%;
  min-height: 200px;
  //padding: 18px 15px;
  background-color: #f5f8fc;
}

.underright {
  background: #edeff4;
  border-radius: 4px 4px 0px 0px;
  font-size: 14px;
  font-weight: 500;
  color: #000000;
  padding: 12px 24px 12px 24px;
  cursor: pointer;
  color: #4078e0;
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.filter-filter-item__add {
  position: absolute;
  right: 12px;
}

:deep(.el-form--default.el-form--label-top .el-form-item .el-form-item__label) {
  margin-bottom: 8px;
  line-height: 22px;
  font-size: 16px;
  font-size: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.9);
  line-height: 24px;
}

.toppannel {
  background: #edeff4;
  border-radius: 4px 4px 0px 0px;
  font-size: 14px;
  font-weight: 500;
  color: #000000;
  padding: 12px 24px 12px 24px;
}

.garyblock {
  padding: 12px 24px 12px 24px;
}
</style>
