<script setup lang="ts">
import { ElTag } from "element-plus";
import { ref, unref, reactive, onMounted, watch } from "vue";
import {
  getqryMarketingTouch,
  deleteMarketingTouch,
  getqryTouchStatusCount,
  getupdateMarketingTouch,
  getstartMarketingTouch,
  getpauseMarketingTouch,
} from "~/api/index";
import { useRouter, useRoute } from 'vue-router';
const formInline = reactive({
  touchName: "",
  executeType: "",
  beginTime: "",
  endTime: "",
  status: "",
});

const time = ref(null);
const router = useRouter();

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
let tableData = ref([
  {
    id: "id",
    startTime: "2016-05-03",
    endTime: "2016-05-03",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
    status: "approvalPending",
    executeType: "immediately",
    total: "20%",
    totalCount: "19508313 / 10220792 / 1627356",
    founder: "lvlvlv",
  },
  {
    id: "id",
    startTime: "2016-05-03",
    endTime: "2016-05-03",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
    status: "approvalPending",
    executeType: "immediately",
    total: "20%",
    totalCount: "19508313 / 10220792 / 1627356",
    founder: "lvlvlv",
  },
  {
    id: "id",
    startTime: "2016-05-03",
    endTime: "2016-05-03",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
    status: "approvalSuccess",
    executeType: "immediately",
    total: "20%",
    totalCount: "19508313 / 10220792 / 1627356",
    founder: "lvlvlv",
  },
  {
    id: "id",
    startTime: "2016-05-03",
    endTime: "2016-05-03",
    name: "Tom",
    address: "No. 189, Grove St, Los Angeles",
    status: "waitStart",
    executeType: "immediately",
    total: "20%",
    totalCount: "19508313 / 10220792 / 1627356",
    founder: "lvlvlv",
  },
]);
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
watch([currentPage, pageSize], () => {
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
  await deleteMarketingTouch({ id: row.id }).finally(() => {});
};
const startData = async (row: any) => {
  await getstartMarketingTouch({ id: row.id }).finally(() => {});
};

const pauseData = async (row: any) => {
  await getpauseMarketingTouch({ id: row.id }).finally(() => {});
};

const updateData = async (row: any) => {
  await getpauseMarketingTouch({ id: row.id }).finally(() => {});
};
const detailsData = async (row: any) => {
  await getpauseMarketingTouch({ id: row.id }).finally(() => {});
};
const addAction = () => {
  console.log(`output->tiaozhuan`,'designNew')
  router.push('designNew');
};
const handleSizeChange = (val: any) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}

</script>

<template>
  <div class="warp">
    <div class="pageTitle">策略流程列表</div>
    <div class="topSearch">
      <el-form :inline="true" class="demo-form-inline">

        <el-form-item label="创建时间：">
          <el-date-picker v-model="time" type="daterange" range-separator="To" start-placeholder="开始日期" end-placeholder="结束日期" :size="size" @change="(val) => {
              formInline.beginTime = val[0];
              formInline.endTime = val[1];
            }" />
        </el-form-item>
        <el-form-item>

          <el-select v-model="formInline.executeType" clearable style="width:200px">
            <el-option label="定时-单次" value="immediately" />
            <el-option label="定时-重复" value="delayed" />
            <el-option label="触发型" value="trigger" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="formInline.touchName" placeholder="请输入策略流程名称" clearable style="width:200px" />
        </el-form-item>

      </el-form>
      <div>
        <router-link to="/designNew">
          <el-button type="primary" class="add" round>新建策略流程</el-button>
        </router-link>
      </div>
    </div>
    <div class="tableCard">
      <div class="countCard">
        <div class="showCount allcount">
          <div class="topcount">{{totalCount||'--'}}</div>
          <div class="undercount">全部</div>
        </div>
        <div class="showCount" v-for="item in StatisticsList">
          <div class="topcount">{{item.count||'--'}}</div>
          <div class="undercount"> {{ statusLabels[item.status].Text }}</div>
        </div>
      </div>
      <el-table :data="tableData" style="width: 100% ----el-table-header-bg-color: #F2F4F8;--el-table-header-bg-color: #F2F4F8;">
        <el-table-column label="策略流程ID" width="180">
          <template #default="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="名称" width="180">
          <template #default="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>

        <el-table-column label="状态" width="180">
          <template #default="scope">
            <el-tag class="mx-1" :type="statusLabels[scope.row.status].type" effect="light">
              {{ statusLabels[scope.row.status].Text }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="起止日期" width="280">
          <template #default="scope">
            {{ scope.row.startTime }}~{{ scope.row.endTime }}
          </template>
        </el-table-column>

        <el-table-column label="起止日期" width="180">
          <template #default="scope">
            {{ typeMap[scope.row.executeType] }}
          </template>
        </el-table-column>

        <el-table-column label="目标完成率" width="180">
          <template #default="scope">
            {{ scope.row.total }}
          </template>
        </el-table-column>

        <el-table-column label=" 累计进入 / 累计触发 / 累计目标完成" width="180">
          <template #default="scope">
            {{ scope.row.totalCount }}
          </template>
        </el-table-column>

        <el-table-column label="创建人" width="180">
          <template #default="scope">
            {{ scope.row.founder }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="280" fixed="right">
          <template #default="scope">
            <el-space wrap>
              <!-- 
              "draft": { Text: "草稿", type: 'info', }, 草稿
              "approvalPending": { Text: "待审批", type: 'success' }, 审批中
              "approvalSuccess": { Text: "审批成功", type: 'info', }, 运行中
              "approvalRefuse": { Text: "审批拒绝", type: 'warning', }, 审批不通过
              "waitStart": { Text: "等待启动", type: 'warning', },运行中
              "running": { Text: "发送中", type: '', },运行中
              "suspend": { Text: "暂停", type: 'warning', },暂停
              "done": { Text: "已结束", type: 'info', }结束 -->
              <el-link type="primary" v-if="scope.row.status=='suspend'" @click="startData(scope.row)">开始</el-link>
              <el-link type="primary" v-if="scope.row.status=='waitStart'||scope.row.status=='running'||scope.row.status=='approvalSuccess'" @click="pauseData(scope.row)">暂停</el-link>
              <el-link type="primary" v-if="scope.row.status=='draft'||scope.row.status=='approvalRefuse'||scope.row.status=='suspend'||scope.row.status=='done'" @click="delData(scope.row)">删除</el-link>
              <el-link type="primary">复制</el-link>
              <el-link type="primary" v-if="scope.row.status=='approvalRefuse'||scope.row.status=='draft'" @click="updateData(scope.row)">编辑</el-link>
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