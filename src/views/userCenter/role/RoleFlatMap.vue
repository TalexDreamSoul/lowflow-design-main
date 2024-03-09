<script setup lang="ts" name="RoleFlatMap">
import MapList from './MapList.vue'
import { ref } from 'vue'

const props = defineProps<{
  data: any,
}>()

const subData = ref()

console.log('map', props.data)
</script>

<template>
  <div class="RoleFlatMap">

    <MapList :data="props.data" @change="subData = $event" />

  </div>
</template>

<style lang="scss">
.RoleFlatMap {
  &-List {
    li {
      padding: .25rem 1rem;

      cursor: pointer;

      transition: .25s;

      &:hover {
        background-color: #277AE710;
      }
    }

    position: relative;
    margin: 0;
    padding: 0;

    display: flex;
    flex-direction: column;

    flex: 1;
    list-style: none;

    width: 100%;

    &:last-child {
      border-right: none;
    }

    border-right: 1px solid #222222;
  }

  position: relative;
  display: flex;

  align-items: stretch;

  border: 1px solid #222222;
}
</style>