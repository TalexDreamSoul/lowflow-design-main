<script setup lang="ts" name="TargetContent">
import { computed } from "vue";

const props = defineProps<{
  conditions?: any;
  logicalOperator?: String;
  logicalOperatorText?: String;
}>();

const $emits = defineEmits<{
  (e: 'increment'): void
}>()
</script>

<template>
  <div class="TargetContent">
    <div class="filter-container">
      <div class="fontstyle" v-if="logicalOperatorText">{{logicalOperatorText}}</div>
      <div class="logical-operator" v-if="conditions?.length">
        <div class="logical-operator__line"></div>
        <div class="custom-switch" :class="{ active: logicalOperator === 'and' }"  @click="onIncrement">
          {{ logicalOperator === "and" ? "且" : "或" }}
        </div>
      </div>
      <div class="filter-option-content">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.TargetContent {
  margin: 10px 0;

  border-radius: 8px;

  .filter-container {
    //background-color: #f5f8fc;
    //border-radius: 3px;
    display: flex;
    .fontstyle {
      font-size: 12px;
      font-weight: 400;
      color: #000000;
      position: relative;
      display: flex;
      align-items: center;
      overflow: hidden;
      min-width: 55px;
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
}

.TargetContent-TopBanner {
  background: #ebeff3;
  border-radius: 4px 4px 0px 0px;
  font-size: 12px;
  font-weight: 400;
  color: #000000;
  padding: 0px 24px;
}
:deep(.el-form-item) {
  margin-right: 0;
  margin-bottom: 0;
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
