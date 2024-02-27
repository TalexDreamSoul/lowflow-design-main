<template>
  <div class="customer-tag list-layout">
    <div class="title">客户标签列表</div>
    <div class="search">
      <el-form :inline="true" :model="pageParams">
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
          <el-select
            
            v-model="pageParams.labelSource"
            placeholder="来源"
            clearable
          >
            <el-option
              v-for="item of TAG_SOURCE"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            
            v-model="pageParams.labelName"
            placeholder="标签名称"
            clearable
            :suffix-icon="Search"
          />
        </el-form-item>
      </el-form>
      <el-button
        class="add"
        round
        type="primary"
        @click="handleModal(DrawerType.Create)"
        >批量导入</el-button
      >
    </div>
    <div class="content">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="labelName" label="标签名称" width="186" />
        <el-table-column prop="labelValue" label="标签值" width="229">
          <template #default="scope">
            <template v-if="scope.row.labelValue?.data?.length"
              >共{{ scope.row.labelValue?.data?.length }}个值：{{
                scope.row.labelValue?.data?.join?.("、")
              }}</template
            >
            <template v-if="!scope.row.labelValue?.data?.length">-</template>
          </template>
        </el-table-column>
        <el-table-column prop="labelValueType" label="标签数据类型" width="127">
          <template #default="scope">
            {{
              ATTR_FIELD_TYPE.find((v) =>
                checkStringEqual(v.value, scope.row.labelValueType)
              )?.label || "-"
            }}
          </template></el-table-column
        >
        <el-table-column
          prop="labelDesc"
          label="标签说明"
          width="391"
        ></el-table-column>
        <el-table-column prop="status" label="状态" width="101">
          <template #default="scope">
            <el-tag
              v-if="!!scope.row.status"
              :type="
                checkStringEqual(scope.row.status, ConfigStatus.Available)
                  ? ''
                  : 'info'
              "
              >{{
                checkStringEqual(scope.row.status, ConfigStatus.Available)
                  ? "可用"
                  : "已下线"
              }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="labelSource" label="来源" width="135">
          <template #default="scope">
            {{
              TAG_SOURCE.find((v) =>
                checkStringEqual(v.value, scope.row.labelSource)
              )?.label || "-"
            }}
          </template>
        </el-table-column>
        <el-table-column
          prop="updatedTime"
          label="更新时间"
          width="218"
        ></el-table-column>
        <el-table-column prop="coverRatio" label="覆盖度" width="151">
          <template #default="scope">
            {{ scope.row.coverRatio * 100 + "%" }}
          </template></el-table-column
        >
        <el-table-column label="操作" min-width="214">
          <template #default="scope">
            <el-button
              @click="handleSetStatus(scope.row)"
              link
              type="primary"
              class="action-btn"
              >{{
                checkStringEqual(scope.row.status, ConfigStatus.Available)
                  ? "下线"
                  : "上线"
              }}</el-button
            >
            <el-button
              link
              type="primary"
              class="action-btn"
              @click="handleModal(DrawerType.Edit, scope.row)"
              >编辑</el-button
            >
            <el-button
              :disabled="scope.row.labelSource !== TagSourceEnum.Market"
              link
              type="primary"
              class="action-btn"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
            <el-button
              @click="handleModal(DrawerType.Detail, scope.row)"
              link
              type="primary"
              class="action-btn"
              >查看详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next, sizes, jumper"
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
      :width="400"
    >
      <el-form
        v-if="checkStringEqual(modalType, DrawerType.Edit)"
        ref="formRef"
        :hide-required-asterisk="true"
        label-position="top"
        :model="formValues"
      >
        <el-form-item label="标签名称" prop="labelName">
          <el-input
            :disabled="true"
            
            v-model="formValues.labelName"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item label="标签说明" prop="labelDesc">
          <el-input
            
            v-model="formValues.labelDesc"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
      </el-form>
      <div
        class="tag-detail"
        v-if="checkStringEqual(modalType, DrawerType.Detail)"
      >
        <div class="desc">
          <div style="color: rgba(64, 120, 224, 1)">客户活跃度</div>
          <div>标签说明：根据客户启动APP的次数，对客户的活跃程度进行判断</div>
          <div>覆盖度：{{ modalData?.coverRatio * 100 }}% 覆盖132名客户</div>
        </div>
        <el-table
          :data="modalData?.labelValueCoverRatios || []"
          style="width: 100%"
        >
          <el-table-column prop="labelValue" label="标签值"></el-table-column>
          <el-table-column prop="count" label="覆盖人数" />
          <el-table-column prop="coverRatio" label="覆盖度">
            <template #default="scope">
              {{ scope.row.coverRatio * 100 + "%" }}
            </template></el-table-column
          >
        </el-table>
      </div>
      <div class="create" v-if="checkStringEqual(modalType, DrawerType.Create)">
        <el-upload
          ref="upload"
          class="upload-demo"
          action="/api/uploadCustomLabel"
          :limit="1"
          :on-exceed="handleExceed"
          :auto-upload="false"
        >
          <el-button style="width: 100%" type="primary">上传文件</el-button>
          <template #tip>
            <div class="el-upload__tip text-red">支持格式：csv xlsx</div>
          </template>
        </el-upload>
        <el-button
          @click="download"
          
          style="border-color: #4078e0; color: #4078e0"
          >下载上传格式模版</el-button
        >
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            v-if="modalType === DrawerType.Detail"
            
            round
            @click="modalVisible = false"
            >返回</el-button
          >
          <el-button
            v-if="modalType !== DrawerType.Detail"
            
            round
            @click="modalVisible = false"
            >取消</el-button
          >
          <el-button
            v-if="modalType === DrawerType.Edit"
            
            @click.prevent="onSubmit(formRef)"
            round
            type="primary"
            >保存</el-button
          >
          <el-button
            v-if="modalType === DrawerType.Create"
            
            @click.prevent="submitUpload"
            round
            type="primary"
            >上传</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, watch, onMounted } from "vue";
import {
  ConfigStatus,
  TAG_SOURCE,
  TagSourceEnum,
  ATTR_FIELD_TYPE,
} from "~/constants";
import API from "~/api/customer";
import { checkStringEqual, debounce } from "~/utils/common";
import { Search } from "@element-plus/icons-vue";
import { ElMessageBox, FormInstance, genFileId } from "element-plus";
import type { UploadInstance, UploadProps, UploadRawFile } from "element-plus";
import "element-plus/theme-chalk/el-message-box.css";

enum DrawerType {
  Create = "create",
  Detail = "detail",
  Edit = "edit",
}

const ModalTitleMap: any = {
  [DrawerType.Create]: "批量导入",
  [DrawerType.Detail]: "标签详情",
  [DrawerType.Edit]: "编辑标签",
};

const pageParams = reactive({
  labelName: "",
  labelSource: "",
  time: "",
});

const defaultFormValues = {
  labelName: "",
  labelDesc: "",
};
let formValues = reactive({ ...defaultFormValues });
let modalData = reactive<any>({});

const formRef = ref<FormInstance>();

const total = ref(0);
const tableData = ref<any[]>([]);
const modalVisible = ref(false);
const modalType = ref<any>(DrawerType.Create);
const upload = ref<UploadInstance>();

watch(
  pageParams,
  debounce(() => {
    getData({...pageParams, pageNum: 1});
  }, 200)
);

onMounted(() => {
  getData({...pageParams, pageNum: 1});
});

const currentChange = (value: number) => {
  getData({...pageParams, pageNum: value});
}

const handleExceed: UploadProps["onExceed"] = (files) => {
  upload.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value!.handleStart(file);
};

const submitUpload = () => {
  upload.value!.submit();
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
    let res = await API.qryCustomLabel({
      beginTime,
      endTime,
      ...values,
      pageSize: 10,
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
  if (type === DrawerType.Create) {
  } else if (type === DrawerType.Detail) {
    let res = await API.customLabelDetail({ id: values.id });
    if (checkStringEqual(res?.code, 0)) {
      total.value = res?.data?.total;
      Object.assign(modalData, res?.data);
    }
  } else {
    let { eventAttr, ...params } = values;
    Object.assign(formValues, {
      ...params,
      attrTableData: eventAttr?.attrs || [],
    });
  }
  modalType.value = type;
  modalVisible.value = true;
};

const handleSetStatus = async (values: any) => {
  let res = await API.updateCustomLabelStatus({
    id: values.id,
    status:
      ConfigStatus.Available === values.status
        ? ConfigStatus.Offline
        : ConfigStatus.Available,
  });
  if (checkStringEqual(res?.code, 0)) {
    getData(pageParams);
  }
};

const handleDelete = (values: any) => {
  ElMessageBox.alert("删除后将无法恢复", "确认删除", {
    showCancelButton: true,
    roundButton: true,
    cancelButtonClass: "pd-button",
    confirmButtonClass: "pd-button",
    customClass: "delete-modal",
  }).then(async () => {
    let res = await API.deleteCustomLabel({ id: values.id });
    if (checkStringEqual(res?.code, 0)) {
      getData(pageParams);
    }
  });
};

const download = async () => {
  let res = await API.downloadCustomLabelTemplate();
  let href = window.URL.createObjectURL(new Blob([res]));
  let downloadElement = document.createElement("a");
  downloadElement.href = href;
  downloadElement.download = '客户标签模版.xlsx';
  document.body.appendChild(downloadElement);
  downloadElement.click();
  document.body.removeChild(downloadElement);
  window.URL.revokeObjectURL(href);
};

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  try {
    await formEl.validate();
    let res = await API.updateCustomLabel(formValues);
    if (checkStringEqual(res?.code, 0)) {
      getData(pageParams);
      modalVisible.value = false;
    }
  } catch (error) {
    console.error(error);
  }
};
</script>

<style lang="scss">
@import "~/styles/list-layout.scss";

.customer-tag {
  .flex {
    gap: 16px;

    > div {
      flex: 1;
    }
  }
  .tag-detail {
    background-color: rgba(144, 160, 184, 0.1);
    padding: 24px;
    .desc {
      margin-bottom: 8px;
      > div {
        margin-bottom: 16px;
      }
    }
    .el-table {
      border-radius: 0;

      .el-table__cell {
        background-color: rgba(242, 244, 248, 1);
      }
    }
  }
  .el-upload {
    width: 100%;
  }
}
.add {
  background: linear-gradient(rgb(32, 92, 203) 0%, rgb(89, 143, 241) 100%);
  transition: 0.25s;
}
</style>
