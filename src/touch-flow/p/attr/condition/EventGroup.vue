<script setup lang="ts" name="EventGroup">
import BehaviorGroupPlus from "../../behavior/BehaviorGroupPlus.vue";
import { dictFilterTree as getDictFilterTree } from "~/api/index";
import TouchBlockGenre from "../../genre/TouchBlockGenre.vue";
import { CirclePlusFilled } from "@element-plus/icons-vue";
import { ref } from "vue";

const props = defineProps<{
  p: any;
  outside?: boolean;
  readonly?: boolean;
}>();

const dict = ref<any>();

function addEventA() {
  props.p.triggerRuleContent.eventA.customEvent.conditions[0].conditions.push({
    conditions: [],
    logicalChar: "或",
  });
  console.log(props.p);
}

function addEventB() {
  props.p.triggerRuleContent.eventB.customEvent.conditions[0].conditions.push({
    conditions: [],
    logicalChar: "或",
  });
}

!(async () => {
  const res: any = await getDictFilterTree({
    pageNum: "1",
    pageSize: "999",
  });

  if (res.data) {
    dict.value = res.data;
  }
})();


const handleUnitChange = (newVal: string) => {
  let maxValue = 0;
  // 根据选择的单位更新最大值和输入框的最大限制
  if (newVal === "day") {
    maxValue = 30;
  } else if (newVal === "hour") {
    maxValue = 720;
  } else if (newVal === "minute") {
    maxValue = 43200;
  }
  // 如果当前输入值超过最大值，则将输入值设为最大值
  if (props.p.triggerRuleContent.delayed.delayedTime > maxValue) {
    props.p.triggerRuleContent.delayed.delayedTime = maxValue;
  }
};
</script>

<template>
  <div class="EventGroup">
    <BehaviorGroupPlus :readonly="readonly" :default-expand="true" :hideToggleButton="true" title="触发时间组A"
      color="#F5F7FA">
      <el-form-item>
        <div class="EventGroup-SubEvent">

          <el-text>在流程有效期内依次完成下列事件后</el-text>&nbsp; &nbsp;
          <el-text v-if="!readonly" type="primary" style="cursor: pointer" @click="addEventA">
            <el-icon size="14">
              <CirclePlusFilled />
            </el-icon>
            添加事件
          </el-text>
        </div>

      </el-form-item>

      <TouchBlockGenre :readonly="readonly" :outside="outside" v-if="dict"
        :condition="p.triggerRuleContent.eventA.customEvent" :dict="dict" />
    </BehaviorGroupPlus>

    <BehaviorGroupPlus :readonly="readonly" :default-expand="p.triggerRuleContent.delayed.isDelayed" title="触发时间组B"
      color="#F5F7FA">
      <template #title>
        <el-text style="color: #4078e0; cursor: pointer" v-if="!p.triggerRuleContent.delayed.isDelayed" @click="
          p.triggerRuleContent.delayed.isDelayed = !p.triggerRuleContent.delayed
            .isDelayed
          ">
          <el-icon size="14">
            <CirclePlusFilled />
          </el-icon>
          添加事件组B
        </el-text>
        <span v-else>触发事件组B</span>
      </template>
      <template #toggle>
        <el-text style="cursor: pointer" type="primary" v-if="!readonly && p.triggerRuleContent.delayed.isDelayed"
          @click="p.triggerRuleContent.delayed.isDelayed = false">
          <el-icon size="14">
            <Delete />
          </el-icon>
          删除事件组B
        </el-text>
        <span v-else />
      </template>

      <el-form-item v-if="p.triggerRuleContent.delayed.isDelayed">
        <div class="EventGroup-SubEvent">
          <el-text>且在</el-text>&nbsp;
          <el-input-number :disabled="readonly" :min="1"
            :max="p.triggerRuleContent.delayed.delayedUnit == 'day' ? 30 : (p.triggerRuleContent.delayed.delayedUnit == 'hour' ? 720 : 43200)"
            placeholder="输入值" controls-position="right" v-model="p.triggerRuleContent.delayed.delayedTime"
            style="width: 100px" />
          <el-select :disabled="readonly" placeholder="选择单位" v-model="p.triggerRuleContent.delayed.delayedUnit"
            style="width: 100px" @change="handleUnitChange">
            <el-option value="minute" label="分钟">分钟</el-option>
            <el-option value="hour" label="小时">小时</el-option>
            <el-option value="day" label="天">天</el-option>
          </el-select>
          <el-text>后立即判断</el-text>
          <el-select :disabled="readonly" placeholder="是否做过" v-model="p.triggerRuleContent.delayed.delayedAction"
            style="width: 150px">
            <el-option value="=" label="做过">做过</el-option>
            <el-option value="!=" label="未做过">未做过</el-option>
          </el-select>

          <el-text v-if="!readonly" type="primary" style="cursor: pointer" @click="addEventB">
            <el-icon size="14">
              <CirclePlusFilled />
            </el-icon>
            添加事件
          </el-text>
        </div>

      </el-form-item>
      <TouchBlockGenre v-if="dict" :outside="outside" :condition="p.triggerRuleContent.eventB.customEvent" :dict="dict"
        :readonly="readonly" />

    </BehaviorGroupPlus>
  </div>
</template>

<style lang="scss">
.EventGroup {
  &-SubEvent {
    display: flex;

    gap: 0.5rem;
    align-items: center;
    justify-content: space-between;
  }
}

// .EventGroup .BehaviorGroupPlus-Main {
//   padding: 0;
// }</style>
