<script setup lang="ts" name="BaseTemplate">
import { ElMessage } from "element-plus";
import { ref, onMounted } from "vue";
import { Close } from "@element-plus/icons-vue";
import { addMaterial, updateMaterial } from "~/api/index";
import { useVModel } from "@vueuse/core";
import { validatePropValue } from "~/touch-flow/flow-utils";

const props = defineProps<{
  title: string;
  comp: any;
  close: Function;
  data: any;
  type: any;
  success: Function;
  readonly?: boolean;
}>();

const out = ref(false);
const compRef = ref();
async function saveData() {
  const { saveData: save } = compRef.value;

  const res = save();

  function _(key: string, val: any) {
    if (Array.isArray(val)) {
      console.log("123 array validate", key, val);

      for (let variable of val) {
        if (variable.hasOwnProperty('field')) {
          if (!validatePropValue(variable.field)) return false
          if (!variable.fieldName && !variable.labelName) return false

          if (!variable.variables?.length) {
            return false
          }
        }
      }
      // console.log("vd ___", key, val)
    }

    return true;
  }

  // 获得 res 中每一个key 判断是否为空
  console.log(res);
  if (
    !validatePropValue(res, {
      ignores: {
        variables: {
          validate: _,
        },
        titleVariables: {
          validate: _,
        },
        znxContentVariables: {
          validate: _,
        },
        znxTitleVariables: {
          validate: _,
        },
        contentVariables: {
          validate: _,
        },
      },
    })
  ) {
    return ElMessage.error({
      message: "请完整填写信息！",
    });
  }

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

function destroy() {
  out.value = true;

  setTimeout(props.close, 500);
}
</script>

<template>
  <div class="BaseTemplate" :class="{ out }">
    <div class="BaseTemplate-Header">
      <p class="BaseTemplate-Title" v-text="title" />

      <el-icon @click="destroy" style="cursor: pointer; font-size: 20px">
        <Close />
      </el-icon>
    </div>

    <div class="BaseTemplate-Content" contenteditable="false">
      <component
        :readonly="readonly"
        :data="data"
        ref="compRef"
        :is="comp"
        :type="type"
      />
    </div>

    <div class="BaseTemplate-Footer">
      <el-button @click="destroy" round>{{
        type !== "details" ? "取消" : "返回"
      }}</el-button>
      <el-button @click="saveData" round class="primaryStyle" v-if="type !== 'details'"
        >保存</el-button
      >
    </div>
  </div>
</template>

<style lang="scss">
.primaryStyle {
  &:hover, &:focus {
    color: #eee;
  }

  color: #fff;

  cursor: pointer;
  background: linear-gradient(to top, #598ff1, #205ccb);
}

.BaseTemplate {
  &.out {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.2);
  }

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
  transition: 0.5s cubic-bezier(0.785, 0.135, 0.15, 0.86);
  animation: Popper 0.5s cubic-bezier(0.785, 0.135, 0.15, 0.86);
}

.Popper-outer {
  animation: Popper-outer 0.55s forwards cubic-bezier(0.785, 0.135, 0.15, 0.86);
}

.Popper-outer-reverse {
  animation-direction: reverse;
}

@keyframes Popper-outer {
  from {
    opacity: 1;
    transform: scale(1);
  }

  to {
    opacity: 0.75;
    transform: scale(1.25);
  }
}

@keyframes Popper {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.25);
  }

  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
</style>
