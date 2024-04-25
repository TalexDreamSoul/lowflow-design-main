<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { Download } from "@element-plus/icons-vue";
import * as API from "~/api/activity";
import { dayjs } from "element-plus";

const curTime = dayjs(new Date()).format("YYYY-MM-DD");

const props = defineProps({
  activityId: String,
});
const time = ref([
  new Date(`${curTime} 00:00:00`),
  new Date(`${curTime} 23:59:59`),
]);
const tableData = ref([]);
const total = ref(0);
const pageHeaderMap = ref({});
const activityFormData = ref([]);
const interactId = ref("");
const pageNum = ref(1);

onMounted(async () => {
  fetchActivityForm();
});

watch([interactId, time], () => {
  pageNum.value = 1;
  fetchDataApi({ interactId: interactId.value, time: time.value, pageNum: 1 });
});

const fetchActivityForm = async () => {
  const res = await API.queryActivityForm({ activityId: props.activityId });
  activityFormData.value = res?.data;
  if (res?.data?.[0]?.interactId) {
    interactId.value = res?.data?.[0]?.interactId;
  }
};

const fetchDataApi = async (params: any) => {
  const { time, ...value } = params;
  let startTime = null;
  let endTime = null;
  if (time) {
    startTime = dayjs(time?.[0] as any).format("YYYY-MM-DD HH:mm:ss");
    endTime = dayjs(time?.[1] as any).format("YYYY-MM-DD HH:mm:ss");
  }
  const res = await API.getFormCustomData({
    startTime,
    endTime,
    ...value,
    pageSize: 10,
    activityId: props.activityId,
  });
  const { pageHeader, pageData } = res?.data;
  pageHeaderMap.value = pageHeader;
  tableData.value = pageData.records;
  total.value = pageData.total;
};

const handleCurrentChange = (val: number) => {
  pageNum.value = val;
  fetchDataApi({ pageNum: val, interactId: interactId.value });
};

const handleDownLoad = async () => {
  let startTime = null;
  let endTime = null;
  if (time.value) {
    startTime = dayjs(time.value?.[0] as any).format("YYYY-MM-DD HH:mm:ss");
    endTime = dayjs(time.value?.[1] as any).format("YYYY-MM-DD HH:mm:ss");
  }
  const res = await API.exportFormCustomData({
    startTime,
    endTime,
    interactId: interactId.value,
    activityId: props.activityId
  });
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
</script>

<template>
  <div class="warp">
    <div class="tableCard">
      <div>
        <el-form :inline="true" class="demo-form-inline">
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
          <el-form-item label="筛选日期：">
            <el-date-picker
              v-model="time"
              type="datetimerange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD HH:mm:ss"
              time-format="hh:mm:ss"
              :clearable="false"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              :icon="Download"
              class="primaryStyle"
              @click="handleDownLoad"
              >下载</el-button
            >
          </el-form-item>
        </el-form>
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
        :current-page="pageNum"
        background
        layout="prev, pager, next, jumper"
        :total="total"
        :page-sizes="[10]"
        @current-change="handleCurrentChange"
        class="pagination"
      />
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
