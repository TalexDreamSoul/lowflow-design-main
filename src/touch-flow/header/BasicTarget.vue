<script setup lang="ts">
import { onMounted, ref, nextTick } from "vue";
import TargetContent from "./TargetContent.vue";
import { dictFilterTree as getDictFilterTree } from "~/api/index";
import { IHeaderTarget } from "../flow-types";

interface ITargetProp {
  target: IHeaderTarget;
  readonly?: boolean;
  expand: boolean;
}

const props = defineProps<ITargetProp>();

if (!props.readonly && !props.target.targetRuleContent.data.length) {
  addTarget();
}

const dict = ref<any>();

onMounted(async () => {
  const res = await getDictFilterTree();

  if (res.data) {
    dict.value = res.data;
  }
});

function addTarget() {
  let arr = (props.target.targetRuleContent.data =
    props.target.targetRuleContent.data || []);

  arr.push({
    targetDelayed: {
      delayedType: "",
      delayedAction: "",
      delayedTime: 0,
      delayedUnit: "day",
      isDelayed: false,
    },
    targetRuleContent: {
      customEvent: {
        conditions: [
          {
            conditions: [
              {
                action: "",
                conditions: {
                  conditions: [],
                  logicalChar: "或",
                },
                eventCode: "",
                eventName: "",
              },
            ],
            logicalChar: "或",
          },
        ],
        logicalChar: "或",
      },
      logicalChar: "或",
    },
  });

  const ind = arr.length - 1;
  const id = `touch-target-${ind}`;

  nextTick(() => {
    const el = document.getElementById(id);

    el!.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  });
}
</script>

<template>
  <el-form-item class="Basic-Block transition-item" :class="{ expand }">
    <template #label>
      <div class="Basic-Block-Head">
        <label class="el-form-item__label">目标设置</label>
        <el-switch
          :disabled="readonly"
          inline-prompt
          v-model="target.enable"
          style="margin-top: -4px; --el-switch-on-color: #4078e0"
        />
        <el-button
          :class="{ display: target.enable }"
          :disabled="readonly || target.targetRuleContent.data.length > 1"
          @click="addTarget"
          type="primary"
          text
          plain
          style="color: #4078e0"
        >
          <el-icon>
            <CirclePlusFilled />
          </el-icon>
          &nbsp;筛选目标
        </el-button>
      </div>
    </template>
    <div class="Basic-Block-Content" v-show="target.enable">
      <div
        :id="`touch-target-${index}`"
        v-for="(item, index) in target.targetRuleContent.data"
        :key="index"
        class="Target-Block"
      >
        <TargetContent @del="() => target.targetRuleContent.data.splice(index, 1)" :readonly="readonly" :index="index" :target="item" :dict="dict" />
      </div>
    </div>
  </el-form-item>
</template>

<style lang="scss" scoped>
:deep(.el-button) {
  &.display {
    opacity: 1;
    pointer-events: all;
    transform: translateX(0);
  }

  margin-top: -4px;
  margin-left: 4px;

  opacity: 0;
  pointer-events: none;
  transform: translateX(5%);
  transition: all 0.3s;
}

:deep(.el-form-item__label) {
  z-index: 1;
  position: sticky;

  top: 0;

  background-color: #ffffff80;
  backdrop-filter: saturate(180%) blur(18px);
}

.Basic-Block {
  &-Content {
    width: calc(100% - 30px);

    overflow: hidden;
    transition: 0.25s;
    background-color: transparent !important;
  }

  :deep(.el-form-item) {
    margin: 0 !important;
  }

  --t-delay: 0.3s;
}
</style>
