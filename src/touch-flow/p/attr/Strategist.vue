<script setup lang="ts">
import { inject, ref, reactive, watchEffect } from "vue";
import { ElMessage } from "element-plus";
import { randomStr } from "~/utils/common";
import CommonAttr from "./CommonAttr.vue";
import { markRaw } from "vue";
import StrategistTargetAttr from "~/touch-flow/page/StrategistTargetAttr.vue";

const origin = {
  nodeId: "",
  nodeType: "strategy",
  nodeName: "",
  diversionType: "safeguard",
  touchTemplateContent: {},
  nodeDelayed: {
    delayedAction: "nothing",
    delayedTime: 0,
    delayedUnit: "",
    isDelayed: false,
  },
  labelContent: {
    labelId: -1,
    labelName: "",
    labelValue: [],
  },
};

const props = defineProps<{
  p: any;
  new?: boolean;
  readonly?: boolean;
}>();

const touchSettingsRef = ref();
const sizeForm = reactive<typeof origin>(origin);
const $getNodeName: any = window['$getNodeName']

function reset() {
  Object.assign(sizeForm, origin);
  console.log(sizeForm, origin, props.p);
}
reset();

watchEffect(() => {
  const { nodeType, nodeId } = props.p;

  if (props.new || nodeType !== "strategy") return;

  sizeForm.nodeId = nodeId;

  if (props.p.touchTemplateContent)
    sizeForm.touchTemplateContent = props.p.touchTemplateContent;

  console.log("aqwqsdadas", props.p, sizeForm)
});

function saveData() {
  if (!sizeForm.nodeName) {
    ElMessage.warning({
      message: "请输入策略名称",
    });

    return false;
  }

  if ($getNodeName(sizeForm.nodeName)) {
    ElMessage.warning({
      message: "节点名称重复",
    });

    return false;
  }

  touchSettingsRef.value.updateData();

  const _: any = { nodeId: "", children: [], reveal: true };
  Object.assign(_, sizeForm);

  Object.defineProperty(_, "father", {
    value: markRaw(props.p),
    enumerable: false,
  });

  // 修改 Modify Edit
  if (sizeForm.nodeId === _.nodeId && sizeForm.nodeId.length) {
    Object.assign(props.p, _);
  } else {
    _.nodeId = randomStr(12);

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
        <el-input :disabled="readonly" v-model="sizeForm.nodeName" placeholder="填写名称" />
      </el-form-item>
      <CommonAttr :readonly="readonly" ref="touchSettingsRef" :size-form="sizeForm" />

      <!-- <TouchEstimation :readonly="readonly" :custom-rule-content="customRuleContent" /> -->

      <StrategistTargetAttr :readonly="readonly" :size-form="sizeForm" />
    </el-form>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-form-item) {
  margin-right: 0;
  margin-bottom: 0;
}
</style>
