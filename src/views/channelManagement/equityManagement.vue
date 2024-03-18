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

// 使用 useRoute 获取当前路由信息
const route = useRoute();
// 通过 route.params 获取路由中的 type 参数
// const getType = route.params.type;
const formInline = reactive({
  equityName: "",
  // type	素材类型：sms 短信，appPush app消息，digital 数字员工，outbound 智能外呼，znx 站内信
  type: route.params.type,
  status: "",
});
enum DrawerType {
  Create = "create",
  Detail = "detail",
  Edit = "edit",
}
const modalType = ref<any>(DrawerType.Create);

const ModalTitleMap: any = {
  [DrawerType.Create]: "新增权益",
  [DrawerType.Detail]: "权益详情",
  [DrawerType.Edit]: "编辑权益",
};
const defaultFormValues = {

  equityAmount: "",
  equityImageUrl: "",
  equityName: "",
  equityRule: "",
  equityType: "",
  skuCode: "",
};

let formValues = reactive<any>({ ...defaultFormValues });
const tableData = ref([]); // 表格数据
const total = ref(100); // 总数
const currentPage = ref(1);
const pageSize = ref(10);
const small = ref(false);
const background = ref(false);
const disabled = ref(false);
const time = ref(null);
const statusLabels = {
  available: { Text: "可用", type: "success" },
  offline: { Text: "下线", type: "info" },
};
const modalVisible = ref(false);

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

watch(
  () => route.fullPath,
  (val) => {
    console.log(`output->val`, val);
    materialTypeName.value = getNameByValue(materialType, route.params.type);
    formInline.type = route.params.type;
    fetchDataApi();
  }
);
watch([currentPage, pageSize, formInline], () => {
  fetchDataApi();
});
const fetchDataApi = async () => {
  const res = await API.qryEquityList({
    pageNum: unref(currentPage),
    pageSize: unref(pageSize),
    ...formInline,
  });
  tableData.value = res.data.records;
  total.value = res.data.total;
  console.log(`output->tabledata`, tableData.value);
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
  // createTemplatePopover('新建企微模版', 'digital')
  // createTemplatePopover('新建站内信模版', 'znx', value)
  console.log(`output->row`, row)
  let name = `${materialTypeName}模版详情`
  createTemplatePopover(
    "模版详情",
    row.type,
    value,
    "details"
  );
  // createTemplatePopover('新建APP Push模版', 'app')
  // createTemplatePopover('新建外呼模版', 'outbound')
};
let modalData = reactive<any>({});

const handleModal = async (type: string, values?: any) => {
  if (type === DrawerType.Create) {
    for (const key in formValues) {
      formValues[key] = null;
    }
    Object.assign(formValues, defaultFormValues);
  } else if (type === DrawerType.Edit) {
    Object.assign(formValues, values);
  } else {
    let res = await API.equityDetail({ id: values?.id, status: values?.status });
    if (!checkStringEqual(res?.code, 0)) return;
    Object.assign(modalData, res?.data);
  }
  modalType.value = type;
  modalVisible.value = true;
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
</script>

<template>
  <CustomEventComponent title="权益管理" :tableData="tableData" :total="total">
    <template #search>
      <div class="search">
        <el-form :inline="true">
          <el-form-item>
            <el-select v-model="formInline.status" clearable style="width:200px" placeholder="权益状态">
              <el-option label="全部" value="" />
              <el-option label="可用" value="available" />
              <el-option label="下线" value="offline" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="formInline.equityName" placeholder="权益展示名称" clearable style="width:200px"
              :suffix-icon="Search" />
          </el-form-item>

        </el-form>
        <div>
          <el-button type="primary" class="add" @click="handleModal(DrawerType.Create)" round>新建权益</el-button>
        </div>
      </div>
    </template>
    <template #table="{ tableData }">

      <el-table :data="tableData">
        <el-table-column label="权益ID" prop="id" />
        <el-table-column label="权益编号" prop="skuCode" />
        <el-table-column label="权益展示名称" prop="equityName">
          <template v-slot="{ row }">
            <!-- {{ row.equityName }} -->
            <!-- <br /> -->
            <el-image style="width: 40px;height: 40px" :src="row.equityImageUrl" />
          </template>
        </el-table-column>
        <el-table-column label="权益展示金额" width="180" prop="equityAmount" />
        <el-table-column label="状态" prop="usedCount">
          <template #default="scope">
            <el-tag class="mx-1"
              :type="statusLabels[scope.row.status].type ? statusLabels[scope.row.status].type : 'info'" effect="light">
              {{ statusLabels[scope.row.status].Text }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="scope">
            <el-space wrap>
              <el-link type="primary" v-if="scope.row.status == 'offline'"
                @click="updateMaterialStatusData(scope.row, 'available')">上线</el-link>
              <el-link type="primary" v-if="scope.row.status !== 'offline'"
                @click="updateMaterialStatusData(scope.row, 'offline')">下线</el-link>
              <el-link type="primary" @click="handleModal(DrawerType.Edit, scope.row)">编辑</el-link>
              <el-link type="primary" @click="delData(scope.row)">删除</el-link>
              <el-link type="primary" @click="handleModal(DrawerType.Detail, scope.row)">查看详情</el-link>
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
  <el-dialog class="pd-modal" destroy-on-close :close-on-click-modal="false" v-model="modalVisible"
    :title="ModalTitleMap[modalType]">
    <el-form :disabled="checkStringEqual(modalType, DrawerType.Detail)" ref="formRef" :hide-required-asterisk="true"
      label-position="top" class="form" :model="formValues">
      <el-form-item :rules="[
    { required: true, message: '请输入权益名称' },
    {
      pattern: /^[\u4e00-\u9fa5a-zA-Z_\d]{1,18}$/,
      message: '仅支持数字、汉字、字母、下划线，不超过18个字符',
    },
  ]" label="权益名称" prop="equityName">
        <el-input v-model="formValues.equityName" placeholder="请输入权益名称" clearable />
      </el-form-item>
      <el-form-item :rules="[{ required: true, message: '请输入权益金额	' }]" label="权益金额	" prop="equityAmount">
        <el-input v-model="formValues.equityAmount" placeholder="请输入权益金额" clearable />
      </el-form-item>
      <el-form-item :rules="[{ required: true, message: '请输入互金客户号' }]" label="互金客户号" prop="itFinCode">
        <el-input v-model="formValues.itFinCode" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item :rules="[{ required: true, message: '请输入权益图片链接' }]" label="权益图片链接" prop="equityImageUrl">
        <el-input v-model="formValues.equityImageUrl" placeholder="请输入权益图片链接" clearable />
      </el-form-item>
      <el-form-item :rules="[{ required: true, message: '请输入权益规则' }]" label="权益规则" prop="equityRule">
        <el-input v-model="formValues.equityRule" placeholder="请输入权益规则" clearable />
      </el-form-item>
      <el-form-item :rules="[{ required: true, message: '请输入权益类型' }]" label="权益类型" prop="equityType">
        <el-input v-model="formValues.equityType" placeholder="请输入权益类型" clearable />
      </el-form-item>

    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button v-if="modalType === DrawerType.Detail" round @click="modalVisible = false">返回</el-button>
        <el-button v-if="modalType !== DrawerType.Detail" round @click="modalVisible = false">取消</el-button>
        <el-button v-if="modalType !== DrawerType.Detail" @click.prevent="onSubmit(formRef)" round
          type="primary">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>


<style lang="scss" scoped>
@import "./material.scss";
</style>