<script setup lang="ts">
import { inject, ref, reactive, watchEffect, watch } from "vue";
import { ElMessage } from "element-plus";
import { randomStr } from "~/utils/common";
import FilterGroup from "./condition/FilterGroup.vue";
import BehaviorGroupPlus from "../behavior/BehaviorGroupPlus.vue";
import TouchEstimation from "~/touch-flow/page/TouchEstimation.vue";
import { markRaw } from "vue";
import CommonAttr from "./CommonAttr.vue";
import { validateCommonDays } from "~/touch-flow/flow-utils";
import { MarketingTouchNodeEditDTO } from "~/touch-flow/touch-total";
import StrategistTargetAttr from "~/touch-flow/page/StrategistTargetAttr.vue";

const origin: MarketingTouchNodeEditDTO = {
  nodeId: "",
  nodeType: "strategy",
  nodeName: "",
  containTarget: false,
  diversionType: "noDiversion",
  touchTemplateContent: {},
  nodeDelayed: {
    delayedAction: "nothing",
    delayedTime: 0,
    delayedUnit: "day",
    isDelayed: false,
  },
  customRuleContent: {
    customAttr: {
      conditions: [],
      logicalChar: "或",
    },
    customEvent: {
      conditions: [],
      logicalChar: "或",
    },
    eventSequence: {
      conditions: [],
      logicalChar: "或",
    },
    logicalChar: "或",
  },
  eventRuleContent: {
    customAttr: {
      conditions: [],
      logicalChar: "或",
    },
    customEvent: {
      conditions: [],
      logicalChar: "或",
    },
    eventSequence: {
      conditions: [],
      logicalChar: "或",
    },
    logicalChar: "或",
  },
  eventDelayed: {
    delayedAction: "=",
    delayedTime: 1,
    delayedType: "",
    delayedUnit: "day",
    isDelayed: false,
  },
  labelContent: {
    labelId: -1,
    labelName: "",
    labelValue: [],
  },
};

const props = defineProps<{
  p: MarketingTouchNodeEditDTO;
  new?: boolean;
  readonly?: boolean;
}>();

const touchSettingsRef = ref();
const sizeForm = reactive<typeof origin>(origin);

watch(
  () => sizeForm.diversionType,
  (val) => {
    sizeForm.eventDelayed!.isDelayed = val === "event";
  }
);

watchEffect(() => {
  const { nodeType, nodeId } = props.p;

  if (props.new || nodeType !== "strategy") return;

  if (nodeId) {
    Object.assign(sizeForm, props.p);

    sizeForm.nodeId = nodeId;

    if (props.p.touchTemplateContent)
      sizeForm.touchTemplateContent = props.p.touchTemplateContent;

    console.log("aqwqsdadas", props.p, sizeForm)
  }
});

function saveData() {
  if (!sizeForm.nodeName) {
    ElMessage.warning({
      message: "请输入策略名称",
    });

    return false;
  }

  if (
    !validateCommonDays(
      sizeForm.nodeDelayed.delayedTime,
      sizeForm.nodeDelayed.delayedUnit
    )
  ) {
    ElMessage.warning({
      message: "延迟设置折算时间不可超过30天！",
    });

    return false;
  }

  touchSettingsRef.value.updateData();

  const _: any = { nodeId: "", children: [] };
  Object.assign(_, sizeForm);

  // console.log("ppp", _);

  Object.defineProperty(_, "father", {
    value: markRaw(props.p),
    enumerable: false,
  });

  // 修改 Modify Edit
  if (sizeForm.nodeId === _.nodeId && sizeForm.nodeId!.length) {
    Object.assign(props.p, _);
  } else {
    const arr = [...props.p.children];

    while (arr.length) {
      const item = arr.shift();

      if (item.nodeName === _.nodeName) {
        ElMessage.warning({
          message: "策略名称重复",
        });

        return false;
      }
    }

    _.nodeId = randomStr(12);

    // console.log("add", props.p);

    props.p.children.push(_);
  }

  return true;
}

type IRegSaveFunc = (regFunc: () => boolean) => void;
const regSaveFunc: IRegSaveFunc = inject("save")!;
regSaveFunc(saveData);
</script>

<template>
  <div>
    <el-form ref="form" :model="sizeForm" label-width="auto" label-position="left">
      <el-form-item label="选择策略器名称：">
        <el-input v-model="sizeForm.nodeName" placeholder="填写名称" />
      </el-form-item>
      <el-form-item label="分流类型：">
        <el-radio-group v-model="sizeForm.diversionType">
          <el-radio label="noDiversion">不分流</el-radio>
          <el-radio label="attr">按属性用户行为分流</el-radio>
          <el-radio label="event">按触发事件分流</el-radio>
        </el-radio-group>
      </el-form-item>

      <BehaviorGroupPlus title="用户属性行为分流" color="#333333"
        :class="{ animation: true, display: sizeForm.diversionType === 'attr' }">
        <div class="titleCondition">进入该策略期的用户需要满足以下条件：</div>
        <FilterGroup :readonly="readonly" :custom-rule-content="sizeForm.customRuleContent" />
      </BehaviorGroupPlus>

      <BehaviorGroupPlus title="触发事件分流" color="#333333"
        :class="{ animation: true, display: sizeForm.diversionType === 'event' }">
        <div class="flex-column titleCondition">
          <el-text>进入该策略器的客户需要满足以下条件：在&nbsp;&nbsp;</el-text>
          <el-input-number :min="1" v-model="sizeForm.eventDelayed!.delayedTime" type="number"
            style="width: 100px" />&nbsp;
          <el-select v-model="sizeForm.eventDelayed!.delayedUnit" style="width: 100px">
            <el-option value="minute" label="分钟">分钟</el-option>
            <el-option value="hour" label="小时">小时</el-option>
            <el-option value="day" label="天">天</el-option> </el-select>&nbsp;
          <el-text>
            后判断客户
            <el-select v-model="sizeForm.eventDelayed!.delayedAction" style="width: 100px">
              <el-option value="=" label="做过">做过</el-option>
              <el-option value="!=" label="没做过">没做过</el-option>
            </el-select>
          </el-text>
        </div>

        <FilterGroup :readonly="readonly" :custom-rule-content="sizeForm.eventRuleContent!"
          :configuration="{ ignore: { attrs: true, sequence: true } }" />
      </BehaviorGroupPlus>

      <CommonAttr ref="touchSettingsRef" :sizeForm="sizeForm" />

      <TouchEstimation :readonly="readonly" :custom-rule-content="sizeForm.customRuleContent" />

      <StrategistTargetAttr :readonly="readonly" :size-form="sizeForm" />
    </el-form>
  </div>
</template>

<style lang="scss">
.BehaviorGroupPlus.animation {
  &.display {
    opacity: 1;
    pointer-events: auto;

    height: unset;

    margin-bottom: 0;
  }

  opacity: 0;
  pointer-events: none;

  height: 36px;

  margin-bottom: -50px;
}

li:has(.template-option):has(.template-desc) {
  height: 50px;
}

.template-desc {
  position: relative;
  margin-top: -15px;
  display: block;

  color: #000;
  opacity: 0.4;

  max-width: 100px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>

<style scoped lang="scss">
.flex-column {
  display: -webkit-inline-box !important;
  align-items: flex-start !important;
  flex-direction: column !important;
}

.titleCondition {
  color: #666;
  font-size: 14px;
  margin-top: 24px;
}

.pannel {
  width: 100%;
  min-height: 200px;
  //padding: 0 15px;
  //background-color: #f5f8fc;
}

.filter-filter-item__add {
  position: absolute;
  right: 12px;
}

.flex-column {
  display: -webkit-inline-box !important;
  align-items: flex-start !important;
  flex-direction: column !important;
}

:deep(.el-form-item) {
  margin-right: 0;
  margin-bottom: 0;
}

.BlockBackground {
  font-size: 14px;
  border-radius: var(--el-border-radius-base);
  margin-top: 24px;

  .title_set {
    padding: 8px 12px;
    background: #eaeff3;
    border-left: 4px solid #62c943;
    display: flex;
    justify-content: space-between;
  }

  .bg001 {
    border-left: 4px solid #333;
  }

  .pg2 {
    border-left: 4px solid #a053cd;
  }

  .pg3 {
    border-left: 4px solid #277ae7;
  }

  .BlockBackground-Under {
    padding: 12px;
    background: #f7f8fa;
  }
}
</style>
