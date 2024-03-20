

<template>
  <van-sticky :offset-top="0" v-if="route.params.type">
    <van-nav-bar left-text="返回" left-arrow :title="route.params.type=='details'?'查看客户信息':(route.params.type=='edit'?'编辑客户信息':'客户信息填写')" @click-left="onClickLeft" />
  </van-sticky>
  <van-form ref="form" :model="formData" class="form-container" @submit="submitForm" :readonly="route.params.type=='details'">
    <div>
      <van-field v-model="formData.fullName" label="联系人姓名" :rules="[{ required: true, message: '请输入联系人姓名' }]" required></van-field>

      <van-field v-model="formData.telephone" label="联系人电话" :rules="[
    { required: true, message: '请输入联系人电话' },
    { pattern: /^[1][3-9]\d{9}$/, message: '请输入正确的11位手机号码'}
  ]" required></van-field>
      <van-field v-model="formData.wechat" label="联系人微信"></van-field>
      <van-field v-model="formData.department" label="部门" :rules="[{ required: true, message: '请输入部门' }]" required></van-field>
      <van-field v-model="formData.duty" label="职务" :rules="[{ required: true, message: '请输入职务' }]" required></van-field>
      <van-field v-model="formData.identity" label="联系人身份"></van-field>
      <van-field is-link readonly v-model="formData.identity" label="联系人身份" @click="identityshowPicker = true" />
      <van-popup v-model:show="identityshowPicker" position="bottom">
        <van-picker :columns="contactIdentityList" @confirm="onConfirmidentity" @cancel="identityshowPicker = false" />
      </van-popup>
      <van-field is-link readonly v-model="formData.productIntention" label="产品意向" :rules="[{ required: true, message: '请输入产品意向' }]" required @click="showPicker = true" />
      <van-popup v-model:show="showPicker" position="bottom">
        <van-picker :columns="columns" @confirm="onConfirmProductIntention" @cancel="showPicker = false" />
      </van-popup>

      <van-field v-model="formData.spmBuyProduct" label="是否有过我司采购记录" :rules="[{ required: true, message: '请输入是否有过我司采购记录' }]" required></van-field>
      <van-field v-model="formData.gender" label="性别" name="radio">
        <template #input>
          <van-radio-group v-model="formData.gender" direction="horizontal" :disabled="route.params.type=='details'">
            <van-radio name="男" icon-size="18px">男</van-radio>
            <van-radio name="女" icon-size="18px">女</van-radio>
          </van-radio-group>
        </template>

      </van-field>
      <van-field v-model="formData.birthday" is-link readonly name="birthday" label="生日" placeholder="点击选择日期" @click="showCalendar = true" />
      <van-calendar v-model:show="showCalendar" @confirm="onConfirm" :min-date="new Date(1900, 0, 1)" />

      <van-field v-model="formData.email" label="邮箱"></van-field>
      <van-field v-model="formData.spmName" label="公司名称" :rules="[{ required: true, message: '请输入公司名称' }]" required></van-field>
      <!-- <van-field v-model="formData.identity" label="客户简称" :rules="[{ required: true, message: '请输入客户简称' }]" required></van-field> -->
      <!-- city -->
      <van-field v-model="formData.spmAddress" label="公司地址" @click="showPopup" is-link readonly placeholder="点击编辑地址">

      </van-field>
      <van-popup v-model:show="popupVisible" position="bottom" :style="{ height: '50%' }">
        <div class="address-edit">
          <van-area title="选择省市" :columns-num="2" :area-list="areaList" @confirm="onAreaConfirm" />
          <van-field v-model="detailAddress" label="详细地址" placeholder="请输入详细地址" />
          <van-field v-model="savedAddress" label="展示地址" readonly />
        </div>
      </van-popup>

      <van-field v-model="formData.spmIndustryLevel1" label="所属行业"></van-field>
      <van-field v-model="formData.spmKaName" label="KA客户名称"></van-field>

      <van-button v-if="route.params.type!=='details'" type="primary" class="submit-button" native-type="submit">提交</van-button>

    </div>
  </van-form>
  <!-- <van-floating-bubble icon="arrow-left" @click="onAddCustomerList" /> -->
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  getcustomerInfosByCode,
  saveOrUpdateData,
  getByGroupCode,
} from "@/api/index";
import { ref, reactive, onMounted, watch } from "vue";
import { customerInfosTypes } from "./Types";
import { areaList } from "@vant/area-data";
import { showSuccessToast } from "vant";
const route = useRoute();
const router = useRouter();

console.log(`output->route.params.id`, route.params.id);
// const customerInfos = ref({} as customerInfosTypes)
const formData = reactive<any>({ ...customerInfosTypes });
const contactIdentityList = reactive<any>([]);
const showCalendar = ref(false);

const onConfirm = (value: string | number | Date) => {
  const selectedDate = new Date(value);
  formData.birthday = `${selectedDate.getFullYear()}-${(
    selectedDate.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${selectedDate.getDate().toString().padStart(2, "0")}`;
  console.log("选择的日期:", formData.birthday);
  showCalendar.value = false;
};

const customerInfosByCode = async () => {
  const res: any = await getcustomerInfosByCode(route.params.id);

  if (res.data) {
    // formData.value = res.data
    Object.assign(formData, res.data);
    console.log(`output->res`, res.data, formData);
  }
};

const getByGroupCodeIndetity = async () => {
  const res: any = await getByGroupCode("contactIdentity");
  console.log(`output->res`, res);
  Object.assign(contactIdentityList, res);
};
onMounted(() => {
  getByGroupCodeIndetity();
  route.params.id
    ? customerInfosByCode()
    : Object.assign(formData, { ...customerInfosTypes });
});
watch([route.params], () => {
  route.params.id
    ? customerInfosByCode()
    : Object.assign(formData, { ...customerInfosTypes });
});
// 提交表单方法
const submitForm = async (values: any) => {
  console.log("submit", values);
  console.log(`output->res`, formData);
  const res: any = await saveOrUpdateData(formData);
  console.log(`output->res`, res.data, formData);
  showSuccessToast("创建成功");
  router.push(`/ActionRecordList`);
};

const showAreaPopup = ref(false);

const onAreaCancel = () => {
  showAreaPopup.value = false;
};
const onAddCustomerList = () => {
  router.push(`/`);
};
const onClickLeft = () => history.back();

// 替换为真实的省市区数据
const areaValue = ref();
const detailAddress = ref("");
const savedAddress = ref("");

const popupVisible = ref(false);

const showPopup = () => {
  popupVisible.value = true;
};

const onAreaConfirm = (value: any) => {
  console.log("选择的省市区222:", value);
  // spmProvince spmCity spmArea spmAddress
  const selectedAreaNames =
    value?.selectedOptions[0].text + "" + value?.selectedOptions[1].text;
  const formattedAddress = `${selectedAreaNames} ${detailAddress.value}`;
  savedAddress.value = formattedAddress;
  popupVisible.value = false;
  console.log("savedAddress:", savedAddress);
};
const identityshowPicker = ref(false);
const showPicker = ref(false);

const columns = [
  { text: "KK 终端&工作站&笔记本", value: "KK 终端&工作站&笔记本" },
  { text: "KK 服务器", value: "KK 服务器" },
  { text: "KK HPC", value: "KK HPC" },
  { text: "NC 终端&工作站", value: "NC 终端&工作站" },
  { text: "NC 服务器", value: "NC 服务器" },
  { text: "NC HPC", value: "NC HPC" },
  { text: "存储", value: "存储" },
  { text: "机房及冷却设施", value: "机房及冷却设施" },
  { text: "云", value: "云" },
  { text: "计算服务", value: "计算服务" },
  { text: "工业软硬件", value: "工业软硬件" },
  { text: "网络安全", value: "网络安全" },
  { text: "智算中心", value: "智算中心" },
];

const onConfirmidentity = ({ selectedOptions }) => {
  formData.productIntention = selectedOptions[0]?.text;
  showPicker.value = false;
};
const onConfirmProductIntention = ({ selectedOptions }) => {
  formData.productIntention = selectedOptions[0]?.text;
  showPicker.value = false;
};
</script>



<style scoped>
.form-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 8px;
  padding-bottom: 70px;
}

.submit-button {
  margin-top: 20px;
  width: 100%;
}
</style>: any: string: any: any