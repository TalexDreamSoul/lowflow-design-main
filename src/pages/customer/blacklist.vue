<template>
  <div class="customer-blacklist list-layout">
    <div class="title">黑名单列表</div>
    <div class="search">
      <el-form :inline="true" :model="pageParams">
        <el-form-item label="创建日期">
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
            v-model="pageParams.blacklistName"
            placeholder="黑名单名称"
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
        >新建黑名单</el-button
      >
    </div>
    <div class="content">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="blacklistName" label="黑名单名称" width="203" />
        <el-table-column prop="blacklistDesc" label="黑名单说明" width="249">
        </el-table-column>
        <el-table-column prop="status" label="状态" width="159">
          <template #default="scope">
            <el-tag
              v-if="!!scope.row.status"
              :type="
                checkStringEqual(scope.row.status, ConfigStatus.Available)
                  ? ''
                  : 'info'
              "
              >{{
                checkStringEqual(scope.row.status, ConfigStatus.Available)
                  ? "可用"
                  : "已下线"
              }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="blacklistType" label="黑名单类型" width="249">
          <template #default="scope">
            {{
              BLACK_LIST_TYPE.find((v) =>
                checkStringEqual(v.value, scope.row.blacklistType)
              )?.label || "-"
            }}
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="238"
        ></el-table-column>
        <el-table-column
          prop="updatedTime"
          label="更新时间"
          width="238"
        ></el-table-column>
        <el-table-column
          prop="createUserName"
          label="创建人"
          width="165"
        ></el-table-column>
        <el-table-column label="正在使用" prop="usedCount" width="88">
          <template #default="scope">
            <el-tooltip placement="bottom" v-if="scope.row.usedCount > 0">
              <template #content>
                {{ `流程${scope.row.usedTouchNames}正在使用` }}</template
              >
              <span style="color: #00c068">{{ scope.row.usedCount }}</span>
            </el-tooltip>
            <span v-else style="color: #333">{{ scope.row.usedCount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="scope">
            <el-button
              @click="handleSetStatus(scope.row)"
              link
              type="primary"
              class="action-btn"
              >{{
                checkStringEqual(scope.row.status, ConfigStatus.Available)
                  ? "下线"
                  : "上线"
              }}</el-button
            >
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
        :page-sizes="[10]"
        @current-change="currentChange"
      />
    </div>
    <BlackListDrawer
      :id="drawerOptions.id"
      :type="drawerOptions.type"
      @getData="() => getData({ ...pageParams, pageNum })"
      @onCancel="onCancel"
    />
    <!-- <PdDrawer ref="drawerRef" :getData="() => getData({ ...pageParams, pageNum })" /> -->
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, watch, onMounted } from "vue";
import { ConfigStatus, BLACK_LIST_TYPE } from "~/constants";
import API from "~/api/customer";
import { checkStringEqual, debounce } from "~/utils/common";
import { Search } from "@element-plus/icons-vue";
import { ElMessageBox } from "element-plus";
import BlackListDrawer from "./BlackListDrawer.vue";
import "element-plus/theme-chalk/el-message-box.css";
import Maskgroup from "~/assets/icon/Maskgroup.png";

enum DrawerType {
  Create = "create",
  Detail = "detail",
  Edit = "edit",
}

const pageParams = reactive({
  blacklistName: "",
  labelSource: "",
  time: "",
});
const drawerOptions = reactive<{
  id: number;
  type: "create" | "edit" | "detail" | undefined;
}>({
  id: -1,
  type: undefined,
});

const pageNum = ref(1);
const total = ref(0);
const tableData = ref<any[]>([]);

const onCancel = () => {
  drawerOptions.id = -1;
  drawerOptions.type = undefined;
}

const currentChange = (value: number) => {
  pageNum.value = value;
  getData({ ...pageParams, pageNum: value });
};
watch(
  pageParams,
  debounce(() => {
    pageNum.value = 1;
    getData({ ...pageParams, pageNum: 1 });
  }, 200)
);

onMounted(() => {
  getData({ ...pageParams, pageNum: 1 });
});

const getData = async (params: any) => {
  try {
    let { time, ...values } = params;
    let beginTime;
    let endTime;
    if (time) {
      beginTime = time[0];
      endTime = time[1];
    }
    let res = await API.qryBlacklist({
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

const handleModal = async (type: typeof drawerOptions.type, values?: any) => {
  drawerOptions.id = values?.id || -1;
  drawerOptions.type = type;

  // drawerRef.value?.handleModal?.(type, values);
};

const handleSetStatus = async (values: any) => {
  let res = await API.updateCustomBlacklistStatus({
    id: values.id,
    status:
      ConfigStatus.Available === values.status
        ? ConfigStatus.Offline
        : ConfigStatus.Available,
  });
  if (checkStringEqual(res?.code, 0)) {
    getData({ ...pageParams, pageNum: pageNum.value });
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
    let res = await API.deleteBlacklist({ id: values.id });
    if (checkStringEqual(res?.code, 0)) {
      getData({ ...pageParams, pageNum: pageNum.value });
    }
  });
};
</script>

<style lang="scss">
@import "~/styles/list-layout.scss";
</style>
<style lang="scss" scoped>
.customer-blacklist {
  .flex {
    gap: 16px;

    > div {
      flex: 1;
    }
  }
  :deep(.pd-drawer) {
    .add-type-tabs {
      width: 100%;

      &.detail {
        .el-tabs__header {
          display: none;
        }
      }

      .el-tabs__header {
        border-bottom: none;
        margin: 0;
      }

      .el-tabs__content {
      }

      .el-tabs__item {
        border-bottom: 1px solid #e4e7ed;
        box-sizing: border-box;

        &.is-active {
          background: linear-gradient(180deg, #205ccb 0%, #598ff1 100%);
          color: white;
          border-bottom: none;
        }

        &:not(.is-active):hover {
          color: #303133;
        }
      }
    }

    .item {
      padding: 24px 16px 0;
     // background-color: #f2f4f8;
      margin-bottom: 16px;
    }

    .detail .item {
      background-color: #f2f4f8;
      .el-table__empty-block {
        background-color: #f2f4f8;
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

.add {
  background: linear-gradient(rgb(32, 92, 203) 0%, rgb(89, 143, 241) 100%);
  transition: 0.25s;
}
</style>
