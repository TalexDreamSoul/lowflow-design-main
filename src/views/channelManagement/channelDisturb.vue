<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { getGlobalDisturbDetail, getBlackList } from "~/api/index";
import CustomEventComponent from "~/components/CustomEventComponent.vue";
import API from "~/api/channelManagement";
import { ElMessage } from "element-plus";
import { dictFilterTree } from "~/api/index";
// 定义名称固定顺序
const nameOrder: string[] = ["APP PUSH", "手机短信", "企微", "外呼", "站内信"];


const tableData = ref<any[]>([]);
const OptionsData = ref<any>({});
const materialTypesList = ref<any>();
const dialogVisible = ref<boolean>(false);
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

    OptionsData.value.data.blacklistList = blackList.value.map((item) => {
      const res = [...blackListFields.value.records].find(
        (each) => +each.id === +item
      );

      if (!res) return;

      return {
        id: res.id,
        blacklistName: res.blacklistName,
      };
    });

    console.log("233", OptionsData.value.data);
  },
  { immediate: true }
);

function transformBlackListData() {
  blackList.value.length = 0;

  if (OptionsData.value.data?.blacklistList?.length) {
    [...OptionsData.value.data.blacklistList].forEach((item) => {
      if (!item) return;
      blackList.value.push(item.id);
    });
  }
}
onMounted(async () => {
  fetchDataApi();
});

const fetchDataApi = async () => {
  tableData.value = [];
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
    const { startDate, endDate } = obj;

    obj.date = ref([startDate, endDate]);

    watch(
      () => obj.date.value,
      () => {
        if (obj.date.value?.length === 2) {
          obj.startTime = obj.date.value[0];
          obj.endTime = obj.date.value[1];

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
  data.touchLimit = !data.touchLimit?false:data.touchLimit;
  data.disturbLimit = !data.disturbLimit?false:data.disturbLimit;
  data.blacklistLimit = !data.blacklistLimit?false:data.blacklistLimit;
  OptionsData.value={
    type: "update",
    disabled: false,
    data,
  }

  transformBlackListData();

  // console.log(blackList,OptionsData.value,data);

  dialogVisible.value = true;
}

function detailsData(data: any) {
  data.touchLimit = !data.touchLimit?false:data.touchLimit;
  data.disturbLimit = !data.disturbLimit?false:data.disturbLimit;
  data.blacklistLimit = !data.blacklistLimit?false:data.blacklistLimit;
  OptionsData.value={
    type: "update",
    disabled: true,
    data,
  }

  transformBlackListData();

  dialogVisible.value = true;
}

const onSubmit = async () => {
  let res: any;

  // 替换字段并进行值转换
  const modifiedData = { ...OptionsData.value.data };
  // console.log(
  //   "modifiedData",
  //   OptionsData.value.data,
  //   modifiedData,
  //   OptionsData.value.$touchLimit
  // );
  // 如果 startDate 和 endDate 字段为 null，则将 $date 字段的值赋给它们
  if (modifiedData.date.length == 2) {
      modifiedData.startDate = modifiedData.date[0];
      modifiedData.endDate = modifiedData.date[1];
    }

  // 如果 type 字段为 null，则查找并设置其值
  if (!modifiedData.type) {
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
    dialogVisible.value = false;
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
    <el-dialog :title="OptionsData?.type === 'update' ? '编辑渠道勿扰设置' : '查看渠道勿扰设置'" align-center v-model="dialogVisible" append-to-body>
      <div class="line">
        <span>1.每个客户触达次数限制：</span>
        <span>
        <el-select :disabled="OptionsData?.disabled" v-model="OptionsData.data.touchLimit" class="ml-4" style="width: 100px">
          <el-option :value="false" label="不限制">不限制</el-option>
          <el-option :value="true" label="限制">限制</el-option>
        </el-select>
        </span>
      </div>
      <div class="line" v-if="OptionsData.data.touchLimit ">
        <span>当前渠道客户
          <el-input-number v-model="OptionsData.data.limitDay" :disabled="OptionsData?.disabled" :min="1" placeholder="填写次数" style="width: 120px" controls-position="right" />&nbsp;天内，最多通过营销平台触达
          <el-input-number v-model="OptionsData.data.limitCount" :disabled="OptionsData?.disabled" :min="1" placeholder="填写次数" style="width: 120px" controls-position="right" />&nbsp;次
        </span>
      </div>
      <div class="line">
        <span>2.勿扰时段限制：</span>
        <span>
        <el-select :disabled="OptionsData?.disabled" v-model="OptionsData.data.disturbLimit" class="ml-4" style="width: 100px">
          <el-option :value="false" label="不限制">不限制</el-option>
          <el-option :value="true" label="限制">限制</el-option>
        </el-select>
        </span>
      </div>
      <div v-if="OptionsData.data.disturbLimit" class="line">
        <el-time-picker is-range value-format="HH:mm" format="HH:mm" style="width: 200px" v-model="OptionsData.data.date" :disabled="OptionsData?.disabled" type="daterange" unlink-panels range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" />&nbsp;
        <span>为该渠道的默认勿扰时段
        </span>
      </div>
      <div class="line">
        3.过滤黑名单
        <el-select :disabled="OptionsData?.disabled" v-model="OptionsData.data.blacklistLimit" style="width: 100px">
          <el-option :value="false" label="不过滤">不过滤</el-option>
          <el-option :value="true" label="过滤">过滤</el-option>
        </el-select>
        &nbsp;
        <el-select collapse-tags :disabled="OptionsData?.disabled" placeholder="请选择" v-model="blackList" multiple v-if="OptionsData.data.blacklistLimit " style="width: 300px">
          <el-option v-for="item in blackListFields.records" :value="item.id" :label="item.blacklistName">
            <span>{{ item.blacklistName }}</span>
            <!-- <p>{{ item.blacklistDesc }}</p> -->
          </el-option>
        </el-select>
      </div>

      <template #footer>
        <el-button @click="dialogVisible = false" round>
          {{ OptionsData?.type === 'detail' ? '返回' : '取消' }}
        </el-button>
        <el-button v-if="OptionsData?.type !== 'detail'" @click.prevent="onSubmit()" round type="primary">保存</el-button>

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