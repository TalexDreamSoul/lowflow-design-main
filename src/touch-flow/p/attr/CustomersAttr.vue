<script setup lang="ts">
import { ref, reactive, computed, inject, unref } from "vue";
import { getBlackList } from "~/api/index";
import { MarketingTouchEditDTO } from "../behavior/marketing";
import { CustomSearchDTO } from "../../touch-total";
import TouchEstimation from "~/touch-flow/page/TouchEstimation.vue";
import StrategistTargetAttr from "~/touch-flow/page/StrategistTargetAttr.vue";
import { validateAES, validateCommonDays, validatePropValue } from "../../flow-utils";
import { ElMessage } from "element-plus";
import FilterGroup from "./condition/FilterGroup.vue";

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

const blackList = reactive<{
  _enable: "no" | "yes";
  data: Array<any>;
}>({
  _enable: "no",
  data: [],
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
Object.assign(blackList, {
  _enable: props.p.blacklist?.data?.length ? "yes" : "no",
  data: props.p.blacklist?.data || [],
});

function saveData(): boolean {
  if (!validateAES(customRuleContent, true)) {
    ElMessage({
      message: "请填写完整 客户属性，客户行为，行为序列 ！",
      type: "error",
    });

    return false;
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

  // 验证黑名单是否填写完整
  if (blackList._enable === "yes") {
    if (!validatePropValue(blackList.data)) {
      ElMessage({
        message: "过滤黑名单必须选择内容！",
        type: "error",
      });

      return false;
    }
  } else {
    Object.assign(props.p, {
      blackList: {
        data: blackList.data,
      },
    });
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

const blackListFields = ref();
!(async () => {
  const res = await getBlackList({});

  if (res.data) {
    blackListFields.value = res.data;
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

      <FilterGroup :readonly="readonly" :custom-rule-content="customRuleContent" />

      <TouchEstimation :readonly="readonly" :custom-rule-content="customRuleContent" />

      <StrategistTargetAttr :readonly="readonly" :size-form="sizeForm" />

      <div class="MainTitle">黑名单</div>

      <el-form-item label="过滤黑名单" label-class="custom-label">
        <el-select :disabled="readonly" v-model="blackList._enable" style="width: 100px">
          <el-option value="no" label="不过滤">不过滤</el-option>
          <el-option value="yes" label="过滤">过滤</el-option>
        </el-select>
        &nbsp;
        <el-select
          placeholder="请选择"
          v-model="blackList.data"
          multiple
          :disabled="readonly"
          v-if="blackList?._enable === 'yes'"
          style="min-width: 100px"
        >
          <el-option
            v-for="item in blackListFields.records"
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
