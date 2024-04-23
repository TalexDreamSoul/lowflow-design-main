<script setup lang="ts" name="StrategistTargetAttr">
import { dictFilterTree as getDictFilterTree } from "~/api/index";
import TargetContent from "../header/TargetContent.vue";
import { ref } from "vue";

const props = defineProps<{
  sizeForm: any;
  readonly?: boolean;
}>();

const dict = ref<any>();

!(async () => {
  const res: any = await getDictFilterTree();

  if (res.data) {
    dict.value = res.data;
  } else {
    console.log(res);

    window.history.back();

    throw new Error("获取字典失败,无法完成流程!");
  }
})();

if (!props.sizeForm?.targetRuleContent?.targetDelayed) {
  props.sizeForm.targetRuleContent = {
    targetDelayed: {
      delayedType: "",
      delayedAction: "",
      delayedTime: 0,
      delayedUnit: "day",
      isDelayed: false,
    },
    targetRuleContent: {
      customEvent: {
        conditions: [
          {
            conditions: [
              {
                action: "",
                conditions: {
                  conditions: [],
                  logicalChar: "或",
                },
                eventCode: "",
                eventName: "",
              },
            ],
            logicalChar: "或",
          },
        ],
        logicalChar: "或",
      },
      logicalChar: "或",
    },
  };
}
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
  if (props.sizeForm.targetRuleContent.targetDelayed.delayedTime > maxValue) {
    props.sizeForm.targetRuleContent.targetDelayed.delayedTime = maxValue;
  }
};
</script>

<template>
  <div class="MainBlock">
    <div class="MainBlock-Title">
      <div class="title">策略器目标设置 &nbsp;</div>
      <!-- <el-switch v-model="sizeForm.targetRuleContent.targetDelayed.isDelayed" /> -->
      <el-switch :disabled="readonly" v-model="sizeForm.containTarget" />
    </div>

    <div class="MainBlock-Content" v-if="dict && sizeForm.containTarget">
      <div class="MainBlock-ContentItem bg-transparent">
        <el-text>该策略器的延时以及动作执行完毕后，在</el-text>&nbsp;
        <el-input-number :disabled="readonly" v-model="sizeForm.targetRuleContent.targetDelayed.delayedTime" :min="0"
        :max="sizeForm.targetRuleContent.targetDelayed.delayedUnit=='day'?30:(sizeForm.targetRuleContent.targetDelayed.delayedUnit=='hour'?720:43200)" 
          controls-position="right" style="width: 100px" />&nbsp;
        <el-select :disabled="readonly" v-model="sizeForm.targetRuleContent.targetDelayed.delayedUnit"
        @change="handleUnitChange"   style="width: 150px">
          <el-option value="minute" label="分钟">分钟</el-option>
          <el-option value="hour" label="小时">小时</el-option>
          <el-option value="day" label="天">天</el-option> </el-select>&nbsp;
        <el-text>后立即判断客户是否完成以下转化事件，则认为完成该策略器目标。</el-text>

        <TargetContent :readonly="readonly" :target="sizeForm.targetRuleContent" :dict="dict" />
      </div>
      <!-- <div class="MainBlock-ContentItem bg-transparent"> -->

      <!-- <DiversionBehavior
          :readonly="readonly"
          :custom="sizeForm.targetRuleContent!.targetRuleContent!.eventSequence"
        /> -->
      <!-- </div> -->
    </div>
  </div>
</template>
