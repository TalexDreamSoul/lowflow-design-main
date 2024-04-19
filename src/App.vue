<template>
  <el-config-provider :button="{ autoInsertSpace: true }" :locale="zhCn">
    <el-watermark zIndex="9999" style="height: 100%;" :content='`${appOptions?.user?.accountName}+${dayjs(new Date().getTime()).format("YYYY-MM-DD")}`' :font="{ color: 'rgba(0, 0, 0, 0.15)' }">
      <div class="common-layout">
        <TopMenu v-if="!meta.hideTopMenu" />
        <div class="content">
          <router-view></router-view>
        </div>
      </div>
    </el-watermark>

  </el-config-provider>
</template>

<script lang="ts" setup>
// @ts-ignore sure exist
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import TopMenu from "~/views/TopMenu/index.vue";
import { computed, onMounted, provide, ref, watchEffect } from "vue";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
import { useLocalStorage } from "@vueuse/core";
import customerAPI from "~/api/account";
import dayjs from "dayjs";

const route = useRoute();

const router = useRouter();
const xMarketingToken = ref("");

// 获取URL中的X-MARKETING-TOKEN的值
const getMarketingTokenFromURL = () => {
  const urlParams = new URLSearchParams(route.query as unknown as string);
  const token = urlParams.get("X-MARKETING-TOKEN");
  if (token) {
    xMarketingToken.value = token;
    // 将值存储到cookie中
    document.cookie = `X-MARKETING-TOKEN=${token}; path=/`;
  }
};

onMounted(() => {
  getMarketingTokenFromURL();
});

// 监听路由变化以确保在路由切换时也能获取新URL中的token值
router.afterEach(() => {
  getMarketingTokenFromURL();
});

onBeforeRouteUpdate((to, from, next) => {
  if (to.path === "/") {
    // debugger;
    next("/dashboard"); // 这里可以根据实际需求重定向到其他路径
  } else {
    // debugger;
    next(); // 继续路由导航
  }
});

const appOptions = useLocalStorage("app-options", { user: {}, menu: {} });
// const appOptions = ref({})

const meta = computed(() => route.meta);
const fetchDataApi = async () => {
  const res: any = await customerAPI.accountDetail();
  appOptions.value.user = res?.data;
};

watchEffect(() => {
  $ignored: appOptions;

  const { user }: any = appOptions.value;
  // console.log("user", user)
  if (!user?.accountName?.length) {
    fetchDataApi();
  } else {
    const { id } = user;

    setTimeout(async () => {
      const res = await customerAPI.accountContainMenuList({
        id,
        accountId: id,
      });

      appOptions.value.menu = res?.data;
    });
  }
});
provide("appOptions", appOptions);
</script>
<style lang="scss">
html,
body,
#app {
  height: 100%;

  --el-color-danger: #ff5050 !important;
}

div {
  box-sizing: border-box;
}

.el-form-item {
  margin-right: 0;
  //margin-bottom: 12px !important;
}

.common-layout {
  min-width: 1440px;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  overflow-y: scroll;
  background: linear-gradient(
    to bottom,
    #eeeff6,
    rgba(56, 128, 228, 0.1098039216)
  );
}
</style>
