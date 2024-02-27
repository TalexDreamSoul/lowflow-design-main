<script setup lang="ts">
import { onMounted, ref, nextTick } from "vue";
import TargetContent from "./TargetContent.vue";
import { dictFilterTree as getDictFilterTree } from "~/api/index";
const props = defineProps<{
  target: any;
  readonly?: boolean
}>();

const dict = ref<any>()

onMounted(async () => {
  const res = await getDictFilterTree()

  if (res.data) {
    dict.value = res.data;
  }

  let arr = props.target.list;
  if (arr?.length) return;

  arr = props.target.list = [{}];
});

function addTarget() {
  let arr = (props.target.list = props.target.list || []);

  arr.push({})

  const ind = arr.length - 1;
  const id = `touch-target-${ind}`

  nextTick(() => {

    const el = document.getElementById(id)

    el!.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

  })
}
</script>

<template>
  <div class="Basic-Block">
    <p class="Basic-Block-Head">
      <span>目标设置</span>
      <el-switch :disabled="readonly" inline-prompt v-model="target.enable" style="--el-switch-on-color: #4078e0" />
      &nbsp;&nbsp;&nbsp;
      <el-button v-if="target.enable" :disabled="readonly" @click="addTarget" type="primary" text plain
        style="color: #4078e0">
        <el-icon>
          <CirclePlusFilled />
        </el-icon>
        &nbsp;筛选目标
      </el-button>
    </p>
    <div :class="{ disabled: !target.enable }" class="Basic-Block-Content" v-if="target.enable || readonly">
      <div :id="`touch-target-${index}`" v-for="(item, index) in target.list" :key="item.id" class="Target-Block">
        <TargetContent :readonly="readonly" :index="index" :target="item" :dict="dict" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(div.Basic-Block-Content) {
  padding: 0;
  background-color: unset;

  user-select: none;
}
</style>
