<script setup lang="ts">
import { reactive } from 'vue'
import FlowHeader from '../touch-flow/page/FlowHeader.vue'
import TouchFlow from './TouchFlow.vue'
const props = defineProps<{
  modelValue?: boolean,
}>()

const flowOptions = reactive({
  basic: {
    _expand: false,
    name: "",
    disturb: {
      enable: false,
      time: [],
      action: 0
    },
    target: {
      enable: false,
      list: []
    }
  },
  p: {
    type: 'start',
    child: []
  }
})

</script>

<template>
  <div class="FlowPage">
    <el-container :class="{ expand: flowOptions.basic._expand }" class="FlowPage-Container">
      <el-header>
        <FlowHeader :basic="flowOptions.basic" />
      </el-header>
      <el-main class="bg">
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
    height: 500px;
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

    overflow: hidden;
    transition: height .25s;
    background-color: var(--el-fill-color-lighter);
    box-shadow: 0 4px 4px 8px rgba(0, 0, 0, 0.02), 0 2px 4px rgba(0, 0, 0, 0.125);
  }

  .el-main {
    position: relative;
    display: flex;

    flex: 1;
    flex-direction: column;
    align-items: center;

    background-color: var(--el-fill-color);
  }

  position: absolute;
  display: flex;

  width: 100%;
  height: 100%;

  overflow: hidden;
}

.bg {
  background-image: linear-gradient(90deg, rgba(60, 10, 30, 0.04) 1px, transparent 0),
    linear-gradient(1turn, rgba(60, 10, 30, 0.04) 1px, transparent 0);
  background-size: calc((100% - 10px) / 30) 50px;
  background-position: 5px 5px;
}
</style>