<script setup lang="ts" name="CustomBehavior">
import { onMounted, ref, provide } from "vue";
import BehaviorContent from "./BehaviorContent.vue";
import LogicalLine from "./LogicalLine.vue";
import { dictFilterTree as getDictFilterTree } from "~/api/index";
import { CustomEventConditionDTO } from "~/touch-flow/touch-total";

const props = defineProps<{
  custom: CustomEventConditionDTO;
  readonly?: boolean;
}>();

// for (let item of props.custom.conditions) {
//   // @ts-ignore
//   if ( item.conditions.length === 0) item.conditions.push({})
// }

const dict = ref<any>();

onMounted(async () => {
  const res = await getDictFilterTree(
    {
      pageNum:"1",
      pageSize:"999"
    }
  );

  if (res.data) {
    dict.value = res.data;
  }
});

const refreshTree = () => {
  [...props.custom.conditions].forEach(
    (condition, index) =>
      !condition.conditions.length && props.custom.conditions.splice(index, 1)
  );
};

provide("refreshTree", refreshTree);
</script>

<template>
  <div class="Basic-Block">
    <div class="Basic-Block-Content">
      <div v-if="dict && custom.conditions?.length" class="Target-Block">
        <LogicalLine :display="!custom.conditions?.length" v-model="custom.logicalChar">
          <div v-for="(condition, index) in custom.conditions" :key="index">
            <BehaviorContent :readonly="readonly" :condition="condition" :dict="dict" />
          </div>
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
