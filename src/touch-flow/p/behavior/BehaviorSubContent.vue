<script setup lang="ts" name="BehaviorSubContent">
import { computed } from "vue";
import { Delete } from "@element-plus/icons-vue";
import LogicalLine from "./LogicalLine.vue";
import AttrRender from "../../page/AttrRender.vue";
import Operator from "../../page/Operator.vue";
import Trigger from "../../page/Trigger.vue";

const props = defineProps<{
  condition: any;
  index: number;
  dict: any;
}>();

function getConditions() {
  return (props.condition.conditions = props.condition.conditions || []);
}

const addCondition = () => {
  getConditions().push({
    field: null,
    operator: "equal",
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

  // const targetEvents =
  //   [...events]
  //     .map((e: any) => e.events)
  //     .flat()
  //     .find((e: any) => e.id === props.target.delayedAction)?.eventAttr
  //     ?.attrs ?? null;

  const targetEvents =
    [...events]
      .map((e: any) => e.events)
      .find((_: any) => (_e: any) => _e.id === props.condition.delayedAction)?.[0]
      ?.eventAttr?.attrs ?? null;

  return targetEvents;
});
</script>

<template>
  <div class="BehaviorSubContent">

     <LogicalLine :model-value="condition.logicalChar" :display="condition.conditions?.length">
        <div v-if="attrs" class="filter-option-content">
          <el-form :label-width="0" :inline="true" :model="condition.conditions">
            <el-row v-for="(item, index) in condition.conditions" :key="`${item.field}-${index}`" :gutter="5"
              class="filter-item-rule">
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
                  <AttrRender :field="item.field" v-model="item.fieldValue" :attrs="attrs" />&nbsp;
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
                </el-text>
              </el-col>
            </el-row>

            <div v-if="!(
              condition?.filterRules?.groups?.length |
              condition?.filterRules?.conditions?.length
            )
              " class="filter-item-rule" />
          </el-form>
        </div>
      </LogicalLine>
  </div>
</template>

<style scoped lang="scss">
.BehaviorSubContent {
  margin: 10px 0;

  border-radius: 8px;

  background-color: #f7f8fa;
}

:deep(.el-form-item) {
  margin-right: 0;
  margin-bottom: 0;
}
</style>
