<script setup lang="ts">
import { Stamp, Promotion, Share, Plus } from "@element-plus/icons-vue";
import { defineProps } from "vue";
import { type Component, computed, inject, nextTick, ref } from "vue";

const centerDialogVisible = ref(false);
const props = defineProps(["insuranceStrategist"]);
const $emits = defineEmits<{
  (e: "addNode", type: string): void;
}>();

const addApprovalNode1 = () => {
  $emits("addNode", "approval");
};
const addCcNode = () => {
  $emits("addNode", "cc");
};
const addExclusiveNode = () => {
  $emits("addNode", "exclusive");
};

const addApprovalNode = (type: any) => {
  // Traffic Strategist Settings流量策略器设置
  $emits("open-Penal", type);
  centerDialogVisible.value = false;
};
</script>

<template>
  <div class="add-but">
    <el-dialog v-model="centerDialogVisible" title="请选择添加类型" width="30%" align-center :show-close="false" :style="{ 'border-radius': '10px' }">
      <div class="node-select">
        <div @click="addApprovalNode('policySettings')" class="node-select-block">
          <el-icon color="#ff943e">
            <Stamp />
          </el-icon>
          <div class="innerdiv">
            <el-text tag="b">选择策略器</el-text><br />
            <el-text class="mx-1" size="small">按客户属性行为或触发事件对客户筛选分流，并执行动作。</el-text>
          </div>
        </div>

        <!-- <div @click="addApprovalNode1" class="node-select-block">
          <el-icon>
            <Share />
          </el-icon>
          <div class="innerdiv">
            <el-text tag="b">addApprovalNode</el-text><br />
            <el-text class="mx-1" size="small">按设置的比例自动对客户随机分流，并执行动作</el-text>
          </div>
        </div> -->
        <div @click="addApprovalNode('diverter')" v-if="!insuranceStrategist" class="node-select-block">
          <el-icon>
            <Share />
          </el-icon>
          <div class="innerdiv">
            <el-text tag="b">分流器</el-text><br />
            <el-text class="mx-1" size="small">按设置的比例自动对客户随机分流，并执行动作</el-text>
          </div>
        </div>
        <div @click="addCcNode" v-if="insuranceStrategist" class="node-select-block">
          <el-icon color="#3296fa">
            <Promotion />
          </el-icon>
          <div class="innerdiv">
            <el-text tag="b">兜底策略器</el-text><br />
            <el-text class="mx-1" size="small">筛选未进入本节点下其他选择策略器的客户，并执行动作。</el-text>
          </div>

        </div>
      </div>
    </el-dialog>
    <el-button :icon="Plus" type="primary" style="z-index: 1" @click="centerDialogVisible = true" circle></el-button>

  </div>
</template>

<style scoped lang="scss">
.node-select {
  display: flex;
  justify-content: space-between;
  p {
    font-size: 16px;
    font-weight: 700;
    margin-top: 2px;
    margin-bottom: 5px;
  }

  .node-select-block {
    display: inline-block;
    cursor: pointer;
    padding: 10px 15px;
    border: var(--el-border);
    border-radius: 10px;
    width: 200px;
    position: relative;
    height: 80px;

    .innerdiv {
      position: absolute;
      left: 60px;
      top: 12px;
    }

    &:hover {
      background-color: var(--el-color-primary-light-9);
      box-shadow: var(--el-box-shadow-light);
      color: var(--el-color-primary);
    }

    i {
      font-size: 25px;
      padding: 5px;
      border: var(--el-border);
      border-radius: 50%;
    }
  }
}

.add-but {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 20px 0 32px;
  position: relative;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 1px;
    height: 100%;
    // background-color: var(--el-border-color);
  }
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
