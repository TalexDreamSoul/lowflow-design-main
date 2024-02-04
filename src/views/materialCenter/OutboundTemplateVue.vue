<script setup lang="ts">
import { ElTag } from "element-plus";
import { ref, unref, reactive, onMounted, watch } from "vue";
import dayjs from "dayjs";
import {
  getqryMaterial,
  setDeleteMaterial,
  getMaterialDetail,
  getupdateMarketingTouch,
  setOnlineMaterial,
  setOfflineMaterial,
} from "~/api/index";
import { useRouter, useRoute } from "vue-router";
const formInline = reactive({
  name: "",
  // type	素材类型：sms 短信，appPush app消息，digital 数字员工，outbound 智能外呼，znx 站内信
  type: "outbound",
  beginTime: "",
  endTime: "",
  status: "",
});
import { Search } from "@element-plus/icons-vue";
const time = ref(null);
const router = useRouter();
const statusLabels = {
  available: { Text: "可用", type: "info" },
  offline: { Text: "下线", type: "success" },
};
const typeMap = {
  immediately: "定时-单次",
  delayed: "定时-重复",
  trigger: "触发型",
};
let tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const small = ref(false);
const disabled = ref(false);
const total = ref(110);

const StatisticsList = ref();
const totalCount = ref();

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
  let res = await setDeleteMaterial({
    id: row.id,
    status: row.status,
    type: formInline.type,
  });

  if (res?.code == 0) {
    fetchDataApi();
  }
};
// 上线素材
const startData = async (row: any) => {
  let res = await setOnlineMaterial({
    id: row.id,
    status: row.status,
    type: formInline.type,
  });
  if (res?.code == 0) {
    fetchDataApi();
  }
  console.log(`output->上线素材`);
};

const pauseData = async (row: any) => {
  await setOfflineMaterial({ id: row.id }).finally(() => {});
};

const unlineData = async (row: any) => {
  let res = await setOfflineMaterial({
    id: row.id,
    status: row.status,
    type: formInline.type,
  });

  if (res?.code == 0) {
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
const addAction = () => {
  console.log(`output->tiaozhuan`, "designNew");
  router.push("designNew");
};
const handleSizeChange = (val: any) => {
  console.log(`${val} items per page`);
};
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
};
</script>

<template>
  <div class="warp">
    <div class="pageTitle">外呼模版列表</div>
    <div class="topSearch">
      <el-form :inline="true" class="demo-form-inline">
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
    <div class="tableCard">

      <el-table :data="tableData" >
        <el-table-column label="模版ID" width="180">
          <template #default="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="模版名称" width="180">
          <template #default="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="外呼话术模版" width="180">
          <template #default="scope">
            <el-popover effect="light" trigger="hover" placement="top" width="auto">
              <template #default>
                {{ scope.row.content }}
              </template>
              <template #reference>
                <div class="popover-reference">
                  {{ scope.row.content }}
                </div>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="180">
          <template #default="scope">
            <el-tag class="mx-1" :type="statusLabels[scope.row.status].type" effect="light">
              {{ statusLabels[scope.row.status].Text }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" width="280">
          <template #default="scope">
            {{ scope.row.updatedTime }}
          </template>
        </el-table-column>

        <el-table-column label="创建时间" width="180">
          <template #default="scope">
            {{ scope.row.createTime }}
          </template>
        </el-table-column>

        <el-table-column label="创建人" width="180">
          <template #default="scope">
            {{ scope.row.createBy }}
          </template>
        </el-table-column>

        <el-table-column label="正在使用" width="180">
          <template #default="scope">
            {{ scope.row.totalCount }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="280" fixed="right">
          <template #default="scope">
            <el-space wrap>

              <el-link type="primary" v-if="scope.row.status=='offline'" @click="startData(scope.row)">上线</el-link>
              <el-link type="primary" v-if="scope.row.status!=='offline'" @click="unlineData(scope.row)">下线</el-link>
              <el-link type="primary" @click="pauseData(scope.row)">编辑</el-link>
              <el-link type="primary" @click="delData(scope.row)">删除</el-link>
              <el-link type="primary" @click="detailsData(scope.row)">查看详情</el-link>
            </el-space>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[100, 200, 300, 400]" :small="small" :disabled="disabled" background layout="prev, pager, next, sizes, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" class="pagination" />

    </div>

  </div>
</template>
<style lang="scss">
@import './material.scss';

/* 组件的样式 */
</style>