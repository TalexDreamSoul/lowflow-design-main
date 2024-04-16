<template>
  <el-drawer :destroy-on-close="true" :close-on-click-modal="false" :size="946" v-model="modalVisible"
    :with-header="false" class="pd-drawer">
    <div class="pd-drawer-header">高级筛选</div>
    <div class=" pd-drawer-content"  >
      <FilterGroup :outside="true" :custom-rule-content="customRuleContent" />
    </div>
    <div class="pd-drawer-footer">
      <el-button  @click="modalVisible = false"
        round>取消</el-button>
      <el-button   @click.prevent="onSubmit(formRef)" round
        type="primary">筛选</el-button>
    </div>
  </el-drawer>
</template>
<script lang="ts" setup>
import { reactive, ref, defineProps, defineExpose } from "vue";
import { BlackAddTypeEnum, BLACK_LIST_TYPE } from "~/constants";
import API from "~/api/customer";
import { ElMessage, FormInstance } from "element-plus";
import FilterGroup from "~/touch-flow/p/attr/condition/FilterGroup.vue";
import { CustomSearchDTO } from "~/touch-flow/touch-total";

const props = defineProps(["getData"]);

const customRuleContent = reactive<CustomSearchDTO>({
  customAttr: {
    conditions: [],
    logicalChar: "或",
  },
  customEvent: {
    conditions: [],
    logicalChar: "或",
  },
  eventSequence: {
    conditions: [],
    logicalChar: "或",
  },
  logicalChar: "或",
});

const formRef = ref<FormInstance>();

const modalVisible = ref(false);
const addType = ref(BlackAddTypeEnum.Manual);

const handleModal = async () => {
  addType.value = BlackAddTypeEnum.Manual;
  modalVisible.value = true;
};

const onSubmit = async (formEl: FormInstance | undefined) => {
  console.log( "submit", customRuleContent )

  try {
    await props?.getData?.({...customRuleContent});
      modalVisible.value = false;
  } catch (error) {
    console.error(error);
  }
};

defineExpose({ handleModal });
</script>