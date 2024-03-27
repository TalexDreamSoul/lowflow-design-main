<script setup lang="ts" name="BehaviorGroup">
import { ref } from "vue";
import { CirclePlusFilled } from "@element-plus/icons-vue";

defineProps<{
  title: string;
  readonly?: boolean;
}>();

const emits = defineEmits<{
  (e: "add"): void;
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
        <el-button v-if="!readonly" @click.stop="emits('add')" size="small" text plain type="primary">
          <el-icon>
            <CirclePlusFilled />
          </el-icon>
          &nbsp;添加
        </el-button>
        <!-- <el-button v-else size="small" text plain type="primary">
          <el-icon>
            <CirclePlusFilled />
          </el-icon>
          &nbsp;{{ !expand ? "展开" : "收起" }}
        </el-button> -->
      </span>
    </div>
    <div class="BehaviorGroup-Main">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
.BehaviorGroup {
  &-Header {
    padding: 8px 18px;
    display: flex;

    justify-content: space-between;
    align-items: center;

    cursor: pointer;
    user-select: none;
    background-color: #f7f8fb;
  }

  &.expand {
    .toggle-icon::before {
      transform: translateY(0.5px) rotateZ(90deg) scaleX(0);
    }

    .addon-icon {
      opacity: 1;
      transform: translateX(0%);

      pointer-events: all;
    }

    max-height: 5000px;

    transition: max-height 1s ease-in-out;
  }

  .addon-icon {
    opacity: 0;
    transform: translateX(10%);

    pointer-events: none;
    transition: cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.25s;
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

  &-Main {
    // padding: 0.5rem;
  }

  margin: 0.8rem 0;
  max-height: 40px;

  overflow: hidden;
  border-radius: 4px;
  transition: max-height .5s cubic-bezier(0, 1, 0, 1);
  background-color: #f7f8fb;
}
</style>
