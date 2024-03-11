<script setup lang="ts" name="TouchMenuItem">
import { useRouter, useRoute } from 'vue-router';
import { computed, ref } from 'vue';

const props = defineProps<{
  path?: string,
}>()

const router = useRouter()

function direct() {
  if (!props.path) return

  router.push(props.path)
}

const route = useRoute()

const active = computed(() => props.path && route.path.startsWith(props.path))
</script>

<template>
  <li @click="direct" :class="{ active }">
    <slot />
  </li>
</template>

<style lang="scss" scoped>
li {
  &::before {
    content: "";
    position: absolute;

    left: 0;
    top: 0;

    width: 2px;
    height: 100%;

    border-radius: 0 4px 4px 0;
    background-color: #277AE7;

    opacity: 0;
    transform: translateX(-100%) scale(.8);

    transition: .25s;
  }

  &:hover,
  &.active {
    &::before {
      opacity: 1;

      transform: translateX(0) scale(1);
    }

    background-color: #EAECF2;
  }

  position: relative;

  user-select: none;
}
</style>