<script setup lang="ts">
import { ref, unref, reactive, onMounted, watch } from "vue";

import { useRouter, useRoute } from "vue-router";
import { Search } from "@element-plus/icons-vue";
import {
  ElMessageBox,
  ElMessage,
  ElTag,
  FormInstance,
  UploadFile,
  UploadFiles,
} from "element-plus";
import CustomEventComponent from "~/components/CustomEventComponent.vue";
import Maskgroup from "~/assets/icon/Maskgroup.png";

import API from "~/api/channelManagement";
import { checkStringEqual, debounce } from "~/utils/common";
const action = `/api/uploadMaterialFile`;

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

interface StatusLabel {
  text: string;
  type: string;
}
const statusLabels : Record<string, StatusLabel>= {
  available: { text: "可用", type: "primary" },
  offline: { text: "已下线", type: "info" },
};
const getStatusType = (status: string) =>
  (statusLabels[status]?.type as
    | ""
    | "success"
    | "warning"
    | "info"
    | "danger") || "";
const getStatusText = (status: string) =>
  statusLabels[status]?.text || "其他状态";

const modalVisible = ref(false);
const EquityTypeList=[ 
    {label: "微信立减金", value: "1"}, 
    {label: "支付宝红包", value: "2"}, 
    {label: "京东E卡", value: "4"} 
]

onMounted(async () => {
  fetchDataApi();
});

watch(
  () => route.fullPath,
  (val) => {
    console.log(`output->val`, val);
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
  })as {code:any, message:any, data:any};
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
    let res = await API.deleteEquity({
      id: row.id,
      status: row.status,
    })as {code:any, message:any, data:any};
    if (res?.code == 0) {
      fetchDataApi();
      ElMessage.success(res.message);
    }
  });
};
function getCurrentDate() {
  const currentDate = new Date().toISOString().split("T")[0];
  return currentDate;
}
// 上线素材
const updateMaterialStatusData = async (row: any, status: String) => {
  let res = await API.updateEquityStatus({
    id: row.id,
    status: status,
  })as {code:any, message:any, data:any};
  if (res?.code == 0) {
    ElMessage.success(res.message);
    fetchDataApi();
  }
};

function addPic(
  response: any,
  uploadFile: UploadFile,
  uploadFiles: UploadFiles
) {

  // console.log("addPic", response, uploadFile, uploadFiles)
  formValues.equityImageUrl = response.data;
}


const handleModal = async (type: string, values?: any) => {
  if (type === DrawerType.Create) {
    for (const key in formValues) {
      formValues[key] = null;
    }
    Object.assign(formValues, defaultFormValues);
  } else if (type === DrawerType.Edit) {
    Object.assign(formValues, values);
  } else {

    let res = await API.equityDetail({
      id: values?.id,
      status: values?.status,
    }) as {code:any, message:any, data:any};
    if (!checkStringEqual(res?.code, 0)) return;
    Object.assign(formValues, res?.data);
  }
  modalType.value = type;
  modalVisible.value = true;
};
const handleSizeChange = (val: any) => {
  console.log(`${val} items per page`);
};
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
};
const formRef = ref<FormInstance>();
const onCancel = () => {
  for (const key in formValues) {
    formValues[key] = null;
  }
  modalVisible.value = false;
};

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  try {
    await formEl.validate();
    let res;
    if (modalType.value === DrawerType.Create) {
      res = await API.addEquity({
        ...formValues
      })as {code:any, message:any, data:any};
    } else {
      res = await API.updateEquity({
        ...formValues
      })as {code:any, message:any, data:any};
    }
    if (checkStringEqual(res?.code, 0)) {
      await fetchDataApi();
      onCancel();
    }
  } catch (error) {
    console.error(error);
  }
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
            <el-input v-model="formInline.equityName" placeholder="权益展示名称" clearable style="width:200px" :suffix-icon="Search" maxlength="50"/>
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
        <el-table-column label="权益展示名称" prop="equityName" />

        <el-table-column label="权益展示主图" prop="equityImageUrl">
          <template v-slot="{ row }">
            <!-- {{ row.equityName }} -->
            <!-- <br /> -->
            <el-image fit="contain" :src="row.equityImageUrl" />
          </template>
        </el-table-column>
        <el-table-column label="权益展示金额" width="180" prop="equityAmount">
          <template #default="scope">
            {{  scope.row.equityAmount }}米粒
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="usedCount">
          <template #default="scope">
            <el-tag class="mx-1" :type="getStatusType(scope.row.status)" effect="light">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="scope">
            <el-space wrap>
              <el-link type="primary" v-if="scope.row.status == 'offline'" @click="updateMaterialStatusData(scope.row, 'available')">上线</el-link>
              <el-link type="primary" v-if="scope.row.status !== 'offline'" @click="updateMaterialStatusData(scope.row, 'offline')">下线</el-link>
              <el-link type="primary" @click="handleModal(DrawerType.Edit, scope.row)">编辑</el-link>
              <el-link type="primary" @click="delData(scope.row)">删除</el-link>
              <el-link type="primary" @click="handleModal(DrawerType.Detail, scope.row)">查看详情</el-link>
            </el-space>
          </template>
        </el-table-column>

        <template #empty>
          <el-empty :image="Maskgroup" :image-size="76">
            <template #description>
              暂无数据
            </template>
          </el-empty>
        </template>
      </el-table>
    </template>
    <template #pagination>
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" background layout="prev, pager, next, jumper" :page-sizes="[10]" :small="small" :disabled="disabled" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" class="pagination" />
    </template>
  </CustomEventComponent>
  <el-dialog class="pd-modal" destroy-on-close :close-on-click-modal="false" v-model="modalVisible" :title="ModalTitleMap[modalType]">
    <el-form :disabled="checkStringEqual(modalType, DrawerType.Detail)" ref="formRef" :hide-required-asterisk="true" label-position="top" class="form" :model="formValues">

      <el-form-item :rules="[
    { required: true, message: '请输入商品编号' }
  ]" label="商品编号" prop="skuCode">
        <el-input v-model="formValues.skuCode" placeholder="请输入商品编号" clearable />
      </el-form-item>

      <el-form-item :rules="[
    { required: true, message: '请输入权益展示名称' },
    {
      pattern: /^[\u4e00-\u9fa5a-zA-Z_\d]{1,18}$/,
      message: '仅支持数字、汉字、字母、下划线，不超过18个字符',
    },
  ]" label="权益展示名称" prop="equityName">
        <el-input v-model="formValues.equityName" placeholder="请输入权益展示名称" clearable maxlength="50"/>
      </el-form-item>
      <el-form-item :rules="[{ required: true, message: '请输入权益展示主图' }]" label="权益展示主图" prop="equityImageUrl">
        <div style="width: 100%;">
          <el-upload   :action="action" :on-success="addPic" :auto-upload="true" :data="{ type: 'material', date: getCurrentDate() }" :show-file-list="false"
          >
          <el-image fit="contain"  v-if="formValues.equityImageUrl" class="equityImageUrl" :src="formValues.equityImageUrl" alt=""/>
        
          <div v-if="!checkStringEqual(modalType, DrawerType.Detail)" class="upload-demo button-groupupload">

            <el-text type="primary" style="cursor: pointer">
              <span v-if="!formValues.equityImageUrl">
                <el-icon size="14">
                  <CirclePlusFilled />
                </el-icon>
                添加图片
              </span>
              <span v-else>
                重新上传
              </span>
              </el-text>
          </div>
          </el-upload>
          <div class="desc"> 只能上传jpg/png文件，且不超过500kb</div>
        </div>
        <!-- <el-input v-model="formValues.equityImageUrl" placeholder="请输入权益展示主图" clearable /> -->
      </el-form-item>

      <el-form-item :rules="[{ required: true, message: '请输入权益展示金额（米粒）' }]" label="权益展示金额（米粒）" prop="equityAmount">
        <el-input type="number" v-model="formValues.equityAmount" placeholder="请输入权益展示金额（米粒）" clearable />
      </el-form-item>

      <el-form-item :rules="[{ required: true, message: '请输入权益类别' }]" label="权益类别" prop="equityType">
        <el-select v-model="formValues.equityType" placeholder="请选择权益类别"  clearable>
          <el-option
            v-for="item of EquityTypeList"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :rules="[{ required: true, message: '请输入权益规则' }]" label="权益规则" prop="equityRule">
        <el-input v-model="formValues.equityRule" placeholder="请输入权益规则" type="textarea" clearable :row="5" />
      </el-form-item>

    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button v-if="modalType === DrawerType.Detail" round @click="modalVisible = false">返回</el-button>
        <el-button v-if="modalType !== DrawerType.Detail" round @click="modalVisible = false">取消</el-button>
        <el-button v-if="modalType !== DrawerType.Detail" @click.prevent="onSubmit(formRef)" round type="primary">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>


<style lang="scss" scoped>
@import "./material.scss";
.button-groupupload {
  padding: 5px 12px;
  background: #ecf1fc;
  align-items: center;
  border-radius: 4px;
  border: 1px dashed #b3aaaa;
  margin: 12px 0;
  cursor: pointer;

}
.desc{
font-weight: 400;
font-size: 14px;
color: rgba(0,0,0,0.4);
line-height: 16px;
text-align: left;
}
.equityImageUrl{
  width: 160px;
height: 120px;
border-radius: 8px 8px 8px 8px;
margin-right: 12px;
}
</style>