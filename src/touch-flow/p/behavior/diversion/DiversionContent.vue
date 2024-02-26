<script setup lang="ts" name="EventContent">
import { computed, inject } from "vue";
import { Delete } from "@element-plus/icons-vue";
import BehaviorSubContent from "./DiversionSubContent.vue";
import LogicalLine from "../LogicalLine.vue";

const props = defineProps<{
  condition: any;
  dict: any;
}>();

const refreshTree: Function = inject("refreshTree")!;

const handleDel = (index: number) => {
  props.condition.conditions.splice(index, 1);

  refreshTree();
};

const conditionArr = computed(() => props.condition.conditions);

function handleAdd() {
  props.condition.conditions.push({});
}

function handleSubAdd(item: any) {
  console.log("----", item.conditions, conditionArr.value)
  const arr = (item.conditions.conditions = item.conditions.conditions || []);

  arr.push({
    attr: '',
    label: '',
    type: ''
  });
}

const attrs = computed(() => {
  const { events } = props.dict;

  return events;
});
</script>

<template>
  <div class="CustomContent">
    <LogicalLine :display="conditionArr?.length" v-model="condition.logicalChar">
      <div v-if="conditionArr" class="filter-option-content">
        <el-form :label-width="0" :inline="true" :model="condition.conditions">
          <div v-for="(item, index) in conditionArr" :key="`${item.field}-${index}`" class="CustomBehavior-Main">
            <el-row class="filter-item-rule">
              &nbsp;<el-col :xs="24" :sm="6">
                <el-form-item :prop="'conditions.' + index + '.value'" style="width: 100%">
                  <el-select v-model="item.action">
                    <el-option-group v-for="group in dict?.events" :key="group.eventType" :label="group.eventTypeName">
                      <el-option v-for="item in group.events" :key="item.id" :label="item.eventName" :value="item.eventCode" />
                    </el-option-group> </el-select>
                </el-form-item>
              </el-col>

              &nbsp;
              <el-col :xs="24" :sm="3" >

                <el-text type="primary" style="cursor: pointer;zoom: 0.8;" @click="handleSubAdd(item)">
                  <el-icon size="12">
                    <Plus />
                  </el-icon>
                  添加筛选
                </el-text> &nbsp;
              </el-col>
              &nbsp;&nbsp;
              <el-col :xs="24" :sm="1" style="
                display: flex;
                align-items: center;
                flex-direction: row-reverse;
              ">
              <el-text type="primary" style="cursor: pointer" @click="handleDel(index)">
                  <el-icon size="14">
                    <Delete />
                  </el-icon>
                </el-text>
                &nbsp;&nbsp;
                <el-text type="primary" style="cursor: pointer" @click="handleAdd">
                  <el-icon size="14">
                    <CirclePlus />
                  </el-icon>
                </el-text>
                &nbsp;&nbsp;

              </el-col>

            </el-row>

            <BehaviorSubContent title="并且满足" :index="index" :dict="dict" :condition="item" />
          </div>

        </el-form>
      </div>
    </LogicalLine>
  </div>
</template>

<style scoped lang="scss">
:deep(.add-filter__inner) {
  display: none !important;
}

.CustomContent {
  margin: 10px 0;

  border-radius: 8px;

  .filter-container {
    //background-color: #f5f8fc;
    //border-radius: 3px;
    display: flex;

    .fontstyle {
      font-size: 12px;
      font-weight: 400;
      color: #000000;
      position: relative;
      display: flex;
      align-items: center;
      overflow: hidden;
      min-width: 55px;
    }

    .logical-operator {
      position: relative;
      display: flex;
      align-items: center;
      overflow: hidden;
      min-width: 40px;

      .logical-operator__line {
        position: absolute;
        left: calc(38% - 1px);
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
        //min-height: 48px;
      }

      .filter-filter-item__add {
        border-style: dashed;
        width: 100%;
      }
    }
  }
}
.filter-item-rule {
  display: flex;
  align-items: center;
  //min-height: 48px;
}
.TargetContent-TopBanner {
  background: #ebeff3;
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

.el-form-item {
  margin-right: 0;
  margin-bottom: unset !important;
}
</style>
