<script setup lang="ts">
import Segmented from "~/components/Segmented";
import { useVModels } from "@vueuse/core";
import { StartNode } from "../nodes/Start/index";
import { Field } from "~/components/Render/interface";
import { FormProperty } from "~/views copy/flowDesign/index";
import { computed, inject, Ref, ref, watchEffect, reactive } from "vue";
import { Delete, CirclePlus, CircleClose } from "@element-plus/icons-vue";
import { getmarketingTouchNodeStatistics } from "~/api/index";

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
const num = ref(100);
const marketingTouchNode = ref();

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
const toggleLogicalOperator = () => {
  console.log(logicalOperator.value);
  switch (logicalOperator.value) {
    case "and":
      logicalOperator.value = "or";
      break;
    default:
      logicalOperator.value = "and";
      break;
  }
  // logicalOperator.value == 'and' ? 'or' : 'and'
  //  $emits('update:modelValue', filterRules.logicalOperator === 'and' ? 'or' : 'and');
};
const estimation = async() => {
  let res = await getmarketingTouchNodeStatistics({
	"id": 0
});
  marketingTouchNode.value = res.data;
  console.log("Mounted", res);
};
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
              <div class="custom-switch" :class="{ active: logicalOperator === 'and' }" @click="toggleLogicalOperator">
                {{ logicalOperator === 'and' ? '且' : '或' }}
              </div>
              <!-- <el-switch v-model="logicalOperator" inline-prompt style="--el-switch-on-color: #409EFF; --el-switch-off-color: #67C23A" active-value="and" inactive-value="or" active-text="且" inactive-text="或" /> -->
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

      <div class="yugu_flex">
        <div class="title">
          预估受众客户
        </div>
        <el-button @click="estimation" class="buttonyugu" round>立即预估</el-button>

      </div>
      <div class="flexyugu">
        <div class="grayblockfirst">
          <div class="topName">
            预估受众客户总数
          </div>
          <div v-if="num==100">400</div>
          <div style="color: #FF5050;" v-else>无法预估数据</div>
        </div>
        <div class="grayblock">

          <div class="innerblock">
            <div>
              <div class="topName">
                APP Push
              </div>
              <div>
                {{ num?num:"-" }}
              </div>
            </div>
          </div>
          <div class="innerblock">
            <div>
              <div class="topName">
                APP内部
              </div>
              <div>
                {{ num?num:"-" }}

              </div>
            </div>
          </div>
          <div class="innerblock">
            <div>
              <div class="topName">
                企业微信
              </div>
              <div>
                {{ num?num:"-" }}

              </div>
            </div>
          </div>
          <div class="innerblock">
            <div>
              <div class="topName">
                智能外呼
              </div>
              <div>
                {{ num?num:"-" }}

              </div>
            </div>
          </div>
          <div class="innerblock">
            <div>
              <div class="topName">
                手机短信
              </div>
              <div>
                {{ num?num:"-" }}

              </div>
            </div>
          </div>
        </div>

      </div>

      <div class="yugu_flex">
        <div class="title">
          黑名单
        </div>

      </div>

      <el-form-item label="过滤黑名单" label-class="custom-label">

        <el-select style="width: 100px">
          <el-option value="no" label="不过滤">不过滤</el-option>
          <el-option value="yes" label="过滤">过滤</el-option>
        </el-select>

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
  background-color: #f5f8fc !important;
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
.yugu_flex {
  display: flex;
  align-items: center;
  min-height: 48px;
  .title {
    font-size: 16px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.9);
  }
  .buttonyugu {
    background: linear-gradient(rgb(32, 92, 203) 0%, rgb(89, 143, 241) 100%);
    margin-left: 12px;
    color: #ffffff;
    height: 32px;
  }
}
.flexyugu {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.grayblock {
  //width: 120px;
  background: #f2f4f8;
  border-radius: 4px 4px 4px 4px;
  //margin-right: 12px;
  display: flex;
  align-items: center;
  min-height: 48px;
  .innerblock {
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    padding: 20px;
  }
  .innerblock:last-child {
    /* 样式属性 */
    border-right: none;
  }

  .topName {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.6);
    margin-bottom: 8px;
  }
}
.grayblockfirst {
  //width: 160px;
  /* 其他样式属性可以根据需求添加 */
  margin-right: 12px;
  background: #f2f4f8;
  border-radius: 4px 4px 4px 4px;
  padding: 20px;

  .topName {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.6);
    margin-bottom: 8px;
  }
}
</style>
