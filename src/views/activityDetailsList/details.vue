<script setup lang="ts">
import {
  ref,
  unref,
  reactive,
  onMounted,
  watch,
  computed,
  defineAsyncComponent,
  DefineComponent,
} from "vue";
import { getmarketingTouchDetail, marketingTouchStatistics } from "~/api/index";
import dayjs from "dayjs";
import { useRoute, Router, useRouter } from "vue-router";
import * as echarts from "echarts";
import { num2character } from "~/utils/common";
import strategyProcessList from "./strategyProcessList.vue";
import { ArrowLeft } from "@element-plus/icons-vue";
const router = useRouter();
const route = useRoute();

const goBack = () => {
  router.go(-1);
};

const formInline = reactive({
  touchName: "",
  executeType: "",
  beginTime: "",
  endTime: "",
  status: "",
});

const typeMap = {
  immediately: "定时-单次",
  delayed: "定时-重复",
  trigger: "触发型",
};

const marketingDetail = ref();
const currentPage = ref(1);
const pageSize = ref(10);

const StatisticsList = ref({
  accumulateCompleteCount: 0,
  accumulateEntryCount: 0,
  accumulateTouchCount: 0,
  completeTargetCount1: 0,
  completeTargetCount2: 0,
});

const chartContainer = ref(null);
const chart = ref(null);

const tabs = ["浏览数据", "转化数据", "表单数据", "玩法数据"];
const activeTab = ref(tabs[1]);

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
</script>

<template>
  <div>
    <div class="pageTitle">
      <el-button :icon="ArrowLeft"></el-button>&nbsp;&nbsp;
      活动详情名称
    </div>
    <div class="tab-switch">
      <div class="tabs">
        <div v-for="(tab, index) in tabs" :key="index" @click="activeTab = tab" :class="{ active: activeTab === tab }" @mouseover="hoveredTab = tab" @mouseleave="hoveredTab = ''">
          {{ tab }}
        </div>
      </div>
      <div class="contentBlock">
        <component :is="activeTabComponent" />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.pageTitle {
  padding: 16px;
  font-size: 20px;
  font-weight: 500;
  color: #000000;
}
.tab-switch {
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
}
</style>