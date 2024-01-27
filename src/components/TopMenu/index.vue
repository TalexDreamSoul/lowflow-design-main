<!-- TopMenu.vue -->
<template>
  <div class="top-menu">
<div>
  di v
</div>
    <el-space style="height: 100%;">
      <router-link to="/">designNew</router-link>
      <router-link to="/dashboard">dashboard</router-link>
      <router-link to="/design">design</router-link>
      <div class="dropdown" @mouseover="showDropdown" @mouseleave="hideDropdown">
        Services
        <div v-show="isDropdownVisible" class="dropdown-menu">
          <router-link to="/pinia">Service 1</router-link>
          <router-link to="/page">Service 2</router-link>
        </div>
      </div>
    </el-space>

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
  },
};
</script>

<style scoped>
.top-menu {
  width: 100%;
  height: 64px;
  background: linear-gradient(180deg, #2b2b2b 0%, #383838 100%);
  box-shadow: 0px 20px 40px 0px rgba(0, 0, 0, 0.02);
  border-radius: 0px 0px 0px 0px;
  opacity: 1;
  position: sticky;
  top: 0;
  left: 0;
  color: #fff;
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
