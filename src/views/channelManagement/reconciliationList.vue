<script setup lang="ts">
import { ref, unref, reactive, onMounted, watch } from "vue";
import dayjs from "dayjs";

import { useRouter, useRoute } from "vue-router";
import { Search } from "@element-plus/icons-vue";
import { ElMessageBox, ElMessage, ElTag } from "element-plus";
import CustomEventComponent from "~/components/CustomEventComponent.vue";

import API from "~/api/channelManagement";
import { checkStringEqual, debounce } from "~/utils/common";

// 使用 useRoute 获取当前路由信息
const route = useRoute();
// 通过 route.params 获取路由中的 type 参数
// const getType = route.params.type;
const formInline = reactive({
  startDate: "",
  endDate: "",
  status: "",
});

const tableData = ref([]); // 表格数据
const total = ref(100); // 总数

const currentPage = ref(1);
const pageSize = ref(10);
const small = ref(false);
const disabled = ref(false);
const time = ref(null);
const statusLabels = [
  { value: "eq", Text: "无误差", type: "success" },
  { value: "nq", Text: "有误差", type: "error" },
];
const value = ref();
const modalVisible = ref(false);

onMounted(async () => {
  fetchDataApi();
});

watch([currentPage, pageSize, formInline], () => {
  fetchDataApi();
});
const fetchDataApi = async () => {
  const res = await API.qryTrsCheckList({
    pageNum: unref(currentPage),
    pageSize: unref(pageSize),
    ...formInline,
  });
  tableData.value = res.data.records;
  total.value = res.data.total;
  console.log(`output->tabledata`, tableData.value);
};
const changeTime = (val: any) => {
  console.log(val, "change");
  if (val == null) {
    formInline.startDate = "";
    formInline.endDate = "";
  } else {
    formInline.startDate = dayjs(val[0]).format("YYYY-MM-DD");
    formInline.endDate = dayjs(val[1]).format("YYYY-MM-DD");
  }
};

const detailsData = async (row: any) => {
  value.value = row;
  modalVisible.value = true;
  console.log(`output->row`, row);
  getData(row);
};

const setignoreTrsRecord = async (params: any) => {
  ElMessageBox.alert("忽略后误差被删除将无法恢复", "确认忽略", {
    showCancelButton: true,
    roundButton: true,
    cancelButtonClass: "pd-button",
    confirmButtonClass: "pd-button",
    customClass: "delete-modal",
  }).then(async () => {
    let res = await API.ignoreTrsRecord({
      id: params.id,
      status: "ignore",
    });
    if (res?.code == 0) {
      ElMessage.success(res.message);
      getData();
    }
  });
  try {
  } catch (error) {
    console.error(error);
  }
};

const handleSizeChange = (val: any) => {
  console.log(`${val} items per page`);
};
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
};
const getStatusType = (status: string) => {
  const label = statusLabels.find((item) => item.value === status);
  return label ? label.type : ""; // 如果找到匹配的状态，则返回对应的类型值
};
const getStatusText = (status: string) => {
  const label = statusLabels.find((item) => item.value === status);
  return label ? label.Text : ""; // 如果找到匹配的状态，则返回对应的文本内容
};

const colmDatatotal = ref(0); // 总数
const colmData = ref([]); // 表格数据
const colmPage = ref(1);
const colmpageSize = ref(10);
const colmtrsDate = ref("");

const getData = async (params?: any) => {
  if (params.trsDate) colmtrsDate.value = formatDate(params.trsDate);
  try {
    let res = await API.qryNqTrsList({
      trsDate: colmtrsDate.value,
      pageNum: 1,
      pageSize: 10,
    });
    if (checkStringEqual(res?.code, 0)) {
      colmData.value = res?.data?.records;
      colmDatatotal.value = res?.data?.total;
      console.error(colmDatatotal, "colmDatatotal");
    }
  } catch (error) {
    console.error(error);
  }
};

function formatDate(value: number) {
  const format = "YYYY-MM-DD";

  return dayjs(value).format(format);
}
</script>

<template>
  <CustomEventComponent title="交易对账" :tableData="tableData" :total="total">
    <template #search>
      <div class="search">
        <el-form :inline="true">
          <el-form-item label="创建时间：">
            <el-date-picker v-model="time" type="daterange" range-separator="To" start-placeholder="开始日期" end-placeholder="结束日期" :size="size" @change="changeTime" />
          </el-form-item>
          <el-form-item>
            <el-select v-model="formInline.status" clearable style="width:200px" placeholder="校对结果">
              <el-option label="全部" value="" />
              <el-option label="一致" value="eq" />
              <el-option label="不一致" value="ne" />
            </el-select>
          </el-form-item>

        </el-form>
        <div>
          <el-button type="primary" class="add" @click="fetchDataApi()" round>重新发起所有误差请求</el-button>
        </div>
      </div>
    </template>
    <template #table="{ tableData }">

      <el-table :data="tableData">
        <el-table-column label="交易日期" prop="trsDate" width="200">
          <template #default="{ row }">
            {{ formatDate(row.trsDate) }}
          </template>
        </el-table-column>
        <el-table-column label="校对时间" prop="checkDate" width="200">
          <template #default="{ row }">
            {{ formatDate(row.checkDate) }}
          </template>
        </el-table-column>
        <el-table-column label="请求积分交易笔数" width="180" prop="reqPointsCount">
        </el-table-column>
        <el-table-column label="请求权益交易笔数" width="180" prop="reqEquityCount" />
        <el-table-column label="实际权益交易笔数" width="180" prop="reqEquitySuccessCount" />
        <el-table-column label="实际处理积分交易笔数" width="180" prop="reqPointsSuccessCount" />
        <el-table-column label="实际权益交易笔数" width="180" prop="status">
          <template #default="scope">
            <el-tag class="mx-1" :type="getStatusType(scope.row.status)" effect="light">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="scope">
            <el-space wrap>
              <el-link type="primary" @click="detailsData(scope.row)" :disabled="scope.row.status !== 'nq'">查看误差详情</el-link>
              <el-link type="primary" @click="fetchDataApi()">重新校对</el-link>
            </el-space>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <template #pagination>
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" background layout="prev, pager, next, jumper" :page-sizes="[10]" :small="small" :disabled="disabled" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" class="pagination" />
    </template>
  </CustomEventComponent>
  <el-drawer :destroy-on-close="true" :close-on-click-modal="false" :size="946" v-model="modalVisible" :with-header="false" class="pd-drawer">
    <div class="pd-drawer-header">误差详情</div>
    <div class=" pd-drawer-content">
      <el-table :data="colmData">
        <el-table-column label="请求ID" prop="id" width="200">

        </el-table-column>
        <el-table-column label="客户ID" prop="customId" width="200">

        </el-table-column>
        <el-table-column label="请求类型" width="180" prop="trsSourceType">
          <!-- touch 触达、h5 内容制作 -->
          <template #default="scope">
            {{ scope.row.trsSourceType=='touch'?'触达':'内容制作' }}
          </template>
        </el-table-column>
        <el-table-column label="请求内容" width="180" prop="trsContent" />
        <el-table-column label="数量" width="180" prop="trsCount" />
        <el-table-column label="请求来源" width="180" prop="trsSourceName" />
        <el-table-column label="请求时间" width="180" prop="trsDate">
          <template #default="{ row }">
            {{ formatDate(row.trsDate) }}
          </template>
        </el-table-column>
        <el-table-column label="误差原因" width="180" prop="trsChatContent">

        </el-table-column>
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="scope">
            <el-space wrap>
              <el-link type="primary" @click="getData()">重新发送请求</el-link>
              <el-link type="primary" @click="setignoreTrsRecord(scope.row)">忽略</el-link>
            </el-space>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="colmPage" v-model:page-size="colmpageSize" background layout="prev, pager, next, jumper" :page-sizes="[10]" :small="small" :disabled="disabled" :total="colmDatatotal" @size-change="handleSizeChange" @current-change="handleCurrentChange" class="pagination" />
    </div>
    <div class="pd-drawer-footer">
      <el-button @click="modalVisible = false" round>返回</el-button>
    </div>
  </el-drawer>
</template>


<style lang="scss" scoped>
@import "./material.scss";
</style>