<script setup lang="ts" name="flowDesign">
import NodeTree from "../../views/flowDesign/nodes/index.vue";
import NodePenal from "../../views/flowDesign/penal/index.vue";
import { FlowNode } from "../../views/flowDesign/nodes/Node/index";
import useNode from "../../views/flowDesign/hooks/useNode";
import { reactive, computed, onUnmounted, provide, ref, inject } from "vue";
import { Plus, Minus, Download, Sunny, Moon } from "@element-plus/icons-vue";
import { useVModels } from "@vueuse/core";
import { Field } from "~/components/Render/interface";

import SingleGroup from "~/components/singleGroup/index.vue";

export interface FlowDesignProps {
  process: FlowNode;
  fields: Field[];
}

const $props = defineProps<FlowDesignProps>();
const $emits = defineEmits(["update:process", "update:fields"]);
const { process, fields } = useVModels($props, $emits);

const formInline = reactive({
  strategyName: "",
  region: "",
  date: "",
});
const nodePenalRef = ref<InstanceType<typeof NodePenal>>();
const zoom = ref(100);
const getScale = computed(() => zoom.value / 100);
const putdown = ref<boolean>(false);
const disturbsettings = ref<boolean>(false);
const conditions = ref<object>({
  logicalOperator: "and",
  conditions: [],
  groups: [],
});
const value = ref("");
const disturbsettingsValue = ref(1);
const defaultTime = ref<[Date, Date]>([
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59),
]);

const rotateStyle = computed(() => {
  return putdown.value ? "rotate(-90deg)" : "rotate(90deg)";
});

const toggleRotation = () => {
  putdown.value = !putdown.value;
};

const openPenal = (node: FlowNode) => {
  nodePenalRef.value?.open(node);
};
const { validateNodes, addNodeRef } = useNode(process, fields);

provide("nodeHooks", {
  readOnly: false,
  fields: fields,
  addNodeRef,
  openPenal,
});

const handleZoom = (e: WheelEvent) => {
  if (e.shiftKey) {
    if (e.deltaY > 0) {
      if (zoom.value > 50) {
        zoom.value -= 10;
      }
    } else {
      if (zoom.value < 170) {
        zoom.value += 10;
      }
    }
  }
};
const validate = () => {
  validateNodes();
};
const converterBpmn = () => {
  const processModel = {
    code: "test",
    name: "测试",
    icon: {
      name: "el:HomeFilled",
      color: "#409EFF",
    },
    process: process.value,
    form: {
      fields: fields.value,
    },
    version: 1,
    sort: 0,
    groupId: "",
    remark: "",
  };
};
// 按住shift键滚动鼠标滚轮，可以放大/缩小
window.addEventListener("wheel", handleZoom);
// 离开页面时，销毁事件监听
onUnmounted(() => {
  window.removeEventListener("wheel", handleZoom);
});
</script>

<template>
  <div class="designer-container">
    <!--放大/缩小-->
    <div class="zoom">
      <div class="flex-space">
        <el-form-item label="策略流程名称：">
          <el-input label="策略流程名称" v-model="formInline.strategyName" placeholder="策略流程名称" size="large" :style="{width: '400px',height:'40px'}" clearable />
        </el-form-item>
        <div :class="putdown?'baseSet baseSetpoz':'baseSet'" @click="toggleRotation">
          展开基础设置
          <el-icon class="icondown" :style="{ transform: rotateStyle }">
            <DArrowRight />
          </el-icon>
        </div>
        <div class="rommButtonGroup">
          <el-button @click="validate" round>返回</el-button>
          <el-button @click="validate" round>保存草稿</el-button>
          <el-button @click="converterBpmn" type="primary" round class="primarystyle">提交审核</el-button>

        </div>
      </div>

      <div v-show="putdown">
        <el-form-item label="勿扰设置">
          <el-switch v-model="disturbsettings" inline-prompt style="--el-switch-on-color: #4078E0;" />

        </el-form-item>
        <div class="garyblock">
          <el-date-picker v-model="value" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="defaultTime" />
          <el-text>为客户勿扰时间段，勿扰时间内触达则</el-text>
          <el-select v-model="disturbsettingsValue" style="width: 240px;">
            <el-option label="放弃本次触达且退出流程" :value="1"></el-option>
            <el-option label="待勿扰时段结束立即触达" :value="2"></el-option>
            <el-option label="放弃本次触达且不退出流程" :value="3"></el-option>
          </el-select>
        </div>
        <el-form-item label="目标设置">
          <el-switch v-model="disturbsettings" inline-prompt style="--el-switch-on-color: #4078E0;" />
          <el-text type="primary" style="cursor: pointer;">
            <el-icon size="14">
              <CirclePlusFilled />
            </el-icon>
            筛选目标
          </el-text>
        </el-form-item>

        <div class="garyGroup">
          <SingleGroup v-model="conditions" :filter-fields="fields" />
        </div>

        <div class="garyblock">
          <el-date-picker v-model="value" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="defaultTime" />
          <el-text>为客户勿扰时间段，勿扰时间内触达则</el-text>
          <el-select v-model="disturbsettingsValue" style="width: 240px;">
            <el-option label="放弃本次触达且退出流程" :value="1"></el-option>
            <el-option label="待勿扰时段结束立即触达" :value="2"></el-option>
            <el-option label="放弃本次触达且不退出流程" :value="3"></el-option>
          </el-select>
        </div>
      </div>

    </div>

    <!--流程树-->
    <div class="node-container">
      <NodeTree :node="process" />
    </div>
    <!--属性面板-->
    <NodePenal ref="nodePenalRef" />

    <div class="zoombottom">
      <el-button :icon="Plus" @click="zoom += 10" :disabled="zoom >= 170" circle></el-button>
      <span>{{ zoom }}%</span>
      <el-button :icon="Minus" @click="zoom -= 10" circle :disabled="zoom <= 50"></el-button>
      <el-button @click="validate">校验</el-button>
      <el-button @click="converterBpmn" type="primary" :icon="Download">转bpmn</el-button>
    </div>
  </div>

</template>

<style scoped lang="scss">
.designer-container {
  background: #f7f9fa !important;
  position: relative;
  display: flex;
  flex-direction: row;
  min-height: 100vh;
  min-width: 100%;
  // overflow: scroll;

  .zoom {
    background: #fff;
    box-shadow: 0 2px 11px rgba(175, 186, 200, 0.45);
    padding: 24px;
    position: fixed;
    z-index: 1;
    left: 0;
    right: 0;
    .flex-space {
      display: flex;
      width: 100%;
      font-size: 16px;
      height: 50px;
      align-items: center;
    }
    span {
      margin: 0 10px;
    }
    .baseSetpoz {
      position: absolute;
      left: 45%;
      bottom: 0px;
      margin-bottom: 0px !important;
    }
    .rommButtonGroup {
      position: absolute;
      right: 24px;
      top: 24px;
    }
    .baseSet {
      cursor: pointer;
      color: #4078e0;
      font-size: 14px;
      margin-left: 16px;
      margin-bottom: 22px;
      .icondown {
        width: 100%;
        transform: rotate(90deg);
        height: 32px;
        width: 32px;
      }
    }
  }
  .primarystyle {
    background: linear-gradient(to top, #598ff1, #205ccb);
  }
  .zoombottom {
    padding: 8px 30px 8px 20px;
    position: fixed;
    bottom: 0;
    width: 100%;
    width: 300px;
    right: 5px;
  }
  .dark {
    position: fixed;
    z-index: 999;
    top: 10px;
    left: 20px;
  }

  .node-container {
    margin: 0 auto;
    transform: scale(v-bind(getScale));
    transform-origin: 50% 0 0;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding-top: 100px;
    height: 100vh;
    width: 100vw;
    background-image: linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
    background-size: 30px 30px;
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to bottom, #eeeff6, #3880e41c);
      z-index: -1; /* 将伪元素置于底层 */
    }
  }
  .garyblock {
    background: #f2f4f8;
    border-radius: 4px 4px 4px 4px;
    opacity: 0.6;
    padding: 24px;
  }
  .garyGroup {
    background: #f2f4f8;
    border-radius: 4px 4px 4px 4px;
    opacity: 0.6;
  }
}
</style>
