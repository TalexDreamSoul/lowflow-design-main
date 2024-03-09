<script setup lang="ts" name="MapList">
import { ref, watchEffect } from 'vue'
const props = defineProps<{
  data: any,
}>()

const subData = ref()

watchEffect(() => {
  $ignored: [props, subData]

  subData.value = null

  console.log('updated', props.data)
})
</script>

<template>
  <ul class="RoleFlatMap-List">
    <li @click="subData = item.subMenus" class="RoleFlatMap-ListItem" v-for="item in data" :key="item.id">
      {{ item.menuName }}
    </li>
  </ul>
  <MapList v-if="subData" :data="subData" />
</template>