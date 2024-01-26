<script setup lang="ts" name="LogicalLine">
import { useVModel } from "@vueuse/core";
import { computed } from "vue";

const props = defineProps<{
  modelValue: string;
  title?: string;
  display?: boolean;
}>();

const emits = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const label = computed(() => ("and" === model.value ? "且" : "或"));
const model = useVModel(props, "modelValue", emits);

function toggle() {
  model.value = model.value === "and" ? "or" : "and";
}
</script>

<template>
  <div class="LogicalLine">
    <div :class="{ active: +display ^ 1 }" class="LogicalLine-Filter">
      <div class="fontstyle" v-text="title" />
      <div class="logical-operator">
        <div class="logical-operator__line"></div>
        <div
          class="custom-switch"
          :class="{ active: model === 'and' }"
          @click="toggle"
          v-text="label"
        />
      </div>
    </div>
    <div class="LogicalLine-Main">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.LogicalLine {
  display: flex;
  //margin: 10px 0;

  &-Filter {
    &.active {
      opacity: 1;
    }
    display: flex;

    opacity: 0;
    transition: .25s;
    .fontstyle {
      align-self: center;
      //margin-right: 0.5rem;

      font-size: 12px;
      color: #000000;
      position: relative;
    }

    .logical-operator {
      position: relative;
      display: flex;
      align-items: center;
      overflow: hidden;
      min-width: 40px;

      .logical-operator__line {
        position: absolute;
        left: calc(38% - 1px);
        border-width: 1px 0 1px 1px;
        border-top-style: solid;
        border-bottom-style: solid;
        border-left-style: solid;
        border-left-color: #4078e0;
        border-image: initial;
        border-right-style: initial;
        border-right-color: initial;
        border-radius: 5px 0 0 5px;
        height: calc(100% - 22px);
      }
    }

    .filter-option-content {
      position: relative;
      width: 100%;

      .filter-item-rule {
        display: flex;
        align-items: center;
        //min-height: 48px;
      }

      .filter-filter-item__add {
        border-style: dashed;
        width: 100%;
      }
    }
  }

  &-Main {
    flex: 1;
  }
}

.custom-switch {
  border: 1px solid #4078e0;
  color: #fff;
  width: 24px;
  height: 24px;
  background: #fff;
  font-weight: 500;
  color: #4078e0;
  font-size: 14px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1;
}
</style>
