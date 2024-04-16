<script setup lang="ts" name="BehaviorGroupPlus">
import { ref, watchEffect } from "vue";
import { DArrowRight } from "@element-plus/icons-vue";

const props = defineProps<{
  title: string;
  color: string;
  hideToggleButton?: boolean;
  defaultExpand?: boolean;
  readonly?: boolean;
}>();

const expand = ref(false);

watchEffect(() => {
  expand.value = props.defaultExpand !== undefined ? props.defaultExpand : false;
});
</script>

<template>
  <div :style="`--c: ${color}`" class="BehaviorGroupPlus" :class="{ expand: readonly || expand }">
    <div class="BehaviorGroupPlus-Header">
      <span :class="{ disabled: readonly }">
        <slot name="title">
          {{ title }}
        </slot>
      </span>

      <slot name="toggle">
        <span @click="expand = !expand" v-if="!hideToggleButton" class="addon-icon">
          <el-text class="mx-1" type="primary">{{ expand ? "收起" : "展开" }}
            <el-icon class="icondown" :style="{
    transform: expand ? 'rotate(-90deg)' : 'rotate(90deg)',
  }">
              <DArrowRight />
            </el-icon></el-text>
        </span>
      </slot>
    </div>
    <div :class="{ disabled: readonly }" class="BehaviorGroupPlus-Main">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
.BehaviorGroupPlus {
  &-Header {
    span.disabled {
      opacity: .75;
      cursor: not-allowed;

      &::before {
        z-index: 1;
        content: "";
        position: absolute;

        left: 0;
        top: 0;

        width: 100%;
        height: 100%;

        // background-color: red;
      }
    }

    &::before {
      content: "";
      position: absolute;

      left: 0;
      top: 0;

      width: 5px;
      height: 100%;

      border-radius: 8px 0 0 8px;
      background-color: var(--c, red);
    }

    .addon-icon {
      cursor: pointer;
    }

    .icondown {
      transition: 0.25s;
    }

    position: relative;
    padding: 8px 18px;
    display: flex;

    justify-content: space-between;
    align-items: center;
    font-weight: 500;
    font-size: 14px;
    background-color: var(--el-fill-color-light);
  }

  &.expand {
    & .BehaviorGroupPlus-Main {
      padding: 0.5rem;

      &.disabled::before {
        z-index: 1;
        content: "";
        position: absolute;

        left: 0;
        top: 0;

        width: 100%;
        height: 100%;

        cursor: not-allowed;
        // background-color: red;
      }
    }

    max-height: 10000px;

    transition: max-height .5s ease-in-out;
  }

  &-Main {
    position: relative;
    padding: 0;

    height: 100%;

    transition: .25s ease-in-out;
  }

  margin: 0.8rem 0;
  max-height: 38px;

  overflow: hidden;
  border-radius: 4px;
  transition: max-height .25s cubic-bezier(0, 1, 0, 1);
  background-color: var(--el-fill-color-lighter);
}
</style>
