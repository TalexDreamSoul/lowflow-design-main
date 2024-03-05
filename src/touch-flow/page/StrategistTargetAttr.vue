<script setup lang="ts" name="StrategistTargetAttr">
import { dictFilterTree as getDictFilterTree } from "~/api/index";
import DiversionBehavior from "../p/behavior/diversion/DiversionBehavior.vue";
import TargetContent from "../header/TargetContent.vue";
import { ref } from "vue";

const props = defineProps<{
  sizeForm: any;
  readonly?: boolean;
}>();

const dict = ref<any>();

!(async () => {
  const res = await getDictFilterTree();

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
</script>

<template>
  <div class="MainBlock">
    <div class="MainBlock-Title">
      <div class="title">策略器目标设置 &nbsp;</div>
      <el-switch v-model="sizeForm.targetRuleContent.targetDelayed.isDelayed" />
    </div>

    <div
      class="MainBlock-Content"
      v-if="sizeForm.targetRuleContent.targetDelayed.isDelayed"
    >
      <div class="MainBlock-ContentItem bg-transparent">
        <el-text>该策略器的延时以及动作执行完毕后，在</el-text>&nbsp;
        <el-input
          :disabled="readonly"
          v-model="sizeForm.targetRuleContent.targetDelayed.delayedTime"
          type="number"
          style="width: 100px"
        />&nbsp;
        <el-select
          :disabled="readonly"
          v-model="sizeForm.targetRuleContent.targetDelayed.delayedUnit"
          style="width: 150px"
        >
          <el-option value="min" label="月份">分钟</el-option>
          <el-option value="hour" label="周">小时</el-option>
          <el-option value="day" label="天">天</el-option> </el-select
        >&nbsp;
        <el-text>后立即判断客户是否完成以下转化事件，则认为完成该策略器模板。</el-text>

        <TargetContent
          :readonly="readonly"
          :target="sizeForm.targetRuleContent"
          :dict="dict"
        />
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
