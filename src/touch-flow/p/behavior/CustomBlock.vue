<script setup lang="ts" name="CustomBlock">
import LogicalLine from "./LogicalLine.vue";

const props = defineProps<{
  conditions: any;
}>();
</script>

<template>
  <div class="CustomBlock" v-for="(condition, index) in conditions">
    <LogicalLine v-model="condition.logicalChar" :key="condition.id" />
    <slot :condition="condition" :index="index" />
  </div>
</template>
