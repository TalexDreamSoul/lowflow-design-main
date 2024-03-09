<script setup lang="ts">
import { ref, unref, reactive, onMounted, watch } from "vue";
import {
  getqryMarketingTouch,
  deleteMarketingTouch,
  getqryTouchStatusCount,
  getstartMarketingTouch,
  getpauseMarketingTouch,
  updateMarketingTouchStatus,
  copyMarketingTouch
} from "~/api/index";
import { useRouter, useRoute } from "vue-router";
import { ElMessageBox, ElMessage, ElTag } from "element-plus";
import dayjs from "dayjs";

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
const tableData = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const small = ref(false);
const background = ref(false);
const disabled = ref(false);
const total = ref(110);

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
});

onMounted(async () => {
  getmarketingTouchNode();
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
const getmarketingTouchNode = async () => {
  const res = await getqryTouchStatusCount();
  StatisticsList.value = res.data;
  console.log(StatisticsList, "res");
};

const delData = async (row: any) => {
  ElMessageBox.alert("删除后将无法恢复", "确认删除", {
    showCancelButton: true,
    roundButton: true,
    cancelButtonClass: "pd-button",
    confirmButtonClass: "pd-button",
    customClass: "delete-modal",
  }).then(async () => {
    let res = await deleteMarketingTouch({ id: row.id }).finally(() => {});
    if (res?.code == 0) {
      fetchDataApi();
      getmarketingTouchNode();
      ElMessage.success(res.message);
    }
  });
};
const startData = async (row: any) => {
  await getstartMarketingTouch({ id: row.id }).finally(() => {});
  fetchDataApi();
  getmarketingTouchNode();
};

const pauseData = async (row: any) => {
  await getpauseMarketingTouch({ id: row.id }).finally(() => {});
  fetchDataApi();
  getmarketingTouchNode();
};

const updateData = async (row: any) => {
  router.push(`/design/${row.id}`);
};
const detailsData = async (row: any) => {
  router.push(`/strategyProcess/details/${row.id}`);
};

const successData = async (row: any) => {
  let res=await updateMarketingTouchStatus({
    id: row.id,
    status: "approvalSuccess",
  }).finally(() => {
    fetchDataApi();
    getmarketingTouchNode();
  });
  ElMessage.success(res.message)

};


const copyData = async (row: any) => {
  let res=await copyMarketingTouch({
    id: row.id,
  }).finally(() => {
    fetchDataApi();
    getmarketingTouchNode();
  });
  ElMessage.success(res.message)

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
</script>

<template>
  <div class="warp">
    <div class="pageTitle">策略流程列表</div>
    <div class="topSearch">
      <el-form :inline="true" class="demo-form-inline">

        <el-form-item label="创建时间：">
          <el-date-picker v-model="time" type="daterange" range-separator="To" start-placeholder="开始日期" end-placeholder="结束日期" :size="size" @change="changeTime" />
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
        <router-link to="/design">
          <el-button type="primary" class="add" round>新建策略流程</el-button>
        </router-link>
      </div>
    </div>
    <div class="tableCard">
      <div class="countCard">

        <!-- approvalPending
          approvalRefuse
          approvalSuccess
          done
          draft
          running
          suspend
          total
          waitStart -->

        <div class="showCount allcount">
          <div class="topcount">{{ StatisticsList.total !== undefined ? StatisticsList.total : '--' }}
          </div>
          <div class="undercount">全部</div>
        </div>
        <div class="showCount">
          <div class="topcount">
            {{ StatisticsList.running !== undefined ? StatisticsList.running : '--' }}
          </div>
          <div class="undercount">运行中</div>
        </div>
        <div class="showCount">
          <div class="topcount">
            {{ StatisticsList.suspend !== undefined ? StatisticsList.suspend : '--' }}
          </div>
          <div class="undercount">暂停中</div>
        </div>
        <div class="showCount">
          <div class="topcount">
            {{ StatisticsList.approvalPending !== undefined ? StatisticsList.approvalPending : '--' }}
          </div>
          <div class="undercount">待审批</div>
        </div>
        <div class="showCount">
          <div class="topcount">
            {{ StatisticsList.done !== undefined ? StatisticsList.done : '--' }}</div>
          <div class="undercount">已结束</div>
        </div>
        <div class="showCount">
          <div class="topcount">
            {{ StatisticsList.draft !== undefined ? StatisticsList.draft : '--' }}
          </div>
          <div class="undercount">草稿</div>
        </div>
        <div class="showCount">
          <div class="topcount">
            {{ StatisticsList.approvalRefuse !== undefined ? StatisticsList.approvalRefuse : '--' }}
          </div>
          <div class="undercount">审核不通过</div>
        </div>
      </div>
      <el-table :data="tableData" style="width: 100% ----el-table-header-bg-color: #F2F4F8;--el-table-header-bg-color: #F2F4F8;--el-table-header-text-color:#333;">
        <el-table-column label="策略流程ID" width="120">
          <template #default="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="名称" width="180" prop="touchName" />
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag class="mx-1" :type="statusLabels[scope.row.status].type" effect="light">
              {{ statusLabels[scope.row.status].Text }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="起止日期" width="330">
          <template #default="scope">
            {{ scope.row.startTime }}~{{ scope.row.endTime }}
          </template>
        </el-table-column>

        <el-table-column label="类型" width="150">
          <template #default="scope">
            {{ typeMap[scope.row.executeType] }}
          </template>
        </el-table-column>

        <el-table-column label="目标完成率" width="150">
          <template #default="scope">
            {{ scope.row.targetCount }}%
          </template>
        </el-table-column>

        <el-table-column label=" 累计进入 / 累计触达 / 累计目标完成" width="280">
          <template #default="scope">
            <!-- targetCount 完成目标数量
            touchCount 触达数量
            triggerCount 触发数量 -->
            {{ scope.row.touchCount }}/
            {{ scope.row.triggerCount }}/
            {{ scope.row.targetCount }}
          </template>
        </el-table-column>

        <el-table-column label="创建人" prop="createBy" />

        <el-table-column label="操作" width="300" fixed="right">
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
              <el-link type="primary" @click="copyData(scope.row)">复制</el-link>
              <el-link type="primary" v-if="scope.row.status=='approvalRefuse'||scope.row.status=='draft'" @click="updateData(scope.row)">编辑</el-link>
              <el-link type="primary" @click="detailsData(scope.row)">查看详情</el-link>
              <el-link type="primary" @click="successData(scope.row)">审核通过</el-link>
            </el-space>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[100, 200, 300, 400]" :small="small" :disabled="disabled" :background="background" layout="prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" class="pagination" />

    </div>

  </div>
</template>
<style lang="scss" scoped>
.warp {
  padding: 24px 40px;
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
  min-width: 150px;
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