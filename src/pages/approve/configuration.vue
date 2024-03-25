<template>
  <div class="approve-activity list-layout">
    <div class="title">审核配置列表</div>
    <div class="search">
      <el-form :inline="true" :model="pageParams">
        <el-form-item>
          <el-input
            v-model="pageParams.labelName"
            placeholder="审核流程名称"
            clearable
            :suffix-icon="Search"
          />
        </el-form-item>
      </el-form>
    </div>
    <div class="content">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="labelName" label="审核流程ID" width="458" />
        <el-table-column prop="labelValue" label="名称" width="491">
        </el-table-column>
        <el-table-column prop="labelValueType" label="审核层级" width="491">
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
      >
        <el-form-item label="审核流名称" prop="labelSource">
          <el-input :disabled="true" />
        </el-form-item>
        <el-form-item label="审核层级" prop="labelSource">
          <el-input :disabled="true" :model-value="formValues.domains.length" />
        </el-form-item>
        <el-form-item
          v-for="(domain, index) in formValues.domains"
          :key="index"
          :label="index + 1 + '级审核人'"
          :prop="'domains.' + index + '.value'"
          :rules="{
            required: true,
            message: '请选择审核人',
          }"
        >
          <el-select
            v-model="formValues.labelSource"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item of [
                { label: '通过', value: '1' },
                { label: '拒绝', value: '2' },
              ]"
              :label="item.label"
              :value="item.value"
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
import API from "~/api/customer";
import { checkStringEqual, debounce } from "~/utils/common";
import { Search, CirclePlusFilled } from "@element-plus/icons-vue";
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

const pageParams = reactive({
  labelName: "",
});

const defaultFormValues = {
  labelSource: "",
  domains: [{ value: '' }],
};
let formValues = reactive({ ...defaultFormValues });
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

const addDomain = () => {
  formValues.domains.push({
    value: '',
  })
}

const getData = async (params: any) => {
  try {
    let { ...values } = params;
    let res = await API.qryCustomLabel({
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
  if (type === DrawerType.Detail) {
    return;
  } else {
  }
  modalType.value = type;
  modalVisible.value = true;
};

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  try {
    await formEl.validate();
    console.log(formValues);
    // let res = await API.updateCustomLabel(formValues);
    // if (checkStringEqual(res?.code, 0)) {
    //   getData({ ...pageParams, pageNum: pageNum.value });
    //   modalVisible.value = false;
    // }
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
      background: rgba(64,120,224,0.1);
      border: 1px dashed rgba(0,0,0,0.2);
      color: #4078E0;
      justify-content: flex-start;
    }
    .el-icon {
      margin-right: 4px;
    }
  }
}
</style>
