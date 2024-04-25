<script setup lang="ts" name="CustomContent">
import { computed, inject } from "vue";
import { CirclePlusFilled, Delete } from "@element-plus/icons-vue";
import AttrRender from "../../page/AttrRender.vue";
import Operator from "../../page/Operator.vue";
import Trigger from "../../page/Trigger.vue";
import MultipleTrigger from "~/touch-flow/page/MultipleTrigger .vue";
import LogicalLine from "./LogicalLine.vue";
import { AttrConditionDTO } from "../../touch-total";
// import CustomBlock from "./CustomBlock.vue";

const props = defineProps<{
  condition: AttrConditionDTO;
  readonly?: boolean;
  dict: any;
  outside?: boolean;
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
      [...(label?.labelValue?.data || [])].forEach((item) => {
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

  // console.log("aaaaaaaa", attrs, labels, _attrs, _labels)

  // 转换数据结构
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

const getCurrSelected = (condition: any) => {
  const arr = [...attrs.value]
    .map((_: any) =>
      [..._.children].map((__: any) =>
        __.children?.length ? __.children : [__]
      )
    )
    .flat(2);
  const { type } = condition;

  if (type === "attr") {
    const { id } = condition.attr;

    return arr.find((_: any) => _.id === id);
  } else {
    const { id } = condition.label;

    return arr.find((_: any) => _.id === id);
  }
};
</script>

<template>
  <div class="CustomContent">
    <LogicalLine :readonly="readonly" :display="conditionArr?.length < 2" v-model="condition.logicalChar">
      <div v-for="(item, index) in conditionArr" :key="index" class="AttrLine">
        <MultipleTrigger :readonly="readonly" :obj="item" :attrs="attrs" :disabled="readonly" placeholder="客户属性/标签" :style="`width: ${item.type === 'label' ? '500' : '220'}px`" />
        <operator :readonly="readonly" :selected="getCurrSelected(item)" :attrs="attrs" :item="item.attr" :obj="item" :disabled="readonly" ref="operatorRef" v-model="item.attr.fieldOp" style="width: 120px" />
        <AttrRender :conditions="conditionArr" :readonly="readonly" :outside="outside" :selected="getCurrSelected(item)" :disabled="readonly" :item="item.attr" :obj="item" :attrs="attrs" />

        <div v-if="!readonly" style="zoom:.8">
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
  //margin-top: 1rem;
  flex-wrap: wrap;
  align-items: center;

  flex: 1;
  gap: 0.5rem;
}
</style>
