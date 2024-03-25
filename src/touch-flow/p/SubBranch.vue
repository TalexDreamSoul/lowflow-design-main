<script setup lang="ts" name="SubBranch">
import { ref, reactive, provide, inject, computed, watch } from 'vue'
import { Stamp, Plus } from '@element-plus/icons-vue'
import SubDiversionAttr from './attr/SubDiversionAttr.vue';
import PolicySettingsAttr from "./attr/PolicySettingsAttr.vue";
import DeliverySettingsAttr from "./attr/DeliverySettingsAttr.vue";
import Strategist from "./attr/Strategist.vue";

const getNode: Function = inject('getNode')!
const { data: _data } = getNode()
const __data = _data.$d(_data.id)
const data = reactive(_data.data)

const dom = ref()
const dialogVisible = ref(false)
const drawerOptions = reactive<any>({
  visible: false
})

Object.assign(data, __data)

watch(data, () => {
  const { children } = data;

  [...children].forEach((item, index) => {
    if (!index) return

    item.$index = index

    const { nodeName } = item
    if (nodeName === '兜底策略器') return

    item.diversionType = children[0].diversionType

    item.eventDelayed.delayedTime = children[0].eventDelayed.delayedTime
    item.eventDelayed.delayedUnit = children[0].eventDelayed.delayedUnit
  })
}, { immediate: true })

console.log("SubBranch setup!", getNode(), __data, data)

const doDiverse = computed(() => {
  const { children } = data;

  if (!children?.length) return false;

  return [...children].find((child) => "strategy" === child?.nodeType) ?? true
});

const haveDiverse = computed(() => {
  if (!doDiverse.value) return false;

  const { children } = data;

  if (!children?.length) return false;

  return [...children].find((child) => "diversion" === child?.nodeType);
})

const haveReveal = computed(() => {
  const { children } = data;

  if (!children?.length) return false;

  return [...children].find((child) => "strategy" === child?.nodeType && child?.reveal) ?? false
})

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
    show: () => !doDiverse.value,
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

function openDrawer(comp: any) {
  dialogVisible.value = false

  Object.assign(drawerOptions, comp)

  drawerOptions.visible = true
}

function openCondition() {
  openDrawer({
    title: "流量策略器设置",
    // TODO page draw
    comp: SubDiversionAttr,
  });
}

let _saveFunc: (() => boolean) | null = null

function handleSave() {
  if (!_saveFunc || !_saveFunc()) return

  data.nodeContent = {
    data: {
      $template: pushTemplate.value
    }
  }

  Object.assign(__data, data)

  console.log("@save", __data, data)

  window.$refreshLayout()

  dialogVisible.value = false
  drawerOptions.visible = false
}

const pushTemplate = computed(() => {
  if (!data.material || !data.touch) {
    return {
      has: false,
      val: ''
    }
  }

  const { type, templates } = data.material
  const { type: targetId } = data.touch

  const res = templates.filter((item: any) => item.id === targetId)?.[0]?.name || 'ERROR'

  let val;

  if (type === 'sms') {
    val = '短信模板：'
  } else if (type === 'znx') {
    val = '站内信模板：'
  } else if (type === 'appPush') {
    val = 'APP消息模板：'
  } else if (type === 'digital') {
    val = '企微模板：'
  } else if (type === 'outbound') {
    val = '智能外呼模板：'
  }

  const obj = {
    has: type?.length,
    val: `${val}${res}`
  }

  // Object.defineProperty(, '$template', { value: obj, enumerable: false, configurable: false, writable: false })

  return obj
})

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

provide('save', (regFunc: () => boolean) => {
  _saveFunc = regFunc
})
</script>

<template>
  <el-card ref="dom" style="width: 355px" class="PBlock">
    <p class="title">
      流量策略器
      <span style="float: right">
        {{ data.nodeName }}
        <span style="color: green;font-weight: 600">{{ data.branchRatio }}%</span>
      </span>
    </p>
    <div @click="openCondition" class="PBlock-Content theme">
      <template v-if="data.nodeDelayed?.delayedAction || pushTemplate?.has">
        <div style="display: flex; flex-direction: column; gap: 1rem">
          <!-- v-if="data.nodeDelayed?.isDelayed" -->
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
          <div v-if="pushTemplate.has" style="--theme-color: #FFB858" class="PBlock-Section">
            <p>
              APP推送
            </p>
            <span>{{ pushTemplate.val }}</span>
          </div>

        </div>
      </template>
      <template v-else>
        <el-empty>
          <template #description>
            暂未配置.
          </template>
        </el-empty>
      </template>
    </div>

    <teleport to="body">
      <el-dialog v-model="dialogVisible" width="25%" title="请选择添加类型" align-center>
        <div class="Dialog-Sections">
          <div @click="openDrawer(item)" v-for="item in comps" class="PBlock-Section"
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
      <el-drawer v-model="drawerOptions.visible" :title="drawerOptions.title" size="55%">
        <component :readonly="_data.$readonly" :p="data" :is="drawerOptions.comp" />
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

  <el-button
    :class="{ display: data.nodeDelayed?.isDelayed !== undefined || pushTemplate?.has, disabled: _data.$readonly || haveDiverse }"
    @click="dialogVisible = true" class="start-add" type="primary" :icon="Plus" circle />
</template>

<style lang="scss">
.Dialog-Sections {
  display: flex;

  gap: 1rem;
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
  top: .125rem;

  margin-bottom: .5rem;
}
</style>