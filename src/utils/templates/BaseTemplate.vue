<script setup lang="ts" name="BaseTemplate">
import { ElMessage } from "element-plus";
import { ref, onMounted } from "vue";
import { Close } from "@element-plus/icons-vue";
import { addMaterial,updateMaterial } from "~/api/index";
import { useVModel } from "@vueuse/core";

const props = defineProps<{
  title: string;
  comp: any;
  close: Function;
  data: any;
  type: any;
  success: Function;
}>();

const compRef = ref();
async function saveData() {
  const { saveData: save } = compRef.value;

  const res = save();

  let _res: any;
  // 根据传入类型判断
  switch (props.type) {
    case "update":
      _res = await updateMaterial(res);
      break;
    case "details":
     // cancelButtonText.value = "返回";
      break;
    default:
      _res = await addMaterial(res);
      break;
  }

  if (_res.data) {
    props.close();

    props.success(res);

    ElMessage.success({
      message: _res.message,
    });
  } else {
    ElMessage.error({
      message: _res.message,
    });
  }
}
</script>

<template>
  <div class="BaseTemplate" >
    <div class="BaseTemplate-Header">
      <p class="BaseTemplate-Title" v-text="title" />

      <el-icon @click="close as any" style="cursor: pointer;font-size: 20px">
        <Close />
      </el-icon>
    </div>

    <div class="BaseTemplate-Content" contenteditable="false" >
      <component :data="data" ref="compRef" :is="comp" :type="type"/>
    </div>

    <div class="BaseTemplate-Footer">
      <el-button @click="(close as any)" round>{{ type!=='details'?'取消':'返回' }}</el-button>
      <el-button @click="saveData" round class="primaryStyle" v-if="type!=='details'">保存</el-button>
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
  background: linear-gradient(to top, #598ff1, #205ccb);
}

.BaseTemplate {
  &-Footer {
    margin-top: 1rem;

    display: flex;
    justify-content: flex-end;
  }

  &-Title {
    margin: 0.5rem;

    font-weight: 600;
  }

  &-Header {
    display: flex;
    padding: 0 0.25rem;

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