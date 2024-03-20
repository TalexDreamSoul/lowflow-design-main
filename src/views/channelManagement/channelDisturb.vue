<script setup lang="ts">
import { reactive, ref } from "vue";
import {
  getGlobalDisturbDetail,getBlackList
} from "~/api/index";
import CustomEventComponent from "~/components/CustomEventComponent.vue";

const types = [
  {
    type: 'appPush',
    name: 'APP PUSH'
  },
  {
    type: 'digital',
    name: '企微'
  },
  {
    type: 'outbound',
    name: '外呼'
  },
  {
    type: 'sms',
    name: '手机短信'
  },
  {
    type: 'znx',
    name: '站内信'
  }
]
const tableData = ref<any[]>([]);
const dialogVisible = ref<boolean>(false);
const dialogOptions = ref<{ type: 'update' | 'detail' } & any>({});
const blackListFields = ref();

!(async () => {
  const res = await getBlackList({});

  if (res.data) {
    blackListFields.value = res.data;

    transformBlackListData();
  }
})();
const blackList = reactive<{
  _enable: "no" | "yes";
  list: Array<any>;
  data: Array<any>;
}>({
  _enable: "no",
  list: [],
  data: [],
});

function transformBlackListData() {
  // console.log("transform blacklist", blackList);


  if (blackList.data.length) {
    [...blackList.data].forEach((item) => {
      blackList.list.push(item.id);
    });

    // 去重
    blackList.list = [ ...new Set(blackList.list) ]
  }
}
(() => {

  [...types].forEach(async (item) => {
    const res: any = await getGlobalDisturbDetail({ type: item.type })

    tableData.value.push({
      ...res.data,
      name: item.name
    })
  })

})()

function updateData(data: any) {
  Object.assign(dialogOptions.value, {
    type: 'update',
    disabled: false,
    data
  })

  dialogVisible.value = true
}

function detailsData(data: any) {
  Object.assign(dialogOptions.value, {
    type: 'detail',
    disabled: true,
    data
  })

  dialogVisible.value = true
}
</script>

<template>
  <CustomEventComponent title="渠道勿扰设置" :tableData="tableData">
    <template #table="{ tableData }">

      <el-table :data="tableData">
        <el-table-column label="渠道名称" prop="name" />
        <el-table-column label="触达次数是否限制">
          <template #default="{ row }">
            {{ row.blacklistLimit ? '限制' : '不限制' }}
          </template>
        </el-table-column>
        <el-table-column label="过滤黑名单" prop="usedCount">
          <template #default="{ row }">
            <span>{{ row.blacklistList?.length || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <el-space wrap>
              <el-link type="primary" @click="updateData(row)">编辑设置</el-link>
              <el-link type="primary" @click="detailsData(row)">查看详情</el-link>
            </el-space>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </CustomEventComponent>

  <template v-if="dialogVisible">
    <el-dialog :title="dialogOptions?.type === 'update' ? '编辑渠道勿扰设置' : '查看渠道勿扰设置'" align-center v-model="dialogVisible"
      append-to-body>
      <div class="line">
        <span>1.每个客户触达次数限制：</span>
        <span>
          <el-radio-group v-model="dialogOptions.blacklistLimit" class="ml-4">
            <el-radio :value="false">不限制</el-radio>
            <el-radio :value="true">限制</el-radio>
          </el-radio-group>
        </span>
      </div>
      <div class="line">
        <span>当前渠道客户 
          <el-input-number
          :min="1"
          placeholder="填写次数"
          style="width: 100px"
          controls-position="right" />&nbsp;天内，最多通过营销平台触达 
        <el-input-number
        :min="1"
        placeholder="填写次数"
        style="width: 100px"
        controls-position="right" />&nbsp;次
        </span>
      </div>
      <div class="line">
        <span>2.勿扰时段限制：</span>
        <span>
          <el-radio-group v-model="dialogOptions.blacklistLimit" class="ml-4">
            <el-radio :value="false">不限制</el-radio>
            <el-radio :value="true">限制</el-radio>
          </el-radio-group>
        </span>
      </div>
      <div class="line">
        <el-date-picker
        type="daterange"
        range-separator="-"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />&nbsp;
       <span>为该渠道的默认勿扰时段
        </span>
      </div>
      <div class="line">
        3.过滤黑名单
        <el-select  v-model="blackList._enable" style="width: 100px">
          <el-option value="no" label="不过滤">不过滤</el-option>
          <el-option value="yes" label="过滤">过滤</el-option>
        </el-select>
        &nbsp;
        <el-select
          placeholder="请选择"
          v-model="blackList.list"
          multiple
          v-if="blackList?._enable === 'yes'"
          style="width: 300px"
        >
          <el-option
            v-for="item in blackListFields.records"
            :value="item.id"
            :label="item.blacklistName"
          >
            <span>{{ item.blacklistName }}</span>
            <!-- <p>{{ item.blacklistDesc }}</p> -->
          </el-option>
        </el-select>
      </div>
      {{ dialogOptions.data }}
    </el-dialog>
  </template>
</template>


<style lang="scss" scoped>
.line{
  font-weight: 400;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.9);
  line-height: 16px;
  text-align: left;
  margin: 12px;
  margin: 12px;
  letter-spacing: 0.5px;
}

</style>