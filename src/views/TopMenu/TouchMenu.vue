<script setup lang="ts" name="TouchMenu">
import { CaretTop } from '@element-plus/icons-vue';
import { useRoute } from 'vue-router';
import { computed, ref } from 'vue';

const route = useRoute()
const props = defineProps<{
  title: string,
  path?: string
}>()

const active = computed(() => props.path && route.path.startsWith(props.path))
</script>

<template>
  <div class="TouchMenu" :class="{ active }">
    <div class="TouchMenu__title">
      {{ title }}
      <el-icon>
        <CaretTop />
      </el-icon>
    </div>
    <ul>
      <slot />
    </ul>
  </div>
</template>

<style lang="scss">
.TouchMenu {

  .el-icon {
    margin-top: .125rem;

    transition: .25s;
  }

  &:hover {
    ul {
      opacity: 1;
      pointer-events: all;
      transform: scale(1) translateY(0);
    }

    .el-icon {
      transform: rotate(180deg);
    }

    background-color: #EAECF2 //#0000A010;
  }

  &__title {
    z-index: 1000;

    .active & {
      &::before {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    &::before {
      content: "";
      position: absolute;

      width: 100%;
      height: 2px;

      background-color: #277AE7;
      box-shadow: 0 2px 4px 0 #277AE7;

      left: 0;
      top: 0;

      opacity: 0;
      transform: translateY(-10%) scale(.8);
      transition: .25s;
    }

    display: flex;

    flex: 1;

    gap: .5rem;
    align-items: center;
    justify-content: center;
  }

  ul {
    li {
      &:hover {
        background-color: #F4F5F8;
      }

      padding: 1rem;

      height: 100%;

    }

    z-index: 999;
    position: absolute;
    margin: 0;
    padding: 0;

    top: 100%;
    min-width: 180px;

    left: 0;

    list-style: none;

    opacity: 0;
    pointer-events: none;
    transform: scale(1.01) translateY(-10%);
    transition: .25s;

    border-radius: 0 0 8px 8px;
    box-shadow: var(--el-box-shadow);
    background-color: #fff;

    overflow: hidden;
  }

  position: relative;
  display: flex;
  padding: 0 .5rem;

  align-items: center;

  height: 100%;
  cursor: pointer;
}
</style>