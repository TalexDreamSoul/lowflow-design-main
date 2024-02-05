<script setup lang="ts">
import PStartVue from "./p/PStart.vue";
import PPolicySettings from "./p/PPolicySettings.vue";
import Branch from "./p/Branch.vue";
import SubBranch from './p/SubBranch.vue'
import { useWindowSize } from "@vueuse/core";
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from "vue";
import { refreshLines, genJP } from "./line-creator";
// import { createTemplatePopover } from '../utils/touch-templates'

// const value = ref({
//   id: "323232",
//   name: "测试233",
// })
// createTemplatePopover('新建企微模版', 'digital')
// createTemplatePopover('新建站内信模版', 'znx', value)
// createTemplatePopover('新建短信模版', 'sms')
// createTemplatePopover('新建APP Push模版', 'app')
// createTemplatePopover('新建外呼模版', 'outbound')

const props = defineProps<{
  p: any;
}>();
// 配置画布节点
const comps: any = {
  start: PStartVue,
  strategy: PPolicySettings,
  Delivery: Branch,
  SubBranch,
};

const now = ref();
const nextLayer = ref();

let _next;

onBeforeUnmount(() => {
  _next!?.remove()
})

onMounted(() => {
  now.value._refreshCurves = refreshCurves

  const nextLayerDom = nextLayer.value

  if (!nextLayerDom) return

  _next = nextLayerDom

  nextTick(() => {
    const layerParent = nextLayerDom.parentElement;
    if (!layerParent.classList.contains("TouchFlow-Layer")) return

    const lpp = layerParent.parentElement

    layerParent.removeChild(nextLayerDom);
    lpp.appendChild(nextLayerDom);

    nextTick(refreshCurves)
  })
})

const { width, height } = useWindowSize();

const jp = genJP();

const f = [
  now,
  eval("!![] + ![] - !!([] + !![]) + [[]][!![]]"),
  (100000 + Math.random() * 1000000).toString(16).slice(6),
];

function refreshCurves() {
  const __genner = function (_: any) {
    const __ = f[0x2];

    return [
      f[0].value,
      (100000 + Math.random() * 1000000).toString(16).slice(6),
      f[2],
      f[-0x11bd + -0x2 * 0xfce + -0x1 * -0x315a],
      _,
    ];
  };

  const _genner = (_: any) => {
    const [a, b, c, d] = __genner(_);

    return [
      a ?? b,
      f[0x1],
      d > 0 ? _ : props.p,
      (c ?? _) / -0x11bd + -0x2 * 0xfce + -0x1 * -0x315a - 0x1 ?? b,
      d,
    ];
  };

  const genner = (v?: any) =>
    !__genner.length ? _genner(v) : [..._genner(v), jp];

  refreshLines(f[0].value, genner);
}

watch(props.p, () => {
  nextTick(refreshCurves);
});

watch(() => width.value + height.value, refreshCurves);
</script>

<template>
  <div class="TouchFlow-Layer">
    <div ref="now" class="TouchFlow">
      <div class="fake-point" />
      <component :p="p" :is="comps[p.nodeType]" />
    </div>
  </div>
  <template v-if="p.children">
    <div ref="nextLayer" class="TouchFlow-Layer">
      <TouchFlow v-for="child in p.children" :p="child" />
    </div>
  </template>
</template>

<style lang="scss">
.TouchFlow {
  position: absolute;
}

.TouchFlow-Layer {
  &+& {
    margin-bottom: 40px;

    .fake-point {
      top: -300%;
    }

    .single-line {
      &::before {
        bottom: -380px;

        height: 260px;
      }

      &::after {
        bottom: -250px;
      }
    }
  }

  position: relative;
  display: flex;

  margin: 10px 20px 320px;

  justify-content: center;

  width: 100%;
}

.start-add {
  &.display {
    opacity: 1;

    pointer-events: unset;
  }

  &:hover {
    opacity: 0.95;
  }

  z-index: 10;
  position: absolute;

  left: 50%;

  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, -50%);
  background: linear-gradient(rgb(32, 92, 203) 0%, rgb(89, 143, 241) 100%);

  transition: 0.25s;
}

.fake-point {
  z-index: 100;
  position: absolute;

  width: 32px;
  height: 32px;

  top: -30%;
  left: 30%;

  transform: translate(-50%, -50%);

  position: none;
  border-radius: 50%;
}

.single-line:has(div.PBlock) {
  &::before {
    content: "";
    position: absolute;

    bottom: -180px;
    left: 50%;

    transform: translate(-50%, -50%);

    width: 2px;
    height: 120px;

    background-color: var(--el-color-primary);
  }

  &::after {
    content: "";
    position: absolute;

    bottom: -140px;
    left: 50%;

    transform: translate(-50%, -50%) scale(0.5, 1) rotate(-45deg);

    border: 10px solid var(--el-color-primary);
    border-radius: 5px;
    border-top-color: transparent;
    border-right-color: transparent;
    // background-color: var(--el-color-primary);
  }
}

div.PBlock {
  p {
    &.title {
      .el-button {
        position: absolute;

        right: 20px;
      }

      display: flex;

      gap: 2rem;

      align-items: center;
      justify-content: space-between;

      width: 100%;
    }

    margin: 0;
    font-size: 1.25rem;
  }

  display: flex;

  &-Section {
    &:hover {
      cursor: pointer;
      border-color: var(--el-color-primary);
    }

    p {
      margin: 5px 0;
      font-size: 1rem;
    }

    span {
      color: #999;
    }

    padding: 16px;
    width: 280px;
    background: linear-gradient(180deg,
      #f2f4f8 0%,
      rgba(242, 244, 248, 0.4) 100%) rgba(255, 255, 255, 0.4);
    border-radius: 8px 8px 8px 8px;
    opacity: 1;
  }

  &-Content {
    &.theme {
      flex-direction: column;

      & .PBlock-Section {
        &::before {
          z-index: -1;
          content: "";
          position: absolute;

          left: 0;
          top: 0;

          width: 100%;
          height: 100%;

          opacity: 0.12;
          border-radius: 0 4px 4px 0;
          background-color: var(--theme-color, red);
        }

        position: relative;

        width: 280px;
        border: none;
        border-left: 4px solid var(--theme-color, red);

        border-radius: 4px;
        background: unset;
      }
    }

    .el-icon {
      top: 0.125rem;

      margin-bottom: 0.5rem;
    }

    display: flex;
    margin-top: 0.75rem;

    gap: 0.5rem;

    font-size: 14px;
  }

  position: relative;

  left: 50%;

  border-radius: 8px;

  transform: translateX(-50%);
  overflow: unset;
}
</style>
