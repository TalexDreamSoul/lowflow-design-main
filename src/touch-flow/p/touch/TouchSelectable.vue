<script setup lang="ts">
import { ref } from 'vue'
import { useFloating } from '@floating-ui/vue'

const reference = ref()
const floating = ref()

const { floatingStyles } = useFloating(reference, floating)

const props = defineProps<{
  modelValue?: boolean,
}>()

</script>

<template>
  <div class="TouchSelectable">
    <div class="TouchSelectable-Input">
    </div>

    <div class="TouchSelectable-Panels">
    </div>
  </div>
</template>