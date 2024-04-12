<script setup lang="ts">
import BaseNode from './common/BaseNode.vue';
import { ref } from 'vue'
import { Delete } from '@element-plus/icons-vue'
import DeliverySettingsAttr from './attr/DeliverySettingsAttr.vue'
import { MarketingTouchEditDTO } from './behavior/marketing';
import { genNodeParams } from './common/node-util';

const params = genNodeParams()
const { readonly, $data, data, __data, openDrawer } = params

function openCondition() {
  openDrawer({
    title: "分流器",
    comp: DeliverySettingsAttr
  })
}
const visible = ref(false)
function del(p: MarketingTouchEditDTO) {
  console.log("del", p, data, $data)
  $data.$del(p);

  visible.value = false;
}
</script>

<template>
  <BaseNode :params="params" :disabled="readonly" :display="true">
    <p class="title">
      {{ data.nodeName }}
      <el-popover :visible="visible" placement="top" :width="160">
        <p>是否确认删除？</p>
        <div style="text-align: right; margin: 0">
          <el-button size="small" text @click="visible = false">取消</el-button>
          <el-button size="small" type="primary" @click="del(__data)">确认</el-button>
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
  </BaseNode>
</template>