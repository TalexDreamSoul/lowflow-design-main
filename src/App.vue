<template>
  <el-config-provider :button="{ autoInsertSpace: true }" :locale="zhCn">
    <div class="common-layout">
      <TopMenu v-if="!meta.hideTopMenu" />
      <div class="content">
        <el-watermark style="height: 100%;" :content='`${appOptions.user?.accountName}+${dayjs(new Date().getTime()).format("YYYY-MM-DD")}`' :font="{ color: 'rgba(0, 0, 0, 0.15)' }"
          v-if="!meta.hideTopMenu">
          <router-view></router-view>
        </el-watermark>
        <router-view v-if="meta.hideTopMenu"></router-view>

      </div>
    </div>
  </el-config-provider>
</template>

<script lang="ts" setup>
// @ts-ignore sure exist
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import TopMenu from "~/views/TopMenu/index.vue";
import { computed, reactive, provide, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { reactiveMessage } from "./utils/mention/mention";
import { useLocalStorage } from "@vueuse/core";
import customerAPI from '~/api/account'
import dayjs from "dayjs";

const appOptions = useLocalStorage('app-options', { user: {}, menu: {} })
const route = useRoute()
const router = useRouter()
const meta = computed(() => route.meta)

watchEffect(() => {
  $ignored: appOptions

  const { user }: any = appOptions.value
  console.log("user", user)
  if (!user?.accountName?.length) {
    const [promise] = reactiveMessage('会话失效', '您的会话已失效，请重新登录！', false)

    promise.then(() => router.push('/login'))
  } else {
    const { id } = user

    setTimeout(async () => {
      const { data: res }: any = await customerAPI.accountContainMenuList({ id, accountId: id })

      appOptions.value.menu = res
    })
  }

})
provide('appOptions', appOptions)
</script>
<style lang="scss">
html,
body,
#app {
  height: 100%;

  --el-color-danger: #FF5050 !important;
}

div {
  box-sizing: border-box;
}

.el-form-item {
  margin-right: 0;
  margin-bottom: 12px !important;
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
  background: linear-gradient(to bottom, #eeeff6, rgba(56, 128, 228, 0.1098039216));
}
</style>
