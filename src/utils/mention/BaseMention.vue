<script setup lang="ts" name="BaseMention">
import { ElMessage } from "element-plus";
import { ref, watch, Ref } from "vue";
import { Close } from "@element-plus/icons-vue";
import { addMaterial, updateMaterial } from "~/api/index";
import { throttledRef } from "@vueuse/core";
import { validatePropValue } from "~/touch-flow/flow-utils";
import TitleMention from "./TitleMention.vue";

const props = defineProps<{
  title: Ref<string>;
  content: Ref<string>;
  loading: Ref<boolean>;
  show: Ref<boolean>;
  close: Function;
  countdown: Ref<number>
}>();

const out = ref(false);
const countdown = ref(0);

watch(() => props.countdown.value, () => {
  countdown.value = props.countdown.value || 0
}, { immediate: true })

let _timer: any
watch(() => props.loading.value, (val) => {
  if (!val) {
    countdown.value >= 0 && cnt()
  } else clearTimeout(_timer)
}, { immediate: true })

function cnt() {
  clearTimeout(_timer)

  if (countdown.value == 0) {
    return destroy()
  }

  _timer = setTimeout(() => {
    cnt()
  }, 1000);

  countdown.value -= 1
}

function destroy() {
  out.value = true;

  setTimeout(props.close, 500);
}
</script>

<template>
  <div class="BaseMention" :class="{ out }">
    <div class="BaseMention-Header">
      <TitleMention class="BaseMention-Title" :text="title.value" />

      <br />

      <TitleMention class="BaseMention-Content" :text="content.value" />
    </div>

    <div @click="destroy" class="BaseMention-Footer">
      <div class="mention-button" :class="{ loading: loading.value }" />
      <el-button :class="{ loading: loading.value }" round class="primaryStyle">
        <span>确定<span v-if="props.countdown.value && countdown + 1">({{ countdown + 1 }}s)</span></span>
      </el-button>
    </div>
  </div>
</template>

<style lang="scss">
@keyframes loading {

  0%,
  100% {
    width: 50%;
    transform: translateX(-100%);
  }

  50% {
    width: 100%;
    transform: translateX(100%);
  }
}

.BaseMention-Footer {
  .mention-button {
    &::before {
      content: "";
      position: absolute;

      width: 20%;
      height: 5px;

      align-self: center;

      opacity: 0;
      border-radius: 4px;
      // background-color: #0f0f0f50;
      background: linear-gradient(to top, #598ff1, #205ccb);

      transition: 0.5s cubic-bezier(0.785, 0.135, 0.15, 0.86);
      animation: 1s loading infinite;
    }

    &.loading {
      &::before {
        opacity: 1;
      }

      height: 5px;
      width: 20%;

      background-color: #00000050;

      transition: 1s cubic-bezier(0.785, 0.135, 0.15, 0.86);
    }

    position: absolute;
    width: 10px;
    height: 10px;

    align-self: center;

    overflow: hidden;
    transition: 0.5s cubic-bezier(0.785, 0.135, 0.15, 0.86);
    border-radius: 4px;
    background-color: #000000A0;
  }

  .primaryStyle {
    &.loading {

      opacity: 0;
      transform: scale(0);

      transition: 1s cubic-bezier(0.785, 0.135, 0.15, 0.86);
    }

    z-index: 1;

    opacity: 1;
    transform: scale(1);
    transition: .5s cubic-bezier(0.785, 0.135, 0.15, 0.86);
  }
}

.primaryStyle {

  &:hover,
  &:focus {
    color: #eee;
  }

  color: #fff;

  cursor: pointer;
  background: linear-gradient(to top, #598ff1, #205ccb);
}

.BaseMention {
  &.out {
    opacity: 0;
    transform: translate(-50%, 0) scale(1.2);
  }

  &-Footer {
    margin-top: 1rem;

    display: flex;
    justify-content: center;
  }

  &-Title {

    font-weight: 600;
  }

  &-Header {
    padding: 0 0.25rem;
  }

  &-Content {
    // padding: 1rem;

    // flex: 1;

    // overflow: auto;
  }

  position: absolute;
  display: flex;
  padding: 1rem;

  flex-direction: column;
  justify-content: space-between;

  left: 50%;
  top: 2%;

  width: 24rem;
  height: 10rem;

  border-radius: 0.5rem;
  background: #fff;

  overflow: hidden;
  transform: translate(-50%, 0%);
  transition: 0.5s cubic-bezier(0.785, 0.135, 0.15, 0.86);
  animation: MPopper 0.75s cubic-bezier(0.785, 0.135, 0.15, 0.86);
}

@keyframes MPopper {
  0% {
    opacity: 0;
    filter: blur(5px) saturate(180%);
    transform: translate(-50%, 0%) scale(1.25);
  }

  100% {
    opacity: 1;
    filter: blur(0px) saturate(100%);
    transform: translate(-50%, 0%) scale(1);
  }
}
</style>
