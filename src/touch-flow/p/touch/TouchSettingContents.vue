<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { ref, h, reactive } from 'vue'
import { createFloatingPanel } from './floating-panel'
import { getDictAnalyzedTree } from '../../flow-utils'
import TouchSelectWrapper from './TouchSelectable.vue'
import Operator from '~/components/BehaviorFoldingGroup/Operator.vue'
import AttrRender from '~/touch-flow/page/AttrRender.vue'
import { randomStr } from '~/utils/common'

const props = defineProps<{
  modelValue?: any,
  buttonTitle?: string,
  content: string,
  variables: string
}>()
const emits = defineEmits(['update:modelValue'])

const _content = ref<string>()
const contentRef = ref<HTMLElement>()
const model = useVModel(props, 'modelValue', emits)

const dictTree = ref()
const attrs = ref()

  ; (async () => {
    const [tree, _attrs] = await getDictAnalyzedTree()

    attrs.value = _attrs
    dictTree.value = tree
  })()

const settingSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L21.5 6.5V17.5L12 23L2.5 17.5V6.5L12 1ZM12 3.311L4.5 7.65311V16.3469L12 20.689L19.5 16.3469V7.65311L12 3.311ZM12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16ZM12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"></path></svg>`

function addLabel() {
  const first = dictTree.value[0].children[0]

  const id = randomStr(6)

  insertNode(`<button unselectable="on" data-id="${id}" contenteditable="false" class="TouchLabel"><span>变量：</span><span class="value">${first.label}</span>&nbsp;${settingSvg}</button>`)
}

const variableOptions = reactive({
  modal: false,
  operator: '=',
  attribute: '',
  value: '',
  conditions: [],
  placeholder: ''
})

function insertNode(htmlX: string) {
  const dom = contentRef.value
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

  const target = e.target as Element
  if (target.tagName === 'svg') {

    variableOptions.modal = true

    return
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

              valueDom.setAttribute('value', val)
              valueDom.innerText = condition.label

              if (_floating) _floating()
            }
          })
        }
      })
    }
  })
}

function handleBlur() {
  const contentDom = contentRef.value

  let content = ''

  contentDom?.childNodes.forEach(node => {
    console.dir(node)
  })

  model.value[props.content] = content
}
</script>

<template>
  <div @blur="handleBlur" tabindex="1" class="TouchSettingsContentWrapper">
    <div @click="handleClick" ref="contentRef" class="TouchSettingsContent" contenteditable="true">
      {{ _content }}
    </div>

    <el-button @click="addLabel">
      <el-icon color="#326DD7">
        <Plus />
      </el-icon>
      &nbsp;&nbsp;&nbsp;{{ buttonTitle ?? "插入端口" }}
    </el-button>
  </div>

  <el-dialog append-to-body align-center v-model="variableOptions.modal" title="设置赋值">
    <template #footer>
      <el-button round @click="variableOptions.modal = false">取消</el-button>
      <el-button round class="primaryStyle" type="primary" @click="variableOptions.modal = false">确定</el-button>
    </template>

    <div class="TouchFloatingContent">
      <Operator v-model="variableOptions.operator" />
      <Operator v-model="variableOptions.attribute" />
      <div class="ContentSingleLine">
        <span>赋值为</span>
        <el-input v-model="variableOptions.value" />
      </div>
    </div>

    <el-text type="primary" style="cursor: pointer">
      <el-icon size="14">
        <CirclePlusFilled />
      </el-icon>
      筛选条件
    </el-text>

    <AttrRender v-for="item in (variableOptions.conditions as any)" :key="item.field" :field="item.field"
      v-model="item.fieldValue" :attrs="attrs" />&nbsp;

    <div style="margin-top: 1rem" class="ContentSingleLine">
      该属性空值或无法匹配时显示 <el-input style="width: 30%" placeholder="属性值" v-model="variableOptions.placeholder" />
    </div>
  </el-dialog>
</template>

<style lang="scss">
.ContentSingleLine {
  span {
    flex-shrink: 0;
  }

  display: flex;

  align-items: center;

  flex: 1;
  gap: .5rem;
}

.TouchFloatingContent {

  margin: .5rem 0 1rem;
  display: grid;

  gap: 1rem;
  grid-template-columns: repeat(3, 1fr);
}

.TouchFloating {
  z-index: 100;
  padding: .5rem;

  width: 160px;
  height: 300px;

  overflow: hidden;
  border-radius: 4px;
  background-color: #ffffff80;
  backdrop-filter: blur(18px);
  box-shadow: var(--el-box-shadow-light);
}

.TouchSettingsContentWrapper {
  .TouchLabel {
    svg {
      &:hover {
        opacity: .75;
      }

      position: relative;
      margin-top: .1rem;

      width: 16px;
    }

    &:hover {
      opacity: .9;
    }

    position: relative;
    display: inline-flex;

    margin: 5px 2px;
    padding: 2px 8px;
    color: #409eff;
    border-radius: 15px;

    border: none;
    cursor: pointer;
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