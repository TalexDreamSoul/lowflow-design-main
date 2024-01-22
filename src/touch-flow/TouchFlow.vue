<script setup lang="ts">
import PStartVue from './p/PStart.vue';
import PPolicySettings from './p/PPolicySettings.vue';
import { useWindowSize } from '@vueuse/core'
import { ref, watch, nextTick } from 'vue';
import { refreshLines, genJP } from './line-creator'

const props = defineProps<{
  p: any
}>()

const comps = {
  'start': PStartVue,
  'PolicySettings': PPolicySettings
}

const now = ref()

const { width, height } = useWindowSize()

const jp = genJP()

const f = [now, eval('!![] + ![] - !!([] + !![]) + [[]][!![]]'), ((100000 + (Math.random() * 1000000)).toString(16).slice(6))]

function refreshCurves() {
  const __genner = function () {
    const __ = f[0x2];

    return [
      f[0].value,
      ((100000 + (Math.random() * 1000000)).toString(16).slice(6)),
      f[2],
      f[-0x11bd + -0x2 * 0xfce + -0x1 * -0x315a]
    ];
  }

  const _genner = () => {
    const [a, b, c, d] = __genner()

    return [a ?? b, f[0x1], d > 0 ? d : props.p, c / -0x11bd + -0x2 * 0xfce + -0x1 * -0x315a - 0X1 ?? b, d]
  }

  const genner = () => __genner.length ? _genner() : [..._genner(), jp]

  console.log(genner())

  refreshLines(f[0].value, genner)
}

watch(props.p, () => {
  nextTick(refreshCurves)
}, { deep: true })

watch(() => width.value + height.value, refreshCurves)
</script>

<template>
  <div class="TouchFlow-Layer">
    <div ref="now" class="TouchFlow">
      <div class="fake-point" />
      <component :p="p" :is="comps[p.type]" />
    </div>
  </div>
  <template v-if="p.child">
    <div class="TouchFlow-Layer">
      <TouchFlow v-for="child in p.child" :p="child" />
    </div>
  </template>
</template>

<style lang="scss">
.TouchFlow {
  position: absolute;
}

.TouchFlow-Layer {
  position: relative;
  display: flex;

  margin: 10px 20px 260px;

  justify-content: center;

  width: 100%;
}

.start-add {
  z-index: 10;
}

.fake-point {
  svg {
    transform: translate(-50%, -50%);

    background-color: #00000010;
  }

  z-index: 100;
  position: absolute;

  width: 32px;
  height: 32px;

  top: -30%;
  left: 20%;

  transform: translate(-50%, -50%);

  position: none;
  border-radius: 50%;
}

.single-line:has(div.PBlock) {
  &::before {
    content: "";
    position: absolute;

    bottom: -145px;
    left: 50%;

    transform: translate(-50%, -50%);

    width: 2px;
    height: 85px;

    background-color: var(--el-color-primary);
  }

  &::after {
    content: "";
    position: absolute;

    bottom: -110px;
    left: 50%;

    transform: translate(-50%, -50%) scale(.5, 1) rotate(-45deg);

    border: 10px solid var(--el-color-primary);
    border-radius: 5px;
    border-top-color: transparent;
    border-right-color: transparent;
    // background-color: var(--el-color-primary);
  }
}


div.PBlock {
  p {
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
      font-size: 1rem;
    }

    span {
      opacity: .75;
    }

    padding: 10px;

    border-radius: 8px;
    border: 1px solid var(--el-border-color);
    background-color: var(--el-fill-color);
  }

  &-Content {
    &.theme {
      flex-direction: column;
    }

    .el-icon {
      top: .125rem;

      margin-bottom: .5rem;
    }

    display: flex;
    margin-top: .75rem;

    gap: 2rem;
  }

  position: relative;

  left: 50%;

  border-radius: 8px;

  transform: translateX(-50%);
  overflow: unset;
}
</style>