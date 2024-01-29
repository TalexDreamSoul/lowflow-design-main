<template>
  <el-config-provider :button="{ autoInsertSpace: true }" :locale="zhCn">
    <div class="common-layout">
      <TopMenu v-if="!meta.hideTopMenu" />
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </el-config-provider>
</template>

<script lang="ts" setup>
// @ts-ignore sure exist
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import TopMenu from "~/components/TopMenu/index.vue";
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const meta = computed(() => route.meta)
</script>
<style>
html, body, #app {
  height: 100%;
}
.el-form-item {
  margin-right: 0;
  margin-bottom: 12px !important;
}
.common-layout {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.content {
  flex: 1;
}
</style>
