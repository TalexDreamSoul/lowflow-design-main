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
  type: "digital",
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
const background = ref(false);
const disabled = ref(false);
const total = ref(110);

const StatisticsList = ref();
const totalCount = ref();

onMounted(async () => {
  getmarketingTouchNode();
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
const getmarketingTouchNode = async () => {
  const res = await getqryTouchStatusCount();
  StatisticsList.value = res;
  totalCount.value = StatisticsList.value.reduce(
    (accumulator: any, currentValue: { count: any }) =>
      accumulator + currentValue.count,
    0
  );
  console.log(totalCount); // 输出总和
  console.log(`output->res`, res);
};

const setSearchParams = () => {
  console.log(`output->`, formInline);
  fetchDataApi();
};

const delData = async (row: any) => {
  await setDeleteMaterial({
    id: row.id,
    status: row.status,
    type: formInline.type,
  }).finally(() => {});
};
// 上线素材
const startData = async (row: any) => {
  await setOnlineMaterial({
    id: row.id,
    status: row.status,
    type: formInline.type,
  }).finally(() => {});
  console.log(`output->上线素材`);
};

const pauseData = async (row: any) => {
  await setOfflineMaterial({ id: row.id }).finally(() => {});
};

const unlineData = async (row: any) => {
  await setOfflineMaterial({
    id: row.id,
    status: row.status,
    type: formInline.type,
  }).finally(() => {});
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
    <div class="pageTitle">企微模版列表</div>
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

      <el-table :data="tableData" style="width: 100% ----el-table-header-bg-color: #F2F4F8;--el-table-header-bg-color: #F2F4F8;">
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
        <el-table-column label="短信内容" width="180">
          <template #default="scope">
            {{ scope.row.content }}
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
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[100, 200, 300, 400]" :small="small" :disabled="disabled" :background="background" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" class="pagination" />

    </div>

  </div>
</template>
<style lang="scss" scoped>
.warp {
  background: linear-gradient(
    to bottom,
    #eeeff6,
    rgba(56, 128, 228, 0.1098039216)
  );
  padding: 24px 40px;
  height: 90vh;
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

.showCount {
  width: 100px;
  height: 50px;
  margin-right: 16px;

  background: linear-gradient(
    180deg,
    #f2f4f8 0%,
    rgba(242, 244, 248, 0.4) 100%
  );
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