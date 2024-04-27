<template>
  <div class="play-container">
    <div class="tableCard">
      <el-form :inline="true" style="margin-bottom: 0px">
        <el-form-item label="筛选日期：">
          <el-date-picker
            v-model="time"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD HH:mm:ss"
            time-format="hh:mm:ss"
            :clearable="false"
          />
        </el-form-item>
      </el-form>
    </div>
    <div class="play-content" v-for="itemArr of playConfigData?.children || []">
      <div class="table-item" v-for="item of itemArr">
        <div class="title">
          <div class="text">
            {{ item.title }}
          </div>
          <el-form-item v-for="v of item.filter" :label="v.name">
            <el-select
              v-model="tableParams[v.key]"
              placeholder="请选择"
              style="width: 300px; height: 40px"
            >
              <el-option
                v-for="item of jackpotMap"
                :label="item.jackpotName"
                :value="item.jackpotId"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="content">
          <!-- :data="tableDataMap?.[item.key]?.tableData || []" -->
          <el-table
            :data="formatData(tableDataMap, item, 'data')"
            style="width: 100% ----el-table-header-bg-color: #F2F4F8;--el-table-header-bg-color: #F2F4F8;--el-table-header-text-color:#333;"
          >
            <el-table-column
              v-for="(v, key) in formatData(tableDataMap, item, 'header')"
              :label="v"
              :prop="key"
            >
              <template #default="{ row }">
                {{ statusEnay(row?.[key]) }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { dayjs } from "element-plus";
import PLAY_MAP from "./playConfig";
import { defineProps, computed, watch, reactive, ref, onMounted } from "vue";
import * as API from "~/api/activity";

const props = defineProps({
  activityId: String,
  playType: String,
  playId: String,
});

const curTime = dayjs(new Date()).format("YYYY-MM-DD");
const time = ref([
  new Date(`${curTime} 00:00:00`),
  new Date(`${curTime} 23:59:59`),
]);
const tableDataMap = reactive<any>({});
const tableParams = reactive<any>({});
const jackpotMap = ref<any>([]);

const playConfigData = computed(() => {
  return props.playType ? PLAY_MAP[props.playType] : {};
});

onMounted(async () => {
  if (playConfigData.value.url) {
    fetchDataApi();
    queryLotteryJackpot();
  }
});

watch([tableParams, props.playId, time], () => fetchDataApi());
watch([props.playId], () => queryLotteryJackpot());

const fetchDataApi = async () => {
  const { playType, ...value } = props;
  let startTime = null;
  let endTime = null;
  if (time.value) {
    startTime = dayjs(time.value?.[0] as any).format("YYYY-MM-DD HH:mm:ss");
    endTime = dayjs(time.value?.[1] as any).format("YYYY-MM-DD HH:mm:ss");
  }
  const res = await API.getPlayData(playConfigData.value.url, {
    ...value,
    startTime,
    endTime,
    ...tableParams,
  });
  Object.assign(tableDataMap, res?.data);
};

const queryLotteryJackpot = async () => {
  if (
    !playConfigData.value?.children?.some?.((item: any) =>
      item?.some?.((v: any) => "filter" in v)
    )
  )
    return;
  let res = await API.queryLotteryJackpot({ playId: props.playId });
  jackpotMap.value = res?.data;
};

const formatData = (data: any, item: any, type: any) => {
  if (type === "header") {
    return ("key" in item ? data?.[item.key] : data)?.tableHeader || {};
  } else {
    let tableData = ("key" in item ? data?.[item.key] : data)?.tableData || [];
    if (Array.isArray(tableData)) {
      return tableData;
    }
    if (tableData instanceof Object && JSON.stringify(tableData) !== "{}") {
      return [tableData];
    }
    return [];
  }
};
const statusEnay = (text: any) => {
  if (text || text === 0) {
    return text;
  } else {
    return "-";
  }
};
</script>

<style lang="scss" scoped>
.tableCard {
  background: #ffffff;
  box-shadow: 0px 20px 50px 0px rgba(0, 0, 0, 0.02);
  border-radius: 8px 8px 0px 0px;
  opacity: 1;
  padding: 24px 24px 12px 24px;
  margin-bottom: 0px;
}
.play-container {
  .play-content {
    background-color: white;
    margin-bottom: 24px;
    padding: 12px 24px 24px;
    border-radius: 8px;
    &:nth-child(2) {
      padding-top: 0px;
      border-radius: 0px 0px 8px 8px;
    }
  }
}
.el-form-item {
  margin: 0;
  align-items: center;
  :deep(.el-select) {
    .el-select__wrapper {
      height: 40px;
    }
  }
  :deep(.el-form-item__label) {
    font-size: 14px;
  }
}
.table-item {
  .title {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    .text {
      margin-right: 28px;
      line-height: 40px;
      position: relative;
      padding-left: 12px;
      font-size: 16px;
      font-weight: 500;
      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 16px;
        background: #1a1a1a;
        border-radius: 0px 0px 0px 0px;
      }
    }
  }
}
.play-content .table-item:not(:last-child) {
  margin-bottom: 12px;
}
</style>
