<script setup lang="ts" name="FlowPage">
import { reactive } from "vue";
import FlowHeader from "../touch-flow/page/FlowHeader.vue";
import TouchFlow from "./TouchFlow.vue";
import { randomStr } from "~/utils/common";

defineProps<{
  modelValue?: boolean;
}>();

const flowOptions = reactive({
  basic: {
    _expand: false,
    name: "",
    disturb: {
      enable: false,
      time: [],
      action: 0,
    },
    target: {
      enable: false,
      list: [],
    },
  },
  p: {
    id: randomStr(12),
    type: "start",
    children: [],
  },
});

console.log("total flow", flowOptions);
</script>

<template>
  <div class="FlowPage">
    <el-container :class="{ expand: flowOptions.basic._expand }" class="FlowPage-Container">
      <el-header>
        <FlowHeader :basic="flowOptions.basic" />
      </el-header>
      <el-main>
        <el-scrollbar>
          <TouchFlow :p="flowOptions.p" />
        </el-scrollbar>
      </el-main>
    </el-container>
  </div>
</template>

<style lang="scss">
div.el-dialog {
  border-radius: 8px;
}

.FlowPage-Container.expand {
  .el-header {
    height: auto;
  }
}

.el-scrollbar {
  width: 100%;
}

.FlowPage {
  .el-header {
    z-index: 100;
    position: sticky;

    height: 80px;
    max-height: 500px;
    overflow: hidden;
    transition: height 0.25s;
    background-color: var(--el-fill-color-lighter);
    box-shadow: 0 4px 4px 8px rgba(0, 0, 0, 0.02),
      0 2px 4px rgba(0, 0, 0, 0.125);
  }

  .el-main {
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to bottom, #eeeff6, #3880e41c);
      z-index: -1;
    }

    position: relative;
    display: flex;

    flex: 1;
    flex-direction: column;
    align-items: center;

    background-image: linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
    background-size: 30px 30px;
  }

  position: absolute;
  display: flex;

  width: 100%;
  height: 100%;

  overflow: hidden;
}
</style>
