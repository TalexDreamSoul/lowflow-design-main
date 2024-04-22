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
    <span>
      {{ data.nodeName }}
    </span>
    <el-popconfirm
    hide-icon
     confirm-button-text="确认"
    cancel-button-text="取消"
    title="是否确认删除？"
    @confirm="del(__data)"
    @cancel="visible = false"
  >
  <template #reference>
    <el-button v-if="!readonly" @click="visible = true" text type="primary">
      <el-icon>
        <Delete />
      </el-icon>
      删除
    </el-button>
  </template>
  </el-popconfirm> 
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