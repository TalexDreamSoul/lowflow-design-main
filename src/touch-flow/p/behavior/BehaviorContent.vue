<script setup lang="ts" name="CustomContent">
import { computed, inject, ref } from "vue";
import { Delete, CirclePlusFilled, CirclePlus } from "@element-plus/icons-vue";
import BehaviorSubContent from "./BehaviorSubContent.vue";
import LogicalLine from "./LogicalLine.vue";
import { EventConditionDTO, EventSearchCondition } from "~/touch-flow/touch-total";

const props = defineProps<{
  condition: EventConditionDTO;
  dict: any;
  readonly?: boolean;
}>();

const dataObj: Readonly<EventSearchCondition> = Object.freeze({
  action: "",
  eventCode: "",
  eventName: "",
  startTime: new Date(),
  endTime: new Date(),
});

const refreshTree: Function = inject("refreshTree")!;
const timeRange = ref();

function handleDateChange(item: any) {
  const [startTime, endTime] = timeRange.value;

  item.startTime = startTime;
  item.endTime = endTime;
}

const handleDel = (index: number) => {
  props.condition.conditions.splice(index, 1);

  refreshTree();
};

const conditionArr = computed(() => props.condition.conditions);

function handleAdd() {
  props.condition.conditions.push({ ...dataObj });
}

function handleSubAdd(item: any) {
  console.log("sub add", item);

  const arr = (item.conditions = item.conditions || []);

  arr.push({});
}

const attrs = computed(() => {
  const { events } = props.dict;

  return events;
});
</script>

<template>
  <div class="CustomBehavior">
    <LogicalLine :display="!!conditionArr?.length" v-model="condition.logicalChar">
      <div v-for="(item, index) in conditionArr" :key="index" class="CustomBehavior-Main">
        <div class="CustomBehavior-Line">
        <el-date-picker
          @change="handleDateChange(item)"
          :disabled="readonly"
          v-model="timeRange"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 120px"
        />
        <el-select style="width: 100px" :disabled="readonly" placeholder="是否做过" v-model="item.action">
          <el-option label="做过" value="=" />
          <el-option label="未做过" value="!=" />
        </el-select>
        <el-select style="width: 120px" :disabled="readonly" placeholder="选择事件" v-model="item.eventCode">
          <el-option-group
            v-for="group in dict?.events"
            :key="group.eventType"
            :label="group.eventTypeName"
          >
            <el-option
              v-for="item in group.events"
              :key="item.id"
              :label="item.eventName"
              :value="item.eventCode"
            />
          </el-option-group>
        </el-select>

        <div class="CustomBehavior-Line-Group">
          <el-text
            type="primary"
            style="cursor: pointer; zoom: 0.8"
            @click="handleSubAdd(item)"
          >
            <el-icon size="12">
              <CirclePlusFilled />
            </el-icon>
            添加筛选
          </el-text>
          <el-text type="primary" style="cursor: pointer" @click="handleDel(index)">
            <el-icon size="14">
              <Delete />
            </el-icon>
            删除
          </el-text>
          <el-text type="primary" style="cursor: pointer" @click="handleAdd">
            <el-icon size="14">
              <CirclePlus />
            </el-icon>
            添加
          </el-text>
        </div>
        </div>
        <BehaviorSubContent :index="index" :dict="dict" :condition="item" />
      </div>
    </LogicalLine>
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
      display: flex;

      flex: 1;

      gap: 1rem;
      align-items: center;
    }
    display: flex;

    flex: 1;
    gap: .5rem;

    align-items: center;
  }
  margin: 10px 0;

  border-radius: 8px;
}

</style>
