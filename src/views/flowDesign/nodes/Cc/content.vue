<script setup lang="ts">
import { CcNode } from "./index";
import { ref, watchEffect } from "vue";
import { getList, User } from "~/api/index";

export interface CcContentProps {
  node: CcNode;
}

const $props = withDefaults(defineProps<CcContentProps>(), {});
const content = ref<string>("");
watchEffect(() => {
  const props = $props.node;
  if (props.users.length > 0) {
    getList(props.users).then((res) => {
      if (res.success) {
        content.value = res.data.map((item: User) => item.name).join("、");
      }
    });
  } else {
    content.value = "未指定人员";
  }
});
</script>


<template>
  <div class="startnodeWrap">
    <div class="hearder">
      {{ node.name }} <el-text   type="primary" style="cursor: pointer;" >
        <el-icon size="14">
          <Delete />
        </el-icon>
        删除
      </el-text>
    </div>
    <el-text>
      <div class="grayblock">
        <div class="title">
          客户属性行为分流
        </div>
        <div class="innertext">
          不分流
        </div>
      </div>
      <div class="grayblock2">
        <div class="title">
          延迟设置
        </div>
        <div class="innertext">
          立即针对符合该策略器条件的客户发送触达
        </div>
      </div>
      <div class="grayblock3">
        <div class="title">
          APP推送
        </div>
        <div class="innertext">
          积极分子标题：参加活动赢好礼
        </div>
      </div>
    </el-text>
  </div>
</template>

<style scoped lang="scss">
.startnodeWrap {
  padding: 24px;
  .hearder {
    //width: 120px;
    height: 24px;
    font-size: 18px;
    font-weight: 500;
    color: #000000;
    line-height: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.g6_start_content {
  flex: 1;

  padding: 16px;
  width: 320px;
  background: linear-gradient(180deg, #f2f4f8 0%, rgba(242, 244, 248, 0.4) 100%)
    rgba(255, 255, 255, 0.4);
  border-radius: 8px 8px 8px 8px;
  opacity: 1;
}
.grayblock {
  width: 368px;
  height: 96px;
  background: #f2f4f8;
  border-radius: 8px 8px 8px 8px;
  opacity: 1;
  &::before {
    content: "";
    position: absolute;
    transform: translateX(-50%);
    width: 0;
    border-width: 8px 6px 0;
    width: 4px;
    height: 96px;
    border-radius: 4px 0px 0px 4px;
    background: #90a0b8;
  }
  margin-top: 10px;
}
.grayblock2 {
  width: 368px;
  height: 96px;
  background: rgba(125, 199, 87, 0.1);
  border-radius: 4px 4px 4px 4px;
  opacity: 1;
  &::before {
    content: "";
    position: absolute;
    transform: translateX(-50%);
    width: 0;
    border-width: 8px 6px 0;
    width: 4px;
    height: 96px;
    border-radius: 4px 0px 0px 4px;
    background: #7dc757;
  }
  margin-top: 10px;
}
.grayblock3 {
  width: 368px;
  height: 96px;
  background: rgba(255, 184, 88, 0.1);
  border-radius: 4px 4px 4px 4px;
  opacity: 1;
  &::before {
    content: "";
    position: absolute;
    transform: translateX(-50%);
    width: 0;
    border-width: 8px 6px 0;
    width: 4px;
    height: 96px;
    border-radius: 4px 0px 0px 4px;
    background: #ffb858;
  }
  margin-top: 10px;
}
.g6_start_content:nth-of-type(1) {
  margin-right: 12px;
  overflow-y: scroll;
}
.flex-space {
  display: flex;
  align-items: center;

}
.title {
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  color: #333;
  overflow: hidden;
  position: relative;
  padding-bottom: 12px;
  padding: 20px 20px 8px 20px;
  .iconright {
    position: absolute;
    right: 0;
  }
  .divunderline {
    width: 160px;
    height: 7px;
    background: linear-gradient(
      82deg,
      rgba(64, 120, 224, 0.4) 0%,
      rgba(64, 120, 224, 0) 100%
    );
    border-radius: 2px 2px 2px 2px;
    opacity: 0.6;
    position: absolute;
    bottom: 10px;
  }
}
.innertext {
  padding-left: 20px;
  font-size: 14px;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.6);
  line-height: 24px;
}
.titlecheck {
  color: #4078e0;
}
.content {
  font-size: 14px;
  line-height: 17px;
  color: #929293;
}
</style>