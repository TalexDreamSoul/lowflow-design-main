<script setup lang="ts" name="AttrScroller">
import { ref, onBeforeUnmount, onMounted } from 'vue'
import { useVModel } from '@vueuse/core'
import { getqryMarketingTouch } from '~/api/index'

const props = defineProps<{
  modelValue: string,
  readonly?: boolean,
  outside?: boolean,
}>()

const emits = defineEmits(['update:modelValue'])

const model = useVModel(props, 'modelValue', emits)
const input = ref("")

const data = ref<any[]>([])
const loader = ref()
const loading = ref(false)
const end = ref(false)
const num = ref(0)

async function handleLoad() {
  if (end.value || loading.value) return
  loading.value = true

  const len = data.value?.length || 0
  let _num = Math.round((len / 10) + 1);

  if (num.value === _num)
    _num += 1;

  num.value = _num

  const res: any = await getqryMarketingTouch({
    pageNum: _num,
    pageSize: 10,
  })

  const records = res.data.records

  if (!records.length) end.value = true

  data.value.push(...records)

  loading.value = false
}

function observe() {
  let timer: any

  // 监听每一次 loader 显示的时候调用方法 handleLoad
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        clearTimeout(timer)
        timer = setTimeout(() => handleLoad(), 200)
      }
    })
  })

  observer.observe(loader.value)

  onBeforeUnmount(() => {
    observer.disconnect()
  })
}

function handleClick(item: any) {
  input.value = item.touchName
  model.value = item.touchCode || item.id
}

function handleCurrentClick() {
  // @ts-ignore force exist
  handleClick({ touchName: "当前流程", touchCode: window.$flow.basic.touchCode })
}

onMounted(observe)

handleLoad()
</script>

<template>
  <div class="AttrScroller">
    <el-dropdown trigger="click">
      <span class="el-dropdown-link">
        <el-input v-model="input" placeholder="请选择"  :disabled="readonly" >
          <template #suffix>
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </template>
        </el-input>
      </span>
      <template #dropdown>
        <div class="AttrScroller-dropdown">
          <el-dropdown-item @click="handleCurrentClick()" :disabled="readonly"  v-if="!outside">当前流程</el-dropdown-item>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleClick(item)" :disabled="readonly" v-for="(item) in data" :key="item.id">{{
          item.touchName
        }}</el-dropdown-item>
          </el-dropdown-menu>
          <span v-if="!end" ref="loader">
            <el-dropdown-item style="text-align: center">正在加载...</el-dropdown-item>
          </span>
        </div>
      </template>
    </el-dropdown>
  </div>
</template>

<style lang="scss" scoped>
.AttrScroller {
  .el-dropdown-link {
    .el-input {
      pointer-events: none;
    }

    cursor: pointer;
  }

  &-dropdown {
    min-width: 200px;
    min-height: 20px;
    max-height: 16rem;

    overflow-y: auto;
  }

  display: flex;

  width: 180px;
}
</style>