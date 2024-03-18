<script setup lang="ts" name="RoleFlatMap">
import MapList from './MapList.vue'
import { ref, watch } from 'vue'
import { useThrottleFn, useDebounceFn } from '@vueuse/core'

const props = defineProps<{
  data: any,
  // checked: Array<number>
}>()

const select = ref()
const checked = ref<number[]>([])

// 通过 select 去计算 checked
// 第一：上一层必须是当内层全选才能选中 全不选才能不选中  否则半选
function _calcChecked(select: any) {
  let _select = select

  while (_select?.now) {
    const data = _select.now

    const res = deep(data)

    console.log('计算', data, res, select)

    _select = _select.sub
  }

  function deep(data: any) {
    if (!data.subMenus) {

      // if (data.$check) {
      //   // 添加到 checked
      //   checked.value.push(data.id)
      // } else {
      //   // 删除
      //   checked.value = checked.value.filter(item => item !== data.id)
      // }

      return data.$im = (data.$check ? 2 : 0);
    }

    let im = 0;
    for (const child of data.subMenus) {
      child.$im = im = Math.max(im, deep(child));
    }

    console.log("data总", im, data)

    // if (data.id === 1) {
    //   im = 0;
    // }

    return im;
  }

}

const calcChecked = useDebounceFn(_calcChecked, 200)

watch(() => select.value, val => calcChecked(val), { deep: true })

console.log('map', props.data, select)
</script>

<template>
  <div class="RoleFlatMap">
    <MapList v-model="select" :checked="checked" :data="props.data" />
  </div>
</template>

<style lang="scss">
.RoleFlatMap {
  &-List {
    li {
      display: flex;
      padding: .125rem 1rem;

      gap: .5rem;
      align-items: center;

      cursor: pointer;

      transition: .25s;

      &:hover,
      &.active {
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

    border-right: 1px solid var(--el-border-color);
  }

  position: relative;
  display: flex;

  align-items: stretch;

  border: 1px solid var(--el-border-color);
}
</style>