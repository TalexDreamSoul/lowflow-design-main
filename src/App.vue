<template>
  <el-config-provider >
   <!-- 根据 $hideTopMenu 判断是否展示 TopMenu -->
   <TopMenu v-if="!$hideTopMenu" />

    <router-view></router-view>
  </el-config-provider>
</template>

<script setup lang="ts">
import TopMenu from "~/components/TopMenu/index.vue";
</script>
