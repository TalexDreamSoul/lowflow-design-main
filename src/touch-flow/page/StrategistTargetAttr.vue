<script setup lang="ts" name="StrategistTargetAttr">
import DiversionBehavior from "../p/behavior/diversion/DiversionBehavior.vue";

const props = defineProps<{
  sizeForm: any;
  readonly?: boolean;
}>();

if (!props.sizeForm?.targetRuleContent?.targetDelayed) {
  props.sizeForm.targetRuleContent = {
    targetDelayed: {
      delayedAction: "",
      delayedTime: 0,
      delayedType: "",
      delayedUnit: "day",
      isDelayed: false,
    },
    targetRuleContent: {
      eventSequence: {
        conditions: [
          {
            conditions: [
              {
                action: "",
                conditions: {
                  conditions: [
                    {
                      attr: {
                        field: "",
                        fieldMultiValue: [],
                        fieldName: "",
                        fieldOp: "",
                        fieldRangeValue: "",
                        fieldType: "",
                        fieldValue: "",
                        timeCondition: {
                          endDay: 0,
                          endTime: "",
                          isFuture: false,
                          isWithin: false,
                          startDay: 0,
                          startTime: "",
                          timeType: "",
                        },
                      },
                      label: {
                        labelId: 0,
                        labelName: "",
                        labelValue: [],
                      },
                      type: "",
                    },
                  ],
                  logicalChar: "或",
                },
                eventCode: "",
                eventName: "",
              },
            ],
            endTime: "",
            logicalChar: "或",
            startTime: "",
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
      </div>
      <div class="MainBlock-ContentItem bg-transparent">
        <DiversionBehavior
          :readonly="readonly"
          :custom="sizeForm.targetRuleContent!.targetRuleContent!.eventSequence"
        />
      </div>
    </div>
  </div>
</template>
