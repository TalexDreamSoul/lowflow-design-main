<template>
  <el-config-provider :button="{ autoInsertSpace: true }" :locale="zhCn">
    <!-- 根据 $hideTopMenu 判断是否展示 TopMenu -->
    <TopMenu v-if="!$hideTopMenu" />

    <router-view></router-view>
  </el-config-provider>
</template>

<script lang="ts" setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import TopMenu from "~/components/TopMenu/index.vue";
</script>
<style >
.primarystyle {
  background: linear-gradient(to top, #598ff1, #205ccb);
}
.el-form-item {
  margin-right: 0;
  margin-bottom: 12px !important;
}
</style>