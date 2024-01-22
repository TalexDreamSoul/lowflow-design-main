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
      <el-switch inline-prompt active-text="开" inactive-text="关" v-model="target.enable" />
    </p>
    <div :class="{ disabled: !target.enable }" class="Basic-Block-Content">
      <div class="Target-Block">
        <p>目标一</p>
      </div>
    </div>
  </div>
</template>