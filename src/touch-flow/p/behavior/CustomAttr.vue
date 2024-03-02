<script setup lang="ts">
import { onMounted, ref, provide } from "vue";
import CustomContent from "./CustomContent.vue";
import LogicalLine from "./LogicalLine.vue";
import { dictFilterTree as getDictFilterTree } from "~/api/index";
import { CustomAttrConditionDTO } from "../../touch-total";

const props = defineProps<{
  custom: CustomAttrConditionDTO;
}>();

const dict = ref<any>();

onMounted(async () => {
  const res = await getDictFilterTree();

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
      <div v-if="dict && custom?.conditions?.length" class="Target-Block">
        <LogicalLine :display="!custom?.conditions?.length" v-model="custom.logicalChar">
          <div v-for="(condition, index) in custom.conditions" :key="index">
            <CustomContent :condition="condition" :dict="dict" />
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
