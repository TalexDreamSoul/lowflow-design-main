<template>
  <div class="event list-layout">
    <div class="title">H5活动列表</div>
    <div class="search">
      <el-form :inline="true" :model="pageParams">
        <el-form-item>
          <el-select
            v-model="pageParams.playType"
            placeholder="玩法"
            @clear="clear"
            clearable
          >
            <el-option
              v-for="(item, key) in activities"
              :label="item"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="创建日期">
          <el-date-picker
            v-model="pageParams.time"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="pageParams.activityName"
            placeholder="H5活动名称"
            clearable
            :suffix-icon="Search"
          />
        </el-form-item>
      </el-form>
      <el-button class="add" round type="primary" @click="() => {}"
        >新建H5活动</el-button
      >
    </div>
    <div class="content">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="activityName" label="H5活动名称" />
        <el-table-column label="状态">
          <template #default="scope">
            <span>{{ activityStatus[scope.row.activityStatus] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="活动有效期">
          <template #default="scope">
            <div>
              <span
                >{{ scope.row.activityBeginTime }}至{{
                  scope.row.activityEndTime
                }}</span
              >
            </div>
          </template>
        </el-table-column>

        <el-table-column label="包含玩法">
          <template #default="scope">
            <div>
              <span v-if="!scope.row.playTypeList.length">-</span>
              <span v-for="(item, key) in scope.row.playTypeList">{{
                activities[item]
              }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="creatorName" label="创建人" />
        <el-table-column prop="creatorName" label="操作">
          <template #default="scope">
            <el-button link type="primary">编辑</el-button>
            <el-button link type="primary" @click="delTem(scope.row.activityId)">删除</el-button>
            <el-button link type="primary" @click="addTem(scope.row.activityId)">存为模板</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next, jumper"
        :total="total"
        v-model:current-page="pageParams.pageNum"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, watch, onMounted, watchEffect } from "vue";
import { pageActivityList,saveActivityTemplate } from "~/api/activity";
import dayjs from "dayjs";
import { Search } from "@element-plus/icons-vue";
import {  ElMessageBox ,ElMessage } from 'element-plus'
interface ActivityTypes {
  [key: string]: string;
}

const activities: ActivityTypes = {
  "1": "问卷玩法",
  "2": "抽奖玩法",
  "3": "签到玩法",
  "4": "任务玩法",
  "5": "领奖玩法",
  "6": "表单组件",
};

const activityStatus: ActivityTypes = {
  "1": "草稿",
  "2": "待审批",
  "3": "审核不通过",
  "4": "运行中",
  "5": "已结束",
};

const handleCurrentChange = (e:any) => {
  pageParams.pageNum = e;
  getActivityList();
  console.log(e);
};

let pageParams = reactive({
  pageNum: 1,
  pageSize: 10,
  time: "",
  activityBeginTime: "",
  activityEndTime: "",
  activityStatus: "",
  activityName: "",
  playType: "",
});

let tableData = ref([]);
let total = ref(0);
const getActivityList = async () => {
  const { data } = await pageActivityList(pageParams);
  tableData.value = data.records;
  total.value = data.total;
};
onMounted(() => {
  getActivityList();
});
const addTem = async(activityId:number) => {
  try {
      let res = await saveActivityTemplate({
        activityId,
        templateFlag:true
      });
      if (res) {
        console.log(res,'ppp');
        ElMessage.success("添加成功");
      }
    } catch (error) {
      console.log(error);
      ElMessage.error("添加失败");
    }
}
const delTem = async(activityId: number) => {
  ElMessageBox.alert('模板删除后将无法恢复', "确认删除", {
    showCancelButton: true,
    roundButton: true,
    cancelButtonClass: "pd-button",
    confirmButtonClass: "pd-button",
    customClass: "delete-modal",
  }).then(async () => {
    try {
      let res = await saveActivityTemplate({
        activityId,
        templateFlag:false
      });
      if (res) {
        console.log(res,'ppp');
        ElMessage.success("删除成功");
        pageParams.pageNum = 1;
        getActivityList();
      }
    } catch (error) {
      console.log(error);
      ElMessage.error("删除失败");
    }
    
  });
}
watch(
  () => pageParams.time,
  (newVal) => {
    if (newVal) {
      pageParams.activityBeginTime = dayjs(newVal[0]).format("YYYY-MM-DD");
      pageParams.activityEndTime = dayjs(newVal[1]).format("YYYY-MM-DD");
    } else {
      pageParams.activityBeginTime = "";
      pageParams.activityEndTime = "";
    }
    pageParams.pageNum = 1;
    getActivityList();
    console.log(newVal, "newVal");
  }
);
watch([() => pageParams.playType, () => pageParams.activityName], (newVal) => {
  pageParams.pageNum = 1;
  getActivityList();
  console.log(newVal, "newVal");
});

const clear = () => {
  pageParams.playType = "";
};
</script>

<style lang="scss">
@import "~/styles/list-layout.scss";

.event {
  .attr-content {
    margin-top: 24px;

    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      .text {
        font-size: 14px;
        font-weight: 400;
        line-height: 32px;
      }
    }

    .el-table {
      border-radius: 0;

      .el-table__cell {
        background-color: rgba(242, 244, 248, 1);
      }
    }
  }
}
.add {
  background: linear-gradient(rgb(32, 92, 203) 0%, rgb(89, 143, 241) 100%);
  transition: 0.25s;
}
</style>
