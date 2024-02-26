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
  title?: string
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

  const flattedEvents = [...events].map((e: any) => e.events)

  const targetEvent = flattedEvents.flat().find((item: any) => item.eventCode === props.condition.delayedAction)

  return targetEvent?.eventAttr?.attrs;
});
</script>

<template>
  <div class="BehaviorSubContent">

    <LogicalLine :title="title" :model-value="condition.logicalChar"
      :display="condition.conditions ? !(condition.conditions.length > 1) : !0">
      <div v-if="attrs" class="filter-option-content">
        <el-form :label-width="0" :inline="true" :model="condition.conditions">
          <el-row v-for="(item, index) in condition.conditions" :key="`${item.field}-${index}`" :gutter="5"
            class="filter-item-rule">
            <el-col :xs="24" :sm="7">
              <el-form-item :prop="'conditions.' + index + '.field'" style="width: 100%">
                <trigger v-model="item.field" :attrs="attrs" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="4" v-if="item.field">
              <el-form-item :prop="'conditions.' + index + '.operator'" style="width: 100%">
                <operator :attrs="attrs" :item="item" ref="operatorRef" v-model="item.operator" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="6" v-if="item.field">
              <el-form-item :prop="'conditions.' + index + '.value'" style="width: 100%">
                <AttrRender :operator="item.operator" :field="item.field" v-model="item.fieldValue" :attrs="attrs" />
              </el-form-item>
            </el-col>
            <el-col class="add-filter__inner" :xs="24" :sm="3">
              <el-text type="primary" style="cursor: pointer;zoom: 0.8;    display: inline-block;width: 100px;" @click="addCondition">
                <el-icon size="14">
                  <CirclePlusFilled />
                </el-icon>
                添加筛选
              </el-text>
            </el-col>
            <el-col :xs="24" :sm="1">
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
