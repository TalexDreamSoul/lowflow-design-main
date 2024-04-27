<!--
 * @Author: 张佳 zhangjia@4paradigm.com
 * @Date: 2024-04-19 10:17:02
 * @LastEditors: 张佳 zhangjia@4paradigm.com
 * @LastEditTime: 2024-04-25 16:43:13
 * @FilePath: /lowflow-design-main-frontend/src/views/activityDetailsList/ComponentD.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
import { ref, onMounted, defineProps, computed, onUnmounted } from "vue";
import * as API from "~/api/activity";
import { checkStringEqual } from "~/utils/common";
import { defineAsyncComponent } from "vue";
import { DefineComponent } from "vue";

const props = defineProps({
  activityId: String,
});

const playId = ref("");
const playTypeMap = ref([]);
const tabVModel = ref(0);

onMounted(async () => {
  getPlayType();
});

const getPlayType = async () => {
  let res = await API.listActivityPlay({ activityId: props.activityId });
  playTypeMap.value = res?.data;
  playId.value = res?.data?.[0]?.playId;
  tabVModel.value = 1;
};

const playType = computed(
  () =>
    playTypeMap.value.find((v: any) => checkStringEqual(v.playId, playId.value))
      ?.playType
);

interface Components {
  [key: string]: DefineComponent<{}, {}, any>;
}
const components: Components = {
  1: defineAsyncComponent(() => import("./playRender.vue")),
  3: defineAsyncComponent(() => import("./playCustomer.vue")),
};
const activeTabComponent = computed(() => components[tabVModel.value]);
</script>

<template>
  <div class="warp">
    <div class="countCard roundCard">
      <span class="spanDataName" style="margin-right: 40px"> 玩法数据 </span>

      <el-form-item label="玩法">
        <el-select
          v-model="playId"
          placeholder="请选择"
          style="width: 300px; height: 40px"
        >
          <el-option
            v-for="item of playTypeMap"
            :label="item.playName"
            :value="item.playId"
          />
        </el-select>
      </el-form-item>
    </div>

    <el-button-group>
      <el-button
        @click="tabVModel = 1"
        :type="tabVModel == 1 && 'primary'"
        style="height: 40px"
      >
        数据汇总
      </el-button>
      <el-button
        @click="tabVModel = 3"
        :type="tabVModel == 3 && 'primary'"
        style="height: 40px"
        >参与客户明细
      </el-button>
    </el-button-group>
    <component
      :is="activeTabComponent"
      :activityId="props.activityId"
      :key="playId"
      :playId="playId"
      :playType="playType"
    />
  </div>
</template>
<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 0;
  align-items: center;
}

.countCard {
  display: flex;
  justify-content: flex-start;
  :deep(.el-select) {
    .el-select__wrapper {
      height: 40px;
    }
  }
}
.roundCard {
  background: #ffffff;
  box-shadow: 0px 20px 50px 0px rgba(0, 0, 0, 0.02);
  border-radius: 8px 8px 8px 8px;
  margin-bottom: 16px;
  padding: 0 24px;
  height: 56px;
}
.spanDataName {
  font-weight: 500;
  font-size: 18px;
  color: #000000;
  line-height: 24px;
  text-align: left;
  line-height: 56px;
}
.warp {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
