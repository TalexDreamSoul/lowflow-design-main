<script setup lang="ts">
import BaseNode from './common/BaseNode.vue';
import { ref } from 'vue'
import { Delete } from '@element-plus/icons-vue'
import DeliverySettingsAttr from './attr/DeliverySettingsAttr.vue'
import { MarketingTouchEditDTO } from './behavior/marketing';
import { genNodeParams } from './common/node-util';

const params = genNodeParams()
const { readonly, $data, data, __data, openDrawer, useDel } = params

function openCondition() {
  openDrawer({
    title: "分流器",
    comp: DeliverySettingsAttr
  })
}
const del = useDel().del
</script>

<template>
  <BaseNode :params="params" :disabled="true" :display="true">
    <p class="title">
      <span>
        {{ data.nodeName }}
      </span>
      <el-popover trigger="hover" placement="top" :width="160">
        <p>是否确认删除？</p>
        <div style="text-align: right; margin: 0">
          <el-button size="small" text>取消</el-button>
          <el-button size="small" type="primary" @click="del(__data)">确认</el-button>
        </div>
        <template #reference>
          <el-button v-if="!readonly" text type="primary">
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