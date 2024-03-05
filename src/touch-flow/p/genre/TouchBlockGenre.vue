<script setup lang="ts" name="TouchBlockGenre">
import TouchGenre from "~/touch-flow/p/genre/TouchGenre.vue";
import LogicalLine from "../behavior/LogicalLine.vue";
import { CirclePlusFilled, Delete } from "@element-plus/icons-vue";

const props = defineProps<{
  condition: any;
  dict: any;
}>();

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
  event.conditions.push(JSON.parse(JSON.stringify(dataObj)));
}

function delEvent(index: number) {
  props.condition.conditions.splice(index, 1);
}
</script>

<template>
  <div class="TouchBlockGenre">
    <LogicalLine v-model="condition.logicalChar">
      <div class="EventA-Wrapper" v-for="(event, index) in condition.conditions">
        <div class="EventA-Wrapper-Head">
          <el-select placeholder="选择事件" v-model="event.action" style="width: 240px">
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

          <span>
            <el-text type="primary" style="cursor: pointer" @click="addCondition(event)">
              <el-icon size="14">
                <CirclePlusFilled />
              </el-icon>
              筛选条件
            </el-text>
            <el-text type="primary" style="cursor: pointer" @click="delEvent(index)">
              <el-icon size="14">
                <Delete />
              </el-icon>
              删除
            </el-text>
          </span>
        </div>

        <TouchGenre :condition="event" :dict="dict" />
      </div>
    </LogicalLine>
  </div>
</template>

<style lang="scss">
.EventA {
  &-Wrapper {
    &-Head {
      & > span {
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
