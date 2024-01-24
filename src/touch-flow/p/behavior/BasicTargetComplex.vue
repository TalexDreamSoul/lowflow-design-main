<script setup lang="ts">
import { onMounted, ref } from "vue";
import TargetContentComplex from "./TargetContentComplex.vue";
import { dictFilterTree as getDictFilterTree } from "~/api/index";
const props = defineProps<{
  target: any;
}>();

const dict = ref<any>()

onMounted(async () => {
  const res = await getDictFilterTree()

  if (res.data) {
    dict.value = res.data;
  }

  let arr = props.target.list;
  if (arr?.length) return;

  arr = props.target.list = [{}];
});

function addTarget() {
  let arr = (props.target.list = props.target.list || []);

  arr.push({})
}
</script>

<template>
  <div class="Basic-Block">
    <div
      class="Basic-Block-Content"
    >
      <div class="Target-Block">
        <TargetContentComplex
          v-for="(item, index) in target.list"
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
  background-color: #F7F8FA;

  user-select: none;
}
</style>
