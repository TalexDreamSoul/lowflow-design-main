<script setup lang="ts">
import { ref, unref, reactive, onMounted, watch } from "vue";
import dayjs from "dayjs";
import {
  getQryMaterial,
  setDeleteMaterial,
  setUpdateMaterialStatus,
} from "~/api/index";
import { useRouter, useRoute } from "vue-router";
import { Search } from "@element-plus/icons-vue";
import { ElMessageBox, ElMessage, ElTag } from "element-plus";
import CustomEventComponent from "~/components/CustomEventComponent.vue";
import { createTemplatePopover } from "~/utils/touch-templates";
import { materialType } from "~/utils/common";
import API from "~/api/channelManagement";
import { checkStringEqual, debounce } from "~/utils/common";
import DrawerSerach from "./drawerSerach.vue";

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
const background = ref(false);
const disabled = ref(false);
const time = ref(null);
const statusLabels = [
  { value: "eq", Text: "无误差", type: "success" },
  { value: "nq", Text: "有误差", type: "error" },
];
const value = ref();

function getNameByValue(data: any[], val: string) {
  const item = data.find((item: { value: any }) => item.value === val);
  return item ? item.name : "";
}

const materialTypeName = ref(getNameByValue(materialType, route.params.type));

console.log(materialTypeName); // 输出：短信
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
const delData = async (row: any) => {
  ElMessageBox.alert("删除后将无法恢复", "确认删除", {
    showCancelButton: true,
    roundButton: true,
    cancelButtonClass: "pd-button",
    confirmButtonClass: "pd-button",
    customClass: "delete-modal",
  }).then(async () => {
    let res = await setDeleteMaterial({
      id: row.id,
      status: row.status,
      type: formInline.type,
    });
    if (res?.code == 0) {
      fetchDataApi();
      ElMessage.success(res.message);
    }
  });
};
// 上线素材
const updateMaterialStatusData = async (row: any, status: String) => {
  let res = await setUpdateMaterialStatus({
    id: row.id,
    status: status,
    type: formInline.type,
  });
  if (res?.code == 0) {
    ElMessage.success(res.message);
    fetchDataApi();
  }
};

const detailsData = async (row: any) => {
  value.value = row;

  console.log(`output->row`, row);

  createTemplatePopover("模版详情", row.type, value, "details");

};

const addData = async () => {
  value.value = "";
  let name = "新建" + materialTypeName.value + "模版";
  createTemplatePopover(name, route.params.type, value);
};
const updateData = async (row: any) => {
  ElMessageBox.alert(
    `当前有${row.usedCount}个策略流程正在使用该模版（流程LC1、LC5、LC22正在使用），确认后该修改内容会更新至正在使用的流程中`,
    "确认编辑",
    {
      showCancelButton: true,
      roundButton: true,
      cancelButtonClass: "pd-button",
      confirmButtonClass: "pd-button",
      customClass: "delete-modal",
    }
  ).then(async () => {
    value.value = row;
    createTemplatePopover("编辑短信模版", "sms", value, "update");
  });
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
const drawerRef = ref<any>();
const pageParams = reactive({
  value: "",
  source: "",
});

const getData = async (params: any) => {
  try {
    let res = await API.qryNqTrsList({
      ...params,
      pageNum: 1,
      pageSize: 10,
    });
    if (checkStringEqual(res?.code, 0)) {
      total.value = res?.data?.total;
      tableData.value = res?.data?.records;
    }
  } catch (error) {
    console.error(error);
  }
};
const handleModaldrawer = async (values?: any) => {
  drawerRef.value?.handleModal?.(values);
};

function formatDate(value: number) {
  const format = "YYYY-MM-DD HH:mm";

  return dayjs(value).format(format);
}
</script>

<template>
  <CustomEventComponent title="交易对账" :tableData="tableData" :total="total">
    <template #search>
      <div class="search">
        <el-form :inline="true">
          <el-form-item label="创建时间：">
            <el-date-picker v-model="time" type="daterange" range-separator="To" start-placeholder="开始日期"
              end-placeholder="结束日期" :size="size" @change="changeTime" />
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
        <el-table-column label="交易日期" prop="trsDate">
          <template #default="{ row }">
            {{ formatDate(row.trsDate) }}
          </template>
        </el-table-column>
        <el-table-column label="校对时间" prop="checkDate">
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
              <el-link type="primary" v-if="scope.row.status == 'nq'"
                @click="handleModaldrawer(scope.row)">查看误差详情</el-link>
              <el-link @click="detailsData(scope.row)" v-else disabled>查看误差详情</el-link>
              <el-link type="primary" @click="updateData(scope.row)">重新校对</el-link>
            </el-space>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <template #pagination>
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" background
        layout="prev, pager, next, jumper" :page-sizes="[10]" :small="small" :disabled="disabled" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" class="pagination" />
    </template>
  </CustomEventComponent>
  <DrawerSerach ref="drawerRef" />
</template>


<style lang="scss" scoped>
@import "./material.scss";
</style>