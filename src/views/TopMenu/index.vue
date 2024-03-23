<!-- TopMenu.vue -->
<template>
  <div class="TopMenu-Container">
    <div class="TopMenu-Container-Start">
      <img style="width: 169px; height: 39px;margin: auto 8rem auto 1rem" :src="HeaderIcon" alt="" />

      <TouchMenu :path="`/${item.menuCode}`" :title="item.menuName" v-for="item in menuMap">
        <touchMenuItem v-for="each in item.children" :path="`/${item.menuCode}/${each.menuCode}`">{{ each.menuName }}
        </touchMenuItem>
      </TouchMenu>

      <!-- <TouchMenu title="素材中心" path="/materialCenter">
        <touchMenuItem path="/materialCenter/templatePanel/all">模版总览</touchMenuItem>
        <touchMenuItem path="/materialCenter/templatePanel/sms">短信模版</touchMenuItem>
        <touchMenuItem path="/materialCenter/templatePanel/outbound">外呼模版</touchMenuItem>
        <touchMenuItem path="/materialCenter/templatePanel/appPush">APP Push模版</touchMenuItem>
        <touchMenuItem path="/materialCenter/templatePanel/digital">企微模版</touchMenuItem>
        <touchMenuItem path="/materialCenter/templatePanel/znx">站内信模版</touchMenuItem>
      </TouchMenu>
      <TouchMenu title="客户中心" path="/customer">
        <touchMenuItem path="/customer/list">客户列表</touchMenuItem>
        <touchMenuItem path="/customer/tag">客户标签</touchMenuItem>
        <touchMenuItem path="/customer/blackList">黑名单管理</touchMenuItem>
      </TouchMenu>
      <TouchMenu title="配置中心" path="/configuration">
        <touchMenuItem path="/configuration/event">事件管理</touchMenuItem>
        <touchMenuItem path="/configuration/attr">属性管理</touchMenuItem>
      </TouchMenu>
      <TouchMenu title="渠道管理" path="/channelManagement">
        <touchMenuItem path="/channelManagement/transactionList">交易明细</touchMenuItem>
        <touchMenuItem path="/channelManagement/reconciliationList">交易对账</touchMenuItem>
        <touchMenuItem path="/channelManagement/channelDisturb">渠道勿扰设置</touchMenuItem>
        <touchMenuItem path="/channelManagement/equityManagement">权益管理</touchMenuItem>
      </TouchMenu>
      <TouchMenu title="审核中心" path="/approve">
        <touchMenuItem path="/approve/activity">H5活动审核</touchMenuItem>
        <touchMenuItem path="/approve/strategyProcess">策略流程审核</touchMenuItem>
        <touchMenuItem path="/approve/configuration">审核流程配置</touchMenuItem>
      </TouchMenu>
      <TouchMenu title="用户管理" path="/userCenter">
        <touchMenuItem path="/userCenter/userManagement">用户管理</touchMenuItem>
        <touchMenuItem path="/userCenter/rolesManagement">角色管理</touchMenuItem>
        <touchMenuItem path="/userCenter/personalInformation">个人信息</touchMenuItem>
      </TouchMenu> -->

      <!-- <el-sub-menu index="8">
      <template #title>
        <div class="title">审核中心 <el-icon :size="12">
            <CaretBottom />
          </el-icon></div>
      </template>
<touchMenuItem index="/pinia">Service</touchMenuItem>
<touchMenuItem index="/page">Service</touchMenuItem>
</el-sub-menu> -->
    </div>

    <MenuPersonal />
  </div>
</template>

<script lang="ts" setup>
import { inject, watchEffect, reactive, ref } from "vue";
import MenuPersonal from "./MenuPersonal.vue";
import { useRouter } from "vue-router";
import HeaderIcon from "~/assets/header-icon.png";
import { CaretBottom } from "@element-plus/icons-vue";
import TouchMenu from "./TouchMenu.vue";
import TouchMenuItem from "./TouchMenuItem.vue";

const appOptions: any = inject('appOptions')!
const menuMap = ref()

watchEffect(() => {
  // $ignored: appOptions.value
  if (!appOptions.value?.menu) return

  const { menus, menuIds } = appOptions.value.menu
  const filteredMenu = [...menus].filter((item: any) => menuIds.includes(item.id))

  const map: any = {}

  filteredMenu.forEach((item: any) => map[item.menuCode] = reactive({
    children: [],
    ...item,
  }))

  const clearCodes: string[] = []

  // 将flat array转成tree map
  Object.values(map).forEach((item: any) => {
    const { id, menuCode, parentMenuCode } = item

    if (menuCode !== parentMenuCode && parentMenuCode?.length) {
      const p = map[parentMenuCode]

      if (p) {
        const c = p.children

        c.push(item)
      }

      clearCodes.push(menuCode)
      // delete map[menuCode]
    }

  });

  [...clearCodes].forEach((code: string) => delete map[code])

  menuMap.value = map

  console.log("1", map)

})

const handleloca = () => {
  window.open('http://172.30.3.6:18700/', '_blank');
}
</script>

<style lang="scss">
.TopMenu-Container {
  &-Start {
    display: flex;

    height: 60px;

    align-items: center;
    justify-content: flex-start;
  }

  display: flex;

  align-items: center;
  justify-content: space-between;
}

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
  >.touchMenuItem {
    padding: 0 15px;
  }

  >.touchMenuItem {
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

  &.touchMenuItem:not(.is-disabled):hover {
    color: rgba(0, 0, 0, 0.9);
    background-color: rgba(144, 160, 184, 0.1);
  }
}
</style>
