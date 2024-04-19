<template>
  <div class="hand-add">
    <div class="search">
      <el-form :inline="true" :model="pageParams" style="margin-left: 10px">
        <el-form-item>
           
            <el-select v-model="pageParams.source"   style="width:200px !important" placeholder="类别" clearable>
            <el-option
              v-for="item of PEOPLE_SOURCE"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="pageParams.value"
            style="width:300px !important"
            placeholder="请输入客户姓名或者手机号"
            clearable
            :suffix-icon="Search"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            v-if="drawerType === DrawerType.Edit"
            @click.prevent="handleAdd"
            type="primary"
            >手动添加</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="table" style="width: 100%; overflow: hidden">
      <el-table
        ref="multipleTableRef"
        :data="tableData"
        style="width: 100%"
        @select="handleSelect"
        @select-all="handleSelectAll"
        row-key="id"
      >
        <el-table-column
          v-if="drawerType === DrawerType.Create"
          type="selection"
          width="46"
        />
        <el-table-column prop="id" label="客户ID" width="74" />
        <el-table-column prop="name" label="客户名" min-width="72" />
        <el-table-column prop="itFinCode" label="互金客户号" width="110" />
        <el-table-column
          prop="phone"
          label="手机号"
          width="117"
        ></el-table-column>
        <!-- <el-table-column prop="sex" label="性别" min-width="51">
          <template #default="scope">
            {{
              PEOPLE_SEX.find((v) => checkStringEqual(v.value, scope.row.sex))
                ?.label || "未知"
            }}
          </template>
        </el-table-column> -->
        <!-- <el-table-column
          prop="province"
          label="省份"
          width="77"
        ></el-table-column>
        <el-table-column prop="city" label="城市" width="75"></el-table-column> -->
        <el-table-column
          prop="birthday"
          label="生日"
          width="92"
        ></el-table-column>
        <el-table-column prop="source" label="来源" width="107">
          <template #default="scope">
            {{
              PEOPLE_SOURCE.find((v) =>
                checkStringEqual(v.value, scope.row.source)
              )?.label
            }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="drawerType === DrawerType.Edit"
          label="操作"
          width="77"
        >
          <template #default="scope">
            <el-button
              link
              type="primary"
              class="action-btn"
              @click="handleDelete(scope.row)"
              >移除</el-button
            >
          </template>
        </el-table-column>
        <template #empty>
          <el-empty :image="Maskgroup" :image-size="76">
            <template #description>
              暂无数据
            </template>
          </el-empty>
        </template>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next, jumper"
        :total="total"
        :page-sizes="[5]"
        :default-page-size="5"
        @current-change="currentChange"
      />
    </div>
    <Dialog
      v-if="drawerType === DrawerType.Edit"
      ref="dialogRef"
      :form-values="{ ...formValues }"
    />
  </div>
</template>
<script lang="ts" setup>
import {
  reactive,
  ref,
  watch,
  onMounted,
  defineExpose,
  defineProps,
} from "vue";
import { PEOPLE_SOURCE, PEOPLE_SEX, BlackAddTypeEnum } from "~/constants";
import API from "~/api/customer";
import { checkStringEqual, debounce } from "~/utils/common";
import { Search } from "@element-plus/icons-vue";
import Dialog from "./dialog.vue";
import Maskgroup from "~/assets/icon/Maskgroup.png";

const props = defineProps(["drawerType", "formValues"]);

enum DrawerType {
  Create = "create",
  Detail = "detail",
  Edit = "edit",
}

const pageParams = reactive({
  value: "",
  source: "",
});

const total = ref(0);
const tableData = ref<any[]>([]);
const multipleTableRef = ref<any>();
const multipleSelection = ref<any[]>([]);
const dialogRef = ref<any>();
const pageNum = ref(1);

watch(
  pageParams,
  debounce(() => {
    if ("id" in props.formValues && props.formValues?.id !== null) {
      getSelectData({ ...pageParams, pageNum: 1 });
    } else {
      getData({ ...pageParams, pageNum: 1 });
    }
  }, 200)
);

onMounted(() => {
  if ("id" in props.formValues && props.formValues?.id !== null) {
    getSelectData({ ...pageParams, pageNum: 1 });
  } else {
    getData({ ...pageParams, pageNum: 1 });
  }
});

const currentChange = (value: number) => {
  pageNum.value = value;
  if ("id" in props.formValues && props.formValues?.id !== null) {
    getSelectData({ ...pageParams, pageNum: value });
  } else {
    getData({ ...pageParams, pageNum: value });
  }
};

const handleDelete = async (row: any) => {
  let res = await API.deleteCustomBlacklistRelation({
    blacklistId: props.formValues?.id,
    customId: row.id,
  });
  if (checkStringEqual(res?.code, 0)) {
    getSelectData({ pageNum: pageNum.value, id: props?.formValues?.id, pageParams });
  }
};

const handleSelectAll = (selection: any) => {
  let arr = multipleSelection.value;
  if (selection.length) {
    arr = arr.concat(selection.map((v: any) => v.id));
  } else {
    tableData.value.forEach((item: any) => {
      arr.splice(
        arr.findIndex((v) => v === item.id),
        1
      );
    });
  }
  multipleSelection.value = Array.from(new Set(arr));
};

const handleSelect = (selection: any, row: any) => {
  let isAdd = selection.some((v: { id: any }) => v.id === row.id);
  let arr = multipleSelection.value;
  if (isAdd) {
    arr = [...arr, row.id];
  } else {
    arr.splice(
      arr.findIndex((v) => v === row.id),
      1
    );
  }
  multipleSelection.value = arr;
};

const getSelectData = async (params: any) => {
  console.log(`output->type`,props.drawerType)
  let res = await API.blacklistContainCustoms({
    id: props.formValues.id,
    ...params,
    pageSize: 5,
    addType: props.drawerType!=="detail"? BlackAddTypeEnum.Manual:"",
  });
  if (checkStringEqual(res?.code, 0)) {
    total.value = res?.data?.total;
    tableData.value = res?.data?.records;
  }
};

const handleAdd = () => {
  dialogRef.value!.modalVisible = true;
};

const getData = async (params: any) => {
  try {
    let res = await API.qryCustomList({
      ...params,
      pageSize: 5,
    });
    if (checkStringEqual(res?.code, 0)) {
      total.value = res?.data?.total;
      tableData.value = res?.data?.records;
    }
  } catch (error) {
    console.error(error);
  }
};
defineExpose({ multipleSelection, getSelectData });
</script>
