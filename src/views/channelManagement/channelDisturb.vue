<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { getGlobalDisturbDetail, getBlackList } from "~/api/index";
import CustomEventComponent from "~/components/CustomEventComponent.vue";
import API from "~/api/channelManagement";
import { ElMessage } from "element-plus";
import { dictFilterTree } from "~/api/index";
// 定义名称固定顺序
const nameOrder: string[] = ["APP PUSH", "手机短信", "企微", "外呼", "站内信"];

// const types = [
//   {
//     type: "appPush",
//     name: "APP PUSH",
//   },
//   {
//     type: "digital",
//     name: "企微",
//   },
//   {
//     type: "outbound",
//     name: "外呼",
//   },
//   {
//     type: "sms",
//     name: "手机短信",
//   },
//   {
//     type: "znx",
//     name: "站内信",
//   },
// ];

// onMounted(async () => {
//   getDictmaterialType();
// });
const tableData = ref<any[]>([]);
const materialTypesList = ref<any>();
const dialogVisible = ref<boolean>(false);
const dialogOptions = ref<{ type: "update" | "detail" } & any>({});
const blackListFields = ref();

!(async () => {
  const res: any = await getBlackList({});

  if (res.data) {
    blackListFields.value = res.data;

    transformBlackListData();
  }
})();
const blackList = ref<Array<any>>([]);

watch(
  () => blackList.value,
  (val) => {
    if (!val?.length) return;

    dialogOptions.value.data.blacklistList = blackList.value.map((item) => {
      const res = [...blackListFields.value.records].find(
        (each) => +each.id === +item
      );

      if (!res) return;

      return {
        id: res.id,
        blacklistName: res.blacklistName,
      };
    });

    console.log("233", dialogOptions.value.data);
  },
  { immediate: true }
);

function transformBlackListData() {
  blackList.value.length = 0;

  if (dialogOptions.value.data?.blacklistList?.length) {
    [...dialogOptions.value.data.blacklistList].forEach((item) => {
      if (!item) return;
      blackList.value.push(item.id);
    });
  }
}
onMounted(async () => {
  fetchDataApi();
});

const fetchDataApi = async () => {
  tableData.value=[]
  const res: any = await dictFilterTree();
  let { materialTypes } = res?.data;
  let getDictmaterialList = [];
  materialTypesList.value = materialTypes;
  getDictmaterialList = materialTypes.map(
    (item: { code: any; message: any }) => {
      return {
        type: item.code,
        name: item.message,
      };
    }
  );

  console.log(getDictmaterialList, "materialType");

  [...getDictmaterialList].forEach(async (item) => {
    const res: any = await getGlobalDisturbDetail({ type: item.type });

    const obj = reactive({
      ...res.data,
      originData: Object.freeze(res.data),
      name: item.name,
    });

    Object.defineProperty(obj, "$blacklistLimit", {
      enumerable: true,
      get() {
        return String(+obj.blacklistLimit);
      },
      set(val) {
        obj.blacklistLimit = val;
      },
    });

    Object.defineProperty(obj, "$touchLimit", {
      enumerable: true,
      get() {
        return String(+obj.touchLimit);
      },
      set(val) {
        obj.touchLimit = val;
      },
    });

    Object.defineProperty(obj, "$disturbLimit", {
      enumerable: true,
      get() {
        return String(+obj.disturbLimit);
      },
      set(val) {
        obj.disturbLimit = val;
      },
    });

    const { startDate, endDate } = obj;

    obj.$date = ref([startDate, endDate]);

    watch(
      () => obj.$date.value,
      () => {
        if (obj.$date.value?.length === 2) {
          obj.startTime = obj.$date.value[0];
          obj.endTime = obj.$date.value[1];

          console.log("test demo", obj);
        }
      }
    );

    // console.log(obj, tableData);
    tableData.value.push(obj);
    // 根据名称固定顺序对tableData进行排序
    tableData.value = tableData.value.sort((a, b) => {
      return nameOrder.indexOf(a.name) - nameOrder.indexOf(b.name);
    });
  });
};
function updateData(data: any) {
  Object.assign(dialogOptions.value, {
    type: "update",
    disabled: false,
    data,
  });

  transformBlackListData();

  console.log(blackList);

  dialogVisible.value = true;
}

function detailsData(data: any) {
  Object.assign(dialogOptions.value, {
    type: "detail",
    disabled: true,
    data,
  });

  transformBlackListData();

  dialogVisible.value = true;
}

const onSubmit = async () => {
  let res: any;

  // 替换字段并进行值转换
  const modifiedData = { ...dialogOptions.value.data };
  console.log("modifiedData",dialogOptions.value.data, modifiedData);
  debugger
  modifiedData.touchLimit =
    (dialogOptions.value.$touchLimit == "1" ||
    dialogOptions.value.$touchLimit == null)
      ? false
      : dialogOptions.value.$touchLimit;
  modifiedData.disturbLimit =
    (dialogOptions.value.$disturbLimit == "1" ||
    dialogOptions.value.$disturbLimit == null)
      ? false
      : dialogOptions.value.$disturbLimit;
  modifiedData.blacklistLimit =
(    dialogOptions.value.$blacklistLimit == "1" ||
    dialogOptions.value.$blacklistLimit == null)
      ? false
      : dialogOptions.value.$blacklistLimit;
  // 如果 startDate 和 endDate 字段为 null，则将 $date 字段的值赋给它们
  if (modifiedData.startDate === null && modifiedData.endDate === null) {
    if (dialogOptions.value.data.$date.length === 2) {
      modifiedData.startDate = dialogOptions.value.data.$date[0];
      modifiedData.endDate = dialogOptions.value.data.$date[1];
    }
  }
  delete modifiedData.$touchLimit;
  delete modifiedData.$disturbLimit;
  delete modifiedData.$blacklistLimit;
  delete modifiedData.originData;
  delete modifiedData.$date;

  // 如果 type 字段为 null，则查找并设置其值
  if (modifiedData.type === null) {
    const matchedType = materialTypesList.value.find(
      (item: { code: string; message: string }) =>
        item.message === modifiedData.name
    );
    if (matchedType) {
      modifiedData.type = matchedType.code;
    }
  }
  res = await API.updateGlobalDisturb({
    ...modifiedData,
  });

  if (res.data) {
    ElMessage({
      message: "修改成功！",
      type: "info",
    });
    dialogVisible.value=false;
    fetchDataApi();

    // location.reload();
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
            {{ row.originData.touchLimit ? '限制' : '不限制' }}
          </template>
        </el-table-column>
        <el-table-column label="勿扰时段是否限制">
          <template #default="{ row }">
            {{ row.originData.disturbLimit ? '限制' : '不限制' }}
          </template>
        </el-table-column>

        <el-table-column label="过滤黑名单" prop="usedCount">
          <template #default="{ row }">
            <!-- <span>{{ row.blacklistList?.length || '-' }}</span> -->
            <span>{{ row.originData.blacklistLimit ? "过滤" : '不过滤' }}</span>
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
    <el-dialog :title="dialogOptions?.type === 'update' ? '编辑渠道勿扰设置' : '查看渠道勿扰设置'" align-center v-model="dialogVisible" append-to-body>
      <div class="line">
        <span>1.每个客户触达次数限制：</span>
        <span>
          <el-radio-group :disabled="dialogOptions?.disabled" v-model="dialogOptions.data.$touchLimit" class="ml-4">
            <el-radio label="1">不限制</el-radio>
            <el-radio label="0">限制</el-radio>
          </el-radio-group>
        </span>
      </div>
      <div class="line" v-if="dialogOptions.data.$touchLimit == '0'">
        <span>当前渠道客户
          <el-input-number v-model="dialogOptions.data.limitDay" :disabled="dialogOptions?.disabled" :min="1" placeholder="填写次数" style="width: 120px" controls-position="right" />&nbsp;天内，最多通过营销平台触达
          <el-input-number v-model="dialogOptions.data.limitCount" :disabled="dialogOptions?.disabled" :min="1" placeholder="填写次数" style="width: 120px" controls-position="right" />&nbsp;次
        </span>
      </div>
      <div class="line">
        <span>2.勿扰时段限制：</span>
        <span>
          <el-radio-group :disabled="dialogOptions?.disabled" v-model="dialogOptions.data.$disturbLimit" class="ml-4">
            <el-radio label="1">不限制</el-radio>
            <el-radio label="0">限制</el-radio>
          </el-radio-group>
        </span>
      </div>
      <div v-if="dialogOptions.data.$disturbLimit == '0'" class="line">
        <el-time-picker is-range value-format="HH:mm" format="HH:mm" style="width: 200px" v-model="dialogOptions.data.$date" :disabled="dialogOptions?.disabled" type="daterange" unlink-panels range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" />&nbsp;
        <span>为该渠道的默认勿扰时段
        </span>
      </div>
      <div class="line">
        3.过滤黑名单
        <el-select :disabled="dialogOptions?.disabled" v-model="dialogOptions.data.$blacklistLimit" style="width: 100px">
          <el-option value="1" label="不过滤">不过滤</el-option>
          <el-option value="0" label="过滤">过滤</el-option>
        </el-select>
        &nbsp;
        <el-select collapse-tags :disabled="dialogOptions?.disabled" placeholder="请选择" v-model="blackList" multiple  v-if="dialogOptions.data.$blacklistLimit == '0'" style="width: 300px">
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
        <el-button v-if="dialogOptions?.type !== 'detail'" @click.prevent="onSubmit()" round type="primary">保存</el-button>

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