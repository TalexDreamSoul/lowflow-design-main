<template>
  <div class="approve-activity list-layout">
    <div class="title">审核配置列表</div>
    <div class="content">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="configId" label="审核流程ID" width="458" />
        <el-table-column prop="configName" label="名称" width="491">
        </el-table-column>
        <el-table-column prop="approveHierarchy" label="审核层级" width="491">
        </el-table-column>
        <el-table-column label="操作" min-width="400" fixed="right">
          <template #default="scope">
            <el-button
              link
              type="primary"
              class="action-btn"
              @click="handleModal(DrawerType.Edit, scope.row)"
              >编辑</el-button
            >
            <el-button
              link
              type="primary"
              class="action-btn"
              @click="handleModal(DrawerType.Detail, scope.row)"
              >查看详情</el-button
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
      :width="400"
    >
      <el-form
        ref="formRef"
        :hide-required-asterisk="true"
        label-position="top"
        :model="formValues"
        :disabled="checkStringEqual(modalType, DrawerType.Detail)"
      >
        <el-form-item label="审核流名称" prop="configName">
          <el-input v-model="formValues.configName" :disabled="true" />
        </el-form-item>
        <el-form-item label="审核层级">
          <el-input :disabled="true" :model-value="formValues.auditor.length" />
        </el-form-item>
        <el-form-item
          v-for="(domain, index) in formValues.auditor"
          :key="index"
          :prop="'auditor.' + index + '.auditorId'"
          :rules="{
            required: true,
            message: '请选择审核人',
          }"
        >
          <template #label>
            {{ index + 1 }}级审核人
            <a
              style="margin-left: 20px"
              v-if="modalType !== DrawerType.Detail"
              v-show="index > 0"
              @click.prevent="removeItem(index)"
              ><el-icon style="transform: translateY(2px)"><Delete /></el-icon
              >删除</a
            >
          </template>
          <el-select v-model="domain.auditorId" placeholder="请选择" clearable>
            <el-option
              v-for="item of peopleList"
              :label="item.accountName"
              :value="item.id + ''"
            />
          </el-select>
        </el-form-item>
        <el-button
          v-if="modalType !== DrawerType.Detail"
          class="add-people"
          @click="addDomain"
          ><el-icon><CirclePlusFilled /></el-icon>添加审核人</el-button
        >
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            v-if="modalType === DrawerType.Detail"
            round
            @click="onClose"
            >返回</el-button
          >
          <el-button
            v-if="modalType !== DrawerType.Detail"
            round
            @click="onClose"
            >取消</el-button
          >
          <el-button
            v-if="modalType !== DrawerType.Detail"
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
import { reactive, ref, watch, onMounted } from "vue";
import {} from "~/constants";
import API from "~/api/approve";
import { checkStringEqual, debounce } from "~/utils/common";
import { Delete, CirclePlusFilled } from "@element-plus/icons-vue";
import { FormInstance } from "element-plus";
import "element-plus/theme-chalk/el-message-box.css";

enum DrawerType {
  Detail = "detail",
  Edit = "edit",
}

const ModalTitleMap: any = {
  [DrawerType.Edit]: "查看审核详情",
  [DrawerType.Detail]: "查看审核详情",
};

const pageParams = reactive({});

const defaultFormValues: any = {
  configName: "",
  auditor: [],
};
let formValues = reactive({ ...defaultFormValues });
const pageNum = ref(1);

const formRef = ref<FormInstance>();

const total = ref(0);
const tableData = ref<any[]>([]);
const modalVisible = ref(false);
const modalType = ref<any>(DrawerType.Detail);
const peopleList = ref<any[]>([]);

watch(
  pageParams,
  debounce(() => {
    getData({ ...pageParams, pageNum: 1 });
  }, 200)
);

onMounted(() => {
  getPeopleList();
  getData({ ...pageParams, pageNum: 1 });
});

const currentChange = (value: number) => {
  pageNum.value = value;
  getData({ ...pageParams, pageNum: value });
};

const addDomain = () => {
  formValues.auditor.push({});
};

const removeItem = (index: number) => {
  formValues.auditor.splice(index, 1);
};

const getPeopleList = async () => {
  let res: any = await API.listAccount();
  peopleList.value = res?.data || [];
};

const getData = async (params: any) => {
  try {
    let { ...values } = params;
    let res: any = await API.pageApproveConf({
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
  Object.assign(formValues, values);
  modalType.value = type;
  modalVisible.value = true;
};

const onClose = () => {
  formValues.configName = "";
  formValues.auditor = [];
  modalVisible.value = false;
};

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  try {
    await formEl.validate();
    let { auditor, ...values } = formValues;
    let res: any = await API.updateApproveConf({
      ...values,
      approveHierarchy: auditor.length,
      auditor: auditor.map((v: any, i: any) => {
        return {
          auditorId: v.auditorId,
          auditorLevel: i + 1,
          auditorName: peopleList.value.find((item: any) =>
            checkStringEqual(item.id, v.auditorId)
          )?.accountName,
        };
      }),
    });
    if (checkStringEqual(res?.code, 0)) {
      getData({ ...pageParams, pageNum: pageNum.value });
      onClose();
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
    .add-people {
      margin-top: 2px;
      width: 100%;
      height: 40px;
      background: rgba(64, 120, 224, 0.1);
      border: 1px dashed rgba(0, 0, 0, 0.2);
      color: #4078e0;
      justify-content: flex-start;
    }
    .el-icon {
      margin-right: 4px;
    }
  }
}
</style>
