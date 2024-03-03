<script setup lang="ts">
import { ref, unref, reactive, onMounted, watch } from "vue";
import dayjs from "dayjs";
import API from "~/api/account";
import { useRouter, useRoute } from "vue-router";
import { Search } from "@element-plus/icons-vue";
import { ElMessageBox, ElMessage, ElTag } from "element-plus";
import CustomEventComponent from "~/components/CustomEventComponent.vue";
import { createTemplatePopover } from "~/utils/touch-templates";
import { materialType } from "~/utils/common";

// 使用 useRoute 获取当前路由信息
const route = useRoute();
// 通过 route.params 获取路由中的 type 参数
// const getType = route.params.type;
const formInline = reactive({
  accountName: "",
    roleId: 0,
});
const tableData = ref([]); // 表格数据
const RoleList = ref([
		{
			"createBy": 0,
			"createTime": "",
			"deleted": false,
			"describe": "",
			"id": 0,
			"roleName": "nam",
			"updatedBy": 0,
			"updatedTime": ""
		}
	]); // 权限列表
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

const value = ref();

function getNameByValue(data: any[], val: string) {
  const item = data.find((item: { value: any }) => item.value === val);
  return item ? item.name : "";
}

onMounted(async () => {
  fetchDataApi();
  fetchRoleList();

});



watch([currentPage, pageSize, formInline], () => {
  fetchDataApi();
});

const fetchRoleList = async () => {
  const res = await API.qryRoleList
({
    pageNum: 1,
    pageSize: 999,
    roleName: '',
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
  let res = await API.updateAccount({
    id: row.id,
    status: status,
  });
  if (res?.code == 0) {
    ElMessage.success(res.message);
    fetchDataApi();
  }
};

const detailsData = async (row: any) => {

};

const addData = async () => {
 
};
const updateData = async (row: any) => {

};
const handleSizeChange = (val: any) => {
  console.log(`${val} items per page`);
};
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
};
</script>

<template>
    <CustomEventComponent title="用户管理" :tableData="tableData" :total="total">
      <template #search>
        <div class="search">
          <el-form :inline="true">
            <el-form-item >
              <el-select v-model="formInline.roleId" clearable style="width:200px" placeholder="用户角色">
                <el-option  v-for="item in RoleList"  :label="item.roleName" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="formInline.accountName" placeholder="用户名" clearable style="width:200px" :suffix-icon="Search" />
            </el-form-item>

          </el-form>
          <div >
            <el-button type="primary" class="add" @click="addData()" round>新建用户</el-button>
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
                <el-link type="primary" @click="updateData(scope.row)">编辑</el-link>
                <el-link type="primary" @click="delData(scope.row)">删除</el-link>
                <el-link type="primary" @click="detailsData(scope.row)">重置密码</el-link>
              </el-space>

            </template>
          </el-table-column>
        </el-table>
      </template>
      <template #pagination>
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" background layout="prev, pager, next, sizes, jumper" :page-sizes="[10]" :small="small" :disabled="disabled" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" class="pagination" />
      </template>
    </CustomEventComponent>
</template>


<style lang="scss" scoped>
@import "./material.scss";
</style>