<script setup lang="ts" name="TargetContent">
import { computed } from "vue";
import { CirclePlusFilled, Delete } from "@element-plus/icons-vue";
import { num2character } from "~/utils/common";
import AttrRender from "../page/AttrRender.vue";
import Operator from "../page/Operator.vue";
import Trigger from "../page/Trigger.vue";
import LogicalLine from "../p/behavior/LogicalLine.vue";
import { DictTreeType, ITargetContent } from "../flow-types";

interface ITargentContentProp {
  target: ITargetContent;
  /**
   * 当前目标的索引，用于生成标题
   */
  index?: number;
  /**
   * 得到的词典树
   */
  dict: DictTreeType;
  readonly?: boolean;
}

const props = defineProps<ITargentContentProp>();
const emits = defineEmits<{
  (e: "del"): void;
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

const conditions = computed(() => {
  let target =
    props.target.targetRuleContent.customEvent.conditions[0].conditions[0];

  // console.log("go", target, props);

  // if (!target) {

  //   props.target.targetRuleContent = target = {
  //     customEvent: {
  //       conditions: []
  //     },
  //     logicalChar: '或'
  //   }

  // }

  return target; //(props.target.targetRuleContent = props.target.conditions || []);
});

function handleDel(index: number) {
  conditions.value.conditions.conditions.splice(index, 1);
}

const addCondition = () => {
  conditions.value.conditions.conditions.push(
    JSON.parse(JSON.stringify(dataObj))
  );
};

const attrs = computed(() => {
  const { events } = props.dict;

  const flattedEvents = [...events!].map((e: any) => e.events);

  const targetEvent = flattedEvents
    .flat()
    .find((item: any) => item.eventCode === conditions.value.eventCode);
  // props.target.targetDelayed.delayedAction

  return targetEvent?.eventAttr?.attrs;
});

function handleSelectChanged(val: string) {
  const { events } = props.dict;

  const flattedEvents = [...events!].map((e: any) => e.events);

  const targetEvent = flattedEvents
    .flat()
    .find((item: any) => item.eventCode === val);

  console.log(targetEvent, val);

  conditions.value.eventName = targetEvent.eventName;
}
</script>

<template>
  <div class="TargetContent" :style="`--t: ${(index || 1) * 0.1}s`">
    <div v-if="index !== undefined" class="TargetContent-TopBanner">
      <span>目标{{ num2character(index + 1) }}</span>
      <el-text @click="emits('del')" style="cursor: pointer" type="primary">
        <el-icon>
          <Delete />
        </el-icon>
        删除
      </el-text>
    </div>

    <div class="filter-wrap">
      <div v-if="index !== undefined" class="garyblock">
        <el-text>客户进入流程后，在</el-text>&nbsp;
        <el-input-number :min="1" :disabled="readonly" v-model="target.targetDelayed.delayedTime"
        controls-position="right"  style="width: 100px" />&nbsp;
        <el-select :disabled="readonly" v-model="target.targetDelayed.delayedUnit" style="width: 150px">
          <el-option value="minute" label="分钟">分钟</el-option>
          <el-option value="hour" label="小时">小时</el-option>
          <el-option value="day" label="天">天</el-option>
        </el-select>&nbsp;
        <el-text>内完成以下转化事件，则认为完成目标</el-text>
      </div>
      <div>
        <el-select @change="handleSelectChanged" :disabled="readonly" v-model="conditions.eventCode"
          style="width: 240px" placeholder="请选择">
          <el-option-group v-for="group in dict?.events" :key="group.eventType" :label="group.eventTypeName">
            <el-option v-for="item in group.events" :key="item.id" :label="item.eventName" :value="item.eventCode!" />
          </el-option-group> </el-select>&nbsp;
        <el-text v-if="conditions.eventCode" :disabled="readonly" type="primary" style="cursor: pointer"
          @click="addCondition">
          <el-icon size="14">
            <CirclePlusFilled />
          </el-icon>
          筛选条件
        </el-text>
      </div>
      <LogicalLine v-if="attrs && conditions.eventCode" :display="conditions.conditions.conditions.length < 2"
        title="并且满足" v-model="conditions.conditions.logicalChar">
        <ul :label-width="0" :inline="true">
          <li v-for="(item, index) in conditions.conditions.conditions" :key="index">
            <trigger :conditions="conditions.conditions.conditions" :item="item" :readonly="readonly"
              v-model="item.attr.field" :attrs="attrs" />
            <operator :item="item.attr" :attrs="attrs" :readonly="readonly" ref="operatorRef"
              v-model="item.attr.fieldOp" />
            <AttrRender :obj="item" :conditions="conditions.conditions.conditions" :readonly="readonly" :item="item.attr"
              :attrs="attrs" />
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
@keyframes join {
  from {
    opacity: 0;

    translate: transform(-10%, 0) scale(0.8);
  }
  to {
    opacity: 1;

    translate: transform(0, 0) scale(1);
  }
}

ul {
  li {
    display: flex;

    gap: 0.5rem;

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

  animation: join var(--join) 0.25s;
}

.TargetContent-TopBanner {
  background: #edeff4;
  border-radius: 4px 4px 0px 0px;

  color: #000000;
  padding: 0px 24px;
  display: flex;

  justify-content: space-between;
}

:deep(.el-form-item) {
  margin-right: 0;
  margin-bottom: 0;
}

:deep(.Logical-Line) {
  width: 100%;
}

.filter-wrap {
  padding: 12px;
}

.garyblock {
  margin: 0 0 10px;
}
</style>
