<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { ref, h, reactive, watchEffect, nextTick, computed } from 'vue'
import { createFloatingPanel } from './floating-panel'
import { getDictAnalyzedTree } from '../../flow-utils'
import TouchSelectWrapper from './TouchSelectable.vue'
import Operator from '../../page/Operator.vue'
import AttrRender from '~/touch-flow/page/AttrRender.vue'
import { randomStr } from '~/utils/common'
import { CirclePlusFilled, Plus } from '@element-plus/icons-vue'

/**
 * VariableTemplateDTO
 */
export type VariableTemplateDTO = {
  /**
   * 字段
   */
  field?: string;
  /**
   * 字段名
   */
  fieldName?: string;
  /**
   * 标签id
   */
  labelId?: number;
  /**
   * 标签名
   */
  labelName?: string;
  /**
   * 标签值
   */
  labelValue?: { [key: string]: any }[];
  /**
   * 类型 1：基础属性 2：客户标签
   */
  type?: string;
  /**
   * 变量值
   */
  variables?: VariableDTO[];
  [property: string]: any;
}

/**
 * VariableDTO
 */
export type VariableDTO = {
  /**
   * 比较值
   */
  compareValue?: string;
  /**
   * 默认值
   */
  defaultValue?: string;
  /**
   * 关系
   */
  fieldOp?: string;
  /**
   * 设置值
   */
  fieldValue?: string;
  [property: string]: any;
}

const props = defineProps<{
  modelValue?: any,
  buttonTitle?: string,
  content: string,
  variables: string
  disabled?: boolean;
}>()
const emits = defineEmits(['update:modelValue'])

// const _content = ref<string>()
const contentRef = ref<HTMLElement>()
const variableMap = new Map<string, VariableTemplateDTO>()
const model = useVModel(props, 'modelValue', emits)
const dialogVariable = ref<VariableTemplateDTO>()

const dictTree = ref()
const attrs = ref();

(async () => {
  const [tree, _attrs] = await getDictAnalyzedTree()

  attrs.value = _attrs.data
  dictTree.value = tree
})()

const settingSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L21.5 6.5V17.5L12 23L2.5 17.5V6.5L12 1ZM12 3.311L4.5 7.65311V16.3469L12 20.689L19.5 16.3469V7.65311L12 3.311ZM12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16ZM12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"></path></svg>`

function addLabel() {
  // const first = dictTree.value[0].children[0]

  const id = randomStr(6).replaceAll('.', '')

  variableMap.set(id, reactive({
    field: id,
    variables: []
  }))

// ${first.label}

  /* const el =  */insertNode(`<button unselectable="on" data-id="${id}" contenteditable="false" class="TouchLabel"><span>变量：</span><span class="value">请选择</span>&nbsp;${settingSvg}</button>`)

  // console.log('insert', el)
}

const variableModal = ref(false)

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

// 根据获得的value查询dict item
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
    const parent: any = target.parentElement
    const { id } = parent!.dataset

    const condition = parent._condition
    if (condition) {
      const _val = parent._value

      const variable = variableMap.get(id!)!

      Object.assign(variable, {
        index: id,
        field: condition.field,
        fieldName: condition.fieldName,
        labelId: condition.id,
        labelName: condition.labelName,
        labelValue: condition.labelValue?.data ? _val : undefined,
        type: condition.labelValue?.data ? '2' : '1',
      })

      variableModal.value = true
      dialogVariable.value = variable

      return
    }
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

              console.log("condition", condition)

              const valueDom = e.querySelector('.value')

              e._condition = condition
              e._value = val

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

  contentDom?.childNodes.forEach((node: ChildNode) => {
    if (node.nodeName === 'BUTTON') {
      const id = (node as HTMLElement).dataset.id
      content += `$$${id}$$`
    } else content += node.nodeValue
  })

  model.value[props.content] = content
}

function variableDone() {
  variableModal.value = false

  model.value[props.variables] = [...variableMap.values()]
}

// watch(() => _content.value, handleBlur)

let doInit = false
watchEffect(() => {
  if (doInit || !props.modelValue?.id) return
  console.groupCollapsed('TouchSettingContents')

  // doInit = true

  const { modelValue, content, variables } = props
  console.log("tsc props", props, model.value, modelValue[content])

  let __content: string /* = _content.value */ = modelValue[content]
  const _variables = modelValue[variables]

  const _preFuncs: any[] = []
  let startsInd = -1
  for (let variable of _variables) {
    const { field, label } = variable
    const text = field || label
    const id = randomStr(6).replaceAll('.', '')

    variableMap.set(id, {
      field: id,
      variables: [],
      ...variable
    })

    const ind = __content.indexOf(text, startsInd + 1)
    if (ind > -1) {
      startsInd = ind

      const condition = getCurrSelected({
        field: text
      })

      _preFuncs.push(() => {
        const e = document.getElementById(id)!
        const valueDom: any = e.querySelector('.value')

        valueDom.parentElement._condition = condition
        valueDom.parentElement._value = text
        valueDom.setAttribute('value', text)
        valueDom.innerText = condition.label
      })

      const _ = `<button unselectable="on" data-id="${id}" contenteditable="false" class="TouchLabel"><span>变量：</span><span class="value">请选择</span>&nbsp;${settingSvg}</button>`

      __content = __content.slice(0, ind) + _ + __content.slice(ind + text.length)
    }
  }

  nextTick(() => {
    const el = contentRef.value!

    console.log(">", el, __content, _preFuncs)

    if (el.innerHTML === __content) return

    el.innerHTML = __content

    // _content.value = __content

    nextTick(() => _preFuncs.forEach(a => a()))
  })

  console.log("touch", __content, _variables)

  console.groupEnd()
})

const contentLength = computed(() => {
  return model.value[props.content]?.length ?? 0
})
</script>

<template>
  <div @blur="handleBlur" :class="{ disabled }" tabindex="1" class="TouchSettingsContentWrapper">
    <div @click="handleClick" @input="handleBlur" ref="contentRef" class="TouchSettingsContent" contenteditable="true" />

    <el-button @click="addLabel">
      <el-icon color="#326DD7">
        <Plus />
      </el-icon>
      &nbsp;&nbsp;&nbsp;{{ buttonTitle ?? "插入端口" }}
    </el-button>

    <span class="placeholder-label">
      共 {{ contentLength }} 字
    </span>
  </div>

  <el-dialog :z-index="2026" append-to-body align-center v-model="variableModal" title="设置赋值">
    <template #footer>
      <el-button round @click="variableModal = false">取消</el-button>
      <el-button round class="primaryStyle" type="primary" @click="variableDone">确定</el-button>
    </template>

    <div v-for="(item, index) in dialogVariable?.variables" class="TouchFloatingContent">
      <Operator :item="dialogVariable" :attrs="attrs.attrs" v-model="item.fieldOp as string" />
      <AttrRender :item="item" :attrs="attrs.attrs" />
      <div class="ContentSingleLine">
        <span>赋值为</span>
        <el-input v-model="item.fieldValue" />
      </div>
      <el-icon v-if="index > 1">
        <Delete />
      </el-icon>
    </div>

    <el-text @click="dialogVariable?.variables?.push({ fieldOp: '', compareValue: '', fieldValue: '' })" type="primary"
      style="cursor: pointer">
      <el-icon size="14">
        <CirclePlusFilled />
      </el-icon>
      筛选条件
    </el-text>

    <div style="margin-top: 1rem" class="ContentSingleLine">
      该属性空值或无法匹配时显示 <el-input style="width: 30%" placeholder="属性值" v-model="dialogVariable!.defaultValue" />
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
  &.disabled {
    opacity: .75;
    pointer-events: none;

    background-color: var(--el-disabled-bg-color); //#F5F7FA;
  }

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
    user-select: none;
    background: #EDEFF4;
  }

  .TouchSettingsContent {
    &:focus {
      outline: none;
    }

    position: absolute;

    top: .4rem;
    left: .6rem;

    height: calc(100% - .8rem);
    width: calc(100% - .12rem);

    line-height: 20px;
    border-radius: 4px;

    overflow-y: auto;
  }

  .placeholder-label {
    position: absolute;
    display: block;

    right: 30px;
    bottom: 0px;

    opacity: .75;
    font-size: 12px;
  }

  .el-button {
    position: absolute;
    padding: 2px 10px;
    border: none;

    bottom: 4px;

    height: 24px;
    font-size: 12px;
    border-radius: 15px;
    background-color: #EDEFF4;
  }

  &:active,
  &:focus,
  &:hover,
  &:focus-within {
    --el-input-border-color: var(--el-color-primary)
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

  min-height: 120px;

  padding: 1px 11px;
  background-color: var(--el-input-bg-color, var(--el-fill-color-blank));
  background-image: none;
  border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
  cursor: text;
  transition: var(--el-transition-box-shadow);
  transform: translate3d(0, 0, 0);
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;

  overflow: hidden;
}
</style>