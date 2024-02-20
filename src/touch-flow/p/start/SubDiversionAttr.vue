<script setup lang="ts">
import { ElMessage } from "element-plus";
import { inject, toRaw, reactive, ref, watchEffect } from "vue";
import { getQryMaterial, getmarketingTouchEstimate } from "~/api";
import NewLabel from '../../label/NewLabel.vue';
import BehaviorGroupPlus from "../behavior/BehaviorGroupPlus.vue";
import DiversionBehavior from "../behavior/diversion/DiversionBehavior.vue";
import TouchSettingContents from '../touch/TouchSettingContents.vue';

const origin = {
  nodeId: "",
  nodeType: "subDiversion",
  nodeName: "默认分支",

  targetRuleContent: {
    targetDelayed: {
      delayedAction: "",
      delayedTime: 0,
      delayedType: "",
      delayedUnit: "day",
      isDelayed: false
    },
    targetRuleContent: {
      eventSequence: {
        conditions: [
          {
            conditions: [
              {
                action: "",
                conditions: {
                  conditions: [
                    {
                      attr: {
                        field: "",
                        fieldMultiValue: [],
                        fieldName: "",
                        fieldOp: "",
                        fieldRangeValue: "",
                        fieldType: "",
                        fieldValue: "",
                        timeCondition: {
                          endDay: 0,
                          endTime: "",
                          isFuture: false,
                          isWithin: false,
                          startDay: 0,
                          startTime: "",
                          timeType: ""
                        }
                      },
                      label: {
                        labelId: 0,
                        labelName: "",
                        labelValue: []
                      },
                      type: ""
                    }
                  ],
                  logicalChar: "或"
                },
                eventCode: "",
                eventName: ""
              }
            ],
            endTime: "",
            logicalChar: "或",
            startTime: ""
          }
        ],
        logicalChar: "或"
      },
      logicalChar: "或"
    }
  },
  touch: {
    type: -1,
    content: "",
    variables: []
  },
  material: {
    type: "",
    beginTime: "",
    endTime: "",
    name: "",
    pageNum: 10,
    pageSize: -1,
    status: "available",
    templates: [{
      id: -1,
      name: '不使用模板'
    }]
  },
  target: false,
  eventDelayed: {
    delayedAction: '',
    delayedTime: 0,
    delayedUnit: '',
    isDelayed: false
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

const sizeForm = reactive<typeof origin>(origin);

const { nodeType, nodeId } = props.p

if (!props.new && nodeType === 'subDiversion') {
  if (nodeId) {
    Object.assign(sizeForm, props.p)
  }
}

async function refreshMaterialTemplate() {
  sizeForm.touch.type = -1

  const { material } = sizeForm

  let res = await getQryMaterial(material);

  if (res.data?.records) {
    sizeForm.material.templates = [{
      id: -1,
      name: "不使用模板"
    }, ...res.data.records];
  }
}

function saveData() {
  if (!sizeForm.nodeName) {
    ElMessage.warning({
      message: "请输入策略名称",
    });

    return false;
  }

  const _: any = { nodeId: "", children: [] };
  Object.assign(_, sizeForm)

  Object.assign(props.p, _)

  return true;
}

type IRegSaveFunc = (regFunc: () => boolean) => void;
const regSaveFunc: IRegSaveFunc = inject("save")!;
regSaveFunc(saveData);

const estimation = async () => {
  // 请求示例
  let data = {};
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

const platformOptions: any = {
  'sms': "短信",
  'appPush': "app消息",
  'digital': "数字员工",
  'outbound': "智能外呼",
  'znx': "站内信",
}
</script>

<template>
  <div>
    <el-form ref="form" :model="sizeForm" label-width="auto" label-position="left">
      <el-form-item label="流量策略器名称：">
        <el-input v-model="sizeForm.nodeName" placeholder="填写名称" />
      </el-form-item>

      <BehaviorGroupPlus title="延迟设置" color="#62C943">
        &nbsp;
        <el-select v-model="sizeForm.eventDelayed.isDelayed" style="width: 100px">
          <el-option :value="true" label="延迟">延迟</el-option>
          <el-option :value="false" label="不延迟">不延迟</el-option> </el-select>&nbsp;
        <template v-if="sizeForm.eventDelayed.isDelayed">
          <el-input v-model="sizeForm.eventDelayed.delayedTime" type="number" style="width: 100px" />&nbsp;
          <el-select placeholder="请选择" v-model="sizeForm.eventDelayed.delayedUnit" style="width: 100px">
            <el-option value="month" label="月份">分钟</el-option>
            <el-option value="week" label="周">小时</el-option>
            <el-option value="day" label="天">天</el-option> </el-select>&nbsp; 针对符合该装置策略条件的客户 &nbsp;
          <el-select v-model="sizeForm.eventDelayed.delayedAction" placeholder="请选择" style="width: 150px">
            <el-option value="week" label="发送触达">发送触达</el-option>
            <el-option value="day" label="打上标签">打上标签</el-option>
            <el-option value="day" label="不执行动作">不执行动作</el-option>
            <el-option value="month" label="发送触达并打上标签">发送触达并打上标签</el-option>
          </el-select>
        </template>
      </BehaviorGroupPlus>

      <BehaviorGroupPlus title="触达设置" color="#FFD561">
        <div class="BlockBackground-Under">
          <el-form-item label="触达通道">
            <el-select @change="refreshMaterialTemplate" v-model="sizeForm.material.type" style="width: 120px">
              <el-option value="sms" label="短信">手机短信</el-option>
              <el-option value="appPush" label="app消息">app消息</el-option>
              <el-option value="digital" label="数字员工">数字员工</el-option>
              <el-option value="outbound" label="智能外呼">智能外呼</el-option>
              <el-option value="znx" label="站内信">站内信</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择模版">
            <el-select v-model="sizeForm.touch.type" style="width: 120px">
              <el-option v-for="item in (sizeForm.material.templates)" :value="item.id" :label="item.name">
                <div class="template-option">
                  <span>{{ item.name }}</span>
                  <span class="template-desc" v-if="(item as any)?.content?.content">
                    {{ (item as any).content.content }}
                  </span>
                </div>
              </el-option>
            </el-select>
            <el-button v-if="platformOptions[sizeForm.material.type]" ml-1rem type="primary" plain>
              新增{{ platformOptions[sizeForm.material.type] }}模块版本</el-button>
          </el-form-item>
          <el-form-item label="触达内容">
            <TouchSettingContents content="content" variables="variables" v-model="sizeForm.touch" />
          </el-form-item>
        </div>
      </BehaviorGroupPlus>

      <!-- v-if="`${("" + sizeForm.eventDelayed.delayedAction).contains('label')}`" -->
      <BehaviorGroupPlus title="标签设置" color="#277AE7">
        <NewLabel :p="sizeForm" />
        <!-- <div class="BlockBackground-Under">
          符合该策略器条件的用户打上 &nbsp;
          <el-cascader v-model="sizeForm.cascaderLabel" :options="options" clearable />

        </div> -->
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
            <el-switch v-model="sizeForm.targetRuleContent.targetDelayed.isDelayed" />
          </div>

          <div v-if="sizeForm.targetRuleContent.targetDelayed.isDelayed">
            <div class="garyblock">
              <el-text>该策略器的延时以及动作执行完毕后，在</el-text>&nbsp;
              <el-input v-model="sizeForm.targetRuleContent.targetDelayed.delayedTime" type="number"
                style="width: 100px" />&nbsp;
              <el-select v-model="sizeForm.targetRuleContent.targetDelayed.delayedUnit" style="width: 150px">
                <el-option value="month" label="月份">分钟</el-option>
                <el-option value="week" label="周">小时</el-option>
                <el-option value="day" label="天">天</el-option> </el-select>&nbsp;
              <el-text>后立即判断客户是否完成以下转化事件，则认为完成该策略器模板。</el-text>
            </div>
            <DiversionBehavior :custom="sizeForm.targetRuleContent!.targetRuleContent!.eventSequence" />
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

.filter-filter-item__add {
  position: absolute;
  right: 12px;
}

:deep(.el-form-item) {
  margin-right: 0;
  margin-bottom: 0;
}

.el-collapse {
  border: none !important;
}

.custom-collapse-item .el-collapse-item__header {
  border-bottom: none !important;
  background-color: #f5f8fc !important;
}

.filter-container {
  border-radius: 3px;
  display: flex;

  .logical-operator {
    position: relative;
    display: flex;
    align-items: center;
    overflow: hidden;
    min-width: 35px;

    .logical-operator__line {
      position: absolute;
      left: calc(35% - 1px);
      border-width: 1px 0 1px 1px;
      border-top-style: solid;
      border-bottom-style: solid;
      border-left-style: solid;
      border-left-color: #4078e0;
      border-image: initial;
      border-right-style: initial;
      border-right-color: initial;
      border-radius: 5px 0 0 5px;
      height: calc(100% - 22px);
    }
  }

  .filter-option-content {
    position: relative;
    width: 100%;

    .filter-item-rule {
      display: flex;
      align-items: center;
      min-height: 48px;
    }

    .filter-filter-item__add {
      border-style: dashed;
      width: 100%;
    }
  }

  .custom-switch {
    border: 1px solid #4078e0;
    color: #fff;
    width: 24px;
    height: 24px;
    background: #fff;
    font-weight: 500;
    color: #4078e0;
    font-size: 14px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 1;
  }
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

.inputValue {
  background: #fff;
  height: 150px;
  width: 480px;
  border: 1px solid #dbdbdb;
  border-radius: 4px;
  padding: 12px;
  color: #333;
}
</style>
