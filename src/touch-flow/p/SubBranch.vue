<script setup lang="ts" name="SubBranch">
import { watch } from 'vue'
import SubDiversionAttr from './attr/SubDiversionAttr.vue';
import Maskgroup from "~/assets/icon/Maskgroup.png";
import { genNodeParams } from './common/node-util';
import BaseNode from './common/BaseNode.vue';

const params = genNodeParams()
const { readonly, useDisplayAttr, data, openDrawer, haveDiverse } = params

watch(data, () => {
  const { children } = data;

  [...(children || [])].forEach((item, index) => {
    if (!index) return

    item.$index = index

    const { diversionType } = item
    if (diversionType === 'safeguard') return

    item.diversionType = children[0].diversionType

    item.eventDelayed.delayedTime = children[0].eventDelayed.delayedTime
    item.eventDelayed.delayedUnit = children[0].eventDelayed.delayedUnit
  })
}, { immediate: true })

function openCondition() {
  openDrawer({
    title: "流量策略器设置",
    // TODO page draw
    comp: SubDiversionAttr,
  });
}

const { pushTemplate, delayedActionStr } = useDisplayAttr()
</script>

<template>
  <BaseNode :params="params" :disabled="readonly || haveDiverse"
    :display="data.nodeDelayed?.isDelayed !== undefined || pushTemplate?.has">
    <p class="title">
     <span>
      {{ data.nodeName }}
     </span> 
      <span style="float: right;font-size: 14px;color:#797979;
      font-weight: 500;">
        {{ data.nodeContent?.data?.branchName }}

        <span style="color: #00C068;font-weight: 600">{{ data.branchRatio }}%</span>
      </span>
    </p>
    <div @click="openCondition" class="PBlock-Content theme">
      <template v-if="data.nodeDelayed?.delayedAction || pushTemplate?.has">
        <div style="display: flex; flex-direction: column; gap: 1rem">
          <!-- v-if="data.nodeDelayed?.isDelayed" -->
          <div style="--theme-color: #7dc757" class="PBlock-Section">
            <p>延时设置</p>
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
        <el-empty :image="Maskgroup" :image-size="76">
          <template #description>
            暂未配置.
          </template>
        </el-empty>
      </template>
    </div>
  </BaseNode>
</template>