<script setup lang="ts" name="BehaviorSubContent">
import { computed } from "vue";
import { CirclePlusFilled, Delete } from "@element-plus/icons-vue";
import LogicalLine from "./LogicalLine.vue";
import AttrRender from "../../page/AttrRender.vue";
import Operator from "../../page/Operator.vue";
import Trigger from "../../page/Trigger.vue";
import { EventSearchCondition } from "~/touch-flow/touch-total";

const props = defineProps<{
  condition: EventSearchCondition;
  index: number;
  dict: any;
  title?: string;
  readonly?: boolean;
  outside?: boolean;

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
  type: "attr",
});

const getConditions = () => {
  const arr = props.condition.conditions.conditions || [];

  // console.log("got", arr);

  for (let item of arr) {
    if (!item.type) {
      Object.assign(item, { ...dataObj });
    }
  }

  return arr;
};

/**
 * 删除条件
 * @param index
 */
const handleDel = (index: number) => {
  getConditions().splice(index, 1);
};

const attrs = computed(() => {
  const { events } = props.dict;

  const flattedEvents = [...events].map((e: any) => e.events);

  const targetEvent = flattedEvents
    .flat()
    .find((item: any) => item.eventCode === props.condition.eventCode);

  // console.log("targetEvent", targetEvent, flattedEvents);

  return targetEvent?.eventAttr?.attrs;
});

const getCurrSelected = (condition: any) => {
  // console.log("attrsss", attrs, props.dict);

  return attrs.value.find(
    (_: any) => _.field === condition.field || _.label === condition.field
  );
};
</script>

<template>
  <div class="BehaviorSubContent">
    <LogicalLine :title="title" :readonly="readonly" :model-value="condition.conditions.logicalChar"
      :display="condition.conditions?.conditions?.length < 2">
      <div class="BehaviorSubContent-Line" v-if="attrs" v-for="(item, index) in getConditions()" :key="index">
        <trigger :conditions="getConditions()" v-model="item.attr.field" :item="item" :attrs="attrs"
          :readonly="readonly" placeholder="客户属性/标签" style="width: 220px" />
        <operator :selected="getCurrSelected(item)" :attrs="attrs" :item="item.attr" :disabled="readonly"
          v-model="item.attr.fieldOp" />
        <AttrRender :obj="item"  :conditions="getConditions()"   :outside="outside"  :selected="getCurrSelected(item)" :readonly="readonly"
          :item="item.attr" :attrs="attrs" />

        <el-text v-if="!readonly" type="primary" style="cursor: pointer" @click="handleDel(index)">
          <el-icon size="14">
            <Delete />
          </el-icon>
          删除
        </el-text>
      </div>
    </LogicalLine>
  </div>
</template>

<style scoped lang="scss">
.BehaviorSubContent {
  &-Line {
    display: flex;

    flex: 1;
    gap: 0.5rem;
    align-items: center;
    //margin-top: 1rem;

  }

  margin: 10px 0;

  border-radius: 8px;

  background-color: #f7f8fa;
}

:deep(.el-form-item) {
  margin-right: 0;
 // margin-bottom: 0;
}
</style>
