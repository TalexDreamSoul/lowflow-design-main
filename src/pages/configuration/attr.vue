<template>
  <div class="attr list-layout">
    <div class="title">属性列表</div>
    <div class="search">
      <el-form :inline="true" :model="pageParams">
        <el-form-item>
          <el-input  v-model="pageParams.fieldName" placeholder="属性名称" clearable :suffix-icon="Search" />
        </el-form-item>
      </el-form>
    </div>
    <div class="content">
      <el-watermark content="11111" :font="{ color: 'rgba(0, 0, 0, 0.15)' }">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="field" label="属性编码" width="113" />
          <el-table-column prop="fieldName" label="属性名称" width="240" />
          <el-table-column prop="describe" label="属性说明" width="566" />
          <el-table-column prop="fieldType" label="数据类型" width="161">
            <template #default="scope">
              {{ ATTR_FIELD_TYPE.find(v => checkStringEqual(v.value, scope.row.fieldType))?.label }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="142">
            <template #default="scope">
              <el-tag v-if="!!scope.row.status"
                :type="checkStringEqual(scope.row.status, ConfigStatus.Available) ? '' : 'info'">{{
                  checkStringEqual(scope.row.status, ConfigStatus.Available) ? '可用' : '已下线' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="240">
            <template #default="scope">
              <el-button class="action-btn" @click="handleSetStatus(scope.row)" link type="primary">{{
                checkStringEqual(scope.row.status,
                  ConfigStatus.Available) ? '下线' : '上线' }}</el-button>
              <el-button class="action-btn" @click="handleModal(DrawerType.Edit, scope.row)" link
                type="primary">编辑</el-button>
              <el-button class="action-btn" @click="handleModal(DrawerType.Detail, scope.row)" link
                type="primary">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-watermark>
      <el-pagination background layout="prev, pager, next, jumper" :total='total' :page-sizes="[10]"
        v-model:current-page="pageNum" />
    </div>
    <el-dialog class="attr-modal" destroy-on-close :close-on-click-modal="false" v-model="modalVisible"
      :title='ModalTitleMap[modalType]'>
      <el-form :disabled="checkStringEqual(modalType, DrawerType.Detail)" ref="attrFormRef" :hide-required-asterisk="true"
        label-position='top' class="form" :model="formValues">
        <el-form-item :rules="[
          { required: true, message: '请输入属性编码' },
          { pattern: /^[a-zA-Z0-9_]{1,18}$/, message: '仅支持数字、字母、下划线，不超过18个字符' },
        ]" label="属性编码" prop="field">
          <el-input :disabled="true"  v-model="formValues.field" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item :rules="[
          { required: true, message: '请输入属性名称' },
          { pattern: /^[\u4e00-\u9fa5a-zA-Z_\d]{1,18}$/, message: '仅支持数字、汉字、字母、下划线，不超过18个字符' },
        ]" label="属性名称" prop="fieldName">
          <el-input  v-model="formValues.fieldName" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item :rules="[
          { required: true, message: '请选择数据类别' },
        ]" label="数据类别" prop="fieldType">
          <el-select :disabled="true" v-model="formValues.fieldType" placeholder="请选择" clearable>
            <el-option v-for="item of ATTR_FIELD_TYPE" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :rules="[
          { max: 40, message: '最多可输入40字' },
        ]" label="属性说明" prop="fieldValue">
          <el-input v-model="formValues.describe" :autosize="{ minRows: 4 }" type="textarea" :show-word-limit='true'
            placeholder="请输入" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button v-if="modalType === DrawerType.Detail"  round
            @click="modalVisible = false">返回</el-button>
          <el-button v-if="modalType !== DrawerType.Detail"  round
            @click="modalVisible = false">取消</el-button>
          <el-button v-if="modalType !== DrawerType.Detail"  @click.prevent="onSubmitAttr(attrFormRef)"
            round type="primary">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, watch, onMounted } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { ATTR_FIELD_TYPE, ConfigStatus } from '~/constants';
import { checkStringEqual, debounce } from '~/utils/common';
import { FormInstance } from 'element-plus';
import API from '~/api/configuration';
import "element-plus/theme-chalk/el-message-box.css";

enum DrawerType {
  Create = 'create',
  Detail = 'detail',
  Edit = 'edit'
};

const ModalTitleMap: any = {
  [DrawerType.Create]: '新建属性',
  [DrawerType.Detail]: '属性详情',
  [DrawerType.Edit]: '编辑属性',
};

const pageParams = reactive({
  fieldName: '',
});

const defaultFormValues = {
  field: '',
  fieldName: '',
  describe: '',
  fieldType: '',
};
const formValues: any = reactive({ ...defaultFormValues });

const total = ref(0);
const tableData = ref<any[]>([]);
const modalVisible = ref(false);
const modalType = ref('');
const attrFormRef = ref<FormInstance>();
const pageNum = ref(1);

watch(pageParams, debounce(() => {
  getData({...pageParams, pageNum: 1});
}, 200));

watch(pageNum, () => {
  getData({...pageParams, pageNum: pageNum.value});
});

onMounted(() => {
  getData({...pageParams, pageNum: 1})
});

const getData = async (params: any) => {
  try {
    let res = await API.qryAttrDict({
      ...params,
      pageSize: 10
    });
    if (checkStringEqual(res?.code, 0)) {
      total.value = res?.data?.total;
      tableData.value = res?.data?.records;
    }
  } catch (error) {
    console.error(error);
  }
}

const handleSetStatus = async (values: any) => {
  let res = await API.updateAttrDict({
    ...values,
    status: ConfigStatus.Available === values.status ? ConfigStatus.Offline : ConfigStatus.Available
  });
  if (checkStringEqual(res?.code, 0)) {
    getData({...pageParams, pageNum: pageNum.value});
  }
}

const handleModal = async (type: string, values?: any) => {
  if (type === DrawerType.Create) {
    Object.assign(formValues, defaultFormValues);
  } else {
    let { eventAttr, ...params } = values;
    Object.assign(formValues, { ...params, attrTableData: eventAttr?.attrs || [] });
  }
  modalType.value = type;
  modalVisible.value = true;
}

const onSubmitAttr = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  try {
    await formEl.validate();
    let res = await API.updateAttrDict(formValues);
    if (checkStringEqual(res?.code, 0)) {
      getData({...pageParams, pageNum: pageNum.value});
      modalVisible.value = false;
    }
  } catch (error) {
    console.error(error);
  }
}
</script>
<style lang="scss">
@import '~/styles/list-layout.scss';

.attr {
  .attr-modal {
    border-radius: 8px;

    .el-dialog__title {
      font-size: 20px;
      font-weight: 500;
      color: #000000;
      line-height: 24px;
    }

    .el-dialog__close {
      font-size: 24px;
      color: #90A0B8;
    }

    .el-dialog__body {
      padding-top: 14px;
    }
  }

  .form .el-form-item {
    .el-form-item__label {
      color: rgba(0, 0, 0, 0.9);
    }

    &:not(:last-child) {
      width: 50%;
    }
  }
}
</style>