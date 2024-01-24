<script setup lang="ts" name="TargetContent">
import { computed } from "vue";
import { Delete } from "@element-plus/icons-vue";
import { num2character } from "~/utils/common";
import AttrRender from "./AttrRender.vue";
import Operator from "./Operator.vue";
import Trigger from "./Trigger.vue";

const props = defineProps<{
  target: any;
  index: number;
  dict: any;
}>();

function getConditions() {
  return (props.target.conditions = props.target.conditions || []);
}

const addCondition = () => {
  getConditions().push({
    field: null,
    operator: "equal",
    value: null,
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

  // const targetEvents =
  //   [...events]
  //     .map((e: any) => e.events)
  //     .flat()
  //     .find((e: any) => e.id === props.target.delayedAction)?.eventAttr
  //     ?.attrs ?? null;

  const targetEvents =
    [...events]
      .map((e: any) => e.events)
      .find((_: any) => (_e: any) => _e.id === props.target.delayedAction)?.[0]
      ?.eventAttr?.attrs ?? null;

  return targetEvents;
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
        <el-input v-model="target.delayedTime" type="number" style="width: 100px" />&nbsp;
        <el-select v-model="target.delayedUnit" style="width: 150px">
          <el-option value="month" label="月份">分钟</el-option>
          <el-option value="week" label="周">小时</el-option>
          <el-option value="day" label="天">天</el-option> </el-select>&nbsp;
        <el-text>内完成以下转化事件，则认为完成目标</el-text>
      </div>
      <div>
        <el-select v-model="target.delayedAction" style="width: 240px">
          <el-option-group v-for="group in dict?.events" :key="group.eventType" :label="group.eventTypeName">
            <el-option v-for="item in group.events" :key="item.id" :label="item.eventName" :value="item.id" />
          </el-option-group> </el-select>&nbsp;
        <el-text type="primary" style="cursor: pointer" @click="addCondition">
          <el-icon size="14">
            <CirclePlusFilled />
          </el-icon>
          筛选条件
        </el-text>
      </div>
      <div class="filter-container">
        <div class="fontstyle">并且满足</div>
        <div class="logical-operator" v-if="target.conditions?.length">
          <div class="logical-operator__line"></div>
          <div class="custom-switch" :class="{ active: target.logicalOperator === 'and' }" @click="
              target.logicalOperator =
                target?.logicalOperator === 'and' ? 'or' : 'and'
            ">
            {{ target?.logicalOperator === "and" ? "且" : "或" }}
          </div>
        </div>
        <div v-if="attrs" class="filter-option-content">
          <el-form :label-width="0" :inline="true" :model="target.conditions">
            <el-row v-for="(item, index) in target.conditions" :key="`${item.field}-${index}`" :gutter="5" class="filter-item-rule">
              <el-col :xs="24" :sm="7">
                <el-form-item :prop="'conditions.' + index + '.field'" style="width: 100%">
                  <trigger v-model="item.field" :attrs="attrs" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="5" v-if="item.field">
                <el-form-item :prop="'conditions.' + index + '.operator'" style="width: 100%">
                  <operator ref="operatorRef" v-model="item.operator" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="10" v-if="item.field">
                <el-form-item :prop="'conditions.' + index + '.value'" style="width: 100%">
                  <AttrRender :field="item.field" v-model="item.fieldValue" :attrs="attrs" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="2" style="
                  display: flex;
                  align-items: center;
                  flex-direction: row-reverse;
                ">
                <el-text type="primary" style="cursor: pointer" @click="handleDel(index)">
                  <el-icon size="14">
                    <Delete />
                  </el-icon>
                  删除
                </el-text>
              </el-col>
            </el-row>

            <div v-if="
                !(
                  target?.filterRules?.groups?.length |
                  target?.filterRules?.conditions?.length
                )
              " class="filter-item-rule" />
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
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
.filter-wrap {
  padding: 24px;
  width: 50%;
  .garyblock {
    margin-bottom: 16px;
  }
  .filter-container {
    //background-color: #f5f8fc;
    //border-radius: 3px;
    display: flex;
    .fontstyle {
      font-size: 14px;
      font-weight: 400;
      color: #000000;
      position: relative;
      display: flex;
      align-items: center;
      overflow: hidden;
      min-width: 60px;
      padding-right: 5px;
    }
    .logical-operator {
      position: relative;
      display: flex;
      align-items: center;
      overflow: hidden;
      min-width: 40px;

      .logical-operator__line {
        position: absolute;
        left: calc(35% - 1px);
        border-width: 1px 0 1px 1px;
        border-top-style: solid;
        border-bottom-style: solid;
        border-left-style: solid;
        border-left-color: #4078e0;
        border-image: initial;
        border-right-style: initial;
        border-right-color: initial;
        border-radius: 5px 0 0 5px;
        height: calc(100% - 22px);
      }
    }

    .filter-option-content {
      position: relative;
      width: 100%;

      .filter-item-rule {
        display: flex;
        align-items: center;
        min-height: 48px;
      }

      .filter-filter-item__add {
        border-style: dashed;
        width: 100%;
      }
    }
  }
}
.custom-switch {
  border: 1px solid #4078e0;
  color: #fff;
  width: 24px;
  height: 24px;
  background: #fff;
  font-weight: 500;
  color: #4078e0;
  font-size: 14px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1;
}
</style>
