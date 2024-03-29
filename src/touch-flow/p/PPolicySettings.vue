<script setup lang="ts">
import { ref, reactive, provide, computed, inject, watch } from "vue";
import { Stamp, Plus, Delete } from "@element-plus/icons-vue";
import PolicySettingsAttr from "./attr/PolicySettingsAttr.vue";
import DeliverySettingsAttr from "./attr/DeliverySettingsAttr.vue";
import { _delChild } from "../flow-utils";
import Strategist from "./attr/Strategist.vue";
import { MarketingTouchEditDTO } from "./behavior/marketing";
import StatisticsDisplay from './attr/StatisticsDisplay.vue'

const getNode: Function = inject("getNode")!;
const { data: _data } = getNode();
const __data = _data.$d(_data.id);
const data = reactive(_data.data);

const dialogVisible = ref(false);
const drawerOptions = reactive<any>({
  visible: false,
  new: false,
});

Object.assign(data, __data)

console.log("PolicySettings setup!", getNode(), __data, data)

watch(data, () => {
  const { children } = data;

  children && [...children].forEach((item, index) => {
    if (!index) return

    item.$index = index

    item.diversionType = children[0].diversionType
  })
}, { immediate: true })

const doDiverse = computed(() => {
  const { children } = data;

  if (!children?.length) return false;

  return [...children].find((child) => "strategy" === child?.nodeType) ?? true;
});

const haveDiverse = computed(() => {
  if (!doDiverse.value) return false;

  const { children } = data;

  if (!children?.length) return false;

  return [...children].find((child) => "diversion" === child?.nodeType);
});

const haveReveal = computed(() => {
  const { children } = data;

  if (!children?.length) return false;

  return (
    [...children].find((child) => "strategy" === child?.nodeType && child?.reveal) ??
    false
  );
});

const _comps = [
  {
    icon: {
      type: "comp",
      value: Stamp,
    },
    title: "选择策略器",
    desc: "按客户属性行为或触发事件对客户筛选分流，并执行动作。",
    comp: PolicySettingsAttr,
  },
  {
    icon: {
      type: "comp",
      value: Stamp,
    },
    title: "分流器",
    desc: "按设置的比例自动客户对随机分流，并执行动作。",
    show: () => !haveReveal.value && !doDiverse.value,
    comp: DeliverySettingsAttr,
  },
  {
    icon: {
      type: "comp",
      value: Stamp,
    },
    title: "兜底选择器",
    disabled: haveReveal,
    desc: "筛选未进入本节点下选择策略器的客户，并执行动作。",
    show: () => doDiverse.value,
    comp: Strategist,
  },
];

const comps = computed(() => _comps.filter((comp) => comp?.show?.() ?? true));

function openCondition() {
  const { nodeName } = data;

  openDrawer({
    title: nodeName !== "兜底策略器" ? "选择策略器" : "兜底策略器",
    comp: nodeName === "兜底策略器" ? Strategist : PolicySettingsAttr,
  });
}

function openDrawer(comp: any, doNew: boolean = false) {
  dialogVisible.value = false;

  Object.assign(drawerOptions, { ...comp, new: doNew });

  if (!data.executeType) data.executeType = "immediately";

  drawerOptions.visible = true;
}

let _saveFunc: (() => boolean) | null = null;

function handleSave() {
  if (!_saveFunc || !_saveFunc()) return;

  Object.assign(__data, data);

  console.log("____", __data)

  // window.$refreshLayout()

  dialogVisible.value = false;
  drawerOptions.visible = false;
}

provide("save", (regFunc: () => boolean) => {
  _saveFunc = regFunc;
});

const pushTemplate = computed(() => {
  const { type } = data?.touchTemplateContent || {};
  if (!type || String(data.nodeDelayed.delayedAction).toLocaleLowerCase().indexOf('touch') === -1)
    return {
      has: false,
      val: "",
    };

  let val;

  if (type === "sms") {
    val = "短信模板：";
  } else if (type === "znx") {
    val = "站内信模板：";
  } else if (type === "appPush") {
    val = "APP消息模板：";
  } else if (type === "digital") {
    val = "企微模板：";
  } else if (type === "outbound") {
    val = "智能外呼模板：";
  }

  return {
    has: type?.length,
    val,
  };
});

const delayedActionStr = computed(() => {
  const action = data?.nodeDelayed?.delayedAction;
  if (!action) return "";

  if (action === "touch") return "发送触达";

  const { labelName, labelValue } = data?.labelContent || {}

  const _LABEL = (labelName) ? `${labelName}:${labelValue}` : ""

  if (action === "label") return "打上标签" + _LABEL;
  if (action === "touchAndLabel") return "发送触达并打上标签" + _LABEL;
  return "不执行动作";
});

const visible = ref(false);
function del(p: MarketingTouchEditDTO) {
  _data.$del(p);

  visible.value = false;
}
</script>

<template>
  <el-card style="width: 355px" class="PBlock">
    <p class="title">
      <!-- 选择策略器 -->
      {{ data.nodeName }}
      <el-popover :visible="visible" placement="top" :width="160">
        <p>是否确认删除？</p>
        <div style="text-align: right; margin: 0">
          <el-button size="small" text @click="visible = false">取消</el-button>
          <el-button size="small" type="primary" @click="del(__data)">确认</el-button>
        </div>
        <template #reference>
          <el-button v-if="!_data.$readonly" @click="visible = true" text type="primary">
            <el-icon>
              <Delete />
            </el-icon>
            删除
          </el-button>
        </template>
      </el-popover>
    </p>
    <div class="PBlock-Content theme" @click="openCondition">
      <div v-if="data.nodeName !== '兜底策略器'" style="--theme-color: #90a0b8" class="PBlock-Section">
        <template v-if="data.diversionType === 'noDiversion'">
          <p>不分流</p>
          <span>不分流</span>
        </template>
        <template v-if="data.diversionType === 'attr'">
          <p>客户属性行为分流</p>
          <span>客户属性满足：{{ data.customRuleContent.customAttr?.conditions?.length || 0 }}条</span>
          <br />
          <span>客户事件满足：{{ data.customRuleContent.customEvent?.conditions?.length || 0 }}条</span>
          <br />
          <span>行为序列满足：{{ data.customRuleContent.eventSequence?.conditions?.length || 0 }}条</span>
        </template>
        <template v-if="data.diversionType === 'event'">
          <p>触发事件分流</p>
          <span>触发事件满足：{{ data.eventRuleContent?.customEvent?.conditions?.length || 0 }}条</span>
        </template>
      </div>
      <div style="--theme-color: #7dc757" class="PBlock-Section">
        <p>延迟设置</p>
        <span v-if="data.nodeDelayed?.isDelayed">
          符合该策略器 {{ data.nodeDelayed.delayedTime }}
          <span>
            <span v-if="data.nodeDelayed.delayedUnit === 'day'"> 天 </span>
            <span v-else-if="data.nodeDelayed.delayedUnit === 'hour'"> 小时 </span>
            <span v-else-if="data.nodeDelayed.delayedUnit === 'minute'"> 分钟 </span>
          </span>
          后
          <!-- {{ delayedActionStr }} -->
        </span>
        <!-- <span v-else-if="data.nodeDelayed.delayedAction === 'nothing'">不执行动作</span> -->
        <span v-else>立即针对符合该策略器条件的客户</span>
        <span>{{ delayedActionStr }}</span>
      </div>
      <div v-if="pushTemplate.has" style="--theme-color: #ffb858" class="PBlock-Section">
        <p>APP推送</p>
        <span>{{ pushTemplate.val }}</span>
      </div>
      <div v-if="_data.$readonly">
        <StatisticsDisplay :nodeId="data.$id" />
      </div>
    </div>

    <teleport to="body">
      <el-dialog v-model="dialogVisible" width="25%" title="请选择添加类型" align-center>
        <div class="Dialog-Sections">
          <div @click="openDrawer(item, true)" v-for="item in comps" class="PBlock-Section"
            :class="{ disabled: item.disabled?.value }">
            <p>
              <el-icon v-if="item.icon.type === 'comp'">
                <component :is="item.icon.value" />
              </el-icon>
              <img v-else :src="item.icon.value as any" />
              {{ item.title }}
            </p>
            <span v-text="item.desc" />
          </div>
        </div>
      </el-dialog>
    </teleport>

    <teleport to="body">
      <el-drawer v-if="drawerOptions.visible" v-model="drawerOptions.visible" :title="drawerOptions.title" size="55%">
        <component :readonly="_data.$readonly" :new="drawerOptions?.new" :p="data" :is="drawerOptions.comp" />
        <template #footer>
          <template v-if="_data.$readonly">
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

  <el-button @click="dialogVisible = true" :class="{
        disabled: _data.$readonly,
        display:
          data.diversionType && data.nodeDelayed.isDelayed !== undefined && pushTemplate,
      }" class="start-add" type="primary" :icon="Plus" circle />
</template>

<style lang="scss">
.Dialog-Sections {
  display: flex;

  gap: 2rem;
  justify-content: center;
}

.PBlock-Section {
  width: 50%;
}

.start-add {
  position: absolute;

  left: 50%;

  transform: translate(-50%, -50%);
}

.PBlock-Section .el-icon {
  top: 0.125rem;

  margin-bottom: 0.5rem;
}
</style>
