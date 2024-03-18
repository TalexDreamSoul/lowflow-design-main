<template>
  <el-drawer :destroy-on-close="true" :close-on-click-modal="false" :size="946" v-model="modalVisible"
    :with-header="false" class="pd-drawer">
    <div class="pd-drawer-header">误差详情</div>
    <div class=" pd-drawer-content">
      <el-table>
        <el-table-column label="序号" type="index" width="50" />
      </el-table>
    </div>
    <div class="pd-drawer-footer">
      <el-button @click="modalVisible = false" round>取消</el-button>
      <el-button @click.prevent="onSubmit(formRef)" round type="primary">保存</el-button>
    </div>
  </el-drawer>
</template>
<script lang="ts" setup>
import { reactive, ref, defineProps, defineExpose } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { getQryNqList } from '~/api/index'

const props = defineProps(["getData"]);

const formRef = ref<FormInstance>();

const data = ref()
const modalVisible = ref(false);

const handleModal = async (data: any) => {
  modalVisible.value = true;

  console.log("modal", data)

  const res = await getQryNqList({

  })
};

const onSubmit = async (formEl: FormInstance | undefined) => {
  console.log("submit",)


};

defineExpose({ handleModal });
</script>