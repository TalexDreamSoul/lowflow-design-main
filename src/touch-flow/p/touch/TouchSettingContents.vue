<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { ref, h } from 'vue'
import { createFloatingPanel } from './floating-panel'
import { getDictAnalyzedTree } from '../../flow-utils'
import TouchSelectWrapper from './TouchSelectable.vue'

const props = defineProps<{
  modelValue?: any,
  buttonTitle?: string,
  content: string,
  variables: string
}>()
const emits = defineEmits(['update:modelValue'])

const content = ref<HTMLElement>()
const model = useVModel(props, 'modelValue', emits)

const dictTree = ref()

  ; (async () => dictTree.value = await getDictAnalyzedTree())()

const settingSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L21.5 6.5V17.5L12 23L2.5 17.5V6.5L12 1ZM12 3.311L4.5 7.65311V16.3469L12 20.689L19.5 16.3469V7.65311L12 3.311ZM12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16ZM12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"></path></svg>`

function addLabel() {
  const first = dictTree.value[0].children[0]

  insertNode(`<button unselectable="on" contenteditable="false" class="TouchLabel"><span>变量：</span><span class="value">${first.label}</span>&nbsp;${settingSvg}</button>`)
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

const getCurrSelected = (condition: any) => [...dictTree.value].map((_: any) => ([..._.children].map((__: any) => __.children?.length ? __.children : [__]))).flat(2).find((_: any) => _.field === condition.field || _.label === condition.field)

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

      _floating = createFloatingPanel(e, {
        render: () => {
          return h(TouchSelectWrapper, {
            data: dictTree.value,
            onChange: (val: any) => {
              const condition = getCurrSelected({
                field: val
              })

              const valueDom = e.querySelector('.value')

              valueDom.innerText = condition.label
            }
          })
        }
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
      &nbsp;&nbsp;&nbsp;{{ buttonTitle ?? "插入端口" }}
    </el-button>
  </div>
</template>

<style lang="scss">
.TouchFloating {
  z-index: 100;

  border-radius: 4px;
  overflow: hidden;
}

.TouchSettingsContentWrapper {
  .TouchLabel {
    svg {
      position: relative;
      margin-top: .1rem;

      width: 16px;
    }

    position: relative;
    display: inline-flex;

    margin: 5px 2px;
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