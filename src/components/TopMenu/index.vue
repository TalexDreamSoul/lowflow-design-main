<!-- TopMenu.vue -->
<template>
  <div class="top-menu">
    <div style="align-items: center;
    gap: 0px 8px;
    height: 100%;
    display: flex;">
      <div>
        <div style="    display: flex;">
          <el-image class="iconBase">
          </el-image>
          <div>
            H5活动制作系统
            <br />
            <span style="font-size: 9px;">
              zhpongguancun bank
            </span>
          </div>
        </div>
      </div>
      <div style="flex:1;padding: 0px 24px 0 10%;">
        <div class="dropdown" @mouseover="showDropdown" @mouseleave="hideDropdown">
          数据看板
          <div v-show="isDropdownVisible" class="dropdown-menu">
            <router-link to="/pinia">Service 1</router-link>
            <router-link to="/page">Service 2</router-link>
          </div>
        </div>
        <div class="dropdown" @mouseover="showDropdown" @mouseleave="hideDropdown">
          营销制作
          <div v-show="isDropdownVisible" class="dropdown-menu">
            <router-link to="/pinia">Service 1</router-link>
            <router-link to="/page">Service 2</router-link>
          </div>
        </div>
        <div class="dropdown" @click="targetPage('designNew')" @mouseover="showDropdown" @mouseleave="hideDropdown">
          营销触达
          <div v-show="isDropdownVisible" class="dropdown-menu">
            <router-link to="/designNew">流程画布</router-link>
            <router-link to="/strategyProcessList">策略流程列表</router-link>
          </div>
        </div>
        <div class="dropdown" @mouseover="showDropdown" @mouseleave="hideDropdown">
          素材中心
          <div v-show="isDropdownVisible" class="dropdown-menu">
            <router-link to="/pinia">Service 1</router-link>
            <router-link to="/page">Service 2</router-link>
          </div>
        </div>
        <div class="dropdown" @mouseover="showDropdown" @mouseleave="hideDropdown">
          客户中心
          <div v-show="isDropdownVisible" class="dropdown-menu">
            <router-link to="/pinia">Service 1</router-link>
            <router-link to="/page">Service 2</router-link>
          </div>
        </div>
        <div class="dropdown" @mouseover="showDropdown" @mouseleave="hideDropdown">
          配置中心
          <div v-show="isDropdownVisible" class="dropdown-menu">
            <router-link to="/configuration/event">事件管理</router-link>
            <router-link to="/configuration/attr">属性管理</router-link>
          </div>
        </div>
        <div class="dropdown" @click="targetPage('dashboard')" @mouseleave="hideDropdown">
          素材权益管理
        </div>
        <div class="dropdown" @mouseover="showDropdown" @mouseleave="hideDropdown">
          审核中心
          <div v-show="isDropdownVisible" class="dropdown-menu">
            <router-link to="/pinia">Service 1</router-link>
            <router-link to="/page">Service 2</router-link>
          </div>
        </div>
      </div>
      <div style="padding:0 24px">
        你好，lvlv
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      isDropdownVisible: false,
    };
  },
  methods: {
    showDropdown() {
      this.isDropdownVisible = true;
    },
    hideDropdown() {
      this.isDropdownVisible = false;
    },

    targetPage(page) {
      this.$router.push(page);
    },
  },
};
</script>

<style scoped>
.top-menu {
  width: 100%;
  height: 64px;
  background: #ffffff;
  box-shadow: 0px 20px 40px 0px rgba(0, 0, 0, 0.02);
  border-radius: 0px 0px 0px 0px;
  opacity: 1;
  position: sticky;
  top: 0;
  left: 0;
  color: #333;
  padding: 12px;
}
.dropdown {
  position: relative;
  display: inline-block;
  margin-right: 20px;
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #333;
  color: #fff;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: none;
}

.dropdown:hover .dropdown-menu {
  display: block;
}
</style>
