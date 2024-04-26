<template>
  <div class="event list-layout">
    <div class="title">H5活动列表</div>
    <div class="search">
      <el-form :inline="true" :model="pageParams">
        <el-form-item>
          <el-select v-model="pageParams.playType" placeholder="玩法" @clear="clear" clearable>
            <el-option v-for="(item, key) in activities" :label="item" :value="key" />
          </el-select>
        </el-form-item>
        <el-form-item label="活动有效期">
          <el-date-picker v-model="pageParams.time" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="pageParams.activityName" placeholder="H5活动名称" clearable :suffix-icon="Search" />
        </el-form-item>
      </el-form>
      <el-button class="add" round type="primary" @click="async()=>{
          await getTemList();
          dialog = true
      }">新建H5活动</el-button>
    </div>
    <div class="content">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="activityId" label="H5活动ID" width="220" show-overflow-tooltip />
        <el-table-column prop="activityName" label="H5活动名称" width="220" show-overflow-tooltip />
        <el-table-column label="状态">
          <template #default="scope">
            <el-tag :type="activityStatus[scope.row.activityStatus].type">{{ activityStatus[scope.row.activityStatus].label }}</el-tag>
            <span></span>
          </template>
        </el-table-column>
        <el-table-column label="活动有效期" width="220">
          <template #default="scope">
            <div v-if="scope.row.activityBeginTime">
              <span>{{ scope.row.activityBeginTime }}至{{
                  scope.row.activityEndTime
                }}</span>
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="包含玩法" show-overflow-tooltip>
          <template #default="scope">
            <div>
              <span v-if="!scope.row.playTypeList.length">-</span>
              <span v-for="(item, key) in scope.row.playTypeList">{{
                activities[item]
              }}</span>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="活动链接" show-overflow-tooltip width="250">
          <template #default="scope">
            <span>{{ scope.row.diffuseUrl }}</span>
          </template>
        </el-table-column>
        <el-table-column label="二维码" width="120">
          <template #default="scope">
            <el-image preview-teleported style="width: 50px; height: 50px" :src="scope.row.diffuseCode" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2" :preview-src-list="[scope.row.diffuseCode]" :z-index="9999" fit="cover" />
            <div></div>
          </template>
        </el-table-column> -->

        <el-table-column prop="creatorName" label="创建人"  />
        <el-table-column prop="creatorName" label="操作" fixed="right" width="350">
          <template #default="scope">
            <el-space wrap>
  
              <el-button :disabled="![1,3,4].includes(scope.row.activityStatus)" link type="primary" @click="openUrl(scope.row.activityId,'true')">编辑</el-button>
            <el-link type="primary" @click="detailsData(scope.row)">查看详情</el-link>
            <el-button :disabled="![1,3,5].includes(scope.row.activityStatus)" link type="primary" @click="del(scope.row.activityId)">删除</el-button>
            <el-button :disabled="!([4,5].includes(scope.row.activityStatus))" link type="primary" @click="()=>{
              activityInfo = scope.row;
              dialogVisible = true;
            }">查看传播方式</el-button>
            <el-button link type="primary" @click="addTem(scope.row.activityId)">存为模板</el-button>
         </el-space>
         </template>
        </el-table-column>

        <template #empty>
          <el-empty :image="Maskgroup" :image-size="76">
            <template #description>
              暂无数据
            </template>
          </el-empty>
        </template>
      </el-table>
      <el-pagination background layout="prev, pager, next, jumper" :total="total" v-model:current-page="pageParams.pageNum" @current-change="handleCurrentChange" />
    </div>
    <el-dialog
    v-model="dialogVisible"
    title="传播链接"
    width="500"
  >
    <div>链接</div>
    <div class="mt-2">
      <el-input
        :readonly="true"
        :model-value="activityInfo.diffuseUrl"
        style="max-width: 600px"
        placeholder="链接"
      >
        <template #append>
          <el-button type="primary" @click="copyToClipboard(activityInfo.diffuseUrl)">
          复制
        </el-button>
        </template>
      </el-input>

    </div>
    <div class="my-2">二维码</div>
    <div class="flex items-center gap-3">
      <el-image preview-teleported style="width: 150px; height: 150px" :src="activityInfo.diffuseCode" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2" :preview-src-list="[activityInfo.diffuseCode]" :z-index="9999" fit="cover" />
      <a  :href="activityInfo.diffuseCode" download="二维码">
        <el-button :icon="Download" type="primary">下载</el-button>
      </a>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">
          返回
        </el-button>
      </div>
    </template>
  </el-dialog>
    <el-drawer v-model="dialog" title="新建H5活动" direction="rtl" size="50%">
      <div v-for="(item, key) in temList" :key="key">
        <div class="temTitle my-2">{{ item.playTypeName }}</div>
        <div class="grid grid-cols-3 gap-10">
          <div v-for="(i,k) in item.templateList" :key="k">
            <div class="temBox"  :style="{background:!i.templateCover&&'#353535'}" @click="openUrl(i.activityId,'')">
              <img v-if="i.templateCover" :src="i.templateCover" alt="" srcset="">
  
              <template v-else>
                <el-icon>
                  <Plus />
                </el-icon>
                <div class="creatTem">新建空白模板</div>
              </template>
              <div class="delTem" @click.stop="delTem(i.activityId,'')" v-if="i.activityId">
                <el-icon>
                  <Delete />
                </el-icon>
              </div>
            </div>
            <div class="text-center pt-2">
              {{ i.activityName }}
            </div>

          </div>

        </div>
      </div>
      <!-- <div class="temBox">
        <el-icon><Plus /></el-icon>
        <div class="creatTem">新建空白模板</div>
      </div> -->
      <template #footer>
        <div>
          <el-button @click="dialog = false">返回</el-button>
          <el-button type="primary" @click="dialog = false">保存</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, watch, onMounted, watchEffect, Ref } from "vue";
import {
  pageActivityList,
  saveActivityTemplate,
  deleteActivityInfo,
  listActivityTemplate,
  queryDict,
} from "~/api/activity";
import dayjs from "dayjs";
import { Search,Download } from "@element-plus/icons-vue";
import Maskgroup from "~/assets/icon/Maskgroup.png";

import { useRouter, useRoute } from "vue-router";
import { ElMessageBox, ElMessage } from "element-plus";
const router = useRouter();
let BaseUrl = ref("");
let activityInfo = ref({});
let dialogVisible = ref(false);
queryDict().then((res) => {
  BaseUrl.value = res.data[0].domain;
});
interface ActivityTypes {
  [key: string]: string;
}

function copyToClipboard(text:string) {
  // 创建一个临时的输入框来存储要复制的文本
  var input = document.createElement('input');
  input.value = text;
 
  // 将输入框添加到页面中
  document.body.appendChild(input);
 
  // 选中输入框的内容
  input.select();
 
  // 执行复制操作
  document.execCommand('copy');
  ElMessage.success("复制成功！");
 
  // 移除临时输入框
  document.body.removeChild(input);
}

const activities: ActivityTypes = {
  "1": "问卷玩法",
  "2": "抽奖玩法",
  "3": "签到玩法",
  "4": "任务玩法",
  "5": "领奖玩法",
  "6": "表单组件",
};

const activityStatus = {
  1: {
    label: "草稿",
    type: "info",
  },
  2: {
    label: "待审批",
    type: "success",
  },
  3: {
    label: "审核不通过",
    type: "danger",
  },
  4: {
    label: "运行中",
    type: "primary",
  },
  5: {
    label: "已结束",
    type: "info",
  },
};

const handleCurrentChange = (e: any) => {
  pageParams.pageNum = e;
  getActivityList();
  console.log(e);
};
const openUrl = (id: string, type: string) => {
  window.open(`${BaseUrl.value}/#/?id=${id}&type=${type}`, "_blank");
};
const detailsData = async (row: any) => {

  console.log(`output->row`,row)
  router.push(`/activityCenter/details/${row.activityId}`);
};
let pageParams = reactive({
  pageNum: 1,
  pageSize: 10,
  time: "",
  activityBeginTime: "",
  activityEndTime: "",
  activityStatus: "",
  activityName: "",
  playType: "",
});

let tableData = ref([]);
let total = ref(0);
const dialog = ref(false);

const getActivityList = async () => {
  const { data } = await pageActivityList(pageParams);
  tableData.value = data.records;
  total.value = data.total;
};
interface TempTypes {
  playTypeName: string;
  templateList: TempChild[];
}
interface TempChild {
  diffuseUrl: string;
  templateCover: string;
}
let temList = ref([] as TempTypes[]);
const getTemList = async () => {
  const { data }: { data: TempTypes[] } = await listActivityTemplate();
  // temList = res.data;
  temList.value = data.map((item) => {
    if (!item.playTypeName) {
      item.templateList.unshift({
        diffuseUrl: `${BaseUrl.value}/#/`,
        templateCover: "",
      });
    }
    return item;
  });
  console.log(data, "ppp");
};
onMounted(() => {
  getActivityList();
});
const addTem = async (activityId: number) => {
  ElMessageBox.prompt('模板名称', '存为模板', {
    confirmButtonText: '保存',
    cancelButtonText: '取消',
  })
    .then(async({ value }) => {
      try {
    let res = await saveActivityTemplate({
      activityId,
      templateFlag: true,
      activityName:value
    });
    if (res) {
      console.log(res, "ppp");
      ElMessage.success("添加成功");
    }
  } catch (error) {
    console.log(error);
    ElMessage.error("添加失败");
  }
    })
    .catch(() => {
      
    })
  
};
const del = async (activityId: number) => {
  ElMessageBox.alert("活动删除后将无法恢复", "确认删除", {
    showCancelButton: true,
    roundButton: true,
    cancelButtonClass: "pd-button",
    confirmButtonClass: "pd-button",
    customClass: "delete-modal",
  }).then(async () => {
    try {
      let res = await deleteActivityInfo({
        activityId,
      });
      if (res) {
        console.log(res, "ppp");
        ElMessage.success("删除成功");
        pageParams.pageNum = 1;
        getActivityList();
      }
    } catch (error) {
      console.log(error);
      ElMessage.error("删除失败");
    }
  });
};

const delTem = async (activityId: number) => {
  ElMessageBox.alert("模板删除后将无法恢复", "确认删除", {
    showCancelButton: true,
    roundButton: true,
    cancelButtonClass: "pd-button",
    confirmButtonClass: "pd-button",
    customClass: "delete-modal",
  }).then(async () => {
    try {
      let res = await saveActivityTemplate({
        activityId,
        templateFlag: false,
      });
      if (res) {
        console.log(res, "ppp");
        ElMessage.success("删除成功");
        pageParams.pageNum = 1;
        getTemList();
      }
    } catch (error) {
      console.log(error);
      ElMessage.error("删除失败");
    }
  });
};
watch(
  () => pageParams.time,
  (newVal) => {
    if (newVal) {
      pageParams.activityBeginTime = dayjs(newVal[0]).format("YYYY-MM-DD");
      pageParams.activityEndTime = dayjs(newVal[1]).format("YYYY-MM-DD");
    } else {
      pageParams.activityBeginTime = "";
      pageParams.activityEndTime = "";
    }
    pageParams.pageNum = 1;
    getActivityList();
    console.log(newVal, "newVal");
  }
);
watch([() => pageParams.playType, () => pageParams.activityName], (newVal) => {
  pageParams.pageNum = 1;
  getActivityList();
  console.log(newVal, "newVal");
});

const clear = () => {
  pageParams.playType = "";
};
</script>

<style lang="scss">
@import "~/styles/list-layout.scss";

.event {
  .attr-content {
    margin-top: 24px;

    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      .text {
        font-size: 14px;
        font-weight: 400;
        line-height: 32px;
      }
    }

    .el-table {
      border-radius: 0;

      .el-table__cell {
        background-color: rgba(242, 244, 248, 1);
      }
    }
  }
}
.add {
  background: linear-gradient(rgb(32, 92, 203) 0%, rgb(89, 143, 241) 100%);
  transition: 0.25s;
}
.temBox {
  position: relative;
  //width: 212px;
  height: 377px;
  // background: #353535;
  box-shadow: 0px 20px 50px 0px rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  border: 1px solid #ccc;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  cursor: pointer;
  .creatTem {
    margin-top: 8px;
    font-size: 14px;
  }
  img {
    width: 100%;
    height: 100%;
    border-radius: 8px;
  }
}
.delTem {
  position: absolute;
  right: 10px;
  top: 10px;
  font-size: 20px;
  color: #333;
  cursor: pointer;
  background-color: #fff;
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
}
</style>
