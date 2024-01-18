<script setup lang="ts" name="ConditionFilter">
import { FilterRules } from "./index";
import { Field } from "~/components/Render/interface";
import { useVModel } from "@vueuse/core";
import { Delete, CirclePlus, CircleClose } from "@element-plus/icons-vue";
import Trigger from "./Trigger.vue";
import Operator from "./Operator.vue";
import Render from "~/components/Render/index";
import { dictFilterTree } from "~/api/index";
import { onMounted, ref } from "vue";
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
const dictFilter = ref();
const dictFilterValue = ref();

onMounted(() => {
  getdictFilterTree();
});
/**
 * 获取字典树
 */
const getdictFilterTree = async () => {
  let res = await dictFilterTree();
  dictFilter.value = res.data;
  console.log("Mounted", res);
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
  <div class="toppannel">
    目标{{ filterRules.length?filterRules.length:"一" }}
  </div>

  <div class="filter-wrap">
    <div class="garyblock">
      <el-text>客户进入流程后，在</el-text>&nbsp;
      <el-input v-model="input" type="number" style="width: 100px" />&nbsp;
      <el-select v-model="selectedType" style="width: 150px">
        <el-option value="month" label="月份">分钟</el-option>
        <el-option value="week" label="周">小时</el-option>
        <el-option value="day" label="天">天</el-option>
      </el-select>&nbsp;
      <el-text>内完成以下转化事件，则认为完成目标</el-text>

    </div>
    <div>
      <el-select v-model="dictFilterValue" style="width: 240px">
        <el-option-group v-for="group in dictFilter?.events" :key="group.eventType" :label="group.eventTypeName">
          <el-option v-for="item in group.events" :key="item.id" :label="item.eventName" :value="item.id" />
        </el-option-group>
      </el-select>&nbsp;
      <el-text type="primary" style="cursor: pointer;" @click="addRule">
        <el-icon size="14">
          <CirclePlusFilled />
        </el-icon>
        筛选条件
      </el-text>

    </div>
    <div class="filter-container">
      <div class="fontstyle">
        并且满足
      </div>
      <div class="logical-operator" v-if="filterRules.conditions.length>1">
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

          <div v-if="filterRules.groups.length===0 && filterRules.conditions.length===0" class="filter-item-rule" />
        </el-form>
      </div>

    </div>
  </div>

</template>

<style scoped lang="scss">
.toppannel {
  background: #edeff4;
  border-radius: 4px 4px 0px 0px;
  font-size: 12px;
  font-weight: 400;
  color: #000000;
  padding: 12px 24px 12px 24px;
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