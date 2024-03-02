<script setup lang="ts" name="TargetContent">
import { computed } from "vue";
import { Delete } from "@element-plus/icons-vue";
import { num2character } from "~/utils/common";
import AttrRender from "../page/AttrRender.vue";
import Operator from "../page/Operator.vue";
import Trigger from "../page/Trigger.vue";
import LogicalLine from "../p/behavior/LogicalLine.vue";
import { ITargetContent, DictTreeType } from "../flow-types";

interface ITargentContentProp {
  target: ITargetContent,
  /**
   * 当前目标的索引，用于生成标题
   */
  index: number
  /**
   * 得到的词典树
   */
  dict: DictTreeType
  readonly?: boolean
}

const props = defineProps<ITargentContentProp>();

if (!props.target.targetRuleContent?.customEvent) {

  props.target.targetRuleContent = {
    customEvent: {
      conditions: []
    },
    logicalChar: '或'
  }

}

function getConditions() {
  let target = props.target.targetRuleContent?.customEvent!

  console.log("go", target, props)

  // if (!target) {

  //   props.target.targetRuleContent = target = {
  //     customEvent: {
  //       conditions: []
  //     },
  //     logicalChar: '或'
  //   }

  // }

  return target.conditions! //(props.target.targetRuleContent = props.target.conditions || []);
}

const addCondition = () => {
  getConditions().push({
    field: null,
    operator: "",
    fieldValue: null,
  });
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

  const flattedEvents = [...events!].map((e: any) => e.events)

  const targetEvent = flattedEvents.flat().find((item: any) => item.eventCode === props.target.targetDelayed.delayedAction)

  return targetEvent?.eventAttr?.attrs;
});
</script>

<template>
  <div class="TargetContent">
    <div class="TargetContent-TopBanner">
      目标{{ num2character(index + 1) }}
    </div>

    <div class="filter-wrap">
      <div class="garyblock">
        <el-text>客户进入流程后，在</el-text>&nbsp;
        <el-input :disabled="readonly" v-model="target.targetDelayed.delayedTime" type="number"
          style="width: 100px" />&nbsp;
        <el-select :disabled="readonly" v-model="target.targetDelayed.delayedUnit" style="width: 150px">
          <el-option value="month" label="月份">分钟</el-option>
          <el-option value="week" label="周">小时</el-option>
          <el-option value="day" label="天">天</el-option> </el-select>&nbsp;
        <el-text>内完成以下转化事件，则认为完成目标</el-text>
      </div>
      <div>
        <el-select :disabled="readonly" v-model="target.targetDelayed.delayedAction" style="width: 240px">
          <el-option-group v-for="group in dict?.events" :key="group.eventType" :label="group.eventTypeName">
            <el-option v-for="item in group.events" :key="item.id" :label="item.eventName" :value="item.eventCode!" />
          </el-option-group> </el-select>&nbsp;
        <el-text v-if="target.targetDelayed.delayedAction" :disabled="readonly" type="primary" style="cursor: pointer"
          @click="addCondition">
          <el-icon size="14">
            <CirclePlusFilled />
          </el-icon>
          筛选条件
        </el-text>
      </div>
      <LogicalLine v-if="target.targetDelayed.delayedAction" :display="target.targetDelayed.delayedAction === undefined"
        title="并且满足" v-model="target.targetRuleContent.customEvent!.logicalChar">
        <ul :label-width="0" :inline="true">
          <li v-for="(item, index) in target.targetRuleContent.customEvent!.conditions" :key="index">
            <trigger :item="item" :readonly="readonly" v-model="item.attr.field" :attrs="attrs" />
            <operator :item="item" :attrs="attrs" :readonly="readonly" ref="operatorRef" v-model="item.fieldOp" />
            <AttrRender :readonly="readonly" :item="item" :attrs="attrs" />
            <el-text type="primary" style="cursor: pointer" @click="handleDel(index)">
              <el-icon size="14">
                <Delete :disabled="readonly" />
              </el-icon>
              删除
            </el-text>
          </li>
        </ul>
      </LogicalLine>
    </div>
  </div>
</template>

<style scoped lang="scss">
ul {
  li {
    display: flex;

    gap: .5rem;

    align-items: center;
  }

  margin: 0;
  padding: 0;

  list-style: none;
}

.TargetContent {
  margin: 10px 0;

  border-radius: 8px;

  background-color: #f7f8fa;
}

.TargetContent-TopBanner {
  background: #edeff4;
  border-radius: 4px 4px 0px 0px;
  font-size: 12px;
  font-weight: 400;
  color: #000000;
  padding: 0px 24px;
}

:deep(.el-form-item) {
  margin-right: 0;
  margin-bottom: 0;
}

:deep(.Logical-Line) {
  width: 100%;
}

.filter-wrap {
  padding: 24px;

  .garyblock {
    margin-bottom: 16px;
  }
}
</style>
