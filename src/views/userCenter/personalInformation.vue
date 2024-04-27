<script setup lang="ts">
import { ref, unref, reactive, onMounted, inject } from "vue";
import { getQryMaterial } from "~/api/index";
import API from "~/api/account";
import { useRouter, useRoute } from "vue-router";
import CustomEventComponent from "~/components/CustomEventComponent.vue";
import { ElMessageBox, ElMessage, FormInstance } from "element-plus";
import { checkStringEqual, debounce } from "~/utils/common";

const router = useRouter();
// 使用 useRoute 获取当前路由信息
const route = useRoute();

const appOptions: any = inject("appOptions")!;

// 通过 route.params 获取路由中的 type 参数
// const getType = route.params.type;
const formInline = reactive({
  name: "",
  // type	素材类型：sms 短信，appPush app消息，digital 数字员工，outbound 智能外呼，znx 站内信
  type: route.params.type,
  beginTime: "",
  endTime: "",
  status: "",
});
const tableData = ref([]); // 表格数据
const total = ref(0); // 总数
const currentPage = ref(1);
const pageSize = ref(10);
const formRef = ref<FormInstance>();

const defaultFormValues = {
  accountName: "",
  // accountPassword: "",
  email: "",
  phone: "",
};
let formValues = reactive<any>({ ...defaultFormValues });
const RoleList = ref([]); // 权限列表

onMounted(async () => {
  fetchRoleList();
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
  const res = await API.accountDetail();
  Object.assign(formValues, res.data);

  appOptions.value.user = res.data;

  console.log(`output->tabledata`, formValues.value);
};
const logout = async () => {
  const res = await API.logout();
  // 获取当前网站下的所有 cookie
  const cookies = document.cookie.split(";");

  // 遍历所有 cookie 并设置过期时间为过去的时间来清除
  cookies.forEach((cookie) => {
    const cookieName = cookie.split("=")[0].trim();
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
  // 清空所有的本地存储内容
  localStorage.clear();
  router.push("/login");
  console.log(`output->tabledata`, res);
};
const login = async () => {
  router.push("/login");
};

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  try {
    await formEl.validate();
    let res = { code: "0000" };
    let values = {
      ...formValues,
    };
    res = await API.updateAccount(values);
    if (checkStringEqual(res?.code, 0)) {
      ElMessage.success(res?.message);
      fetchDataApi();
    }
  } catch (error) {
    console.error(error);
  }
};
</script>

<template>
  <CustomEventComponent title="个人信息">
    <template #table>
      <el-form ref="formRef" :hide-required-asterisk="true" label-position="top" class="form" style="margin:32px" :model="formValues">
        <el-form-item :rules="[
        { required: true, message: '请输入帐号名称' },
       
      ]" label="帐号名称" prop="accountName">
          <el-input v-model="formValues.accountName" style="width:300px" placeholder="请输入" clearable maxlength="50"/>
        </el-form-item>

        <!-- <el-form-item prop="accountPassword" label="用户密码" :rules="[
            { required: true, message: '请输入用户密码' },
            {
              pattern: /^[\u4e00-\u9fa5a-zA-Z_\d]{1,18}$/,
              message: '仅支持数字、汉字、字母、下划线，不超过18个字符',
            },
          ]" >
            <el-input v-model="formValues.accountPassword" style="width:300px" placeholder="请输入" clearable />
          </el-form-item> -->
        <el-form-item prop="roleId" label="用户角色">
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
        <el-form-item>
          <el-button type="primary" @click="onSubmit(formRef)">保存</el-button>
          <el-button @click="logout()">登出</el-button>
          <el-button @click="login()">登陆</el-button>
        </el-form-item>
      </el-form>

    </template>
    <template #pagination>

    </template>
  </CustomEventComponent>
</template>


<style lang="scss" scoped>
@import "./material.scss";
</style>