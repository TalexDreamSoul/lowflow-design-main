<script setup lang="ts">
import BehaviorGroup from "../behavior/BehaviorGroup.vue";
import { ref, reactive, computed, inject } from "vue";
import { getBlackList } from "~/api/index";
import CustomAttr from "../behavior/CustomAttr.vue";
import CustomBehavior from "../behavior/CustomBehavior.vue";
import CustomBehaviorSequence from "../behavior/sequence/CustomBehaviorSequence.vue";
import { MarketingTouchEditDTO, CustomSearchDTO } from "../behavior/marketing";
import TouchEstimation from "~/touch-flow/page/TouchEstimation.vue";
import LogicalLine from "../behavior/LogicalLine.vue";
import StrategistTargetAttr from "~/touch-flow/page/StrategistTargetAttr.vue";
import { validateAES, validateCommonDays, validatePropValue } from "../../flow-utils";
import { ElMessage } from "element-plus";

const customRuleContent = reactive<CustomSearchDTO>({
  customAttr: {
    conditions: [
      {
        conditions: [
          // {}
        ],
        logicalChar: "或",
      },
    ],
    logicalChar: "或",
  },
  customEvent: {
    conditions: [
      {
        conditions: [
          // {}
        ],
        logicalChar: "或",
      },
    ],
    logicalChar: "或",
  },
  eventSequence: {
    conditions: [
      {
        conditions: [
          // {}
        ],
        logicalChar: "或",
      },
    ],
    logicalChar: "或",
  },
  logicalChar: "或",
  blackList: {
    _enable: "no",
    data: [],
  },
});

interface ICustomerAttrProp {
  p: MarketingTouchEditDTO;
  readonly?: boolean;
}

const props = defineProps<ICustomerAttrProp>();
const sizeForm = reactive({
  targetRuleContent: props.p?.targetRuleContent,
});

// 将props数据同步到本地数据 实现保存后才更新替换
Object.assign(customRuleContent, props.p.customRuleContent);
Object.assign(sizeForm, props.p);

function attrsAdd() {
  let attr = customRuleContent.customAttr!.conditions!;

  const obj = {
    conditions: [{ conditions: {} }],
    logicalChar: "或",
  };

  attr.push({
    conditions: [obj],
    logicalChar: "或",
  });
}

function behaviorAdd() {
  let attr = customRuleContent.customEvent!.conditions!;

  const obj = {
    conditions: [{ conditions: {} }],
    logicalChar: "或",
  };

  attr.push({
    conditions: [obj],
    logicalChar: "或",
  });
}

function sequenceAdd() {
  let attr = customRuleContent.eventSequence!.conditions!;

  const obj = {
    conditions: [{ conditions: [{}] }],
    logicalChar: "或",
  };

  attr.push({
    conditions: [obj],
    logicalChar: "或",
  });
}

function saveData(): boolean {
  if (!validateAES(customRuleContent)) {
    ElMessage({
      message: "请填写完整 客户属性，客户行为，行为序列 ！",
      type: "error",
    });

    return false;
  }

  // 验证黑名单是否填写完整
  if (customRuleContent.blackList._enable === "yes") {
    if (!validatePropValue(customRuleContent.blackList.data)) {
      ElMessage({
        message: "过滤黑名单必须选择内容！",
        type: "error",
      });

      return false;
    }
  }

  // 验证目标设置是否填写完整
  if (sizeForm.targetRuleContent?.targetDelayed.isDelayed) {
    if (
      !validateCommonDays(
        sizeForm.targetRuleContent.targetDelayed.delayedTime,
        sizeForm.targetRuleContent.targetDelayed.delayedUnit
      )
    ) {
      ElMessage({
        message: "目标设置延时总计不能超过30天！",
        type: "error",
      });

      return false;
    }
  }

  Object.assign(props.p, {
    customRuleContent,
    targetRuleContent: sizeForm.targetRuleContent,
  });

  return true;
}

type IRegSaveFunc = (regFunc: () => boolean) => void;
const regSaveFunc: IRegSaveFunc = inject("save")!;
regSaveFunc(saveData);

const blackList = ref();
!(async () => {
  const res = await getBlackList({});

  if (res.data) {
    blackList.value = res.data;
  }
})();
</script>

<template>
  <div>
    <el-form
      ref="form"
      :model="customRuleContent"
      label-width="auto"
      label-position="left"
    >
      <p class="MainTitle">受众客户为满足以下条件的客户（触发型非必选）</p>
      <el-text>若下列条件不添加，则受众客户默认为全部客户</el-text>
      <br />
      <br />

      <LogicalLine v-model="customRuleContent!.logicalOperator">
        <BehaviorGroup @add="attrsAdd" title="客户属性满足">
          <CustomAttr
            v-if="customRuleContent.customAttr?.conditions?.length"
            :readonly="readonly"
            :custom="customRuleContent.customAttr"
          />
        </BehaviorGroup>
        <BehaviorGroup @add="behaviorAdd" title="客户行为满足">
          <CustomBehavior
            v-if="customRuleContent.customEvent?.conditions?.length"
            :readonly="readonly"
            :custom="customRuleContent.customEvent"
          />
        </BehaviorGroup>
        <BehaviorGroup @add="sequenceAdd" title="行为序列满足">
          <CustomBehaviorSequence
            v-if="customRuleContent.eventSequence?.conditions?.length"
            :readonly="readonly"
            :custom="customRuleContent.eventSequence"
          />
        </BehaviorGroup>
      </LogicalLine>

      <TouchEstimation :readonly="readonly" :custom-rule-content="customRuleContent" />

      <StrategistTargetAttr :readonly="readonly" :size-form="sizeForm" />

      <div class="MainTitle">黑名单</div>

      <el-form-item label="过滤黑名单" label-class="custom-label">
        <el-select
          :disabled="readonly"
          v-model="customRuleContent.blackList._enable"
          style="width: 100px"
        >
          <el-option value="no" label="不过滤">不过滤</el-option>
          <el-option value="yes" label="过滤">过滤</el-option>
        </el-select>
        &nbsp;
        <el-select
          placeholder="请选择"
          v-model="customRuleContent.blackList.data"
          multiple
          :disabled="readonly"
          v-if="customRuleContent?.blackList?._enable === 'yes'"
          style="min-width: 100px"
        >
          <el-option
            v-for="item in blackList.records"
            :value="item.blacklistName"
            :label="item.blacklistName"
          >
            <span>{{ item.blacklistName }}</span>
            <!-- <p>{{ item.blacklistDesc }}</p> -->
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-form-item) {
  margin-right: 0;
  margin-bottom: 0;
}
</style>
