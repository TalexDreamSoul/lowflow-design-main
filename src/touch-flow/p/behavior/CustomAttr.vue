<script setup lang="ts">
import { onMounted, ref } from "vue";
import TargetContentComplex from "./TargetContentComplex.vue";
import { dictFilterTree as getDictFilterTree } from "~/api/index";
const props = defineProps<{
  custom: any;
}>();

if (!props.custom.conditions.length) {
  props.custom.conditions.push({});
}

const dict = ref<any>();

onMounted(async () => {
  const res = await getDictFilterTree();

  if (res.data) {
    dict.value = res.data;
  }
});

function addTarget() {
  let arr = (props.custom.list = props.custom.list || []);

  arr.push({});
}
</script>

<template>
  <div class="Basic-Block">
    <div class="Basic-Block-Content">
      <div v-if="dict" class="Target-Block">
        <TargetContentComplex
          v-for="(item, index) in custom.conditions"
          :key="item.id"
          :index="index"
          :target="item"
          :dict="dict"
        />
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
