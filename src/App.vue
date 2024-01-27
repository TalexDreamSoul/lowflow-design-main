<template>
  <el-config-provider :button="{ autoInsertSpace: true }" :locale="zhCn">
    <TopMenu v-if="!meta.hideTopMenu" />

    <router-view></router-view>
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
