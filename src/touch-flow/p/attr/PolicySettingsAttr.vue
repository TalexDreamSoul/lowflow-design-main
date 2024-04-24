<script setup lang="ts">
import { inject, ref, reactive, watchEffect, watch, toRaw } from "vue";
import { ElMessage } from "element-plus";
import { randomStr } from "~/utils/common";
import FilterGroup from "./condition/FilterGroup.vue";
import BehaviorGroupPlus from "../behavior/BehaviorGroupPlus.vue";
import { markRaw, computed } from "vue";
import CommonAttr from "./CommonAttr.vue";
import { validateAES, validateCommonDays } from "~/touch-flow/flow-utils";
import { MarketingTouchNodeEditDTO } from "~/touch-flow/touch-total";
import StrategistTargetAttr from "~/touch-flow/page/StrategistTargetAttr.vue";

const origin: MarketingTouchNodeEditDTO = {
  nodeId: "",
  nodeType: "strategy",
  nodeName: "",
  preNodeId: "",
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
const $getNodeName: any = window['$getNodeName']

const touchSettingsRef = ref();
const _edit = computed(() => {
  const splits = location.pathname.split('/')

  // 取最后两个
  const [, design, id] = splits

  if (design !== 'design' || !id) return false

  // console.log("11212121212121212", splits, design, id)

  return true
})

const sizeForm = reactive<typeof origin>(JSON.parse(JSON.stringify(origin)));

watch(
  () => sizeForm.diversionType,
  (val) => {
    sizeForm.eventDelayed!.isDelayed = val === "event";
  }
);

watch(props.p, () => {
  const { nodeId, nodeType, children, preNodeId } = props.p;

  if (nodeId && nodeType === 'strategy') {

    if (props.new) {
      sizeForm.$index = children?.length || 0

      if (sizeForm.$index) {
        sizeForm.diversionType = children[0].diversionType
        sizeForm.eventDelayed!.delayedTime = children[0].eventDelayed.delayedTime
        sizeForm.eventDelayed!.delayedUnit = children[0].eventDelayed.delayedUnit
      }

    } else {
      const fatherNode = window.$getNodeById(preNodeId)
      if (!fatherNode) return

      sizeForm.$index = _edit.value ? fatherNode.children.length : [...fatherNode.children].findIndex(item => item.nodeId === nodeId)  //fatherNode.children.length
      //[...fatherNode.children].indexOf(props.p)
    }

    return;
  }

  if (!children?.length || children[0].nodeType !== 'strategy') return

  sizeForm.$index = children.length

  sizeForm.diversionType = children[0].diversionType
  sizeForm.eventDelayed!.delayedTime = children[0].eventDelayed.delayedTime
  sizeForm.eventDelayed!.delayedUnit = children[0].eventDelayed.delayedUnit
}, { immediate: true })

watchEffect(() => {
  const { nodeType, nodeId } = props.p;

  console.log("w", props, JSON.parse(JSON.stringify(toRaw(props.p))), sizeForm)

  if (props.new || nodeType !== "strategy") return;

  if (nodeId) {
    Object.assign(sizeForm, JSON.parse(JSON.stringify(toRaw(props.p))));

    sizeForm.nodeId = nodeId;

    // if (props.p.touchTemplateContent)
    //   sizeForm.touchTemplateContent = props.p.touchTemplateContent;

  }
});

function saveData() {
  if (!sizeForm.nodeName) {
    ElMessage.warning({
      message: "请输入策略名称",
    });

    return false;
  }

  const _gotNode = $getNodeName(sizeForm.nodeName)
  if (_gotNode && _gotNode?.nodeId !== sizeForm.nodeId) {
    ElMessage.warning({
      message: "节点名称重复",
    });

    return false;
  }

  if (!validateAES(sizeForm.customRuleContent!)) {
    ElMessage.warning({
      message: "客户属性，客户行为，行为序列满足中不能有选项为空！",
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
      message: "延时设置折算时间不可超过30天！",
    });

    return false;
  }

  if (sizeForm?.targetRuleContent?.targetDelayed?.delayedTime && !validateCommonDays(sizeForm?.targetRuleContent?.targetDelayed?.delayedTime, sizeForm?.targetRuleContent?.targetDelayed?.delayedUnit)) {
    ElMessage.warning({
      message: "目标设置中延时设置折算时间不可超过30天！",
    });

    return false;
  }

  if (!touchSettingsRef.value.updateData()) return false

  const { touchTemplateContent }: any = sizeForm

  if (String(sizeForm.nodeDelayed.delayedAction).toLocaleLowerCase().indexOf('touch') !== -1 && !touchTemplateContent?.type?.length) {
    ElMessage.warning({
      message: "请选择模板！",
    })

    return false;
  }

  const _: any = { nodeId: "", children: [] };
  Object.assign(_, sizeForm);

  console.log("ppp", _);

  // Object.defineProperty(_, "father", {
  //   value: markRaw(props.p),
  //   enumerable: false,
  // });

  // 修改 Modify Edit
  if (sizeForm.nodeId === _.nodeId && sizeForm.nodeId!.length) {
    Object.assign(props.p, _);
  } else {

    _.nodeId = randomStr(12);

    _.preNodeId = props.p.nodeId

    if (props.p.children) {
      props.p.children.push(_);
    } else props.p.children = [_]

  }

  return true;
}

type IRegSaveFunc = (regFunc: () => boolean) => void;
const regSaveFunc: IRegSaveFunc = inject("save")!;
regSaveFunc(saveData);
const handleUnitChange = (newVal: string) => {
  let maxValue = 0;
  // 根据选择的单位更新最大值和输入框的最大限制
  if (newVal === "day") {
    maxValue = 30;
  } else if (newVal === "hour") {
    maxValue = 720;
  } else if (newVal === "minute") {
    maxValue = 43200;
  }
  // 如果当前输入值超过最大值，则将输入值设为最大值
  if (sizeForm.eventDelayed!.delayedTime > maxValue) {
   sizeForm.eventDelayed!.delayedTime = maxValue;
  }
};
</script>

<template>
  <div>
    <el-form ref="form" :model="sizeForm" label-width="auto" label-position="left">
      <el-form-item label="选择策略器名称：">
        <el-input show-word-limit :disabled="readonly" v-model="sizeForm.nodeName" placeholder="填写名称" maxlength="50" />
      </el-form-item>
      <el-form-item label="分流类型：">
        <!-- (_edit && sizeForm.nodeId) || -->
        <el-radio-group :disabled="(_edit && sizeForm.$index && !props.new) || readonly || sizeForm.$index"
          v-model="sizeForm.diversionType">
          <el-radio label="noDiversion">不分流</el-radio>
          <el-radio label="attr">按属性用户行为分流</el-radio>
          <el-radio label="event">按触发事件分流</el-radio>
        </el-radio-group>
      </el-form-item>
      <span style="display: block;text-indent: 8rem;font-size: 12px;opacity: .75">
        <span v-if="sizeForm.$index">
          不支持切换，同一父级策略器下只有一个非其他型策略器时可以切换
        </span>
        <span v-else>
          请仔细确认首个策略器的类型，同一父级策略器下只能添加同类型的策略器或其他策略器
        </span>
      </span>

      <BehaviorGroupPlus title="用户属性行为分流" color="#333333" :default-expand="true"
        :class="{ animation: true, display: sizeForm.diversionType === 'attr' }">
        <div class="titleCondition">进入该策略期的用户需要满足以下条件：</div>
        <FilterGroup :readonly="readonly" :custom-rule-content="sizeForm.customRuleContent!" />
      </BehaviorGroupPlus>

      <BehaviorGroupPlus title="触发事件分流" color="#333333" :default-expand="true"
        :class="{ animation: true, display: sizeForm.diversionType === 'event' }">
        <div class="flex-column titleCondition">
          <el-text>进入该策略器的客户需要满足以下条件：在&nbsp;&nbsp;</el-text>
          <el-input-number :disabled="readonly || sizeForm.$index > 1" :min="1"
            :max="sizeForm.eventDelayed!.delayedUnit=='day'?30:(sizeForm.eventDelayed!.delayedUnit=='hour'?720:43200)"
            v-model="sizeForm.eventDelayed!.delayedTime" controls-position="right" type="number"
            style="width: 100px" />&nbsp;
          <el-select :disabled="readonly || sizeForm.$index > 1" v-model="sizeForm.eventDelayed!.delayedUnit"
            @change="handleUnitChange" style="width: 100px">
            <el-option value="minute" label="分钟">分钟</el-option>
            <el-option value="hour" label="小时">小时</el-option>
            <el-option value="day" label="天">天</el-option> </el-select>&nbsp;
          <el-text>
            后判断客户
            <el-select :disabled="readonly" v-model="sizeForm.eventDelayed!.delayedAction" style="width: 100px">
              <el-option value="=" label="做过">做过</el-option>
              <el-option value="!=" label="没做过">没做过</el-option>
            </el-select>
          </el-text>
        </div>

        <FilterGroup :readonly="readonly" :custom-rule-content="sizeForm.eventRuleContent!"
          :configuration="{ ignore: { attrs: true, sequence: true }, subIgnore: { event: { time: true, action: true } } }" />
      </BehaviorGroupPlus>

      <CommonAttr :readonly="readonly" ref="touchSettingsRef" :sizeForm="sizeForm" />

      <!-- <TouchEstimation :readonly="readonly" :custom-rule-content="sizeForm.customRuleContent" /> -->

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

   // margin-bottom: 0;
  }

  opacity: 0;
  pointer-events: none;

  height: 36px;

  margin-bottom: -50px;
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
  //margin-bottom: 0;
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
