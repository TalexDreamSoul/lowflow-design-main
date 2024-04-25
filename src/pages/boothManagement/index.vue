<template>
  <div class="approve-activity list-layout">
    <div class="title">展位配置列表</div>
    <div class="search">
      <el-form :inline="true" :model="pageParams">
        <el-form-item>
          <el-select
            style="width: 150px;"
            :fit-input-width="true"
            v-model="pageParams.configType"
            placeholder="展位类型"
            clearable
          >
            <el-option
              v-for="(item, key) in configTypeMap"
              :label="item"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            style="width: 150px;"
            :fit-input-width="true"
            v-model="pageParams.configStatus"
            placeholder="展位状态"
            clearable
          >
            <el-option
              v-for="(item, key) in {1: '生效', 2: '失效'}"
              :label="item"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="展位有效期">
          <el-date-picker
            v-model="pageParams.time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="pageParams.configName"
            placeholder="展位名称"
            clearable
            :suffix-icon="Search"
            maxlength="50" />
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
        <el-table-column prop="configId" label="展位ID" width="232" />
        <el-table-column prop="configName" label="展位名称" width="276" />
        <el-table-column prop="configDesc" label="展位说明" width="278" />
        <el-table-column prop="visualRange" label="可见范围" width="283">
          <template #default="scope">
            {{ visualRangeMap[scope.row.visualRange] }}
          </template>
        </el-table-column>
        <el-table-column prop="configStatus" label="展位状态" width="200">
          <template #default="scope">
            {{
              scope.row.configStatus
                ? checkStringEqual(scope.row.configStatus, 1)
                  ? "生效"
                  : "失效"
                : "-"
            }}
          </template>
        </el-table-column>
        <el-table-column label="展位有效期" width="333">
          <template #default="scope">
            {{ scope.row.startTime }} - {{ scope.row.endTime }}
          </template>
        </el-table-column>
        <el-table-column prop="configType" label="展位类型" width="266">
          <template #default="scope">
            {{ configTypeMap[scope.row.configType] }}
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="172" fixed="right">
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
          :disabled="modalType === DrawerType.Detail"
        >
          <el-form-item label="展位名称" :rules="inputRules" prop="configName">
            <el-input v-model="formValues.configName" maxlength="50"/>
          </el-form-item>
          <el-form-item :rules="[{ max: 140, message: '最多可输入140字' }]" label="展位说明" prop="configDesc">
            <el-input
              :rows="2"
              type="textarea"
              v-model="formValues.configDesc"
            />
          </el-form-item>
          <el-form-item label="展位状态" prop="configStatus">
            <el-radio-group v-model="formValues.configStatus">
              <el-radio :value="1" size="large">生效</el-radio>
              <el-radio :value="2" size="large">失效</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="flex">
            <div class="item">
              <el-form-item
                label="限制黑名单"
                class="inline"
                :rules="selectRules"
                prop="blacklistFlag"
              >
                <el-switch v-model="formValues.blacklistFlag" />
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item
                label="限制白名单"
                class="inline"
                :rules="selectRules"
                prop="whitelistFlag"
              >
                <el-switch v-model="formValues.whitelistFlag" />
              </el-form-item>
            </div>
          </div>
          <div class="flex">
            <div class="item">
              <el-form-item
                label="黑名单"
                v-if="formValues.blacklistFlag"
                class="inline"
                :rules="selectRules"
                prop="blacklist"
              >
                <el-select
                  v-model="formValues.blacklist"
                  :fit-input-width="true"
                  multiple
                  collapse-tags
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item of blacklist"
                    :label="item.blacklistName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item
                label="白名单"
                v-if="formValues.whitelistFlag"
                class="inline"
                :rules="selectRules"
                prop="whitelist"
              >
                <el-input v-model="formValues.whitelist" />
              </el-form-item>
            </div>
          </div>
          <el-form-item
            label="可见范围"
            :rules="selectRules"
            prop="visualRange"
          >
            <el-select
              :fit-input-width="true"
              v-model="formValues.visualRange"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, key) in visualRangeMap"
                :label="item"
                :value="key * 1"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="展位有效期" :rules="selectRules" prop="time">
            <el-date-picker
              v-model="formValues.time"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
          <div class="config-info">
            <div class="config-type">
              <el-form-item
                class="inline"
                label="展位类型"
                :rules="selectRules"
                prop="configType"
              >
                <el-select
                  v-model="formValues.configType"
                  :fit-input-width="true"
                  placeholder="请选择"
                  style="width: 160px"
                  @change="formValues.boothName = ''"
                >
                  <el-option
                    v-for="(item, key) in configTypeMap"
                    :label="item"
                    :value="key * 1"
                  />
                </el-select>
              </el-form-item>
            </div>
            <div class="config-content" v-if="formValues.configType">
              <el-form-item
                v-if="!checkStringEqual(formValues.configType, 3)"
                :label="configTypeMap[formValues.configType] + '名称'"
                :rules="inputRules"
                prop="boothName"
              >
                <el-input v-model="formValues.boothName" maxlength="50"/>
              </el-form-item>
              <el-form-item
                :label="configTypeMap[formValues.configType] + '图片'"
                :rules="[
                  { required: true, message: '请上传' },
                  {
                    asyncValidator: validatorImgSize,
                    trigger: 'blur',
                  },
                ]"
                prop="boothPicture"
              >
                <div style="width: 100%">
                  <el-upload
                    action="/api/uploadMaterialFile"
                    :on-success="addPic"
                    :auto-upload="true"
                    :data="{ type: 'material', date: getCurrentDate() }"
                    :show-file-list="false"
                    :before-upload="beforeAvatarUpload"
                  >
                    <img
                      v-if="formValues.boothPicture"
                      class="boothPicture"
                      :src="formValues.boothPicture"
                      alt=""
                    />
                    <el-button
                      v-if="!checkStringEqual(modalType, DrawerType.Detail)"
                      :class="
                        !formValues.boothPicture
                          ? 'upload-btn'
                          : 'upload-btn upload-btns'
                      "
                      style="width: 100%"
                      type="primary"
                      ><el-icon v-if="!formValues.boothPicture"
                        ><CirclePlusFilled /></el-icon
                      >{{
                        !formValues.boothPicture ? "添加图片" : "重新上传"
                      }}</el-button
                    >
                  </el-upload>
                  <div class="desc">
                    {{
                      !checkStringEqual(formValues.configType, 2)
                        ? "支持上传jpg/png文件，图片尺寸：690x190"
                        : "支持上传的图片格式：.jpg .png ,图片尺寸：142x128"
                    }}
                  </div>
                </div>
              </el-form-item>
              <el-form-item
                :label="configTypeMap[formValues.configType] + '权重'"
                prop="boothWeight"
                :rules="inputRules"
              >
                <el-input-number
                  v-model="formValues.boothWeight"
                  :min="1"
                  :max="100"
                  controls-position="right"
                  :step="1"
                  step-strictly
                />
              </el-form-item>
              <el-form-item
                :label="configTypeMap[formValues.configType] + '跳转'"
                :rules="selectRules"
                prop="skipType"
              >
                <el-select
                  v-model="formValues.skipType"
                  :fit-input-width="true"
                  placeholder="请选择"
                  clearable
                >
                  <el-option
                    v-for="(item, key) in skipTypeMap"
                    :label="item"
                    :value="key * 1"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                class="inline"
                v-if="checkStringEqual(formValues.skipType, 1)"
                label="选择活动"
                prop="skipActivityId"
                :rules="selectRules"
              >
                {{ formValues.skipActivityName || formValues.skipActivityId }}
                <el-button
                  v-if="!checkStringEqual(modalType, DrawerType.Detail)"
                  type="primary"
                  plain
                  @click="dialogRef!.modalVisible = true"
                  style="margin-left: 8px"
                  >选择活动</el-button
                >
              </el-form-item>
              <el-form-item
                class="inline"
                v-if="checkStringEqual(formValues.skipType, 2)"
                label="跳转Json参数"
                :rules="inputRules"
                prop="skipParam"
              >
                <el-input
                  style="width: 380px"
                  v-model="formValues.skipParam"
                  placeholder="跳转Json参数"
                  clearable
                />
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>
      <div class="pd-drawer-footer">
        <el-button v-if="modalType === DrawerType.Detail" round @click="onClose"
          >返回</el-button
        >
        <el-button v-if="modalType !== DrawerType.Detail" round @click="onClose"
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
      <Dialog
        ref="dialogRef"
        :skip-activity-id="formValues.skipActivityId"
        :onSelectActivity="onSelectActivity"
      />
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, watch, onMounted } from "vue";
import {} from "~/constants";
import API from "~/api/boothManage";
import { checkStringEqual, debounce } from "~/utils/common";
import { Search, CirclePlusFilled } from "@element-plus/icons-vue";
import { ElMessage, FormInstance, dayjs } from "element-plus";
import Dialog from "./dialog.vue";
import "element-plus/theme-chalk/el-message-box.css";
import Maskgroup from "~/assets/icon/Maskgroup.png";

const inputRules = [
  {
    required: true,
    message: "请输入",
  },
];

const selectRules = [
  {
    required: true,
    message: "请选择",
  },
];

enum DrawerType {
  Detail = "detail",
  Edit = "edit",
  Create = "create",
}

const configTypeMap: any = {
  1: "banner位",
  2: "金刚位",
  3: "轮播图",
};

const visualRangeMap: any = {
  1: "全员可见",
  2: "登录可见",
};

const skipTypeMap: any = {
  1: "H5活动",
  2: "原生页",
};

const ModalTitleMap: any = {
  [DrawerType.Edit]: "编辑配置",
  [DrawerType.Detail]: "查看配置详情",
  [DrawerType.Create]: "新建配置",
};

const pageParams = reactive({
  configName: "",
  configType: "",
  time: "",
  configStatus: ''
});

const defaultFormValues = {
  configName: "",
  configDesc: "",
  blacklistFlag: true,
  whitelistFlag: true,
  blacklist: [],
  whitelist: "",
  visualRange: "",
  time: "",
  configType: 1,
  boothName: "",
  boothPicture: "",
  boothWeight: 0,
  skipType: "",
  skipActivityName: null,
  skipParam: null,
  skipActivityId: null,
  configStatus: 1,
};
let formValues = reactive<any>({ ...defaultFormValues });
const pageNum = ref(1);

const formRef = ref<FormInstance>();

const total = ref(0);
const tableData = ref<any[]>([]);
const modalVisible = ref(false);
const modalType = ref<any>(DrawerType.Detail);
const dialogRef = ref<any>();
const blacklist = ref<any>([]);

watch(
  pageParams,
  debounce(() => {
    pageNum.value = 1;
    getData({ ...pageParams, pageNum: 1 });
  }, 200)
);

onMounted(() => {
  getBlackAll();
  getData({ ...pageParams, pageNum: 1 });
});

const currentChange = (value: number) => {
  pageNum.value = value;
  getData({ ...pageParams, pageNum: value });
};

const beforeAvatarUpload = (rawFile: any) => {
  if (!["image/png", "image/jpeg", "image/jpg"].includes(rawFile.type)) {
    ElMessage.error("请上传制定类型文件");
    return false;
  }
  return true;
};

const validatorImgSize = (_: any, value: any) => {
  return new Promise((resolve, reject) => {
    var img = new Image();
    img.onload = function () {
      if (!checkStringEqual(formValues.configType, 2)) {
        if (img.width === 690 && img.height === 190) {
          resolve(true);
        } else {
          reject("请上传指定尺寸图片");
        }
      } else {
        if (img.width === 142 && img.height === 128) {
          resolve(true);
        } else {
          reject("请上传指定尺寸图片");
        }
      }
    };
    img.src = value;
  });
};

function getCurrentDate() {
  const currentDate = new Date().toISOString().split("T")[0];
  return currentDate;
}

function addPic(response: any) {
  formValues.boothPicture = response.data;
}

const getBlackAll = async () => {
  let res: any = await API.queryBlacklistAll();
  blacklist.value = res?.data;
};

const getData = async (params: any) => {
  try {
    let { time, ...values } = params;
    let beginTime;
    let endTime;
    if (time) {
      beginTime = dayjs(time[0]).format("YYYY-MM-DD HH:mm:ss");
      endTime = dayjs(time[1]).format("YYYY-MM-DD HH:mm:ss");
    }
    let res: any = await API.pageBoothConf({
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

const onSelectActivity = (values: any) => {
  Object.assign(formValues, values);
};

const onClose = () => {
  modalVisible.value = false;
  for (const key in formValues) {
    formValues[key] = null;
  }
};

const handleModal = async (type: string, values?: any) => {
  if (type === DrawerType.Create) {
    Object.assign(formValues, defaultFormValues);
  } else {
    // console.log(values);
    let { startTime, endTime, blacklist, ...params } = values;
    Object.assign(formValues, {
      time: [new Date(startTime), new Date(endTime)],
      blacklist: blacklist.map((v: any) => v.blacklistId),
      ...params,
    });
  }
  modalType.value = type;
  modalVisible.value = true;
};

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  try {
    await formEl.validate();
    let { time, ...values } = formValues;
    let startTime;
    let endTime;
    if (time) {
      startTime = dayjs(time[0]).format("YYYY-MM-DD HH:mm:ss");
      endTime = dayjs(time[1]).format("YYYY-MM-DD HH:mm:ss");
    }
    if (!values.blacklistFlag) {
      values.blacklist = [];
    } else {
      values.blacklist = values.blacklist.map((item: any) => {
        return {
          blacklistId: item,
          blacklistName: blacklist.value.find((v: any) =>
            checkStringEqual(v.id, item)
          ).blacklistName,
        };
      });
    }
    if (!values.whitelistFlag) {
      values.whitelist = null;
    }
    if (checkStringEqual(values.configType, 3)) {
      values.boothName = null;
    }
    if (checkStringEqual(values.skipType, 1)) {
      values.skipParam = null;
    } else {
      values.skipActivityName = null;
      values.skipActivityId = null;
    }
    let res: any = await API[
      modalType.value === DrawerType.Create
        ? "SaveBoothConf"
        : "updateBoothConf"
    ]({ ...values, startTime, endTime });
    if (checkStringEqual(res?.code, 0)) {
      getData({ ...pageParams, pageNum: pageNum.value });
      onClose();
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
      border-radius: 4px;
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
    .el-input-number,
    .el-upload {
      width: 480px;
    }
    .el-upload {
      flex-direction: column;
      align-items: flex-start;
    }
    .upload-btn {
      border: 1px dashed rgba(0, 0, 0, 0.2);
      background: rgba(64, 120, 224, 0.1);
      height: 40px;
      color: #4078e0;
      justify-content: flex-start;
    }
    .upload-btns {
      margin-top: 8px;
      width: 80px !important;
      padding: 8px 12px;
    }
    .boothPicture {
      width: 160px;
      height: 90px;
    }
    .desc {
      font-weight: 400;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.4);
      line-height: 16px;
      text-align: left;
      margin-top: 8px;
    }
    .equityImageUrl {
      width: 160px;
      height: 120px;
      border-radius: 8px 8px 8px 8px;
      margin-right: 12px;
    }
  }
  :deep(.pd-modal) {
    .el-dialog__footer {
      .el-button {
        height: 40px;
        width: 76px;
        &--primary {
          background: linear-gradient(180deg, #205ccb 0%, #598ff1 100%);
        }
      }
    }
    .pd-table {
      border-radius: 0;
      .el-table__cell {
        background-color: #f2f4f8;
      }
    }
    .el-pagination {
      margin-right: 0;
    }
  }
}
</style>
