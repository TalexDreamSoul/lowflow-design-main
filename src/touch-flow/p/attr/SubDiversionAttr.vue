<script setup lang="ts">
import { ElMessage } from "element-plus";
import { inject, reactive, ref, toRaw, watchEffect } from "vue";
import CommonAttr from "../attr/CommonAttr.vue";
import StrategistTargetAttr from "~/touch-flow/page/StrategistTargetAttr.vue";
import TouchEstimation from "~/touch-flow/page/TouchEstimation.vue";
import { validateCommonDays } from "~/touch-flow/flow-utils";
import { MarketingTouchNodeEditDTO } from "~/touch-flow/touch-total";

const origin: MarketingTouchNodeEditDTO = {
  nodeId: "",
  nodeType: "subDiversion",
  nodeName: "默认分支",
  target: false,
  touchTemplateContent: {},
  touchType: "nothing",
  nodeDelayed: {
    delayedAction: "nothing",
    delayedTime: 0,
    delayedUnit: "day",
    isDelayed: false,
  },
  labelContent: {
    labelId: -1,
    labelName: "",
    labelValue: [],
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
};

const props = defineProps<{
  p: any;
  new?: boolean;
  readonly?: boolean;
}>();
const $getNodeName: any = window['$getNodeName']

const touchSettingsRef = ref();
const sizeForm = reactive<typeof origin>(JSON.parse(JSON.stringify(origin)));

console.log("分流器", sizeForm, props.p);

watchEffect(() => {
  const { nodeType, nodeId } = props.p;

  console.log("sa", props)

  if (props.new || nodeType !== "subDiversion") return;

  if (nodeId) {
    Object.assign(sizeForm, JSON.parse(JSON.stringify(toRaw(props.p))));
    // Object.assign(sizeForm, props.p);

    sizeForm.nodeId = nodeId;

    if (props.p.touchTemplateContent)
      sizeForm.touchTemplateContent = props.p.touchTemplateContent;
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

  // if (
  //   !validateCommonDays(
  //     sizeForm.nodeDelayed.delayedTime,
  //     sizeForm.nodeDelayed.delayedUnit
  //   )
  // ) {
  //   ElMessage.warning({
  //     message: "延时设置折算时间不可超过30天！",
  //   });

  //   return false;
  // }

  // if (sizeForm?.targetRuleContent?.targetDelayed?.delayedTime && !validateCommonDays(sizeForm?.targetRuleContent?.targetDelayed?.delayedTime, sizeForm?.targetRuleContent?.targetDelayed?.delayedUnit)) {
  //   ElMessage.warning({
  //     message: "目标设置中延时设置折算时间不可超过30天！",
  //   });

  //   return false;
  // }

  if (!touchSettingsRef.value.updateData()) return false

  console.log("> update", sizeForm, props);

  const _: any = { nodeId: "", nodeContent: {}, children: [] };
  Object.assign(_, sizeForm);

  Object.assign(props.p, _);

  return true;
}

type IRegSaveFunc = (regFunc: () => boolean) => void;
const regSaveFunc: IRegSaveFunc = inject("save")!;
regSaveFunc(saveData);
</script>

<template>
  <div>
    <el-form ref="form" :model="sizeForm" label-width="auto" label-position="left">
      <el-form-item label="流量策略器名称：">
        <el-input show-word-limit v-model="sizeForm.nodeName" placeholder="填写名称" maxlength="50" />
      </el-form-item>

      <CommonAttr  :readonly="readonly" ref="touchSettingsRef" :size-form="sizeForm" />

      <!-- <TouchEstimation :readonly="readonly" :custom-rule-content="sizeForm.customRuleContent" /> -->

      <StrategistTargetAttr :readonly="readonly" :size-form="sizeForm" />
    </el-form>
  </div>
</template>

<style lang="scss">


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

.underright {
  width: 100%;
  height: 12px;
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

.pannel {
  width: 100%;
  min-height: 200px;
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
 // margin-bottom: 0;
}

.el-collapse {
  border: none !important;
}

.custom-collapse-item .el-collapse-item__header {
  border-bottom: none !important;
  background-color: #f5f8fc !important;
}

.filter-container {
  border-radius: 3px;
  display: flex;

  .logical-operator {
    position: relative;
    display: flex;
    align-items: center;
    overflow: hidden;
    min-width: 35px;

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

.yugu_flex {
  display: flex;
  align-items: center;
  min-height: 48px;
  margin-bottom: 8px;

  .title {
    margin-left: 8px;
    font-size: 14px;
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
  margin-bottom: 12px;
}

.grayblock {
  //width: 120px;
  background: #ffffff;
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
  background: #ffffff;
  border-radius: 4px 4px 4px 4px;
  padding: 20px;

  .topName {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.6);
    margin-bottom: 8px;
  }
}

.inputValue {
  background: #fff;
  height: 150px;
  width: 480px;
  border: 1px solid #dbdbdb;
  border-radius: 4px;
  padding: 12px;
  color: #333;
}
</style>
