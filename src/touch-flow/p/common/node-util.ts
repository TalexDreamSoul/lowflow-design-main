import { computed, inject, onBeforeUnmount, provide, reactive, ref } from "vue";
import { Stamp, Plus, CircleCheckFilled, User, Position } from "@element-plus/icons-vue";
import ConditionSetAttr from "../attr/ConditionSetAttr.vue";
import CustomersAttr from "../attr/CustomersAttr.vue";
import PolicySettingsAttr from "../attr/PolicySettingsAttr.vue";
import DeliverySettingsAttr from "../../p/attr/DeliverySettingsAttr.vue";
import Strategist from "../attr/Strategist.vue";

/**
 * 处理流程树数据
 * 1. $d( __data ) 就是tree中的响应式数据 => 修改它 传过去的数据（post的data/FlowPage的flowOptions）就更新
 * 2. data 响应式的 当前组件内部缓存的数据 => 保存才会更新
 */
function useTreeData() {
  const getNode: Function = inject("getNode")!;
  const node = getNode();
  const { data: x6NodeData } = node;
  const refNodeData = x6NodeData.$d(x6NodeData.id);
  const innerData = reactive(JSON.parse(JSON.stringify(refNodeData)));

  // Object.assign(innerData, refNodeData)

  return [innerData, refNodeData]
}

/**
 * Manager drawer & dialog & modal
 */
export function genPopoverManager(innerData: any) {
  const dialogVisible = ref(false);
  const drawerOptions = reactive<any>({
    visible: false,
  });

  const { doDiverse, haveDiverse, haveReveal } = useComputedData(innerData)

  const _comps = [
    {
      icon: {
        type: "comp",
        value: Stamp,
      },
      title: "选择策略器",
      desc: "按客户属性行为或触发事件对客户筛选分流，并执行动作。",
      comp: PolicySettingsAttr,
    },
    {
      icon: {
        type: "comp",
        value: Stamp,
      },
      title: "分流器",
      desc: "按设置的比例自动客户对随机分流，并执行动作。",
      show: () => !haveReveal.value && !doDiverse.value,
      comp: DeliverySettingsAttr,
    },
    {
      icon: {
        type: "comp",
        value: Stamp,
      },
      title: "兜底选择器",
      disabled: haveReveal,
      desc: "筛选未进入本节点下选择策略器的客户，并执行动作。",
      show: () => doDiverse.value,
      comp: Strategist,
    },
  ];

  const comps = computed(() => _comps.filter((comp) => comp?.show?.() ?? true));

  function openCondition() {
    openDrawer({
      title: "流程类型设置",
      comp: ConditionSetAttr,
    });
  }

  function openCustomer() {
    openDrawer({
      title: "受众客户设置",
      comp: CustomersAttr,
    });
  }

  function openDrawer(comp: any) {
    dialogVisible.value = false;

    Object.assign(drawerOptions, comp);

    if (!innerData.executeType) innerData.executeType = "immediately";

    drawerOptions.visible = true;
  }

  onBeforeUnmount(() => {
    console.log('onUnmounted')

    drawerOptions.visible = false
  })

  return {
    openDrawer,
    openCustomer,
    openCondition,
    drawerOptions,
    dialogVisible,
    doDiverse,
    haveDiverse,
    haveReveal,
    comps,
  }
}

/**
 * 返回根据当前的data生成的状态变量
 * @param data 必须为 innerData
 */
function useComputedData(data: any) {
  /**
   * 判断当前Node的下一层Node中是否有选择策略器
   * 如果有 返回真
   */
  const doDiverse = computed(() => {
    const { children } = data;

    if (!children?.length) return false;

    return [...children].find((child) => "strategy" === child?.nodeType) ?? true;
  });

  /**
   * 是否有分流器
   */
  const haveDiverse = computed(() => {
    if (!doDiverse.value) return false;

    const { children } = data;

    if (!children?.length) return false;

    return [...children].find((child) => "diversion" === child?.nodeType);
  });

  /**
   * 是否有兜底策略器
   */
  const haveReveal = computed(() => {
    const { children } = data;

    if (!children?.length) return false;

    return (
      [...children].find((child) => "strategy" === child?.nodeType && child?.reveal) ??
      false
    );
  });

  return {
    doDiverse,
    haveDiverse,
    haveReveal
  }
}

function useSaveFunc(innerData: any, refNodeData: any, callback: Function) {
  let _saveFunc: (() => boolean) | null = null;

  function handleSave() {
    if (!_saveFunc || !_saveFunc()) return;

    Object.assign(refNodeData, innerData);

    refNodeData.children = innerData.children

    console.log("__data", refNodeData)

    callback()
  }

  provide("save", (regFunc: () => boolean) => {
    _saveFunc = regFunc;
  });

  function handleClick(e: Event) {
    // @ts-ignore exist
    if (window.__clickListen) {
      // @ts-ignore exist
      window.__clickListen(e);
    }
  }

  return [handleClick, handleSave]
}

export function genNodeParams() {

  console.group("NODE")

  const [innerData, __data] = useTreeData()
  console.log("节点建立")
  console.log("TreeNode ref-data", __data)
  console.group("节点数据 INNER", innerData)

  const { dialogVisible, drawerOptions, openCustomer, openCondition, openDrawer, comps, haveDiverse } = genPopoverManager(innerData)

  console.log("节点数据 OUTER", { dialogVisible, drawerOptions, openCustomer, openCondition, openDrawer, comps, haveDiverse })

  const [handleClick, handleSave] = useSaveFunc(innerData, __data, () => {
    dialogVisible.value = false;
    drawerOptions.visible = false;
  })

  console.groupEnd()

  return {
    comps,
    data: innerData,
    openDrawer,
    openCustomer,
    openCondition,
    dialogVisible,
    drawerOptions,
    handleSave,
    handleClick,
    haveDiverse,
    readonly: __data.$readonly,
  }
}