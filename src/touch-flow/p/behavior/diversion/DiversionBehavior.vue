<script setup lang="ts" name="CustomBehavior">
import { onMounted, ref, provide } from "vue";
import EventContent from "./DiversionContent.vue";
import { dictFilterTree as getDictFilterTree } from "~/api/index";
const props = defineProps<{
  custom: any;
}>();

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
        <div v-for="condition in custom.conditions" :key="condition.id">
          <EventContent v-if="condition?.conditions?.length" :condition="condition" :dict="dict">
            <slot :condition="condition" :dict="dict" />
          </EventContent>
        </div>
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
