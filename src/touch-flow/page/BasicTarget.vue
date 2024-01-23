<script setup lang="ts">
const props = defineProps<{
  target: any,
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
      <span>目标设置</span>
      <el-switch inline-prompt v-model="target.enable" style="--el-switch-on-color: #4078E0;" />
    </p>
    <div :class="{ disabled: !target.enable }" class="Basic-Block-Content" v-if="target.enable">
      <div class="Target-Block">
        <p>目标一</p>
      </div>
    </div>
  </div>
</template>