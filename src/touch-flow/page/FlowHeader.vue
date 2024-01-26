<script setup lang="ts">
import BasicDisturb from "./BasicDisturb.vue";
import BasicTarget from "../page/BasicTarget.vue";
const props = defineProps<{
  basic: any;
}>();
</script>

<template>
  <div class="TouchFlow-Header">
    <div class="TouchFlow-Header-Start">
      <span>策略流程名称：</span>
      <el-input placeholder="策略流程名称" v-model="basic.flowName" :style="{ width: '400px', height: '40px' }" />
    </div>
    <div>
      <el-button round>返回</el-button>
      <el-button round>保存草稿</el-button>
      <el-button round type="primary" primaryStyle>提交审核</el-button>
    </div>
  </div>

  <div class="TouchFlow-Addon" v-show="basic._expand">
    <el-scrollbar>
      <BasicDisturb :disturb="basic.disturb" />
      <BasicTarget :target="basic.target" />
    </el-scrollbar>
  </div>
  <div @click="basic._expand = !basic._expand" :class="basic._expand ? 'baseSet baseSetpoz' : 'baseSet'">
    {{ basic._expand ? "收起" : "展开" }}基础设置
    <el-icon class="icondown" :style="{ transform: basic._expand ? 'rotate(-90deg)' : 'rotate(90deg)' }">
      <DArrowRight />
    </el-icon>
  </div>
</template>

<style lang="scss">
.Basic-Block {
  &-Head {
    > span {
      margin-right: 0.5rem;
      line-height: 30px;
      color: #666;
    }

    display: flex;
    align-content: center;

    user-select: none;
  }

  &-Content {
    position: relative;
    padding: 12px 0;
    line-height: 2.5rem;

    background-color: var(--el-fill-color);
    font-size: 14px;
    color: #333;
    &.disabled::before {
      // opacity: 0.35;
      pointer-events: unset;
    }

    &::before {
      z-index: 100;
      content: "";
      position: absolute;

      left: 0;
      top: 0;

      width: 100%;
      height: 100%;

      opacity: 0;
      pointer-events: none;
      transition: 0.25s;
      background-color: var(--el-fill-color-dark);
    }
  }
}

.baseSet {
  cursor: pointer;
  color: #4078e0;
  font-size: 14px;
  margin-left: 16px;
  margin-bottom: 6px;
  position: absolute;
  top: 22px;
  left: 530px;
  .icondown {
    width: 100%;
    transform: rotate(90deg);
    height: 32px;
    width: 32px;
  }
}
.baseSetpoz {
  position: absolute;
  left: 45% !important;
  bottom: 10px !important;
  margin-bottom: 0px !important;
  top: unset;
}

.TouchFlow-Addon {
  height: calc(100% - 60px);
}

.TouchFlow-Header {
  &-Start {
    span {
      line-height: 30px;
      color: #666;
    }

    display: flex;

    justify-content: space-between;
    align-items: center;

    // width: 50%;
  }

  position: relative;
  display: flex;

  justify-content: space-between;
  align-items: center;

  height: 80px;
}
</style>
