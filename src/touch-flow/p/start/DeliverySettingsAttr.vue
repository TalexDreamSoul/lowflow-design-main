<script setup lang="ts">
import { inject, ref, reactive, watchEffect, computed } from "vue";
import { ElMessage } from "element-plus";
import { randomStr } from "~/utils/common";
import { markRaw } from "vue";
import { Delete } from '@element-plus/icons-vue'

const origin = {
  nodeName: "",
  nodeType: "diversion",
  height: 200,
  nodeId: "",
  branches: [
    { nodeName: "流量策略器1", ratio: 50, children: [] },
    { nodeName: "流量策略器2", ratio: 50, children: [] },
  ]
};

const props = defineProps<{
  p: any;
}>();

const { children } = props.p

const sizeForm = reactive<typeof origin>(origin);

!(children.length && (() => {
  origin.branches = []

  children.forEach((child: any) => {
    origin.branches.push({
      nodeName: child.nodeName,
      ratio: child.ratio,
      children: child.children
    });
  });
})())

watchEffect(() => {
  const { nodeType, nodeId } = props.p

  if ( nodeType !== 'diversion' ) return

  if (nodeId) {
    sizeForm.nodeId = nodeId;
  }
})

const totalRatio = computed(() => sizeForm.branches.reduce((acc: number, curVal) => acc + +curVal.ratio, 0))

function saveData() {
  if (!sizeForm.nodeName) {
    ElMessage.warning({
      message: "请输入流量策略器名称",
    });

    return false;
  }

  // validate branch ratio summary
  if (totalRatio.value !== 100) {
    ElMessage.warning({
      message: "流量配比必须为100",
    });

    return false;
  }

  const _map: any = {}
  if (sizeForm.branches.filter(branch => (branch.ratio === 0 || branch.nodeName.length < 1) || ((m: any) => m[branch.nodeName] === 1 ? true : ((m[branch.nodeName] = 1) && false))(_map)).length) {
    ElMessage.warning({
      message: "不能存在重复、未命名或配比为0%的流量",
    });

    return false;
  }

  const _: any = { nodeId: "", children: [] };
  Object.assign(_, sizeForm)

  Object.defineProperty(_, 'father', {
    value: markRaw(props.p),
    enumerable: false
  })

  // transform branch prop 2 children prop
  sizeForm.branches.forEach((branch) => {
    const child = {
      nodeType: "subDiversion",
      nodeName: branch.nodeName,
      ratio: branch.ratio,
      nodeId: randomStr(12),
      children: branch.children || [],
      // father: _
    }

    Object.defineProperty(child, 'father', {
      value: markRaw(_),
      enumerable: false
    })

    _.children.push(child)
  });

  if (sizeForm.nodeId === _.nodeId && sizeForm.nodeId.length) {

      Object.assign(props.p, _)

  }

  else /* if (!_.id?.length)  */{
    _.nodeId = randomStr(12)

    props.p.children.push(_);

    window.$refreshLayout()
  }

  return true;
}

type IRegSaveFunc = (regFunc: () => boolean) => void;
const regSaveFunc: IRegSaveFunc = inject("save")!;
regSaveFunc(saveData);

const addBranch = () => {
  sizeForm.branches.push({ nodeName: "流量策略器" + (sizeForm.branches.length + 1), ratio: 0, children: [] });
};

const deleteBranch = (index: number) => {
  sizeForm.branches.splice(index, 1);
};
</script>

<template>
  <div>
    <el-form ref="form" :model="sizeForm" label-width="auto" label-position="left">
      <div class="deliveryDesc">
        客户将流量分配比例随机进入任一分支，流量总和为100%。如果同一个客户多次进入该流程，每次都默认分配到同一个组内。
      </div>
      <el-form-item label="分流器名称：">
        <el-input v-model="sizeForm.nodeName" placeholder="填写名称" style="width: 400px" />
      </el-form-item>

      <div class="blockbg">
        <div class="title_set bg001">
          分支流量
        </div>
        <div class="underbg">
          <el-row :gutter="20">
            <el-col :span="14">分支名称</el-col>
            <el-col :span="10">流量分配（剩余<span style="color:#00C068;font-weight:500;">{{ 100 - +totalRatio
            }}%</span>）</el-col>
          </el-row>
          <el-row :gutter="20" style="    align-items: center;
          margin-top: 16px;" v-for="(branch, index) in sizeForm.branches" :key="index">
            <el-col :span="12">
              <el-input v-model="branch.nodeName" />
            </el-col>
            <el-col :span="7">
              <el-input-number :min="0" :max="100 - +totalRatio + branch.ratio" placeholder="百分比"
                v-model="branch.ratio" />
            </el-col>
            <el-col :span="5">
              <el-text v-if="index > 1" type="primary" style="cursor: pointer;" @click="deleteBranch(index)">
                <el-icon size="14">
                  <Delete />
                </el-icon>
                删除
              </el-text>
            </el-col>
          </el-row>

          <el-row :gutter="20" style="    align-items: center;
          margin-top: 16px;padding: 0 12px;">
            <el-text type="primary" style="cursor: pointer;" @click="addBranch">
              <el-icon size="14">
                <CirclePlusFilled />
              </el-icon>
              添加分支
            </el-text>
          </el-row>
        </div>
      </div>
    </el-form>
  </div>
</template>

<style scoped lang="scss">
.deliveryDesc {
  font-size: 14px;
  font-family: PingFang SC, PingFang SC;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.9);
  line-height: 22px;
  padding: 12px 2px;
}

.filter-filter-item__add {
  position: absolute;
  right: 12px;
}

:deep(.el-form-item) {
  margin-right: 0;
  margin-bottom: 0;
}

.blockbg {
  font-size: 14px;
  border-radius: var(--el-border-radius-base);
  margin-top: 24px;

  .title_set {
    padding: 8px 12px;
    background: #eaeff3;
    border-left: 4px solid #62c943;
    display: flex;
    justify-content: space-between;
  }

  .bg001 {
    border-left: 4px solid #333;
  }

  .pg2 {
    border-left: 4px solid #a053cd;
  }

  .pg3 {
    border-left: 4px solid #277ae7;
  }

  .underbg {
    padding: 12px;
    padding-right: 20%;

    background: #f7f8fa;
  }
}

.grayblock {
  //width: 120px;
  background: #ffffff;
  border-radius: 4px 4px 4px 4px;
  //margin-right: 12px;
  display: flex;
  align-items: center;
  min-height: 48px;

  .innerblock {
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    padding: 20px;
  }

  .innerblock:last-child {
    /* 样式属性 */
    border-right: none;
  }

  .topName {
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.6);
    margin-bottom: 8px;
  }
}
</style>
