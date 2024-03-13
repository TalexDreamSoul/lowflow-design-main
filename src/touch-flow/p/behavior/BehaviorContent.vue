<script setup lang="ts" name="CustomContent">
import { watch, inject, ref } from "vue";
import { Delete, CirclePlusFilled } from "@element-plus/icons-vue";
import BehaviorSubContent from "./BehaviorSubContent.vue";
import LogicalLine from "./LogicalLine.vue";
import { EventSearchCondition } from "~/touch-flow/touch-total";

const props = defineProps<{
  condition: EventSearchCondition;
  length: number;
  index: number;
  dict: any;
  readonly?: boolean;
  configuration: {
    time: boolean,
    action: boolean
  } | undefined
}>();
const emits = defineEmits(["addSub", "del"]);

const subDataObj = Object.freeze({
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

function handleDateChange(item: any) {
  const [startTime, endTime] = timeRange.value;

  item.startTime = startTime;
  item.endTime = endTime;
}

// const handleDel = (index: number) => {
//   console.log('aaa', props.condition, index)
//   // props.condition.conditions.splice(index, 1);

//   // refreshTree();
// };

// const conditionArr = computed(() => props.condition.conditions);

function handleAdd(item: EventSearchCondition) {
  const arr = (item.conditions.conditions = item.conditions.conditions || []);

  arr.push(JSON.parse(JSON.stringify(subDataObj)));
}

function handleChange(val: string, condition: any) {
  const { events } = props.dict

  const _events = events.map((item: any) => item.events).flat()

  const targetEvent = _events.find((item: any) => item.eventCode === val)

  // console.log(val, condition, targetEVent)

  condition.eventName = targetEvent.eventName
}

watch(props.condition, (val) => {
  const { startTime, endTime } = val
  if (!startTime || !endTime) return

  timeRange.value = [startTime, endTime]
}, { immediate: true })
const defaultTime2: [Date, Date] = [
  new Date(2000, 0, 0, 0, 0, 0),
  new Date(2000, 0, 0, 23, 59, 59),
];
</script>

<template>
  <div class="CustomBehavior">
    <!-- <LogicalLine :display="conditionArr?.length < 2" v-model="condition.logicalChar"> -->
    <!-- <div v-for="(item, index) in conditionArr" :key="index" class="CustomBehavior-Main"> -->
    <div class="CustomBehavior-Line">
      <el-date-picker v-if="!configuration?.time" @change="handleDateChange(condition)" :disabled="readonly"
        format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" type="datetimerange"
        :default-time="defaultTime2" v-model="timeRange" range-separator="-" start-placeholder="开始日期"
        end-placeholder="结束日期" style="width: 50px" />
      <el-select v-if="!configuration?.action" style="width: 100px" :disabled="readonly" placeholder="是否做过"
        v-model="condition.action">
        <el-option label="做过" value="=" />
        <el-option label="未做过" value="!=" />
      </el-select>
      <el-select @change="handleChange($event, condition)" style="width: 150px" :disabled="readonly" placeholder="选择事件"
        v-model="condition.eventCode">
        <el-option-group v-for="group in dict?.events" :key="group.eventType" :label="group.eventTypeName">
          <el-option v-for="item in group.events" :key="item.id" :label="item.eventName" :value="item.eventCode" />
        </el-option-group>
      </el-select>

      <div class="CustomBehavior-Line-Group" style="zoom:.8">
        <el-text v-if="condition.eventCode" type="primary" style="cursor: pointer" @click="handleAdd(condition)">
          <el-icon size="12">
            <CirclePlusFilled />
          </el-icon>
          添加筛选
        </el-text>
        <div class="CustomBehavior-Line-Group-Sticky">
          <el-text v-if="condition.eventCode && length === index + 1" type="primary" style="cursor: pointer"
            @click="emits('addSub')">
            <el-icon size="12">
              <CirclePlusFilled />
            </el-icon>
            添加同组
          </el-text>
          <el-text type="primary" style="cursor: pointer" @click="emits('del')">
            <el-icon size="14">
              <Delete />
            </el-icon>
            删除
          </el-text>
        </div>
      </div>
    </div>

    <BehaviorSubContent title="并且满足" :index="index" :dict="dict" :condition="condition" />

    <!-- </div> -->
    <!-- </LogicalLine> -->
  </div>
</template>

<style scoped lang="scss">
.CustomBehavior {
  &-Main {
    display: flex;

    flex-direction: column;
  }

  &-Line {
    &-Group {
      &-Sticky {
        display: flex;

        gap: 0.5rem;
      }

      display: flex;
      padding: 0 1rem 0 0.5rem;

      flex: 1;

      gap: 1rem;
      align-items: center;
      box-sizing: border-box;
      justify-content: space-between;
    }

    display: flex;

    flex: 1;
    gap: 0.5rem;

    align-items: center;
  }

  margin: 10px 0;

  border-radius: 8px;
}
</style>
