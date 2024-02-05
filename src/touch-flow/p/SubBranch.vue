<script setup lang="ts" name="SubBranch">
import { ref, reactive, provide } from 'vue'
import { Stamp, Plus } from '@element-plus/icons-vue'
import ConditionSetAttr from './start/ConditionSetAttr.vue'
import PolicySettingsAttr from './start/PolicySettingsAttr.vue'
import DeliverySettingsAttr from './start/DeliverySettingsAttr.vue'
import { delChild } from '../flow-utils'

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
    title: "分流器",
    desc: "按设置的比例自动客户对随机分流，并执行动作。",
    comp: PolicySettingsAttr
  },
  {
    icon: {
      type: 'comp',
      value: Stamp
    },
    title: "兜底策略器",
    desc: "按客户属性行为或触发事件对客户筛选分流，并执行动作。",
    comp: ConditionSetAttr
  }
]

function openCondition() {
  openDrawer({
    title: "分流器",
    comp: DeliverySettingsAttr
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
</script>

<template>
  <el-card style="width: 355px" class="PBlock">
  子分流器 demo
    <p class="title">
      <!-- 选择策略器 -->
      {{ p.nodeName }}
    </p>
    <div class="PBlock-Content theme">
      <div style="--theme-color: #90A0B8" @click="openCondition" class="PBlock-Section">
        <div>
        BRANCH
        </div>
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
              <img v-else :src="item.icon.value as any" />
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
          <el-button round @click="drawerOptions.visible = false">取消</el-button>
          <el-button round @click="handleSave" type="primary">保存</el-button>
        </template>
      </el-drawer>
    </teleport>
  </el-card>

  <el-button @click="dialogVisible = true" class="start-add" type="primary" :icon="Plus" circle />
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