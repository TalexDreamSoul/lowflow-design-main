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
  line-height: 40px;
  text-align: center;
}
.route {
  text-decoration: none;
  color: rgba(0, 0, 0, .8);
  margin-right: 24px;
}
.route.router-link-active {
  color: #277AE7;
}
.centent {
  flex: 1;
  background-color: #f8f9fa;
}
</style>