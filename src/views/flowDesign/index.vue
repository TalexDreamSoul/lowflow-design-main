<script setup lang="ts" name="flowDesign">
import NodeTree from "./nodes/index.vue";
import NodePenal from "./penal/index.vue";
import { FlowNode } from "./nodes/Node/index";
import useNode from "./hooks/useNode";
import { reactive, computed, onUnmounted, provide, ref } from "vue";
import { Plus, Minus, Download, Sunny, Moon } from "@element-plus/icons-vue";
import { useVModels } from "@vueuse/core";
import { Field } from "~/components/Render/interface";
import { downloadXml } from "~/api/modules/model";

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

const rotateStyle = computed(() => {
  return putdown.value ? "rotate(-90deg)" : "rotate(90deg)";
});

const toggleRotation = () => {
  putdown.value = !putdown.value;
};

const openPenal = (node: FlowNode) => {
  nodePenalRef.value?.open(node);
};
const { addNode, delNode, validateNodes, addNodeRef } = useNode(
  process,
  fields
);
provide("nodeHooks", {
  readOnly: false,
  fields: fields,
  addNode,
  delNode,
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
  downloadXml(processModel);
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
        <div style="display: flex; align-items: center;">
          <div style="width:150px">策略流程名称</div>
          <el-input label="策略流程名称" v-model="formInline.strategyName" placeholder="策略流程名称" size="large" :style="{width: '100%'}" suffix-icon="search" clearable />
        </div>
        <div style="padding: 8px 30px 8px 20px">
          <!-- <el-button :icon="Plus" @click="zoom += 10" :disabled="zoom >= 170" circle></el-button>
          <span>{{ zoom }}%</span>
          <el-button :icon="Minus" @click="zoom -= 10" circle :disabled="zoom <= 50"></el-button>
          -->
          <el-button @click="validate">返回</el-button>
          <el-button @click="validate">保存草稿</el-button>
          <el-button @click="converterBpmn" type="primary">提交审核</el-button>

        </div>
      </div>

      <div v-show="putdown">
        <el-form-item label="Activity zone">
          <el-select v-model="formInline.region" placeholder="Activity zone" clearable>
            <el-option label="Zone one" value="shanghai" />
            <el-option label="Zone two" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="Activity time">
          <el-date-picker v-model="formInline.date" type="date" placeholder="Pick a date" clearable />
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary" @click="onSubmit">Query</el-button>
        </el-form-item> -->
      </div>
      <el-icon class="icondown" :size="24" :style="{ transform: rotateStyle }" @click="toggleRotation">
        <DArrowRight />
      </el-icon>

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
    padding: 8px 24px 8px 20px;
    position: fixed;
    z-index: 1;
    width: 100%;
    .flex-space {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      font-size: 16px;
      height: 50px;
    }
    span {
      margin: 0 10px;
    }
    .icondown {
      width: 100%;
      font-size: 24px;
      margin: 0 auto;
      text-align: center;
      color: #ccc;
      cursor: pointer;
      font-size: 24px;
      transform: rotate(90deg);
      height: 32px;
      width: 32px;
      position: absolute;
      left: 50%;
      bottom: 10px;
    }
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
  }
}
</style>
