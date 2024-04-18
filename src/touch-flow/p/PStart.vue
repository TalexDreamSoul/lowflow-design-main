<script setup lang="ts">
import BaseNode from "./common/BaseNode.vue";
import { computed, watch } from "vue";
import { CircleCheckFilled } from "@element-plus/icons-vue";
import ConditionSetAttr from "./attr/ConditionSetAttr.vue";
import { genNodeParams } from './common/node-util'
import peoples from "~/assets/icon/peoples.png";
import PeopleActive from "~/assets/icon/peoplesactive.png";
import SendActive from "~/assets/icon/sendactive.png";
import Send from "~/assets/icon/send.png";

const params = genNodeParams()
const { readonly, data, openDrawer, openCustomer, haveDiverse } = params

watch(data, () => {
  const { children } = data;

  children && [...children].forEach((item, index) => {
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
  <BaseNode :params="params" :display="conditioned && customerConditioned.display" :disabled="readonly || haveDiverse">
    <p>进入流程设置</p>
    <div class="PBlock-Content">
      <div @click="openCustomer" :class="{ checked: customerConditioned.display }" class="PBlock-Section">
        <p>

          <el-image style="width: 18px; height: 18px" :src="customerConditioned.display ? PeopleActive : peoples" />
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

          <el-image style="width: 18px; height: 18px" :src="conditioned ? SendActive : Send" />

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
  </BaseNode>
</template>
