<script setup lang="ts">
const props = defineProps<{
  disturb: any,
}>()

const disturbOptions = [
  "放弃本次触达且退出流程",
  "待勿扰时段结束立即触达",
  "放弃本次触达且不退出流程"
]

</script>

<template>
  <div class="Basic-Block">
    <!-- @click="disturb.enable = !disturb.enable" -->
    <p class="Basic-Block-Head">
      <span>勿扰设置</span>
      <el-switch inline-prompt  v-model="disturb.enable" style="--el-switch-on-color: #4078E0;"/>
    </p>
    <!-- <el-divider></el-divider> -->
    <div :class="{ disabled: !disturb.enable }" class="Basic-Block-Content" v-if="disturb.enable">
      <el-date-picker v-model="disturb.time" type="daterange" unlink-panels range-separator="To" start-placeholder="开始时间"
        end-placeholder="结束时间" />
      为客户勿扰时间段，勿扰时间内触达则
      <el-select v-model="disturb.action"  style="width: 240px;">
        <el-option v-for="(item, index) in disturbOptions" :key="index" :label="item" :value="index" />
      </el-select>
    </div>
  </div>
</template>