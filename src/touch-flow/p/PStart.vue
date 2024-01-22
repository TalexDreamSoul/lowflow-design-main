<script setup lang="ts">
import { ref, reactive, computed, provide } from 'vue'
import { Stamp, Plus } from '@element-plus/icons-vue'
import ConditionSetAttr from '../p/start/ConditionSetAttr.vue'
import PolicySettingsAttr from '../p/start/PolicySettingsAttr.vue'
const props = defineProps<{
  p?: any,
}>()

const dialogVisible = ref(false)
const drawerOptions = reactive({
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
    title: "分流器",
    desc: "按设置的比例自动对客户随机分流，并执行动作",
    comp: ConditionSetAttr
  },
  {
    icon: {
      type: 'comp',
      value: Stamp
    },
    title: "兜底选择器",
    desc: "按设置的比例自动对客户随机分流，并执行动作",
    comp: ConditionSetAttr
  },
]

function openCondition() {
  openDrawer({
    title: "流程类型设置",
    comp: ConditionSetAttr
  })
}

function openDrawer(comp: any) {
  dialogVisible.value = false

  Object.assign(drawerOptions, comp)

  if (!props.p.labelPosition)
    props.p.labelPosition = "single";

  drawerOptions.visible = true
}

const flowType = computed(() => {
  if (!props.p?.labelPosition) return '-'
  const map: { [key: string]: string } = {
    'single': "定时型-单次",
    'repeat': "定时型-重复",
    'type': '触发型'
  }

  const s: string = props.p?.labelPosition

  return map[s.toLowerCase()]
})

const flowTime = computed(() => {
  const _time = props.p.time
  if (!_time) return '-'

  if (_time instanceof Date) {
    const s: Date = _time

    return s.toLocaleString().replaceAll('/', '-')
  }

  const [date1, date2] = _time
  if (!date1 || !date2) return '-'

  const date1Text = date1.toLocaleDateString().replaceAll('/', '-')
  const date2Text = date2.toLocaleDateString().replaceAll('/', '-')

  return `${date1Text} 至 ${date2Text}`
})

let _saveFunc: Function | null = null

function handleSave() {
  if (!_saveFunc) return

  _saveFunc()

  dialogVisible.value = false
  drawerOptions.visible = false
}

provide('save', (regFunc: () => void) => {
  _saveFunc = regFunc
})
</script>

<template>
  <el-card class="PBlock">
    <p>进入流程设置</p>
    <div class="PBlock-Content">
      <div @click="openCondition" class="PBlock-Section">
        <p>
          <el-icon>
            <Position />
          </el-icon>
          进入条件
        </p>
        <span v-if="flowType !== '-' && flowTime !== '-'" style="opacity: .75;font-size: 14px">
          <span>流程类型：{{ flowType }}</span><br />
          <span>进入时间：{{ flowTime }}</span><br />
        </span>
        <span v-else>设置流程类型、流程有效期、流程开始时间、进入限制。</span>
      </div>
      <div class="PBlock-Section">
        <p>
          <el-icon>
            <User />
          </el-icon>
          受众客户
        </p>
        <span>根据客户属性、客户标签、客户行为、行为序列筛选能够进入流程的客户</span>
      </div>
    </div>

    <teleport to="body">
      <el-dialog v-model="dialogVisible" width="30%" title="请选择添加类型" align-center>
        <div class="Dialog-Sections">
          <div @click="openDrawer(item)" v-for="item in comps" class="PBlock-Section">
            <p>
              <el-icon v-if="item.icon.type === 'comp'">
                <component :is="item.icon.value" />
              </el-icon>
              <img v-else :src="item.icon.value" />
              {{ item.title }}
            </p>
            <span v-text="item.desc" />
          </div>
        </div>
      </el-dialog>
    </teleport>

    <teleport to="body">
      <el-drawer v-model="drawerOptions.visible" :title="drawerOptions.title">
        <component :p="p" :is="drawerOptions.comp" />
        <template #footer>
          <el-button @click="drawerOptions.visible = false">取消</el-button>
          <el-button @click="handleSave" type="primary">保存</el-button>
        </template>
      </el-drawer>
    </teleport>
  </el-card>

  <el-button @click="dialogVisible = true" class="start-add" type="primary" :icon="Plus" circle />
</template>

<style lang="scss">
.Dialog-Sections {
  p {
    margin: 0;
  }
  display: flex;

  gap: 2rem;
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