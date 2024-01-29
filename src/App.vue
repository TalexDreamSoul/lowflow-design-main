<template>
  <el-config-provider :button="{ autoInsertSpace: true }" :locale="zhCn">
    <!-- 根据 $hideTopMenu 判断是否展示 TopMenu -->
    <div class="common-layout">
      <TopMenu v-if="!$hideTopMenu" />
      <div class="content">
        <router-view></router-view>
      </div>
    </div>

  </el-config-provider>
</template>

<script lang="ts" setup>
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import TopMenu from "~/components/TopMenu/index.vue";
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
