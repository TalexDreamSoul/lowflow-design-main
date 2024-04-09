<script setup lang="ts">
import { ref, unref, reactive, onMounted, watch } from "vue";
import {
  getqryMarketingTouch,
  deleteMarketingTouch,
  getqryTouchStatusCount,
  getstartMarketingTouch,
  getpauseMarketingTouch,
  updateMarketingTouchStatus,
  copyMarketingTouch,
} from "~/api/index";
import { useRouter, useRoute } from "vue-router";
import { ElMessageBox, ElMessage, ElTag } from "element-plus";
import { Download } from "@element-plus/icons-vue";
import dayjs from "dayjs";
import { getmarketingTouchDetail, marketingTouchStatistics } from "~/api/index";
import * as echarts from "echarts/core";
import { FunnelChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

import { BlackAddTypeEnum, GAMEPLAY_DATA_TYPT } from "~/constants";

const funnelChart = ref(null);
const formInline = reactive({
  touchName: "",
  executeType: "",
  beginTime: "",
  endTime: "",
  status: "",
});

const time = ref(null);
const router = useRouter();
const route = useRoute();

const statusLabels = {
  draft: { Text: "草稿", type: "info" },
  approvalPending: { Text: "待审批", type: "success" },
  approvalSuccess: { Text: "审批成功", type: "info" },
  approvalRefuse: { Text: "审批拒绝", type: "warning" },
  waitStart: { Text: "等待启动", type: "warning" },
  running: { Text: "发送中", type: "" },
  suspend: { Text: "暂停", type: "warning" },
  done: { Text: "已结束", type: "info" },
};
const typeMap = {
  immediately: "定时-单次",
  delayed: "定时-重复",
  trigger: "触发型",
};
const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const small = ref(false);
const background = ref(false);
const disabled = ref(false);
const total = ref(110);
const tabVModel = ref(1);

const StatisticsList = ref({
  suspend: 0,
  running: 0,
  total: 0,
  waitStart: 0,
  draft: 0,
  approvalPending: 0,
  approvalSuccess: 0,
  approvalRefuse: 0,
  done: 0,
  accumulateCompleteCount: 0,
  accumulateEntryCount: 0,
  accumulateTouchCount: 0,
  completeTargetCount1: 0,
  completeTargetCount2: 0,
  timeIntervals: [
    "0-5s",
    "6-10s",
    "11～20s",
    "21～40s",
    "81～160s",
    "161～320s",
    "321～640s",
    "641～1280s",
    "≥1280s",
  ],
  percentages: [60, 45, 15, 60, 45, 15, 60, 45, 15],
});

onMounted(async () => {
  fetchDataApi();
});
watch([currentPage, pageSize, formInline], () => {
  fetchDataApi();
});
const fetchDataApi = async () => {
  const res = await getqryMarketingTouch({
    pageNum: unref(currentPage),
    pageSize: unref(pageSize),
    ...formInline,
  });
  tableData.value = res.data.records;
  total.value = res.data.total;
};

const handleSizeChange = (val: any) => {
  console.log(`${val} items per page`);
};
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
};
const changeTime = (val: any) => {
  console.log(val, "change");
  if (val == null) {
    formInline.beginTime = "";
    formInline.endTime = "";
  } else {
    formInline.beginTime = dayjs(val[0]).format("YYYY-MM-DD");
    formInline.endTime = dayjs(val[1]).format("YYYY-MM-DD");
  }
};

const changeStatus = (val: any) => {
  console.log(val, "change");
  formInline.status = val;
};
const defaultFormValues = {
  blacklistName: "",
  blacklistDesc: "",
  blacklistType: "",
};
let formValues = reactive<any>({ ...defaultFormValues });

onMounted(async () => {
  // const response: any = await marketingTouchStatistics({
  //   id: route.params.id,
  // });
  // const data = response?.data;

  // const chart = echarts.init(chartContainerB.value);

  // const options = {
  //   xAxis: {
  //     type: "funnel",
  //     data: [
  //       { value: 12345, name: "浏览量人数UV" },
  //       { value: 5435, name: "表单提交人数" },
  //     ],
  //   },
  //   yAxis: {
  //     type: "value",
  //     min: 0,
  //     max: 60,
  //   },

  //   series: [
  //     {
  //       name: "Percentage",
  //       type: "bar",
  //       barWidth: "40px", // 设置柱体宽度
  //       data: StatisticsList.value?.percentages,
  //     },
  //   ],
  // };

  // chart.setOption(options);

  echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    CanvasRenderer,
  ]);
  echarts.use(FunnelChart);

  const chartData = [
    { value: 100, name: "Step 1" },
    { value: 80, name: "Step 2" },
    { value: 60, name: "Step 3" },
    { value: 40, name: "Step 4" },
    { value: 20, name: "Step 5" },
  ];

  const myChart = echarts.init(funnelChart.value);

  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c}%",
    },
    series: [
      {
        type: "funnel",
        left: "10%",
        top: 60,
        bottom: 60,
        width: "80%",
        label: {
          show: true,
          position: "inside",
        },
        data: chartData,
      },
    ],
  };

  myChart.setOption(option);
});
</script>

<template>
  <div class="warp">
    <div class="countCard roundCard">
      <span class="spanDataName" style="margin-right:40px">
        玩法数据
      </span>

      <el-form-item label="玩法">
        <el-select v-model="formValues.blacklistType" placeholder="请选择" style="width:300px" clearable>
          <el-option v-for="item of GAMEPLAY_DATA_TYPT" :label="item.label" :value="item.labelvalue" />
        </el-select>
      </el-form-item>
    </div>

    <el-button-group > 
      <el-button :type="tabVModel==1&&'primary'" style="height: 40px;">
        参与数据
      </el-button>
      <el-button :type="tabVModel==2&&'primary'" style="height: 40px;">奖品数据
      </el-button>
      <el-button :type="tabVModel==3&&'primary'" style="height: 40px;">参与客户明细
      </el-button>
    </el-button-group>
    <div class="tableCard">
      <el-form :inline="true" style="margin-bottom: 16px;">
        <el-form-item label="筛选日期：">
          <el-date-picker v-model="time" type="daterange" range-separator="To" start-placeholder="开始日期" end-placeholder="结束日期" :size="size" @change="changeTime" />
        </el-form-item>
        <el-form-item >
          <el-button type="primary" :icon="Download" class="primaryStyle">下载</el-button>
        </el-form-item>

      </el-form>

      <div class="countCard">

        <div class="showCount" :class="formInline.status=='running'?'bgblue':''" @click="changeStatus('running')">
          <div class="topcount">
            {{ StatisticsList?.running !== undefined ? StatisticsList?.running : '--' }}
          </div>
          <div class="undercount">总微信5元立减券…</div>
        </div>
        <div class="showCount" @click="changeStatus('suspend')" :class="formInline.status=='suspend'?'bgblue':''">
          <div class="topcount">
            {{ StatisticsList?.suspend !== undefined ? StatisticsList?.suspend : '--' }}
          </div>
          <div class="undercount">总100米粒发放数量</div>
        </div>
      </div>
      <el-table :data="tableData" style="width: 100% ----el-table-header-bg-color: #F2F4F8;--el-table-header-bg-color: #F2F4F8;--el-table-header-text-color:#333;">
        <el-table-column label="时间段" width="320">
          <template #default="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="微信5元立减券发放数量" prop="touchName" />
        <el-table-column label="100米粒发放数量">
          <template #default="scope">
            {{ statusLabels[scope.row.status].Text }}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[100, 200, 300, 400]" :small="small" :disabled="disabled" :background="background" layout="prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" class="pagination" />

    </div>

  </div>
  <div class="warp">
    <div class="tableCardunder">
      <div class="spanDataName">
        <span>
          表单转化数据
        </span>&nbsp;
      </div>

      <div>
        <el-form-item label="玩法">
          <el-select v-model="formValues.blacklistType" placeholder="请选择" style="width:300px" clearable>
            <el-option v-for="item of BLACK_LIST_TYPE" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <div>
          <div ref="funnelChart" style="width: 1000px; height: 400px;"></div>
        </div>
      </div>
    </div>

  </div>
</template>
<style lang="scss" scoped>
.tableCard {
  background: #ffffff;
  box-shadow: 0px 20px 50px 0px rgba(0, 0, 0, 0.02);
  border-radius: 8px 8px 8px 8px;
  opacity: 1;
  padding: 24px 24px 80px 24px;
  margin-bottom: 16px;
}
.tableCardunder {
  background: #ffffff;
  box-shadow: 0px 20px 50px 0px rgba(0, 0, 0, 0.02);
  border-radius: 8px 8px 8px 8px;
  opacity: 1;
  padding: 24px 24px 0px;
  margin-bottom: 16px;
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
}

.topSearch {
  position: absolute;
  top: 16px;
  right: 16px;
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
.roundCard {
  background: #ffffff;
  box-shadow: 0px 20px 50px 0px rgba(0, 0, 0, 0.02);
  border-radius: 8px 8px 8px 8px;
  margin-bottom: 16px;
  padding: 16px 24px;
}
.spanDataName {
  font-weight: 500;
  font-size: 18px;
  color: #000000;
  line-height: 24px;
  text-align: left;
  padding-bottom: 12px;
}
.showCount {
  cursor: pointer;
  min-width: 160px;
  max-height: 96px;
  margin-right: 16px;
  background: linear-gradient(180deg, #f2f4f8 0%, rgba(242, 244, 248, 0.4) 100%);
  border-radius: 8px 8px 8px 8px;
  opacity: 1;
  margin-bottom: 24px;
  padding: 16px;
  color: rgba(0, 0, 0, 0.9);
  .topcount {
    font-size: 32px;
    font-weight: 800;
    margin-bottom: 10px
  }

  .undercount {
    font-weight: 400;
    font-size: 14px;
    color: #7f8080;
  }
}

.bgblue {
  background: linear-gradient(180deg, #2258bb 0%, #4078e0 100%);
  color: #ffffff;

  .undercount {
    font-weight: 400;
    font-size: 14px;
    color: #bed1f4;
  }
}
.allcount {
  color: #ffffff;

  .undercount {
    font-weight: 400;
    font-size: 14px;
    color: #bed1f4;
  }
}

.tagStatus {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  vertical-align: middle;
  height: 24px;
  padding: 0 9px;
  font-size: 12px;
  line-height: 1;
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  box-sizing: border-box;
  white-space: nowrap;
}
</style>