<script setup lang="ts">
import { ref, unref, reactive, onMounted, watch } from "vue";
import dayjs from "dayjs";
import {
  getqryMaterial,
  setDeleteMaterial,
  setUpdateMaterialStatus,
} from "~/api/index";
import { useRouter, useRoute } from "vue-router";
import { Search } from "@element-plus/icons-vue";
import { ElMessageBox, ElMessage, ElTag } from "element-plus";
import CustomEventComponent from "./CustomEventComponent.vue";

const formInline = reactive({
  name: "",
  // type	素材类型：sms 短信，appPush app消息，digital 数字员工，outbound 智能外呼，znx 站内信
  type: "sms",
  beginTime: "",
  endTime: "",
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
const router = useRouter();
const StatisticsList = ref();
const totalCount = ref();
const statusLabels = {
  available: { Text: "可用", type: "success" },
  offline: { Text: "下线", type: "info" },
};
const typeMap = {
  immediately: "定时-单次",
  delayed: "定时-重复",
  trigger: "触发型",
};

onMounted(async () => {
  fetchDataApi();
});
watch([currentPage, pageSize, formInline], () => {
  fetchDataApi();
});

const fetchDataApi = async () => {
  const res = await getqryMaterial({
    pageNum: unref(currentPage),
    pageSize: unref(pageSize),
    ...formInline,
  });
  tableData.value = res.data.records;
  total.value = res.data.total;
  console.log(`output->tabledata`, tableData.value);
};

const setSearchParams = () => {
  console.log(`output->`, formInline);
  fetchDataApi();
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
  let res = await getMaterialDetail({
    id: row.id,
    status: row.status,
    type: formInline.type,
  });
};
const handleSizeChange = (val: any) => {
  console.log(`${val} items per page`);
};
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
};
</script>

<template>
  <div>
    <CustomEventComponent :title="'短信模版列表'" :tableData="tableData" :total="total">
      <template #search>
        <div class="search">
          <el-form :inline="true">
            <el-form-item label="创建时间：">
              <el-date-picker v-model="time" type="daterange" range-separator="To" start-placeholder="开始日期" end-placeholder="结束日期" :size="size" @change="(val) => {
                  formInline.beginTime =  dayjs(val[0]).format('YYYY-MM-DD');
                  formInline.endTime = dayjs(val[1]).format('YYYY-MM-DD');val[0];
                }" />
            </el-form-item>
            <el-form-item>
              <el-select v-model="formInline.status" clearable style="width:200px">
                <el-option label="可用" value="available" />
                <el-option label="下线" value="offline" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="formInline.name" placeholder="请输入短信模版名称" clearable style="width:200px" :suffix-icon="Search" />
            </el-form-item>

          </el-form>
          <div>
            <router-link to="/designNew">
              <el-button type="primary" class="add" round>新建短信模版</el-button>
            </router-link>
          </div>
        </div>
      </template>
      <template #table="{ tableData }">

        <el-table :data="tableData">
          <el-table-column label="模版ID" prop="id" />
          <el-table-column label="模版名称" prop="name" />
          <el-table-column label="状态">
            <template #default="scope">
              <el-tag class="mx-1" :type="statusLabels[scope.row.status].type?statusLabels[scope.row.status].type:'info'" effect="light">
                {{ statusLabels[scope.row.status].Text }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="更新时间" width="180" prop="updatedTime" />
          <el-table-column label="创建时间" width="180" prop="createTime" />
          <el-table-column label="创建人" prop="createBy" />
          <el-table-column label="正在使用" prop="usedCount">
            <template #default="scope">
              <span :style="scope.row.usedCount > 0 ? 'color: #00C068' : 'color: #333'">{{scope.row.usedCount}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="280" fixed="right">
            <template #default="scope">
              <el-space wrap>
                <el-link type="primary" v-if="scope.row.status=='offline'" @click="updateMaterialStatusData(scope.row,'available')">上线</el-link>
                <el-link type="primary" v-if="scope.row.status!=='offline'" @click="updateMaterialStatusData(scope.row,'offline')">下线</el-link>
                <el-link type="primary" @click="pauseData(scope.row)">编辑</el-link>
                <el-link type="primary" @click="delData(scope.row)">删除</el-link>
                <el-link type="primary" @click="detailsData(scope.row)">查看详情</el-link>
              </el-space>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template #pagination>
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[100, 200, 300, 400]" :small="small" :disabled="disabled" :background="background" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" class="pagination" />
      </template>
    </CustomEventComponent>
  </div>
</template>


<style lang="scss" scoped>
@import "./material.scss";
</style>