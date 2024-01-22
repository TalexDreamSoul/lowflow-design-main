<script setup lang="ts">
import { ref, reactive, computed, provide } from 'vue'
import { Stamp, Plus } from '@element-plus/icons-vue'
import ConditionSetAttr from './start/ConditionSetAttr.vue'
import PolicySettingsAttr from './start/PolicySettingsAttr.vue'
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
    title: "兜底策略器",
    desc: "按客户属性行为或触发事件对客户筛选分流，并执行动作。",
    comp: ConditionSetAttr
  }
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

let _saveFunc: Function | null = null

function handleSave() {
  if (!_saveFunc) return

  _saveFunc()
}

provide('save', (regFunc: () => void) => {
  _saveFunc = regFunc
})
</script>

<template>
  <el-card style="width: 200px" class="PBlock">
    <p>选择策略器 {{ p.name }}</p>
    <div class="PBlock-Content theme">
      <div @click="openCondition" class="PBlock-Section">
        <p>
          客户属性行为分流
        </p>
        <span>不分流</span>
      </div>
      <div @click="openCondition" class="PBlock-Section">
          <p>
            客户属性行为分流
          </p>
          <span>不分流</span>
        </div>
        <div @click="openCondition" class="PBlock-Section">
          <p>
            客户属性行为分流
          </p>
          <span>不分流</span>
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