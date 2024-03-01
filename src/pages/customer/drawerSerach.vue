<template>
  <el-drawer :destroy-on-close="true" :close-on-click-modal="false" :size="946" v-model="modalVisible"
    :with-header="false" class="pd-drawer">
    <div class="pd-drawer-header">高级筛选</div>
    <div class=" pd-drawer-content"  >
      <LogicalLine v-model="customRuleContent.logicalChar">
        <BehaviorGroup @add="attrsAdd" title="客户属性满足">
          <CustomAttr :custom="customRuleContent.customAttr" />
        </BehaviorGroup>
        <BehaviorGroup @add="behaviorAdd" title="客户行为满足">
          <CustomBehavior :custom="customRuleContent.customEvent" />
        </BehaviorGroup>
        <BehaviorGroup @add="sequenceAdd" title="行为序列满足">
          <CustomBehaviorSequence :custom="customRuleContent.eventSequence" />
        </BehaviorGroup>
      </LogicalLine>
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
import LogicalLine from "../../touch-flow/p/behavior/LogicalLine.vue";
import { CustomSearchDTO } from "../../touch-flow/p/behavior/marketing";
import BehaviorGroup from "../../touch-flow/p/behavior/BehaviorGroup.vue";
import CustomAttr from "../../touch-flow/p/behavior/CustomAttr.vue";
import CustomBehavior from "../../touch-flow/p/behavior/CustomBehavior.vue";
import CustomBehaviorSequence from "../../touch-flow/p/behavior/sequence/CustomBehaviorSequence.vue";
import { reactive, ref, defineProps, defineExpose } from "vue";
import { BlackAddTypeEnum, BLACK_LIST_TYPE } from "~/constants";
import API from "~/api/customer";
import { ElMessage, FormInstance } from "element-plus";

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

function attrsAdd() {
  let attr = customRuleContent.customAttr!.conditions!;

  const obj = {
    conditions: [{ conditions: [] }],
    logicalChar: "或",
  };

  attr.push(obj);
}

function behaviorAdd() {
  let attr = customRuleContent.customEvent!.conditions!;

  const obj = {
    conditions: [{ conditions: [] }],
    logicalChar: "或",
  };

  attr.push(obj);
}

function sequenceAdd() {
  let attr = customRuleContent.eventSequence!.conditions!;

  const obj = {
    conditions: [{ conditions: [] }],
    logicalChar: "或",
  };

  attr.push(obj);
}

defineExpose({ handleModal });
</script>