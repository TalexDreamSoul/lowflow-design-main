<script setup lang="ts">
import { ref } from "vue";
import {
  getGlobalDisturbDetail
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
        <span>当前渠道客户 天内，最多通过营销平台触达 次
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
        <span>为该渠道的默认勿扰时段
        </span>
      </div>
      {{ dialogOptions.data }}
    </el-dialog>
  </template>
</template>


<style lang="scss" scoped></style>