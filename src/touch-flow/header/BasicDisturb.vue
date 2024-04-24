<script setup lang="ts">
import DayJs from "dayjs";
import { computed, ref, watch } from "vue";
import { IHeaderDisturb } from "../flow-types";

interface IDisturbProp {
  disturb: IHeaderDisturb;
  readonly?: boolean;
  expand: boolean;
}

const props = defineProps<IDisturbProp>();

const disturbOptions = [
  {
    value: "quit",
    label: "放弃本次触达且退出流程",
  },
  {
    value: "wait",
    label: "待勿扰时段结束立即触达",
  },
  {
    value: "giveUp",
    label: "放弃本次触达且不退出流程",
  },
];


console.log("change", props.disturb.time);




</script>

<template>
  <el-form-item class="Basic-Block transition-item" :class="{ expand }">
    <div class="Basic-Block-Head">
      <label class="el-form-item__label">勿扰设置</label>
      <el-switch
        :disabled="readonly"
        v-model="disturb.enable"
        style="margin-top: -4px; --el-switch-on-color: #4078e0"
      />
    </div>
    <div class="Basic-Block-Content" v-show="disturb.enable">
      <el-form-item>
        <el-time-picker  :disabled="readonly"  type="daterange" v-model="disturb.time[0]" placeholder="开始时间"   value-format="HH:mm"/>&nbsp;-&nbsp;
        <el-time-picker :disabled="readonly" v-model="disturb.time[1]" placeholder="结束时间"  value-format="HH:mm"/>
        </el-form-item>
      <el-text>为客户勿扰时间段，勿扰时间内触达则</el-text>
      <el-form-item>
        <el-select :disabled="readonly" v-model="disturb.action" style="width: 240px">
          <el-option v-for="(item, index) in disturbOptions" :key="index" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </div>
  </el-form-item>
</template>

<style lang="scss" scoped>
.Basic-Block {
  &-Content {
    display: flex;
    padding:1rem;

    align-items: center;
    flex-wrap: wrap;
    width: calc(100% - 30px);

    gap: 0.5rem;
    border-radius: 4px;
  }

  :deep(.el-form-item) {
    margin: 0 !important;
  }

  --t-delay: 0.2s;
}
</style>
