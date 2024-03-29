<script setup lang="ts">
import { ref, unref, reactive, onMounted, watch } from "vue";
import { getmarketingTouchDetail,marketingTouchStatistics } from "~/api/index";
import dayjs from "dayjs";
import { useRoute, Router, useRouter } from "vue-router";
import * as echarts from "echarts";
import { num2character } from "~/utils/common";
import FlowPage from "~/touch-flow/FlowPage.vue";

const router = useRouter();
const route = useRoute();

const goBack = () => {
  router.go(-1);
};

const formInline = reactive({
  touchName: "",
  executeType: "",
  beginTime: "",
  endTime: "",
  status: "",
});

const typeMap = {
  immediately: "定时-单次",
  delayed: "定时-重复",
  trigger: "触发型",
};

const marketingDetail = ref();
const currentPage = ref(1);
const pageSize = ref(10);

const StatisticsList = ref({
  accumulateCompleteCount: 0,
  accumulateEntryCount: 0,
  accumulateTouchCount: 0,
  completeTargetCount1: 0,
  completeTargetCount2: 0,
});

onMounted(async () => {
  getmarketingTouchNode();
  fetchDataDetails();
});
watch([currentPage, pageSize, formInline], () => {
  fetchDataDetails();
});
const fetchDataDetails = async () => {
  const res = await getmarketingTouchDetail({
    id: route.params.id,
  });
  marketingDetail.value = res.data;
  console.log(`output->res.data`, res.data);
};
const getmarketingTouchNode = async () => {
  const res = await marketingTouchStatistics({
    id: route.params.id,
  });
  StatisticsList.value = res.data;
  console.log(StatisticsList, "res");

  chart.value = echarts.init(chartContainer.value);
  const options = {
    xAxis: {
      type: "category",
      data: ["累计进入", "累计触达", "完成目标一", "完成目标二"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [StatisticsList.value.accumulateEntryCount, StatisticsList.value.accumulateTouchCount, StatisticsList.value.completeTargetCount1, StatisticsList.value.completeTargetCount2],
        type: "bar",
        barWidth: 30, // 设置柱体宽度
      },
    ],
  };
  chart.value.setOption(options);
  console.log(`output->options`,options)
};

const chartContainer = ref(null);
const chart = ref(null);

// 监听接口返回内容的变化
// watch(apiData, (newData) => {
//   if (chart.value) {
//     const options = {
//       xAxis: {
//         type: "category",
//         data: ["累计进入", "累计触达", "完成目标1", "完成目标2"],
//       },
//       yAxis: {
//         type: "value",
//       },
//       series: [
//         {
//           data: newData,
//           type: "bar",
//         },
//       ],
//     };
//     chart.value.setOption(options);
//   }
// });

</script>

<template>
  <div class="warp">
    <div class="pageTitle">
      <div>{{ marketingDetail?.touchName }}</div> <el-button @click="goBack" round>返回</el-button>
    </div>

    <div class="tableCard">
      <div class="countCard">
        <div style="width:200px">
          <div class="desctitle">
            模版类型：
          </div>
          <div class="description">
            {{ typeMap[marketingDetail?.executeType] }}
          </div>
        </div>
        <div style="width:400px">
          <div class="desctitle">
            有效期：
          </div>
          <div class="description">
            {{ dayjs(marketingDetail?.startTime).format("YYYY-MM-DD HH:mm") }} 至 {{
              dayjs(marketingDetail?.endTime).format("YYYY-MM-DD HH:mm") }}
          </div>
        </div>
        <div style="width:200px">
          <div class="desctitle">
            创建人：
          </div>
          <div class="description">
            {{ marketingDetail?.createUserName }}
          </div>
        </div>
      </div>

      <el-divider />
      <div class="statisticsblock">
        <div>
          <div class="description">
            目标完成表
          </div>
          <div ref="chartContainer" style="width: 500px; height: 300px;"></div>
        </div>
        <div style="width: 500px; height: 300px;">
          <div class="description">
            目标完成统计
          </div>
          <div class="countCardblock" style="    margin-top: 24px;">
            <div class="showCount">
              <div class="topcount">
                {{ StatisticsList.accumulateCompleteCount !== null  ? `${StatisticsList.accumulateCompleteCount}%` : '-' }}
              </div>
              <div class="undercount">总目标完成率</div>
            </div>
            <div class="showCount">
              <div class="topcount">
                {{ StatisticsList.accumulateEntryCount !== null ? StatisticsList.accumulateEntryCount : '-' }}
              </div>
              <div class="undercount">累计进入</div>
            </div>
            <div class="showCount">
              <div class="topcount">
                {{ StatisticsList.accumulateTouchCount !== null ? StatisticsList.accumulateTouchCount : '-' }}
              </div>
              <div class="undercount">累计触达</div>
            </div>
          </div>
          <div class="countCardblock">
            <div class="showCount">
              <div class="topcount">
                {{ StatisticsList.completeTargetCount1 !== null ? StatisticsList.completeTargetCount1 : '-' }}</div>
              <div class="undercount">完成目标{{ num2character(1) }}</div>
            </div>
            <div class="showCount">
              <div class="topcount">
                {{ StatisticsList.completeTargetCount2 !== null ? StatisticsList.completeTargetCount2 : '-' }}
              </div>
              <div class="undercount">完成目标{{ num2character(2) }}</div>
            </div>
          </div>
        </div>

      </div>
      <div class="contentflow">
        <FlowPage  v-model="marketingDetail" :readonly="true"/>
      </div>

    </div>

  </div>
</template>
<style lang="scss" scoped>
.warp {
  // max-width: 100%;
  // overflow-x: hidden;

  padding: 24px 40px;
}

.tableCard {
  background: #ffffff;
  box-shadow: 0px 20px 50px 0px rgba(0, 0, 0, 0.02);
  border-radius: 8px 8px 8px 8px;
  opacity: 1;
  padding: 24px 24px 80px 24px;
}

.pagination {
  margin-top: 24px;
  float: right;
}

.pageTitle {
  font-size: 20px;
  font-weight: 500;
  color: #000000;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
}

.topSearch {
  display: flex;
  justify-content: space-between;
}

.add {
  pointer-events: none;
  background: linear-gradient(rgb(32, 92, 203) 0%, rgb(89, 143, 241) 100%);
  transition: 0.25s;
}

.countCard {
  display: flex;
  justify-content: flex-start;
}

.countCardblock,
.statisticsblock {
  display: flex;
}

.description {
  color: #333;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
}

.desctitle {
  color: #666;
  font-size: 14px;
  line-height: 24px;
}

.showCount {
  min-width: 150px;
  margin-right: 16px;
  background: linear-gradient(180deg,
      #f2f4f8 0%,
      rgba(242, 244, 248, 0.4) 100%);
  border-radius: 8px 8px 8px 8px;
  opacity: 1;
  margin-bottom: 24px;
  padding: 24px;
  color: rgba(0, 0, 0, 0.9);

  .topcount {
    font-size: 32px;
    font-weight: 800;
  }

  .undercount {
    font-weight: 400;
    font-size: 14px;
    color: #7f8080;
  }
}

.allcount {
  color: #ffffff;

  background: linear-gradient(180deg, #2258bb 0%, #4078e0 100%);

  .undercount {
    font-weight: 400;
    font-size: 14px;
    color: #bed1f4;
  }
}

.contentflow {
  position: relative;

  height: 800px;
  width: 100%;
  background: #F7F8FB;
  overflow-y: scroll;
}
</style>