<script setup lang="ts">
import { ref, watch } from 'vue'
import { createReusableTemplate } from '@vueuse/core'

const [DefineForTree, ForTree] = createReusableTemplate<any>()
const [DefineSingleNode, ForSingleNode] = createReusableTemplate<any>()

defineProps<{
  data: any
}>()

const emits = defineEmits<{
  (event: 'change', value: any): void
}>()

const model = ref()

watch(() => model.value, () => {
  emits('change', model.value)
})

</script>

<template>
  <DefineSingleNode v-slot="{ node }">
    <div @click="model = node.value">
      <span class="option">{{ node.label }}</span>
    </div>
  </DefineSingleNode>

  <DefineForTree v-slot="{ node }">
    <template v-if="node.children">
      <p class="title">
        {{ node.label }}
      </p>
      <div v-for="child in node.children" :key="child.id" :node="child">

        <ForTree :node="child" />
      </div>
    </template>

    <ForSingleNode :node="node" v-else />

  </DefineForTree>

  <div class="TouchSelectable">
    <el-scrollbar>
      <!-- <div v-for="node in data"> -->
        <!-- <p class="title">
          {{ node.label }}
        </p> -->
        <ForTree :node="data[0]" />
      <!-- </div> -->
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
.title {
  margin: 8px 0;
  font-weight: 600;

  &~div .title {
    opacity: .85;
    text-indent: 8px;
  }

  &~div span.option {
    display: block;

    text-indent: 12px;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
  }
}

.option {
  &::before {
    z-index: -1;
    content: "";
    position: absolute;

    left: 0;
    top: 0;

    width: 100%;
    height: 100%;

    transition: .125s;
    transform: translateX(-100%);
    border-radius: 0 4px 4px 0;
    background-color: #ffffff;
  }

  &::after {
    z-index: -1;
    content: "";
    position: absolute;

    left: 0;
    top: 0;

    width: 2px;
    height: 100%;

    transition: .125s;
    transform: translateX(-100%) scale(0);
    border-radius: 0 4px 4px 0;
    box-shadow: 0 0 4px 0 #409DFE;
    background-color: #409DFE;
  }

  &:hover {
    &::before {
      transform: translateX(0);
    }

    &::after {
      transform: translateX(0) scale(1);
    }

    color: #409DFE
  }

  position: relative;
  padding: 4px 5px;

  display: block;

  cursor: pointer;
  text-indent: 8px;
}

.TouchSelectable {


  position: relative;

  width: 100%;
  height: 100%;
}
</style>