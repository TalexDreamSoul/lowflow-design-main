<script setup lang="ts" name="BehaviorGroupPlus">
import { ref } from "vue";

defineProps<{
  title: string;
  color: string
}>();

const expand = ref(false);
</script>

<template>
  <div :style="`--c: ${color}`" class="BehaviorGroupPlus" :class="{ expand }">
    <div class="BehaviorGroupPlus-Header">
      <span>
        {{ title }}
      </span>

      <span class="addon-icon">
        <el-text class="mx-1" type="primary" @click="expand = !expand">{{ expand ? "收起" : "展开" }}
          <el-icon class="icondown" :style="{
            transform: expand ? 'rotate(-90deg)' : 'rotate(90deg)',
          }">
            <DArrowRight />
          </el-icon></el-text>
      </span>
    </div>
    <div class="BehaviorGroupPlus-Main">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
.BehaviorGroupPlus {
  &-Header {
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
      transition: .25s;
    }
    position: relative;
    padding: 8px 18px;
    display: flex;

    justify-content: space-between;
    align-items: center;

    user-select: none;
    background-color: var(--el-fill-color-light);
  }

  &.expand {

    max-height: 10000px;

    transition: 0.35s ease-in;
  }

  &-Main {
    padding: 0.5rem;
  }

  margin: 0.8rem 0;
  max-height: 38px;

  overflow: hidden;
  border-radius: 4px;
  transition: 0.35s ease-out;
  background-color: var(--el-fill-color-lighter);
}
</style>
