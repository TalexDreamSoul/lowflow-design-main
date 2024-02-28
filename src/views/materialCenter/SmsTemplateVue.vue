<script setup lang="ts">
import { ref, unref, reactive, onMounted, watch } from "vue";
import dayjs from "dayjs";
import {
  getQryMaterial,
  setDeleteMaterial,
  setUpdateMaterialStatus,
} from "~/api/index";
import { useRouter, useRoute } from "vue-router";
import { Search } from "@element-plus/icons-vue";
import { ElMessageBox, ElMessage, ElTag } from "element-plus";
import CustomEventComponent from "./CustomEventComponent.vue";
import { createTemplatePopover } from "~/utils/touch-templates";
import { materialType } from "~/utils/common";

// 使用 useRoute 获取当前路由信息
const route = useRoute();
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
// const crudVisibles = reactive({
//   create: false,
//   read: false,
//   update: false,
//   delete: false,
// })

const value = ref();

function getNameByValue(data: any[], val: string) {
  const item = data.find((item: { value: any }) => item.value === val);
  return item ? item.name : "";
}

const materialTypeName = ref(getNameByValue(materialType, route.params.type));

console.log(materialTypeName); // 输出：短信
onMounted(async () => {
  fetchDataApi();
});

watch(
  () => route.fullPath,
  (val) => {
    console.log(`output->val`, val);
    materialTypeName.value = getNameByValue(materialType, route.params.type);
    formInline.type = route.params.type;
    fetchDataApi();
  }
);
watch([currentPage, pageSize, formInline, value], () => {
  fetchDataApi();
});
const fetchDataApi = async () => {
  const res = await getQryMaterial({
    pageNum: unref(currentPage),
    pageSize: unref(pageSize),
    ...formInline,
  });
  tableData.value = res.data.records;
  total.value = res.data.total;
  console.log(`output->tabledata`, tableData.value);
};
const delData = async (row: any) => {
  let res = await setDeleteMaterial({
    id: row.id,
    status: row.status,
    type: formInline.type,
  });
  if (res?.code == 0) {
    fetchDataApi();
    ElMessage.success(res.message);
  }

  // ElMessageBox.alert("删除后将无法恢复", "确认删除", {
  //   showCancelButton: true,
  //   roundButton: true,
  //   cancelButtonClass: "pd-button",
  //   confirmButtonClass: "pd-button",
  //   customClass: "delete-modal",
  // }).then(async () => {

  // });
};
// 上线素材
const updateMaterialStatusData = async (row: any, status: String) => {
  let res = await setUpdateMaterialStatus({
    id: row.id,
    status: status,
    type: formInline.type,
  });
  if (res?.code == 0) {
    ElMessage.success(res.message);
    fetchDataApi();
  }
};

const detailsData = async (row: any) => {
  // value.value = row;
  // createTemplatePopover('新建企微模版', 'digital')
  // createTemplatePopover('新建站内信模版', 'znx', value)
  const { content, ...rest } = row;
  value.value = { ...content, ...rest };
  console.log(`output->row`, row);
  let name = `${materialTypeName.value}模版详情`;
  createTemplatePopover(name, row.type, value, "details", true);
  // createTemplatePopover('新建APP Push模版', 'app')
  // createTemplatePopover('新建外呼模版', 'outbound')
};

const addData = async () => {
  value.value = "";
  let name = "新建" + materialTypeName.value + "模版";

  // @ts-ignore force
  createTemplatePopover(name, route.params.type).then(fetchDataApi);
};
const updateData = (row: any) => {
  ElMessageBox.alert(
    `当前有${row.usedCount}个策略流程正在使用该模版（流程LC1、LC5、LC22正在使用），确认后该修改内容会更新至正在使用的流程中`,
    "确认编辑",
    {
      showCancelButton: true,
      roundButton: true,
      cancelButtonClass: "pd-button",
      confirmButtonClass: "pd-button",
      customClass: "delete-modal",
    }
  ).then(async () => {
    const { content, ...rest } = row;
    value.value = { ...content, ...rest };
    let name = "编辑" + materialTypeName.value + "模版";
    createTemplatePopover(name, route.params.type, value, "update");
  });
};
const handleSizeChange = (val: any) => {
  console.log(`${val} items per page`);
};
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
};
</script>

<template>
  <CustomEventComponent :title="route.params.type == 'all' ? `${materialTypeName}` : `${materialTypeName}模版列表`"
    :tableData="tableData" :total="total">
    <template #search>
      <div class="search">
        <el-form :inline="true">
          <el-form-item label="创建时间：">
            <el-date-picker v-model="time" type="daterange" range-separator="To" start-placeholder="开始日期"
              end-placeholder="结束日期" :size="size" @change="(val) => {
                formInline.beginTime = dayjs(val[0]).format('YYYY-MM-DD');
                formInline.endTime = dayjs(val[1]).format('YYYY-MM-DD'); val[0];
              }" />
          </el-form-item>
          <el-form-item v-if="route.params.type == 'all'">
            <el-select v-model="formInline.type" style="width:200px" placeholder="模板类型">
              <el-option v-for="item in materialType" :label="item.name" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="formInline.status" clearable style="width:200px" placeholder="模板状态">
              <el-option label="可用" value="available" />
              <el-option label="下线" value="offline" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="formInline.name" :placeholder="`请输入${materialTypeName}模板名称`" clearable style="width:200px"
              :suffix-icon="Search" />
          </el-form-item>

        </el-form>
        <div v-if="route.params.type != 'all'">
          <el-button type="primary" class="add" @click="addData()" round>新建{{ materialTypeName }}模版</el-button>
        </div>
      </div>
    </template>
    <template #table="{ tableData }">

      <el-table :data="tableData">
        <el-table-column label="模版ID" prop="id" />
        <el-table-column label="模版名称" prop="name" />
        <el-table-column label="状态">
          <template #default="scope">
            <el-tag class="mx-1"
              :type="statusLabels[scope.row.status].type ? statusLabels[scope.row.status].type : 'info'" effect="light">
              {{ statusLabels[scope.row.status].Text }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" width="180" prop="updatedTime" />
        <el-table-column label="创建时间" width="180" prop="createTime" />
        <el-table-column label="创建人" prop="createBy" />
        <el-table-column label="正在使用" prop="usedCount">
          <template #default="scope">
            <span :style="scope.row.usedCount > 0 ? 'color: #00C068' : 'color: #333'">{{ scope.row.usedCount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="scope">
            <el-space wrap v-if="route.params.type != 'all'">
              <el-link type="primary" v-if="scope.row.status == 'offline'"
                @click="updateMaterialStatusData(scope.row, 'available')">上线</el-link>
              <el-link type="primary" v-if="scope.row.status !== 'offline'"
                @click="updateMaterialStatusData(scope.row, 'offline')">下线</el-link>
              <el-link type="primary" @click="updateData(scope.row)">编辑</el-link>
              <el-popover trigger="click" :visible="scope.delete" placement="top" :width="160">
                <p>是否确认删除？</p>
                <div @click="scope.delete = false" style="text-align: right; margin: 0">
                  <!-- <el-button size="small" @click="scope.delete = false" text >取消</el-button> -->
                  <el-button size="small" type="primary" @click="delData(scope.row)" primaryStyle>确认</el-button>
                </div>
                <template #reference>
                  <el-link type="primary" @click="scope.delete = true">删除</el-link>
                </template>
              </el-popover>

              <el-link type="primary" @click="detailsData(scope.row)">查看详情</el-link>
            </el-space>
            <el-link v-else type="primary" @click="detailsData(scope.row)">查看详情</el-link>

          </template>
        </el-table-column>
      </el-table>
    </template>
    <template #pagination>
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" background
        layout="prev, pager, next, sizes, jumper" :page-sizes="[10]" :small="small" :disabled="disabled" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" class="pagination" />
    </template>
  </CustomEventComponent>
</template>


<style lang="scss" scoped>
@import "./material.scss";
</style>