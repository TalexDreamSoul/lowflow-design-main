<script setup lang="ts">
import {
  ref,
  computed,
  defineAsyncComponent,
  DefineComponent,
  onMounted,
  watch,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowLeft } from "@element-plus/icons-vue";
import { dayjs } from "element-plus";
import * as API from "~/api/activity";

const router = useRouter();
const route = useRoute();

const goBack = () => {
  router.go(-1);
};

const initTabs = ["浏览数据", "转化数据", "表单数据", "玩法数据"];
const activeTab = ref("");
const curTime = dayjs(new Date()).format("YYYY-MM-DD");
const time = ref([
  new Date(`${curTime} 00:00:00`),
  new Date(`${curTime} 23:59:59`),
]);
const playTypeMap = ref([]);
const activityFormData = ref([]);

interface Components {
  [key: string]: DefineComponent<{}, {}, any>;
}
const components: Components = {
  浏览数据: defineAsyncComponent(() => import("./ComponentA.vue")),
  转化数据: defineAsyncComponent(() => import("./ComponentB.vue")),
  表单数据: defineAsyncComponent(() => import("./ComponentC.vue")),
  玩法数据: defineAsyncComponent(() => import("./ComponentD.vue")),
};
const activeTabComponent = computed(() => components[activeTab.value]);
const tabs = computed(() => {
  let res = [...initTabs];
  return res.filter((v: any) => {
    if (v === "玩法数据" && !playTypeMap.value.length) {
      return false;
    }
    if (v === "表单数据" && !activityFormData.value.length) {
      return false;
    }
    return true;
  });
});

watch([tabs], () => {
  activeTab.value = [...tabs.value].reverse()[0];
});

onMounted(async () => {
  getPlayType();
  fetchActivityForm();
});

const getPlayType = async () => {
  let res = await API.listActivityPlay({ activityId: route?.params.id });
  playTypeMap.value = res?.data;
};

const fetchActivityForm = async () => {
  const res = await API.queryActivityForm({ activityId: route?.params.id });
  activityFormData.value = res?.data;
};
</script>

<template>
  <div style="height: 100%">
    <div class="pageTitle">
      <div class="text">
        <el-button :icon="ArrowLeft" @click="goBack"></el-button>&nbsp;&nbsp;
        活动详情名称
      </div>
      <el-form v-if="activeTab === tabs?.[0]" :inline="true">
        <el-form-item label="筛选日期">
          <el-date-picker
            :clearable="false"
            v-model="time"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD HH:mm:ss"
            time-format="hh:mm:ss"
          />
        </el-form-item>
      </el-form>
    </div>
    <div class="tab-switch">
      <div class="tabs">
        <div
          v-for="(tab, index) in tabs || []"
          :key="index"
          @click="activeTab = tab"
          :class="{ active: activeTab === tab }"
          @mouseover="hoveredTab = tab"
          @mouseleave="hoveredTab = ''"
        >
          {{ tab }}
        </div>
      </div>
      <div class="contentBlock">
        <component
          :is="activeTabComponent"
          :time="time"
          :activityId="route?.params.id"
        />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.pageTitle {
  padding: 16px 20px 16px 16px;
  display: flex;
  justify-content: space-between;
  .text {
    font-size: 20px;
    font-weight: 500;
    color: #000000;
  }
  .el-form--inline .el-form-item {
    margin: 0;
  }
}
.tab-switch {
  height: calc(100% - 64px);
  display: flex;
}

.tabs {
  display: flex;
  flex-direction: column;
  width: 208px;
  background: #ffffff;
  box-shadow: 0px 20px 50px 0px rgba(0, 0, 0, 0.02);
  border-radius: 8px 8px 8px 8px;
  cursor: pointer;
  margin-right: 20px;
}

.tabs > div {
  padding-left: 40px;
  line-height: 48px;
  height: 48px;
  background: #fafbfd;
  box-shadow: 0px 20px 40px 0px rgba(0, 0, 0, 0.02);
  border-radius: 0px 0px 0px 0px;
  border-bottom: 1px solid #e5e5e5;
}
.active {
  font-weight: 500;
  font-size: 16px;
  color: #4078e0;
  border-right: 2px solid #4078e0;
  transition: all 0.3s; /* 添加过渡效果 */
}

.tabs > div:hover {
  background-color: #f2f4f8; /* 鼠标悬停时的背景色 */
}
.contentBlock {
  flex: 1;
  margin-right: 20px;
  overflow-x: hidden;
}
</style>
