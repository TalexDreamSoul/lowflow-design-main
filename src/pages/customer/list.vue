<template>
  <div class="customer-list list-layout">
    <div class="title">客户列表</div>
    <div class="search">
      <el-form :inline="true" :model="pageParams">
        <el-form-item>
          <el-select
            v-model="pageParams.source"
            style="width: 200px"
            placeholder="类别"
            clearable
          >
            <el-option
              v-for="item of PEOPLE_SOURCE"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            style="width: 400px !important"
            v-model="pageParams.value"
            placeholder="请输入客户姓名或者手机号"
            clearable
            :suffix-icon="Search"
          />
        </el-form-item>

        <el-form-item>
          <el-button @click="handleModaldrawer(DrawerType.Serach)"
            >高级筛选</el-button
          >
        </el-form-item>
      </el-form>
      <el-button
        round
        class="add"
        type="primary"
        @click="handleModal(DrawerType.Create)"
        >手动添加客户</el-button
      >
    </div>
    <div class="content">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="客户ID" width="186" />
        <el-table-column prop="name" label="客户名" width="189" />
        <el-table-column prop="itFinCode" label="互金客户号" width="185" />
        <el-table-column
          prop="phone"
          label="手机号"
          width="187"
        ></el-table-column>
        <!-- <el-table-column prop="sex" label="性别" width="188" /> -->
        <!-- <el-table-column
          prop="province"
          label="省份"
          width="187"
        ></el-table-column>
        <el-table-column prop="city" label="城市" width="186"></el-table-column> -->
        <el-table-column
          prop="birthday"
          label="生日"
          width="188"
        ></el-table-column>
        <el-table-column prop="source" label="来源" width="186">
          <template #default="scope">
            {{
              PEOPLE_SOURCE.find((v) =>
                checkStringEqual(v.value, scope.row.source)
              )?.label
            }}
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="158" fixed="right">
          <template #default="scope">
            <el-button
              v-if="scope.row.source === peopleSourceEnum.Manual"
              link
              type="primary"
              class="action-btn"
              @click="handleModal(DrawerType.Edit, scope.row)"
              >编辑</el-button
            >
            <el-button
              :disabled="scope.row.source !== peopleSourceEnum.Manual"
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
        <template #empty>
          <el-empty :image="Maskgroup" :image-size="76">
            <template #description> 暂无数据 </template>
          </el-empty>
        </template>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next, jumper"
        :total="total"
        :page-size="10"
        :current-page="pageNum"
        @current-change="currentChange"
      />
    </div>
    <el-dialog
      class="pd-modal"
      destroy-on-close
      :close-on-click-modal="false"
      v-model="modalVisible"
      :title="ModalTitleMap[modalType]"
    >
      <el-form
        v-if="!checkStringEqual(modalType, DrawerType.Detail)"
        :disabled="checkStringEqual(modalType, DrawerType.Detail)"
        ref="formRef"
        :hide-required-asterisk="true"
        label-position="top"
        class="form"
        :model="formValues"
      >
        <el-form-item
          :rules="[
            { required: true, message: '请输入客户名称' },
          ]"
          label="客户名称"
          prop="name"
        >
          <el-input
            v-model="formValues.name"
            placeholder="请输入"
            clearable
            maxlength="50"
          />
        </el-form-item>
        <el-form-item
          :rules="
            formValues.itFinCode
              ? [
                  {
                    pattern: /^[1][3-9][0-9]{9}$/,
                    message: '请输入按照正确格式输入手机号',
                  },
                ]
              : [
                  {
                    pattern: /^[1][3-9][0-9]{9}$/,
                    message: '请输入按照正确格式输入手机号',
                  },
                  { required: true, message: '请输入手机号' },
                ]
          "
          label="手机号"
          prop="phone"
        >
          <el-input v-model="formValues.phone" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item
          :rules="
            formValues.phone
              ? []
              : [{ required: true, message: '请输入互金客户号' }]
          "
          label="互金客户号"
          prop="itFinCode"
        >
          <el-input
            v-model="formValues.itFinCode"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <div class="flex">
          <!-- <el-form-item label="性别" prop="sex">
            <el-select v-model="formValues.sex" placeholder="请选择" clearable>
              <el-option
                v-for="item of PEOPLE_SEX"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item> -->
          <!-- <el-form-item label="省份" prop="province">
            <el-select
              v-model="formValues.province"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item of CITY_DATA"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="城市" prop="city">
            <el-select v-model="formValues.city" placeholder="请选择" clearable>
              <el-option
                v-for="item of CITY_DATA.find(
                  (v) => v.value === formValues.province
                )?.children || []"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item> -->
        </div>
        <el-form-item label="生日" prop="birthday">
          <el-date-picker
            v-model="formValues.birthday"
            type="date"
            placeholder="请选择"
            value-format="YYYY-MM-DD"
            width="100%"
          />
        </el-form-item>
      </el-form>
      <div
        class="people-detail"
        v-if="checkStringEqual(modalType, DrawerType.Detail)"
      >
        <div class="info">
          <div class="user">
            <div class="avatar">
              <img
                v-if="modalData?.custom?.avatar"
                :src="modalData?.custom?.avatar"
                alt=""
              />
            </div>
            <div class="user-content">
              <div class="name">{{ modalData?.custom?.name }}</div>
            </div>
          </div>
          <el-table :data="[modalData?.custom]" style="width: 100%">
            <el-table-column prop="id" label="客户ID" width="120" />
            <el-table-column prop="itFinCode" label="互金客户号" width="120" />
            <el-table-column
              prop="phone"
              label="手机号"
              width="180"
            ></el-table-column>
            <!-- <el-table-column prop="sex" label="性别" width="71" /> -->
            <!-- <el-table-column
              prop="province"
              label="省份"
              width="111"
            ></el-table-column>
            <el-table-column
              prop="city"
              label="城市"
              width="90"
            ></el-table-column> -->
            <el-table-column
              prop="birthday"
              label="生日"
              min-width="120"
            ></el-table-column>
            <template #empty>
              <el-empty :image="Maskgroup" :image-size="76">
                <template #description> 暂无数据 </template>
              </el-empty>
            </template>
          </el-table>
        </div>
        <div class="tag">
          <div class="title">客户标签</div>
          <div class="tag-content">
            <el-tooltip
              effect="dark"
              v-for="item of modalData?.labels || []"
              :content="`${item.labelName}：${item.labelValue?.data?.join?.('、')}`"
              placement="top-start"
            >
              <el-tag
                >{{ item.labelName }}：{{
                  item.labelValue?.data?.join?.("、")
                }}</el-tag
              >
            </el-tooltip>
          </div>
        </div>
        <div class="black-list">
          <div class="title">所在黑名单</div>
          <div class="tag-content">
            <el-tooltip
              effect="dark"
              v-for="item of modalData?.blacklists || []"
              :content="`${item.blacklistName}`"
              placement="top-start"
            >
              <el-tag>{{ item.blacklistName }}</el-tag>
            </el-tooltip>
            <a v-if="!modalData?.blacklists">无</a>
          </div>
        </div>
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
            v-if="modalType !== DrawerType.Detail"
            @click.prevent="onSubmit(formRef)"
            round
            type="primary"
            >保存</el-button
          >
        </span>
      </template>
    </el-dialog>
    <DrawerSerach
      ref="drawerRef"
      :getData="advancedSearch"
    />
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, watch, onMounted } from "vue";
import {
  PEOPLE_SEX,
  PEOPLE_SOURCE,
  peopleSourceEnum,
  CITY_DATA,
} from "~/constants";
import API from "~/api/customer";
import { checkStringEqual, debounce } from "~/utils/common";
import { Search } from "@element-plus/icons-vue";
import { ElMessageBox, FormInstance } from "element-plus";
import "element-plus/theme-chalk/el-message-box.css";
import DrawerSerach from "./drawerSerach.vue";
import Maskgroup from "~/assets/icon/Maskgroup.png";

enum DrawerType {
  Create = "create",
  Detail = "detail",
  Edit = "edit",
}

const ModalTitleMap: any = {
  [DrawerType.Create]: "手动添加客户",
  [DrawerType.Detail]: "客户详情",
  [DrawerType.Edit]: "编辑客户信息",
};

const pageParams = reactive({
  value: "",
  source: "",
});

const filtering = reactive({
  customAttr: {},
  customEvent: {},
  eventSequence: {},
  logicalChar: "",
});
const defaultFormValues = {
  name: "",
  phone: "",
  province: "",
  city: "",
  sex: "",
  birthday: "",
  itFinCode: "",
};
let formValues = reactive<any>({ ...defaultFormValues });
let modalData = reactive<any>({});

const formRef = ref<FormInstance>();

const total = ref(0);
const tableData = ref<any[]>([]);
const modalVisible = ref(false);
const modalType = ref<any>(DrawerType.Create);
const pageNum = ref(1);

watch(
  pageParams,
  debounce(() => {
    pageNum.value = 1;
    if (filtering.logicalChar) {
      getData({ ...pageParams, pageNum: 1 }, filtering);
    } else {
      getData({ ...pageParams, pageNum: 1 });
    }
  }, 200)
);

onMounted(() => {
  getData({ ...pageParams, pageNum: 1 });
});

const currentChange = (value: number) => {
  pageNum.value = value;
  if (filtering.logicalChar) {
    getData({ ...pageParams, pageNum: value }, filtering);
  } else {
    getData({ ...pageParams, pageNum: value });
  }
};

const advancedSearch = (filteringValue: any) => {
  pageNum.value = 1;
  getData({ ...pageParams, pageNum: 1 }, filteringValue);
};

const getData = async (params: any, filteringValue?: any) => {
  try {
    let res = await API.qryCustomList({
      pageNum: 1,
      ...filteringValue,
      ...params,
      pageSize: 10,
    });
    if (checkStringEqual(res?.code, 0)) {
      Object.assign(filtering, filteringValue);
      total.value = res?.data?.total;
      tableData.value = res?.data?.records;
    }
  } catch (error) {
    console.error(error);
  }
};

const handleModal = async (type: string, values?: any) => {
  if (type === DrawerType.Create) {
    for (const key in formValues) {
      formValues[key] = null;
    }
    Object.assign(formValues, defaultFormValues);
  } else if (type === DrawerType.Edit) {
    Object.assign(formValues, values);
  } else {
    let res = await API.customDetail({ id: values?.id });
    if (!checkStringEqual(res?.code, 0)) return;
    Object.assign(modalData, res?.data);
  }
  modalType.value = type;
  modalVisible.value = true;
};
const drawerRef = ref<any>();

const handleModaldrawer = async (type: string, values?: any) => {
  drawerRef.value?.handleModal?.(type, values);
};
const handleDelete = (values: any) => {
  ElMessageBox.alert("删除后将无法恢复", "确认删除", {
    showCancelButton: true,
    roundButton: true,
    cancelButtonClass: "pd-button",
    confirmButtonClass: "pd-button",
    customClass: "delete-modal",
  }).then(async () => {
    let res = await API.deleteCustom({ id: values.id });
    if (checkStringEqual(res?.code, 0)) {
      getData({ ...pageParams, pageNum: pageNum.value });
    }
  });
};

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  try {
    await formEl.validate();
    let res = { code: "0000" };
    let values = {
      ...formValues,
      source: peopleSourceEnum.Manual,
    };
    if (modalType.value === DrawerType.Create) {
      res = await API.addCustom(values);
    } else {
      res = await API.updateCustom(values);
    }
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
</style>
<style lang="scss" scoped>
.customer-list {
  .flex {
    gap: 16px;
    > div {
      flex: 1;
    }
  }
  :deep(.pd-modal) {
    .people-detail {
      display: flex;
      flex-direction: column;
      gap: 16px;
      > div > .title {
        color: rgba(0, 0, 0, 0.9);
      }
      .info {
        background-color: rgba(144, 160, 184, 0.1);
        border-radius: 4px;
        overflow: hidden;
      }
      .tag-content {
        display: flex;
        gap: 8px;
        margin-top: 8px;
        overflow: hidden;
        flex-wrap: wrap;
        .el-tag {
          padding: 0 8px;
          font-size: 14px;
          line-height: 16px;
          max-width: 150px;
          &__content {
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            word-break: keep-all;
          }
        }
      }
      .user {
        display: flex;
        padding: 16px;
        gap: 16px;
        align-items: center;
        .avatar {
          width: 60px;
          height: 60px;
          overflow: hidden;
          border-radius: 50%;
          background-color: black;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .name {
          font-size: 18px;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.9);
        }
      }
      .el-table {
        border-radius: 0;

        .el-table__cell {
          background-color: rgba(242, 244, 248, 1);
        }
      }
    }
  }
}
.add {
  background: linear-gradient(rgb(32, 92, 203) 0%, rgb(89, 143, 241) 100%);
  transition: 0.25s;
}
</style>
