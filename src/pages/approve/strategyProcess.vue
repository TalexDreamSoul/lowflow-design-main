<template>
  <div class="approve-strategyProcess list-layout">
    <div class="title">策略流程审核列表</div>
    <div class="search">
      <el-form :inline="true" :model="pageParams">
        <el-form-item>
          <el-select v-model="pageParams.executeType" placeholder="请选择类型" clearable>
            <el-option v-for="(item, key) in typeMap" :label="item" :value="key" />
          </el-select>
        </el-form-item>
        <el-form-item label="起止日期">
          <el-date-picker v-model="pageParams.time" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="pageParams.touchName" placeholder="策略流程名称" clearable :suffix-icon="Search" />
        </el-form-item>
      </el-form>
    </div>
    <div class="content">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="策略流程ID" width="272" />
        <el-table-column prop="touchName" label="名称" width="291">
        </el-table-column>
        <el-table-column label="活动起止时间" width="453">
          <template #default="scope">
            {{ flowTime(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column label="类型" width="314">
          <template #default="scope">
            {{ typeMap[scope.row.executeType] }}
          </template></el-table-column>
        <el-table-column prop="createUserName" label="创建人" width="272"></el-table-column>
        <el-table-column label="操作" min-width="238" fixed="right">
          <template #default="scope">
            <el-button link type="primary" class="action-btn" @click="handleModal(DrawerType.Detail, scope.row)">查看详情</el-button>
            <el-button link type="primary" class="action-btn" @click="handleModal(DrawerType.ApproveDatail, scope.row)">审核详情</el-button>
            <el-button :disabled="
                !checkStringEqual(appOptions?.user?.id, scope.row.auditorId)
              " @click="handleModal(DrawerType.Approve, scope.row)" link type="primary" class="action-btn">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background layout="prev, pager, next, jumper" :total="total" :page-sizes="[10]" @current-change="currentChange" />
    </div>
    <el-dialog class="pd-modal" destroy-on-close :close-on-click-modal="false" v-model="modalVisible" :title="ModalTitleMap[modalType]" :width="checkStringEqual(modalType, DrawerType.ApproveDatail) ? 800 : 400">
      <el-form v-if="checkStringEqual(modalType, DrawerType.Approve)" ref="formRef" :hide-required-asterisk="true" label-position="top" :model="formValues">
        <el-form-item label="审核意见" prop="approveStatus" :rules="[{ required: true, message: '请选择' }]">
          <el-select v-model="formValues.approveStatus" placeholder="请选择" clearable>
            <el-option v-for="item of [
                { label: '通过', value: '1' },
                { label: '拒绝', value: '2' },
              ]" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <el-table :data="modalData" style="width: 100%" height="400" v-if="!checkStringEqual(modalType, DrawerType.Approve)">
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
            <el-tag v-if="scope.row.approveStatus === null" type="success">待审批</el-tag>
            <el-tag v-if="scope.row.approveStatus === true" type="">已通过</el-tag>
            <el-tag v-if="scope.row.approveStatus === false" type="danger">未通过</el-tag>
          </template></el-table-column>
        <el-table-column prop="operationTime" label="操作时间" min-width="202">
          <template #default="scope">
            {{ scope.row.operationTime || "-" }}
          </template></el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button v-if="modalType === DrawerType.ApproveDatail" round @click="modalVisible = false">返回</el-button>
          <el-button v-if="modalType !== DrawerType.ApproveDatail" round @click="modalVisible = false">取消</el-button>
          <el-button v-if="modalType !== DrawerType.ApproveDatail" round type="primary" @click.prevent="onSubmit(formRef)">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, watch, onMounted } from "vue";
import {} from "~/constants";
import API from "~/api/approve";
import { checkStringEqual, debounce } from "~/utils/common";
import { Search } from "@element-plus/icons-vue";
import { FormInstance } from "element-plus";
import "element-plus/theme-chalk/el-message-box.css";
import { getqryMarketingTouch } from "~/api";
import { useRouter } from "vue-router";
import { inject } from "vue";

const router = useRouter();

enum DrawerType {
  ApproveDatail = "approve-datail",
  Detail = "detail",
  Approve = "approve",
}

const ModalTitleMap: any = {
  [DrawerType.ApproveDatail]: "审核详情",
  [DrawerType.Detail]: "",
  [DrawerType.Approve]: "活动流程审核",
};

const appOptions: any = inject("appOptions")!;

const typeMap: any = {
  immediately: "定时-单次",
  repeat: "定时-重复",
  trigger: "触发型",
};

const pageParams = reactive({
  executeType: "",
  touchName: "",
  time: "",
});

const defaultFormValues = {
  approveStatus: "",
};
let formValues = reactive({ ...defaultFormValues });
const modalData = ref<any>([]);

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

const flowTime = (data: any) => {
  const _time = data.executeTime;
  // if (!_time) return "-";

  if (_time) {
    const s: Date = _time;

    return s.toLocaleString().replaceAll("/", "-");
  }

  // const [date1, date2] = _time;
  const { startTime, endTime } = data;
  if (!startTime || !endTime) return "-";

  const date1Text = startTime; //.toLocaleDateString().replaceAll("/", "-");
  const date2Text = endTime; //.toLocaleDateString().replaceAll("/", "-");

  return `${date1Text} 至 ${date2Text}`;
};

const currentChange = (value: number) => {
  pageNum.value = value;
  getData({ ...pageParams, pageNum: value });
};

const getData = async (params: any) => {
  try {
    let { time, ...values } = params;
    let beginTime;
    let endTime;
    if (time) {
      beginTime = time[0];
      endTime = time[1];
    }
    let res: any = await getqryMarketingTouch({
      beginTime,
      endTime,
      ...values,
      pageSize: 10,
      status: "approvalPending",
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
  modalData.value = [];
  if (type === DrawerType.Detail) {
    router.push(`/touchCenter/details/${values.id}`);
    return;
  } else if (type === DrawerType.ApproveDatail) {
    let res: any = await API.listApproveRecord({
      businessId: values.id,
    });
    modalData.value = res?.data;
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
.approve-strategyProcess {
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
