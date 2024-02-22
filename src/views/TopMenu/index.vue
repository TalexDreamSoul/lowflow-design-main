<!-- TopMenu.vue -->
<template>
  <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false" :popper-offset="0" @select="handleSelect">
    <img style="width: 169px; height: 39px; margin: 0 26px 0 17px;" :src="HeaderIcon" alt="" />
    <!-- <el-sub-menu index="1">
      <template #title>
        <div class="title">数据看板 <el-icon :size="12">
            <CaretBottom />
          </el-icon></div>
      </template>
      <el-menu-item class="pd-menu-item" index="/pinia">Service</el-menu-item>
      <el-menu-item class="pd-menu-item" index="/page">Service</el-menu-item>
    </el-sub-menu> -->
    <el-sub-menu index="2">
      <template #title>
        <div class="title">营销制作 <el-icon :size="12">
            <CaretBottom />
          </el-icon></div>
      </template>
      <el-menu-item class="pd-menu-item" index="/pinia">Service</el-menu-item>
      <el-menu-item class="pd-menu-item" index="/page">Service</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="3">
      <template #title>
        <div class="title">营销触达 <el-icon :size="12">
            <CaretBottom />
          </el-icon></div>
      </template>

      <el-menu-item class="pd-menu-item" index="/design">流程画布</el-menu-item>
      <el-menu-item class="pd-menu-item" index="/strategyProcess">策略流程列表</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="4">
      <template #title>
        <div class="title">素材中心 <el-icon :size="12">
            <CaretBottom />
          </el-icon></div>
      </template>

      <el-menu-item class="pd-menu-item" index="/materialCenter/templatePanel/all">模版总览</el-menu-item>
      <el-menu-item class="pd-menu-item" index="/materialCenter/templatePanel/sms">短信模版</el-menu-item>
      <el-menu-item class="pd-menu-item" index="/materialCenter/templatePanel/outbound">外呼模版</el-menu-item>
      <el-menu-item class="pd-menu-item" index="/materialCenter/templatePanel/appPush">APP Push模版</el-menu-item>
      <el-menu-item class="pd-menu-item" index="/materialCenter/templatePanel/digital">企微模版</el-menu-item>
      <el-menu-item class="pd-menu-item" index="/materialCenter/templatePanel/znx">站内信模版</el-menu-item>

    </el-sub-menu>
    <el-sub-menu index="5">
      <template #title>
        <div class="title">客户中心 <el-icon :size="12">
            <CaretBottom />
          </el-icon></div>
      </template>
      <el-menu-item class="pd-menu-item" index="/customer/list">客户列表</el-menu-item>
      <el-menu-item class="pd-menu-item" index="/customer/tag">客户标签</el-menu-item>
      <el-menu-item class="pd-menu-item" index="/customer/blackList">黑名单管理</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="6">
      <template #title>
        <div class="title">配置中心 <el-icon :size="12">
            <CaretBottom />
          </el-icon></div>
      </template>
      <el-menu-item class="pd-menu-item" index="/configuration/event">事件管理</el-menu-item>
      <el-menu-item class="pd-menu-item" index="/configuration/attr">属性管理</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="7">
      <template #title>
        <div class="title">渠道管理 <el-icon :size="12">
            <CaretBottom />
          </el-icon></div>
      </template>
      <el-menu-item class="pd-menu-item" index="/channelManagement/transactionList">交易明细</el-menu-item>
      <el-menu-item class="pd-menu-item" index="/channelManagement/reconciliationList">交易对账</el-menu-item>
      <el-menu-item class="pd-menu-item" index="/channelManagement/channelDisturb">渠道勿扰设置</el-menu-item>
      <el-menu-item class="pd-menu-item" index="/channelManagement/equityManagement">权益管理</el-menu-item>
    </el-sub-menu>

    <el-sub-menu index="8">
      <template #title>
        <div class="title">审核中心 <el-icon :size="12">
            <CaretBottom />
          </el-icon></div>
      </template>
      <el-menu-item class="pd-menu-item" index="/pinia">Service</el-menu-item>
      <el-menu-item class="pd-menu-item" index="/page">Service</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="9">
      <template #title>
        <div class="title">用户中心 <el-icon :size="12">
            <CaretBottom />
          </el-icon></div>
      </template>
      <el-menu-item class="pd-menu-item" index="/userCenter/userManagement">用户管理</el-menu-item>
      <el-menu-item class="pd-menu-item" index="/userCenter/rolesManagement">角色管理</el-menu-item>
      <el-menu-item class="pd-menu-item" index="/userCenter/personalInformation">个人信息</el-menu-item>
    </el-sub-menu>
    <MenuPersonal />
  </el-menu>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import MenuPersonal from "./MenuPersonal.vue";
import { useRouter } from "vue-router";
import HeaderIcon from "~/assets/header-icon.png";
import { CaretBottom } from "@element-plus/icons-vue";

const router = useRouter();
const activeIndex = ref(router.currentRoute.value.path);

const handleSelect = (key: string, params?: string) => {
  router.push(key);
};
</script>

<style lang="scss">
.el-menu-demo {
  align-items: center;
  height: 64px;

  &.el-menu {
    border-bottom: none;
  }

  .el-sub-menu {
    height: 100%;

    &:hover,
    &.is-opened,
    .el-sub-menu__title:hover {
      background-color: rgba(144, 160, 184, 0.1);
    }

    &.is-active .el-sub-menu__title {
      background-color: rgba(56, 120, 244, 0.1);

      .title,
      .el-icon {
        color: rgba(64, 120, 224, 1);
      }
    }

    .title {
      font-weight: 500;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.6);

      .el-icon {
        color: rgba(144, 160, 184, 1);
      }
    }
  }

  .el-sub-menu__icon-arrow {
    display: none;
  }

  &:not(.el-menu--collapse) .el-sub-menu__title,
  > .el-menu-item {
    padding: 0 15px;
  }

  > .el-menu-item {
    .title {
      font-weight: 500;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.6);
    }

    &.is-active {
      background-color: rgba(56, 120, 244, 0.1);

      .title {
        color: rgba(64, 120, 224, 1);
      }
    }
  }

  .el-icon {
    width: auto;
  }

  .MenuPersonal {
    margin-left: auto;
  }
}

.pd-menu-item {
  color: rgba(0, 0, 0, 0.9);

  &.el-menu-item:not(.is-disabled):hover {
    color: rgba(0, 0, 0, 0.9);
    background-color: rgba(144, 160, 184, 0.1);
  }
}
</style>
