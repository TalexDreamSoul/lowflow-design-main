<script setup lang="ts">
import { ref, unref, reactive, onMounted, watch } from "vue";
import dayjs from "dayjs";
import {
  getQryMaterial,
  dictFilterTree,
  setDeleteMaterial,
  setUpdateMaterialStatus,
} from "~/api/index";
import { useRouter, useRoute } from "vue-router";
import { Search } from "@element-plus/icons-vue";
import { ElMessageBox, ElMessage, ElTag } from "element-plus";
import CustomEventComponent from "~/components/CustomEventComponent.vue";
import { createTemplatePopover } from "~/utils/touch-templates";
import { getDictmaterialType } from "~/utils/common";
import { de, el } from "element-plus/es/locale";
import Maskgroup from "~/assets/icon/Maskgroup.png";

// 使用 useRoute 获取当前路由信息
const route = useRoute();

console.log("1", String(route.params.type).replace("Template", ""));

// 通过 route.params 获取路由中的 type 参数
// const getType = route.params.type;
const formInline = ref({
  name: "",
  // type	素材类型：sms 短信，appPush app消息，digital 数字员工，outbound 智能外呼，znx 站内信
  type: String(route.params.type).replace("Template", ""),
  beginTime: "",
  endTime: "",
  status: "",
});
const tableData = ref([]); // 表格数据
const total = ref(0); // 总数
const currentPage = ref(1);
const pageSize = ref(10);
const small = ref(false);
const background = ref(false);
const disabled = ref(false);
const time = ref(null);
const statusLabels: Record<string, StatusLabel> = {
  available: { text: "可用", type: "success" },
  offline: { text: "下线", type: "info" },
};
// const crudVisibles = reactive({
//   create: false,
//   read: false,
//   update: false,
//   delete: false,
// })

interface StatusLabel {
  text: string;
  type: string;
}

const getStatusType = (status: string) =>
  (statusLabels[status]?.type as
    | ""
    | "success"
    | "warning"
    | "info"
    | "danger") || "";
const getStatusText = (status: string) =>
  statusLabels[status]?.text || "其他状态";

const value = ref();
type MaterialType = {
  name: string;
  value: string;
};

const materialType = ref<MaterialType[]>([]);

const getDictmaterialType = async () => {
  const res: any = await dictFilterTree();
  let { materialTypes } = res?.data;
  let getDictmaterialList = [];
  getDictmaterialList = materialTypes.map(
    (item: { code: any; message: any }) => {
      return {
        value: item.code,
        name: item.message,
      };
    }
  );
  getDictmaterialList.unshift({ value: "all", name: "模版总览" });
  materialType.value = getDictmaterialList;

  console.log(materialType, "materialType");

  materialTypeName.value = getNameByValue(
    materialType.value,
    String(route.params.type).replace("Template", "")
  );
};
onMounted(async () => {
  fetchDataApi();
  getDictmaterialType();
});

function getNameByValue(data: any[], val: string) {
  const item = data?.find((item: { value: any }) => item.value === val);
  return item ? item.name : "";
}

const materialTypeName = ref("");

watch(
  () => route.fullPath,
  (val) => {
    console.log(`output->val`, val);
    materialTypeName.value = getNameByValue(
      materialType.value,
      String(route.params.type).replace("Template", "")
    );

    formInline.value = {
      name: "",
      // type	素材类型：sms 短信，appPush app消息，digital 数字员工，outbound 智能外呼，znx 站内信
      type: String(route.params.type).replace("Template", ""),
      beginTime: "",
      endTime: "",
      status: "",
    };
    time.value = null;
    fetchDataApi();
  }
);
watch([currentPage, pageSize, value], () => {
  console.log(formInline.value,"formInline")
  // formInline.value.name,formInline.value.status,formInline.value.beginTime,formInline.value.status,formInline.value.endTime,
  fetchDataApi();
});
// formInline.value.name,formInline.value.status,formInline.value.beginTime,formInline.value.status,formInline.value.endTime,
const fetchDataApi = async () => {
  const res = (await getQryMaterial({
    pageNum: unref(currentPage),
    pageSize: unref(pageSize),
    ...formInline.value,
  })) as { code: any; message: any; data: any };
  tableData.value = res.data.records;
  total.value = res.data.total;
  console.log(`output->tabledata`, tableData.value);
};
const delData = async (row: any) => {
  console.log("row", row);
  let describeMessage = "删除后将无法恢复，是否确认删除？";
  if (row.usedCount > 0) {
    describeMessage = `当前有${row.usedCount}个策略流程正在使用该模版（流程${row.usedTouchNames}正在使用）`;
  }
  ElMessageBox.alert(describeMessage, "确认删除", {
    showCancelButton: true,
    roundButton: true,
    cancelButtonClass: "pd-button",
    confirmButtonClass: "pd-button",
    customClass: "delete-modal",
  }).then(async () => {
    let res = (await setDeleteMaterial({
      id: row.id,
      status: row.status,
      type: formInline.value.type,
    })) as { code: any; message: any; data: any };
    if (res?.code == 0) {
      fetchDataApi();
      ElMessage.success(res.message);
    }
  });
};
// 上线素材
const updateMaterialStatusData = async (row: any, status: String) => {
  let res = (await setUpdateMaterialStatus({
    id: row.id,
    status: status,
    type: formInline.value.type,
  })) as { code: any; message: any; data: any };
  if (res?.code == 0) {
    ElMessage.success(res.message);
    fetchDataApi();
  }
};

const detailsData = async (row: any) => {
  updateData(row, true, "details");
};

const addData = async () => {
  value.value = "";
  let name = "新建" + materialTypeName.value + "模版";

  // @ts-ignore force
  createTemplatePopover(name, formInline.value.type).then(fetchDataApi);
};
const updateData = (row: any, readonly: boolean = false, type?: any) => {
  const { content, ...rest } = row;
  if (formInline.value.type == "digital") {
    value.value = row;
  } else {
    value.value = { ...content, ...rest };
  }

  if (row.usedCount > 0 && type != "details") {
    ElMessageBox.alert(
      `当前有${row.usedCount}个策略流程正在使用该模版（流程${row.usedTouchNames}正在使用），确认后该修改内容会更新至正在使用的流程中`,
      "确认编辑",
      {
        showCancelButton: true,
        roundButton: true,
        cancelButtonClass: "pd-button",
        confirmButtonClass: "pd-button",
        customClass: "delete-modal",
      }
    ).then(async () => {
      let name =
        (!readonly ? "编辑" : "查看") + materialTypeName.value + "模版";
      createTemplatePopover(
        name,
        !readonly ? formInline.value.type : row.type,
        value,
        readonly ? "details" : "update",
        readonly
      ).then(fetchDataApi);
    });
  } else {
    console.log(`output->value`, value, row);
    let name = (!readonly ? "编辑" : "查看") + materialTypeName.value + "模版";
    createTemplatePopover(
      name,
      !readonly ? formInline.value.type : row.type,
      value,
      readonly ? "details" : "update",
      readonly
    ).then(fetchDataApi);
  }
};
const handleSizeChange = (val: any) => {
  console.log(`${val} items per page`);
};
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
};
const changeTime = (val: any) => {
  console.log(val, "change");
  if (val == null) {
    formInline.value.beginTime = "";
    formInline.value.endTime = "";
  } else {
    formInline.value.beginTime = dayjs(val[0]).format("YYYY-MM-DD");
    formInline.value.endTime = dayjs(val[1]).format("YYYY-MM-DD");
  }
  fetchDataApi();

};

const changeStatus = (val: string) => {
  formInline.value.status=val
  fetchDataApi();
};
const changeType = (val: string) => {
  formInline.value.type=val
  fetchDataApi();
};

const changeName = (val: string) => {
  formInline.value.name=val
  fetchDataApi();
};

</script>

<template>
  <CustomEventComponent :title="String(route.params.type).replace('Template', '') == 'all' ? `${materialTypeName}` : `${materialTypeName}模版列表`
    " :tableData="tableData" :total="total">
    <template #search>
      <div class="search">
        <el-form :inline="true">
          <el-form-item label="创建时间:">
            <el-date-picker v-model="time" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :size="size" @change="changeTime" />
          </el-form-item>
          <el-form-item v-if="String(route.params.type).replace('Template', '') == 'all'" label="模板类型:" @change="changeType">
            <el-select v-model="formInline.type" style="width: 200px" placeholder="模板类型">
              <el-option v-for="item in materialType" :label="item.name" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="模板状态:">
            <el-select v-model="formInline.status" clearable style="width: 200px" placeholder="模板状态" @change="changeStatus">
              <el-option label="可用" value="available" />
              <el-option label="下线" value="offline" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="formInline.name" :placeholder="`请输入${materialTypeName}模板名称`" clearable style="width: 200px" :suffix-icon="Search" maxlength="50"  @input="changeName" />
          </el-form-item>
        </el-form>
        <div v-if="String(route.params.type).replace('Template', '') != 'all'">
          <el-button type="primary" class="add" @click="addData()" round>新建{{ materialTypeName }}模版</el-button>
        </div>
      </div>
    </template>
    <template #table="{ tableData }">
      <el-table :data="tableData">
        <el-table-column label="模版ID" prop="id" />
        <el-table-column label="模版名称" prop="name" />
        <el-table-column label="模版类型" prop="type">
          <template #default="scope">
            <!-- {{             getNameByValue(materialType, String(scope.row.type))
          }} -->
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template #default="scope">
            <el-tag class="mx-1" :type="getStatusType(scope.row.status)" effect="light">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" width="180" prop="updatedTime" />
        <el-table-column label="创建时间" width="180" prop="createTime" />
        <el-table-column label="创建人" prop="createUserName" />
        <el-table-column label="正在使用" prop="usedCount">
          <template #default="scope">

            <el-tooltip placement="bottom" v-if="scope.row.usedCount > 0">
              <template #content> {{ `流程${scope.row.usedTouchNames}正在使用` }}</template>
              <span style="color: #00C068">{{
                scope.row.usedCount
              }}</span>
            </el-tooltip>
            <span v-else style="color: #333">{{
              scope.row.usedCount
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="scope">
            <el-space wrap v-if="String(route.params.type).replace('Template', '') != 'all'">
              <el-link type="primary" v-if="scope.row.status == 'offline'" @click="updateMaterialStatusData(scope.row, 'available')">上线</el-link>
              <el-link type="primary" v-if="scope.row.status !== 'offline'" @click="updateMaterialStatusData(scope.row, 'offline')">下线</el-link>
              <el-link type="primary" @click="updateData(scope.row)">编辑</el-link>
              <el-link type="primary" @click="delData(scope.row)">删除</el-link>

              <el-link type="primary" @click="detailsData(scope.row)">查看详情</el-link>
            </el-space>
            <el-link v-else type="primary" @click="detailsData(scope.row)">查看详情</el-link>
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
    </template>
    <template #pagination>
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" background layout="prev, pager, next, jumper" :page-sizes="[10]" :small="small" :disabled="disabled" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" class="pagination" />
    </template>
  </CustomEventComponent>
</template>

<style lang="scss" scoped>
@import "./material.scss";
</style>
