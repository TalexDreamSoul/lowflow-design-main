<script setup lang="ts">
import BasicDisturb from './BasicDisturb.vue'
import BasicTarget from '../page/BasicTarget.vue'
const props = defineProps<{
  basic: any
}>()

</script>

<template>
  <div class="TouchFlow-Header">
    <div class="TouchFlow-Header-Start">
      <span>策略流程名称：</span>
      <el-input style="width: 60%" placeholder="策略流程名称" v-model="basic.flowName" />
      &nbsp;
      <el-button @click="basic._expand = !basic._expand" type="primary" plain text>
        {{ basic._expand ? '收起' : '展开' }}基础设置
      </el-button>
    </div>
    <div>
      <el-button round>返回</el-button>
      <el-button round>保存草稿</el-button>
      <el-button round type="primary">提交审核</el-button>
    </div>
  </div>

  <div class="TouchFlow-Addon">
    <BasicDisturb :disturb="basic.disturb" />
    <BasicTarget :target="basic.target" />
  </div>
</template>

<style lang="scss">
.Basic-Block {
  // margin: 10px 0;
  // padding: 10px;
  // border: 1px solid #eee;
  // border-radius: 4px;
  // background-color: #fff;
  // box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  // transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  // cursor: pointer;

  &-Head {
    span {
      margin-right: .5rem;
      line-height: 30px;
    }

    display: flex;
    // padding: 0 .5rem;

    // justify-content: space-between;
    align-content: center;

    // font-weight: 600;
    user-select: none;
  }

  &-Content {
    position: relative;
    padding: 1.5rem;

    line-height: 2.5rem;

    background-color: var(--el-fill-color);

    &.disabled::before {
      opacity: .75;
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
      transition: .25s;
      background-color: var(--el-fill-color-dark);
    }
  }
}

.TouchFlow-Header {
  &-Start {
    span {
      line-height: 30px;
    }

    display: flex;

    justify-content: space-between;
    align-items: center;

    width: 50%;
  }

  position: relative;
  display: flex;

  justify-content: space-between;
  align-items: center;

  height: 80px;
}
</style>