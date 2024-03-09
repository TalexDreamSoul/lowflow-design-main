<script setup lang="ts">
import { ref, unref, reactive, onMounted, watch } from "vue";
import dayjs from "dayjs";
import API from "~/api/account";
import { useRouter, useRoute } from "vue-router";
import { Search } from "@element-plus/icons-vue";
import { ElMessageBox, ElMessage, FormInstance,ElTree } from "element-plus";
import CustomEventComponent from "~/components/CustomEventComponent.vue";
import { checkStringEqual, debounce } from '~/utils/common';
import RoleFlatMap from "./role/RoleFlatMap.vue";

// 使用 useRoute 获取当前路由信息
const route = useRoute();
// 通过 route.params 获取路由中的 type 参数
// const getType = route.params.type;
const formInline = reactive({
  roleName: "",
});
const tableData = ref([]); // 表格数据
const MenuList = ref([]); // 权限列表
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
  [DrawerType.Create]: "新建角色",
  [DrawerType.Edit]: "编辑角色",
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
  const treeProps = {
      children: 'subMenus',
      label: 'menuName',
      hasChildren(node: { subMenus: null; }) {
        return node.subMenus !== null; // 当 subMenus 不为 null 时显示展开符号
      }
    };
onMounted(async () => {
  fetchDataApi();
  fetchqryMenuList();
});

watch([currentPage, pageSize, formInline], () => {
  fetchDataApi();
});


const fetchqryroleDetail = async (id:any) => {
  const res = await API.roleDetail(id);
  Object.assign(formValues, res.data);
  console.log(`output->formValues`, formValues);
};
const fetchqryMenuList = async () => {
  const res = await API.qryMenuList();
  MenuList.value = res.data;
  console.log(`output->MenuList`, MenuList.value);
};
const fetchDataApi = async () => {
  const res = await API.qryRoleList({
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
    let res = await API.deleteRole({
      id:row.id
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

const handleModal = async (type: string, values?: any) => {
  if (type === DrawerType.Create) {
    for (const key in formValues) {
      formValues[key] = null;
    }
    Object.assign(formValues, defaultFormValues);
  } else if (type === DrawerType.Edit) {
    fetchqryroleDetail(values?.id)
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
      res = await API.addRole(values);
    } else {
      res = await API.updateRole(values);
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
  <CustomEventComponent title="角色管理" :tableData="tableData" :total="total">
    <template #search>
      <div class="search">
        <el-form :inline="true">
         
          <el-form-item>
            <el-input v-model="formInline.roleName" placeholder="角色名称" clearable style="width:200px" :suffix-icon="Search" />
          </el-form-item>

        </el-form>
        <div>
          <el-button type="primary" class="add" @click="handleModal(DrawerType.Create)" round>新建角色</el-button>
        </div>
      </div>
    </template>
    <template #table="{ tableData }">
      <el-table :data="tableData">
        <el-table-column label="用户角色" prop="roleName" width="300" />
        <el-table-column label="角色说明" prop="describe" />
        
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="scope">
            <el-space wrap>
              <el-link type="primary"  @click="handleModal(DrawerType.Edit, scope.row)">编辑</el-link>
              <el-link type="primary" @click="delData(scope.row)">删除</el-link>
            </el-space>

          </template>
        </el-table-column>
      </el-table>
    </template>
    <template #pagination>
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" background         layout="prev, pager, next, jumper"
      :page-sizes="[10]" :small="small" :disabled="disabled" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" class="pagination" />
    </template>
  </CustomEventComponent>

  <el-dialog width="650"  destroy-on-close :close-on-click-modal="false" v-model="modalVisible" :title="ModalTitleMap[modalType]">
    <el-form ref="formRef" :hide-required-asterisk="true" label-position="top" class="form" :model="formValues">
      <el-form-item :rules="[
            { required: true, message: '请输入帐号名称' },
            {
              pattern: /^[\u4e00-\u9fa5a-zA-Z_\d]{1,18}$/,
              message: '仅支持数字、汉字、字母、下划线，不超过18个字符',
            },
          ]" label="角色名称" prop="roleName">
        <el-input v-model="formValues.roleName" style="width:300px" placeholder="请输入" clearable />
      </el-form-item>

      <el-form-item prop="describe" label="角色说明">
        <el-input v-model="formValues.describe" style="width:300px" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item :rules="[
        { required: true, message: '请输入角色权限' },
      ]" label="角色权限" prop="menuIds">
      <div  style="height: 500px; width:100%;overflow: scroll;">
      <el-tree
      :data="MenuList"
      show-checkbox
       node-key="id"
      :default-expand-all="true"
      :default-checked-keys="formValues.menuIds"
      :props="treeProps"
    />
        <RoleFlatMap :data="MenuList" />
      </div>
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