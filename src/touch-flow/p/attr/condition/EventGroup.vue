<script setup lang="ts" name="EventGroup">
import BehaviorGroupPlus from "../../behavior/BehaviorGroupPlus.vue";
import { dictFilterTree as getDictFilterTree } from "~/api/index";
import TouchBlockGenre from "../../genre/TouchBlockGenre.vue";
import { CirclePlusFilled } from "@element-plus/icons-vue";
import { ref } from "vue";

const props = defineProps<{
  p: any;
  readonly?: boolean;
}>();

const dict = ref<any>();

function addEventA() {
  props.p.triggerRuleContent.eventA.customEvent.conditions[0].conditions.push({
    conditions: [],
    logicalChar: "或",
  });
  console.log(props.p)
}

function addEventB() {
  props.p.triggerRuleContent.eventB.customEvent.conditions[0].conditions.push({
    conditions: [],
    logicalChar: "或",
  });
}

!(async () => {
  console.error('demo')

  const res: any = await getDictFilterTree(
    {
      pageNum: "1",
      pageSize: "999"
    }
  );

  if (res.data) {
    dict.value = res.data;
  }
})();
</script>

<template>
  <div class="EventGroup">
    <BehaviorGroupPlus :readonly="readonly" :default-expand="true" :hideToggleButton="true" title="触发时间组A"
      color="#F5F7FA">
      <el-text>在流程有效期内依次完成下列事件后</el-text>&nbsp; &nbsp;
      <el-text v-if="!readonly" type="primary" style="cursor: pointer" @click="addEventA">
        <el-icon size="14">
          <CirclePlusFilled />
        </el-icon>
        添加事件
      </el-text>

      <TouchBlockGenre :readonly="readonly" v-if="dict" :condition="p.triggerRuleContent.eventA.customEvent"
        :dict="dict" />
    </BehaviorGroupPlus>

    <BehaviorGroupPlus :readonly="readonly" :default-expand="p.triggerRuleContent.delayed.isDelayed" title="触发时间组B"
      color="#F5F7FA">
      <template #title>
        <el-text style="color: #4078e0; cursor: pointer" v-if="!p.triggerRuleContent.delayed.isDelayed" @click="
      p.triggerRuleContent.delayed.isDelayed = !p.triggerRuleContent.delayed
        .isDelayed
      ">
          <el-icon size="14">
            <CirclePlusFilled />
          </el-icon>
          添加事件组B
        </el-text>
        <span v-else>触发事件组B</span>
      </template>
      <template #toggle>
        <el-text style="cursor: pointer" type="primary" v-if="!readonly && p.triggerRuleContent.delayed.isDelayed"
          @click="p.triggerRuleContent.delayed.isDelayed = false">
          <el-icon size="14">
            <Delete />
          </el-icon>
          删除事件组B
        </el-text>
        <span v-else />
      </template>

      <el-form-item v-if="p.triggerRuleContent.delayed.isDelayed">
        <div class="EventGroup-SubEvent">
          <el-text>且在</el-text>&nbsp;
          <el-input-number :disabled="readonly" :min="1" placeholder="输入值"
            v-model="p.triggerRuleContent.delayed.delayedTime" style="width: 100px" />
          <el-select :disabled="readonly" placeholder="选择单位" v-model="p.triggerRuleContent.delayed.delayedUnit"
            style="width: 100px">
            <el-option value="minute" label="分钟">分钟</el-option>
            <el-option value="hour" label="小时">小时</el-option>
            <el-option value="day" label="天">天</el-option>
          </el-select>
          <el-text>后立即判断</el-text>
          <el-select :disabled="readonly" placeholder="是否做过" v-model="p.triggerRuleContent.delayed.delayedAction"
            style="width: 150px">
            <el-option value="=" label="做过">做过</el-option>
            <el-option value="!=" label="未做过">未做过</el-option>
          </el-select>

          <el-text v-if="!readonly" type="primary" style="cursor: pointer" @click="addEventB">
            <el-icon size="14">
              <CirclePlusFilled />
            </el-icon>
            添加事件
          </el-text>
        </div>

        <TouchBlockGenre v-if="dict" :condition="p.triggerRuleContent.eventB.customEvent" :dict="dict" />
      </el-form-item>
    </BehaviorGroupPlus>
  </div>
</template>

<style lang="scss">
.EventGroup {
  &-SubEvent {
    display: flex;

    gap: 0.5rem;
    align-items: center;
    justify-content: space-between;
  }
}

// .EventGroup .BehaviorGroupPlus-Main {
//   padding: 0;
// }</style>
