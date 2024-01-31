<script setup lang="ts" name="MicroEnterpriseDrag">
import { ref } from 'vue'

const props = defineProps<{
  modelValue?: boolean,
}>()

const elements = ref<Array<any>>([
  {
    name: 'Test1'
  },
  {
    name: 'Test2'
  },
  {
    name: 'Test3'
  },
  {
    name: 'Test4'
  },
  {
    name: 'Test5'
  },
  {
    name: 'Test6'
  },
  {
    name: 'Test7'
  },
  {
    name: 'Test8'
  },
  {
    name: 'Test9'
  }
])

const options = ref<{
  dragging?: HTMLElement,
  lastIndex: number
}>({
  dragging: undefined,
  lastIndex: -1
})

function getKeyIndex(key: string) {
  return elements.value.findIndex((item) => item.name === key)
}

function handleDragStart(e: DragEvent) {
  e.dataTransfer!.effectAllowed = 'move'
  options.value.dragging = e.target as HTMLElement
  options.value.lastIndex = +getKeyIndex(options.value.dragging.dataset.ind!)

  console.log(options.value)
}

function couldPlace(el: HTMLElement) {
  let _el: HTMLElement | null = el

  while (_el) {
    if (_el.className?.indexOf?.('drag-item') !== -1) return _el

    _el = _el.parentElement
  }

  return null

}

function handleDragOver(e: DragEvent) {
  const target = couldPlace(e.target! as HTMLElement)

  if (!target) return

  e.preventDefault()

  const dragEl = options.value.dragging

  if (!dragEl) return

  // 交换位置
  const dragIndex = +getKeyIndex(dragEl.dataset.ind!)
  const targetIndex = +getKeyIndex(target.dataset.ind!)

  if (dragIndex === targetIndex || targetIndex === options.value.lastIndex) return

  options.value.lastIndex = targetIndex

  elements.value.splice(targetIndex, 0, elements.value.splice(dragIndex, 1)[0])

}

</script>

<template>
  <div @dragover="handleDragOver" @dragstart="handleDragStart" class="MicroEnterpriseDrag">
    <TransitionGroup tag="ul" name="list">
      <li class="drag-item" draggable="true" :data-ind="item.name" :key="index" v-for="(item, index) in elements">
        {{ item }}
        <div class="drag-trigger-area">

        </div>
      </li>
    </TransitionGroup>
  </div>
</template>

<style lang="scss">
.list-move,
/* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}

.MicroEnterpriseDrag {
  .drag-trigger-area {
    position: absolute;

    right: 0;
    top: 0;

    height: 100%;

    width: 10%;
    max-width: 5rem;

    cursor: grab;
    border-radius: 0 8px 8px 0;

    &::after {
      content: '';
      position: absolute;

      width: 20px;
      height: 50%;

      right: 10%;
      top: 50%;

      transform: translate(-50%, -50%);

      background:
        radial-gradient(circle at 50% 50%, #7D7D7D80 2px, transparent 3px);
      // background-repeat: repeat-y;
      background-size: 10px 10px;
    }
  }

  .drag-item {
    position: relative;
    padding: 1rem;

    height: 80px;
    border-radius: 8px;
    box-sizing: border-box;
    background-color: #FAFAFA;
  }

  display: flex;

  gap: 1rem;
  flex-direction: column;

  min-height: 60px;
}
</style>