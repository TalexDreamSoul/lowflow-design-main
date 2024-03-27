<template>
  <div class="approve-activity list-layout">
    <div class="title">H5活动审核列表</div>
    <div class="search">
      <el-form :inline="true" :model="pageParams">
        <el-form-item>
          <el-select
            v-model="pageParams.playType"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="(item, key) in activities"
              :label="item"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="活动有效期">
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
    </div>
    <div class="content">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="activityId" label="H5活动ID" width="272" />
        <el-table-column prop="activityName" label="H5活动名称" width="291">
        </el-table-column>
        <el-table-column label="活动有效期" width="453">
          <template #default="scope">
            <div v-if="scope.row.activityBeginTime">
              <span
                >{{ scope.row.activityBeginTime }}至{{
                  scope.row.activityEndTime
                }}</span
              >
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="包含玩法" width="314">
          <template #default="scope">
            <div>
              <span v-if="!scope.row.playTypeList.length">-</span>
              <span v-for="(item, key) in scope.row.playTypeList">{{
                activities[item]
              }}</span>
            </div>
          </template></el-table-column
        >
        <el-table-column
          prop="creatorName"
          label="创建人"
          width="272"
        ></el-table-column>
        <el-table-column label="操作" min-width="238" fixed="right">
          <template #default="scope">
            <el-button
              link
              type="primary"
              class="action-btn"
              @click="handleModal(DrawerType.Detail, scope.row)"
              >查看详情</el-button
            >
            <el-button
              link
              type="primary"
              class="action-btn"
              @click="handleModal(DrawerType.ApproveDatail, scope.row)"
              >审核详情</el-button
            >
            <el-button
              :disabled="
                !checkStringEqual(appOptions?.user?.id, scope.row.auditorId)
              "
              @click="handleModal(DrawerType.Approve, scope.row)"
              link
              type="primary"
              class="action-btn"
              >审核</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next, jumper"
        :total="total"
        :page-sizes="[10]"
        @current-change="currentChange"
      />
    </div>
    <el-dialog
      class="pd-modal"
      destroy-on-close
      :close-on-click-modal="false"
      v-model="modalVisible"
      :title="ModalTitleMap[modalType]"
      :width="checkStringEqual(modalType, DrawerType.ApproveDatail) ? 800 : 400"
    >
      <el-form
        v-if="checkStringEqual(modalType, DrawerType.Approve)"
        ref="formRef"
        :hide-required-asterisk="true"
        label-position="top"
        :model="formValues"
      >
        <el-form-item
          label="审核意见"
          prop="approveStatus"
          :rules="[{ required: true, message: '请选择' }]"
        >
          <el-select
            v-model="formValues.approveStatus"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item of [
                { label: '通过', value: true },
                { label: '拒绝', value: false },
              ]"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <el-table
        :data="modalData"
        style="width: 100%"
        height="400"
        v-if="!checkStringEqual(modalType, DrawerType.Approve)"
      >
        <el-table-column prop="approveLevel" label="节点" width="92" />
        <el-table-column prop="auditorName" label="审核人" width="101">
        </el-table-column>
        <el-table-column prop="receiptTime" label="接收时间" width="231">
          <template #default="scope">
            {{ scope.row.receiptTime || "-" }}
          </template>
        </el-table-column>
        <el-table-column prop="approveStatus" label="审核状态" width="125">
          <template #default="scope">
            <el-tag v-if="scope.row.approveStatus === null" type="success"
              >待审批</el-tag
            >
            <el-tag v-if="scope.row.approveStatus === true" type=""
              >已通过</el-tag
            >
            <el-tag v-if="scope.row.approveStatus === false" type="danger"
              >未通过</el-tag
            >
          </template></el-table-column
        >
        <el-table-column prop="operationTime" label="操作时间" min-width="202">
          <template #default="scope">
            {{ scope.row.operationTime || "-" }}
          </template></el-table-column
        >
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            v-if="modalType === DrawerType.ApproveDatail"
            round
            @click="modalVisible = false"
            >返回</el-button
          >
          <el-button
            v-if="modalType !== DrawerType.ApproveDatail"
            round
            @click="modalVisible = false"
            >取消</el-button
          >
          <el-button
            v-if="modalType !== DrawerType.ApproveDatail"
            round
            type="primary"
            @click.prevent="onSubmit(formRef)"
            >确认</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, watch, onMounted, inject } from "vue";
import {} from "~/constants";
import API from "~/api/approve";
import { pageActivityList } from "~/api/activity";
import { checkStringEqual, debounce } from "~/utils/common";
import { Search } from "@element-plus/icons-vue";
import { FormInstance } from "element-plus";
import "element-plus/theme-chalk/el-message-box.css";

enum DrawerType {
  ApproveDatail = "approve-datail",
  Detail = "detail",
  Approve = "approve",
}

const activities: any = {
  "1": "问卷玩法",
  "2": "抽奖玩法",
  "3": "签到玩法",
  "4": "任务玩法",
  "5": "领奖玩法",
  "6": "表单组件",
};

const ModalTitleMap: any = {
  [DrawerType.ApproveDatail]: "审核详情",
  [DrawerType.Detail]: "",
  [DrawerType.Approve]: "活动流程审核",
};

const appOptions: any = inject("appOptions")!;

const pageParams = reactive({
  time: "",
  activityName: "",
  playType: "",
});

const defaultFormValues = {
  approveStatus: "",
};
let formValues = reactive({ ...defaultFormValues });
let modalData = reactive<any>([]);
const pageNum = ref(1);

const formRef = ref<FormInstance>();

const total = ref(0);
const tableData = ref<any[]>([]);
const modalVisible = ref(false);
const modalType = ref<any>(DrawerType.Detail);

watch(
  pageParams,
  debounce(() => {
    getData({ ...pageParams, pageNum: 1 });
  }, 200)
);

onMounted(() => {
  getData({ ...pageParams, pageNum: 1 });
});

const currentChange = (value: number) => {
  pageNum.value = value;
  getData({ ...pageParams, pageNum: value });
};

const getData = async (params: any) => {
  try {
    let { time, ...values } = params;
    let activityBeginTime;
    let activityEndTime;
    if (time) {
      activityBeginTime = time[0];
      activityEndTime = time[1];
    }
    let res: any = await pageActivityList({
      activityBeginTime,
      activityEndTime,
      ...values,
      pageSize: 10,
      activityStatus: 2,
    });
    if (checkStringEqual(res?.code, 0)) {
      total.value = res?.data?.total;
      tableData.value = res?.data?.records;
    }
  } catch (error) {
    console.error(error);
  }
};

const handleModal = async (type: string, values?: any) => {
  if (type === DrawerType.Detail) {
    window.open(values.diffuseUrl, "_blank");
    return;
  } else if (type === DrawerType.ApproveDatail) {
    let res: any = await API.listApproveRecord({
      businessId: values.activityId,
    });
    Object.assign(modalData, res?.data);
  } else {
    Object.assign(formValues, {
      recordId: values.approveRecordId,
      approveStatus: "",
    });
  }
  modalType.value = type;
  modalVisible.value = true;
};

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  try {
    await formEl.validate();
    let res: any = await API.approve({ ...formValues });
    if (checkStringEqual(res?.code, 0)) {
      getData({ ...pageParams, pageNum: pageNum.value });
      modalVisible.value = false;
    }
  } catch (error) {
    console.error(error);
  }
};
</script>

<style lang="scss">
@import "~/styles/list-layout.scss";
</style>
<style lang="scss" scoped>
.approve-activity {
  :deep(.pd-modal) {
    .el-table {
      border-radius: 0;

      .el-table__cell {
        background-color: rgba(242, 244, 248, 1);
      }
    }
  }
}
</style>
