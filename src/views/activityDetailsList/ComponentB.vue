<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { Download } from "@element-plus/icons-vue";
import * as API from "~/api/activity";
import * as echarts from "echarts/core";
import { FunnelChart } from "echarts/charts";
import { TooltipComponent, LegendComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { formatNumToThousandth } from '~/utils/common';

const props = defineProps({
  activityId: String,
});
const funnelChart = ref(null);
const tableData = ref([]);
const total = ref(0);
const pageHeaderMap = ref({});
const activityFormData = ref([]);
const interactId = ref("");

onMounted(async () => {
  fetchActivityForm();
  fetchDataApi({ pageNum: 1 });
});

watch(interactId, () => {
  formConversionData();
});

const fetchActivityForm = async () => {
  const res = await API.queryActivityForm({ activityId: props.activityId });
  activityFormData.value = res?.data;
  if (res?.data?.[0]?.interactId) {
    interactId.value = res?.data?.[0]?.interactId;
  }
};

const fetchDataApi = async (params: any) => {
  const res = await API.getClickButtonData({
    ...params,
    pageSize: 10,
    activityId: props.activityId,
  });
  const { pageHeader, pageData } = res?.data;
  pageHeaderMap.value = pageHeader;
  tableData.value = pageData.records;
  total.value = pageData.total;
};

const formConversionData = async () => {
  const res = await API.formConversionData({
    activityId: props.activityId,
    interactId: interactId.value,
  });
  const { activityUv, formUv } = res?.data;
  const chartData = [
    { value: activityUv +10, name: "浏览量人数UV" },
    { value: formUv +10, name: "表单提交人数" },
  ];

  const myChart = echarts.init(funnelChart.value);

  const option = {
    // tooltip: {
    //   trigger: "item",
    //   formatter: "{a} <br/>{b} : {c}%",
    // },
    legend: {
      data: ["浏览量人数UV", "表单提交人数"],
      bottom: 20
    },
    series: [
      {
        type: "funnel",
        width: "100%",
        top: 0,
        bottom: 50,
        right: 0,
        left: 0,
        label: {
          show: true,
          position: "inside",
          formatter: (params: any) => {
            return formatNumToThousandth(params.value - 10);
          },
          color: '#FFFFFF',
          fontSize: 28,
          fontWeight: 600
        },
        data: chartData,
      },
    ],
  };

  myChart.setOption(option);
};

const handleCurrentChange = (val: number) => {
  fetchDataApi({ pageNum: val });
};

const handleDownLoad = async () => {
  const res = await API.exportClickButtonData({ activityId: props.activityId });
  const fileNames = res?.headers
    .get("content-disposition")
    .split("filename=")[1];
  let url = window.URL.createObjectURL(new Blob([res?.data]));
  let a = document.createElement("a");
  a.href = url;
  a.download = decodeURI(fileNames);
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

onMounted(async () => {
  echarts.use([TooltipComponent, LegendComponent, FunnelChart, CanvasRenderer]);
});
</script>

<template>
  <div class="warp">
    <div class="tableCard">
      <div class="spanDataName">
        <span> 按钮点击数据 </span>&nbsp;
        <el-button
          type="primary"
          :icon="Download"
          class="primaryStyle"
          @click="handleDownLoad"
          >下载</el-button
        >
      </div>
      <el-table
        :data="tableData"
        style="width: 100% ----el-table-header-bg-color: #F2F4F8;--el-table-header-bg-color: #F2F4F8;--el-table-header-text-color:#333;"
      >
        <el-table-column
          v-for="(item, key) in pageHeaderMap"
          :label="item"
          :prop="key"
        ></el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next, jumper"
        :total="total"
        :page-sizes="[10]"
        @current-change="handleCurrentChange"
        class="pagination"
      />
    </div>
  </div>
  <div class="warp" v-if="!!activityFormData.length">
    <div class="tableCardunder">
      <div class="spanDataName"><span> 表单转化数据 </span>&nbsp;</div>

      <div>
        <el-form-item label="表单">
          <el-select
            v-model="interactId"
            placeholder="请选择"
            style="width: 300px"
          >
            <el-option
              v-for="item of activityFormData"
              :label="item.interactName"
              :value="item.interactId"
            />
          </el-select>
        </el-form-item>
        <div>
          <div ref="funnelChart" style="width: 428px; height: 400px"></div>
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
  background: linear-gradient(
    180deg,
    #f2f4f8 0%,
    rgba(242, 244, 248, 0.4) 100%
  );
  border-radius: 8px 8px 8px 8px;
  opacity: 1;
  margin-bottom: 24px;
  padding: 18px 16px 20px 16px;
  color: rgba(0, 0, 0, 0.9);
  .topcount {
    font-family: font1;
    font-size: 28px;
    font-weight: 800;
    margin-bottom: 5px;
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
