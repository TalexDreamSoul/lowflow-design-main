<script setup lang="ts">
import { inject, ref, reactive, watchEffect } from "vue";
import { ElMessage } from "element-plus";
import { randomStr } from "~/utils/common";
import BehaviorGroup from "../behavior/BehaviorGroup.vue";
import CustomAttr from "../behavior/CustomAttr.vue";
import CustomBehavior from "../behavior/CustomBehavior.vue";
import CustomBehaviorSequence from "../behavior/sequence/CustomBehaviorSequence.vue";
import LogicalLine from "../behavior/LogicalLine.vue";
import BehaviorGroupPlus from "../behavior/BehaviorGroupPlus.vue";
import EventBehavior from "../behavior/EventBehavior.vue";
import TouchEstimation from "~/touch-flow/page/TouchEstimation.vue";
import { markRaw } from "vue";
import CommonAttr from "../start/CommonAttr.vue";
import { validateCommonDays } from "~/touch-flow/flow-utils";
import { CustomSearchDTO, MarketingTouchNodeEditDTO } from "~/touch-flow/touch-total";

const origin: MarketingTouchNodeEditDTO = {
  nodeId: "",
  nodeType: "strategy",
  nodeName: "",
  value1: false,
  isDelayed: false,
  selectedType: "day",
  delayedAction: "day",
  cascaderLabel: "sms",
  do: false,
  num: 1,
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
    customEvent: {
      conditions: [
        {
          conditions: [{}],
        },
      ],
      logicalChar: "或",
    },
    logicalChar: "或",
  },
  labelContent: {
    labelId: -1,
    labelName: "",
    labelValue: [],
  },
};

const customRuleContent = reactive<CustomSearchDTO>({
  customAttr: {
    conditions: [
      {
        conditions: [
          // {}
        ],
        logicalChar: "或",
      },
    ],
    logicalChar: "或",
  },
  customEvent: {
    conditions: [
      {
        conditions: [
          // {}
        ],
        logicalChar: "或",
      },
    ],
    logicalChar: "或",
  },
  eventSequence: {
    conditions: [
      {
        conditions: [
          // {}
        ],
        logicalChar: "或",
      },
    ],
    logicalChar: "或",
  },
  logicalChar: "或",
  blackList: {
    _enable: "no",
    data: [],
  },
});

const props = defineProps<{
  p: any;
  new?: boolean;
  readonly?: boolean;
}>();

const touchSettingsRef = ref();
const sizeForm = reactive<typeof origin>(origin);

watchEffect(() => {
  const { nodeType, nodeId } = props.p;

  if (props.new || nodeType !== "strategy") return;

  if (nodeId) {
    Object.assign(sizeForm, props.p);

    sizeForm.nodeId = nodeId;
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

    props.p.children.push(_);
  }

  return true;
}

type IRegSaveFunc = (regFunc: () => boolean) => void;
const regSaveFunc: IRegSaveFunc = inject("save")!;
regSaveFunc(saveData);

function attrsAdd() {
  let attr: any = (sizeForm.customRuleContent!.customAttr!.conditions! =
    sizeForm.customRuleContent!.customAttr!.conditions! || []);

  const obj = {
    conditions: [{ conditions: {} }],
    logicalChar: "或",
  };

  attr.push({
    conditions: [obj],
    logicalChar: "或",
  });
}

function behaviorAdd() {
  let attr: any = (sizeForm.customRuleContent!.customEvent!.conditions! =
    sizeForm.customRuleContent!.customEvent!.conditions! || []);

  const obj = {
    conditions: [{ conditions: {} }],
    logicalChar: "或",
  };

  attr.push({
    conditions: [obj],
    logicalChar: "或",
  });
}

function sequenceAdd() {
  let attr: any = (sizeForm.customRuleContent!.eventSequence!.conditions! =
    sizeForm.customRuleContent!.eventSequence!.conditions! || []);

  const obj = {
    conditions: [{ conditions: [{}] }],
    logicalChar: "或",
  };

  attr.push({
    conditions: [obj],
    logicalChar: "或",
  });
}
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

      <BehaviorGroupPlus
        title="用户属性行为分流"
        color="#333333"
        :class="{ animation: true, display: sizeForm.diversionType === 'attr' }"
      >
        <div class="titleCondition">进入该策略期的用户需要满足以下条件：</div>
        <el-form-item label="">
          <LogicalLine v-model="sizeForm.customRuleContent.logicalChar">
            <BehaviorGroup @add="attrsAdd" title="客户属性满足">
              <CustomAttr :custom="sizeForm.customRuleContent!.customAttr" />
            </BehaviorGroup>
            <BehaviorGroup @add="behaviorAdd" title="客户行为满足">
              <CustomBehavior :custom="sizeForm.customRuleContent!.customEvent" />
            </BehaviorGroup>
            <BehaviorGroup @add="sequenceAdd" title="行为序列满足">
              <CustomBehaviorSequence
                :custom="sizeForm.customRuleContent!.eventSequence"
              />
            </BehaviorGroup>
          </LogicalLine>
        </el-form-item>
      </BehaviorGroupPlus>

      <BehaviorGroupPlus
        title="触发事件分流"
        color="#333333"
        :class="{ animation: true, display: sizeForm.diversionType === 'event' }"
      >
        <div class="flex-column titleCondition">
          <div>进入该策略器的客户需要满足以下条件：在&nbsp;&nbsp;</div>
          <el-input v-model="sizeForm.num" type="number" style="width: 100px" />&nbsp;
          <el-select v-model="sizeForm.selectedType" style="width: 100px">
            <el-option value="month" label="月份">分钟</el-option>
            <el-option value="week" label="周">小时</el-option>
            <el-option value="day" label="天">天</el-option> </el-select
          >&nbsp;
          <div>
            后判断客户
            <el-select v-model="sizeForm.do" style="width: 100px">
              <el-option :value="true" label="做过">做过</el-option>
              <el-option :value="false" label="没做过">没做过</el-option>
            </el-select>
          </div>
        </div>
        <el-form-item label="">
          <!-- <LogicalLine v-model="sizeForm.eventRuleContent.logicalChar"> -->
          <EventBehavior :custom="sizeForm.eventRuleContent!.customEvent" />
          <!-- </LogicalLine> -->
        </el-form-item>
      </BehaviorGroupPlus>

      <CommonAttr ref="touchSettingsRef" :sizeForm="sizeForm" />

      <TouchEstimation :readonly="readonly" :custom-rule-content="customRuleContent" />
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
