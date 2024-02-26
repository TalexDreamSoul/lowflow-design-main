<script setup lang="ts">
import { ElMessage } from "element-plus";
import BehaviorGroup from "../behavior/BehaviorGroup.vue";
import { ref, reactive, computed, inject } from "vue";
import { getmarketingTouchEstimate, getBlackList } from "~/api/index";
import CustomAttr from "../behavior/CustomAttr.vue";
import CustomBehavior from "../behavior/CustomBehavior.vue";
import CustomBehaviorSequence from "../behavior/sequence/CustomBehaviorSequence.vue";
import { MarketingTouchEditDTO, CustomSearchDTO } from "../behavior/marketing";
import { validateCustomerAttributes } from './../../flow-utils'

const customRuleContent = reactive<CustomSearchDTO>({
  customAttr: {
    conditions: [
      {
        conditions: [
          // {}
        ],
        logicalChar: "或",
      }
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
      }
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
      }
    ],
    logicalChar: "或",
  },
  logicalChar: "或",
  blackList: {
    _enable: 'no',
    data: []
  }
});

const props = defineProps<{
  p: MarketingTouchEditDTO;
}>();

Object.assign(customRuleContent, props.p.customRuleContent)

const marketingTouchNode = ref({
  appPushCount: 0,
  digitalCount: 0,
  outboundCount: 0,
  smsCount: 0,
  total: 0,
  znxCount: 0,
});

const estimation = async () => {
  // 请求示例
  let data = {
    customAttr: {
      conditions: [
        {
          conditions: [
            {
              attr: {
                endTime: "",
                field: "",
                fieldMultiValue: [],
                fieldName: "",
                fieldOp: "",
                fieldRangeValue: "",
                fieldType: "",
                fieldValue: "",
                startTime: "",
              },
              label: {
                labelId: 0,
                labelName: "",
                labelValue: [],
              },
              type: "",
            },
          ],
          logicalChar: "",
        },
      ],
      logicalChar: "",
    },
    customEvent: {
      conditions: [
        {
          conditions: [
            {
              action: "",
              conditions: {
                conditions: [
                  {
                    attr: {
                      endTime: "",
                      field: "",
                      fieldMultiValue: [],
                      fieldName: "",
                      fieldOp: "",
                      fieldRangeValue: "",
                      fieldType: "",
                      fieldValue: "",
                      startTime: "",
                    },
                    label: {
                      labelId: 0,
                      labelName: "",
                      labelValue: [],
                    },
                    type: "",
                  },
                ],
                logicalChar: "",
              },
              endTime: "",
              eventCode: "",
              eventName: "",
              startTime: "",
            },
          ],
          logicalChar: "",
        },
      ],
      logicalChar: "",
    },
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
                      endTime: "",
                      field: "",
                      fieldMultiValue: [],
                      fieldName: "",
                      fieldOp: "",
                      fieldRangeValue: "",
                      fieldType: "",
                      fieldValue: "",
                      startTime: "",
                    },
                    label: {
                      labelId: 0,
                      labelName: "",
                      labelValue: [],
                    },
                    type: "",
                  },
                ],
                logicalChar: "",
              },
              eventCode: "",
              eventName: "",
            },
          ],
          endTime: "",
          logicalChar: "",
          startTime: "",
        },
      ],
      logicalChar: "",
    },
    logicalChar: "",
  };
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

const logicalOperator = computed(
  () => customRuleContent.logicalOperator
);

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

  Object.assign(props.p, {
    customRuleContent
  })

  return true;
}

type IRegSaveFunc = (regFunc: () => boolean) => void;
const regSaveFunc: IRegSaveFunc = inject("save")!;
regSaveFunc(saveData);

const blackList = ref()
!(async () => {
  const res = await getBlackList({})

  if (res.data) {
    blackList.value = res.data
  }
})()
</script>

<template>
  <div>
    <el-form ref="form" :model="customRuleContent" label-width="auto" label-position="left">
      <el-text tag="b">受众客户为满足以下条件的客户（触发型非必选）</el-text><br />
      <el-text>若下列条件不添加，则受众客户默认为全部客户</el-text>
      <el-form-item label="">
        <div class="pannel">
          <div class="filter-container">
            <div class="logical-operator">
              <div class="logical-operator__line"></div>
              <div class="custom-switch" :class="{
                active: logicalOperator === '且',
              }" @click="
  customRuleContent!.logicalOperator =
  logicalOperator === '且' ? '或' : '且'
  ">
                {{
                  customRuleContent.logicalOperator === "且" ? "且" : "或"
                }}
              </div>
            </div>
            <div class="filter-option-content">
              <BehaviorGroup @add="attrsAdd" title="客户属性满足">
                <CustomAttr :custom="customRuleContent.customAttr" />
              </BehaviorGroup>
              <BehaviorGroup @add="behaviorAdd" title="客户行为满足">
                <CustomBehavior :custom="customRuleContent.customEvent" />
              </BehaviorGroup>
              <BehaviorGroup @add="sequenceAdd" title="行为序列满足">
                <CustomBehaviorSequence :custom="customRuleContent.eventSequence" />
              </BehaviorGroup>
            </div>
          </div>
        </div>
      </el-form-item>

      <div class="yugu_flex">
        <div class="title">预估受众客户</div>
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
        <div class="title">黑名单</div>
      </div>

      <el-form-item label="过滤黑名单" label-class="custom-label">
        <el-select v-model="customRuleContent.blackList._enable" style="width: 100px">
          <el-option value="no" label="不过滤">不过滤</el-option>
          <el-option value="yes" label="过滤">过滤</el-option>
        </el-select>
        &nbsp;
        <el-select placeholder="请选择" v-model="customRuleContent.blackList.data" multiple v-if="customRuleContent?.blackList?._enable === 'yes'" style="min-width: 100px">
          <el-option v-for="item in blackList.records" :value="item.blacklistName" :label="item.blacklistName">
            <span>{{ item.blacklistName }}</span>
            <!-- <p>{{ item.blacklistDesc }}</p> -->
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped lang="scss">
.flex-column {
  display: -webkit-inline-box !important;
  align-items: flex-start !important;
  flex-direction: column !important;
}

.pannel {
  width: 100%;
  min-height: 200px;
  //padding: 0 15px;
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

.el-collapse-item {
  margin: 12px;
  border: 1px solid var(--el-border-color);
  border-radius: 2px;
  background: #f5f8fc;
}

.filter-container {
  border-radius: 3px;
  display: flex;

  .logical-operator {
    position: relative;
    display: flex;
    align-items: center;
    overflow: hidden;
    min-width: 40px;

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

  .filter-option-content {
    position: relative;
    width: 100%;

    .filter-item-rule {
      display: flex;
      align-items: center;
      // min-height: 48px;
    }

    .filter-filter-item__add {
      border-style: dashed;
      width: 100%;
    }
  }
}

.yugu_flex {
  display: flex;
  align-items: center;
  min-height: 48px;

  .title {
    font-size: 16px;
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
}

.grayblock {
  //width: 120px;
  background: #f2f4f8;
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
  background: #f2f4f8;
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
../behavior/marketing
