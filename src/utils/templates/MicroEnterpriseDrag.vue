<script setup lang="ts" name="MicroEnterpriseDrag">
import { type UseDraggableReturn, useDraggable } from 'vue-draggable-plus'
import { ref, nextTick } from 'vue'
import { useVModel } from '@vueuse/core';
import TouchSettingContents from '~/touch-flow/p/touch/TouchSettingContents.vue';
import { watchEffect } from 'vue';
import { Delete, Upload, Download } from '@element-plus/icons-vue';

const props = defineProps<{
  modelValue?: Array<any>,
}>()

const emits = defineEmits(['update:modelValue', 'delete', 'upload', 'download'])

const el = ref()
const drag = ref(false)
const list = useVModel(props, 'modelValue', emits)
const thisList = ref<Array<any>>()

watchEffect(() => {
  thisList.value = props.modelValue
})

// @ts-ignore force
const res = useDraggable(el, list, {
  animation: 150,
  ghostClass: 'ghost',
  handle: '.drag-trigger-area',
  onStart: () => drag.value = true,
  onEnd: () => nextTick(() => drag.value = false),
})

function generateReflexlyProxy(arr: typeof list, index: number) {
  return new Proxy(arr.value?.at(index), {
    set: (target: any, p: string | symbol, newValue: any, receiver: any) => {

      arr.value!.at(index)[p] = newValue

      return true
    },
    get: (target: any, p: string | symbol, receiver: any) => {
      return arr.value!.at(index)[p]
    }
  })
}
</script>

<template>
  <div class="MicroEnterpriseDrag">
    <TransitionGroup ref="el" type="transition" tag="ul" :name="!drag ? 'fade' : undefined"
      class="flex flex-col gap-2 p-4 w-300px bg-gray-500/5 rounded">
      <li class="drag-item" draggable="true" :data-ind="item.name" :key="item.id" v-for="(item, index) in thisList">
        <div class="drag-item-header">
          <el-tooltip :content="item.name">
            <span class="text-2xl name-label">{{ item.name }}</span>
          </el-tooltip>

          <div class="header-controller">
          <el-button type="text" v-if="index !== 0" @click="emits('upload', item, index)">
              <el-icon>
                <Upload />
              </el-icon>
              上移
            </el-button>
            <el-button type="text" v-if="index + 1 < (thisList?.length ?? 0)" @click="emits('download', item, index)">
              <el-icon>
                <Download />
              </el-icon>
              下移
            </el-button>
            <el-button type="text" @click="emits('delete', item, index)">
              <el-icon>
                <Delete />
              </el-icon>
            </el-button>
          </div>
        </div>
        <div class="content-container">
          <img v-if="item.type === 'image'" :src="item.imgUrl" alt="AddonPic" />
          <TouchSettingContents content="content" variables="variables" v-model="thisList![index]"
            v-else-if="item.type === 'content'" />
          <span v-else>{{ item }} ERROR</span>
        </div>
        <div class="drag-trigger-area">

        </div>
      </li>
    </TransitionGroup>
  </div>
</template>

<style lang="scss">
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}

.fade-leave-active {
  position: absolute;
}

.MicroEnterpriseDrag {
  .drag-trigger-area {
    position: absolute;
    display: none;

    right: 0;
    top: 30px;

    height: calc(100% - 30px);

    width: 10%;
    max-width: 5rem;

    cursor: grab;
    border-radius: 0 8px 8px 0;

    &::after {
      content: '';
      position: absolute;

      width: 20px;
      height: 50%;

      right: 2.5%;
      top: 50%;

      transform: translate(-50%, -50%);

      background:
        radial-gradient(circle at 50% 50%, #7D7D7D80 2px, transparent 3px);
      // background-repeat: repeat-y;
      background-size: 10px 10px;
    }
  }

  .drag-item {
    &-header {
      .name-label {
        position: relative;
        max-width: 40%;

        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: .85rem;
        overflow: hidden;
      }

      .header-controller {
        height: 30px;
        width: 100px;

        text-align: right;

        flex: 1;
      }

      position: relative;
      display: flex;
      padding: 0 .5rem;
      // margin-bottom: .25rem;

      justify-content: space-between;
      align-items: center;

      height: 30px;
      // line-height: 30px;
      width: 100%;

      box-sizing: border-box;
      border-radius: 4px 4px 0 0;
      background-color: #ECF1FC;
    }

    &.ghost {
      .drag-trigger-area {
        &::after {
          opacity: 0;
        }
      }

      &::before {
        opacity: 1;

        transform: scale(1);
      }

      .content-container {
        opacity: 0;
      }

      background-color: #FAFAFA80;
    }

    &::before {
      content: '';
      position: absolute;

      width: 100%;
      height: 100%;

      left: 0;
      top: 0;

      opacity: 0;
      transition: .25s;
      transform: scale(1.05);
      border-radius: 8px;
      border: 2px dashed #7D7D7D50;
    }

    .content-container {
      position: relative;
      // padding: .5rem;
      width: calc(100% - 0px);
      height: 100%;

      .TouchSettingsContentWrapper {
        height: 100%;

        box-shadow: none !important;
      }

      img {
        position: relative;
        // width: 100%;
        height: 80px;

        object-fit: contain;
      }
    }

    position: relative;
    // padding: .5rem;

    min-height: 80px;
    transition: .25s;
    list-style: none;
    border-radius: 4px;
    box-sizing: border-box;
    border: 1px solid #D4D4D4;
    background-color: #FAFAFA;
  }

  ul {
    padding: 0;
    display: flex;

    gap: 1rem;
    flex-direction: column;
  }

  min-height: 60px;

  overflow: hidden;
}
</style>