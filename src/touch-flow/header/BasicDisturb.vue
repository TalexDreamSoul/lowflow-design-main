<script setup lang="ts">
import { IHeaderDisturb } from '../flow-types'

interface IDisturbProp {
  disturb: IHeaderDisturb,
  readonly?: boolean,
  expand: boolean
}

defineProps<IDisturbProp>()

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
  }
]

</script>

<template>
  <el-form-item class="Basic-Block transition-item" :class="{ expand }">
    <template #label>
      <div class="Basic-Block-Head">
        <label class="el-form-item__label">勿扰设置</label>
        <el-switch :disabled="readonly" inline-prompt v-model="disturb.enable"
          style="margin-top: -4px;--el-switch-on-color: #4078E0;" />
      </div>
    </template>
    <div class="Basic-Block-Content" v-show="disturb.enable">
      <el-form-item>
        <el-date-picker :disabled="readonly" v-model="disturb.time" type="daterange" unlink-panels range-separator="-"
          start-placeholder="开始日期" end-placeholder="结束日期" />
      </el-form-item>
      <el-text>为客户勿扰时间段，勿扰时间内触达则</el-text>
      <el-form-item>
        <el-select :disabled="readonly" v-model="disturb.action" style="width: 240px;">
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
    padding: .5rem 1rem 1rem;

    align-items: center;

    width: calc(100% - 30px);

    gap: .5rem;
    border-radius: 4px;
  }

  :deep(.el-form-item) {
    margin: 0 !important;
  }

  --t-delay: .2s;
}
</style>