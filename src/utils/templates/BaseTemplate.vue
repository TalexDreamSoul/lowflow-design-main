<script setup lang="ts" name="BaseTemplate">
import { ref, onMounted } from 'vue'
import { Close } from '@element-plus/icons-vue'

const props = defineProps<{
  title: string,
  comp: any,
  close: Function
}>()

const compRef = ref()

function saveData() {
  const { saveData: save } = compRef.value

  const res = save()

  if (res) {
    props.close()
  }
}

onMounted(() => {
  console.log()
})

</script>

<template>
  <div class="BaseTemplate">
    <div class="BaseTemplate-Header">
      <p class="BaseTemplate-Title" v-text="title" />

      <el-icon @click="close" style="font-size: 20px">
        <Close />
      </el-icon>
    </div>

    <div class="BaseTemplate-Content">
      <component ref="compRef" :is="comp" />
    </div>

    <div class="BaseTemplate-Footer">
      <el-button @click="close" round>取消</el-button>
      <el-button @click="saveData" round class="primaryStyle">保存</el-button>
    </div>
  </div>
</template>

<style lang="scss">
.primaryStyle {
  &:hover {
    color: #eee;
  }

  color: #fff;

  cursor: pointer;
  background: linear-gradient(to top, #598ff1, #205ccb)
}

.BaseTemplate {
  &-Footer {
    margin-top: 1rem;

    display: flex;
    justify-content: flex-end;
  }

  &-Title {
    margin: .5rem;

    font-weight: 600;
  }

  &-Header {
    display: flex;
    padding: 0 .25rem;

    align-items: center;
    justify-content: space-between;
  }

  &-Content {
    padding: 1rem;

    flex: 1;

    overflow: auto;
  }

  position: absolute;
  display: flex;
  padding: 1rem;

  flex-direction: column;

  left: 50%;
  top: 50%;

  width: 40%;
  height: 75%;

  border-radius: 0.5rem;
  background: #fff;

  overflow: hidden;
  transform: translate(-50%, -50%);
}
</style>