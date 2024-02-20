<script setup lang="ts">
import BasicDisturb from "./BasicDisturb.vue";
import BasicTarget from "../page/BasicTarget.vue";
import { useRouter } from "vue-router";
const props = defineProps<{
  basic: any;
  expandAll?: boolean;
  readonly?: boolean
}>();

const emits = defineEmits<{
  (e: 'submitReview', status?: string): void
}>()

async function submitReview(status?: string) {
  emits('submitReview', status)
}
const router = useRouter();

const goBack = () => {
  router.go(-1);
};
</script>

<template>
  <div class="TouchFlow-Header">
    <div class="TouchFlow-Header-Start">
      <span>策略流程名称：</span>
      <el-input :disabled="readonly" placeholder="策略流程名称" v-model="basic.touchName" :style="{ width: '400px', height: '40px' }" />
    </div>
    <div v-if="!expandAll">
      <el-button  @click="goBack" round>返回</el-button>
      <el-button @click="submitReview('draft')" round>保存草稿</el-button>
      <el-button round type="primary" @click="submitReview" primaryStyle>提交审核</el-button>
    </div>
  </div>

  <div :class="{ expandAll }" class="TouchFlow-Addon" v-show="basic._expand || expandAll">
    <el-scrollbar>
      <BasicDisturb :readonly="readonly" :disturb="basic.disturb" />
      <BasicTarget :readonly="readonly" :target="basic.target" />
    </el-scrollbar>
  </div>
  <div v-if="!expandAll" @click="basic._expand = !basic._expand" :class="basic._expand ? 'baseSet baseSetpoz' : 'baseSet'">
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
  &.expandAll {
    height: 400px;
  }
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
