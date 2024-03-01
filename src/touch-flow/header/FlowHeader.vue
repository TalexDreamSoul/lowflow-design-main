<script setup lang="ts">
import BasicDisturb from "./BasicDisturb.vue";
import BasicTarget from "./BasicTarget.vue";
import { IFlowHeader } from "../flow-types";
import HeaderToggleButton from "./HeaderToggleButton.vue";
import HeaderTitle from "./HeaderTitle.vue";
import { ref, reactive } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { commonValidate } from "../flow-utils";

interface IHeaderProp {
  basic: IFlowHeader;
  /**
   * 当需要展示数据时，启用此属性让所有选项强制启用（避免下面有展示但是开关显示没有打开）
   */
  expandAll?: boolean;
  readonly?: boolean;
}

defineProps<IHeaderProp>();

const headerRef = ref<FormInstance>();

const rules = reactive<FormRules<IFlowHeader>>({
  touchName: [{ validator: commonValidate, message: "请输入触达名称", trigger: "blur" }],
});

defineExpose({
  validateHeaderForm: () => {},
});
</script>

<template>
  <div v-if="!expandAll" class="TouchFlow-Header">
    <div class="TouchFlow-Header-Start">
      <HeaderTitle
        v-model="basic.touchName"
        :expand="basic._expand"
        :readonly="readonly"
      />
    </div>
    <slot name="controller" />
  </div>

  <div :class="{ expandAll }" class="TouchFlow-Addon">
    <el-divider />
    <el-scrollbar>
      <el-form
        ref="headerRef"
        :rules="rules"
        status-icon
        :model="basic"
        label-position="top"
      >
        <el-form-item
          style="--t-delay: 0.1s"
          prop="touchName"
          class="transition-item"
          :class="{ expand: basic._expand || expandAll }"
          label="策略流程名称"
        >
          <el-input
            :show-word-limit="true"
            v-model="basic.touchName"
            maxlength="18"
            :disabled="readonly"
            placeholder="策略流程名称"
            :style="{ width: '400px', height: '40px' }"
          />
        </el-form-item>
        <br />
        <BasicDisturb
          :expand="basic._expand || expandAll!"
          :readonly="readonly"
          :disturb="basic.disturb"
        />
        <BasicTarget
          :expand="basic._expand || expandAll!"
          :readonly="readonly"
          :target="basic.target"
        />
      </el-form>
    </el-scrollbar>
  </div>

  <HeaderToggleButton v-model="basic._expand" v-if="!expandAll" />
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
    // padding: 12px 0;
    line-height: 2.5rem;

    background-color: #f7f8fb;
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

.TouchFlow-Addon {
  .el-scrollbar {
    height: calc(100% - 100px);
  }

  .transition-item {
    opacity: 0;
    pointer-events: none;
    transform: translateX(-5%);

    transition: cubic-bezier(0.215, 0.61, 0.355, 1) 0.5s;
  }

  .transition-item.expand {
    opacity: 1;
    pointer-events: all;

    transform: translateX(0%);

    transition: cubic-bezier(0.215, 0.61, 0.355, 1) 0.5s var(--t-delay, 0s);
  }

  label.el-form-item__label {
    font-size: 16px !important;
    color: #000;
  }

  &.expandAll {
    .el-scrollbar {
      height: calc(100% - 0px);
    }
    height: 400px;
  }

  margin-top: -1rem;

  height: calc(100% - 60px);

  overflow: hidden;
}

.TouchFlow-Header {
  .el-form-item__error {
    font-size: 14px;
  }

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

  // position: absolute;
  display: flex;

  justify-content: space-between;
  align-items: center;

  // width: 100%;
  height: 80px;

  overflow: hidden;
}
</style>
