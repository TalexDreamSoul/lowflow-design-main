<script setup lang="ts">
import { useDebounceFn, useVModel } from "@vueuse/core";
import { ref, h, reactive, watchEffect, nextTick, computed, onBeforeMount } from "vue";
import { createFloatingPanel } from "./floating-panel";
import { getDictAnalyzedTree, validatePropValue } from "../../flow-utils";
import TouchSelectWrapper from "./TouchSelectable.vue";
import Operator from "../../page/Operator.vue";
import AttrRender from "~/touch-flow/page/AttrRender.vue";
import { randomStr } from "~/utils/common";
import { CirclePlusFilled, Plus } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { VariableTemplateDTO } from "../../touch-total";

const props = defineProps<{
  modelValue?: any;
  buttonTitle?: string;
  content: string;
  variables: string;
  disabled?: boolean;
  ignoreId?: boolean;
}>();

const contentRef = ref<HTMLElement>();
const variableMap = new Map<string, VariableTemplateDTO>();
const dialogVariable = ref<VariableTemplateDTO>();

const dictTree = ref();
const attrs = ref();

const displayRender = useDebounceFn(_displayRender, 100);

(async () => {
  const [tree, _attrs] = await getDictAnalyzedTree();

  attrs.value = _attrs.data;
  dictTree.value = tree;

  watchEffect(displayRender);
})();

const settingSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L21.5 6.5V17.5L12 23L2.5 17.5V6.5L12 1ZM12 3.311L4.5 7.65311V16.3469L12 20.689L19.5 16.3469V7.65311L12 3.311ZM12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16ZM12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"></path></svg>`;

function _displayRender() {
  if (!props.ignoreId && !props.modelValue?.id) return;
  console.groupCollapsed("TouchSettingContents");

  const { modelValue, content, variables } = props;
  console.log("tsc props", props, modelValue[content], modelValue[variables]);

  let __content: string = modelValue[content];
  const _variables = modelValue[variables];

  const _preFuncs: any[] = [];
  let startsInd = 0;
  if (_variables) {
    for (let variable of _variables) {
      const { index, field, fieldName, label, type } = variable;
      const text = fieldName || label;
      const id = `$$${index}$$`;

      const __subVariables = [];

      for (let subVariable of variable.variables) {
        console.log("__sub variable", subVariable);

        __subVariables.push({
          compareValue: subVariable.compareValue,
          defaultValue: subVariable.defaultValue,
          fieldOp: subVariable.fieldOp,
          fieldValue: subVariable.fieldValue,
          field,
          type,
        });
      }

      console.log("__subVariables", __subVariables);

      variableMap.set(index, {
        field,
        fieldName: variable.fieldName,
        defaultValue: variable.defaultValue,
        index,
        labelId: variable.labelId,
        labelName: variable.labelName,
        type,
        variables: __subVariables,
      });

      console.log("variableMap", variableMap);

      const ind = __content.indexOf(id, startsInd);
      if (ind > -1) {
        startsInd = ind;

        const condition = getCurrSelected({
          field: text,
        });

        _preFuncs.push(() => {
          const e = document.getElementById(index)!;
          const valueDom: any = e.querySelector(".value");

          valueDom.parentElement._condition = condition;
          valueDom.parentElement._value = text;
          valueDom.setAttribute("value", text);
          valueDom.innerText = condition.label;
        });

        const _ = `<button unselectable="on" id="${index}" data-id="${index}" contenteditable="false" class="TouchLabel"><span>变量：</span><span class="value">${text}</span>&nbsp;${settingSvg}</button>`;

        __content = __content.slice(0, ind) + _ + __content.slice(ind + id.length);
      }
    }
  }

  nextTick(() => {
    const el = contentRef.value;
    if (!el) return;

    const html = el.innerHTML.replaceAll("&nbsp;", " ");

    // console.log(">", el, { __content, html, innerText: el.innerText, validateContent });

    if (html === __content) return;

    console.log("content updated");

    el.innerHTML = __content;

    nextTick(() => _preFuncs.forEach((a) => a()));
  });

  console.log("touch", __content, _variables);

  console.groupEnd();
}

const variableModal = ref(false);

function insertNode(htmlX: string) {
  const dom = contentRef.value;
  if (!dom) return;

  dom.focus();

  var sel, range;

  sel = window.getSelection()!;

  if (sel.getRangeAt && sel.rangeCount) {
    range = sel.getRangeAt(0);
    range.deleteContents();

    var el = document.createElement("div");
    el.innerHTML = htmlX;
    var frag = document.createDocumentFragment(),
      node,
      lastNode;
    while ((node = el.firstChild)) {
      lastNode = frag.appendChild(node);
    }
    range.insertNode(frag);

    // Preserve the selection
    if (lastNode) {
      range = range.cloneRange();
      range.setStartAfter(lastNode);
      range.collapse(true);
      sel.collapseToEnd();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }
}

// 根据获得的value查询dict item
const getCurrSelected = (condition: any) =>
  [...dictTree.value]
    .map((_: any) =>
      [..._.children].map((__: any) => (__.children?.length ? __.children : [__]))
    )
    .flat(2)
    .find((_: any) => _.field === condition.field || _.label === condition.field);

let _floating: any;

onBeforeMount(() => {
  console.log("disposed unmounted");

  _floating?.();
});

function addLabel() {
  const id = randomStr(6).replaceAll(".", "");

  variableMap.set(
    id,
    reactive({
      field: id,
      variables: [],
    })
  );

  insertNode(
    `<button unselectable="on" id="${id}" data-id="${id}" contenteditable="false" class="TouchLabel"><span>变量：</span><span class="value">请选择</span>&nbsp;${settingSvg}</button>`
  );
}

function handleClick(e: Event) {
  e.preventDefault();

  if (_floating) {
    _floating();

    _floating = null;
  }

  const target = e.target as Element;
  if (target.tagName === "svg") {
    const parent: any = target.parentElement;
    const { id } = parent!.dataset;

    const condition = parent._condition;

    if (condition) {
      const _val = parent._value;

      const variable = variableMap.get(id!)!;

      console.log("condition", condition, variable);

      Object.assign(variable, {
        index: id,
        field: condition.field,
        fieldName: condition.fieldName,
        fieldOp: condition.fieldOp,
        fieldType: condition.fieldType || condition.labelValueType,
        labelId: condition.id,
        labelName: condition.labelName,
        labelValue: condition.labelValue?.data ? _val : undefined,
        type: condition.labelValue?.data ? "2" : "1",
      });

      dialogVariable.value = variable;
      variableModal.value = true;

      return;
    }
  }

  // e path iterator
  e.composedPath().forEach((e: any) => {
    if (e.className === "TouchLabel") {
      _floating = createFloatingPanel(e, {
        render: () => {
          return h(TouchSelectWrapper, {
            data: dictTree.value,
            onChange: (val: any) => {
              const condition = getCurrSelected({
                field: val,
              });

              const { id } = e!.dataset;
              const variable = variableMap.get(id!)!;
              Object.assign(variable, {
                index: id,
                field: condition.field,
                fieldName: condition.fieldName,
                labelId: condition.id,
                labelName: condition.labelName,
                labelValue: val,
                type: condition.labelValue?.data ? "2" : "1",
              });

              const valueDom = e.querySelector(".value");

              e._condition = condition;
              e._value = val;

              valueDom.setAttribute("value", val);
              valueDom.innerText = condition.label;

              props.modelValue[props.variables] = [...variableMap.values()];

              handleBlur();

              if (_floating) _floating();
            },
          });
        },
      });
    }
  });
}

function _handleBlur() {
  const contentDom = contentRef.value!;

  let content = "";

  contentDom?.childNodes.forEach((node: ChildNode) => {
    if (node.nodeName === "BUTTON") {
      const id = (node as HTMLElement).dataset.id;
      const obj = variableMap.get(id!)!
      if ( obj.labelName || obj.fieldName )
      {
        console.log("aaa", obj)
        content += `$$${id}$$`;
      } else variableMap.delete(id!)
    } else content += node.nodeValue;
  });

  props.modelValue[props.content] = content;

  console.log("____", content, contentDom.innerText);

  console.log("blur", props, Object.freeze(JSON.stringify(content)));
}

const handleBlur = useDebounceFn(_handleBlur, 200);

function variableDone() {
  const data = dialogVariable.value!;

  if (!validatePropValue(data.defaultValue)) {
    return ElMessage({
      type: "error",
      message: "空值或无法匹配值不能为空",
    });
  }

  const { variables } = data;
  if (!variables || variables.length < 1) {
    return ElMessage({
      type: "error",
      message: "筛选条件必须至少存在一条",
    });
  }

  let ind = 0;
  for (let variable of variables) {
    if (
      !validatePropValue(
        variable.fieldOp
      ) /* || !(validatePropValue(variable.fieldValue)) */ ||
      !validatePropValue(variable.compareValue)
    ) {
      const id = `variable-item-${ind}`;

      nextTick(() => {
        const el = document.getElementById(id)!;

        el.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      });

      return ElMessage({
        type: "error",
        message: "筛选条件必须填写完整",
      });
    }

    ind++;
  }

  variableModal.value = false;

  props.modelValue[props.variables] = [...variableMap.values()];
}

const contentLength = computed(() => {
  return props.modelValue[props.content]?.length ?? 0;
});

function handleAdd() {
  dialogVariable.value!.variables?.push({
    fieldOp: "",
    compareValue: "",
    fieldValue: "",
    defaultValue: "",
    field: dialogVariable.value!.field,
    type: dialogVariable.value!.type,
  });

  const index = dialogVariable.value!.variables?.length;
  const id = `variable-item-${index! - 1}`;

  nextTick(() => {
    const el = document.getElementById(id)!;

    el.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  });
}
</script>

<template>
  <div :class="{ disabled }" tabindex="1" class="TouchSettingsContentWrapper">
    <div
      @click="handleClick"
      @input="handleBlur"
      ref="contentRef"
      class="TouchSettingsContent"
      contenteditable="true"
    />

    <el-button @click="addLabel">
      <el-icon color="#326DD7">
        <Plus />
      </el-icon>
      &nbsp;&nbsp;&nbsp;{{ buttonTitle ?? "插入端口" }}
    </el-button>

    <span class="placeholder-label"> 共 {{ contentLength }} 字 </span>
  </div>

  <!-- :z-index="2026" -->
  <el-dialog append-to-body align-center v-model="variableModal" title="设置赋值">
    <template #footer>
      <el-button round @click="variableModal = false">取消</el-button>
      <el-button round class="primaryStyle" type="primary" @click="variableDone"
        >确定</el-button
      >
    </template>

    <div class="DialogWrapper">
      <div
        :id="`variable-item-${index}`"
        v-for="(item, index) in dialogVariable?.variables"
        class="TouchFloatingContent"
      >
        <Operator
          style="width: 100px"
          :item="item"
          :attrs="attrs.attrs"
          v-model="item.fieldOp"
        />
        <!-- && item.fieldOp?.indexOf('等于') === -1 -->
        <AttrRender
          v-if="item.fieldOp?.indexOf('空') === -1"
          style="width: 300px"
          :item="item"
          :attrs="attrs.attrs"
        />
        <div class="ContentSingleLine">
          <span>赋值为</span>
          <el-input v-model="item.compareValue" />
        </div>
        <el-icon
          @click="dialogVariable?.variables?.splice(index, 1)"
          :style="!index ? `opacity: 0;pointer-events: none` : ''"
        >
          <Delete />
        </el-icon>
      </div>

      <el-text @click="handleAdd" type="primary" style="cursor: pointer">
        <el-icon size="14">
          <CirclePlusFilled />
        </el-icon>
        筛选条件
      </el-text>

      <div style="margin-top: 1rem" class="ContentSingleLine">
        该属性空值或无法匹配时显示
        <el-input
          style="width: 30%"
          placeholder="属性值"
          v-model="dialogVariable!.defaultValue"
        />
      </div>
    </div>
  </el-dialog>
</template>

<style lang="scss">
.el-dialog {
  border-radius: 8px;
}

.DialogWrapper {
  padding-right: 0.5rem;
  height: 400px;

  overflow-y: scroll;
}

.ContentSingleLine {
  span {
    flex-shrink: 0;
  }

  display: flex;

  align-items: center;

  flex: 1;
  gap: 0.5rem;
}

.TouchFloatingContent {
  .el-icon {
    &:hover {
      color: #277ae7;
      cursor: pointer;
    }
  }

  position: relative;
  margin: 0.5rem 0 1rem;
  display: flex;

  width: 100%;
  gap: 4px;

  align-items: center;
  // display: grid;

  // gap: 1rem;
  // grid-template-columns: repeat(3, 1fr);
}

.TouchFloating {
  z-index: 100;
  padding: 0.5rem;

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
    opacity: 0.75;
    pointer-events: none;

    background-color: var(--el-disabled-bg-color); //#F5F7FA;
  }

  .TouchLabel {
    svg {
      &:hover {
        opacity: 0.75;
      }

      position: relative;
      margin-top: 0.1rem;

      width: 16px;
    }

    &:hover {
      opacity: 0.9;
    }

    position: relative;
    display: inline-flex;

    margin: 5px 2px;
    padding: 2px 8px;
    color: #409eff;
    border-radius: 15px;

    align-items: center;

    border: none;
    cursor: pointer;
    // user-select: none;
    background: #edeff4;
  }

  .TouchSettingsContent {
    &:focus {
      outline: none;
    }

    position: absolute;

    top: 0.4rem;
    left: 0.6rem;

    height: calc(100% - 0.8rem);
    width: calc(100% - 0.12rem);

    line-height: 20px;
    border-radius: 4px;

    overflow-y: auto;
  }

  .placeholder-label {
    position: absolute;
    display: block;

    right: 30px;
    bottom: 0px;

    opacity: 0.75;
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
    background-color: #edeff4;
  }

  &:active,
  &:focus,
  &:hover,
  &:focus-within {
    --el-input-border-color: var(--el-color-primary);
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
