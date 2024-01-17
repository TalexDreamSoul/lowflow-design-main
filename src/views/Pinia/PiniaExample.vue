<script lang="ts" setup>
import useStore from '../Pinia/store'

const store = useStore()

</script>

<template>
 <div>
  <button @click="store.toggleClass">toggle class</button>
  <button @click="store.log">log store state</button>
  <button @click="store.reset">reset elements</button>
 </div>
</template>

<style scoped>
</style>
