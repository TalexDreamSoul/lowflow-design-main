<template>
  <div class="event list-layout">
    <div class="title">事件列表</div>
    <div class="search">
      <el-form :inline="true" :model="pageParams">
        <el-form-item>
          <el-select v-model="pageParams.eventType" placeholder="类别" clearable>
            <el-option v-for="item of EVENT_TYPE" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="pageParams.eventName" placeholder="事件名称" clearable :suffix-icon="Search" />
        </el-form-item>
      </el-form>
      <el-button class="pd-button" round type="primary" @click="handleDrawer(DrawerType.Create)">新建事件</el-button>
    </div>
    <div class="content">
      <el-watermark content="11111" :font="{ color: 'rgba(0, 0, 0, 0.15)' }">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="eventCode" label="事件编码" width="246" />
          <el-table-column prop="eventName" label="事件名称" width="303" />
          <el-table-column prop="describe" label="事件说明" width="289" />
          <el-table-column prop="eventType" label="类别" width="200">
            <template #default="scope">
              {{
                EVENT_TYPE.find((v) =>
                  checkStringEqual(v.value, scope.row.eventType)
                )?.label
              }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="162">
            <template #default="scope">
              <el-tag v-if="!!scope.row.status" :type="
                  checkStringEqual(scope.row.status, ConfigStatus.Available)
                    ? ''
                    : 'info'
                ">{{
                  checkStringEqual(scope.row.status, ConfigStatus.Available)
                    ? "可用"
                    : "已下线"
                }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="211">
            <template #default="scope">
              <el-button @click="handleSetStatus(scope.row)" link type="primary" class="action-btn">{{
                  checkStringEqual(scope.row.status, ConfigStatus.Available)
                    ? "下线"
                    : "上线"
                }}</el-button>
              <el-button @click="handleDrawer(DrawerType.Edit, scope.row)" link type="primary" class="action-btn">编辑</el-button>
              <el-button link type="primary" class="action-btn" @click="handleDelete(scope.row)">删除</el-button>
              <el-button @click="handleDrawer(DrawerType.Detail, scope.row)" link type="primary" class="action-btn">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-watermark>
      <el-pagination background layout="prev, pager, next, sizes, jumper" :total="total" :page-sizes="[10]" v-model:current-page="pageNum" />
    </div>
    <el-drawer :destroy-on-close="true" :close-on-click-modal="false" :size="946" v-model="drawer" :with-header="false" class="pd-drawer">
      <div class="pd-drawer-header">{{ DrawerTitleMap[drawerType] }}</div>
      <div class="pd-drawer-content">
        <el-form :disabled="checkStringEqual(drawerType, DrawerType.Detail)" ref="formRef" :hide-required-asterisk="true" label-position="top" :model="formValues" class="form">
          <el-form-item :rules="[
              { required: true, message: '请输入事件编码' },
              {
                pattern: /^[a-zA-Z0-9_]{1,18}$/,
                message: '仅支持数字、字母、下划线，不超过18个字符',
              },
            ]" label="事件编码" prop="eventCode">
            <el-input v-model="formValues.eventCode" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item :rules="[
              { required: true, message: '请输入事件名称' },
              {
                pattern: /^[\u4e00-\u9fa5a-zA-Z_\d]{1,18}$/,
                message: '仅支持数字、汉字、字母、下划线，不超过18个字符',
              },
            ]" label="事件名称" prop="eventName">
            <el-input v-model="formValues.eventName" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item :rules="[{ required: true, message: '请选择事件类别' }]" label="事件类别" prop="eventType">
            <el-select v-model="formValues.eventType" placeholder="请选择" clearable>
              <el-option v-for="item of EVENT_TYPE" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item :rules="[{ max: 40, message: '最多可输入40字' }]" label="事件说明" prop="describe">
            <el-input v-model="formValues.describe" :autosize="{ minRows: 4 }" type="textarea" :show-word-limit="true" placeholder="请输入" />
          </el-form-item>
        </el-form>
        <div class="attr-content">
          <div class="title">
            <div class="text">关联属性</div>
            <el-button v-if="!checkStringEqual(drawerType, DrawerType.Detail)" round type="primary" @click="onCreateEventAttr(DrawerType.Create)">新建事件属性</el-button>
          </div>
          <el-watermark content="11111" :font="{ color: 'rgba(0, 0, 0, 0.15)' }">
            <el-table :data="formValues.attrTableData" style="width: 100%">
              <el-table-column prop="field" label="属性编码" width="109" />
              <el-table-column prop="fieldName" label="属性名称" width="200" />
              <el-table-column prop="fieldValue" label="属性说明" width="360" />
              <el-table-column prop="fieldType" label="数据类别">
                <template #default="scope">
                  {{
                    ATTR_FIELD_TYPE.find((v) =>
                      checkStringEqual(v.value, scope.row.fieldType)
                    )?.label
                  }}
                </template>
              </el-table-column>
              <el-table-column v-if="drawerType !== DrawerType.Detail" label="操作" width="105">
                <template #default="scope">
                  <el-button link type="primary" @click="
                      onCreateEventAttr(
                        DrawerType.Edit,
                        scope.row,
                        scope.$index
                      )
                    " class="action-btn">编辑</el-button>
                  <el-button link type="primary" @click="handleAttrDelete(scope.$index)" class="action-btn">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-watermark>
        </div>
      </div>
      <div class="pd-drawer-footer">
        <el-button v-if="drawerType === DrawerType.Detail" class="pd-button" @click="drawer = false" round>返回</el-button>
        <el-button v-if="drawerType !== DrawerType.Detail" class="pd-button" @click="drawer = false" round>取消</el-button>
        <el-button v-if="drawerType !== DrawerType.Detail" class="pd-button" @click.prevent="onSubmit(formRef)" round type="primary">保存</el-button>
      </div>
    </el-drawer>
    <el-dialog class="pd-modal" destroy-on-close :close-on-click-modal="false" v-model="dialogFormVisible" :title="ModalTitleMap[modalType]">
      <el-form :disabled="checkStringEqual(modalType, DrawerType.Detail)" ref="attrFormRef" :hide-required-asterisk="true" label-position="top" class="form" :model="attrFormValues">
        <el-form-item :rules="[
            { required: true, message: '请输入属性编码' },
            {
              pattern: /^[a-zA-Z0-9_]{1,18}$/,
              message: '仅支持数字、字母、下划线，不超过18个字符',
            },
          ]" label="属性编码" prop="field">
          <el-input v-model="attrFormValues.field" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item :rules="[
            { required: true, message: '请输入属性名称' },
            {
              pattern: /^[\u4e00-\u9fa5a-zA-Z_\d]{1,18}$/,
              message: '仅支持数字、汉字、字母、下划线，不超过18个字符',
            },
          ]" label="属性名称" prop="fieldName">
          <el-input v-model="attrFormValues.fieldName" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item :rules="[{ required: true, message: '请选择数据类别' }]" label="数据类别" prop="fieldType">
          <el-select v-model="attrFormValues.fieldType" placeholder="请选择" clearable>
            <el-option v-for="item of ATTR_FIELD_TYPE" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :rules="[{ max: 40, message: '最多可输入40字' }]" label="属性说明" prop="fieldValue">
          <el-input v-model="attrFormValues.fieldValue" :autosize="{ minRows: 4 }" type="textarea" :show-word-limit="true" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button v-if="modalType === DrawerType.Detail" class="pd-button" round @click="dialogFormVisible = false">返回</el-button>
          <el-button v-if="modalType !== DrawerType.Detail" class="pd-button" round @click="dialogFormVisible = false">取消</el-button>
          <el-button v-if="modalType !== DrawerType.Detail" class="pd-button" @click.prevent="onSubmitAttr(attrFormRef)" round type="primary">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, watch, onMounted } from "vue";
import { EVENT_TYPE, ATTR_FIELD_TYPE, ConfigStatus } from "~/constants";
import API from "~/api/configuration";
import { checkStringEqual, debounce } from "~/utils/common";
import { Search } from "@element-plus/icons-vue";
import { ElMessageBox, FormInstance } from "element-plus";
import "element-plus/theme-chalk/el-message-box.css";

enum DrawerType {
  Create = "create",
  Detail = "detail",
  Edit = "edit",
}

const DrawerTitleMap: any = {
  [DrawerType.Create]: "新建事件",
  [DrawerType.Detail]: "事件详情",
  [DrawerType.Edit]: "编辑事件",
};

const ModalTitleMap: any = {
  [DrawerType.Create]: "新建属性",
  [DrawerType.Detail]: "属性详情",
  [DrawerType.Edit]: "编辑属性",
};

const pageParams = reactive({
  eventName: "",
  eventType: "",
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
  fieldValue: "",
  fieldType: "",
};
let attrFormValues = reactive({ ...defaultAttrFormValues });

const formRef = ref<FormInstance>();
const attrFormRef = ref<FormInstance>();

const total = ref(0);
const tableData = ref<any[]>([]);
const drawer = ref(false);
const drawerType = ref<any>(DrawerType.Create);
const dialogFormVisible = ref(false);
const modalType = ref<any>(DrawerType.Create);
const editAttrIndex = ref(0);
const pageNum = ref(1);

watch(
  pageParams,
  debounce(() => {
    getData({ ...pageParams, pageNum: 1 });
  }, 200)
);

watch(pageNum, () => {
  getData({ ...pageParams, pageNum: pageNum.value });
});

onMounted(() => {
  getData({ ...pageParams, pageNum: 1 });
});

const getData = async (params: any) => {
  try {
    let res = await API.qryEventDict({
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

const handleSetStatus = async (values: any) => {
  let res = await API.updateEventDict({
    ...values,
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
    let res = await API.deleteEventDict({ id: values.id });
    if (checkStringEqual(res?.code, 0)) {
      getData(pageParams);
    }
  });
};

const handleDrawer = (type: string, values?: any) => {
  if (type === DrawerType.Create) {
    Object.assign(formValues, defaultFormValues);
  } else {
    let { eventAttr, ...params } = values;
    Object.assign(formValues, {
      ...params,
      attrTableData: eventAttr?.attrs || [],
    });
  }
  drawerType.value = type;
  drawer.value = true;
};

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  try {
    await formEl.validate();
    let { attrTableData, ...params } = formValues;
    let res = await API[
      checkStringEqual(drawerType.value, DrawerType.Create)
        ? "addEventDict"
        : "updateEventDict"
    ]({
      ...params,
      eventAttr: {
        attrs: attrTableData,
      },
    });
    if (checkStringEqual(res?.code, 0)) {
    //  getData(pageParams);
      getData({ ...pageParams, pageNum: 1 });

      drawer.value = false;
    }
  } catch (error) {
    console.error(error);
  }
};

const onSubmitAttr = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  try {
    await formEl.validate();
    let arr = [...formValues.attrTableData];
    if (checkStringEqual(modalType.value, DrawerType.Create)) {
      arr.push({ ...attrFormValues });
    } else {
      arr.splice(editAttrIndex.value, 1, { ...attrFormValues });
    }
    formValues.attrTableData = [...arr];
    dialogFormVisible.value = false;
  } catch (error) {
    console.error(error);
  }
};

const onCreateEventAttr = (type: String, values?: any, index?: number) => {
  if (type === DrawerType.Create) {
    Object.assign(attrFormValues, defaultAttrFormValues);
  } else {
    editAttrIndex.value = index as any;
    Object.assign(attrFormValues, JSON.parse(JSON.stringify(values)));
  }
  modalType.value = type;
  dialogFormVisible.value = true;
};

const handleAttrDelete = (index: number) => {
  ElMessageBox.alert("删除后将无法恢复", "确认删除", {
    showCancelButton: true,
    roundButton: true,
    cancelButtonClass: "pd-button",
    confirmButtonClass: "pd-button",
    customClass: "delete-modal",
  }).then(() => {
    let arr = [...formValues.attrTableData];
    arr.splice(index, 1);
    formValues.attrTableData = [...arr];
  });
};
</script>

<style lang="scss">
@import "~/styles/list-layout.scss";

.event {
  .attr-content {
    margin-top: 24px;

    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      .text {
        font-size: 14px;
        font-weight: 400;
        line-height: 32px;
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
</style>
