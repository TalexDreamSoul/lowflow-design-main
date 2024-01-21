<script setup lang="ts" name="ConditionFilter">
import { FilterRules } from "./index";
import { Field } from "~/components/Render/interface";
import { useVModel } from "@vueuse/core";
import { Delete, CirclePlus, CircleClose } from "@element-plus/icons-vue";
import Trigger from "./Trigger.vue";
import Operator from "./Operator.vue";
import Render from "~/components/Render/index";

const $props = defineProps<{
  filterFields: Field[];
  modelValue: FilterRules;
}>();
const $emits = defineEmits<{
  (e: "update:modelValue", modelValue: FilterRules): void;
  (e: "addCondition", index: number): void;
  (e: "delCondition", index: number): void;
  (e: "delGroup"): void;
}>();
const filterRules = useVModel($props, "modelValue", $emits);
/**
 * 添加条件
 */
const addRule = () => {
  filterRules.value.conditions.push({
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
  filterRules.value.conditions.splice(index, 1);
  if (filterRules.value.conditions.length <= 0) {
    $emits("delGroup");
  }
  $emits("delCondition", index);
};
/**
 * 条件条件组
 */
const addGroup = () => {
  filterRules.value.groups.push({
    logicalOperator: "and",
    conditions: [
      {
        field: null,
        operator: "",
        value: null,
      },
    ],
    groups: [],
  });
};
/**
 * 删除条件组
 * @param index
 */
const delGroup = (index: number) => {
  filterRules.value.groups.splice(index, 1);
};

const toggleLogicalOperator = () => {
  console.log(filterRules.value.logicalOperator);
  switch (filterRules.value.logicalOperator) {
    case "and":
      filterRules.value.logicalOperator = "or";
      break;
    default:
      filterRules.value.logicalOperator = "and";
      break;
  }
  // filterRules.value.logicalOperator == 'and' ? 'or' : 'and'
  //  $emits('update:modelValue', filterRules.logicalOperator === 'and' ? 'or' : 'and');
};
</script>

<template>
  <div class="filter-container">
    <div class="logical-operator">
      <div class="logical-operator__line"></div>
      <div class="custom-switch" :class="{ active: filterRules.logicalOperator === 'and' }" @click="toggleLogicalOperator">
        {{ filterRules.logicalOperator === 'and' ? '且' : '或' }}
      </div>
    </div>
    <div class="filter-option-content">
      
      <el-form :label-width="0" :inline="true" :model="filterRules">
        <el-row v-for="(item, index) in filterRules.conditions" :key="`${item.field}-${index}`" :gutter="5" class="filter-item-rule">
          <el-col :xs="24" :sm="7">
            <el-form-item :prop="'conditions.' + index + '.field'" style="width: 100%;">
              <trigger ref="triggerRef" :options="$props.filterFields.filter(e=>e.value!==undefined)" :filter-rules="filterRules" v-model="item.field" @update:model-value="item.value = null" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="5" v-if="item.field">
            <el-form-item :prop="'conditions.' + index + '.operator'" style="width: 100%;">
              <operator ref="operatorRef" v-model="item.operator" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="10" v-if="item.field">
            <el-form-item :prop="'conditions.' + index + '.value'" style="width: 100%;">
              <Render :field="$props.filterFields.find(e=>e.id===item.field)" v-model="item.value" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="2" style="display: flex;align-items: center;flex-direction: row-reverse;">
            <el-button plain circle type="danger" :icon="Delete" @click="handleDel(index)" />
          </el-col>
        </el-row>
        <ConditionFilter v-for="(item,index) in filterRules.groups" :key="index" @delGroup="delGroup(index)" v-model="filterRules.groups[index]" :filterFields="filterFields">
          <el-button @click="delGroup(index)" :icon="CircleClose" class="filter-filter-item__add">
            删除条件组
          </el-button>
        </ConditionFilter>
        <div v-if="filterRules.groups.length===0 && filterRules.conditions.length===0" class="filter-item-rule" />
      </el-form>
      <div class="filter-item-rule">
        <el-button @click="addRule" :icon="CirclePlus" class="filter-filter-item__add">
          添加事件
        </el-button>
        <el-button @click="addGroup" :icon="CirclePlus" class="filter-filter-item__add">
          添加事件组
        </el-button>
        <slot />
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss">
:deep(.el-form-item) {
  margin-right: 0;
  margin-bottom: 0;
}

.filter-container {
  background-color: #f5f8fc;
  border-radius: 3px;
  display: flex;

  .logical-operator {
    position: relative;
    display: flex;
    align-items: center;
    overflow: hidden;
    min-width: 60px;
    padding-right: 5px;

    .logical-operator__line {
      position: absolute;
      left: calc(22% - 1px);
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