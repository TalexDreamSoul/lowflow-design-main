<script setup lang="ts" name="CustomContent">
import { computed, inject } from "vue";
import { CirclePlusFilled, Delete } from "@element-plus/icons-vue";
import AttrRender from "../../page/AttrRender.vue";
import Operator from "../../page/Operator.vue";
import Trigger from "../../page/Trigger.vue";
import LogicalLine from "./LogicalLine.vue";
import { AttrConditionDTO } from "../../touch-total";
// import CustomBlock from "./CustomBlock.vue";

const props = defineProps<{
  condition: AttrConditionDTO;
  readonly?: boolean;
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

const conditionArr = computed(() => {
  const arr = props.condition.conditions || [];

  for (let item of arr) {
    if (!item.type) {
      Object.assign(item, JSON.parse(JSON.stringify(dataObj)));
    }
  }

  return arr;
});

function handleAdd() {
  props.condition.conditions.push(JSON.parse(JSON.stringify(dataObj)));
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
    <LogicalLine :display="conditionArr?.length < 2" v-model="condition.logicalChar">
      <div v-for="(item, index) in conditionArr" :key="index" class="AttrLine">
        <trigger
          @update-type="(val) => item.type = val"
          multiple
          v-model="item.attr.field"
          :item="item.attr"
          :attrs="attrs"
          :disabled="readonly"
          placeholder="客户属性/标签"
        />
        <operator
          :selected="getCurrSelected(item)"
          :attrs="attrs"
          :item="item.attr"
          :disabled="readonly"
          ref="operatorRef"
          v-model="item.attr.fieldOp"
        />
        <AttrRender
          :selected="getCurrSelected(item)"
          :disabled="readonly"
          :item="item.attr"
          :attrs="attrs"
        />

        <div>
          <template v-if="index + 1 === conditionArr.length">
            <el-text type="primary" style="cursor: pointer" @click="handleAdd">
              <el-icon size="14">
                <CirclePlusFilled />
              </el-icon>
              添加同组
            </el-text>
            &nbsp;&nbsp;&nbsp;
          </template>
          <el-text type="primary" style="cursor: pointer" @click="handleDel(index)">
            <el-icon size="14">
              <Delete />
            </el-icon>
            删除
          </el-text>
        </div>
      </div>
    </LogicalLine>
  </div>
</template>

<style scoped lang="scss">
.CustomContent {
  margin: 10px 0;

  border-radius: 8px;
}

.TargetContent-TopBanner {
  background: #ebeff3;
  border-radius: 4px 4px 0px 0px;
  font-size: 12px;
  font-weight: 400;
  color: #000000;
  padding: 0px 24px;
}

.AttrLine {
  display: flex;

  align-items: center;

  flex: 1;
  gap: 0.5rem;
}
</style>
