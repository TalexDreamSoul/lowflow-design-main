<script setup lang="ts">
import { ref, unref, reactive, onMounted, watch } from "vue";
import dayjs from "dayjs";
import { useRouter, useRoute } from "vue-router";
import CustomEventComponent from "~/components/CustomEventComponent.vue";
import { createTemplatePopover } from "~/utils/touch-templates";
import { materialType } from "~/utils/common";
import API from "~/api/channelManagement";

// 使用 useRoute 获取当前路由信息
const route = useRoute();
// 通过 route.params 获取路由中的 type 参数
// const getType = route.params.type;
const formInline = reactive({
  startDate: "",
  endDate: "",
  trsPlatform: "",
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
  pointIncrease: { Text: "增加积分", type: "success" },
  pointDecrease: { Text: "减少积分", type: "info" },
  distributionEquity: { Text: "派发权益", type: "info" },
};
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

watch([currentPage, pageSize, formInline], () => {
  fetchDataApi();
});
const fetchDataApi = async () => {
  const res = await API.qryTrsRecordList({
    pageNum: unref(currentPage),
    pageSize: unref(pageSize),
    ...formInline,
  });
  tableData.value = res.data.records;
  total.value = res.data.total;
  console.log(`output->tabledata`, tableData.value);
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
    formInline.startDate = "";
    formInline.endDate = "";
  } else {
    formInline.startDate = dayjs(val[0]).format("YYYY-MM-DD");
    formInline.endDate = dayjs(val[1]).format("YYYY-MM-DD");
  }
};
</script>

<template>
    <CustomEventComponent title="交易明细" :tableData="tableData" :total="total">
      <template #search>
        <div class="search">
          <el-form :inline="true">
            <el-form-item label="创建时间：">
              <el-date-picker v-model="time" type="daterange" range-separator="To" start-placeholder="开始日期" end-placeholder="结束日期" :size="size" @change="changeTime" />
            </el-form-item>

          <el-form-item >
            <el-select v-model="formInline.trsPlatform" style="width: 200px" placeholder="模板类型">
              <el-option label="全部" value="" />
              <el-option label="积分平台" value="point" />
              <el-option label="权益厂商" value="equity" />
            </el-select>
          </el-form-item>
          </el-form>
        </div>
      </template>
      <template #table="{ tableData }">

        <el-table :data="tableData">
          <el-table-column label="交易明细ID" prop="id" />
          <el-table-column label="客户ID" prop="customId" />
          <el-table-column label="交易类型">
            <template #default="scope">
              {{ statusLabels[scope.row.trsType].Text }}
            </template>
          </el-table-column>
          <el-table-column label="交易内容" prop="trsContent">
          </el-table-column>
          <el-table-column label="数量" width="180" prop="trsCount" />
          <el-table-column label="交易来源" prop="trsSourceName">
          </el-table-column>
          <el-table-column label="交易话术" prop="trsChatContent" />
          <el-table-column label="交易成功时间" width="180" prop="createTime" />
        </el-table>
      </template>
      <template #pagination>
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" background         layout="prev, pager, next, jumper"
        :page-sizes="[10]" :small="small" :disabled="disabled" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" class="pagination" />
      </template>
    </CustomEventComponent>
</template>


<style lang="scss" scoped>
@import "./material.scss";
</style>