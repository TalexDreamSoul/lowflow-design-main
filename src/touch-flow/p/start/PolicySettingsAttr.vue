<script setup lang="ts">
import { inject, ref, reactive, watchEffect } from "vue";
import { ElMessage } from "element-plus";
import { randomStr } from "~/utils/common";
import { getmarketingTouchEstimate } from "~/api";
import BehaviorGroup from "../behavior/BehaviorGroup.vue";
import CustomAttr from "../behavior/CustomAttr.vue";
import CustomBehavior from "../behavior/CustomBehavior.vue";
import CustomBehaviorSequence from "../behavior/sequence/CustomBehaviorSequence.vue";
import LogicalLine from "../behavior/LogicalLine.vue";
import BehaviorGroupPlus from "../behavior/BehaviorGroupPlus.vue";
import EventBehavior from "../behavior/EventBehavior.vue";
import NewLabel from '../../label/NewLabel.vue'
import { markRaw } from "vue";
import TouchSettings from "../touch/TouchSettings.vue";

const origin = {
  nodeId: "",
  nodeType: "strategy",
  nodeName: "test",
  value1: false,
  isDelayed: false,
  selectedType: "day",
  delayedAction: "day",
  cascaderLabel: "sms",
  do: false,
  num: 1,
  diversionType: 'noDiversion',
  touchTemplateContent: {

  },
  nodeDelayed: {
    delayedAction: '',
    delayedTime: 0,
    delayedUnit: '',
    isDelayed: false
  },
  customRuleContent: {
    customAttr: {
      conditions: [

      ],
      logicalChar: '或'
    },
    customEvent: {
      conditions: [

      ],
      logicalChar: '或'
    },
    eventSequence: {
      conditions: [

      ],
      logicalChar: '或'
    },
    logicalChar: '或'
  },
  eventRuleContent: {
    customEvent: {
      conditions: [
        {
          conditions: [{}]
        }
      ],
      logicalChar: '或'
    },
    logicalChar: '或'
  },
  labelContent: {
    labelId: -1,
    labelName: '',
    labelValue: []
  }
};

const marketingTouchNode = ref({
  appPushCount: 0,
  digitalCount: 0,
  outboundCount: 0,
  smsCount: 0,
  total: 0,
  znxCount: 0,
});

const props = defineProps<{
  p: any;
  new?: boolean
}>();

const touchSettingsRef = ref()
const sizeForm = reactive<typeof origin>(origin);

console.log("here", sizeForm, props.p, props.new)

watchEffect(() => {
  const { nodeType, nodeId } = props.p

  if (props.new || nodeType !== 'strategy') return

  if (nodeId) {
    Object.assign(sizeForm, props.p);

    sizeForm.nodeId = nodeId;
  }
})

function saveData() {
  if (!sizeForm.nodeName) {
    ElMessage.warning({
      message: "请输入策略名称",
    });

    return false;
  }

  touchSettingsRef.value.updateData()

  const _: any = { nodeId: "", children: [] };
  Object.assign(_, sizeForm)

  Object.defineProperty(_, 'father', {
    value: markRaw(props.p),
    enumerable: false
  })

  // 修改 Modify Edit
  if (sizeForm.nodeId === _.nodeId && sizeForm.nodeId.length) {

    Object.assign(props.p, _)

  } else {

    const arr = [...props.p.children];

    while (arr.length) {
      const item = arr.shift();

      if (item.nodeName === _.nodeName) {
        ElMessage.warning({
          message: "策略名称重复",
        });

        return false;
      }

    }

    _.nodeId = randomStr(12)

    props.p.children.push(_);

  }

  return true;
}

type IRegSaveFunc = (regFunc: () => boolean) => void;
const regSaveFunc: IRegSaveFunc = inject("save")!;
regSaveFunc(saveData);

const estimation = async () => {
  // 请求示例
  let data = { ...sizeForm.customRuleContent };
  let res = await getmarketingTouchEstimate(JSON.stringify(data));
  res = {
    data: {
      total: 1000,
      appPushCount: 500,
      znxCount: 120,
      digitalCount: 800,
      outboundCount: 200,
      smsCount: 499,
    },
    message: "交易成功",
    code: "0",
  };
  marketingTouchNode.value = res.data;
  console.log("Mounted", res);
};

function attrsAdd() {
  let attr: any = sizeForm.customRuleContent!.customAttr!.conditions! = (sizeForm.customRuleContent!.customAttr!.conditions! || []);

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
  let attr: any = sizeForm.customRuleContent!.customEvent!.conditions! = (sizeForm.customRuleContent!.customEvent!.conditions! || []);

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
  let attr: any = sizeForm.customRuleContent!.eventSequence!.conditions! = (sizeForm.customRuleContent!.eventSequence!.conditions! || []);

  const obj = {
    conditions: [{ conditions: [{}] }],
    logicalChar: "或",
  };

  attr.push({
    conditions: [obj],
    logicalChar: "或",
  });
}
</script>

<template>
  <div>
    <el-form ref="form" :model="sizeForm" label-width="auto" label-position="left">
      <el-form-item label="选择策略器名称：">
        <el-input v-model="sizeForm.nodeName" placeholder="填写名称" />
      </el-form-item>
      <el-form-item label="分流类型：">
        <el-radio-group v-model="sizeForm.diversionType">
          <el-radio label="noDiversion">不分流</el-radio>
          <el-radio label="attr">按属性用户行为分流</el-radio>
          <el-radio label="event">按触发事件分流</el-radio>
        </el-radio-group>
      </el-form-item>

      <BehaviorGroupPlus title="用户属性行为分流" color="#333333" v-if="sizeForm.diversionType === 'attr'">
        <div class="titleCondition">进入该策略期的用户需要满足以下条件：</div>
        <el-form-item label="">
          <div class="pannel">
            <LogicalLine v-model="sizeForm.customRuleContent.logicalChar">
              <BehaviorGroup @add="attrsAdd" title="客户属性满足">
                <CustomAttr :custom="sizeForm.customRuleContent!.customAttr" />
              </BehaviorGroup>
              <BehaviorGroup @add="behaviorAdd" title="客户行为满足">
                <CustomBehavior :custom="sizeForm.customRuleContent!.customEvent" />
              </BehaviorGroup>
              <BehaviorGroup @add="sequenceAdd" title="行为序列满足">
                <CustomBehaviorSequence :custom="sizeForm.customRuleContent!.eventSequence" />
              </BehaviorGroup>
            </LogicalLine>
          </div>
        </el-form-item>
      </BehaviorGroupPlus>

      <BehaviorGroupPlus title="触发事件分流" color="#333333" v-if="sizeForm.diversionType === 'event'">
        <div class="flex-column titleCondition">
          <div>
            进入该策略器的客户需要满足以下条件：在&nbsp;&nbsp;
          </div>
          <el-input v-model="sizeForm.num" type="number" style="width: 100px" />&nbsp;
          <el-select v-model="sizeForm.selectedType" style="width: 100px">
            <el-option value="month" label="月份">分钟</el-option>
            <el-option value="week" label="周">小时</el-option>
            <el-option value="day" label="天">天</el-option>
          </el-select>&nbsp;
          <div>后判断客户
            <el-select v-model="sizeForm.do" style="width: 100px">
              <el-option :value="true" label="做过">做过</el-option>
              <el-option :value="false" label="没做过">没做过</el-option>
            </el-select>
          </div>

        </div>
        <el-form-item label="">
          <div class="pannel">
            <!-- <LogicalLine v-model="sizeForm.eventRuleContent.logicalChar"> -->
            <EventBehavior :custom="sizeForm.eventRuleContent!.customEvent" />
            <!-- </LogicalLine> -->
          </div>
        </el-form-item>
      </BehaviorGroupPlus>

      <BehaviorGroupPlus title="延迟设置" color="#62C943">
        &nbsp;
        <el-select v-model="sizeForm.nodeDelayed.isDelayed" style="width: 100px">
          <el-option :value="true" label="延迟">延迟</el-option>
          <el-option :value="false" label="不延迟">不延迟</el-option> </el-select>&nbsp;
        <template v-if="sizeForm.nodeDelayed.isDelayed">
          <el-input v-model="sizeForm.nodeDelayed.delayedTime" type="number" style="width: 100px" />&nbsp;
          <el-select placeholder="请选择" v-model="sizeForm.nodeDelayed.delayedUnit" style="width: 100px">
            <el-option value="month" label="月份">分钟</el-option>
            <el-option value="week" label="周">小时</el-option>
            <el-option value="day" label="天">天</el-option> </el-select>&nbsp; 针对符合该装置策略条件的客户 &nbsp;
          <el-select v-model="sizeForm.nodeDelayed.delayedAction" placeholder="请选择" style="width: 150px">
            <el-option value="touch" label="发送触达">发送触达</el-option>
            <el-option value="label" label="打上标签">打上标签</el-option>
            <el-option value="nothing" label="不执行动作">不执行动作</el-option>
            <el-option value="touchAndLabel" label="发送触达并打上标签">发送触达并打上标签</el-option>
          </el-select>
        </template>
      </BehaviorGroupPlus>

      <BehaviorGroupPlus title="触达设置" color="#FFD561">
        <TouchSettings ref="touchSettingsRef" :touch="sizeForm.touchTemplateContent" />
      </BehaviorGroupPlus>

      <BehaviorGroupPlus
        v-if="sizeForm.nodeDelayed.isDelayed && String(sizeForm.nodeDelayed.delayedAction).toLocaleLowerCase().indexOf('label') !== -1"
        title="标签设置" color="#277AE7">
        <NewLabel :p="sizeForm" />
      </BehaviorGroupPlus>

      <div class="BlockBackground">
        <div class="BlockBackground-Under">
          <div class="yugu_flex">
            <div class="title">预估触达客户 &nbsp;</div>
            <el-button @click="estimation" class="buttonyugu" round>立即预估</el-button>
          </div>
          <div class="flexyugu">
            <div class="grayblockfirst">
              <div class="topName">预估受众客户总数</div>
              <div v-if="marketingTouchNode.total != undefined">
                {{ marketingTouchNode.total }}
              </div>
              <div style="color: #ff5050" v-else>无法预估数据</div>
            </div>
            <div class="grayblock">
              <div class="innerblock">
                <div>
                  <div class="topName">APP Push</div>
                  <div>
                    {{
                      marketingTouchNode.appPushCount != undefined
                      ? marketingTouchNode.appPushCount
                      : "-"
                    }}
                  </div>
                </div>
              </div>
              <div class="innerblock">
                <div>
                  <div class="topName">APP内部</div>
                  <div>
                    {{
                      marketingTouchNode.znxCount != undefined
                      ? marketingTouchNode.znxCount
                      : "-"
                    }}
                  </div>
                </div>
              </div>
              <div class="innerblock">
                <div>
                  <div class="topName">企业微信</div>
                  <div>
                    {{
                      marketingTouchNode.digitalCount != undefined
                      ? marketingTouchNode.digitalCount
                      : "-"
                    }}
                  </div>
                </div>
              </div>
              <div class="innerblock">
                <div>
                  <div class="topName">智能外呼</div>
                  <div>
                    {{
                      marketingTouchNode.outboundCount != undefined
                      ? marketingTouchNode.outboundCount
                      : "-"
                    }}
                  </div>
                </div>
              </div>
              <div class="innerblock">
                <div>
                  <div class="topName">手机短信</div>
                  <div>
                    {{
                      marketingTouchNode.smsCount != undefined
                      ? marketingTouchNode.smsCount
                      : "-"
                    }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="yugu_flex">
            <div class="title">策略器目标设置 &nbsp;</div>
            <el-switch v-model="sizeForm.value1" />
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<style lang="scss">
li:has(.template-option):has(.template-desc) {

  height: 50px;
}

.template-desc {
  position: relative;
  margin-top: -15px;
  display: block;

  color: #000;
  opacity: .4;

  max-width: 100px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>

<style scoped lang="scss">
.flex-column {
  display: -webkit-inline-box !important;
  align-items: flex-start !important;
  flex-direction: column !important;
}

.titleCondition {
  color: #666;
  font-size: 14px;
  margin-top: 24px;
}

.pannel {
  width: 100%;
  min-height: 200px;
  //padding: 0 15px;
  //background-color: #f5f8fc;
}

.underright {
  width: 100%;
  height: 12px;
}

.filter-filter-item__add {
  position: absolute;
  right: 12px;
}

.flex-column {
  display: -webkit-inline-box !important;
  align-items: flex-start !important;
  flex-direction: column !important;
}

.pannel {
  width: 100%;
  min-height: 200px;
}

.underright {
  width: 100%;
  height: 12px;
}

:deep(.el-form-item) {
  margin-right: 0;
  margin-bottom: 0;
}

.BlockBackground {
  font-size: 14px;
  border-radius: var(--el-border-radius-base);
  margin-top: 24px;

  .title_set {
    padding: 8px 12px;
    background: #eaeff3;
    border-left: 4px solid #62c943;
    display: flex;
    justify-content: space-between;
  }

  .bg001 {
    border-left: 4px solid #333;
  }

  .pg2 {
    border-left: 4px solid #A053CD;
  }

  .pg3 {
    border-left: 4px solid #277ae7;
  }

  .BlockBackground-Under {
    padding: 12px;
    background: #f7f8fa;
  }
}

.yugu_flex {
  display: flex;
  align-items: center;
  min-height: 48px;
  margin-bottom: 8px;

  .title {
    margin-left: 8px;
    font-size: 14px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.9);
  }

  .buttonyugu {
    background: linear-gradient(rgb(32, 92, 203) 0%, rgb(89, 143, 241) 100%);
    margin-left: 12px;
    color: #ffffff;
    height: 32px;
  }
}

.flexyugu {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 12px;
}

.grayblock {
  //width: 120px;
  background: #ffffff;
  border-radius: 4px 4px 4px 4px;
  //margin-right: 12px;
  display: flex;
  align-items: center;
  min-height: 48px;

  .innerblock {
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    padding: 20px;
  }

  .innerblock:last-child {
    /* 样式属性 */
    border-right: none;
  }

  .topName {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.6);
    margin-bottom: 8px;
  }
}

.grayblockfirst {
  //width: 160px;
  /* 其他样式属性可以根据需求添加 */
  margin-right: 12px;
  background: #ffffff;
  border-radius: 4px 4px 4px 4px;
  padding: 20px;

  .topName {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.6);
    margin-bottom: 8px;
  }
}
</style>
