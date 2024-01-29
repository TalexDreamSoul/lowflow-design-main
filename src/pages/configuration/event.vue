<template>
  <div class="event">
    <div class="title">事件列表</div>
    <div class="content">
      <div class="title">事件列表</div>
      <div class="search">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item>
            <el-select v-model="formInline.region" placeholder="Activity zone" clearable>
              <el-option label="Zone one" value="shanghai" />
              <el-option label="Zone two" value="beijing" />
            </el-select>
          </el-form-item>
          <el-form-item label="Activity time">
            <el-date-picker v-model="formInline.date" type="date" placeholder="Pick a date" clearable />
          </el-form-item>
          <el-form-item>
            <el-input v-model="formInline.user" placeholder="Approved by" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">搜索</el-button>
          </el-form-item>
        </el-form>
        <el-button type="primary" @click="onCreateEvent">新建事件</el-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive } from 'vue'

const formInline = reactive({
  user: '',
  region: '',
  date: '',
})

const onSubmit = () => {
  console.log(formInline)
}

const onCreateEvent = () => {
  console.log('onCreateEvent!')
}
</script>
<style></style>