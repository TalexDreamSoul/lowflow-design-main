<script setup lang="ts">
import { inject, ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import BehaviorFoldingGroup from "~/components/BehaviorFoldingGroup/index.vue";

const labelPosition = ref("single");
const origin = {
  type: "PolicySettings",
  name: "test",
  value1: false,
  selectedType: "",
  num: 1,
}
const sizeForm = reactive<typeof origin>(origin);

function reset() {
  Object.assign(sizeForm, origin)
}

onMounted(reset)

const logicalOperator = ref("and");

const props = defineProps<{
  p: any
}>();

function toggleLogicalOperator() {

}

function saveData() {
  if (!sizeForm.name) {
    ElMessage.warning({
      message: "请输入策略名称"
    })

    return false
  }

  if (!props.p.children) {
    props.p.children = [{ ...sizeForm }]
  } else {
    const arr = [ ...props.p.children ]

    while ( arr.length ) {
      const item = arr.shift()

      if (item.name === sizeForm.name) {
        ElMessage.warning({
          message: "策略名称重复"
        });

        return false
      }

      if ( item.children )
        arr.push(...item.children)
    }

    props.p.children.push({ ...sizeForm })
  }

  return true
}

type IRegSaveFunc = (regFunc: () => boolean) => void
const regSaveFunc: IRegSaveFunc = inject('save')!
regSaveFunc(saveData)
</script>

<template>
  <div>
    <el-form ref="form" :model="sizeForm" label-width="auto" label-position="left">

      <el-form-item label="选择策略器名称：">
        <el-input v-model="sizeForm.name" placeholder="填写名称" />

      </el-form-item>
      <el-form-item label="分流类型：">
        <el-radio-group v-model="labelPosition">
          <el-radio label="single">不分流</el-radio>
          <el-radio label="Repeat">按属性用户行为分流</el-radio>
          <el-radio label="type">按触发事件分流</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-collapse accordion>

        <el-collapse-item title="用户属性行为分流" name="4" v-if="labelPosition === 'Repeat'">
          <div>
            进入该期策略的用户需要满足以下条件：
          </div>
          <el-form-item label="">

            <div class="pannel">
              <div class="filter-container">
                <div class="logical-operator">
                  <div class="logical-operator__line"></div>
                  <div class="custom-switch" :class="{ active: logicalOperator === 'and' }"
                    @click="toggleLogicalOperator">
                    {{ logicalOperator === 'and' ? '且' : '或' }}
                  </div>
                  <!-- <el-switch v-model="logicalOperator" inline-prompt style="--el-switch-on-color: #409EFF; --el-switch-off-color: #67C23A" active-value="and" inactive-value="or" active-text="且" inactive-text="或" /> -->
                </div>
                <div class="filter-option-content">

                  <el-collapse>
                    <el-collapse-item title=" 客户属性满足" class="custom-collapse-item">
                      <!-- <BehaviorFoldingGroup v-model="node.conditions" :filter-fields="fields" /> -->

                    </el-collapse-item>
                    <el-collapse-item title=" 客户行为满足" class="custom-collapse-item">
                      <!-- <BehaviorFoldingGroup v-model="node.conditions" :filter-fields="fields" /> -->

                    </el-collapse-item>

                    <el-collapse-item title=" 行为序列满足" class="custom-collapse-item">
                      <!-- <BehaviorFoldingGroup v-model="node.conditions" :filter-fields="fields" /> -->

                    </el-collapse-item>
                  </el-collapse>
                </div>

              </div>

            </div>
          </el-form-item>
        </el-collapse-item>

        <el-collapse-item title="按触发事件分流" name="5" v-if="labelPosition === 'type'">
          <div class="flex-column">
            <div>
              进入该器策略的客户需要满足以下条件：在&nbsp;&nbsp;
            </div>
            <el-input-number v-model="sizeForm.num" :min="1" :max="10" />
            <el-select v-model="sizeForm.selectedType" placeholder="请选择" style="width: 100px">
              <el-option value="month" label="月份">分钟</el-option>
              <el-option value="week" label="周">小时</el-option>
              <el-option value="day" label="天">天</el-option>
            </el-select>
            <div>后判断客户
              <el-select v-model="sizeForm.selectedType" placeholder="请选择" style="width: 100px">
                <el-option value="month" label="月份">本人</el-option>
                <el-option value="week" label="周">小时</el-option>
                <el-option value="day" label="天">天</el-option>
              </el-select>
            </div>

          </div>
          <div>
            <!-- <BehaviorFoldingGroup v-model="node.conditions" :filter-fields="fields" /> -->
          </div>
        </el-collapse-item>

        <el-collapse-item name="1">
          <template #title>
            <el-icon class="header-icon">
              <info-filled />
            </el-icon>
            延迟设置

          </template>
          <div>
            <div class="flex-column">

              <el-select v-model="sizeForm.selectedType" placeholder="请选择" style="width: 100px">
                <el-option value="month" label="月份">延迟</el-option>
                <el-option value="week" label="周">小时</el-option>
                <el-option value="day" label="天">天</el-option>
              </el-select>
              <el-input-number v-model="sizeForm.num" :min="1" :max="10" />
              <el-select v-model="sizeForm.selectedType" placeholder="请选择" style="width: 100px">
                <el-option value="month" label="月份">分钟</el-option>
                <el-option value="week" label="周">小时</el-option>
                <el-option value="day" label="天">天</el-option>
              </el-select>
              <div>针对符合该装置策略条件的客户

                <el-select v-model="sizeForm.selectedType" placeholder="请选择" style="width: 100px">
                  <el-option value="month" label="月份">发送触达并打上标签</el-option>
                  <el-option value="week" label="周">小时</el-option>
                  <el-option value="day" label="天">天</el-option>
                </el-select>
              </div>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="触达设置" name="2">
          <el-form-item label="触达通道：">
            <el-col :span="12">
              <el-select v-model="sizeForm.selectedType" placeholder="请选择" style="width: 100px">
                <el-option value="month" label="月份">发送触达并打上标签</el-option>
                <el-option value="week" label="周">小时</el-option>
                <el-option value="day" label="天">天</el-option>
              </el-select>
            </el-col>

          </el-form-item>

          <el-form-item label="选择模版：">
            <el-select v-model="sizeForm.selectedType" placeholder="请选择" style="width: 100px">
              <el-option value="month" label="月份">发送触达并打上标签</el-option>
              <el-option value="week" label="周">小时</el-option>
              <el-option value="day" label="天">天</el-option>
            </el-select><el-button type="primary">新增短信模块版本</el-button>
          </el-form-item>

          <el-form-item label="触达内容：">
            <div>定制组件位置</div>
          </el-form-item>

        </el-collapse-item>
        <el-collapse-item title="标签设置" name="3">

          <div class="flex-column">
            <div>
              符合该设备策略条件的用户打上&nbsp;&nbsp;
            </div>
            <el-select v-model="sizeForm.selectedType" placeholder="标签名称" style="width: 100px">
              <el-option value="month" label="月份">分钟</el-option>
              <el-option value="week" label="周">小时</el-option>
              <el-option value="day" label="天">天</el-option>
            </el-select>
            <div>
              标签
            </div>
          </div>
          <div>
            股票触达客户
          </div>
          <el-form-item label="列表触达客户总数：">
            <div>111定制组件位置</div>
          </el-form-item>
          <el-form-item label="策略器目标设置:">
            <el-switch v-model="sizeForm.value1" />
          </el-form-item>
        </el-collapse-item>

      </el-collapse>
    </el-form>
  </div>
</template>

<style scoped lang="scss">
.flex-column {
  display: -webkit-inline-box !important;
  align-items: flex-start !important;
  flex-direction: column !important;
}

.pannel {
  width: 100%;
  min-height: 200px;
  padding: 18px 15px;
  background-color: #f5f8fc;
}

.underright {
  width: 100%;
  height: 12px;
}

.filter-filter-item__add {
  position: absolute;
  right: 12px;
}

.flex-column {
  display: -webkit-inline-box !important;
  align-items: flex-start !important;
  flex-direction: column !important;
}

.pannel {
  width: 100%;
  min-height: 200px;
  padding: 18px 15px;
}

.underright {
  width: 100%;
  height: 12px;
}

.filter-filter-item__add {
  position: absolute;
  right: 12px;
}

:deep(.el-form-item) {
  margin-right: 0;
  margin-bottom: 0;
}

.el-collapse {
  border: none !important;
}

.custom-collapse-item .el-collapse-item__header {
  border-bottom: none !important;
  background-color: #f5f8fc !important;
}

.filter-container {
  border-radius: 3px;
  display: flex;

  .logical-operator {
    position: relative;
    display: flex;
    align-items: center;
    overflow: hidden;
    min-width: 60px;
    padding-right: 5px;

    .logical-operator__line {
      position: absolute;
      left: calc(22% - 1px);
      border-width: 1px 0 1px 1px;
      border-top-style: solid;
      border-bottom-style: solid;
      border-left-style: solid;
      border-left-color: #4078e0;
      border-image: initial;
      border-right-style: initial;
      border-right-color: initial;
      border-radius: 5px 0 0 5px;
      height: calc(100% - 22px);
    }
  }

  .filter-option-content {
    position: relative;
    width: 100%;

    .filter-item-rule {
      display: flex;
      align-items: center;
      min-height: 48px;
    }

    .filter-filter-item__add {
      border-style: dashed;
      width: 100%;
    }
  }

  .custom-switch {
    border: 1px solid #4078e0;
    color: #fff;
    width: 24px;
    height: 24px;
    background: #fff;
    font-weight: 500;
    color: #4078e0;
    font-size: 14px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 1;
  }
}
</style>
