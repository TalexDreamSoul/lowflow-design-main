<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { ref } from 'vue'
import { createFloatingPanel } from './floating-panel'

const props = defineProps<{
  modelValue?: any,
}>()
const emits = defineEmits(['update:modelValue'])

const content = ref<HTMLElement>()
const model = useVModel(props, 'modelValue', emits)

function addLabel() {

  insertNode('<button unselectable="on" contenteditable="false" class="TouchLabel">标签</button>')
}

function insertNode(htmlX: string) {
  const dom = content.value
  if (!dom) return

  dom.focus();

  var sel, range;

  sel = window.getSelection()!;

  if (sel.getRangeAt && sel.rangeCount) {
    range = sel.getRangeAt(0);
    range.deleteContents();

    var el = document.createElement("div");
    el.innerHTML = htmlX;
    var frag = document.createDocumentFragment(), node, lastNode;
    while ((node = el.firstChild)) {
      lastNode = frag.appendChild(node);
    }
    range.insertNode(frag);

    // Preserve the selection
    if (lastNode) {
      range = range.cloneRange();
      range.setStartAfter(lastNode);
      range.collapse(true);
      sel.collapseToEnd()
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

}

let _floating: any

function handleClick(e: Event) {
  e.preventDefault();

  if (_floating) {
    _floating()

    _floating = null
  }

  // e path iterator
  e.composedPath().forEach((e: any) => {
    if (e.className === 'TouchLabel') {
      console.log(e)

      _floating = createFloatingPanel(e, {
        render: () => '<span>Hello</span>'
      })
    }
  })
}
</script>

<template>
  <div class="TouchSettingsContentWrapper">
    <div @click="handleClick" ref="content" class="TouchSettingsContent" contenteditable="true">
      {{ model }}
    </div>

    <el-button @click="addLabel">
      <el-icon color="#326DD7">
        <Plus />
      </el-icon>
      &nbsp;&nbsp;&nbsp;插入端口
    </el-button>
  </div>
</template>

<style lang="scss">
.TouchFloating {
  z-index: 100;
  background-color: red;
}

.TouchSettingsContentWrapper {
  .TouchLabel {
    margin: 0 2px;
    padding: 2px 8px;
    color: #409eff;
    border-radius: 15px;

    border: none;
    background: #EDEFF4;
  }

  .TouchSettingsContent {
    &:focus {
      outline: none;
    }
  }

  .el-button {
    padding: 4px 12px;
    border: none;

    height: 24px;
    font-size: 12px;
    border-radius: 15px;
    background-color: #EDEFF4;
  }

  position: relative;

  --el-input-inner-height: calc(var(--el-input-height, 32px) - 2px);
  width: 100%;
  flex-grow: 1;
  -webkit-appearance: none;
  color: var(--el-input-text-color, var(--el-text-color-regular));
  font-size: inherit;
  padding: 0;
  outline: none;
  box-sizing: border-box;

  padding: 1px 11px;
  background-color: var(--el-input-bg-color, var(--el-fill-color-blank));
  background-image: none;
  border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
  cursor: text;
  transition: var(--el-transition-box-shadow);
  transform: translate3d(0, 0, 0);
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
}
</style>