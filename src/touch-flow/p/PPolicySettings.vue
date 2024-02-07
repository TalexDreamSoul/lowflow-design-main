<script setup lang="ts">
import { ref, reactive, provide, computed } from 'vue'
import { Stamp, Plus } from '@element-plus/icons-vue'
import PolicySettingsAttr from './start/PolicySettingsAttr.vue'
import { delChild } from '../flow-utils'
import Strategist from './start/Strategist.vue'

const props = defineProps<{
  p?: any,
}>()

const dialogVisible = ref(false)
const drawerOptions = reactive<any>({
  visible: false
})

const comps = [
  {
    icon: {
      type: 'comp',
      value: Stamp
    },
    title: "选择策略器",
    desc: "按客户属性行为或触发事件对客户筛选分流，并执行动作。",
    comp: PolicySettingsAttr
  },
  {
    icon: {
      type: 'comp',
      value: Stamp
    },
    title: "兜底策略器",
    desc: "按客户属性行为或触发事件对客户筛选分流，并执行动作。",
    comp: Strategist
  }
]

function openCondition() {
  const { nodeName } = props.p

  openDrawer({
    title: nodeName,
    comp: nodeName === '兜底策略器' ? Strategist : PolicySettingsAttr
  })
}

function openDrawer(comp: any) {
  dialogVisible.value = false

  Object.assign(drawerOptions, comp)

  if (!props.p.executeType)
    props.p.executeType = "immediately";

  drawerOptions.visible = true
}

let _saveFunc: (() => boolean) | null = null

function handleSave() {
  if (!_saveFunc || !_saveFunc()) return

  dialogVisible.value = false
  drawerOptions.visible = false
}

provide('save', (regFunc: () => boolean) => {
  _saveFunc = regFunc
})

const pushTemplate = computed(() => {
  const { type } = props.p.material

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

  visible.value = false
}
</script>

<template>
  <el-card style="width: 355px" class="PBlock">
    <p class="title">
      <!-- 选择策略器 -->
      {{ p.nodeName }}
      <el-popover :visible="visible" placement="top" :width="160">
        <p>是否确认删除？</p>
        <div style="text-align: right; margin: 0">
          <el-button size="small" text @click="visible = false">取消</el-button>
          <el-button size="small" type="primary" @click="del(p)">确认</el-button>
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
      <div v-if="p.nodeName !== '兜底策略器'" style="--theme-color: #90A0B8" class="PBlock-Section">
        <p>
          客户属性行为分流
        </p>
        <span v-if="p.diversionType === 'noDiversion'">
          不分流
        </span>
        <span v-else-if="p.diversionType === 'attr'">
          按属性用户行为分流
        </span>
        <span v-else-if="p.diversionType === 'event'">按触发事件分流</span>
      </div>
      <div style="--theme-color: #7DC757" class="PBlock-Section">
        <p>
          延迟设置
        </p>
        <span v-if="p.eventDelayed.isDelayed">
          符合该策略器 {{ p.eventDelayed.delayedTime }} {{ p.eventDelayed.delayedUnit }} 后 {{ p.eventDelayed.delayedAction }}
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
      <el-dialog v-model="dialogVisible" width="55%" title="请选择添加类型" align-center>
        <div class="Dialog-Sections">
          <div @click="openDrawer(item)" v-for="item in comps" class="PBlock-Section">
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
        <component :new="true" :p="p" :is="drawerOptions.comp" />
        <template #footer>
          <el-button round @click="drawerOptions.visible = false">取消</el-button>
          <el-button round @click="handleSave" type="primary">保存</el-button>
        </template>
      </el-drawer>
    </teleport>
  </el-card>

  <el-button @click="dialogVisible = true"
    :class="{ display: p.diversionType && p.eventDelayed.isDelayed !== undefined && pushTemplate }" class="start-add"
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