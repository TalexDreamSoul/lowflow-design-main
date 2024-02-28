<script setup lang="ts" name="TouchEstimation">
import { getmarketingTouchEstimate } from "~/api/index";
import { ref } from "vue";

const props = defineProps<{
  customRuleContent: any;
  readonly?: boolean
}>();

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
    ...props.customRuleContent,
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
</script>

<template>
  <div class="MainBlock">
    <div class="MainBlock-Title">
      <p class="title">预估受众客户</p>
      <el-button :disabled="readonly" @click="estimation" class="primaryStyle" round>立即预估</el-button :disabled="readonly">
    </div>

    <div class="MainBlock-Content">
      <div class="MainBlock-ContentItem border-bottom">
        <div class="topName">预估受众客户总数</div>
        <div v-if="marketingTouchNode.total != undefined">
          {{ marketingTouchNode.total }}
        </div>
        <div style="color: #ff5050" v-else>无法预估数据</div>
      </div>
      <div class="MainBlock-ContentSection">
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
  </div>
</template>

<style lang="scss" scoped>

</style>
