<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import {
  getGlobalDisturbDetail, getBlackList
} from "~/api/index";
import CustomEventComponent from "~/components/CustomEventComponent.vue";
import DayJs from "dayjs";
import API from "~/api/channelManagement";
import { ElMessage } from "element-plus";

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
  const res: any = await getBlackList({});

  if (res.data) {
    blackListFields.value = res.data;

    transformBlackListData();
  }
})();
const blackList = ref<Array<any>>([]);

watch(() => blackList.value, val => {
  if (!val?.length) return

  dialogOptions.value.data.blacklistList = blackList.value.map((item) => {
    const res = [...blackListFields.value.records].find((each) => +each.id === +item);

    if (!res) return

    return {
      id: res.id,
      blacklistName: res.blacklistName,
    };
  })

  console.log('233', dialogOptions.value.data)

}, { immediate: true })

function transformBlackListData() {
  blackList.value.length = 0

  if (dialogOptions.value.data?.blacklistList?.length) {
    [...dialogOptions.value.data.blacklistList].forEach((item) => {
      if ( !item ) return
      blackList.value.push(item.id);
    });
  }
}
(() => {

  [...types].forEach(async (item) => {
    const res: any = await getGlobalDisturbDetail({ type: item.type })

    const obj = {
      ...res.data,
      name: item.name
    }

    Object.defineProperty(obj, '$blacklistLimit', {
      // value: obj.blacklistLimit,
      enumerable: true,
      get() {
        return String(+obj.blacklistLimit)
      },
      set(val) {
        obj.blacklistLimit = val
      }
    })

    Object.defineProperty(obj, '$touchLimit', {
      enumerable: true,
      get() {
        return String(+obj.touchLimit)
      },
      set(val) {
        obj.touchLimit = val
      }
    })

    Object.defineProperty(obj, '$date', {
      enumerable: true,
      get() {
        const { startDate, endDate } = obj

        return [startDate, endDate]
      },
      set(val) {
        console.log(`output->val`, val)
        obj.startDate = DayJs(val[0]).format("HH:MM")
        obj.endDate = DayJs(val[1]).format("HH:MM")
      }
    })

    obj._enable = !!obj.blacklistList?.length

    Object.defineProperty(obj, '$enable', {
      enumerable: true,
      get() {
        return obj._enable ? "过滤" : "不过滤"
      },
      set(val) {
        obj._enable = val === "过滤"
      }
    })

    console.log(obj)

    tableData.value.push(obj)
  })

})()

function genDate(num: any) {
  
}

function updateData(data: any) {
  Object.assign(dialogOptions.value, {
    type: 'update',
    disabled: false,
    data
  })

  transformBlackListData()

  console.log(blackList)

  dialogVisible.value = true
}

function detailsData(data: any) {
  Object.assign(dialogOptions.value, {
    type: 'detail',
    disabled: true,
    data
  })

  transformBlackListData()

  dialogVisible.value = true
}

const onSubmit = async () => {
  let res: any;
  res = await API.updateGlobalDisturb({
    ...dialogOptions.value.data
  });

  if (res.data) {
    ElMessage({
      message: "修改成功！",
      type: "info"
    })

    location.reload()
  }

};
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
        <el-table-column label="勿扰时段是否限制">
          <template #default="{ row }">
            {{ row.disturbLimit ? '限制' : '不限制' }}
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
          <el-radio-group :disabled="dialogOptions?.disabled" v-model="dialogOptions.data.$blacklistLimit" class="ml-4">
            <el-radio label="0">不限制</el-radio>
            <el-radio label="1">限制</el-radio>
          </el-radio-group>
        </span>
      </div>
      <div class="line">
        <span>当前渠道客户
          <el-input-number v-model="dialogOptions.data.limitDay" :disabled="dialogOptions?.disabled" :min="1"
            placeholder="填写次数" style="width: 120px" controls-position="right" />&nbsp;天内，最多通过营销平台触达
          <el-input-number v-model="dialogOptions.data.limitCount" :disabled="dialogOptions?.disabled" :min="1"
            placeholder="填写次数" style="width: 120px" controls-position="right" />&nbsp;次
        </span>
      </div>
      <div class="line">
        <span>2.勿扰时段限制：</span>
        <span>
          <el-radio-group :disabled="dialogOptions?.disabled" v-model="dialogOptions.data.$touchLimit" class="ml-4">
            <el-radio label="0">不限制</el-radio>
            <el-radio label="1">限制</el-radio>
          </el-radio-group>
        </span>
      </div>
      <div class="line">
        <el-time-picker is-range format="HH:mm" style="width: 200px" v-model="dialogOptions.data.$date"
          :disabled="dialogOptions?.disabled" type="daterange" unlink-panels range-separator="-"
          start-placeholder="开始时间" end-placeholder="结束时间" />&nbsp;
        <span>为该渠道的默认勿扰时段
        </span>
      </div>
      <div class="line">
        3.过滤黑名单
        <el-select :disabled="dialogOptions?.disabled" v-model="dialogOptions.data.$enable" style="width: 100px">
          <el-option label="不过滤" value="不过滤">不过滤</el-option>
          <el-option label="过滤" value="过滤">过滤</el-option>
        </el-select>
        &nbsp;
        <el-select :disabled="dialogOptions?.disabled" placeholder="请选择" v-model="blackList" multiple
          v-if="dialogOptions.data._enable" style="width: 300px">
          <el-option v-for="item in blackListFields.records" :value="item.id" :label="item.blacklistName">
            <span>{{ item.blacklistName }}</span>
            <!-- <p>{{ item.blacklistDesc }}</p> -->
          </el-option>
        </el-select>
      </div>

      <template #footer>
        <el-button @click="dialogVisible = false" round>
          {{ dialogOptions?.type === 'detail' ? '返回' : '取消' }}
        </el-button>
        <el-button v-if="dialogOptions?.type !== 'detail'" @click.prevent="onSubmit()" round
          type="primary">保存</el-button>

      </template>
    </el-dialog>
  </template>
</template>


<style lang="scss" scoped>
.line {
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