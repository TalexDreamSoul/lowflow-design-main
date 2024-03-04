<script setup lang="ts" name="section-group">
import { ref, reactive } from "vue";
import { dictFilterTree as getDictFilterTree } from "~/api/index";
import TouchBlockGenre from "~/touch-flow/p/genre/TouchBlockGenre.vue";

const props = defineProps<{
  triggerRuleContent?: any,
}>()

console.log("sg", props)

const form = reactive({
  planB: false
})
const dict = ref<any>();

!(async () => {
  const res = await getDictFilterTree();

  if (res.data) {
    dict.value = res.data;
  }
})()

function addEventA() {
  props.triggerRuleContent.eventA.customEvent.conditions.push({
    conditions: [{}],
    logicalChar: "或"
  });
}

function addEventB() {
  props.triggerRuleContent.eventB.customEvent.conditions.push({
    conditions: [{}],
    logicalChar: "或"
  });
}
</script>

<template>
  <div>
    <el-form-item>

          <div class="pannel">
            <div class="toppannel">
              触发事件组A
            </div>
            <div class="garyblock">
              <el-text>在流程有效期内依次完成下列事件后</el-text>&nbsp;
              &nbsp;
              <el-text type="primary" style="cursor: pointer;" @click="addEventA">
                <el-icon size="14">
                  <CirclePlusFilled />
                </el-icon>
                添加事件
              </el-text>

            </div>

            <!-- props.p.triggerRuleContent.eventA.customEvent.conditions -->
            <TouchBlockGenre v-if="dict" :condition="triggerRuleContent.eventA.customEvent" :dict="dict" />

          </div>
        </el-form-item>

        <div class="underright" v-show="!form.planB" @click="form.planB = !form.planB">
          <el-icon size="14">
            <CirclePlusFilled />
          </el-icon> 添加事件组b

        </div>
        <el-form-item v-show="form.planB">
          <div class="pannel">

            <div class="toppannel" style="    display: flex;
            justify-content: space-between;">
              触发事件组B

              <el-text type="primary" style="cursor: pointer;" @click="form.planB = !form.planB">
                <el-icon size="14">
                  <Delete />
                </el-icon>
                删除事件
              </el-text>
            </div>
            <div class="garyblock" style="    display: flex;
            justify-content: space-between;">
              <div>
                <el-text>且在</el-text>&nbsp;
                <el-input placeholder="输入值" v-model="triggerRuleContent.delayedTime" type="number" style="width: 100px" />&nbsp;
                <el-select placeholder="选择单位" v-model="triggerRuleContent.delayedUnit" style="width: 150px">
                  <el-option value="month" label="月份">分钟</el-option>
                  <el-option value="week" label="周">小时</el-option>
                  <el-option value="day" label="天">天</el-option>
                </el-select>&nbsp;
                <el-text>后立即判断</el-text>
                &nbsp;
                <el-select placeholder="是否做过" v-model="triggerRuleContent.delayedAction" style="width: 150px">
                  <el-option value="=" label="月份">做过</el-option>
                  <el-option value="!=" label="周">未做过</el-option>
                </el-select>&nbsp;
              </div>
              <el-text type="primary" style="cursor: pointer;" @click="addEventB">
                <el-icon size="14">
                  <CirclePlusFilled />
                </el-icon>
                添加事件
              </el-text>
            </div>

            <TouchBlockGenre v-if="dict" :condition="triggerRuleContent.eventB.customEvent" :dict="dict" />
          </div>
        </el-form-item>
  </div>
</template>

<style lang="scss">
.flex-column {
  display: -webkit-inline-box !important;
  align-items: flex-start !important;
  flex-direction: column !important;
}

.pannel {
  width: 100%;
  min-height: 200px;
  //padding: 18px 15px;
  background-color: #f5f8fc;
}

.underright {
  background: #edeff4;
  border-radius: 4px 4px 0px 0px;
  font-size: 14px;
  font-weight: 500;
  color: #000000;
  padding: 12px 24px 12px 24px;
  cursor: pointer;
  color: #4078e0;
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.filter-filter-item__add {
  position: absolute;
  right: 12px;
}

:deep(.el-form--default.el-form--label-top .el-form-item .el-form-item__label) {
  margin-bottom: 8px;
  line-height: 22px;
  font-size: 16px;
  font-size: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.9);
  line-height: 24px;
}

.custom-radio-group {
  display: flex;
}

.custom-radio-button {
  cursor: pointer;
  padding: 4px 8px;
  margin-right: 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
  border: 1px solid #e5e5e5;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.custom-radio-button:hover {
  background-color: #f0f0f0;
}

.custom-radio-button.active {
  background-color: #4078e0;
  color: #fff;
}

.toppannel {
  background: #edeff4;
  border-radius: 4px 4px 0px 0px;
  font-size: 14px;
  font-weight: 500;
  color: #000000;
  padding: 12px 24px 12px 24px;
}

.garyblock {
  padding: 12px 24px 12px 24px;
}
</style>