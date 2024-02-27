<template>
  <el-dialog
    class="pd-modal"
    destroy-on-close
    :close-on-click-modal="false"
    v-model="modalVisible"
    title="请选择需要手动添加至黑名单的客户"
    :width="946"
  >
    <HandAdd ref="handAddRef" :drawer-type="DrawerType.Create" :form-values="{}" />
    <template #footer>
      <span class="dialog-footer">
        <el-button  round @click="modalVisible = false"
          >取消</el-button
        >
        <el-button
          @click.prevent="onSubmit"
          round
          type="primary"
          >保存</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, defineExpose, defineProps } from "vue";
import API from "~/api/customer";
import HandAdd from "./handAdd.vue";
import { checkStringEqual } from "~/utils/common";

const props = defineProps(["formValues"]);

const handAddRef = ref<any>();

enum DrawerType {
  Create = "create",
  Detail = "detail",
  Edit = "edit",
}

const modalVisible = ref(false);

const onSubmit = async () => {
  let customIds = handAddRef.value?.multipleSelection;
  if(customIds.length) {
    let res = await API.addCustomBlacklistRelation({
      blacklistId: props?.formValues?.id,
      customIds
    })
    if(checkStringEqual(res?.code, 0)) {
      setTimeout(() => {
        handAddRef.value?.getSelectData({ pageNum: 1, id: props?.formValues?.id })
      }, 100);
      modalVisible.value = false;
    }
  } else {
    modalVisible.value = false;
  }
};
defineExpose({ modalVisible });
</script>
