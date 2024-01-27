<script setup lang="ts" name="TouchBlockGenre">
import TouchGenre from "~/touch-flow/p/genre/TouchGenre.vue";
import LogicalLine from "../behavior/LogicalLine.vue";

const props = defineProps<{
  condition: any;
  dict: any;
}>()

function addCondition(event: any) {
  console.log('e', event)
  event.conditions.push({})
}

function delEvent(index: number) {
  props.condition.conditions.splice(index, 1)
}
</script>

<template>
  <div class="TouchBlockGenre">
    <LogicalLine v-model="condition.logicalChar">
      <div class="EventA-Wrapper" v-for="(event, index) in condition.conditions">

        <el-select v-model="event.action" style="width: 240px">
          <el-option-group v-for="group in dict?.events" :key="group.eventType" :label="group.eventTypeName">
            <el-option v-for="item in group.events" :key="item.id" :label="item.eventName" :value="item.id" />
          </el-option-group> </el-select>&nbsp;
        <el-text type="primary" style="cursor: pointer" @click="addCondition(event)">
          <el-icon size="14">
            <CirclePlusFilled />
          </el-icon>
          筛选条件
        </el-text>
        <el-text type="primary" style="cursor: pointer;" @click="delEvent(index)">
          <el-icon size="14">
            <Delete />
          </el-icon>
        </el-text>

        <TouchGenre :condition="event" :dict="dict" />
      </div>
    </LogicalLine>
  </div>
</template>