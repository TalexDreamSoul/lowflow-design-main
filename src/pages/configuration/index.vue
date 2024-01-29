<template>
  <div class="config-layout">
    <div class="header">
      <router-link class="route" to="/configuration/event">事件管理</router-link>
      <router-link class="route" to="/configuration/attribute">属性管理</router-link>
    </div>
    <div class="centent">
      <router-view></router-view>
    </div>
  </div>
</template>

<script></script>

<style scoped>
.config-layout {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.header {
  height: 40px;
}
.centent {
  background-color: #f8f9fa;
}
</style>