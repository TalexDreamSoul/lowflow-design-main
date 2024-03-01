<script setup lang="ts" name="CustomContent">
import { computed, inject } from "vue";
import { Delete } from "@element-plus/icons-vue";
import AttrRender from "../../page/AttrRender.vue";
import Operator from "../../page/Operator.vue";
import Trigger from "../../page/Trigger.vue";
import LogicalLine from "./LogicalLine.vue";
// import CustomBlock from "./CustomBlock.vue";

const props = defineProps<{
  condition: any;
  dict: any;
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

const refreshTree: Function = inject("refreshTree")!;

const handleDel = (index: number) => {
  props.condition.conditions.splice(index, 1);

  refreshTree();
};

if (!props.condition.type) {
  Object.assign(props.condition, { ...dataObj });
}

const conditionArr = computed(() => props.condition.conditions);

function handleAdd() {
  props.condition.conditions.push({ ...dataObj });
}

const attrs = computed(() => {
  const { attrs, labels } = props.dict;

  const _attrs = attrs.map((attr: any) => {
    return {
      label: attr.fieldName,
      value: attr.field,
      ...attr,
    };
  });

  const _labels = labels.map((label: any) => {
    const children: any = [];
    if (label.labelValue) {
      [...label.labelValue.data].forEach((item) => {
        children.push({
          label: item,
          value: item,
          ...label,
        });
      });
    }

    return {
      label: label.labelName,
      children,
      ...label,
    };
  });

  return [
    {
      label: "用户属性",
      value: "attr",
      children: _attrs,
    },
    {
      label: "用户标签",
      value: "label",
      children: _labels,
    },
  ];
});

const getCurrSelected = (condition: any) =>
  [...attrs.value]
    .map((_: any) =>
      [..._.children].map((__: any) => (__.children?.length ? __.children : [__]))
    )
    .flat(2)
    .find((_: any) => _.field === condition.field || _.label === condition.field);
</script>

<template>
  <div class="CustomContent">
    <LogicalLine :display="!conditionArr?.length" v-model="condition.logicalChar">
      <div v-if="conditionArr" class="filter-option-content">
        <el-form :label-width="0" :inline="true" :model="condition.conditions">
          <el-row
            v-if="false"
            v-for="(item, index) in conditionArr"
            :key="`${item.field}-${index}`"
            class="filter-item-rule"
          >
            <el-col :xs="24" :sm="6">
              <el-form-item :prop="'conditions.' + index + '.field'" style="width: 100%">
                <trigger
                  multiple
                  v-model="item.attr.field"
                  :attrs="attrs"
                  placeholder="客户属性/标签"
                />
              </el-form-item>
            </el-col>
            &nbsp;<el-col :xs="24" :sm="4" v-if="item.attr.field">
              <el-form-item
                :prop="'conditions.' + index + '.operator'"
                style="width: 100%"
              >
                <operator
                  :selected="getCurrSelected(item)"
                  :attrs="attrs"
                  :item="item.attr"
                  ref="operatorRef"
                  v-model="item.attr.fieldOp"
                />
              </el-form-item>
            </el-col>
            &nbsp;<el-col :xs="24" :sm="6" v-if="getCurrSelected(item)">
              <el-form-item :prop="'conditions.' + index + '.value'" style="width: 100%">
                <AttrRender
                  :selected="getCurrSelected(item)"
                  :item="item.attr"
                  :attrs="attrs"
                />
              </el-form-item>
            </el-col>
            &nbsp;
            <el-col
              :xs="24"
              :sm="2"
              style="display: flex; align-items: center; flex-direction: row-reverse"
            >
              <el-text type="primary" style="cursor: pointer" @click="handleDel(index)">
                <el-icon size="14">
                  <Delete />
                </el-icon>
              </el-text>
              &nbsp;&nbsp;&nbsp;
              <el-text type="primary" style="cursor: pointer" @click="handleAdd">
                <el-icon size="14">
                  <CirclePlus />
                </el-icon>
              </el-text>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </LogicalLine>
  </div>
</template>

<style scoped lang="scss">
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
      min-width: 70px;
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
