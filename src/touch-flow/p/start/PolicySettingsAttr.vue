<script setup lang="ts">
import { inject, ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { randomStr } from "~/utils/common";
import { getqryMaterial, getmarketingTouchEstimate } from "~/api";
import BehaviorGroup from "../behavior/BehaviorGroup.vue";
import CustomAttr from "../behavior/CustomAttr.vue";
import CustomBehavior from "../behavior/CustomBehavior.vue";
import CustomBehaviorSequence from "../behavior/sequence/CustomBehaviorSequence.vue";
const labelPosition = ref("single");
const transform = ref(true);
const transformset = ref(true);
const origin = {
  type: "PolicySettings",
  name: "test",
  value1: false,
  isDelayed: false,
  selectedType: "day",
  delayedAction: "day",
  materialtype: "sms",
  cascaderLabel: "sms",
  do: false,
  num: 1,
};
const marketingTouchNode = ref({
  appPushCount: 0,
  digitalCount: 0,
  outboundCount: 0,
  smsCount: 0,
  total: 0,
  znxCount: 0,
});

const options = [
  {
    value: 1,
    label: "Asia",
    children: [
      {
        value: 2,
        label: "China",
        children: [
          { value: 3, label: "Beijing" },
          { value: 4, label: "Shanghai" },
          { value: 5, label: "Hangzhou" },
        ],
      },
      {
        value: 6,
        label: "Japan",
        children: [
          { value: 7, label: "Tokyo" },
          { value: 8, label: "Osaka" },
          { value: 9, label: "Kyoto" },
        ],
      },
      {
        value: 10,
        label: "Korea",
        children: [
          { value: 11, label: "Seoul" },
          { value: 12, label: "Busan" },
          { value: 13, label: "Taegu" },
        ],
      },
    ],
  },
  {
    value: 14,
    label: "Europe",
    children: [
      {
        value: 15,
        label: "France",
        children: [
          { value: 16, label: "Paris" },
          { value: 17, label: "Marseille" },
          { value: 18, label: "Lyon" },
        ],
      },
      {
        value: 19,
        label: "UK",
        children: [
          { value: 20, label: "London" },
          { value: 21, label: "Birmingham" },
          { value: 22, label: "Manchester" },
        ],
      },
    ],
  },
  {
    value: 23,
    label: "North America",
    children: [
      {
        value: 24,
        label: "US",
        children: [
          { value: 25, label: "New York" },
          { value: 26, label: "Los Angeles" },
          { value: 27, label: "Washington" },
        ],
      },
      {
        value: 28,
        label: "Canada",
        children: [
          { value: 29, label: "Toronto" },
          { value: 30, label: "Montreal" },
          { value: 31, label: "Ottawa" },
        ],
      },
    ],
  },
];
const sizeForm = reactive<typeof origin>(origin);

const dictType = ref();

function reset() {
  Object.assign(sizeForm, origin);
}

onMounted(reset);

const logicalOperator = ref("and");

const props = defineProps<{
  p: any;
}>();
function toggleLogicalOperator() { }

const getqryMaterialval = async () => {
  let param: any = {
    beginTime: "",
    endTime: "",
    name: "",
    pageNum: 10,
    pageSize: 0,
    status: "available",
    type: "sms",
  };
  let res = await getqryMaterial(param);
  dictType.value = res.data;
};

function saveData() {
  if (!sizeForm.name) {
    ElMessage.warning({
      message: "请输入策略名称",
    });

    return false;
  }

  const _ = { ...sizeForm, id: randomStr(12), father: props.p };

  if (!props.p.children) {
    props.p.children = [_];
  } else {
    const arr = [...props.p.children];

    while (arr.length) {
      const item = arr.shift();

      if (item.name === _.name) {
        ElMessage.warning({
          message: "策略名称重复",
        });

        return false;
      }

      if (item.children) arr.push(...item.children);
    }

    props.p.children.push(_);
  }

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

function attrsAdd() {
  let attr = props.p.customRuleContent!.customAttr!.conditions!;

  const obj = {
    conditions: [{ conditions: {} }],
    logicalChar: "or",
  };

  attr.push({
    conditions: [obj],
    logicalChar: "or",
  });
}

function behaviorAdd() {
  let attr = props.p.customRuleContent!.customEvent!.conditions!;

  const obj = {
    conditions: [{ conditions: {} }],
    logicalChar: "or",
  };

  attr.push({
    conditions: [obj],
    logicalChar: "or",
  });
}

function sequenceAdd() {
  let attr = props.p.customRuleContent!.eventSequence!.conditions!;

  const obj = {
    conditions: [{ conditions: [{}] }],
    logicalChar: "or",
  };

  attr.push({
    conditions: [obj],
    logicalChar: "or",
  });
}
</script>

<template>
  <div>
    <el-form ref="form" :model="sizeForm" label-width="auto" label-position="left">
      <el-form-item label="选择策略器名称：">
        <el-input v-model="sizeForm.name" placeholder="填写名称" />
      </el-form-item>
      <el-form-item label="分流类型：">
        <el-radio-group v-model="labelPosition">
          <el-radio label="single">不分流</el-radio>
          <el-radio label="Repeat">按属性用户行为分流</el-radio>
          <el-radio label="type">按触发事件分流</el-radio>
        </el-radio-group>
      </el-form-item>

      <div class="blockbg" v-if="labelPosition === 'Repeat'">
        <div class="title_set bg001">
          用户属性行为分流
          <el-text class="mx-1" type="primary" @click="transform = !transform">{{ transform ? "收起" : "展开" }}
            <el-icon class="icondown" :style="{
              transform: transform ? 'rotate(-90deg)' : 'rotate(90deg)',
            }">
              <DArrowRight />
            </el-icon></el-text>
        </div>
        <div class="titleCondition">进入该策略期的用户需要满足以下条件：</div>
        <el-form-item label="">
          <div class="pannel">
            <div class="filter-container">
              <div class="logical-operator">
                <div class="logical-operator__line"></div>
                <div class="custom-switch" :class="{ active: logicalOperator === 'and' }" @click="toggleLogicalOperator">
                  {{ logicalOperator === "and" ? "且" : "或" }}
                </div>
                <!-- <el-switch v-model="logicalOperator" inline-prompt style="--el-switch-on-color: #409EFF; --el-switch-off-color: #67C23A" active-value="and" inactive-value="or" active-text="且" inactive-text="或" /> -->
              </div>

              <div class="filter-option-content">
                <BehaviorGroup @add="attrsAdd" title="客户属性满足">
                  <CustomAttr :custom="p.customRuleContent!.customAttr" />
                </BehaviorGroup>
                <BehaviorGroup @add="behaviorAdd" title="客户行为满足">
                  <CustomBehavior :custom="p.customRuleContent!.customEvent" />
                </BehaviorGroup>
                <BehaviorGroup @add="sequenceAdd" title="行为序列满足">
                  <CustomBehaviorSequence :custom="p.customRuleContent!.eventSequence" />
                </BehaviorGroup>
              </div>
            </div>
          </div>
        </el-form-item>
      </div>
      <div class="blockbg" v-if="labelPosition === 'type'">
        <div class="title_set bg001">
          触发事件分流
          <el-text class="mx-1" type="primary" @click="transform = !transform">{{ transform ? "收起" : "展开" }}
            <el-icon class="icondown" :style="{
              transform: transform ? 'rotate(-90deg)' : 'rotate(90deg)',
            }">
              <DArrowRight />
            </el-icon></el-text>
        </div>
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
            <div class="filter-container">
              <div class="logical-operator">
                <div class="logical-operator__line"></div>
                <div class="custom-switch" :class="{ active: logicalOperator === 'and' }" @click="toggleLogicalOperator">
                  {{ logicalOperator === "and" ? "且" : "或" }}
                </div>
                <!-- <el-switch v-model="logicalOperator" inline-prompt style="--el-switch-on-color: #409EFF; --el-switch-off-color: #67C23A" active-value="and" inactive-value="or" active-text="且" inactive-text="或" /> -->
              </div>
              <div class="filter-option-content">
                <BehaviorGroup title="客户属性满足"> </BehaviorGroup>
                <BehaviorGroup title="客户行为满足"> </BehaviorGroup>
                <BehaviorGroup title="行为序列满足"> </BehaviorGroup>
              </div>
            </div>
          </div>
        </el-form-item>
      </div>
      <div class="blockbg">
        <div class="title_set">
          延迟设置
          <el-text class="mx-1" type="primary" @click="transform = !transform">{{ transform ? "收起" : "展开" }}
            <el-icon class="icondown" :style="{
              transform: transform ? 'rotate(-90deg)' : 'rotate(90deg)',
            }">
              <DArrowRight />
            </el-icon></el-text>
        </div>
        <div class="underbg">
          &nbsp;
          <el-select v-model="sizeForm.isDelayed" style="width: 100px">
            <el-option :value="true" label="延迟">延迟</el-option>
            <el-option :value="false" label="不延迟">不延迟</el-option> </el-select>&nbsp;
          <el-input v-model="sizeForm.num" type="number" style="width: 100px" />&nbsp;
          <el-select v-model="sizeForm.selectedType" style="width: 100px">
            <el-option value="month" label="月份">分钟</el-option>
            <el-option value="week" label="周">小时</el-option>
            <el-option value="day" label="天">天</el-option> </el-select>&nbsp; 针对符合该装置策略条件的客户 &nbsp;
          <el-select v-model="sizeForm.delayedAction" placeholder="请选择" style="width: 150px">
            <el-option value="week" label="发送触达">发送触达</el-option>
            <el-option value="day" label="打上标签">打上标签</el-option>
            <el-option value="day" label="不执行动作">不执行动作</el-option>
            <el-option value="month" label="发送触达并打上标签">发送触达并打上标签</el-option>
          </el-select>
        </div>
      </div>
      <div class="blockbg">
        <div class="title_set pg2">
          触达设置
          <el-text class="mx-1" type="primary" @click="transformset = !transformset">{{ transformset ? "收起" : "展开" }}
            <el-icon class="icondown" :style="{
              transform: transformset ? 'rotate(-90deg)' : 'rotate(90deg)',
            }">
              <DArrowRight />
            </el-icon></el-text>
        </div>
        <div class="underbg">
          <el-form-item label="触达通道">
            <el-col :span="12">
              <el-select v-model="sizeForm.materialtype" style="width: 100px">
                <el-option value="sms" label="短信">手机短信</el-option>
                <el-option value="app" label="app消息">app消息</el-option>
                <el-option value="digital" label="数字员工">数字员工</el-option>
                <el-option value="outbound" label="智能外呼">智能外呼</el-option>
                <el-option value="znx" label="站内信">站内信</el-option>
              </el-select>
            </el-col>
          </el-form-item>

          <el-button type="primary" @click="getqryMaterialval" plain>获取模版</el-button>
          <el-form-item label="选择模版">
            <el-select v-model="sizeForm.type" placeholder="请选择" style="width: 100px">
              <el-option value="month" label="月份">发送触达并打上标签</el-option>
              <el-option value="week" label="周">小时</el-option>
              <el-option value="day" label="天">天</el-option> </el-select>&nbsp;&nbsp;&nbsp;<el-button type="primary"
              plain>新增短信模块版本</el-button>
          </el-form-item>

          <el-form-item label="触达内容">
            <div class="inputValue">定制组件位置</div>
          </el-form-item>
        </div>
      </div>
      <div class="blockbg">
        <div class="title_set pg3">
          标签设置
          <el-text class="mx-1" type="primary" @click="transformset = !transformset">{{ transformset ? "收起" : "展开" }}
            <el-icon class="icondown" :style="{
              transform: transformset ? 'rotate(-90deg)' : 'rotate(90deg)',
            }">
              <DArrowRight />
            </el-icon></el-text>
        </div>

        <div class="underbg">
          符合该策略器条件的用户打上 &nbsp;
          <el-cascader v-model="sizeForm.cascaderLabel" :options="options" clearable />

        </div>
      </div>
      <div class="blockbg">
        <div class="underbg">
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

.blockbg {
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

  .underbg {
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
}</style>
