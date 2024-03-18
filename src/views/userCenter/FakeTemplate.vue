<template>
  <div v-if="modelValue" :class="{ show: modelValue }" class="fake-template">
    <div class="header">
      <div class="red-box">
        <span>{{ title }}</span>
      </div>
      <div class="title">Title</div>
    </div>
    <div class="content">
      <!-- 这里去跟你的data交互
      比如你可以给 AddressTemplate 去写一个v-model="address"
      这样你在下面保存的时候就能提交数据了 -->
      <!-- <component v-model="data" :is="component" class="component" /> -->
      <component :is="component" class="component" />
    </div>
    <div class="footer">
      <button @click="handleSave" class="save-btn">返回</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const props = defineProps<{
  title: {
    type: String,
    required: true
  },
  modelValue: {
    type: boolean,
    required: true
  },
  component: {
    type: any,
    required: true
  }
}>();

const data = ref()
const emits = defineEmits(['update'])

function handleSave() {
  emits('update', data)
}
</script>

<style scoped>
.fake-template {
  position: absolute;

  left: 0;
  top: 0;

  height: 100vh;
  width: 100vw;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-color: #f0f0f0;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.red-box {
  background-color: red;
  color: white;
  font-size: 18px;
  font-weight: bold;
  padding: 10px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.content {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.component {
  width: 100%;
  max-width: 600px;
  margin-bottom: 20px;
}

.footer {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.save-btn {
  background-color: #007bff;
  color: white;
  font-size: 16px;
  font-weight: bold;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}
</style>