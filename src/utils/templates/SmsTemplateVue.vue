<script setup lang="ts" name="ZnxTemplate">
import TouchSettingContents from '~/touch-flow/p/touch/TouchSettingContents.vue';
import { useVModel } from '@vueuse/core'
import { reactive, watchEffect } from 'vue'

const props = defineProps<{
  data: any
}>()

const origin = {
  id: "",
  name: "",
  status: "",
  type: "sms",

  content: "",
  sceneCode: "",
  variables: [
    {
      field: "",
      fieldName: "",
      labelId: 0,
      labelName: "",
      labelValue: [],
      type: "",
      variables: [
        {
          compareValue: "",
          defaultValue: "",
          fieldOp: "",
          fieldValue: ""
        }
      ]
    }
  ]
}

const data = reactive<typeof origin>(origin)

watchEffect(() => {
  const _data = props.data.value

  Object.assign(data, _data)
})

function saveData() {
  console.log('save', data, origin)
}

defineExpose({ saveData })
</script>

<template>
  <el-form label-position="top" :model="data">
    <el-form-item label="模板名称">
      <el-input v-model="data.name"></el-input>
    </el-form-item>
    <el-form-item label="场景码">
      <el-input v-model="data.sceneCode" placeholder="请输入"></el-input>
    </el-form-item>
    <el-form-item label="短信内容">
      <TouchSettingContents variables="titleVariables" content="listTitle" v-model="data" buttonTitle="输入变量" />
    </el-form-item>
  </el-form>
</template>