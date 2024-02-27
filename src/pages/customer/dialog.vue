<template>
  <el-dialog
    class="pd-modal"
    destroy-on-close
    :close-on-click-modal="false"
    v-model="modalVisible"
    title="111"
    :width="946"
  >
    <HandAdd :drawer-type="DrawerType.Create" :form-values="{}" />
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
import { reactive, ref, defineExpose } from "vue";
import { PEOPLE_SOURCE, PEOPLE_SEX, BlackAddTypeEnum } from "~/constants";
import API from "~/api/customer";
import { checkStringEqual, debounce } from "~/utils/common";
import HandAdd from "./handAdd.vue";

enum DrawerType {
  Create = "create",
  Detail = "detail",
  Edit = "edit",
}

const modalVisible = ref(false);

const onSubmit = async () => {};
defineExpose({ modalVisible });
</script>
