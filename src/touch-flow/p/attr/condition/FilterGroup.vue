<script setup lang="ts" name="FilterGroup">
import LogicalLine from "~/touch-flow/p/behavior/LogicalLine.vue";
import BehaviorGroup from "~/touch-flow/p/behavior/BehaviorGroup.vue";
import CustomAttr from "~/touch-flow/p/behavior/CustomAttr.vue";
import CustomBehavior from "~/touch-flow/p/behavior/CustomBehavior.vue";
import CustomBehaviorSequence from "~/touch-flow/p/behavior/sequence/CustomBehaviorSequence.vue";
import {
  AttrConditionDTO,
  CustomSearchDTO,
  EventConditionDTO,
  EventSearchCondition,
  SearchCondition,
  SequenceConditionDTO,
} from "~/touch-flow/touch-total";

export interface IPropConfig {
  ignore: {
    attrs: boolean
    sequence: boolean
  },
  subIgnore: {
    event: {
      time: boolean,
      action: boolean
    }
  }
}

const props = defineProps<{
  customRuleContent: CustomSearchDTO;
  readonly?: boolean;
  configuration?: IPropConfig
}>();

function attrsAdd() {
  const attr: AttrConditionDTO[] = props.customRuleContent.customAttr!.conditions!;

  attr.push({
    conditions: new Array<SearchCondition>(),
    logicalChar: "或",
  });
}

function behaviorAdd() {
  const attr: EventConditionDTO[] = props.customRuleContent.customEvent!.conditions!;

  const obj: EventSearchCondition = {
    action: "=",
    conditions: {
      conditions: new Array<SearchCondition>(),
      logicalChar: "或",
    },
    eventCode: "",
    eventName: "",
  };

  attr.push({
    conditions: [obj],
    logicalChar: "或",
  });
}

function sequenceAdd() {
  const attr: SequenceConditionDTO[] = props.customRuleContent.eventSequence!.conditions!;

  const obj = {
    action: "=",
    eventCode: "",
    eventName: "",
    conditions: {
      conditions: new Array<SearchCondition>(),
      logicalChar: "或",
    },
    logicalChar: "或",
  };

  attr.push({
    conditions: [obj],
    logicalChar: "或",
  });
}
</script>

<template>
  <LogicalLine :readonly="readonly" :display="!!configuration?.ignore" v-model="customRuleContent!.logicalChar">
    <BehaviorGroup v-if="!configuration?.ignore?.attrs" :readonly="readonly" @add="attrsAdd" title="客户属性满足">
      <CustomAttr v-if="customRuleContent.customAttr?.conditions?.length" :readonly="readonly"
        :custom="customRuleContent.customAttr" />
    </BehaviorGroup>
    <BehaviorGroup @add="behaviorAdd" title="客户行为满足" :readonly="readonly">
      <CustomBehavior :configuration="configuration?.subIgnore?.event"
        v-if="customRuleContent.customEvent?.conditions?.length" :readonly="readonly"
        :custom="customRuleContent.customEvent" />
    </BehaviorGroup>
    <BehaviorGroup v-if="!configuration?.ignore?.sequence" @add="sequenceAdd" :readonly="readonly" title="行为序列满足">
      <CustomBehaviorSequence v-if="customRuleContent.eventSequence?.conditions?.length" :readonly="readonly"
        :custom="customRuleContent.eventSequence" />
    </BehaviorGroup>
  </LogicalLine>
</template>
