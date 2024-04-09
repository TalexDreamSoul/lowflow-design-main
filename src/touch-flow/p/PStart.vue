<script setup lang="ts">
import { ref, reactive, computed, provide, inject, watch, onBeforeUnmount } from "vue";
import { Stamp, Plus, CircleCheckFilled, User, Position } from "@element-plus/icons-vue";
import ConditionSetAttr from "./attr/ConditionSetAttr.vue";
import { genNodeParams } from './common/node-util'
import peoples from "~/assets/icon/peoples.png";
import peoplesactive from "~/assets/icon/peoplesactive.png";
import sendactive from "~/assets/icon/sendactive.png";
import send from "~/assets/icon/send.png";

const { readonly, data, openCustomer, dialogVisible, drawerOptions, openDrawer, comps, handleClick, handleSave, haveDiverse } = genNodeParams()

watch(data, () => {
  const { children } = data;

  [...children].forEach((item, index) => {
    if (!index) return

    item.$index = index

    const { diversionType } = item
    if (diversionType === 'safeguard') return

    item.diversionType = children[0].diversionType
    item.eventDelayed.delayedTime = children[0].eventDelayed.delayedTime
    item.eventDelayed.delayedUnit = children[0].eventDelayed.delayedUnit

    console.log("each", item)
  })
}, { immediate: true })

const flowType = computed(() => {
  if (!data?.executeType) return "-";
  const map: { [key: string]: string } = {
    immediately: "定时型-单次",
    repeat: "定时型-重复",
    trigger: "触发型",
  };

  const s: string = data?.executeType;

  return map[s.toLowerCase()];
});

const flowTime = computed(() => {
  const _time = data.executeTime;
  // if (!_time) return "-";

  if (_time) {
    const s: Date = _time;

    return s.toLocaleString().replaceAll("/", "-");
  }

  // const [date1, date2] = _time;
  const { startTime, endTime } = data;
  if (!startTime || !endTime) return "-";

  const date1Text = startTime; //.toLocaleDateString().replaceAll("/", "-");
  const date2Text = endTime; //.toLocaleDateString().replaceAll("/", "-");

  return `${date1Text} 至 ${date2Text}`;
});

const conditioned = computed(() => flowType.value !== "-" && flowTime.value !== "-");

/**
   * 是否显示 受众客户 （展示隐藏）
   */
const customerConditioned = computed(() => {
  const { customAttr, customEvent } = data?.customRuleContent ?? {};

  const _obj = {
    customAttr: customAttr?.conditions?.length ?? 0,
    customEvent: customEvent?.conditions?.length ?? 0,
  };

  return {
    display:
      (data.blacklist || data.customRuleContent) ||
      _obj.customAttr ||
      _obj.customEvent,
    ..._obj,
  };
});

function openCondition() {
  openDrawer({
    title: "流程类型设置",
    comp: ConditionSetAttr,
  })
}
</script>

<template>
  <!-- style="    margin-top: 100px;" -->
  <el-card class="PBlock">
    <p>进入流程设置</p>
    <div class="PBlock-Content">
      <div @click="openCustomer" :class="{ checked: customerConditioned.display }" class="PBlock-Section">
        <p>
          <!-- <el-icon>
            <User />
          </el-icon> -->
          
          <el-image style="width: 18px; height: 18px" :src="customerConditioned.display?peoplesactive:peoples"  />
          受众客户
          <span v-if="customerConditioned.display">
            <el-icon>
              <CircleCheckFilled />
            </el-icon>
          </span>
        </p>
        <span v-if="customerConditioned.display">
          <span>客户属性满足：<span contentPrimary>{{ customerConditioned.customAttr }}条</span></span><br />
          <span>客户行为满足：<span contentPrimary>{{ customerConditioned.customEvent }}条</span></span><br />
        </span>
        <span v-else>根据客户属性、客户标签、客户行为、行为序列筛选能够进入流程的客户</span>
      </div>
      <div @click="openCondition" :class="{ checked: conditioned }" class="PBlock-Section">
        <p>
         
          <el-image style="width: 18px; height: 18px" :src="conditioned?sendactive:send"  />

          进入条件
          <span v-if="conditioned">
            <el-icon>
              <CircleCheckFilled />
            </el-icon>
          </span>
        </p>
        <span v-if="conditioned" style="opacity: 0.75; font-size: 14px">
          <span>流程类型：<span contentPrimary>{{ flowType }}</span></span><br />
          <span>进入时间：<span contentPrimary>{{ flowTime }}</span></span><br />
        </span>
        <span v-else>设置流程类型、流程有效期、流程开始时间、进入限制。</span>
      </div>
    </div>

    <teleport to=".FlowPage">
      <el-dialog v-model="dialogVisible" width="25%" title="请选择添加类型" align-center>
        <div class="Dialog-Sections">
          <div @click="openDrawer(item)" v-for="item in comps" :class="{ disabled: item.disabled?.value }"
            class="PBlock-Section">
            <p style="    display: flex;
            align-items: center;">
              <el-icon v-if="item.icon.type === 'comp'">
                <component :is="item.icon.value" />
              </el-icon>
              <img v-else :src="item.icon.value as any"  style="    margin-right: 2px;" />
              {{ item.title }}
            </p>
            <span v-text="item.desc" />
          </div>
        </div>
      </el-dialog>
    </teleport>

    <teleport to=".FlowPage">
      <el-drawer @click="handleClick" v-model="drawerOptions.visible" :title="drawerOptions.title" size="65%">
        <component :readonly="readonly" :p="data" :is="drawerOptions.comp" />
        <template #footer>
          <template v-if="readonly">
            <el-button round @click="drawerOptions.visible = false">返回</el-button>
          </template>
          <template v-else>
            <el-button round @click="drawerOptions.visible = false">取消</el-button>
            <el-button round @click="handleSave" type="primary" primaryStyle>保存</el-button>
          </template>
        </template>
      </el-drawer>
    </teleport>
  </el-card>
  <!-- && !customerConditioned.display -->
  <el-button :class="{
        display: conditioned && customerConditioned.display,
        disabled: readonly || haveDiverse,
      }" @click="dialogVisible = true" class="start-add" type="primary" :icon="Plus" circle />
</template>

<style lang="scss">
.Dialog-Sections {
  p {
    margin: 0;
  }

  display: flex;

  gap: 2rem;
  justify-content: center;
}

.PBlock-Section {
  &.disabled {
    opacity: 0.5;
    border: 1px solid var(--el-border-color);
    pointer-events: none;
  }

  p {
    font-size: 16px;
    font-weight: 500;
    line-height: 20px;
    color: #333;
    overflow: hidden;
    position: relative;
    padding-bottom: 12px;

    &::before {
      content: "";
      position: absolute;
      left: 0;
      bottom: 20px;
      width: 60%;
      height: 8px;
      transition: 0.25s;
      transform: scaleX(0) translateX(-100%);
      width: 160px;
      height: 7px;
      background: linear-gradient(82deg,
          rgba(64, 120, 224, 0.4) 0%,
          rgba(64, 120, 224, 0) 100%);
      border-radius: 2px 2px 2px 2px;
      opacity: 0.6;
      position: absolute;
    }

    span {
      float: right;

      font-size: 1.25rem;

      color: #00c068 !important;
    }

    position: relative;
  }

  &.checked {
    p {
      &::before {
        transform: scaleX(1) translateX(0%);
      }

      color: #4078e0;
    }
  }

  &:hover {
    border: 1px solid #4078e0;
  }

  width: 50%;

  border: 1px solid transparent;
}

.PBlock-Section .el-icon {
  top: 0.125rem;

  margin-bottom: 0.5rem;
}
</style>
