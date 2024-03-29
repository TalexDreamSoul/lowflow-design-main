<script setup lang="ts" name="SequenceContent">
import { watchEffect, inject, ref } from "vue";
import SequenceSubContent from "./SequenceSubContent.vue";
import { CirclePlusFilled, Delete } from "@element-plus/icons-vue";
import {
  SearchCondition,
  SequenceCondition,
  SequenceConditionDTO,
} from "~/touch-flow/touch-total";

const props = defineProps<{
  condition: SequenceConditionDTO;
  dict: any;
  readonly?: boolean;
}>();
const emits = defineEmits(["del"]);

const dataObj = Object.freeze({
  attr: {
    field: "",
    fieldMultiValue: [],
    fieldName: "",
    fieldOp: "",
    fieldRangeValue: "",
    fieldType: "",
    fieldValue: "",
  },
  label: {
    labelId: 0,
    labelName: "",
    labelValue: [],
  },
  type: "event",
});

const refreshTree: Function = inject("refreshTree")!;
const timeRange = ref();

watchEffect(() => {
  timeRange.value = [
    props.condition?.startTime || null,
    props.condition?.endTime || null,
  ];
});

function handleDateChange() {
  const [startTime, endTime] = timeRange.value;

  props.condition.startTime = startTime;
  props.condition.endTime = endTime;
}

const handleDel = () => {
  emits("del");

  refreshTree();
};

function handleAdd() {
  const arr: SequenceCondition[] = (props.condition.conditions =
    props.condition.conditions || []);

  arr.push({
    action: "=",
    conditions: {
      conditions: new Array<SearchCondition>(),
      logicalChar: "或",
    },
    eventCode: "",
    eventName: "",
  });
}

// function handleSubAdd() {
//   console.log(props.condition);
//   // const arr = (item.conditions.conditions = item.conditions.conditions || []);

//   // arr.push(JSON.parse(JSON.stringify(dataObj)));

//   // props.conditions.push({
//   //   action: "",
//   //   conditions:
//   // })
// }
function handleSubAdd(item: any) {
  // console.log("----", item.conditions, conditionArr.value);
  const arr = (item.conditions.conditions = item.conditions.conditions || []);

  arr.push(JSON.parse(JSON.stringify(dataObj)));
}
function handleSubDel(index: number) {
  props.condition.conditions.splice(index, 1);
}

function handleEventChanged(val: string, condition: any) {
  const { events } = props.dict

  const _events = events.map((item: any) => item.events).flat()

  const targetEvent = _events.find((item: any) => item.eventCode === val)

  console.log(val, condition, targetEvent)

  condition.eventName = targetEvent.eventName
}
const defaultTime2: [Date, Date] = [
  new Date(2000, 0, 0, 0, 0, 0),
  new Date(2000, 0, 0, 23, 59, 59),
];
</script>

<template>
  <div class="SequenceContent">
    <div class="SequenceContent-Line">
      <el-date-picker @change="handleDateChange" :disabled="readonly" format="YYYY-MM-DD HH:mm:ss"
        value-format="YYYY-MM-DD HH:mm:ss" v-model="timeRange" type="datetimerange" range-separator="-"
        start-placeholder="开始日期" end-placeholder="结束日期" style="width: 120px" :default-time="defaultTime2" />
      <span style="color: #484545"> &nbsp;&nbsp; 依次做过 </span>

      <span style="zoom:.8;min-width: 255px;">    
        <!-- <el-text
          :disabled="readonly"
          type="primary"
          style="cursor: pointer"
          @click="handleSubAdd"
        >
          <el-icon size="14">
            <CirclePlusFilled />
          </el-icon>
          添加同组
        </el-text>
        &nbsp;&nbsp;&nbsp; -->
        <el-text :disabled="readonly" type="primary" style="cursor: pointer" @click="handleAdd">
          <el-icon size="14">
            <CirclePlusFilled />
          </el-icon>
          添加事件
        </el-text>
        &nbsp;&nbsp;&nbsp;
        <el-text :disabled="readonly" type="primary" style="cursor: pointer" @click="handleDel">
          <el-icon size="14">
            <Delete />
          </el-icon>
          删除
        </el-text>
      </span>
    </div>

    <div class="SequenceContent-Events" v-for="(event, _index) in condition.conditions" :key="_index">
      <el-select @change="handleEventChanged($event, event)" style="width: 200px" :disabled="readonly"
        placeholder="选择事件" v-model="event.eventCode">
        <el-option-group v-for="group in dict?.events" :key="group.eventType" :label="group.eventTypeName">
          <el-option v-for="item in group.events" :key="item.id" :label="item.eventName" :value="item.eventCode" />
        </el-option-group>
      </el-select>
      &nbsp;&nbsp;&nbsp;
      <el-text type="primary" v-if="!readonly && event.eventCode" style="cursor: pointer;zoom:.8"
        @click="handleSubAdd(event)">
        <el-icon size="14">
          <CirclePlusFilled />
        </el-icon>
        添加筛选
      </el-text>
      &nbsp;&nbsp;&nbsp;
      <el-text v-if="!readonly && condition.conditions.length > 1" type="primary" style="cursor: pointer;zoom:.8"
        @click="handleSubDel(_index)">
        <el-icon size="14">
          <Delete />
        </el-icon>
        删除
      </el-text>

      <SequenceSubContent :index="_index" :dict="dict" :eventCode="event.eventCode" :condition="event.conditions" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.SequenceContent {
  &-Line {
    padding-right: 20%;
    display: flex;

    gap: 0.5rem;
    align-items: center;
  }

  &-Events {
    margin-left: 1rem;
  }

  margin: 10px 0;

  border-radius: 8px;
}
</style>
