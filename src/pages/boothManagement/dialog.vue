<template>
  <el-dialog
    class="pd-modal"
    destroy-on-close
    :close-on-click-modal="false"
    v-model="modalVisible"
    title="选择活动"
    :width="800"
  >
    <el-table
      class="pd-table"
      :data="tableData"
      style="width: 100%"
      row-key="activityId"
    >
      <el-table-column label="选择">
        <template #default="scope">
          <el-checkbox
            :model-value="
              checkStringEqual(skipActivityId, scope.row.activityId)
            "
            @change="
              () => {
                skipActivityId = scope.row.activityId;
                skipActivityName = scope.row.activityName;
              }
            "
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="activityId"
        label="H5活动ID"
        width="220"
        show-overflow-tooltip
      />
      <el-table-column
        prop="activityName"
        label="H5活动名称"
        width="220"
        show-overflow-tooltip
      />
      <el-table-column label="活动有效期" width="220">
        <template #default="scope">
          <div v-if="scope.row.activityBeginTime">
            <span
              >{{ scope.row.activityBeginTime }}至{{
                scope.row.activityEndTime
              }}</span
            >
          </div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column label="包含玩法" width="220" show-overflow-tooltip>
        <template #default="scope">
          <div>
            <span v-if="!scope.row.playTypeList.length">-</span>
            <span v-for="(item, key) in scope.row.playTypeList">{{
              activities[item]
            }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="creatorName" label="创建人" width="120" />
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next, jumper"
      :total="total"
      :page-sizes="[5]"
      :default-page-size="5"
      @current-change="currentChange"
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button round @click="modalVisible = false">取消</el-button>
        <el-button @click.prevent="onSubmit" round type="primary"
          >保存</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ElMessage } from "element-plus";
import { ref, defineExpose, defineProps, onMounted } from "vue";
import { pageActivityList } from "~/api/activity";
import { checkStringEqual } from "~/utils/common";

const props = defineProps(["skipActivityId", 'onSelectActivity']);
interface ActivityTypes {
  [key: string]: string;
}

const activities: ActivityTypes = {
  "1": "问卷玩法",
  "2": "抽奖玩法",
  "3": "签到玩法",
  "4": "任务玩法",
  "5": "领奖玩法",
  "6": "表单组件",
};

const modalVisible = ref(false);
const total = ref(0);
const tableData = ref<any[]>([]);
const pageNum = ref(1);
const skipActivityId = ref<any>(null);
const skipActivityName = ref<any>(null);

onMounted(() => {
  getData({ pageNum: 1 });
});

const currentChange = (value: number) => {
  pageNum.value = value;
  getData({ pageNum: value });
};

const getData = async (params: any) => {
  try {
    let res: any = await pageActivityList({
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

const onSubmit = async () => {
  if(!skipActivityId.value) {
    console.log(props);
    ElMessage.error("请选择活动");
    return;
  }
  props?.onSelectActivity?.({ skipActivityId: skipActivityId.value, skipActivityName: skipActivityName.value });
  modalVisible.value = false;
};
defineExpose({ modalVisible });
</script>
