<script setup lang="ts">
import { watch } from "vue";
import { Delete } from "@element-plus/icons-vue";
import PolicySettingsAttr from "./attr/PolicySettingsAttr.vue";
import { _delChild } from "../flow-utils";
import Strategist from "./attr/Strategist.vue";
import StatisticsDisplay from './attr/StatisticsDisplay.vue'
import { genNodeParams } from "./common/node-util";
import BaseNode from "./common/BaseNode.vue";

const params = genNodeParams()
const { readonly, useDisplayAttr, useDel, data, __data, openDrawer, haveDiverse } = params

watch(data, () => {
  const { children } = data;

  children && [...children].forEach((item, index) => {
    if (!index) return

    item.$index = index

    item.diversionType = children[0].diversionType
  })
}, { immediate: true })

function openCondition() {
  const { diversionType } = data;

  openDrawer({
    title: diversionType !== "safeguard" ? "选择策略器" : "兜底策略器",
    comp: diversionType === "safeguard" ? Strategist : PolicySettingsAttr,
  });
}

const { pushTemplate, delayedActionStr } = useDisplayAttr()

const { visible, del } = useDel()
</script>

<template>
  <BaseNode :params="params" :disabled="readonly || haveDiverse"
    :display="data.diversionType && data.nodeDelayed.isDelayed !== undefined && pushTemplate">
    <p>
      <!-- 选择策略器 -->
      {{ data.nodeName }}
      <el-popover :visible="visible" placement="top" :width="160">
        <p>是否确认删除？</p>
        <div style="text-align: right; margin: 0">
          <el-button size="small" text @click="visible = false">取消</el-button>
          <el-button size="small" type="primary" @click="del(__data)">确认</el-button>
        </div>
        <template #reference>
          <el-button v-if="readonly" @click="visible = true" text type="primary">
            <el-icon>
              <Delete />
            </el-icon>
            删除
          </el-button>
        </template>
      </el-popover>
    </p>
    <div class="PBlock-Content theme" @click="openCondition">
      <div v-if="data.diversionType !== 'safeguard'" style="--theme-color: #90a0b8" class="PBlock-Section">
        <template v-if="data.diversionType === 'noDiversion'">
          <p>不分流</p>
          <span>不分流</span>
        </template>
        <template v-if="data.diversionType === 'attr'">
          <p>客户属性行为分流</p>
          <span>客户属性满足：{{ data.customRuleContent?.customAttr?.conditions?.length || 0 }}条</span>
          <br />
          <span>客户事件满足：{{ data.customRuleContent?.customEvent?.conditions?.length || 0 }}条</span>
          <br />
          <span>行为序列满足：{{ data.customRuleContent?.eventSequence?.conditions?.length || 0 }}条</span>
        </template>
        <template v-if="data.diversionType === 'event'">
          <p>触发事件分流</p>
          <span>触发事件满足：{{ data.eventRuleContent?.customEvent?.conditions?.length || 0 }}条</span>
        </template>
      </div>
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
      <div v-if="pushTemplate.has" style="--theme-color: #ffb858" class="PBlock-Section">
        <p>{{ pushTemplate.title }}</p>
        <span>{{ pushTemplate.title }}：{{ pushTemplate.val }}</span>
      </div>
      <div v-if="readonly">
        <StatisticsDisplay :nodeId="data.$id" />
      </div>
    </div>
  </BaseNode>
</template>
