<script setup lang="ts" name="TouchBlockGenre">
import TouchGenre from "~/touch-flow/p/genre/TouchGenre.vue";
import LogicalLine from "../behavior/LogicalLine.vue";
import { CirclePlusFilled, Delete } from "@element-plus/icons-vue";
import { CustomEventConditionDTO, EventSearchCondition } from "~/touch-flow/touch-total";
import { computed } from "vue";
import BehaviorSubContent from "../behavior/BehaviorSubContent.vue";

const props = defineProps<{
  condition: CustomEventConditionDTO;
  dict: any;
  readonly?: boolean;
}>();

console.log("props", props.condition)
console.log(`output->condition.conditions[0].conditions`,props.condition.conditions[0].conditions)

const conditionList = computed<EventSearchCondition[]>(() => {
  if (!props.condition.conditions.length) {
    props.condition.conditions = [{
      conditions: new Array<any>(),
      logicalChar: '或'
    }]
  }

  const arr: EventSearchCondition[] = []
  for (let item of props.condition.conditions[0].conditions) {
    console.log('each', item)

    if (!item?.conditions?.conditions) {
      item.conditions = {
        conditions: new Array<any>(),
        logicalChar: '或'
      }
    }

    arr.push(item)
  }

  return arr
})

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

function addCondition(event: any) {
  console.log("e", event);
  event.conditions.conditions.push(JSON.parse(JSON.stringify(dataObj)));
}

function delEvent(index: number) {
  props.condition.conditions.splice(index, 1);
}

function handleSelectChanged(val: string, event: any) {
  const { events } = props.dict;

  const flattedEvents = [...events!].map((e: any) => e.events);

  const targetEvent = flattedEvents
    .flat()
    .find((item: any) => item.eventCode === val);

  console.log(targetEvent, val, event)

  event.eventName = targetEvent.eventName
}
</script>

<template>
  <div class="TouchBlockGenre">
    <LogicalLine :disabled="readonly" v-model="condition.logicalChar"  :display="condition.conditions[0].conditions.length<2" >
      <div class="EventA-Wrapper" v-for="(event, index) in conditionList">
        <div class="EventA-Wrapper-Head">
          <el-select :disabled="readonly" @change="handleSelectChanged($event, event)" placeholder="选择事件"
            v-model="event.eventCode" style="width: 200px">
            <el-option-group v-for="group in dict?.events" :key="group.eventType" :label="group.eventTypeName">
              <el-option v-for="item in group.events" :key="item.id" :label="item.eventName" :value="item.eventCode" />
            </el-option-group>
          </el-select>

          <span>
            <el-text v-if="!readonly&&event.eventCode" type="primary" style="cursor: pointer" @click="addCondition(event)">
              <el-icon size="14">
                <CirclePlusFilled />
              </el-icon>
              筛选条件
            </el-text>
            <el-text v-if="!readonly" type="primary" style="cursor: pointer" @click="delEvent(index)">
              <el-icon size="14">
                <Delete />
              </el-icon>
              删除
            </el-text>
          </span>
        </div>

        <BehaviorSubContent title="并且满足" :index="index" :dict="dict" :condition="event" />
        <!-- <TouchGenre :condition="event" :dict="dict" /> -->
      </div>
    </LogicalLine>
  </div>
</template>

<style lang="scss">
.EventA {
  &-Wrapper {
    &-Head {
      &>span {
        display: flex;

        gap: .5rem;
        align-items: center;
      }

      display: flex;

      gap: 1rem;
      align-items: center;
    }
  }
}
</style>
