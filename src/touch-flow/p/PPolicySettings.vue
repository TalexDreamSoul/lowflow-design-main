<script setup lang="ts">
import { ref, reactive, provide, computed, inject } from 'vue'
import { Stamp, Plus, Delete } from '@element-plus/icons-vue'
import PolicySettingsAttr from './start/PolicySettingsAttr.vue'
import DeliverySettingsAttr from "./start/DeliverySettingsAttr.vue";
import { delChild } from '../flow-utils'
import Strategist from './start/Strategist.vue'

const getNode: Function = inject('getNode')!
const { data: _data } = getNode()
const __data = _data.$d(_data.id)
const data = reactive(_data.data)

const dialogVisible = ref(false)
const drawerOptions = reactive<any>({
  visible: false,
  new: false
})

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

const customerConditioned = computed(() => {
  const { customAttr, customEvent } = (data?.customRuleContent ?? {})

  const _obj = {
    customAttr: customAttr?.conditions?.length ?? 0,
    customEvent: customEvent?.conditions?.length ?? 0,
  }

  return {
    display: _obj.customAttr && _obj.customEvent,
    ..._obj
  }
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
  const { nodeName } = data

  openDrawer({
    title: nodeName,
    comp: nodeName === '兜底策略器' ? Strategist : PolicySettingsAttr
  })
}

function openDrawer(comp: any, doNew: boolean = false) {
  dialogVisible.value = false

  Object.assign(drawerOptions, { ...comp, new: doNew })

  if (!data.executeType)
    data.executeType = "immediately";

  drawerOptions.visible = true
}

let _saveFunc: (() => boolean) | null = null

function handleSave() {
  if (!_saveFunc || !_saveFunc()) return

  Object.assign(__data, data)

  window.$refreshLayout()

  dialogVisible.value = false
  drawerOptions.visible = false
}

provide('save', (regFunc: () => boolean) => {
  _saveFunc = regFunc
})

const pushTemplate = computed(() => {
  const { type } = data.material

  let val;

  if (type === 'sms') {
    val = '短信模板：'
  } else if (type === 'znx') {
    val = '站内信模板：'
  } else if (type === 'appPush') {
    val = 'APP消息模板：'
  } else if (type === 'digital') {
    val = '数字员工模板：'
  } else if (type === 'outbound') {
    val = '智能外呼模板：'
  }

  return {
    has: type?.length,
    val
  }
})

const visible = ref(false)
function del(p: any) {
  delChild(p)

  window.$refreshLayout()

  visible.value = false
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
          <el-button @click="visible = true" text type="primary">
            <el-icon>
              <Delete />
            </el-icon>
            删除
          </el-button>
        </template>
      </el-popover>
    </p>
    <div class="PBlock-Content theme" @click="openCondition">
      <div v-if="data.nodeName !== '兜底策略器'" style="--theme-color: #90A0B8" class="PBlock-Section">
        <p>
          客户属性行为分流
        </p>
        <span v-if="data.diversionType === 'noDiversion'">
          不分流
        </span>
        <span v-else-if="data.diversionType === 'attr'">
          按属性用户行为分流
        </span>
        <span v-else-if="data.diversionType === 'event'">按触发事件分流</span>
      </div>
      <div style="--theme-color: #7DC757" class="PBlock-Section">
        <p>
          延迟设置
        </p>
        <span v-if="data.eventDelayed.isDelayed">
          符合该策略器 {{ data.eventDelayed.delayedTime }} {{ data.eventDelayed.delayedUnit }} 后 {{ data.eventDelayed.delayedAction }}
        </span>
        <span v-else>立即针对符合该策略器条件的客户发送触达</span>
      </div>
      <div v-if="pushTemplate.has" style="--theme-color: #FFB858" class="PBlock-Section">
        <p>
          APP推送
        </p>
        <span>{{ pushTemplate.val }}</span>
      </div>
    </div>

    <teleport to="body">
      <el-dialog v-model="dialogVisible" width="30%" title="请选择添加类型" align-center>
        <div class="Dialog-Sections">
          <div @click="openDrawer(item, true)" v-for="item in comps" class="PBlock-Section" :class="{ disabled: item.disabled?.value }">
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
        <component :new="drawerOptions?.new" :p="data" :is="drawerOptions.comp" />
        <template #footer>
          <el-button round @click="drawerOptions.visible = false">取消</el-button>
          <el-button round @click="handleSave" type="primary">保存</el-button>
        </template>
      </el-drawer>
    </teleport>
  </el-card>

  <el-button @click="dialogVisible = true"
    :class="{ display: data.diversionType && data.eventDelayed.isDelayed !== undefined && pushTemplate }" class="start-add"
    type="primary" :icon="Plus" circle />
</template>

<style lang="scss">
.Dialog-Sections {
  display: flex;

  gap: .5rem;
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