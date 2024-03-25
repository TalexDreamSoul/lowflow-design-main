<template>
  <div class="approve-activity list-layout">
    <div class="title">展位配置列表</div>
    <div class="search">
      <el-form :inline="true" :model="pageParams">
        <el-form-item>
          <el-select
            :fit-input-width="true"
            v-model="pageParams.labelSource"
            placeholder="配置类型"
            clearable
          >
            <!-- <el-option
              v-for="item of []"
              :label="item.label"
              :value="item.value"
            /> -->
          </el-select>
        </el-form-item>
        <el-form-item label="配置有效期">
          <el-date-picker
            v-model="pageParams.time"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="pageParams.labelName"
            placeholder="配置名称"
            clearable
            :suffix-icon="Search"
          />
        </el-form-item>
      </el-form>
      <el-button
        class="add"
        round
        type="primary"
        @click="handleModal(DrawerType.Create)"
        >新建展位配置</el-button
      >
    </div>
    <div class="content">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="labelName" label="展位配置ID" width="200" />
        <el-table-column prop="labelName" label="配置名称" width="200" />
        <el-table-column prop="labelName" label="配置说明" width="200" />
        <el-table-column prop="labelName" label="可见范围" width="200" />
        <el-table-column prop="labelName" label="配置有效期" width="200" />
        <el-table-column prop="labelName" label="配置类型" width="200" />
        <el-table-column label="操作" min-width="200" fixed="right">
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
    <el-drawer
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :size="946"
      v-model="modalVisible"
      :with-header="false"
      class="pd-drawer"
    >
      <div class="pd-drawer-header">{{ ModalTitleMap[modalType] }}</div>
      <div class="pd-drawer-content">
        <el-form
          ref="formRef"
          :hide-required-asterisk="true"
          label-position="top"
          :model="formValues"
        >
          <el-form-item label="配置名称" prop="labelSource">
            <el-input />
          </el-form-item>
          <el-form-item label="配置说明" prop="labelSource">
            <el-input :rows="2" type="textarea" />
          </el-form-item>
          <div class="flex">
            <div class="item">
              <el-form-item
                label="限制黑名单"
                class="inline"
                prop="labelSource"
              >
                <el-switch />
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item
                label="限制白名单"
                class="inline"
                prop="labelSource"
              >
                <el-switch />
              </el-form-item>
            </div>
          </div>
          <div class="flex">
            <div class="item">
              <el-form-item label="黑名单" class="inline" prop="labelSource">
                <el-select
                  :fit-input-width="true"
                  multiple
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item of [
                      { label: '全员可见', value: 1 },
                      { label: '登录可见', value: 0 },
                    ]"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item label="白名单" class="inline" prop="labelSource">
                <el-input />
              </el-form-item>
            </div>
          </div>
          <el-form-item label="可见范围" prop="range">
            <el-select
              :fit-input-width="true"
              v-model="formValues.range"
              placeholder="请选择"
            >
              <el-option
                v-for="item of [
                  { label: '全员可见', value: 1 },
                  { label: '登录可见', value: 0 },
                ]"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="配置有效期" prop="range">
            <el-date-picker
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <div class="config-info">
            <div class="config-type">
              <el-form-item class="inline" label="配置类型" prop="labelSource">
                <el-select
                  :fit-input-width="true"
                  placeholder="请选择"
                  clearable
                  style="width: 160px;"
                >
                  <el-option
                    v-for="item of [
                      { label: 'banner位', value: 1 },
                      { label: '金刚位', value: 0 },
                      { label: '轮播图', value: 2 },
                    ]"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </div>
            <div class="config-content">
              <el-form-item label="xxx名称" prop="labelSource">
                <el-input />
              </el-form-item>
              <el-form-item label="xxx图片" prop="labelSource">
                <el-input />
              </el-form-item>
              <el-form-item label="xxx权重" prop="labelSource">
                <el-input />
              </el-form-item>
              <el-form-item label="xxx内容" prop="labelSource">
                <el-select
                  :fit-input-width="true"
                  placeholder="请选择"
                  clearable
                >
                </el-select>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>
      <div class="pd-drawer-footer">
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
      </div>
    </el-drawer>
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
  Create = "create",
}

const ModalTitleMap: any = {
  [DrawerType.Edit]: "编辑配置",
  [DrawerType.Detail]: "查看配置详情",
  [DrawerType.Create]: "新建配置",
};

const pageParams = reactive({
  labelName: "",
  labelSource: "",
  time: "",
});

const defaultFormValues = {
  labelSource: "",
  range: "",
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

const getData = async (params: any) => {
  try {
    let { time, ...values } = params;
    let beginTime;
    let endTime;
    if (time) {
      beginTime = time[0];
      endTime = time[1];
    }
    let res: any = await API.qryCustomLabel({
      beginTime,
      endTime,
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
  :deep(.pd-drawer) {
    .el-select,
    .el-input,
    .el-date-editor.el-input__wrapper {
      max-width: 480px;
    }
    .el-form-item__label {
      color: rgba(0, 0, 0, 0.9);
    }
    .inline {
      display: flex;
      align-items: center;
      .el-form-item__label {
        margin-bottom: 0;
      }
    }
    .flex {
      width: 480px;
      gap: 54px;
      .item {
        flex: 1;
      }
    }
    .config-info {
      width: 100%;
      background: #f2f4f8;
      .config-type {
        background-color: rgba(144, 160, 184, 0.1);
        padding: 12px 16px;
        .inline {
          margin-bottom: 0 !important;
        }
        .el-select .el-select__wrapper {
          min-height: 32px;
        }
        .el-form-item__label {
          font-weight: 500;
        }
      }
      .config-content {
        padding: 24px 16px;
      }
    }
  }
}
</style>
