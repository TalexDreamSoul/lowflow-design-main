<script setup lang="ts" name="SequenceSubContent">
import { computed } from "vue";
import { Delete } from "@element-plus/icons-vue";
import LogicalLine from "../LogicalLine.vue";
import AttrRender from "../../../page/AttrRender.vue";
import Operator from "../../../page/Operator.vue";
import Trigger from "../../../page/Trigger.vue";
import { AttrConditionDTO } from "~/touch-flow/touch-total";

const props = defineProps<{
  condition: AttrConditionDTO;
  eventCode: string;
  index: number;
  readonly?: boolean;
  dict: any;
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
  type: "event",
});

function getConditions() {
  const arr = props.condition.conditions || [];

  console.log("got", arr);

  for (let item of arr) {
    if (!item.type) {
      Object.assign(item, { ...dataObj });
    }
  }

  return arr;
}

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
    .find((item: any) => item.eventCode === props.eventCode);

  return targetEvent?.eventAttr?.attrs;
});
</script>

<template>
  <div class="SequenceSubContent" >
    <LogicalLine v-model="condition.logicalChar" :display="condition.conditions?.length < 2">
      <div class="SequenceSubContent-Line" v-if="attrs" v-for="(item, index) in getConditions()" :key="index">
        <trigger :conditions="getConditions()" :item="item" v-model="item.attr.field" :attrs="attrs"
          :readonly="readonly" />
        <operator :attrs="attrs" :item="item" ref="operatorRef" v-model="item.attr.fieldOp" :readonly="readonly" />

        <AttrRender :obj="item"  :outside="outside"  :conditions="getConditions()" :item="item.attr" :attrs="attrs" :readonly="readonly" />

        <el-text type="primary" style="cursor: pointer" @click="handleDel(index)" v-if="!readonly" :disabled="readonly">
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
.SequenceSubContent {
  &-Line {
    display: flex;

    gap: 0.5rem;
    align-items: center;
    //margin-top: 1rem;
  }

  // margin: 10px 0;

  border-radius: 8px;

  background-color: #f7f8fa;
}
</style>
