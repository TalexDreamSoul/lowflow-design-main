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

const label = computed(() => ("且" === model.value ? "且" : "或"));
const model = useVModel(props, "modelValue", emits);

function toggle() {
  model.value = model.value === "且" ? "或" : "且";
}
</script>

<template>
  <div class="LogicalLine">
    <div :class="{ active: +display! ^ 1 }" class="LogicalLine-Filter">
      <div class="fontstyle" mr-2 v-text="title" />
      <div class="logical-operator">
        <div class="logical-operator__line"></div>
        <div
          class="custom-switch"
          :class="{ dotted: model !== '或' }"
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

<style lang="scss">
.LogicalLine {
  display: flex;
  //margin: 10px 0;

  &-Filter {
    &.active {
      margin-right: 0px;

      opacity: 1;
      transform: translateX(0);
    }
    display: flex;
    margin-right: -40px;

    opacity: 0;
    transform: translateX(-10%);
    transition: 0.25s;
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

      margin: 0 5px;

      align-items: center;
      overflow: hidden;

      .logical-operator__line {
        &:before,
        &:after {
          content: "";
          position: absolute;

          top: 0;
          left: 0;

          width: 10px;
          height: 1px;

          background-color: #4078e0;
        }
        &:after {
          top: 100%;
        }
        position: absolute;

        top: 5%;
        left: 50%;

        width: 1px;
        height: 90%;

        background-color: #4078e0;
        transform: translateX(-50%);
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
    li,
    & > div {
      & > * {
        flex: 1;
      }
      display: flex;

      align-items: center;
    }
    & > ul {
      display: flex;

      gap: 0.5rem;
      // justify-content: start;
      flex-direction: column;
    }
    flex: 1;

    padding: 12px 0;

    overflow: hidden;
  }

  user-select: none;
}

.custom-switch {
  &.dotted {
    border-style: dotted;
  }
  border: 1.5px solid #4078e0;
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
