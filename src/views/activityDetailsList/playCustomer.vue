<template>
  <div class="play-container">
    <div class="tableCard">
      <el-form :inline="true" style="margin-bottom: 0px">
        <el-form-item>
          <el-input
            v-model="params.search"
            placeholder="客户号/手机号/互金客户号"
            clearable
            :suffix-icon="Search"
          />
        </el-form-item>
        <el-form-item label="筛选日期：">
          <el-date-picker
            v-model="params.time"
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
            @click="() => handleDownLoad({ ...props, ...params })"
            >下载</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="customer-content">
      <el-table
        :data="tableData"
        style="width: 100% ----el-table-header-bg-color: #F2F4F8;--el-table-header-bg-color: #F2F4F8;--el-table-header-text-color:#333;"
      >
        <el-table-column
          v-for="(item, key) in pageHeaderMap"
          :label="item"
          :prop="key"
        >
          <template #default="{ row }">
            {{ statusEnay(row?.[key]) }}
          </template></el-table-column
        >
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

<script setup lang="ts">
import { dayjs } from "element-plus";
import { defineProps, watch, reactive, ref, onMounted } from "vue";
import * as API from "~/api/activity";
import { Search, Download } from "@element-plus/icons-vue";

const props = defineProps({
  activityId: String,
  playType: String,
  time: Array,
  playId: String,
});

const curTime = dayjs(new Date()).format("YYYY-MM-DD");
const params = reactive<any>({
  time: [new Date(`${curTime} 00:00:00`), new Date(`${curTime} 23:59:59`)],
  search: "",
});
const tableData = ref([]);
const total = ref(0);
const pageHeaderMap = ref({});
const pageNum = ref(1);

onMounted(async () => {
  fetchDataApi({ ...params, pageNum: 1 });
});
watch([params, props], () => fetchDataApi({ ...params, pageNum: 1 }));

const fetchDataApi = async (params: any) => {
  const { playType, ...propsValue } = props;
  const { time, ...value } = params;
  let startTime = null;
  let endTime = null;
  if (time) {
    startTime = dayjs(time?.[0] as any).format("YYYY-MM-DD HH:mm:ss");
    endTime = dayjs(time?.[1] as any).format("YYYY-MM-DD HH:mm:ss");
  }
  const res = await API.playCustomData({
    ...propsValue,
    startTime,
    endTime,
    ...value,
    pageSize: 10,
  });
  const { pageHeader, pageData } = res?.data;
  pageHeaderMap.value = pageHeader;
  tableData.value = pageData.records;
  total.value = pageData.total;
};

const handleCurrentChange = (val: any) => {
  pageNum.value = val;
  fetchDataApi({ ...params, pageNum: val });
};

const handleDownLoad = async (params: any) => {
  const { playType, time, ...value } = params;
  let startTime = null;
  let endTime = null;
  if (time.value) {
    startTime = dayjs(time.value?.[0] as any).format("YYYY-MM-DD HH:mm:ss");
    endTime = dayjs(time.value?.[1] as any).format("YYYY-MM-DD HH:mm:ss");
  }
  const res = await API.playCustomDataExport({
    startTime,
    endTime,
    ...value,
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

const statusEnay = (text: any) => {
  if (text || text === 0) {
    return text;
  } else {
    return "-";
  }
};
</script>

<style lang="scss" scoped>
.tableCard {
  background: #ffffff;
  box-shadow: 0px 20px 50px 0px rgba(0, 0, 0, 0.02);
  border-radius: 8px 8px 0px 0px;
  opacity: 1;
  padding: 24px 24px 20px 24px;
  margin-bottom: 0px;
}
.customer-content {
  background-color: white;
  height: calc(100% - 76px);
  padding: 0px 24px 24px;
  border-radius: 0 0 8px 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.pagination {
  margin-top: 24px;
  justify-content: flex-end;
}
.el-form-item {
  margin-bottom: 0;
  align-items: center;
  :deep(.el-select) {
    .el-select__wrapper {
      height: 40px;
    }
  }
  :deep(.el-form-item__label) {
    font-size: 14px;
  }
}
.play-container {
  height: calc(100% - 118px);
}
</style>
