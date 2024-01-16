<script setup lang="ts">
import Segmented from "~/components/Segmented";
import { useVModels } from "@vueuse/core";
import { StartNode } from "../nodes/Start/index";
import { Field } from "~/components/Render/interface";
import { FormProperty } from "~/views copy/flowDesign/index";
import { computed, inject, Ref, ref, watchEffect, reactive } from "vue";
import { Delete, CirclePlus, CircleClose } from "@element-plus/icons-vue";

import BehaviorFoldingGroup from "~/components/BehaviorFoldingGroup/index.vue";

const labelPosition = ref("single");
const sizeForm = reactive({
  name: "",
  region: "",
  date1: "",
  date2: "",
  date3: "",
  delivery: false,
  type: [],
  restrictions: "",
  resourceday: "",
  resourcetimes: "",
  desc: "",
  timenine: "",
  selectedType: "",
  weekday: "",
  monthday: "",
});

export interface ApprovalAttr {
  node: StartNode;
}

const $props = defineProps<ApprovalAttr>();
const $emits = defineEmits<{
  (e: "update:node", modelValue: StartNode): void;
}>();
const { node } = useVModels($props, $emits);
console.log(node.value, "StartNode");
const { fields } = inject<{
  fields: Ref<Field[]>;
}>("nodeHooks")!;
const logicalOperator = ref("and");

// 全部可写
const allWriteable = computed({
  get() {
    return node.value.formProperties.every((e) => e.writeable);
  },
  set(val) {
    node.value.formProperties.forEach((e) => (e.writeable = val));
    if (val) {
      allReadable.value = false;
      allHidden.value = false;
    } else {
      allRequired.value = false;
    }
  },
});

function onSubmit() {
  console.log("submit!");
}
// 全部必填
const allRequired = computed({
  get() {
    return node.value.formProperties.every((e) => e.required);
  },
  set(val) {
    node.value.formProperties.forEach((e) => (e.required = val));
    if (val) {
      allWriteable.value = true;
      allReadable.value = false;
      allHidden.value = false;
    }
  },
});
// 全部可读
const allReadable = computed({
  get() {
    return node.value.formProperties.every((e) => e.readable);
  },
  set(val) {
    node.value.formProperties.forEach((e) => (e.readable = val));
    if (val) {
      allWriteable.value = false;
      allHidden.value = false;
      allRequired.value = false;
    }
  },
});
// 全部隐藏
const allHidden = computed({
  get() {
    return node.value.formProperties.every((e) => e.hidden);
  },
  set(val) {
    node.value.formProperties.forEach((e) => (e.hidden = val));
    if (val) {
      allWriteable.value = false;
      allRequired.value = false;
      allReadable.value = false;
    }
  },
});

// 在子组件中定义 submitEvent 方法
const submitEvent = () => {
  // 在这里写入您的提交逻辑
  console.log(node.value, "执行了提交逻辑");
};

// 暴露 submitEvent 方法给父组件使用
defineExpose({ submitEvent });
watchEffect(() => {
  const formProperties = node.value.formProperties;
  node.value.formProperties = fields.value
    .filter((e) => e.value !== undefined)
    .map((e) => ({
      id: e.id,
      name: e.title,
      readable: e.props.disabled || false,
      writeable: !e.props.disabled || false,
      hidden: e.props.hidden || false,
      required: (e.props.required && !e.props.disabled) || false,
    }));
  node.value.formProperties.forEach((item) => {
    const properties = formProperties.find((f) => f.id === item.id);
    if (properties) {
      item.readable = properties.readable;
      item.writeable = properties.writeable;
      item.hidden = properties.hidden;
      item.required = properties.required;
    }
  });
});
</script>

<template>
  <div>
    <el-form ref="form" :model="sizeForm" label-width="auto" label-position="left">
      <el-text tag="b">受众客户为满足以下条件的客户（触发型非必选）</el-text><br />
      <el-text>若下列条件不添加，则受众客户默认为全部客户</el-text>
      <el-form-item label="">

        <div class="pannel">
          <div class="filter-container">
            <div class="logical-operator">
              <div class="logical-operator__line"></div>
              <el-switch v-model="logicalOperator" inline-prompt style="--el-switch-on-color: #409EFF; --el-switch-off-color: #67C23A" active-value="and" inactive-value="or" active-text="且" inactive-text="或" />
            </div>
            <div class="filter-option-content">

              <el-collapse>
                <el-collapse-item title=" 客户属性满足" class="custom-collapse-item">
                  <BehaviorFoldingGroup v-model="node.conditions" :filter-fields="fields" />

                </el-collapse-item>
                <el-collapse-item title=" 客户行为满足" class="custom-collapse-item">
                  <BehaviorFoldingGroup v-model="node.conditions" :filter-fields="fields" />

                </el-collapse-item>

                <el-collapse-item title=" 行为序列满足" class="custom-collapse-item">
                  <BehaviorFoldingGroup v-model="node.conditions" :filter-fields="fields" />

                </el-collapse-item>
              </el-collapse>
            </div>
            
          </div>

        </div>
      </el-form-item>

    </el-form>
  </div>
</template>

<style scoped lang="scss">
.flex-column {
  display: -webkit-inline-box !important;
  align-items: flex-start !important;
  flex-direction: column !important;
}
.pannel {
  width: 100%;
  min-height: 200px;
  padding: 18px 15px;
}
.underright {
  width: 100%;
  height: 12px;
}
.filter-filter-item__add {
  position: absolute;
  right: 12px;
}

:deep(.el-form-item) {
  margin-right: 0;
  margin-bottom: 0;
}
.el-collapse {
  border: none !important;
  
}
.custom-collapse-item .el-collapse-item__header {
  border-bottom: none !important;
  background-color:#f5f8fc  !important;
}
.el-collapse-item {
  margin: 12px;
  border: 1px solid var(--el-border-color);
  border-radius: 2px;
  background: #f5f8fc;

}


.filter-container {
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
      left: calc(32% - 1px);
      width: 30px;
      border-width: 1px 0 1px 1px;
      border-top-style: solid;
      border-bottom-style: solid;
      border-left-style: solid;
      border-top-color: var(--el-border-color);
      border-bottom-color: var(--el-border-color);
      border-left-color: var(--el-border-color);
      border-image: initial;
      border-right-style: initial;
      border-right-color: initial;
      border-radius: 5px 0 0 5px;
      height: calc(100% - 48px);

      &::before {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        transform: translateX(100%) translateY(-50%);
        width: 6px;
        height: 6px;
        border: var(--el-border);
        border-radius: 50%;
      }

      &::after {
        content: "";
        position: absolute;
        bottom: 0;
        right: 0;
        transform: translateX(100%) translateY(50%);
        width: 6px;
        height: 6px;
        border: var(--el-border);
        border-radius: 50%;
      }
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
</style>
