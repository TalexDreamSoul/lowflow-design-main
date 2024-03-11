<script setup lang="ts" name="CustomBehavior">
import { onMounted, ref, provide } from "vue";
import BehaviorContent from "./BehaviorContent.vue";
import LogicalLine from "./LogicalLine.vue";
import { dictFilterTree as getDictFilterTree } from "~/api/index";
import {
  CustomEventConditionDTO,
  EventSearchCondition,
  SearchCondition,
} from "~/touch-flow/touch-total";

const props = defineProps<{
  custom: CustomEventConditionDTO;
  readonly?: boolean;
  configuration: {
    time: boolean,
    action: boolean
  } | undefined;
}>();

// for (let item of props.custom.conditions) {
//   // @ts-ignore
//   if ( item.conditions.length === 0) item.conditions.push({})
// }

const dict = ref<any>();

onMounted(async () => {
  const res = await getDictFilterTree();

  if (res.data) {
    dict.value = res.data;
  }
});

// 删除某一项为空
// { conditions: [] } => 仍然会显示 => 删除掉 不要去显示仅剩的一个 或
const refreshTree = () => {
  [...props.custom.conditions].forEach(
    (condition, index) =>
      !condition.conditions.length && props.custom.conditions.splice(index, 1)
  );
};

function handleAdd(condition: any) {
  console.log("q", condition);

  const obj: EventSearchCondition = {
    action: "",
    conditions: {
      conditions: new Array<SearchCondition>(),
      logicalChar: "或",
    },
    eventCode: "",
    eventName: "",
  };

  condition.conditions.push(JSON.parse(JSON.stringify(obj)));
}

function handleDel(ind: number, condition: any) {
  condition.conditions.splice(ind, 1);

  refreshTree();
}

provide("refreshTree", refreshTree);
</script>

<template>
  <div class="Basic-Block">
    <div class="Basic-Block-Content">
      <div v-if="dict && custom.conditions?.length" class="Target-Block">
        <LogicalLine :display="!custom.conditions?.length" v-model="custom.logicalChar">
          <LogicalLine v-model="condition.logicalChar" v-for="(condition, index) in custom.conditions"
            :display="condition?.conditions?.length < 2" :key="index">
            <BehaviorContent v-for="(item, ind) in condition.conditions" :key="ind" @addSub="handleAdd(condition)"
              @del="handleDel(ind, condition)" :readonly="readonly" :condition="item" :configuration="configuration"
              :index="ind" :length="condition.conditions.length" :dict="dict" />
          </LogicalLine>
        </LogicalLine>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(div.Basic-Block-Content) {
  background-color: #f7f8fa;

  user-select: none;
}
</style>
