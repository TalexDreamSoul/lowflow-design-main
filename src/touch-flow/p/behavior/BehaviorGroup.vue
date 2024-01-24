<script setup lang="ts" name="BehaviorGroup">
import { ref } from "vue";
const props = defineProps<{
  title: string;
}>();

const expand = ref(false);
</script>

<template>
  <div class="BehaviorGroup" :class="{ expand }">
    <div class="BehaviorGroup-Header" @click="expand = !expand">
      <span>
        <span class="toggle-icon" v-text="`-`" />
        {{ title }}
      </span>

      <span class="addon-icon">
        <el-button size="small" text plain type="primary">
          <el-icon>
            <CirclePlusFilled />
          </el-icon>
          &nbsp;添加
        </el-button>
      </span>
    </div>
    <div class="BehaviorGroup-Main">
      {{ title }}
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
.BehaviorGroup {
  &-Header {
    padding: 0 0.5rem;
    display: flex;

    justify-content: space-between;
    align-items: center;

    cursor: pointer;
    user-select: none;
    background-color: var(--el-fill-color-light);
  }

  &.expand {
    .toggle-icon::before {
      transform: translateY(0.5px) rotateZ(90deg) scaleX(0);
    }
    max-height: 1000px;

    transition: 0.25s ease-in;
  }
  .toggle-icon {
    &::before {
      content: "-";
      position: absolute;

      left: 0;
      top: 0;

      width: 100%;
      height: 100%;

      color: currentColor;
      text-align: center;
      line-height: 10.25px;

      transition: 0.25s;
      transform: translateY(0.5px) rotateZ(90deg) scaleX(1);
    }

    position: relative;
    display: inline-block;

    width: 12px;
    height: 12px;

    font-size: 18px;
    line-height: 12px;
    text-align: center;
    color: var(--el-color-primary);
    border: 1px solid var(--el-border-color);
  }
  .addon-icon {
    zoom: 0.75;
  }
  &-Main {
    padding: 0.5rem;
  }
  margin: 0.5rem 0;

  max-height: 30px;

  overflow: hidden;
  border-radius: 4px;
  transition: 0.25s ease-out;
  background-color: var(--el-fill-color-lighter);
}
</style>
