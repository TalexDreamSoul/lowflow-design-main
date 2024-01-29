<template>
  <div class="event">
    <div class="title">事件列表</div>
    <div class="search">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-select v-model="formInline.eventType" placeholder="类别" clearable>
            <el-option v-for="item of EVENT_TYPE" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="Activity time">
          <el-date-picker v-model="formInline.date" type="date" placeholder="Pick a date" clearable />
        </el-form-item>
        <el-form-item>
          <el-input v-model="formInline.eventName" placeholder="事件名称" clearable />
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="onCreateEvent">新建事件</el-button>
    </div>
    <div class="content">
      <el-table :data="[]" border style="width: 100%">
        <el-table-column prop="date" label="事件名" width="180" />
        <el-table-column prop="name" label="事件名称" width="180" />
        <el-table-column prop="address" label="事件说明" />
        <el-table-column prop="address" label="状态" />
        <el-table-column prop="address" label="类别" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button link type="primary" size="small">下线</el-button>
            <el-button link type="primary" size="small">编辑</el-button>
            <el-button link type="primary" size="small">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="prev, pager, next, sizes, jumper" :total='total' :page-sizes="[10]"
        v-model:current-page="pageNum" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { EVENT_TYPE } from '~/constants'

const formInline = reactive({
  eventName: '',
  eventType: '',
  date: '',
})

const total = ref(20)
const pageNum = ref(1)

const onSubmit = () => {
  console.log(formInline)
}

const onCreateEvent = () => {
  console.log(pageNum)
}
</script>

<style lang="scss">
.event {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 24px 40px;
  background-color: #f8f9fa;
  .title {
    font-size: 24px;
    line-height: 24px;
    font-weight: 500;
    color: rgba($color: #000000, $alpha: 1.0);
    margin-bottom: 24px;
  }
}
</style>