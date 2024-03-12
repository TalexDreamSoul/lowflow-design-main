<script setup lang="ts" name="StatisticsDisplay">
import { ref } from "vue";
import { ArrowRight } from "@element-plus/icons-vue";
import { marketingTouchNodeStatistics, qryNodeTouchCustom } from "~/api/index";

const props = defineProps<{
  nodeId: string;
}>();

const data = ref({
  accumulateEntryCount: 0,
  accumulateTouchCount: 0,
  completeTargetCount: 0,
  _fetched: false,
});
const modalVisible = ref(false);
const tableData = ref<any[]>([]);

async function handleClick() {
  if (data.value._fetched) return;

  const id = +location.href.split("/").at(-1)!;

  const res: any = await marketingTouchNodeStatistics({
    id,
    pageNum: 1,
    pageSize: 10,
    touchNodeId: props.nodeId,
  });

  console.log("res", res);

  Object.assign(data.value, {
    accumulateEntryCount: res.data.accumulateEntryCount,
    accumulateTouchCount: res.data.accumulateTouchCount,
    completeTargetCount: res.data.completeTargetCount,
    _fetched: true,
  });
}
async function handleClickqryNodeTouchCustom() {
  const id = +location.href.split("/").at(-1)!;

  const res: any = await qryNodeTouchCustom({
    id,
    pageNum: 1,
    pageSize: 10,
    touchNodeId: props.nodeId,
  });

  console.log("res", res.data);
  tableData.value = res.data;
  modalVisible.value = true;
}
</script>

<template>
  <div @click.stop="handleClick" class="StatisticsDisplay" :class="{ active: data._fetched }">
    <div class="StatisticsDisplay-Title" @click.stop="handleClickqryNodeTouchCustom">
      <p>数据统计</p>
      <el-button type="primary" plain text>
        查看策略器数据详情
        <el-icon>
          <ArrowRight />
        </el-icon>
      </el-button>
    </div>
    <ul>
      <li>累计进入：<span class="bold">{{ data.accumulateEntryCount }}人</span></li>
      <li>累计触达：<span class="bold">{{ data.accumulateTouchCount }}人</span></li>
      <li>策略器目标完成：<span class="bold">{{ data.completeTargetCount }}人</span></li>
      <li>策略器目标完成率：<span class="bold">0%</span></li>
    </ul>
  </div>
  <el-dialog  destroy-on-close v-model="modalVisible" title="触达详情">

    <div >
      <div >
        <div style="    
        display: flex;
        flex-direction: row;
        justify-content: flex-start;">
          <div style="    padding: 24px;
          background: rgb(242, 244, 248);
       ">累计进入(人)<div class="bold">{{ data.accumulateEntryCount }}</div>
          </div>
          <div style="      padding: 24px;
          background: rgb(242, 244, 248);
          margin-left: 24px;
        ">累计触达(人)<div class="bold">{{ data.accumulateTouchCount }}</div>
          </div>
        </div>
          <el-table :data="tableData" row-style="background: rgb(242, 244, 248);" style="width: 100%;
          background: rgb(242, 244, 248);
          ">
          <el-table-column prop="id" label="客户ID" width="120" />
          <el-table-column prop="name" label="客户名" min-width="72" />
          <el-table-column prop="itFinCode" label="互金客户号" width="120" />
          <el-table-column prop="phone" label="手机号" width="120"></el-table-column>
          <el-table-column prop="updatedTime" label="触达时间" width="120"></el-table-column>
        </el-table>
      </div>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
.StatisticsDisplay {
  &-Title {
    display: flex;

    align-items: center;
    justify-content: space-between;
  }

  &::before {
    z-index: 1;
    content: "";
    position: absolute;

    left: 0;
    top: 0;

    width: 100%;
    height: 100%;

    border: 1px solid #eee;
    background-color: #eeeeeeef;
  }

  &::after {
    z-index: 10;
    content: "统计";
    position: absolute;

    left: 50%;
    top: 50%;

    width: 100px;
    height: 30px;
    line-height: 30px;

    cursor: pointer;
    text-align: center;

    color: #fff;
    transform: translate(-50%, -50%);

    border-radius: 8px;
    border: 1px solid #eee;
    background-color: #277ae7a0;
    backdrop-filter: blur(18px) saturate(180%);
  }

  &:hover::after {
    background-color: #277ae7f0;
  }

  &.active {
    &::before,
    &::after {
      display: none;
    }
  }

  position: relative;
  padding: 0.25rem 0.5rem;
  margin-top: 1rem;

  p {
    color: #000;
    font-weight: 600;
  }

  li {
    span.bold {
      font-weight: 600;
    }

    margin: 0.5rem 0;

    font-size: 16px;
  }

  ul {
    padding: 0;

    list-style: none;
  }
}
</style>