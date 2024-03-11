<template>
  <el-drawer :destroy-on-close="true" :close-on-click-modal="false" :size="946" v-model="modalVisible"
    :with-header="false" class="pd-drawer">
    <div class="pd-drawer-header">误差详情</div>
    <div class=" pd-drawer-content"  >

    </div>
    <div class="pd-drawer-footer">
      <el-button  @click="modalVisible = false"
        round>取消</el-button>
      <el-button   @click.prevent="onSubmit(formRef)" round
        type="primary">保存</el-button>
    </div>
  </el-drawer>
</template>
<script lang="ts" setup>
import { reactive, ref, defineProps, defineExpose } from "vue";
import { ElMessage, FormInstance } from "element-plus";

const props = defineProps(["getData"]);


const formRef = ref<FormInstance>();

const modalVisible = ref(false);

const handleModal = async () => {
  modalVisible.value = true;
};

const onSubmit = async (formEl: FormInstance | undefined) => {
  console.log( "submit",  )


};

defineExpose({ handleModal });
</script>