<template>
  <div class="event list-layout">
    <div class="title">客户列表</div>
    <div class="search">
      <el-form :inline="true" :model="pageParams">
        <el-form-item>
          <el-select
            size="large"
            v-model="pageParams.source"
            placeholder="类别"
            clearable
          >
            <el-option
              v-for="item of EVENT_TYPE"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            size="large"
            v-model="pageParams.value"
            placeholder="请输入客户姓名或者手机号"
            clearable
            :suffix-icon="Search"
          />
        </el-form-item>
      </el-form>
      <el-button
        class="pd-button"
        round
        type="primary"
        @click="handleModal(DrawerType.Create)"
        >手动添加客户</el-button
      >
    </div>
    <div class="content">
      <el-watermark content="11111" :font="{ color: 'rgba(0, 0, 0, 0.15)' }">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="id" label="客户ID" width="186" />
          <el-table-column prop="name" label="客户名" width="189" />
          <el-table-column prop="itFinCode" label="互金客户号" width="185" />
          <el-table-column
            prop="phone"
            label="手机号"
            width="187"
          ></el-table-column>
          <el-table-column prop="sex" label="性别" width="188">
            <template #default="scope">
              {{
                PEOPLE_SEX.find((v) => checkStringEqual(v.value, scope.row.sex))
                  ?.label || '未知'
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="province"
            label="省份"
            width="187"
          ></el-table-column>
          <el-table-column
            prop="city"
            label="城市"
            width="186"
          ></el-table-column>
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
          <el-table-column label="操作" min-width="158">
            <template #default="scope">
              <el-button
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
      </el-watermark>
      <el-pagination
        background
        layout="prev, pager, next, sizes, jumper"
        :total="total"
        :page-sizes="[10]"
        v-model:current-page="pageParams.pageNum"
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
        :disabled="checkStringEqual(modalType, DrawerType.Detail)"
        ref="formRef"
        :hide-required-asterisk="true"
        label-position="top"
        class="form"
        :model="attrFormValues"
      >
        <el-form-item
          :rules="[
            { required: true, message: '请输入客户名称' },
            {
              pattern: /^[\u4e00-\u9fa5a-zA-Z_\d]{1,18}$/,
              message: '仅支持数字、汉字、字母、下划线，不超过18个字符',
            },
          ]"
          label="客户名称"
          prop="fieldName"
        >
          <el-input
            size="large"
            v-model="attrFormValues.fieldName"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item
          :rules="[
            { required: true, message: '请输入手机号' },
            {
              pattern: /^[\u4e00-\u9fa5a-zA-Z_\d]{1,18}$/,
              message: '仅支持数字、汉字、字母、下划线，不超过18个字符',
            },
          ]"
          label="客户名称"
          prop="fieldName"
        >
          <el-input
            size="large"
            v-model="attrFormValues.fieldName"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item
          :rules="[{ required: true, message: '请选择数据类别' }]"
          label="数据类别"
          prop="fieldType"
        >
          <el-select
            size="large"
            v-model="attrFormValues.fieldType"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item of ATTR_FIELD_TYPE"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :rules="[{ max: 40, message: '最多可输入40字' }]"
          label="属性说明"
          prop="describe"
        >
          <el-input
            v-model="attrFormValues.describe"
            :autosize="{ minRows: 4 }"
            type="textarea"
            :show-word-limit="true"
            placeholder="请输入"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            v-if="modalType === DrawerType.Detail"
            class="pd-button"
            round
            @click="modalVisible = false"
            >返回</el-button
          >
          <el-button
            v-if="modalType !== DrawerType.Detail"
            class="pd-button"
            round
            @click="modalVisible = false"
            >取消</el-button
          >
          <el-button
            v-if="modalType !== DrawerType.Detail"
            class="pd-button"
            @click.prevent="onSubmit(formRef)"
            round
            type="primary"
            >保存</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, watch, onMounted } from "vue";
import {
  EVENT_TYPE,
  ATTR_FIELD_TYPE,
  PEOPLE_SEX,
  PEOPLE_SOURCE,
} from "~/constants";
import API from "~/api/customer";
import { checkStringEqual, debounce } from "~/utils/common";
import { Search } from "@element-plus/icons-vue";
import { ElMessageBox, FormInstance } from "element-plus";
import "element-plus/theme-chalk/el-message-box.css";

enum DrawerType {
  Create = "create",
  Detail = "detail",
  Edit = "edit",
}

const ModalTitleMap: any = {
  [DrawerType.Create]: "新建属性",
  [DrawerType.Detail]: "属性详情",
  [DrawerType.Edit]: "编辑属性",
};

const pageParams = reactive({
  value: "",
  source: "",
  pageNum: 1,
});

const defaultFormValues = {
  eventName: "",
  eventType: "",
  eventCode: "",
  describe: "",
  attrTableData: [],
};
const formValues: any = reactive({ ...defaultFormValues });

const defaultAttrFormValues = {
  field: "",
  fieldName: "",
  describe: "",
  fieldType: "",
};
let attrFormValues = reactive({ ...defaultAttrFormValues });

const formRef = ref<FormInstance>();

const total = ref(0);
const tableData = ref<any[]>([]);
const modalVisible = ref(false);
const modalType = ref<any>(DrawerType.Create);

watch(
  pageParams,
  debounce(() => {
    getData(pageParams);
  }, 200)
);

onMounted(() => {
  getData(pageParams);
});

const getData = async (params: any) => {
  try {
    let res = await API.qryCustomList({
      ...params,
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

const handleModal = (type: string, values?: any) => {
  if (type === DrawerType.Create) {
    Object.assign(formValues, defaultFormValues);
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

const handleDelete = (values: any) => {
  ElMessageBox.alert("删除后将无法恢复", "确认删除", {
    showCancelButton: true,
    roundButton: true,
    cancelButtonClass: "pd-button",
    confirmButtonClass: "pd-button",
    customClass: "delete-modal",
  }).then(async () => {
    // let res = await API.deleteEventDict({ id: values.id });
    // if (checkStringEqual(res?.code, 0)) {
    //   getData(pageParams);
    // }
  });
};

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  try {
    await formEl.validate();
    // let { attrTableData, ...params } = formValues;
    // let res = await API[
    //   checkStringEqual(modalType.value, DrawerType.Create)
    //     ? "addEventDict"
    //     : "updateEventDict"
    // ]({
    //   ...params,
    //   eventAttr: {
    //     attrs: attrTableData,
    //   },
    // });
    // if (checkStringEqual(res?.code, 0)) {
    //   getData(pageParams);
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
