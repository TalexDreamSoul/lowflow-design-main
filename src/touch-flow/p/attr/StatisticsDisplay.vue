<script setup lang="ts" name="StatisticsDisplay">
import { ref } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'
import { marketingTouchNodeStatistics } from '~/api/index'

const props = defineProps<{
  nodeId: string,
}>()

const data = ref({
  accumulateEntryCount: 0,
  accumulateTouchCount: 0,
  completeTargetCount: 0,
  _fetched: false
})

async function handleClick() {
  const id = +location.href.split('/').at(-1)!

  const res = await marketingTouchNodeStatistics({
    id,
    pageNum: 1,
    pageSize: 10,
    touchNodeId: 0//props.nodeId
  })

  console.log("res", res)

  Object.assign(data.value, {
    accumulateEntryCount: res.data.accumulateEntryCount,
    accumulateTouchCount: res.data.accumulateTouchCount,
    completeTargetCount: res.data.completeTargetCount,
    _fetched: true
  })

}
</script>

<template>
  <div @click.stop="handleClick" class="StatisticsDisplay" :class="{ active: data._fetched }">
    <div class="StatisticsDisplay-Title">
      <p>数据统计</p>
      <el-button plain text>
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
</template>

<style lang="scss" scoped>
.StatisticsDisplay {
  &-Title {
    display: flex;

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
    background-color: #EEEEEEEF;
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
    background-color: #277AE7A0;
    backdrop-filter: blur(18px) saturate(180%);
  }

  &:hover::after {
    background-color: #277AE7F0;
  }

  &.active {

    &::before,
    &::after {
      display: none;
    }

  }

  position: relative;
  padding: .25rem .5rem;
  margin-top: 1rem;

  p {
    color: #000;
    font-weight: 600;
  }

  li {
    span.bold {
      font-weight: 600;
    }

    margin: .5rem 0;

    font-size: 16px;
  }

  ul {
    padding: 0;

    list-style: none;
  }
}
</style>