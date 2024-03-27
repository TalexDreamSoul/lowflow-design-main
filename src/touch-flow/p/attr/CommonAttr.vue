<script setup lang="ts" name="CommonAttr">
import BehaviorGroupPlus from "../behavior/BehaviorGroupPlus.vue";
import TouchSettings from "../touch/TouchSettings.vue";
import NewLabel from '../../label/NewLabel.vue'
import { ref } from 'vue'

const props = defineProps<{
  sizeForm: any;
  readonly?: boolean;
}>();

const touchSettingsRef = ref()

defineExpose({
  updateData: () => {

    if (!touchSettingsRef.value) {
      return
    }

    console.log("touch updated!!!")

     return touchSettingsRef.value.updateData()

  }
})
</script>

<template>
  <BehaviorGroupPlus :default-expand="true" title="延迟设置" color="#62C943">
    &nbsp;
    <el-select :disabled="readonly" v-model="sizeForm.nodeDelayed.isDelayed" style="width: 100px">
      <el-option :value="true" label="延迟">延迟</el-option>
      <el-option :value="false" label="立即">立即</el-option> </el-select>&nbsp;
    <template v-if="sizeForm.nodeDelayed.isDelayed">
      <el-input-number :disabled="readonly" :min="1" v-model="sizeForm.nodeDelayed.delayedTime" type="number"
        style="width: 100px" />&nbsp;
      <el-select :disabled="readonly" placeholder="请选择" v-model="sizeForm.nodeDelayed.delayedUnit" style="width: 100px">
        <el-option value="minute" label="分钟">分钟</el-option>
        <el-option value="hour" label="小时">小时</el-option>
        <el-option value="day" label="天">天</el-option> </el-select>&nbsp;
    </template>
    <el-text>针对符合该装置策略条件的客户</el-text>
    &nbsp;
    <el-select :disabled="readonly" v-model="sizeForm.nodeDelayed.delayedAction" placeholder="请选择" style="width: 150px">
      <el-option value="touch" label="发送触达">发送触达</el-option>
      <el-option value="label" label="打上标签">打上标签</el-option>
      <el-option value="nothing" label="不执行动作">不执行动作</el-option>
      <el-option value="touchAndLabel" label="发送触达并打上标签">发送触达并打上标签</el-option>
    </el-select>

  </BehaviorGroupPlus>

  <BehaviorGroupPlus :readonly="readonly"
    v-if="String(sizeForm.nodeDelayed.delayedAction).toLocaleLowerCase().indexOf('touch') !== -1" title="触达设置"
    color="#FFD561">
    <TouchSettings :readonly="readonly" ref="touchSettingsRef" :touch="sizeForm.touchTemplateContent" />
  </BehaviorGroupPlus>

  <BehaviorGroupPlus :readonly="readonly"
    v-if="String(sizeForm.nodeDelayed.delayedAction).toLocaleLowerCase().indexOf('label') !== -1" title="标签设置"
    color="#277AE7">
    <NewLabel :readonly="readonly" :p="sizeForm" />
  </BehaviorGroupPlus>
</template>