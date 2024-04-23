<script setup lang="ts">
import { ref, unref, reactive, onMounted, watch } from "vue";
import API from "~/api/account";
import { useRouter, useRoute } from "vue-router";
import { Search } from "@element-plus/icons-vue";
import { ElMessageBox, ElMessage, FormInstance } from "element-plus";
import CustomEventComponent from "~/components/CustomEventComponent.vue";
import { checkStringEqual, debounce } from "~/utils/common";
import Maskgroup from "~/assets/icon/Maskgroup.png";

// 通过 route.params 获取路由中的 type 参数
// const getType = route.params.type;
const formInline = reactive({
  accountName: "",
  roleId: "",
});
const tableData = ref([]); // 表格数据
const RoleList = ref([]); // 权限列表
const total = ref(100); // 总数
const currentPage = ref(1);
const pageSize = ref(10);
const small = ref(false);
const disabled = ref(false);

enum DrawerType {
  Create = "create",
  Edit = "edit",
}
const ModalTitleMap: any = {
  [DrawerType.Create]: "新建用户",
  [DrawerType.Edit]: "编辑用户",
};

const defaultFormValues = {
  accountName: "",
  accountPassword: "",
  email: "",
  phone: "",
  roleId: "",
};
let formValues = reactive<any>({ ...defaultFormValues });
const modalVisible = ref(false);
const modalType = ref<any>(DrawerType.Create);
const formRef = ref<FormInstance>();

onMounted(async () => {
  fetchDataApi();
  fetchRoleList();
});

watch([currentPage, pageSize, formInline], () => {
  fetchDataApi();
});

const fetchRoleList = async () => {
  const res = await API.qryRoleList({
    pageNum: 1,
    pageSize: 999,
    roleName: "",
  });
  RoleList.value = res.data.records;
  console.log(`output->RoleList`, RoleList.value);
};
const fetchDataApi = async () => {
  const res = await API.qryAccountList({
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
    let res = await API.deleteAccount({
      ...row,
    });
    if (res?.code == 0) {
      fetchDataApi();
      ElMessage.success(res.message);
    }
  });
};

const handleSizeChange = (val: any) => {
  console.log(`${val} items per page`);
};
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
};

const fetchaccountDetail = async (id?: any) => {
  console.log(`output->id`, id);
  const res = await API.accountDetail(id);
  Object.assign(formValues, res.data);
  console.log(`output->tabledata`, formValues.value);
};
const handleModal = async (type: string, values?: any) => {
  if (type === DrawerType.Create) {
    for (const key in formValues) {
      formValues[key] = null;
    }
    Object.assign(formValues, defaultFormValues);
  } else if (type === DrawerType.Edit) {
    // fetchaccountDetail(values.id)
    Object.assign(formValues, values);
  }
  modalType.value = type;
  modalVisible.value = true;
};
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  try {
    await formEl.validate();
    let res = { code: "0000" };
    let values = {
      ...formValues,
    };
    if (modalType.value === DrawerType.Create) {
      res = await API.addAccount(values);
    } else {
      res = await API.updateAccount(values);
    }
    if (checkStringEqual(res?.code, 0)) {
      fetchDataApi();
      modalVisible.value = false;
    }
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <CustomEventComponent title="用户管理" :tableData="tableData" :total="total">
    <template #search>
      <div class="search">
        <el-form :inline="true">
          <el-form-item>
            <el-select v-model="formInline.roleId" clearable style="width:200px" placeholder="用户角色">
              <el-option v-for="item in RoleList" :label="item.roleName" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="formInline.accountName" placeholder="用户名" clearable style="width:200px" :suffix-icon="Search" />
          </el-form-item>

        </el-form>
        <div>
          <el-button type="primary" class="add" @click="handleModal(DrawerType.Create)" round>新建用户</el-button>
        </div>
      </div>
    </template>
    <template #table="{ tableData }">

      <el-table :data="tableData">
        <el-table-column label="用户ID" prop="id" />
        <el-table-column label="用户名" prop="accountName" />
        <el-table-column label="用户角色" prop="roleName" />
        <el-table-column label="联系电话" width="180" prop="phone" />
        <el-table-column label="联系邮箱" width="180" prop="email" />
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="scope">
            <el-space wrap>
              <el-link type="primary" @click="handleModal(DrawerType.Edit, scope.row)">编辑</el-link>
              <!-- <el-link type="primary" @click="delData(scope.row)">删除</el-link> -->
              <!-- <el-link type="primary" @click="detailsData(scope.row)">重置密码</el-link> -->
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

  <el-dialog width="350" destroy-on-close :close-on-click-modal="false" v-model="modalVisible" :title="ModalTitleMap[modalType]">
    <el-form ref="formRef" :hide-required-asterisk="true" label-position="top" class="form" :model="formValues">
      <el-form-item :rules="[
            { required: true, message: '请输入用户名' },
            {
              pattern: /^[\u4e00-\u9fa5a-zA-Z_\d]{1,18}$/,
              message: '仅支持数字、汉字、字母、下划线，不超过18个字符',
            },
          ]" label="用户名" prop="accountName">
        <el-input v-model="formValues.accountName" style="width:300px" placeholder="请输入" clearable maxlength="50"/>
      </el-form-item>
      <el-form-item v-if="modalType === DrawerType.Create" prop="accountPassword" label="用户密码" :rules="[
        { required: true, message: '请输入用户密码' },
        {
          pattern: /^[\u4e00-\u9fa5a-zA-Z_\d]{1,18}$/,
          message: '仅支持数字、汉字、字母、下划线，不超过18个字符',
        },
      ]">
        <el-input v-model="formValues.accountPassword" style="width:300px" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item prop="roleId" label="用户角色" :rules="[
        { required: true, message: '请选择用户角色' },
      ]">
        <el-select v-model="formValues.roleId" clearable style="width:300px" placeholder="用户角色" name="roleId" tabindex="2" autocomplete="on">
          <el-option v-for="item in RoleList" :label="item.roleName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item :rules="[
        {
          pattern: /^[1][3-9][0-9]{9}$/,
          message: '请输入按照正确格式输入手机号',
        },
      ]" label="手机号" prop="phone">
        <el-input v-model="formValues.phone" style="width:300px" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item prop="email" :rules="[
        {
          pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          message: '请输入按照正确格式输入邮箱',
        },
      ]" label="邮箱">
        <el-input v-model="formValues.email" style="width:300px" placeholder="邮箱" name="accountemail" tabindex="2" autocomplete="on" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button round @click="modalVisible = false">取消</el-button>
        <el-button @click.prevent="onSubmit(formRef)" round type="primary">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>


<style lang="scss" scoped>
@import "./material.scss";
</style>