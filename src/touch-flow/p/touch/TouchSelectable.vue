<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElTreeSelect } from 'element-plus'
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
    <div>
      123 {{ node }}
    </div>
  </DefineSingleNode>

  <DefineForTree v-slot="{ node }">
    <div v-if="node.children" v-for="child in node.children" :key="child.id" :node="child">
      CHILD: {{ child }}
    </div>

    <ForSingleNode :node="node" v-else />

  </DefineForTree>

  <div class="TouchSelectable">
    <el-scrollbar>
      <ForTree :node="data" />
    </el-scrollbar>
  </div>
</template>

<style lang="scss">
.TouchSelectable {
  width: 400px;
  height: 100px;

  border-radius: 8px;
  background-color: #fff;
}
</style>