<template>
  <van-nav-bar title="过程管理" left-text="返回" left-arrow @click-left="onClickLeft" style="--van-nav-bar-background:#0077EB;--van-nav-bar-text-color:#fff;--van-nav-bar-title-text-color:#fff;--van-nav-bar-icon-color:#fff" />

  <van-dropdown-menu>
    <van-dropdown-item v-model="formInline.createUserId" @change="changeCreateUser" :options="option1" />
  </van-dropdown-menu>
  <van-search v-model="formInline.createUserId" show-action placeholder="请输入搜索关键词" @search="onSearch" @cancel="onCancel" />
  <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" style="margin: 12px;" @load="onLoad">

    <van-space direction="vertical" fill>
      <div v-for="item in list" :key="item">
        <div class="customer-list">
          <div class="list-user">
            <div class="UserImg">
              <van-icon name="contact" color="#0077EB" />

            </div>
            <div class="UserName">
              {{item?.fullName}}
            </div>
            <van-tag type="primary" small class="van-tag--primary">{{item?.identity?item?.identity:"客户"}}</van-tag>
            <!-- <div  >{{item?.identity?item?.identity:"--"}}</div> -->
          </div>
          <van-divider />
          <div class="list-content">
            <div>

              <span class="liSpan">
                客户简称：
              </span> {{item.identity}}<br />
              <span class="liSpan">
                电话：
              </span>
              {{item.telephone}}<br />

              <span class="liSpan">
                职务：
              </span>
              {{item.createUserId}}<br />

              <span class="liSpan">
                部门：
              </span>
              {{item.department}}<br />
              <span class="liSpan">
                创建人：
              </span>

              {{item.createUserId}}
            </div>
            <div>
              <van-space>

                <van-button size="mini"><van-icon name="records-o" /></van-button>
                <van-button size="mini"><van-icon name="edit" /></van-button>
              </van-space>
            </div>
          </div>
        </div>
      </div>
    </van-space>
  </van-list>

</template>
  <script setup lang="ts">
import { computed, ref, unref, inject, reactive, onMounted, watch } from "vue";
import { getCustomerInfos, getCreateUserIds } from "@/api/index";
import { showToast } from "vant";
const list = ref([]);
const loading = ref(false);
const finished = ref(false);
const onClickLeft = () => history.back();
const pageNum = ref(1);
const pageSize = ref(10);
const formInline = reactive({
  createUserId: "",
  endTime: "",
  startTime: "",
});
const value2 = ref("a");
const option1 = ref([{ text: "创建人", value: "" }]);

const onLoad = () => {
  // 异步更新数据
  getCustomerList();
};
onMounted(() => {
  getCreateUsers();
});
watch([formInline], () => {
  getCustomerList();
});
const getCreateUsers = async () => {
  const res = await getCreateUserIds();

  if (res.data) {
    let opt = [{ text: "创建人", value: "" }];
    res.data.forEach((element) => {
      opt.push({ text: element, value: element });
    });
    option1.value = opt;
    console.log(`output->res`, res.data, opt);
  }
};
const getCustomerList = async () => {
  const res = await getCustomerInfos({
    pageNum: unref(pageNum),
    pageSize: unref(pageSize),
    ...formInline,
  });

  if (res.data) {
    list.value = res.data.records;
  }
  console.log(`output->res`, res.data.records);
  // 数据全部加载完成
  if (list.value.length >= res.data.total) {
    finished.value = true;
  }
  loading.value = false;
};
const onSearch = (val) => {};

const changeCreateUser = (val) => {
  formInline.createUserId = val;
  // Object.assign(formInline.createUserId, val)

  console.log(`output->val`, val, formInline.createUserId);
};

const onCancel = () => showToast("取消");
</script>
  <style scoped>
.customer-list {
  width: 100%;
  background: #fff;
  border-radius: 6px;
}
.list-user {
  padding-bottom: 12px;
  margin-bottom: 12px;
  display: flex;
  line-height: 2rem;
  font-weight: 500;
  padding: 24px 24px 0 24px;
}
.list-content {
  display: flex;
  justify-content: space-between;
  color: #333;
  padding: 0 24px 24px 24px;
  font-size: 14px;
}
.UserImg {
  height: 2rem;
  width: 2rem;
  background: aliceblue;
  line-height: 2rem;
  border-radius: 20px;
  text-align: center;
  margin-right: 12px;
}
.UserName {
  flex: 1;
}
.van-tag--primary {
  height: 18px;
  zoom: 0.9;
}
.liSpan {
  color: #666;
  display: inline-block;
  width: 80px;
}
</style>
  