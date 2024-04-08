<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Delete } from '@element-plus/icons-vue'
import DeliverySettingsAttr from './attr/DeliverySettingsAttr.vue'
import { MarketingTouchEditDTO } from './behavior/marketing';
import { genNodeParams } from './common/node-util';

const { readonly, $data, data, dialogVisible, drawerOptions, openDrawer, comps, handleClick, handleSave } = genNodeParams()

function openCondition() {
  openDrawer({
    title: "分流器",
    comp: DeliverySettingsAttr
  })
}
const visible = ref(false)
function del(p: MarketingTouchEditDTO) {
  $data.$del(p);

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
          <el-button size="small" type="primary" @click="del(data)">确认</el-button>
        </div>
        <template #reference>
          <el-button v-if="!readonly" @click="visible = true" text type="primary">
            <el-icon>
              <Delete />
            </el-icon>
            删除
          </el-button>
        </template>
      </el-popover>
    </p>
    <div class="PBlock-Content theme">
      <div style="--theme-color: #90A0B8" @click="openCondition" class="PBlock-Section">
        <div>
          包含{{ data.children.length }}个分支
        </div>
      </div>
    </div>

    <teleport to=".FlowPage">
      <el-dialog v-model="dialogVisible" width="25%" title="请选择添加类型" align-center>
        <div class="Dialog-Sections">
          <div @click="openDrawer(item)" v-for="item in comps" :class="{ disabled: item.disabled?.value }"
            class="PBlock-Section">
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

  <el-button :class="{
    disabled: readonly,
  }" @click="dialogVisible = true" class="start-add" type="primary" :icon="Plus" circle />
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