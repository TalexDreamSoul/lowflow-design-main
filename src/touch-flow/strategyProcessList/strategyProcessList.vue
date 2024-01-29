<script setup lang="tsx">
import { ElTag } from 'element-plus'
import { getqryMarketingTouch,  deleteMarketingTouch } from '~/api/index'
import { ref, unref, reactive } from 'vue'

const ids = ref<string[]>([])

const formInline = reactive({
  touchName: '',
  executeType: '',
  beginTime: '',
  endTime: '',
  status: '',

})
import { id } from 'element-plus/es/locale'

import { Timer } from '@element-plus/icons-vue'

interface User {
  touchName: string,
  executeType: string,
  beginTime: string,
  endTime: string,
  status: string,
}

const handleEdit = (index: number, row: User) => {
  console.log(index, row)
}
const handleDelete = (index: number, row: User) => {
  console.log(index, row)
}

const statusLabels= {
        "draft": "草稿",
        "approvalPending": "待审批",
        "approvalSuccess": "审批成功",
        "approvalRefuse": "审批拒绝",
        "waitStart": "等待启动",
        "running": "发送中",
        "suspend": "暂停",
        "done": "已结束"
      }
      const typeMap= {
        "immediately": "定时-单次",
        "delayed": "定时-重复",
        "trigger": "触发型",
      }
let tableData = reactive([
  {
    id:'id',
    startTime: '2016-05-03',
    endTime: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
    status: 'approvalPending',
    executeType: 'immediately',
    total: '20%',
    totalCount: '19508313 / 10220792 / 1627356',
    founder: 'lvlvlv',
  }, {
    id:'id',
    startTime: '2016-05-03',
    endTime: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
    status: 'approvalPending',
    executeType: 'immediately',
    total: '20%',
    totalCount: '19508313 / 10220792 / 1627356',
    founder: 'lvlvlv',
  }, {
    id:'id',
    startTime: '2016-05-03',
    endTime: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
    status: 'approvalPending',
    executeType: 'immediately',
    total: '20%',
    totalCount: '19508313 / 10220792 / 1627356',
    founder: 'lvlvlv',
  }, {
    id:'id',
    startTime: '2016-05-03',
    endTime: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
    status: 'approvalPending',
    executeType: 'immediately',
    total: '20%',
    totalCount: '19508313 / 10220792 / 1627356',
    founder: 'lvlvlv',
  },
])
const currentPage = ref(0)
const pageSize = ref(10)

const  fetchDataApi= async () => {
    const res = await getqryMarketingTouch({
      pageNum: unref(currentPage),
      pageSize: unref(pageSize),
      ...unref(formInline)
    })
    tableData=res.data.list
    //  {
    //   list: res.data.list,
    //   total: res.data.total
    // }
  }
const  fetchDelApi= async () => {
    const res = await delTableListApi(unref(ids))
    return !!res
  }

const setSearchParams = () => {
  console.log(`output->`,formInline)
  fetchDataApi()
}



const currentRow = ref<User | null>(null)
const actionType = ref('')
const AddAction = () => {
}

const delLoading = ref(false)

const delData = async (row:any) => {
  delLoading.value = true
  await deleteMarketingTouch({id:row.id}).finally(() => {
    delLoading.value = false
  })
}
const action = (row: User, type: string) => {
  
}
  const currentPage4 = ref(4)
  const pageSize4 = ref(100)
  const small = ref(false)
const background = ref(false)
const disabled = ref(false)
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}
</script>

<template>
  <div class="warp">
    <div class="pageTitle">策略流程列表</div>
    <div class="topSearch">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-select v-model="formInline.executeType" clearable style="width:200px">
            <el-option label="策略流程类型" value="shanghai" />
            <el-option label="Zone two" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="formInline.beginTime" type="date" placeholder="Pick a date" clearable />
          <el-date-picker v-model="formInline.endTime" type="date" placeholder="Pick a date" clearable />
        </el-form-item>
        <el-form-item>
          <el-input v-model="formInline.touchName" placeholder="请输入策略流程名称" clearable style="width:200px" />
        </el-form-item>

      </el-form>
      <div>
        <el-button type="primary" @click="AddAction" class="add" round>新建策略流程</el-button>
      </div>
    </div>

    <div class="tableCard">
      <div class="countCard">
        <div class="showCount allcount">
          <div class="topcount">40</div>
          <div class="undercount">全部</div>
        </div>
        <div class="showCount">
          <div class="topcount">24</div>
          <div class="undercount">运行中</div>
        </div>
        <div class="showCount">
          <div class="topcount">12</div>
          <div class="undercount">暂停中</div>
        </div>
        <div class="showCount">
          <div class="topcount">0</div>
          <div class="undercount">待审批</div>
        </div>
        <div class="showCount">
          <div class="topcount">2</div>
          <div class="undercount">已结束</div>
        </div>
        <div class="showCount">
          <div class="topcount">2</div>
          <div class="undercount">草稿</div>
        </div>
        <div class="showCount">
          <div class="topcount">2</div>
          <div class="undercount">审核不通过</div>
        </div>
      </div>
      <el-table :data="tableData" style="width: 100% ----el-table-header-bg-color: #F2F4F8;--el-table-header-bg-color: #F2F4F8;">
        <el-table-column label="策略流程ID" width="180">
          <template #default="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column label="名称" width="180">
          <template #default="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>

        <el-table-column label="状态" width="180">
          <template #default="scope">

            <el-popover effect="light" trigger="hover" placement="top" width="auto">
              <template #default>
                {{ scope.row.status }}
              </template>
              <template #reference>
                <el-tag>{{ statusLabels[scope.row.status] }}</el-tag>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="起止日期" width="280">
          <template #default="scope">
            {{ scope.row.startTime }}~{{ scope.row.endTime }}
          </template>
        </el-table-column>

        <el-table-column label="起止日期" width="180">
          <template #default="scope">
            {{ typeMap[scope.row.executeType] }}
          </template>
        </el-table-column>

        <el-table-column label="目标完成率" width="180">
          <template #default="scope">
            {{ scope.row.total }}
          </template>
        </el-table-column>

        <el-table-column label=" 累计进入 / 累计触发 / 累计目标完成" width="180">
          <template #default="scope">
            {{ scope.row.totalCount }}
          </template>
        </el-table-column>

        <el-table-column label="创建人" width="180">
          <template #default="scope">
            {{ scope.row.founder }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="280" fixed="right">
          <template #default="scope">
            <el-button type="primary" @click="action(scope.row, 'edit' )">
              edit
            </el-button>
            <el-button type="success" @click="action(scope.row, 'detail' )">
              detail
            </el-button>
            <el-button type="danger" @click="delData(scope.row)">
              del
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="currentPage4" v-model:page-size="pageSize4" :page-sizes="[100, 200, 300, 400]" :small="small" :disabled="disabled" :background="background" layout="total, sizes, prev, pager, next, jumper" :total="400" @size-change="handleSizeChange" @current-change="handleCurrentChange" class="pagination" />

    </div>

  </div>

</template>
<style lang="scss" scoped>
.warp {
  background: linear-gradient(
    to bottom,
    #eeeff6,
    rgba(56, 128, 228, 0.1098039216)
  );
  padding: 24px 40px;
  height: 90vh;
}
.tableCard {
  background: #ffffff;
  box-shadow: 0px 20px 50px 0px rgba(0, 0, 0, 0.02);
  border-radius: 8px 8px 8px 8px;
  opacity: 1;
  padding: 24px 24px 80px 24px;
}
.pagination {
  margin-top: 24px;
  float: right;
}
.pageTitle {
  font-size: 20px;
  font-weight: 500;
  color: #000000;
  margin-bottom: 12px;
}
.topSearch {
  display: flex;
  justify-content: space-between;
}
.add {
  pointer-events: none;
  background: linear-gradient(rgb(32, 92, 203) 0%, rgb(89, 143, 241) 100%);
  transition: 0.25s;
}
.countCard {
  display: flex;
  justify-content: flex-start;
}
.showCount {
  width: 100px;
  height: 50px;
  margin-right: 16px;

  background: linear-gradient(
    180deg,
    #f2f4f8 0%,
    rgba(242, 244, 248, 0.4) 100%
  );
  border-radius: 8px 8px 8px 8px;
  opacity: 1;
  margin-bottom: 24px;
  padding: 24px;

  color: rgba(0, 0, 0, 0.9);
  .topcount {
    font-size: 32px;
    font-weight: 800;
  }
  .undercount {
    font-weight: 400;
    font-size: 14px;
    color: #7F8080;
  }
}

.allcount {
  background: #4078e0;
  color: #ffffff;
  .undercount {
    font-weight: 400;
    font-size: 14px;
    color: #BED1F4;
  }
}
</style>