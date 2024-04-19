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
import { computed, onMounted, provide, reactive, ref, watchEffect } from "vue";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
import { useLocalStorage } from "@vueuse/core";
import customerAPI from "~/api/account";
import dayjs from "dayjs";

const route = useRoute();

const router = useRouter();
const xMarketingToken = ref("");

// 获取URL中的X-MARKETING-TOKEN的值
const getMarketingTokenFromURL = async () => {
  const urlParams = new URLSearchParams(route.query as unknown as string);
  const token = urlParams.get("X-MARKETING-TOKEN");
  if (token) {
    xMarketingToken.value = token;
    // 将值存储到cookie中
    document.cookie = `X-MARKETING-TOKEN=${token}; path=/`;

  const res: any = await customerAPI.accountDetail();
  appOptions.value.user = res?.data;
  }
  // const { user }: any = appOptions.value;
  // // console.log("user", user)
  // if (!user?.accountName?.length) {
  //   fetchDataApi();
  // } else {
  //   const { id } = user;

  //   setTimeout(async () => {
  //     const res = (await customerAPI.accountContainMenuList({
  //       id,
  //       accountId: id,
  //     })) as { data: any };

  //     appOptions.value.menu = res?.data;
  //   });
  // }
};

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
  getMarketingTokenFromURL();
};
// onMounted(() => {
//   getMarketingTokenFromURL();
// });
watchEffect(() => {
  $ignored: appOptions;
  const { user }: any = appOptions.value;
  // console.log("user", user)
  if (!user?.accountName?.length) {
    fetchDataApi();
  } else {
    const { id } = user;

    setTimeout(async () => {
      const res = (await customerAPI.accountContainMenuList({
        id,
        accountId: id,
      })) as { data: any };

      appOptions.value.menu = res?.data;
    });
  }
});

const menuMap = ref();
watchEffect(() => {
  if (!appOptions.value?.menu) return;

  const { menus, menuIds } = appOptions.value.menu;
  const filteredMenu =
    menus && [...menus].filter((item: any) => menuIds.includes(item.id));

  const map: any = {};

  filteredMenu &&
    filteredMenu.forEach(
      (item: any) =>
        (map[item.menuCode] = reactive({
          children: [],
          ...item,
        }))
    );

  const clearCodes: string[] = [];

  // 将flat array转成tree map
  Object.values(map).forEach((item: any) => {
    const { id, menuCode, parentMenuCode } = item;

    if (menuCode !== parentMenuCode && parentMenuCode?.length) {
      const p = map[parentMenuCode];

      if (p) {
        const c = p.children;

        c.push(item);
      }

      clearCodes.push(menuCode);
      // delete map[menuCode]
    }
  });

  [...clearCodes].forEach((code: string) => delete map[code]);

  menuMap.value = map;
useLocalStorage("menuMap-default", { menuMap });
  useLocalStorage(
  "router-default",
  `/${Object.keys(menuMap.value)[0]}/${
    menuMap.value[Object.keys(menuMap.value)[0]]?.children[0].menuCode
  }`
);
  // console.log("1", map)
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
